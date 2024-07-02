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

  const slideNumber = parseInt(
    useParams<{ slideNumber: string }>().slideNumber ?? "1"
  );
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
      changeSlideIndex(store.slide + 1);
    }
  };
  const decrementSlideIndex = () => {
    if (store.slide) {
      changeSlideIndex(store.slide - 1);
    }
  };

  const backOneSlide = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "b") {
      event.preventDefault();
      decrementSlideIndex();
    }
  };

  const forwardOneSlide = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      incrementSlideIndex();
    }
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
    document.addEventListener("keydown", backOneSlide);
    document.addEventListener("keydown", forwardOneSlide);

    return () => {
      document.removeEventListener("keydown", backOneSlide);
      document.removeEventListener("keydown", forwardOneSlide);
    };
  }, []);

  const drugCravingSlides = () => {
    return (store.data.survey.drugs ?? [])
      .filter(
        (drug: string) =>
          drug !== config.options.drugScreening.other &&
          drug !== config.options.drugScreening.none
      )
      .map((drug: string) => ({
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
              waitTimeout(1000);
            }}
          />
        ),
        execute: () => setButtonVisible(false),
      }));
  };

  const contingencySlide = (block: number) => {
    const trialInfo = store.contingencyOrder[block][store.trial];
    const isSelfItem = trialInfo.color === store.colorMapping.self;
    const item = isSelfItem ? store.popSelfItem() : store.popOtherItem();
    const imagePath = getImagePath(item!.category, item!.image_name);
    preloadImage(imagePath);

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
                <div className="mt-12 bg-white w-full pl-6 flex justify-center">
                  <div className="bg-white">
                    <img src={}></img>
                  </div>
                </div>
              ),
              execute: () => {
                clearListeners();
                waitTimeout(
                  config.experimentConfig.slideTimings.receiveItem.minValue,
                  config.experimentConfig.slideTimings.receiveItem.maxValue,
                  () => {
                    store.incrementTrial(incrementSlideIndex);
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
    ...drugCravingSlides(),
    {
      slide: `phase1/Slide5.JPG`,
      execute: () => {
        setButtonVisible(false);
        waitKeyPress();
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
            waitTimeout(1000);
          }}
          text={``}
        />
      ),
      execute: () => setButtonVisible(false),
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
            waitTimeout(1000);
          }}
          text={""}
        />
      ),
    },
    ...drugCravingSlides(),

    { slide: `phase2/Slide16.JPG`, execute: () => setButtonVisible(true) },
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
    if (currentSlide.execute) {
      currentSlide.execute!();
    }
  }, [slideSequence]);

  return (
    <div className="flex justify-center font-sans text-shadow-md">
      <TaskViewport
        backgroundImage={SLIDE_PATH + currentSlide.slide ?? "White.png"}
        verticalAlign={true}
      >
        {currentSlide.children}
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
