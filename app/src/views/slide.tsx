import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../assets/configs/config.json";
import { task } from "../assets/configs/task.json";

import White from "../assets/slides/white.jpg";
import Button from "../components/button";
import Checkbox from "../components/checkbox";
import VASSlide from "../components/slide-vas";
import TaskViewport from "../components/task-viewport";
import { SurveyData } from "../store/data-slice";
import useTaskStore from "../store/store";
import {
  CONSTANT_PRESSING_SOUND,
  KEY_SPACE,
  MEMORY_ALL_CORRECT_SOUND,
  MEMORY_CORRECT_SOUND,
  MEMORY_WRONG_SOUND,
  SOUND_PATH,
} from "../util/constants";
import {
  exportCsv,
  getImagePath,
  printObjectMatrix,
  unique,
} from "../util/functions";
import OnlineShop from "./online-shop";

const quickNext = false;

export type SlideJson = {
  type?: string;
  slidePath?: string;
  index?: number;
  variableName?: string;
  minLabel?: string;
  maxLabel?: string;
  showIf?: string;
  keyPress?: string;
  delay?: number;
  setPhase?: string;
  setPhaseNumber?: number;
  setBlock?: string;
  setBlockNumber?: number;
  numTrials?: number;
  probabilityOutcomeNoAction?: number;
  playSound?: string;
  progress?: number;
};

export interface Slide {
  execute?: () => void;
  slide?: string;
  children?: React.ReactNode;
}

const SlideShow: React.FC<{ slideMapping: Record<string, string> }> = ({
  slideMapping,
}) => {
  const store = useTaskStore();
  const navigate = useNavigate();

  const hasPlayedRef = useRef(false);

  const [buttonVisible, setButtonVisibleRaw] = useState(true);
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);

  const setButtonVisible = (state: boolean) => {
    setButtonVisibleRaw(state);
  };

  const { slideNumberRaw, trialNumberRaw } = useParams<{
    slideNumberRaw: string;
    trialName?: string;
    trialNumberRaw?: string;
  }>();

  const slideNumber = parseInt(slideNumberRaw ?? "1");
  const trialNumber = trialNumberRaw ? parseInt(trialNumberRaw) : 1;

  useEffect(() => {
    if (store.slideNumber !== slideNumber) {
      store.setSlideNumber(slideNumber);
    }
    if (store.trialNumber !== trialNumber) {
      store.setTrialNumber(trialNumber);
    }
  }, [slideNumber, trialNumber, store]);

  const timeoutIdRef = useRef<number | null>(null);
  const keyPressHandlerRef = useRef<((event: KeyboardEvent) => void) | null>(
    null
  );
  const navKeyPressHandlerRef = useRef<((event: KeyboardEvent) => void) | null>(
    null
  );
  const nastyKeyPressHandlerRef = useRef<
    ((event: KeyboardEvent) => void) | null
  >(null);
  const nastyKeyLiftHandlerRef = useRef<
    ((event: KeyboardEvent) => void) | null
  >(null);

  const clearListeners = () => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (keyPressHandlerRef.current)
      window.removeEventListener("keydown", keyPressHandlerRef.current);
  };

  const changeSlideIndex = (newSlideNumber: number) => {
    clearListeners();
    console.log("Navigating to slide", `/slide/${newSlideNumber}/1`);
    navigate(`/slide/${newSlideNumber}/1`);
  };

  const incrementSlideIndex = () => changeSlideIndex(store.slideNumber + 1);

  const decrementSlideIndex = () => changeSlideIndex(store.slideNumber - 1);

  const incrementTrialIndex = (maxTrial: number) => {
    if (store.trialNumber === maxTrial) incrementSlideIndex();
    else navigate(`/slide/${store.slideNumber}/${store.trialNumber + 1}`);
  };

  const waitTimeout = (
    lowerBound: number,
    upperBound?: number,
    customFunction?: () => void
  ) => {
    const timeout = upperBound
      ? lowerBound + Math.random() * (upperBound - lowerBound)
      : lowerBound;

    timeoutIdRef.current = window.setTimeout(() => {
      (customFunction ? customFunction : incrementSlideIndex)();
      timeoutIdRef.current = null;
    }, timeout);
  };

  // listener that sets a variable true if space is pressed down, and false if it is released
  const [initialPress, setInitialPress] = useState(true);
  const initNastySound = () => {
    let spaceHeldTimeout: NodeJS.Timeout | undefined;

    if (nastyKeyPressHandlerRef.current || nastyKeyLiftHandlerRef.current)
      return;
    console.log("Init nasty sound");

    nastyKeyPressHandlerRef.current = (event: KeyboardEvent) => {
      if (event.key === KEY_SPACE && spaceHeldTimeout === undefined) {
        setTimeout(() => {
          setInitialPress(false);
        }, 0);

        if (!spaceHeldTimeout) {
          spaceHeldTimeout = setTimeout(() => {
            console.log("Nasty sound");
            CONSTANT_PRESSING_SOUND.play();
          }, 3000);
        }
      }
    };

    nastyKeyLiftHandlerRef.current = (event: KeyboardEvent) => {
      if (event.key === KEY_SPACE) {
        setTimeout(() => {
          setInitialPress(true);
          console.log("Key up");
          clearTimeout(spaceHeldTimeout);
          spaceHeldTimeout = undefined;

          CONSTANT_PRESSING_SOUND.pause();
        }, 0);
      }
    };

    window.addEventListener("keydown", nastyKeyPressHandlerRef.current);
    window.addEventListener("keyup", nastyKeyLiftHandlerRef.current);
  };

  const waitKeyPress = (key?: string, customFunction?: () => void) => {
    keyPressHandlerRef.current = (event: KeyboardEvent) => {
      if (
        (!key || key === "any" || event.key === key) &&
        !(event.target instanceof HTMLButtonElement)
      ) {
        if (initialPress) {
          (customFunction ? customFunction : incrementSlideIndex)();
        }
      }
    };

    window.addEventListener("keydown", keyPressHandlerRef.current);
  };

  const drugCravingSlide = (stage: "pre" | "post" | "post2") => {
    const drugs = unique([
      ...store.getDrugsNow(),
      ...store.selectableDrugsPurchased,
    ]);
    console.log("Drugs", drugs);

    if (drugs.length === 0) return { execute: () => incrementSlideIndex() };
    const drug = drugs[store.trialNumber - 1];
    return {
      slide: `vasslide.jpg`,
      children: (
        <VASSlide
          key={drug}
          text={`How much do you want to ${
            drug === "Alcohol" ? "drink" : "use"
          } ${drug === "LSD" ? "LSD" : drug.toLowerCase()} right now?`}
          minLabel="not at all"
          maxLabel="very much"
          setValue={(value: number) => {
            store.setDrugCraving(drug, value);
            store.logAction({ [`VAS_${drug}_${stage}`]: value });
            waitTimeout(1000, 1000, () => {
              incrementTrialIndex(drugs.length);
            });
          }}
        />
      ),
      execute: () => setButtonVisible(false),
    };
  };

  const contingencySlide = () => {
    try {
      store.contingencyOrder[store.block - 1][store.trialNumber - 1];
    } catch (e) {
      console.error("Error in contingency slide", e);
      console.log("Index Error:", store.block - 1, store.trialNumber - 1);
      console.log(
        "Index Error Matrix:",
        printObjectMatrix(store.contingencyOrder)
      );
      console.log("Index Error:", store.block - 1, store.trialNumber - 1);
    }

    const trialInfo =
      store.contingencyOrder[store.block - 1][store.trialNumber - 1];

    const isSelfItem = trialInfo.color === store.colorMapping.self;
    const item = isSelfItem
      ? store.selfItems[
          (store.block - 1) * config.experimentConfig.numberOfTrials +
            store.trialNumber -
            1
        ]
      : store.otherItems[
          (store.block - 1) * config.experimentConfig.numberOfTrials +
            store.trialNumber -
            1
        ];

    store.setOutcomeImage(getImagePath(item?.category, item?.image_name));

    switch (store.trialPhase) {
      case "prepare":
        return {
          slide: `phase2/trial/slide1.jpg`,
          execute: () => {
            store.setShowImage(false);

            setButtonVisible(quickNext ? true : false);
            clearListeners();
            waitTimeout(
              config.experimentConfig.slideTimings.offLightbulb.minValue,
              config.experimentConfig.slideTimings.offLightbulb.maxValue,
              store.nextTrialPhase
            );
          },
        };
      case "react":
        return {
          slide:
            trialInfo.color === "orange"
              ? "phase2/trial/slide2.jpg"
              : "phase2/trial/slide3.jpg",
          execute: () => {
            clearListeners();
            const startTime = performance.now();

            waitKeyPress(KEY_SPACE, () => {
              store.setReactionTime(Math.round(performance.now() - startTime));
              store.nextTrialPhase();
            });
            waitTimeout(
              config.experimentConfig.slideTimings.coloredLightbulb.minValue,
              config.experimentConfig.slideTimings.coloredLightbulb.maxValue,
              () => {
                store.nextTrialPhase();
                store.setReactionTime(-1);
              }
            );
          },
        };
      case "outcome":
        const positiveOutcome =
          (trialInfo.spacePressedCorrect && store.reactionTime !== -1) ||
          (trialInfo.noSpacePressedCorrect && store.reactionTime === -1);

        store.setShowImage(positiveOutcome);

        store.logExperimentAction({
          cue: trialInfo.color,
          stimuli_type: isSelfItem ? "self" : "other",
          outcome: positiveOutcome ? "TRUE" : "FALSE",
          response: store.reactionTime !== -1 ? "TRUE" : "FALSE",
          item: item?.image_name ?? "none",
          category: item?.category ?? "none",
          RT: store.reactionTime,
        });

        if (positiveOutcome) {
          if (isSelfItem) {
            if (store.bidsSelf < store.trolley.length) {
              store.incrementBidsSelf();
            }
          } else {
            if (
              trialNumber % 3 === 0 &&
              store.bidsOther < store.trolley.length * 1.2
            ) {
              store.incrementBidsOther();
            }
          }
        }

        return positiveOutcome
          ? {
              slide: `phase2/trial/slide4.jpg`,
              execute: () => {
                clearListeners();
                waitTimeout(
                  config.experimentConfig.slideTimings.receiveItem.minValue,
                  config.experimentConfig.slideTimings.receiveItem.maxValue,
                  () => {
                    store.nextTrialPhase();
                    incrementTrialIndex(config.experimentConfig.numberOfTrials);
                    store.setReactionTime(-1);
                  }
                );
              },
            }
          : {
              slide: `phase2/trial/slide1.jpg`,
              execute: () => {
                clearListeners();
                waitTimeout(
                  config.experimentConfig.slideTimings.offLightbulbNoItem
                    .minValue,
                  config.experimentConfig.slideTimings.offLightbulbNoItem
                    .maxValue,
                  () => {
                    store.nextTrialPhase();
                    incrementTrialIndex(config.experimentConfig.numberOfTrials);
                    store.setReactionTime(-1);
                  }
                );
              },
            };
    }
  };

  const quizSlide = () => ({
    slide: `instructionsPhase3/slide4.jpg`,
    children: (
      <div
        key={`column1234`}
        className="text-[0.7em] mt-[6.5em] w-[95%] pl-2.5 grid grid-cols-4 gap-0"
      >
        {config.memoryQuestionConfig.map((person, index) => (
          <div
            key={`checkbox-${index}`}
            className="bg-white w-[80%] ml-[0.3em]"
          >
            <Checkbox
              gap="0.9em"
              key={`column${index}`}
              initialOptions={person.options}
              columnLayout="single"
              allowMultiple={false}
              onChange={(itemsSelected) => {
                if (itemsSelected[0] === person.correct) {
                  MEMORY_CORRECT_SOUND.play();
                  store.quizAddCorrectPersonUnique(
                    person.person,
                    (quizCorrectPersons) => {
                      if (
                        quizCorrectPersons.length ===
                        config.memoryQuestionConfig.length
                      ) {
                        waitTimeout(1500, 1500, () =>
                          MEMORY_ALL_CORRECT_SOUND.play()
                        );
                        waitTimeout(4500);
                      }
                    }
                  );
                } else {
                  store.logAction({ [`Quiz_wrong`]: 1 });
                  MEMORY_WRONG_SOUND.play();
                }
              }}
              disableOnClick={store.quizCorrectPersons.includes(person.person)}
            />
          </div>
        ))}
      </div>
    ),
    execute: () => setButtonVisible(false),
  });

  const checkboxShopping = (slidePath: string) => {
    return {
      slide: slidePath,
      children: (
        <div className="mt-[3em] bg-white w-full pl-6 flex justify-center">
          <Checkbox
            key="online-shopping"
            initialOptions={config.options.shoppingFrequency}
            onChange={(value) => {
              store.setSurveyResponse("onlineShoppingFrequency", value[0]);
              store.logAction({
                Frequency_online_shopping: value[0],
              });
              waitTimeout(1000);
            }}
            disableOnClick={true}
          />
        </div>
      ),
      execute: () => setButtonVisible(false),
    };
  };

  const checkboxDrugs = (slidePath: string) => ({
    slide: slidePath,
    children: (
      <div className="mt-[2em] w-full pl-6 flex justify-center text-lg">
        <div className="bg-white">
          <Checkbox
            key="drugs"
            gap="0.7em"
            initialOptions={config.options.drugScreening.drugs}
            exclusiveOptions={[config.options.drugScreening.none]}
            allowMultiple={true}
            columnLayout="double"
            onChange={(values) => {
              store.setSurveyResponse("drugs", values);
              store.setSurveyResponse(
                "craving",
                values.length > 0 ? "True" : "False"
              );

              // index for each drugScreening drugs & other, one if in values, otherwise 0
              values.length === 0
                ? setButtonVisible(false)
                : setButtonVisible(true);
            }}
          />
        </div>
      </div>
    ),
  });

  const checkboxBulb = (
    slidePath: string,
    index: number,
    variableName: string
  ) => {
    return {
      slide: slidePath,
      children: (
        <div className="pt-[3.6em] pl-[0.6em]">
          <Checkbox
            key={`${slidePath.slice(-3, -1)}_${index}`}
            initialOptions={["blue", "orange"]}
            columnLayout="double"
            allowMultiple={false}
            onChange={(value) => {
              store.logAction({ [variableName]: value });
              waitTimeout(1000);
            }}
            gap={"2.1em"}
            disableOnClick={true}
            hideLabel={true}
          />
        </div>
      ),
      execute: () => setButtonVisible(false),
    };
  };

  const interSlideTime = (slidePath: string) => {
    const timeout = config.shop.general.alarmBellDuration;
    return {
      slide: slidePath,
      execute: () =>
        waitTimeout(timeout, timeout, () => store.setTrialIndex(1)),
    };
  };

  const interSlideBudget = (slidePath: string) => {
    return {
      slide: slidePath,
      //button "Continuge Shopping" with same style as next, and navigates to same slide but trial /1
      children: (
        <Button
          className="absolute cursor-pointer p-0 bottom-[2em] text-base"
          onClick={() => store.setTrialIndex(1)}
        >
          Continue Shopping
        </Button>
      ),
      execute: () => setButtonVisible(false),
    };
  };

  const bidSummarySlide = (slidePath: string) => {
    return {
      slide: slidePath,
      children: (
        <div className="w-full h-full">
          {/* the text field has a fixed width of three digets, and the number is always centered */}
          <div className="absolute top-0 left-0 mt-[9em] ml-[11.15em] text-[0.9em] w-[2em] text-center">
            {store.bidsSelf}
          </div>
          <div className="absolute top-0 left-0 mt-[10.15em] ml-[3.8em] text-[0.9em] w-[2em] text-center">
            {store.bidsOther}
          </div>
        </div>
      ),
      execute: () => setButtonVisible(true),
    };
  };

  const vas = (
    slidePath: string,
    variableName: string,
    minLabel: string,
    maxLabel: string
  ) => {
    return {
      slide: slidePath,
      children: (
        <VASSlide
          key={variableName}
          minLabel={minLabel}
          maxLabel={maxLabel}
          setValue={(value) => {
            store.setSurveyResponse(variableName, value);
            store.logAction({ [variableName]: value });
            waitTimeout(1000);
          }}
          text={``}
        />
      ),
      execute: () => setButtonVisible(false),
    };
  };

  const renderSlide: () => Slide = () => {
    if (navKeyPressHandlerRef.current) {
      window.removeEventListener("keydown", navKeyPressHandlerRef.current);
    }
    navKeyPressHandlerRef.current = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "b") {
        event.preventDefault();
        decrementSlideIndex();
      }
      if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        incrementSlideIndex();
      }
    };

    window.addEventListener("keydown", navKeyPressHandlerRef.current);

    if (!store.slideNumber) return { slide: "white.jpg" };
    const currentSlideJson =
      typeof task[store.slideNumber - 1] === "string"
        ? ({ slidePath: task[store.slideNumber - 1] } as unknown as SlideJson)
        : (task[store.slideNumber - 1] as SlideJson);

    const isCustomSlide = currentSlideJson.type !== undefined;

    const showIf = (expression: string) => {
      const evaluateCondition = (condition: string) => {
        const splitter = condition.includes("!=") ? "!=" : "=";
        const [group, value] = condition.split(splitter) as [
          keyof SurveyData,
          string
        ];

        switch (splitter) {
          case "=":
            return store.data.survey[group] === value;
          case "!=":
            return store.data.survey[group] !== value;
        }
      };

      const conditions = expression.split(/(&|\|)/).map((part) => part.trim());
      let result = evaluateCondition(conditions[0]);

      for (let i = 1; i < conditions.length; i += 2) {
        const operator = conditions[i];
        const nextCondition = evaluateCondition(conditions[i + 1]);

        if (operator === "&") {
          result = result && nextCondition;
        } else if (operator === "|") {
          result = result || nextCondition;
        }
      }

      if (!result) incrementSlideIndex();
    };

    const renderSlideString = (slidePath: string) =>
      slidePath.replace(/{(\w+)}/g, (_, group) => {
        const result = store.data.survey[group as keyof SurveyData];
        if (typeof result === "string") {
          return result;
        } else {
          return "";
        }
      });

    const getExecuteFunction = () => {
      setButtonVisible(true);
      if ("keyPress" in currentSlideJson) {
        waitKeyPress(currentSlideJson.keyPress!);
        setButtonVisible(false);
      }
      if ("delay" in currentSlideJson) {
        waitTimeout(currentSlideJson.delay!);
        setButtonVisible(false);
      }
    };

    if (currentSlideJson.showIf) showIf(currentSlideJson.showIf!);

    const slidePath = currentSlideJson.slidePath
      ? renderSlideString(currentSlideJson.slidePath!)
      : "";

    if (currentSlideJson.setPhase)
      store.setPhase(
        currentSlideJson.setPhase,
        currentSlideJson.setPhaseNumber!
      );
    if (currentSlideJson.setBlock) {
      store.setBlock(
        currentSlideJson.setBlock,
        currentSlideJson.setBlockNumber!
      );
    }

    if (currentSlideJson.playSound && !hasPlayedRef.current) {
      new Audio(`${SOUND_PATH}${currentSlideJson.playSound}`).play();
      hasPlayedRef.current = true;
    }

    if (isCustomSlide) {
      if (
        ["onlineShop", "onlineShopControl", "contingency"].includes(
          currentSlideJson.type ?? ""
        ) &&
        config.dev.slidesOnly
      ) {
        return { execute: () => incrementSlideIndex() };
      } else {
        switch (currentSlideJson.type) {
          case "VAS":
            return vas(
              slidePath,
              currentSlideJson.variableName!,
              currentSlideJson.minLabel!,
              currentSlideJson.maxLabel!
            );
          case "checkboxShopping":
            return checkboxShopping(slidePath);
          case "checkboxDrugs":
            return checkboxDrugs(slidePath);
          case "checkboxBulb":
            return checkboxBulb(
              slidePath,
              store.slideNumber,
              currentSlideJson.variableName!
            );
          case "bidSummarySlide":
            return bidSummarySlide(slidePath);
          case "drugCravingPre":
            return drugCravingSlide("pre");
          case "drugCravingPost":
            store.generateSelfOtherSequence();
            return drugCravingSlide("post");
          case "drugCravingPost2":
            return drugCravingSlide("post2");
          case "contingency":
            initNastySound();
            return contingencySlide();
          case "quiz":
            return quizSlide();
          case "onlineShop":
            if (store.trialNumber === 2) {
              return interSlideTime("phase1_and_3/slide1.jpg");
            }
            if (store.trialNumber === 3) {
              return interSlideBudget("phase1_and_3/slide2.jpg");
            }
            return {
              slide: "white.jpg",
              children: <OnlineShop></OnlineShop>,
              execute: () => setButtonVisible(quickNext ? true : false),
            };
          case "prepareOnlineShopControl":
            store.switchToPhase3();
            store.resetTrolley();
            store.setTime(config.shop.general.time.phase3);
            return {
              slide: slidePath,
              execute: getExecuteFunction,
            };
          case "onlineShopControl":
            if (store.trialNumber === 2) {
              return interSlideTime("phase1_and_3/slide1.jpg");
            }
            if (store.trialNumber === 3) {
              return interSlideBudget("phase1_and_3/slide2.jpg");
            }
            return {
              slide: "white.jpg",
              children: <OnlineShop></OnlineShop>,
              execute: () => setButtonVisible(quickNext ? true : false),
            };
          case "exportData":
            exportCsv(store, currentSlideJson.variableName!);
            incrementSlideIndex();
            return { slide: "white.jpg" };
          case "set":
            incrementSlideIndex();
            return { slide: "white.jpg" };
          default:
            console.error("Unknown slide type", currentSlideJson.type);
            setButtonVisible(false);
            return { slide: slidePath };
        }
      }
    } else {
      return {
        slide: slidePath,
        execute: getExecuteFunction,
      };
    }
  };

  useEffect(() => {
    const slide = renderSlide();

    if (slide.execute) slide.execute();
    if (slide.slide) setCurrentSlide(slide);

    return () => {
      clearListeners();
      hasPlayedRef.current = false;
    };
  }, [store.slideNumber, store.trialNumber, store.trialPhase]);

  // listener for moving forward and backward one slide, using ctrl+b for back and ctrl+f for forward
  useEffect(() => {
    store.initializeStoreNavigate(navigate);
  }, []);

  return (
    <div>
      <TaskViewport
        backgroundImage={
          currentSlide ? slideMapping[currentSlide.slide!] : White
        }
        verticalAlign={true}
      >
        <div
          className={classNames(
            "w-full h-full flex justify-center items-center pb-[3em] text-shadow-lg",
            store.showImage ? "block" : "hidden"
          )}
        >
          <div>
            <img
              className="max-h-[5em] max-w-[5em]"
              src={store.outcomeImage}
            ></img>
          </div>
        </div>
        {currentSlide?.children}
        <Button
          className="absolute cursor-pointer p-0 bottom-[1em] right-[1em] text-base"
          onClick={incrementSlideIndex}
          visible={buttonVisible}
        >
          Next
        </Button>
      </TaskViewport>
    </div>
  );
};

export default SlideShow;
