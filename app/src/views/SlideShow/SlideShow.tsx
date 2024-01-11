import React, { useEffect, useState } from 'react';
import styles from './SlideShow.module.css';
import SlideView from '../../components/SlideView/SlideView';
import Checkbox from './components/Checkbox/Checkbox';
import VAS from './components/VAS/VAS';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import nextButtonImg from '/src/assets/buttonNext.png'
import { useNavigate } from 'react-router-dom';
import { config } from '../../configs/config.ts';
import { preloadImage } from '../../util/imageLoading.ts';
import { selectCurrentSlideIndex, setCurrentSlideIndex } from '../../store/slideSlice.ts';
import { getVasSlides } from '../../util/specialSlides.tsx';
import { createDispatchHandler } from '../../util/reduxUtils.ts';
import { setDrugDosages, setOnlineShoppingFrequency, setSelectedDrugs, setShoppingSatisfaction } from '../../store/surveySlice.ts';

export interface BaseSlides {
  slide: string;
  children: React.ReactNode;
  transit?: string;
  variable?: any;
}

const SlideShow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get currentSlideIndex from store
  const currentSlideIndex = useSelector(selectCurrentSlideIndex);

  const configData = useSelector((state: RootState) => state.config);

  const dataCollectionRecord = useSelector((state: RootState) => state.survey.);

  const onlineShoppingFrequency = useSelector(selectOnlineShoppingFrequency);
  const selectedDrugs:string[] = useSelector(selectSelectedDrugs);
  const drugDosage = useSelector(selectDrugDosage);
  const shoppingSatisfaction = useSelector(selectShoppingSatisfaction);


  const goToNextSlide = () => {
    const currentSlide = allSlides[currentSlideIndex]

    console.log(currentSlide.variable)
    if(currentSlide.variable) {
      
      // Current slide variable not empty
      if(currentSlide.variable().length == 0) {
        return
      }
    }
    
    dispatch(setCurrentSlideIndex(currentSlideIndex + 1));
    if (currentSlide.transit === "VAS_FOLLOWUP") {
      // Generate VAS slides for each selected drug
      const vasSlides: BaseSlides[] = selectedDrugs.filter((drug: string)=> drug !== "Other").map((drug: string) => (
        
        {slide:`${config.SLIDE_PATH}VasSlide.JPG`,
          children:getVasSlides(customSlideText(drug), 'Not at all', 'Very much', (value: number) => createDispatchHandler(setDrugDosages, dispatch)({drug, value}))
          ,
          variable:"drugDosages"
          }
        
      ));
      
      console.log(vasSlides)

      // Insert the VAS slides at the current index position
      // We take all slides before the currentSlideIndex, add the VAS slides, and then the rest
      const updatedSlides = [
        ...allSlides.slice(0, currentSlideIndex + 1),
        ...vasSlides,
        ...allSlides.slice(currentSlideIndex + 1),
      ];

      // Update the allSlides state with the new slides in the correct position
      setAllSlides(updatedSlides);
    };
    if (currentSlide.transit === "SHOP") {
      navigate('/shop');
    }
    if (currentSlide.transit === "CONTINGENCY") {
      navigate('/contingency');
    }
  }

  useEffect(() => {
    // Existing slide paths
    const slideImagePaths = [
      `${config.SLIDE_PATH}phase1/Slide1.JPG`,
      `${config.SLIDE_PATH}phase1/Slide2.JPG`,
      `${config.SLIDE_PATH}phase1/Slide6.JPG`,
      `${config.SLIDE_PATH}phase1/Slide7.JPG`,
      `${config.SLIDE_PATH}phase1/Slide8.JPG`,
      `${config.SLIDE_PATH}phase1/Slide9.JPG`,
      `${config.SLIDE_PATH}phase1/Slide5.JPG`,
      `${config.SLIDE_PATH}phase2/Slide12.JPG`,
      `${config.SLIDE_PATH}phase2/Slide13.JPG`,
      `${config.SLIDE_PATH}phase2/Slide14.JPG`,
      `${config.SLIDE_PATH}phase2/Slide15.JPG`,
      `${config.SLIDE_PATH}phase2/Slide16.JPG`,
      `${config.SLIDE_PATH}phase2/Slide17.JPG`,
      `${config.SLIDE_PATH}phase2/Slide18.JPG`,
      `${config.SLIDE_PATH}phase2/Slide19.JPG`,
      `${config.SLIDE_PATH}phase2/Slide20.JPG`,
      `${config.SLIDE_PATH}phase2/Slide21.JPG`,

      // Add paths for any other slides you need to preload
    ];

    // Preload all images
    slideImagePaths.forEach(path => {
      preloadImage(path);
    });
    
  }, []); // Include drugProducts and nonDrugProducts in the dependency array
  


  
  const baseSlides: BaseSlides[] = [

    {slide:`${config.SLIDE_PATH}phase1/Slide1.JPG`,
    children: <div style={{marginTop:"3em", backgroundColor:"white", width:"100%", paddingLeft:"1.5em", display:"flex", justifyContent:"left"}}>
                <div style={{backgroundColor:"white", width:"100%"}}> 
                  <Checkbox key="online-shopping"
                    initialOptions={[
                      
                      "several times a day",
                      "once a day",
                      "a few times a week",
                      "once a week",
                      "once a month or less",
                      "very rarely / not at all"
                    
                    ]} // Replace with actual options
                    allowMultiple={false}
                    columnLayout="single"
                    onChange={createDispatchHandler(setOnlineShoppingFrequency, dispatch)}
                  />
                </div>
              </div>,
    variable:()=>onlineShoppingFrequency,
  },

  {slide:`${config.SLIDE_PATH}phase1/Slide2.JPG`,
  children: <div style={{marginTop:"3em", width:"100%", paddingLeft:"1.5em", display:"flex", justifyContent:"left"}}>
              <div style={{backgroundColor:"white", width:"100%"}}> 
                <Checkbox key="drugs"
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
                    ]
                  } // Replace with actual options
                  exclusiveOptions={[
                    "None of these"
                  ]}
                  allowMultiple={true}
                  columnLayout="double"
                  onChange={createDispatchHandler(setSelectedDrugs, dispatch)}
                /> </div>
            </div>,
  transit:"VAS_FOLLOWUP",
  variable:()=>selectedDrugs},

  {slide:`${config.SLIDE_PATH}phase1/Slide5.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase1/Slide6.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase1/Slide7.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase1/Slide8.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase1/Slide9.JPG`, children: <></>, transit:"SHOP"},


  {slide:`${config.SLIDE_PATH}phase2/Slide12.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}White.png`, children: 
    <>
    <div style={{position:"absolute", textAlign:"center", top:"1em", fontSize:"1em", color:"black"}}> {`Please indicate on the line below how satisfied you are with your purchases`} </div>
            <div style={{width:"100%", padding:"1em", display:"flex", justifyContent:"left"}}>
              <div style={{backgroundColor:"white", width:"100%", marginTop:"2em"}}>
                <VAS minLabel='Not at all' maxLabel='Very much' setValue={createDispatchHandler(setShoppingSatisfaction, dispatch)} />
      </div>
     </div>
     </>,
    variable:()=>shoppingSatisfaction
  },
  {slide:`${config.SLIDE_PATH}phase2/Slide13.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase2/Slide14.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase2/Slide15.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase2/Slide16.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase2/Slide17.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase2/Slide18.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase2/Slide19.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase2/Slide20.JPG`, children: <></>},
  {slide:`${config.SLIDE_PATH}phase2/Slide21.JPG`, children: <></>, transit:"CONTINGENCY"},
  
]


  const [allSlides, setAllSlides] = useState([...baseSlides]);


  // When rendering, use the allSlides array
  const currentSlide = allSlides[currentSlideIndex];

  const handleKeyPress = (event: KeyboardEvent) => {
    if ((event.key === 'Enter') && !(event.target instanceof HTMLButtonElement))  {
      goToNextSlide();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentSlideIndex]); // Ensure listener is updated when currentSlideIndex changes



  const goToPreviousSlide = () => {
    dispatch(setCurrentSlideIndex(currentSlideIndex - 1));
  };

  // Render the current slide and selection state
  return (
    <div className={styles.slideShow}>
      <SlideView backgroundImage={currentSlide.slide} verticalAlign={true}>

        {currentSlide.children}
        <button className={styles.nextButton} onClick={goToNextSlide}>
          <img src={nextButtonImg} alt="Next" className={styles.nextIcon} />
        </button>
      </SlideView>
      
      {configData.developerOptions ? <div style={{width:"300px"}}>

        {renderCurrentSelection()}
        <button onClick={goToPreviousSlide} disabled={currentSlideIndex === 0}>
          Previous
        </button>
        <button onClick={goToNextSlide} disabled={currentSlideIndex === allSlides.length - 1}>
          Next
        </button>
      </div> : <></>
      }

    </div>
  );
};

export default SlideShow;