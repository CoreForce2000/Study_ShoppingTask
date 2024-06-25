import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config } from "../configs/config.ts";
import {
  decrementCurrentSlideIndex,
  incrementCurrentSlideIndex,
  selectCurrentSlideIndex,
} from "../store/slideSlice.ts";
import { RootState } from "../store/store.ts";
import { preloadSlides } from "../util/preload.ts";
import { createDispatchHandler } from "../util/reduxUtils.ts";
import { getVasSlides } from "../util/specialSlides.tsx";
import styles from "./SlideShow.module.css";
import Checkbox from "./checkbox.tsx";
import VAS from "./slide-vas.tsx";
import TaskViewport from "./task-viewport.tsx";
import nextButtonImg from "/src/assets/buttonNext.png";

import { shopConfig } from "../configs/config.ts";
import {
  logControlAction,
  logExperimentVas,
  setBlockName,
  setPhase,
  setPhaseName,
} from "../store/dataSlice.ts";
import { setTrial } from "../store/experimentSlice.ts";
import { setIsPhase3 } from "../store/shop-slice.ts";
import {
  InitialState,
  areObjectsEqual,
  selectGroup,
  setClaimSatisfaction,
  setDesireContinueShopping,
  setDrugDosages,
  setDrugDosages2,
  setOnlineShoppingFrequency,
  setOthersLightbulbColor,
  setOwnLightbulbColor,
  setPurchaseSatisfaction,
  setSelectedDrugs,
} from "../store/surveySlice.ts";
import { customSlideText } from "./SlideShowUtil.tsx";
import CsvExportButton from "./ToCsvButton/ToCsvButton.tsx";

type SkipNextIf = "GROUP_CONTROL";

export interface BaseSlides {
  slide: string;
  children: React.ReactNode;
  transit?: string;
  variable?: keyof InitialState;
  hideNext?: boolean;
  timeout?: number;
  skipNextIf?: SkipNextIf;
  transitPhase?: number;
  transitDelay?: number;
  initializeTimer?: boolean;
}

const SlideShow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentSlideIndex = useSelector(selectCurrentSlideIndex);
  const currentSlide = allSlides[currentSlideIndex];

  console.log("currentSlideIndex", currentSlideIndex);

  const configData = useSelector((state: RootState) => state.config);
  const dataEntryGroup = useSelector(selectGroup);

  const backOneSlide = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "b") {
      event.preventDefault();
      dispatch(decrementCurrentSlideIndex());
    }
  };

  const forwardWithEnter = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !(event.target instanceof HTMLButtonElement)) {
      dispatch(incrementCurrentSlideIndex());
    }
  };

  const waitKeyPress = (key?: string) => {
    window.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (!key || event.key === key) {
          dispatch(incrementCurrentSlideIndex());
        }
      },
      { once: true }
    );
  };

  const waitTimeout = (timeout: number) => {
    setTimeout(() => {
      dispatch(incrementCurrentSlideIndex());
    }, timeout);
  };

  // On Component mount (only once)
  useEffect(() => {
    preloadSlides();
    document.addEventListener("keydown", backOneSlide);
    document.addEventListener("keydown", forwardWithEnter);

    return () => {
      document.removeEventListener("keydown", backOneSlide);
    };
  }, []);

  // Store VAS and Checkbox responses in an object
  // Set Memory Correct in a different way to setState

  const checkIfCorrect = (selected: string, correct: string) => {
    if (selected === correct) {
      setMemoryCorrect((memoryCorrect) => {
        const newMemoryCorrect = [...new Set([...memoryCorrect, selected])];

        if (newMemoryCorrect.length === 4) {
          memoryAllCorrectSound.play();
          setTimeout(() => {
            renderSlide(true);
            dispatch(setIsPhase3(true));
            dispatch(setBlockName("Shopping"));
            navigate("/shop");
          }, 3000);
        } else {
          memoryCorrectSound.play();
        }

        return newMemoryCorrect;
      });
      return true;
    } else {
      memoryWrongSound.play();
      return false;
    }
  };

  const baseSlides: BaseSlides[] = [
    {
      slide: `${config.SLIDE_PATH}phase1/Slide1.JPG`,
      children: (
        <div
          style={{
            marginTop: "3em",
            backgroundColor: "white",
            width: "100%",
            paddingLeft: "1.5em",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ backgroundColor: "white" }}>
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
                createDispatchHandler(
                  setOnlineShoppingFrequency,
                  dispatch
                )(value);
                renderSlide(true);
              }}
            />
          </div>
        </div>
      ),
      variable: "onlineShoppingFrequency",
      hideNext: true,
      transitDelay: 1000,
    },

    ...(dataEntryGroup !== "Control"
      ? [
          {
            slide: `${config.SLIDE_PATH}phase1/Slide2.JPG`,
            children: (
              <div
                style={{
                  marginTop: "3em",
                  width: "100%",
                  paddingLeft: "1.5em",
                  display: "flex",
                  justifyContent: "left",
                }}
              >
                <div style={{ backgroundColor: "white", width: "100%" }}>
                  <Checkbox
                    key="drugs"
                    initialOptions={[
                      "Tobacco",
                      "Cannabis",
                      "Mushrooms",
                      "Ecstasy",
                      "Amphetamines",
                      "Methamphetamine",
                      "Cocaine",
                      "Crack-cocaine",
                      "Heroin",
                      "Benzodiazepines",
                      "Ketamine",
                      "Inhalants",
                      "Spice",
                      "LSD",
                      "Other",
                    ]}
                    exclusiveOptions={["None of these"]}
                    allowMultiple={true}
                    columnLayout="double"
                    onChange={createDispatchHandler(setSelectedDrugs, dispatch)}
                  />{" "}
                </div>
              </div>
            ),
            transit: "VAS_FOLLOWUP",
            variable: "selectedDrugs" as keyof InitialState,
          },
        ]
      : []),

    {
      slide: `${config.SLIDE_PATH}phase1/Slide5.JPG`,
      children: <></>,
      transit: "COVER",
      hideNext: true,
    },
    { slide: `${config.SLIDE_PATH}phase1/Slide6.JPG`, children: <></> },
    {
      slide: `${config.SLIDE_PATH}phase1/Slide7_${configData.shopTime}.JPG`,
      children: <></>,
    },
    { slide: `${config.SLIDE_PATH}phase1/Slide8.JPG`, children: <></> },
    {
      slide: `${config.SLIDE_PATH}phase1/Slide9_${configData.shopTime}.jpg`,
      children: <></>,
      transit: "SHOP",
    },

    {
      slide: `${config.SLIDE_PATH}phase2/Slide12.JPG`,
      children: <></>,
      hideNext: true,
      timeout: 5000,
    },
    {
      slide: `${config.SLIDE_PATH}White.png`,
      children: (
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
            {" "}
            {`Please mark on the line below how satisfied you are with your purchases.`}{" "}
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
              style={{
                backgroundColor: "white",
                width: "100%",
                marginTop: "2em",
              }}
            >
              <VAS
                key="purchaseSatisfaction"
                minLabel="not at all satisfied"
                maxLabel="very satisfied"
                setValue={(value) => {
                  createDispatchHandler(
                    setPurchaseSatisfaction,
                    dispatch
                  )(value);
                }}
              />
            </div>
          </div>
        </>
      ),
      variable: "purchaseSatisfaction",
    },
    {
      slide: `${config.SLIDE_PATH}White.png`,
      children: (
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
            {" "}
            {`Would you have liked to continue shopping?`}{" "}
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
              style={{
                backgroundColor: "white",
                width: "100%",
                marginTop: "2em",
              }}
            >
              <VAS
                key="desireContinueShopping"
                minLabel="not at all"
                maxLabel="very much"
                setValue={(value) => {
                  createDispatchHandler(
                    setDesireContinueShopping,
                    dispatch
                  )(value);
                }}
              />
            </div>
          </div>
        </>
      ),
      transit: "VAS_FOLLOWUP_2",
      variable: "desireContinueShopping",
    },
    { slide: `${config.SLIDE_PATH}phase2/Slide16.JPG`, children: <></> },
    { slide: `${config.SLIDE_PATH}phase2/Slide17.JPG`, children: <></> },
    { slide: `${config.SLIDE_PATH}phase2/Slide18.jpg`, children: <></> },
    { slide: `${config.SLIDE_PATH}phase2/Slide19.JPG`, children: <></> },
    { slide: `${config.SLIDE_PATH}phase2/Slide20.JPG`, children: <></> },
    {
      slide: `${config.SLIDE_PATH}phase2/Slide21.JPG`,
      children: <></>,
      transit: "CONTINGENCY",
    },
    ...[1, 2, 3, 4, 4, 4, 4, 4].map((index) => {
      const onClick = (title: string, value: string, delay = 1000) => {
        setTimeout(() => {
          if (title == PICK_OTHERS_LIGHTBULB) {
            setOthersLightbulbColor(value);
          }
          if (title == PICK_OWN_LIGHTBULB) {
            setOwnLightbulbColor(value);
          }
          setInterSlideIndex((currentInterSlideIndex) => {
            currentInterSlideIndex = currentInterSlideIndex + 1;
            if (currentInterSlideIndex == 3) {
              currentInterSlideIndex = 0;
              navigate("/contingency");
            }
            return currentInterSlideIndex;
          });
        }, delay);
      };

      let interSlide: BaseSlides = {
        slide: `${config.SLIDE_PATH}White.png`,
        children: getVasSlides(
          "Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR.",
          "not at all",
          "very much",
          (value: number) => {
            dispatch(logExperimentVas({ CoDe_VAS: value }));
          }
        ),
        variable: "drugDosages",
        transit: "CONTINGENCY",
      };

      if (index === 1) {
        interSlide = {
          slide: `${config.SLIDE_PATH}White.png`,
          children: getVasSlides(
            "Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR.",
            "not at all",
            "very much",
            (value: number) => {
              dispatch(logExperimentVas({ CoDe_VAS: value }));
            }
          ),
          variable: "drugDosages",
        };
      }
      if (index === 2) {
        interSlide = {
          slide: `${config.SLIDE_PATH}/duringPhase2/SlideB2.PNG`,
          children: (
            <div
              style={{
                paddingTop: "3.5em",
                paddingLeft: "0.6em",
                display: "flex",
                width: "3em",
                gap: "2em",
                justifyContent: "center",
              }}
            >
              <Checkbox
                key="column8"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => onClick(PICK_OTHERS_LIGHTBULB, "blue")}
              />
              <Checkbox
                key="column9"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => onClick(PICK_OTHERS_LIGHTBULB, "orange")}
              />
            </div>
          ),
          hideNext: true,
        };
      }
      if (index === 3) {
        interSlide = {
          slide: `${config.SLIDE_PATH}/duringPhase2/SlideB3.PNG`,
          children: (
            <div
              style={{
                paddingTop: "3.5em",
                paddingLeft: "0.6em",
                display: "flex",
                width: "3em",
                gap: "2em",
                justifyContent: "center",
              }}
            >
              <Checkbox
                key="column10"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => onClick(PICK_OWN_LIGHTBULB, "blue")}
              />
              <Checkbox
                key="column11"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => onClick(PICK_OWN_LIGHTBULB, "orange")}
              />
            </div>
          ),
          hideNext: true,
          transit: "CONTINGENCY",
        };
      }
      return interSlide;
    }),

    { slide: `${config.SLIDE_PATH}phase3/Slide25.JPG`, children: <></> },
    {
      slide: `${config.SLIDE_PATH}White.png`,
      children: (
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
            {" "}
            {`Please mark on the line below how satisfied you are with the items that you successfully claimed.`}{" "}
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
              style={{
                backgroundColor: "white",
                width: "100%",
                marginTop: "2em",
              }}
            >
              <VAS
                key="claimSatisfaction"
                minLabel="not at all satisfied"
                maxLabel="very satisfied"
                setValue={(value) => {
                  createDispatchHandler(setClaimSatisfaction, dispatch)(value);
                }}
              />
            </div>
          </div>
        </>
      ),
      variable: "claimSatisfaction",
    },
    { slide: `${config.SLIDE_PATH}phase3/Slide27.JPG`, children: <></> },
    {
      slide: `${config.SLIDE_PATH}phase3/Slide28.JPG`,
      children: (
        <div
          key={`column1234`}
          style={{
            fontSize: "0.75em",
            marginTop: "4.8em",
            width: "95%",
            paddingLeft: "0.7em",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0px",
          }}
        >
          {shopConfig.phase3ShoppingListOptions.map((categories, index) => {
            return (
              <div
                key={`checkbox-${index}`}
                style={{ backgroundColor: "white", width: "80%" }}
              >
                <Checkbox
                  key={`column${index}`}
                  initialOptions={categories}
                  columnLayout="single"
                  allowMultiple={false}
                  onChange={(itemsSelected) => {
                    const correct = checkIfCorrect(
                      itemsSelected[0],
                      shopConfig.phase3ShoppingList[index]
                    );
                    setControlAttempts((controlAttempts) => {
                      controlAttempts[index] = controlAttempts[index] + 1;
                      return controlAttempts;
                    });
                    dispatch(
                      logControlAction({
                        Control_qs_person: shopConfig.phase3Person[index],
                        Control_qs_item: itemsSelected[0],
                        Control_qs_correct: correct ? "TRUE" : "FALSE",
                        Control_qs_attempts: controlAttempts[index],
                        Control_qs_RT: Date.now() - reactionStartTime,
                      })
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
      ),
      hideNext: true,
      initializeTimer: true,
    },
    { slide: `${config.SLIDE_PATH}phase3/Slide29.JPG`, children: <></> },
    {
      slide: `${config.SLIDE_PATH}phase3/Slide30.JPG`,
      children: <></>,
      hideNext: true,
    },
  ];

  const [allSlides, setAllSlides] = useState([...baseSlides]);

  const PICK_OTHERS_LIGHTBULB = "pickOthersLightbulb";
  const PICK_OWN_LIGHTBULB = "pickOwnLightbulb";

  let currentSlide: BaseSlides = { slide: "", children: <></> };

  const renderSlide = (
    forceTransit: boolean = false,
    forceTransitDelay: number = 0
  ) => {
    currentSlide = allSlides[currentSlideIndex];

    const transitDelay = forceTransitDelay || currentSlide.transitDelay || 0;

    if (currentSlide.initializeTimer) {
      setReactionStartTime(Date.now());
    }

    setTimeout(() => {
      if (currentSlide.variable) {
        if (!forceTransit) {
          if (
            areObjectsEqual(
              data[currentSlide.variable],
              initState[currentSlide.variable]
            )
          ) {
            return;
          }
        }
      }

      setInitState(data);

      dispatch(incrementCurrentSlideIndex());

      if (
        currentSlide.transit === "VAS_FOLLOWUP" ||
        currentSlide.transit === "VAS_FOLLOWUP_2"
      ) {
        const setter =
          currentSlide.transit === "VAS_FOLLOWUP"
            ? setDrugDosages
            : setDrugDosages2;
        const variable =
          currentSlide.transit === "VAS_FOLLOWUP"
            ? "drugDosages"
            : "drugDosages2";

        // Generate VAS slides for each selected drug
        const vasSlides: BaseSlides[] = data.selectedDrugs
          .filter(
            (drug: string) => drug !== "Other" && drug !== "None of these"
          )
          .map((drug: string) => ({
            slide: `${config.SLIDE_PATH}VasSlide.JPG`,
            children: getVasSlides(
              customSlideText(drug),
              "not at all",
              "very much",
              (value: number) => {
                createDispatchHandler(setter, dispatch)({ drug, value });
              }
            ),
            variable: variable,
            hideNext: false,
          }));

        // Insert the VAS slides at the current index position
        // We take all slides before the currentSlideIndex, add the VAS slides, and then the rest
        const updatedSlides = [
          ...allSlides.slice(0, currentSlideIndex + 1),
          ...vasSlides,
          ...allSlides.slice(currentSlideIndex + 1),
        ];

        // Update the allSlides state with the new slides in the correct position
        setAllSlides(updatedSlides);
      }
      if (currentSlide.transit === "SHOP") {
        dispatch(setTrial(1));
        navigate("/shop");
      }
      if (currentSlide.transit === "CONTINGENCY") {
        dispatch(setPhase(2));
        dispatch(setPhaseName("CoDe"));
        dispatch(setBlockName("p(0|-A)=0"));
        navigate("/contingency");
      }
    }, transitDelay);
  };

  if (interSlide) {
    // let onClick = lastBlock? ()=> navigate("/slide"): ()=> navigate("/contingency")

    const onClick = (title: string, value: string, delay = 1000) => {
      setTimeout(() => {
        if (title == PICK_OTHERS_LIGHTBULB) {
          setOthersLightbulbColor(value);
        }
        if (title == PICK_OWN_LIGHTBULB) {
          setOwnLightbulbColor(value);
        }
        setInterSlideIndex((currentInterSlideIndex) => {
          currentInterSlideIndex = currentInterSlideIndex + 1;
          if (currentInterSlideIndex == 3) {
            currentInterSlideIndex = 0;
            navigate("/contingency");
          }
          return currentInterSlideIndex;
        });
      }, delay);
    };

    if (interSlide === "vasExperiment") {
      const newSlideSequence: BaseSlides[] = [
        {
          slide: `${config.SLIDE_PATH}White.png`,
          children: getVasSlides(
            "Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR.",
            "not at all",
            "very much",
            (value: number) => {
              dispatch(logExperimentVas({ CoDe_VAS: value }));
            }
          ),
          variable: "drugDosages",
        },
        {
          slide: `${config.SLIDE_PATH}/duringPhase2/SlideB2.PNG`,
          children: (
            <div
              style={{
                paddingTop: "3.5em",
                paddingLeft: "0.6em",
                display: "flex",
                width: "3em",
                gap: "2em",
                justifyContent: "center",
              }}
            >
              <Checkbox
                key="column8"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => onClick(PICK_OTHERS_LIGHTBULB, "blue")}
              />
              <Checkbox
                key="column9"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => onClick(PICK_OTHERS_LIGHTBULB, "orange")}
              />
            </div>
          ),
          hideNext: true,
        },

        {
          slide: `${config.SLIDE_PATH}/duringPhase2/SlideB3.PNG`,
          children: (
            <div
              style={{
                paddingTop: "3.5em",
                paddingLeft: "0.6em",
                display: "flex",
                width: "3em",
                gap: "2em",
                justifyContent: "center",
              }}
            >
              <Checkbox
                key="column10"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => onClick(PICK_OWN_LIGHTBULB, "blue")}
              />
              <Checkbox
                key="column11"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => onClick(PICK_OWN_LIGHTBULB, "orange")}
              />
            </div>
          ),
          hideNext: true,
        },
      ];

      const currentSlide = newSlideSequence[interSlideIndex];

      return (
        <div className={styles.slideShow}>
          <TaskViewport
            backgroundImage={currentSlide.slide}
            verticalAlign={true}
          >
            {currentSlide.children}
            <button
              className={styles.nextButton}
              onClick={() => onClick("", "", 0)}
              style={{
                visibility: currentSlide.hideNext ? "hidden" : "visible",
              }}
            >
              <img src={nextButtonImg} alt="Next" className={styles.nextIcon} />
            </button>
          </TaskViewport>
        </div>
      );
    }
  }

  // When rendering, use the allSlides array
  currentSlide = allSlides[currentSlideIndex];

  // Render the current slide and selection state
  return (
    <div className={styles.slideShow}>
      <TaskViewport backgroundImage={currentSlide.slide} verticalAlign={true}>
        {currentSlide.children}
        <button
          className={styles.nextButton}
          onClick={() => renderSlide()}
          style={{ visibility: currentSlide.hideNext ? "hidden" : "visible" }}
        >
          <img src={nextButtonImg} alt="Next" className={styles.nextIcon} />
        </button>
      </TaskViewport>

      <CsvExportButton />
    </div>
  );
};

export default SlideShow;
