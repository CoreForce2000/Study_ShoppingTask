import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "../components/checkbox.tsx";
import TaskViewport from "../components/task-viewport.tsx";

import Button from "../components/button.tsx";
import VASSlide from "../components/slide-vas.tsx";
import useTaskStore from "../store/store.ts";

import config from "../assets/configs/config.json";
import { SLIDE_PATH } from "../util/constants.ts";
import OnlineShop from "./online-shop.tsx";

export interface Slide {
  execute?: () => void;
  slide?: string;
  children?: React.ReactNode;
}

const SlideShow: React.FC = () => {
  const navigate = useNavigate();

  const store = useTaskStore();
  const [buttonVisible, setButtonVisible] = useState(false);

  let timeoutId: number = 0;

  const slideNumber = parseInt(
    useParams<{ slideNumber: string }>().slideNumber ?? "1"
  );
  if (store.slide !== slideNumber) store.setSlide(slideNumber);

  const incrementSlideIndex = () => {
    if (slideNumber) {
      navigate(`/slide/${slideNumber + 1}`);
    }
  };

  const decrementslideIndex = () => {
    if (slideNumber) {
      navigate(`/slide/${slideNumber - 1}`);
    }
  };

  const customSlideText = (drug: string) => {
    return `How much do you want to use ${
      drug === "LSD" ? "LSD" : drug.toLowerCase()
    } 
      right now?`;
  };

  const backOneSlide = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "b") {
      event.preventDefault();
      if (timeoutId !== 0) {
        clearTimeout(timeoutId);
        timeoutId = 0;
      }
      decrementslideIndex();
    }
  };

  const waitTimeout = (timeout: number) => {
    timeoutId = setTimeout(() => {
      incrementSlideIndex();
    }, timeout);
  };

  useEffect(() => {
    document.addEventListener("keydown", backOneSlide);
    document.addEventListener("keydown", () => waitKeyPress("Enter"));

    return () => {
      document.removeEventListener("keydown", backOneSlide);
      if (timeoutId !== 0) {
        clearTimeout(timeoutId);
        timeoutId = 0;
      }
    };
  }, []);

  const waitKeyPress = (key?: string) => {
    window.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (
          (!key || event.key === key) &&
          !(event.target instanceof HTMLButtonElement)
        ) {
          incrementSlideIndex();
        }
      },
      { once: true }
    );
  };

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
            text={customSlideText(drug)}
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
    { slide: `phase1/Slide7_${store.taskOptions.time.split(" ")[0]}.JPG` },
    { slide: `phase1/Slide8.JPG` },
    { slide: `phase1/Slide9_${store.taskOptions.time.split(" ")[0]}.jpg` },
    { children: <OnlineShop></OnlineShop>, slide: `White.png` },
    { slide: `phase2/Slide12.JPG`, execute: () => waitTimeout(5000) },
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
    {
      slide: `duringPhase2/Slide22.jpg`,
      children: (
        <VASSlide
          text="" //"Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR."
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
    ...Array(4)
      .fill(0)
      .map((_, index) => ({
        children: (
          <VASSlide
            key={"CoDe_VAS" + index}
            text="Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR."
            minLabel="not at all"
            maxLabel="very much"
            setValue={(value) => {
              store.setSurveyResponse("CoDe_VAS", value);
              waitTimeout(1000);
            }}
          />
        ),
      })),
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
    {
      slide: `phase3/Slide28.JPG`,
      children: (
        <div
          key={`column1234`}
          className="text-xs mt-20 w-[95%] pl-2.5 grid grid-cols-4 gap-0"
        >
          {config.memoryQuestionConfig.map((person, index) => {
            return (
              <div key={`checkbox-${index}`} className="bg-white w-[80%]">
                <Checkbox
                  key={`column${index}`}
                  initialOptions={person.options}
                  columnLayout="single"
                  allowMultiple={false}
                  onChange={(itemsSelected) => {
                    checkIfCorrect(itemsSelected[0], person.correct);
                  }}
                />
              </div>
            );
          })}
        </div>
      ),
    },
    { slide: `phase3/Slide29.JPG` },
    { slide: `phase3/Slide30.JPG` },
  ];

  useEffect(() => {
    if (slideSequence[slideNumber].execute) {
      slideSequence[slideNumber].execute!();
    }
    console.info("Store data:", store.data);
    console.info("Store options", store.taskOptions);
  }, [slideNumber, slideSequence]);

  return (
    <div className="flex justify-center font-sans text-shadow-md">
      <TaskViewport
        backgroundImage={
          SLIDE_PATH + slideSequence[slideNumber].slide ?? "White.png"
        }
        verticalAlign={true}
      >
        {slideSequence[slideNumber].children}
        <Button
          className="absolute cursor-pointer p-0 bottom-[1em] right-[1em] text-base"
          onClick={incrementSlideIndex}
          visible={buttonVisible}
        >
          Next
        </Button>
        {/* <button
          className="absolute bg-transparent border-none cursor-pointer p-0 bottom-0 right-0"
          onClick={() => incrementSlideIndex()}
          style={{ visibility: buttonVisible ? "visible" : "hidden" }}
        >
          <img src={nextButtonImg} alt="Next" className="h-5 w-auto" />
        </button> */}
      </TaskViewport>
    </div>
  );
};

export default SlideShow;
