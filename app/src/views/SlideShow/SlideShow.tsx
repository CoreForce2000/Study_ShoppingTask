import React, { useState, useEffect } from 'react';
import styles from './SlideShow.module.css';
import SlideView from '../../components/SlideView/SlideView';
import Checkbox from './components/Checkbox/Checkbox';
import VAS from './components/VAS/VAS';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import nextButtonImg from '/src/assets/buttonNext.png'
import { useNavigate } from 'react-router-dom';

// Define a type for the survey responses
interface SurveyResponse {
  onlineShoppingFrequency: string[];
  selectedDrugs: string[];
  drugDosages: Record<string, number>; // This will store the dosage for each drug
  shoppingSatisfaction: number;
}

type SurveyResponseKey = keyof SurveyResponse;

interface BaseSlides {
  slide: string;
  children: React.ReactNode;
  transit?: string;
  variable?: SurveyResponseKey;

}


const SlideShow: React.FC = () => {
  const navigate = useNavigate();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [valueChanged, setValueChanged] = useState(false);
  const [numVasSlides, setNumVasSlides] = useState(0);

  const configData = useSelector((state: RootState) => state.config);

  // Initialize a single state object for all survey responses
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse>({
    onlineShoppingFrequency: [],
    selectedDrugs: [],
    drugDosages: {},
    shoppingSatisfaction: 0,
  });



  // Handlers for updating the survey responses
  const setOnlineShoppingFrequency = (selection: string[]) => {
    setSurveyResponses((prev) => ({
      ...prev,
      onlineShoppingFrequency: selection,
    }));
    setValueChanged(true)
  };

  const setSelectedDrugs = (selection: string[]) => {
    setSurveyResponses((prev) => ({
      ...prev,
      selectedDrugs: selection,
    }));
    setValueChanged(true)
  };

  const setDrugDosage = (drug: string, dosage: number) => {
    setSurveyResponses((prev) => ({
      ...prev,
      drugDosages: {
        ...prev.drugDosages,
        [drug]: dosage,
      },
    }));
    setValueChanged(true)
  };

  const setShoppingSatisfaction = (satisfaction: number) => {
    setSurveyResponses((prev) => ({
      ...prev,
      shoppingSatisfaction: satisfaction,
    }));
    setValueChanged(true)
  };

  // ... slides setup
  
  // Method to render the current selection
  const renderCurrentSelection = () => {
    return (
      <div className={styles.selectionTracker}>
        <p>Online Shopping Frequency: {surveyResponses.onlineShoppingFrequency.join(', ')}</p>
        <p>Selected Drugs: {surveyResponses.selectedDrugs.join(', ')}</p>
        <p>Drug Dosages: {JSON.stringify(surveyResponses.drugDosages)}</p>
      </div>
    );
  };

  const getVasSlides = (drug: string): BaseSlides => {
    return {slide:'',
          children:
          <>
            <div style={{position:"absolute", textAlign:"center", top:"2rem", fontSize:"3rem", color:"black"}}> {`How much do you want to use ${drug} right now?`} </div>
            <div style={{width:"100%", padding:"7%", display:"flex", justifyContent:"left"}}>
              <div style={{backgroundColor:"white", width:"100%", marginTop:"20%"}}>
                <VAS key={drug}  minLabel='Not at all' maxLabel='Very much' setValue={(dosage) => setDrugDosage(drug, dosage)} />
              </div>
            </div>
          </>,
          variable:"drugDosages"
          }
  }

  
  const goToNextSlide = () => {
    const currentSlide = allSlides[currentSlideIndex]

    console.log(currentSlide.variable)
    if(currentSlide.variable) {
      if(!valueChanged) {
        return
      }
    }
    setValueChanged(false)
    
    setCurrentSlideIndex((prevIndex) => prevIndex + 1);
    if (currentSlide.transit === "VAS_FOLLOWUP") {
      // Generate VAS slides for each selected drug
      const vasSlides: BaseSlides[] = surveyResponses.selectedDrugs.map((drug) => (
        getVasSlides(drug)
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
  }

  
  const baseSlides: BaseSlides[] = [

    {slide:`/src/assets/slides/Phase1/Slide1.png`,
    children: <div style={{width:"100%", padding:"7%", display:"flex", justifyContent:"left"}}>
                <div style={{backgroundColor:"white", width:"100%", marginTop:"20%"}}> 
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
                  onChange={setOnlineShoppingFrequency}
                  fontSizeFactor={1}
                />
                </div>
              </div>,
    variable:"onlineShoppingFrequency"
  },

  {slide:`/src/assets/slides/Phase1/Slide2.png`,
  children: <div style={{width:"100%", padding:"7%", display:"flex", justifyContent:"left"}}>
              <div style={{backgroundColor:"white", width:"100%", marginTop:"20%"}}> 
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
                      "None of these"
                    ]
                  } // Replace with actual options
                  allowMultiple={true}
                  columnLayout="double"
                  onChange={setSelectedDrugs}
                  fontSizeFactor={0.8}
                /> </div>
            </div>,
  transit:"VAS_FOLLOWUP",
  variable:"selectedDrugs"},

  {slide:`/src/assets/slides/Phase1/Cover.png`, children: <></>},
  {slide:`/src/assets/slides/Phase1/Slide3.png`, children: <></>},
  {slide:`/src/assets/slides/Phase1/Slide4.png`, children: <></>},
  {slide:`/src/assets/slides/Phase1/Slide5.png`, children: <></>},
  {slide:`/src/assets/slides/Phase1/Slide6.png`, children: <></>, transit:"SHOP"},


  {slide:`/src/assets/slides/Phase2/Slide1.png`, children: <></>},
  {slide:`/src/assets/slides/White.png`, children: 
    <>
    <div style={{position:"absolute", textAlign:"center", top:"2rem", fontSize:"3rem", color:"black"}}> {`Please indicate on the line below how satisfied you are with your purchases`} </div>
    <div style={{width:"100%", padding:"7%", display:"flex", justifyContent:"left"}}>
      <div style={{backgroundColor:"white", width:"100%", marginTop:"20%"}}>
        <VAS minLabel='Not at all' maxLabel='Very much' setValue={setShoppingSatisfaction} />
      </div>
    </div>
    </>,
    variable:"shoppingSatisfaction"
  },
]


  const [allSlides, setAllSlides] = useState([...baseSlides]);


  // When rendering, use the allSlides array
  const currentSlide = allSlides[currentSlideIndex];



  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => prevIndex - 1);
  };

  // Render the current slide and selection state
  return (
    <div className={styles.slideShow}>
      <SlideView backgroundImage={currentSlide.slide} >

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