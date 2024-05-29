import React, { useEffect, useState } from "react";
import TaskViewport from "../components/task-viewport.tsx";
import Checkbox from "../components/checkbox.tsx";
import VAS from "../components/vas.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import { useNavigate } from "react-router-dom";
import { config } from "../configs/config.ts";
import { preloadSlides } from "../util/preloading.ts";
import { getVasSlides } from "../util/specialSlides.tsx";
import { createDispatchHandler } from "../util/reduxUtils.ts";

import {
  setOnlineShoppingFrequency,
  setPurchaseSatisfaction,
  setDesireContinueShopping,
  selectGroup,
  setClaimSatisfaction,
} from "../store/surveySlice.ts";
import { shopConfig } from "../configs/config.ts";
import { setIsPhase3 } from "../store/shopSlice.ts";
import {
  setBlockName,
  logExperimentVas
} from "../store/dataSlice.ts";
import { SLIDE_PATH } from "../util/paths.ts";
import { atom, useAtom } from "jotai";
import { entryDataAtom } from "../sharedAtoms.ts";
import Button from "../components/button.tsx";

export interface Slide {
  onRender?: ()=>void;
  slide?: string;
  children?: React.ReactNode;
}

const slideIndexAtom = atom<number>(0)
// const slideSequenceAtom = atom<Slide[]>([])

const vasDrugCravingAtom = atom<Record<string, number[]>>({})

const SlideShow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [ vasDrugCraving, setVasDrugCraving ] = useAtom(vasDrugCravingAtom);
  const [ slideIndex, setSlideIndex ] = useAtom(slideIndexAtom);
  const [ entryData ] = useAtom(entryDataAtom);
  // const [ slideSequence, setSlideSequence ] = useAtom(slideSequenceAtom);


  const incrementSlideIndex = () => {
    setSlideIndex((prevIndex) => prevIndex + 1);
  };

  const decrementslideIndex = () => {
    setSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Prevents going below 0
  };

  const [buttonVisible, setButtonVisible] = useState(false);

  
  const configData = useSelector((state: RootState) => state.config);
  const dataEntryGroup = useSelector(selectGroup);


  const customSlideText = (drug:string) => {
    return `How much do you want to use ${drug === 'LSD' ? 'LSD' : drug.toLowerCase()} right now?`
  }

  const backOneSlide = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "b") {
      event.preventDefault();
      decrementslideIndex();
    }
  }

  const waitTimeout = (timeout: number) => {
    setTimeout(() => {
      incrementSlideIndex()
    }, timeout);
  } 

  const initializeDrugCraving = (drugs: string[]) => {
    setVasDrugCraving(drugs.reduce((acc, drug) => {
      acc[drug] = [];
      return acc;
    }, {} as Record<string, number[]>)) 
  };

  // On Component mount (only once)  
  useEffect(() => {
    preloadSlides();
    document.addEventListener("keydown",backOneSlide)
    document.addEventListener("keydown",()=>waitKeyPress("Enter"))

    return () => {
      document.removeEventListener("keydown", backOneSlide);
    };
  }, []);


  
  const waitKeyPress = (key?: string) => {
    window.addEventListener("keydown", (event: KeyboardEvent)=> {
      if((!key || event.key === key) && !(event.target instanceof HTMLButtonElement)) {
        incrementSlideIndex()
      }
    },{ once: true });
  }

  const updateDrugCraving = (drug: string, value: number) => {
    setVasDrugCraving(currentVasDrugCraving => {
      const newVasDrugCraving = { ...currentVasDrugCraving };
      if (drug in newVasDrugCraving) {
        newVasDrugCraving[drug] = [...newVasDrugCraving[drug], value];
      } else {
        newVasDrugCraving[drug] = [value];
      }
      return newVasDrugCraving;
    });
  };
  
  const createVasSlides = (vasDrugCraving: Record<string, number[]>) => {
    return Object.keys(vasDrugCraving)
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
  
  const addDrugCravingRatings = () => {
    setSlideSequence(currentSlideSequence => {
      const vasSlides = createVasSlides(vasDrugCraving);
      return [
        ...currentSlideSequence.slice(0, slideIndex),
        ...vasSlides,
        ...currentSlideSequence.slice(slideIndex + 1),
      ];
    });
  };

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
            dispatch(setBlockName("Shopping"))
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

    const [ slideSequence, setSlideSequence ] = useState([
    {
      slide: `phase1/Slide1.JPG`,
      children: (
        <div className="mt-12 bg-white w-full pl-6 flex justify-center">
          <div className="bg-white">
            <Checkbox
              key="online-shopping"
              initialOptions={config.onlineShoppingOptions}
              allowMultiple={false}
              columnLayout="single"
              onChange={(value) => {
                createDispatchHandler(setOnlineShoppingFrequency, dispatch)(value);
                waitTimeout(1000);
              }}
            />
          </div>
        </div>
      ),
    },
    ...(dataEntryGroup !== "Control"
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
                    onChange={(values)=>{
                        initializeDrugCraving(values)
                        values.length === 0?setButtonVisible(false):setButtonVisible(true);
                      }  
                    }
                  />
                </div>
              </div>
            ),
          },
        ]
      : []),
    { slide: `phase1/Slide5.JPG`, onRender: ()=>{
      setButtonVisible(false);
      waitKeyPress();
    }},
    { slide: `phase1/Slide6.JPG`, onRender: ()=>setButtonVisible(true)},
    { slide: `phase1/Slide7_${entryData.shopTime}.JPG` },
    { slide: `phase1/Slide8.JPG` },
    { slide: `phase1/Slide9_${entryData.shopTime}.jpg` },
    { onRender: ()=>navigate("/shop") },
    { slide: `phase2/Slide12.JPG`, onRender: ()=> waitTimeout(5000) },
    { children: (
        <>
          <div className="absolute text-center top-4 text-base text-black">
            Please mark on the line below how satisfied you are with your purchases.
          </div>
          <div className="w-full p-4 flex justify-start">
            <div className="bg-white w-full mt-8">
              <VAS
                key="purchaseSatisfaction"
                minLabel="not at all satisfied"
                maxLabel="very satisfied"
                setValue={(value) => {
                  createDispatchHandler(setPurchaseSatisfaction, dispatch)(value);
                }}
              />
            </div>
          </div>
        </>
      ),
    },
    { children: (
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
                  createDispatchHandler(setDesireContinueShopping, dispatch)(value);
                  addDrugCravingRatings();
                }}
              />
            </div>
          </div>
        </>
      ),
    },
    { slide: `phase2/Slide16.JPG` },
    { slide: `phase2/Slide17.JPG` },
    { slide: `phase2/Slide18.jpg` },
    { slide: `phase2/Slide19.JPG` },
    { slide: `phase2/Slide20.JPG` },
    { slide: `phase2/Slide21.JPG` },
    { onRender: ()=> navigate("/contingency") },
    { children: getVasSlides(
        "Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR.",
        "not at all",
        "very much",
        (value: number) => {
          dispatch(logExperimentVas({ CoDe_VAS: value }));
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
              navigate("/contingency")
            }}
          />
          <Checkbox
            key="column9"
            initialOptions={[""]}
            columnLayout="single"
            allowMultiple={false}
            onChange={() => {
              navigate("/contingency")
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
              navigate("/contingency")
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
    ...Array(4).fill(
      { children: getVasSlides(
        "Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR.",
        "not at all",
        "very much",
        (value: number) => {
          dispatch(logExperimentVas({ CoDe_VAS: value }));
          navigate("/contingency")
        }
      ),
      }
    ),
    { slide: `phase3/Slide25.JPG`, onRender:()=>waitTimeout(3000) },
    { children: (
        <>
          <div className="absolute text-center top-4 text-base text-black">
            Please mark on the line below how satisfied you are with the items that you successfully claimed.
          </div>
          <div className="w-full p-4 flex justify-start">
            <div className="bg-white w-full mt-8">
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
    { slide: `phase3/Slide27.JPG`,  },
    {
      slide: `phase3/Slide28.JPG`,
      children: (
        <div
          key={`column1234`}
          className="text-xs mt-20 w-[95%] pl-2.5 grid grid-cols-4 gap-0"
        >
          {shopConfig.phase3ShoppingListOptions.map((categories, index) => {
            return (
              <div
                key={`checkbox-${index}`}
                className="bg-white w-[80%]"
              >
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
  ]);

  const currentSlide = slideSequence[slideIndex];

  useEffect(()=> {
    if(slideSequence[slideIndex].onRender) {
      slideSequence[slideIndex].onRender!();
    }
  }, [slideIndex, slideSequence])

  return (
    <div className="flex justify-center font-sans text-shadow-md">
      <TaskViewport backgroundImage={SLIDE_PATH + currentSlide.slide??"White.png"} verticalAlign={true}
      >
        {currentSlide.children}
        <Button 
          className="absolute cursor-pointer p-0 bottom-0 right-0"
        onClick={incrementSlideIndex} visible={buttonVisible}>Next</Button>
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
