import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "../components/checkbox.tsx";
import TaskViewport from "../components/task-viewport.tsx";

import Button from "../components/button.tsx";
import VASSlide from "../components/slide-vas.tsx";
import useTaskStore from "../store/store.ts";

import config from "../assets/configs/config.json";
import { KEY_SPACE, SLIDE_PATH } from "../util/constants.ts";
import { exportCsv } from "../util/functions.ts";
import { getImagePath, preloadImage, preloadSlides } from "../util/preload.ts";
import OnlineShop from "./online-shop.tsx";

export interface Slide {
  execute?: () => void;
  slide?: string;
  children?: React.ReactNode;
}

const SlideShow: React.FC = () => {
  const navigate = useNavigate();

  const store = useTaskStore();
  const [buttonVisible, setButtonVisibleRaw] = useState(true);
  const setButtonVisible = (state: boolean) => {
    if (!store.devMode) {
      setButtonVisibleRaw(state);
    }
  };

  useEffect(() => {
    preloadSlides();
  });

  const timeoutIdRef = useRef<number | null>(null);
  const keyPressHandlerRef = useRef<((event: KeyboardEvent) => void) | null>(
    null
  );

  const { slideNumberRaw, trialNumberRaw } = useParams<{
    slideNumberRaw: string;
    trialName?: string;
    trialNumberRaw?: string;
  }>();

  const slideNumber = parseInt(slideNumberRaw ?? "1");
  const trialNumber = trialNumberRaw ? parseInt(trialNumberRaw) : 1;

  if (store.slide !== slideNumber) store.setSlide(slideNumber);

  const clearListeners = () => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (keyPressHandlerRef.current)
      window.removeEventListener("keydown", keyPressHandlerRef.current);
  };

  const changeSlideIndex = (newSlideNumber: number) => {
    clearListeners();
    navigate(`/slide/${newSlideNumber}`);
  };

  const incrementSlideIndex = () => {
    if (store.slide) {
      changeSlideIndex(slideNumber + 1);
    }
  };
  const decrementSlideIndex = () => {
    if (store.slide) {
      changeSlideIndex(slideNumber - 1);
    }
  };

  const incrementTrialIndex = (trialName: string, maxTrial: number) => {
    if (store.slide) {
      navigate(`/slide/${slideNumber}/${trialName}/${trialNumber + 1}`);
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
        (!key || event.key === key) &&
        !(event.target instanceof HTMLButtonElement)
      ) {
        (customFunction ? customFunction : incrementSlideIndex)();
      }
    };

    window.addEventListener("keydown", keyPressHandlerRef.current, {
      once: true,
    });
  };

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        decrementSlideIndex();
      } else if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        event.preventDefault();
        incrementSlideIndex();
      } else if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        event.preventDefault();
        navigate("/csv");
      }
    };

    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  const drugCravingSlide = (stage: "pre" | "post") => {
    const drugs = store.getDrugsNow();

    if (drugs.length === 0) return { execute: () => incrementSlideIndex() };

    const drug = drugs[trialNumber - 1];

    console.log(drugs);

    return {
      slide: `VasSlide.JPG`,
      children: (
        <VASSlide
          key={drug}
          text={`How much do you want to use ${
            drug === "LSD" ? "LSD" : drug.toLowerCase()
          } 
    right now?`}
          minLabel="not at all"
          maxLabel="very much"
          setValue={(value: number) => {
            store.setDrugCraving(drug, value);
            store.logSurveyResponse({ [`VAS_${drug}_${stage}`]: value });

            waitTimeout(1000, 1000, () => {
              incrementTrialIndex("craving", drugs.length);
            });
          }}
        />
      ),
      execute: () => setButtonVisible(false),
    };
  };

  const contingencySlide = (block: number) => {
    let trialInfo;
    let isSelfItem;
    let item;
    let imagePath;

    switch (store.trialPhase) {
      case "prepare":
        return {
          slide: `/duringPhase2/Slide1.PNG`,
          execute: () => {
            clearListeners();
            waitTimeout(
              config.experimentConfig.slideTimings.offLightbulb.minValue,
              config.experimentConfig.slideTimings.offLightbulb.maxValue,
              store.nextTrialPhase
            );
          },
        };
      case "react":
        trialInfo = store.contingencyOrder[block][trialNumber - 1];
        isSelfItem = trialInfo.color === store.colorMapping.self;
        item = isSelfItem
          ? store.selfItems[trialNumber - 1]
          : store.otherItems[trialNumber - 1];
        imagePath = getImagePath(item!.category, item!.image_name);
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
        return (trialInfo!.spacePressedCorrect && store.reacted) ||
          (trialInfo!.noSpacePressedCorrect && !store.reacted)
          ? {
              slide: `/duringPhase2/Slide4.PNG`,
              children: (
                <div className="mt-12 bg-white w-full pl-6 flex justify-center">
                  <div className="bg-white">
                    <img src={imagePath}></img>
                  </div>
                </div>
              ),
              execute: () => {
                clearListeners();
                waitTimeout(
                  config.experimentConfig.slideTimings.receiveItem.minValue,
                  config.experimentConfig.slideTimings.receiveItem.maxValue,
                  () => {
                    incrementTrialIndex(
                      "trial",
                      store.contingencyOrder[block].length
                    );
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

  const slideSequence = [
    {},
    {
      slide: `phase1/Slide1.JPG`,
      children: (
        <div className="mt-12 bg-white w-full pl-6 flex justify-center">
          <div className="bg-white">
            <Checkbox
              key="online-shopping"
              initialOptions={config.options.shoppingFrequency}
              allowMultiple={false}
              columnLayout="single"
              onChange={(value) => {
                store.setSurveyResponse("onlineShoppingFrequency", value[0]);
                store.logSurveyResponse({
                  Frequency_online_shopping: value[0],
                });
                waitTimeout(1000);
              }}
            />
          </div>
        </div>
      ),
      execute: () => setButtonVisible(false),
    },
    ...(store.taskOptions.group !== "Control"
      ? [
          {
            slide: `phase1/Slide2.JPG`,
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
          },
        ]
      : []),
    drugCravingSlide("pre"),
    {
      slide: `phase1/Slide5.JPG`,
      execute: () => {
        // ...config.options.drugScreening.drugs.reduce(
        //   (acc, drug) => ({
        //     ...acc,
        //     [`${drug}_now`]: store.getDrugsNow().includes(drug) ? 1 : 0,
        //   }),
        //   {}
        // ),
        // [config.options.drugScreening.none]: store.data.survey.drugs.includes(
        //   config.options.drugScreening.none
        // )
        //   ? 1
        //   : 0,

        setButtonVisible(false);
        waitKeyPress(undefined, () => {
          incrementSlideIndex();
          store.logSurveyResponse({
            ...store.getDrugsNow().reduce(
              (acc, drug) => ({
                ...acc,
                [`${drug}_now`]: 1,
              }),
              {}
            ),
            [config.options.drugScreening.none]:
              store.data.survey.drugs.includes(
                config.options.drugScreening.none
              )
                ? 1
                : 0,
          });
        });
      },
    },
    { slide: `phase1/Slide6.JPG`, execute: () => setButtonVisible(true) },
    {
      slide: `phase1/Slide7_${store.taskOptions.time.split(" ")[0] ?? 10}.JPG`,
    },
    { slide: `phase1/Slide8.JPG` },
    {
      slide: `phase1/Slide9_${store.taskOptions.time.split(" ")[0] ?? 10}.jpg`,
    },
    {
      children: <OnlineShop></OnlineShop>,
      slide: `White.png`,
      execute: () => setButtonVisible(false),
    },
    {
      slide: `phase2/Slide13.JPG`,
      children: (
        <VASSlide
          key="purchaseSatisfaction"
          minLabel="not at all satisfied"
          maxLabel="very satisfied"
          setValue={(value) => {
            store.setSurveyResponse("purchaseSatisfaction", value);
            store.logSurveyResponse({ VAS_shopping_satisfaction: value });
            waitTimeout(1000);
          }}
          text={``}
        />
      ),
      execute: () => {
        setButtonVisible(false);
        if (store.selfItems.length === 0) store.generateSelfOtherSequence();
      },
    },
    {
      slide: `phase2/Slide14.JPG`,
      children: (
        <VASSlide
          key="desireContinueShopping"
          minLabel="not at all"
          maxLabel="very much"
          setValue={(value) => {
            store.setSurveyResponse("desireContinueShopping", value);
            store.logSurveyResponse({ VAS_shopping_continuation: value });
            waitTimeout(1000);
          }}
          text={""}
        />
      ),
    },
    drugCravingSlide("post"),

    { slide: `phase2/Slide16.JPG`, execute: () => exportCsv(store) },
    { slide: `phase2/Slide17.JPG` },
    { slide: `phase2/Slide18.jpg` },
    { slide: `phase2/Slide19.JPG` },
    { slide: `phase2/Slide20.JPG` },
    { slide: `phase2/Slide21.JPG` },

    ...Array(5)
      .fill(0)
      .map((_, index) => [
        contingencySlide(index),
        {
          slide: `/duringPhase2/SlideB1.PNG`,
          children: (
            <VASSlide
              key={"CoDe_VAS" + index}
              text=""
              minLabel="not at all"
              maxLabel="very much"
              setValue={(value) => {
                store.setSurveyResponse("CoDe_VAS", value);
                waitTimeout(1000);
              }}
            />
          ),
        },
        {
          slide: `/duringPhase2/SlideB2.PNG`,
          children: (
            <div className="pt-14 pl-2.5 flex w-12 gap-8 justify-center">
              <Checkbox
                key="column8"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => {
                  waitTimeout(1000);
                }}
              />
              <Checkbox
                key="column9"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => {
                  waitTimeout(1000);
                }}
              />
            </div>
          ),
        },
        {
          slide: `/duringPhase2/SlideB3.PNG`,
          children: (
            <div className="pt-14 pl-2.5 flex w-12 gap-8 justify-center">
              <Checkbox
                key="column10"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => {
                  waitTimeout(1000);
                }}
              />
              <Checkbox
                key="column11"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => {
                  waitTimeout(1000);
                }}
              />
            </div>
          ),
        },
      ])
      .flat(),

    { slide: `phase3/Slide25.JPG`, execute: () => waitTimeout(3000) },
    {
      children: (
        <VASSlide
          key="claimSatisfaction"
          minLabel="not at all satisfied"
          maxLabel="very satisfied"
          setValue={(value) => {
            store.setSurveyResponse("claimSatisfaction", value);
            waitTimeout(1000);
          }}
          text={`Please mark on the line below how satisfied you are with the items
            that you successfully claimed.`}
        />
      ),
      variable: "claimSatisfaction",
    },
    { slide: `phase3/Slide27.JPG`, execute: () => setButtonVisible(true) },
    // {
    //   slide: `phase3/Slide28.JPG`,
    //   children: (
    //     <div
    //       key={`column1234`}
    //       className="text-xs mt-20 w-[95%] pl-2.5 grid grid-cols-4 gap-0"
    //     >
    //       {config.memoryQuestionConfig.map((person, index) => {
    //         return (
    //           <div key={`checkbox-${index}`} className="bg-white w-[80%]">
    //             <Checkbox
    //               key={`column${index}`}
    //               initialOptions={person.options}
    //               columnLayout="single"
    //               allowMultiple={false}
    //               onChange={(itemsSelected) => {
    //                 checkIfCorrect(itemsSelected[0], person.correct);
    //               }}
    //             />
    //           </div>
    //         );
    //       })}
    //     </div>
    //   ),
    // },
    { slide: `phase3/Slide29.JPG` },
    {
      slide: `phase3/Slide30.JPG`,
      execute: () => {
        exportCsv(store);
        waitTimeout(5000);
      },
    },
  ];

  const interSlides = {
    timeIsRunningOut: {
      slide: `shop/Slide10.JPG`,
      execute: () => {
        setButtonVisible(false);
      },
    },
    extraBudget: {
      slide: `shop/Slide11.JPG`,

      children: (
        <Button
          className="absolute cursor-pointer p-0 bottom-[1em] text-base"
          onClick={() => store.setInterSlide("")}
        >
          Continue Shopping
        </Button>
      ),
    },
  };

  const currentSlide = store.interSlide
    ? interSlides[store.interSlide]
    : slideSequence[slideNumber];

  useEffect(() => {
    if ((currentSlide as Slide).execute) {
      (currentSlide as Slide).execute!();
    }
  }, [slideSequence]);

  return (
    <div className="flex justify-center font-sans text-shadow-md">
      <TaskViewport
        backgroundImage={SLIDE_PATH + currentSlide.slide ?? "White.png"}
        verticalAlign={true}
      >
        {(currentSlide as Slide).children}
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
