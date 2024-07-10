import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../assets/configs/config.json";
import { task } from "../assets/configs/task.json";
import Button from "../components/button";
import Checkbox from "../components/checkbox";
import VASSlide from "../components/slide-vas";
import TaskViewport from "../components/task-viewport";
import { SurveyData } from "../store/data-slice";
import useTaskStore from "../store/store";
import {
  KEY_SPACE,
  MEMORY_ALL_CORRECT_SOUND,
  MEMORY_CORRECT_SOUND,
  MEMORY_WRONG_SOUND,
  SLIDE_PATH,
} from "../util/constants";
import { getImagePath, preloadImage } from "../util/preload";
import OnlineShop from "./online-shop";

type SlideJson = {
  type: string;
  slidePath?: string;
  index?: number;
  variableName?: string;
  minLabel?: string;
  maxLabel?: string;
  showIf?: string;
  keyPress?: string;
  delay?: number;
};

export interface Slide {
  execute?: () => void;
  slide?: string;
  children?: React.ReactNode;
}
const useSlideHandlers = (slideNumber: number, trialNumber: number) => {
  const store = useTaskStore();
  const navigate = useNavigate();
  const timeoutIdRef = useRef<number | null>(null);
  const keyPressHandlerRef = useRef<((event: KeyboardEvent) => void) | null>(
    null
  );

  const clearListeners = () => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (keyPressHandlerRef.current)
      window.removeEventListener("keydown", keyPressHandlerRef.current);
  };

  const changeSlideIndex = (newSlideNumber: number) => {
    clearListeners();
    navigate(`/slide/${newSlideNumber}/1`);
  };

  const incrementSlideIndex = () => {
    if (store.slide) {
      navigate(`/slide/${slideNumber + 1}/1`);
    }
    changeSlideIndex(slideNumber + 1);
  };

  const incrementTrialIndex = (maxTrial: number) => {
    if (store.slide) {
      navigate(`/slide/${slideNumber}/${trialNumber + 1}`);
    }
    if (trialNumber === maxTrial) incrementSlideIndex();
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

  const waitKeyPress = (key?: string, customFunction?: () => void) => {
    keyPressHandlerRef.current = (event: KeyboardEvent) => {
      if (
        (!key || key === "any" || event.key === key) &&
        !(event.target instanceof HTMLButtonElement)
      ) {
        (customFunction ? customFunction : incrementSlideIndex)();
      }
    };

    window.addEventListener("keydown", keyPressHandlerRef.current, {
      once: true,
    });
  };

  return {
    clearListeners,
    changeSlideIndex,
    incrementTrialIndex,
    waitTimeout,
    waitKeyPress,
  };
};

const SlideShow: React.FC = () => {
  const store = useTaskStore();
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

  if (store.slide !== slideNumber) store.setSlide(slideNumber);

  const {
    clearListeners,
    changeSlideIndex,
    incrementTrialIndex,
    waitTimeout,
    waitKeyPress,
  } = useSlideHandlers(slideNumber, trialNumber);

  const incrementSlideIndex = () => changeSlideIndex(slideNumber + 1);
  const decrementSlideIndex = () => changeSlideIndex(slideNumber - 1);

  const drugCravingSlide = (stage: "pre" | "post") => {
    const drugs = store.getDrugsNow();
    if (drugs.length === 0) return { execute: () => incrementSlideIndex() };
    const drug = drugs[trialNumber - 1];
    return {
      slide: `VasSlide.JPG`,
      children: (
        <VASSlide
          key={drug}
          text={`How much do you want to use ${
            drug === "LSD" ? "LSD" : drug.toLowerCase()
          } right now?`}
          minLabel="not at all"
          maxLabel="very much"
          setValue={(value: number) => {
            store.setDrugCraving(drug, value);
            store.logSurveyResponse({ [`VAS_${drug}_${stage}`]: value });
            waitTimeout(1000, 1000, () => {
              incrementTrialIndex(drugs.length);
            });
          }}
        />
      ),
      execute: () => setButtonVisible(false),
    };
  };

  const contingencySlide = (block: number) => {
    const trialInfo = store.contingencyOrder[block][trialNumber - 1];
    const isSelfItem = trialInfo.color === store.colorMapping.self;
    const item = isSelfItem
      ? store.selfItems[trialNumber - 1]
      : store.otherItems[trialNumber - 1];

    const imagePath = getImagePath(item?.category, item?.image_name);

    switch (store.trialPhase) {
      case "prepare":
        return {
          slide: `/duringPhase2/Slide1.PNG`,
          execute: () => {
            setButtonVisible(false);
            clearListeners();
            waitTimeout(
              config.experimentConfig.slideTimings.offLightbulb.minValue,
              config.experimentConfig.slideTimings.offLightbulb.maxValue,
              store.nextTrialPhase
            );
          },
        };
      case "react":
        preloadImage(imagePath);
        return {
          slide:
            trialInfo.color === "orange"
              ? "/duringPhase2/Slide2.PNG"
              : "/duringPhase2/Slide3.PNG",
          execute: () => {
            clearListeners();
            waitKeyPress(KEY_SPACE, () => {
              store.setReacted(true);
              store.nextTrialPhase();
            });
            waitTimeout(
              config.experimentConfig.slideTimings.coloredLightbulb.minValue,
              config.experimentConfig.slideTimings.coloredLightbulb.maxValue,
              store.nextTrialPhase
            );
          },
        };
      case "outcome":
        return (trialInfo.spacePressedCorrect && store.reacted) ||
          (trialInfo.noSpacePressedCorrect && !store.reacted)
          ? {
              slide: `/duringPhase2/Slide4.PNG`,
              children: (
                <div className="w-full h-full flex justify-center items-center pb-[3em]">
                  <div>
                    <img
                      className="max-h-[5em] max-w-[5em]"
                      src={imagePath}
                    ></img>
                  </div>
                </div>
              ),
              execute: () => {
                clearListeners();
                waitTimeout(
                  config.experimentConfig.slideTimings.receiveItem.minValue,
                  config.experimentConfig.slideTimings.receiveItem.maxValue,
                  () => {
                    incrementTrialIndex(4);
                    store.setReacted(false);
                  }
                );
              },
            }
          : {
              slide: `/duringPhase2/Slide1.PNG`,
              execute: () => {
                clearListeners();
                waitTimeout(
                  config.experimentConfig.slideTimings.offLightbulbNoItem
                    .minValue,
                  config.experimentConfig.slideTimings.offLightbulbNoItem
                    .maxValue,
                  () => {
                    store.incrementTrial(incrementSlideIndex);
                    store.setReacted(false);
                  }
                );
              },
            };
    }
  };

  const quizSlide = () => ({
    slide: `phase3/Slide28.JPG`,
    children: (
      <div
        key={`column1234`}
        className="text-base mt-[4em] w-[95%] pl-2.5 grid grid-cols-4 gap-0"
      >
        {config.memoryQuestionConfig.map((person, index) => (
          <div key={`checkbox-${index}`} className="bg-white w-[80%]">
            <Checkbox
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
        <div className="mt-121 bg-white w-full pl-6 flex justify-center">
          <div className="bg-white">
            <Checkbox
              key="online-shopping"
              initialOptions={config.options.shoppingFrequency}
              onChange={(value) => {
                store.setSurveyResponse("onlineShoppingFrequency", value[0]);
                store.logSurveyResponse({
                  Frequency_online_shopping: value[0],
                });
                waitTimeout(1000);
              }}
              disableOnClick={true}
            />
          </div>
        </div>
      ),
      execute: () => setButtonVisible(false),
    };
  };

  const checkboxDrugs = (slidePath: string) => ({
    slide: slidePath,
    children: (
      <div className="mt-12 w-full pl-6 flex justify-start">
        <div className="bg-white w-full">
          <Checkbox
            key="drugs"
            initialOptions={[
              ...config.options.drugScreening.drugs,
              config.options.drugScreening.other,
            ]}
            exclusiveOptions={[config.options.drugScreening.none]}
            allowMultiple={true}
            columnLayout="double"
            onChange={(values) => {
              store.setSurveyResponse("drugs", values);

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
            store.logSurveyResponse({ variableName: value });
            waitTimeout(1000);
          }}
          text={``}
        />
      ),
      execute: () => setButtonVisible(false),
    };
  };

  const renderSlide: () => Slide = () => {
    const currentSlideInfo: SlideJson =
      typeof task[slideNumber - 1] === "string"
        ? ({ slidePath: task[slideNumber - 1] } as SlideJson)
        : (task[slideNumber - 1] as SlideJson);

    const isCustomSlide = currentSlideInfo.type !== undefined;

    const showIf = (expression: string) => {
      const splitter = expression.includes("!=") ? "!=" : "=";
      const [group, value] = expression.split(splitter) as [
        keyof SurveyData,
        string
      ];

      switch (splitter) {
        case "=":
          if (store.data.survey[group] !== value) incrementSlideIndex();
          return;
        case "!=":
          if (store.data.survey[group] === value) incrementSlideIndex();
          return;
          break;
      }
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
      if ("keyPress" in currentSlideInfo) {
        waitKeyPress(currentSlideInfo.keyPress!);
        setButtonVisible(false);
      }
      if ("delay" in currentSlideInfo) {
        waitTimeout(currentSlideInfo.delay!);
        setButtonVisible(false);
      }
    };

    if (currentSlideInfo.showIf) showIf(currentSlideInfo.showIf!);

    const slidePath = currentSlideInfo.slidePath
      ? renderSlideString(currentSlideInfo.slidePath!)
      : "";

    if (isCustomSlide) {
      switch (currentSlideInfo.type) {
        case "VAS":
          return vas(
            slidePath,
            currentSlideInfo.variableName!,
            currentSlideInfo.minLabel!,
            currentSlideInfo.maxLabel!
          );
        case "checkboxShopping":
          return checkboxShopping(slidePath);
        case "checkboxDrugs":
          return checkboxDrugs(slidePath);
        case "drugCravingPre":
          return drugCravingSlide("pre");
        case "drugCravingPost":
          return drugCravingSlide("post");
        case "contingency":
          return contingencySlide(currentSlideInfo.index!);
        case "quiz":
          return quizSlide();
        case "onlineShop":
          return {
            slide: "White.PNG",
            children: <OnlineShop></OnlineShop>,
            execute: () => setButtonVisible(true),
          };
        default:
          console.error("Unknown slide type", currentSlideInfo.type);
          return { slide: slidePath };
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
    console.log("slide rendering:", slide);

    if (slide.execute) slide.execute();
    if (slide.slide) setCurrentSlide(slide);
  }, [slideNumber, trialNumber, store.trialPhase]);

  return (
    <div>
      <TaskViewport
        backgroundImage={SLIDE_PATH + currentSlide?.slide ?? "White.png"}
        verticalAlign={true}
      >
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
