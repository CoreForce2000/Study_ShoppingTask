import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Checkbox from "../components/checkbox.tsx";
import TaskViewport from "../components/task-viewport.tsx";
import VAS from "../components/vas.tsx";
import { preloadSlides } from "../util/preload.ts";

import { atom, useAtom } from "jotai";
import Button from "../components/button.tsx";
import { useAtomStore } from "../store.ts";
import { SLIDE_PATH } from "../util/path.ts";

const getVasSlides = (
  text: string,
  minLabel: string,
  maxLabel: string,
  setValue: (value: number) => void
): React.ReactNode => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          textAlign: "center",
          top: "1em",
          fontSize: "1em",
          color: "black",
        }}
      >
        {text}{" "}
      </div>

      <div
        style={{
          width: "100%",
          padding: "1em",
          display: "flex",
          justifyContent: "left",
        }}
      >
        <div
          style={{ backgroundColor: "white", width: "100%", marginTop: "2em" }}
        >
          <VAS
            key={text}
            minLabel={minLabel}
            maxLabel={maxLabel}
            setValue={setValue}
          />
        </div>
      </div>
    </>
  );
};

export interface Slide {
  execute?: () => void;
  slide?: string;
  children?: React.ReactNode;
}

const slideIndexAtom = atom<number>(0);

const SlideShow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [
    structuredData,
    setStructuredData,
    updateStructuredData,
    updateDrugCraving,
  ] = useAtomStore();

  const [slideIndex, setSlideIndex] = useAtom(slideIndexAtom);

  const incrementSlideIndex = () => {
    setSlideIndex((prevIndex) => prevIndex + 1);
  };

  const decrementslideIndex = () => {
    setSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Prevents going below 0
  };

  const [buttonVisible, setButtonVisible] = useState(false);

  const customSlideText = (drug: string) => {
    return `How much do you want to use ${
      drug === "LSD" ? "LSD" : drug.toLowerCase()
    } right now?`;
  };

  const backOneSlide = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "b") {
      event.preventDefault();
      decrementslideIndex();
    }
  };

  const waitTimeout = (timeout: number) => {
    setTimeout(() => {
      incrementSlideIndex();
    }, timeout);
  };

  // On Component mount (only once)
  useEffect(() => {
    preloadSlides();
    document.addEventListener("keydown", backOneSlide);
    document.addEventListener("keydown", () => waitKeyPress("Enter"));

    return () => {
      document.removeEventListener("keydown", backOneSlide);
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
    return structuredData.drugs
      .filter((drug: string) => drug !== "Other" && drug !== "None of these")
      .map((drug: string) => ({
        slide: `VasSlide.JPG`,
        children: getVasSlides(
          customSlideText(drug),
          "not at all",
          "very much",
          (value: number) => updateDrugCraving(drug, value)
        ),
      }));
  };

  const slideSequence = [
    {
      slide: `phase1/Slide1.JPG`,
      children: (
        <div className="mt-12 bg-white w-full pl-6 flex justify-center">
          <div className="bg-white">
            <Checkbox
              key="online-shopping"
              initialOptions={[
                "several times a day",
                "once a day",
                "a few times a week",
                "once a week",
                "once a month or less",
                "very rarely / not at all",
              ]}
              allowMultiple={false}
              columnLayout="single"
              onChange={(value) => {
                updateStructuredData("shopTime", value[0]);
                waitTimeout(1000);
              }}
            />
          </div>
        </div>
      ),
    },
    ...(structuredData.group !== "Control"
      ? [
          {
            slide: `phase1/Slide2.JPG`,
            children: (
              <div className="mt-12 w-full pl-6 flex justify-start">
                <div className="bg-white w-full">
                  <Checkbox
                    key="drugs"
                    initialOptions={config.drugsOptions}
                    exclusiveOptions={["None of these"]}
                    allowMultiple={true}
                    columnLayout="double"
                    onChange={(values) => {
                      updateStructuredData("drugs", values);
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
    { slide: `phase1/Slide7_${structuredData.shopTime}.JPG` },
    { slide: `phase1/Slide8.JPG` },
    { slide: `phase1/Slide9_${structuredData.shopTime}.jpg` },
    { execute: () => navigate("/shop") },
    { slide: `phase2/Slide12.JPG`, execute: () => waitTimeout(5000) },
    {
      children: (
        <>
          <div className="absolute text-center top-4 text-base text-black">
            Please mark on the line below how satisfied you are with your
            purchases.
          </div>
          <div className="w-full p-4 flex justify-start">
            <div className="bg-white w-full mt-8">
              <VAS
                key="purchaseSatisfaction"
                minLabel="not at all satisfied"
                maxLabel="very satisfied"
                setValue={(value) => {
                  updateStructuredData("purchaseSatisfaction", value);
                }}
              />
            </div>
          </div>
        </>
      ),
    },
    {
      children: (
        <>
          <div className="absolute text-center top-4 text-base text-black">
            Would you have liked to continue shopping?
          </div>
          <div className="w-full p-4 flex justify-start">
            <div className="bg-white w-full mt-8">
              <VAS
                key="desireContinueShopping"
                minLabel="not at all"
                maxLabel="very much"
                setValue={(value) => {
                  updateStructuredData("desireContinueShopping", value);
                }}
              />
            </div>
          </div>
        </>
      ),
    },
    ...drugCravingSlides(),
    { slide: `phase2/Slide16.JPG` },
    { slide: `phase2/Slide17.JPG` },
    { slide: `phase2/Slide18.jpg` },
    { slide: `phase2/Slide19.JPG` },
    { slide: `phase2/Slide20.JPG` },
    { slide: `phase2/Slide21.JPG` },
    { execute: () => navigate("/contingency") },
    {
      children: getVasSlides(
        "Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR.",
        "not at all",
        "very much",
        (value: number) => {
          updateStructuredData("CoDe_VAS", value);
        }
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
              navigate("/contingency");
            }}
          />
          <Checkbox
            key="column9"
            initialOptions={[""]}
            columnLayout="single"
            allowMultiple={false}
            onChange={() => {
              navigate("/contingency");
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
              navigate("/contingency");
            }}
          />
          <Checkbox
            key="column11"
            initialOptions={[""]}
            columnLayout="single"
            allowMultiple={false}
            onChange={() => {
              navigate("/contingency");
            }}
          />
        </div>
      ),
    },
    ...Array(4).fill({
      children: getVasSlides(
        "Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR.",
        "not at all",
        "very much",
        (value: number) => {
          updateStructuredData("CoDe_VAS", value);
          navigate("/contingency");
        }
      ),
    }),
    { slide: `phase3/Slide25.JPG`, execute: () => waitTimeout(3000) },
    {
      children: (
        <>
          <div className="absolute text-center top-4 text-base text-black">
            Please mark on the line below how satisfied you are with the items
            that you successfully claimed.
          </div>
          <div className="w-full p-4 flex justify-start">
            <div className="bg-white w-full mt-8">
              <VAS
                key="claimSatisfaction"
                minLabel="not at all satisfied"
                maxLabel="very satisfied"
                setValue={(value) => {
                  updateStructuredData("claimSatisfaction", value);
                }}
              />
            </div>
          </div>
        </>
      ),
      variable: "claimSatisfaction",
    },
    { slide: `phase3/Slide27.JPG` },
    {
      slide: `phase3/Slide28.JPG`,
      children: (
        <div
          key={`column1234`}
          className="text-xs mt-20 w-[95%] pl-2.5 grid grid-cols-4 gap-0"
        >
          {shopConfig.phase3ShoppingListOptions.map((categories, index) => {
            return (
              <div key={`checkbox-${index}`} className="bg-white w-[80%]">
                <Checkbox
                  key={`column${index}`}
                  initialOptions={categories}
                  columnLayout="single"
                  allowMultiple={false}
                  onChange={(itemsSelected) => {
                    checkIfCorrect(
                      itemsSelected[0],
                      shopConfig.phase3ShoppingList[index]
                    );
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

  const currentSlide = slideSequence[slideIndex];

  useEffect(() => {
    if (slideSequence[slideIndex].execute) {
      slideSequence[slideIndex].execute!();
    }
  }, [slideIndex, slideSequence]);

  return (
    <div className="flex justify-center font-sans text-shadow-md">
      <TaskViewport
        backgroundImage={SLIDE_PATH + currentSlide.slide ?? "White.png"}
        verticalAlign={true}
      >
        {currentSlide.children}
        <Button
          className="absolute cursor-pointer p-0 bottom-0 right-0"
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
