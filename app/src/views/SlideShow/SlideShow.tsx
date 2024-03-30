import React, { useEffect, useState } from 'react';
import styles from './SlideShow.module.css';
import SlideView from '../../components/SlideView/SlideView';
import Checkbox from './components/Checkbox/Checkbox';
import VAS from './components/VAS/VAS';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import nextButtonImg from '/src/assets/buttonNext.png'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { config } from '../../configs/config.ts';
import { preloadImage } from '../../util/imageLoading.ts';
import { selectCurrentSlideIndex, setCurrentSlideIndex } from '../../store/slideSlice.ts';
import { getVasSlides } from '../../util/specialSlides.tsx';
import { createDispatchHandler } from '../../util/reduxUtils.ts';
import { InitialState, initialState, setDrugDosages, setOnlineShoppingFrequency, setSelectedDrugs, setPurchaseSatisfaction, areObjectsEqual, setDesireContinueShopping, setDrugDosages2, selectGroup, setClaimSatisfaction } from '../../store/surveySlice.ts';
import { customSlideText } from './SlideShowUtil.tsx';

type SkipNextIf = "GROUP_CONTROL";

export interface BaseSlides {
  slide: string;
  children: React.ReactNode;
  transit?: string;
  variable?: keyof InitialState;
  hideNext?: boolean;
  timeout?: number;
  skipNextIf?: SkipNextIf;
  transitDelay?: number;
}

const SlideShow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const currentSlideIndex = useSelector(selectCurrentSlideIndex);
  const data = useSelector((state: RootState) => state.survey);
  const dataEntryGroup = useSelector(selectGroup)
  const [initState, setInitState] = useState(initialState());

  const [interSlideIndex, setInterSlideIndex] = useState(0);  
  const [memoryCorrect, setMemoryCorrect] = useState<string[]>([]);

  const memoryCorrectSound = new Audio(`${config.SOUND_PATH}Memory correct.mp3`);
  const memoryWrongSound = new Audio(`${config.SOUND_PATH}Memory wrong.mp3`);
  const memoryAllCorrectSound = new Audio(`${config.SOUND_PATH}Memory all correct.wav`);

  const interSlide: string = searchParams.get("interSlide") || "";

  const checkIfCorrect = (selected:string, correct:string) => {
    if(selected === correct) {
      //adds new, then keeps only unique
      setMemoryCorrect(memoryCorrect => {
        if(memoryCorrect.length === 3) {
          memoryAllCorrectSound.play()
          // after a short delay navigate to shop
          setTimeout(()=>navigate('/shop'), 3000)

        } else {
          memoryCorrectSound.play()
        }
        
        return [...new Set([...memoryCorrect, selected])]
      })
    
    } else {
      memoryWrongSound.play()
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl or Command (for macOS) is pressed along with the B key
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault(); // Prevent the default action of Ctrl+B in the browser
        // Dispatch the action to update the currentSlideIndex
        dispatch(setCurrentSlideIndex(currentSlideIndex - 1));
      }
    };

    // Add the event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Remove the event listener on cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlideIndex, dispatch]); // Re-run the effect if currentSlideIndex changes


  const baseSlides: BaseSlides[] = [

    {slide:`${config.SLIDE_PATH}phase1/Slide1.JPG`,
    children: <div style={{marginTop:"3em", backgroundColor:"white", width:"100%", paddingLeft:"1.5em", display:"flex", justifyContent:"center"}}>
                <div style={{backgroundColor:"white"}}> 
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
                    onChange={(value) => {
                      createDispatchHandler(setOnlineShoppingFrequency, dispatch)(value);
                      goToNextSlide(true);
                    }}
                  />
                </div>
              </div>,
      variable: "onlineShoppingFrequency", hideNext:true, transitDelay:1000
    },

    ...(dataEntryGroup !== "Control" ? [

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
                      }
                      exclusiveOptions={[
                        "None of these"
                      ]}
                      allowMultiple={true}
                      columnLayout="double"
                      onChange={createDispatchHandler(setSelectedDrugs, dispatch)}
                    /> </div>
                </div>,
      transit:"VAS_FOLLOWUP",
      variable:"selectedDrugs" as keyof InitialState}

    ] : []),
    

    {slide:`${config.SLIDE_PATH}phase1/Slide5.JPG`, children: <></>, transit:"COVER", hideNext:true},
    {slide:`${config.SLIDE_PATH}phase1/Slide6.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase1/Slide7.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase1/Slide8.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase1/Slide9.JPG`, children: <></>, transit:"SHOP"},

    {slide:`${config.SLIDE_PATH}phase2/Slide12.JPG`, children: <></>, hideNext: true, timeout: 5000},
    {slide:`${config.SLIDE_PATH}White.png`, children: 
      <>
      <div style={{position:"absolute", textAlign:"center", top:"1em", fontSize:"1em", color:"black"}}> {`Please mark on the line below how satisfied you are with your purchases.`} </div>
              <div style={{width:"100%", padding:"1em", display:"flex", justifyContent:"left"}}>
                <div style={{backgroundColor:"white", width:"100%", marginTop:"2em"}}>
                  <VAS key="purchaseSatisfaction" minLabel='not at all satisfied' maxLabel='very satisfied' setValue={(value)=>{createDispatchHandler(setPurchaseSatisfaction, dispatch)(value);}} />
        </div>
      </div>
      </>,
    variable:"purchaseSatisfaction"
    },
    {slide:`${config.SLIDE_PATH}White.png`, children: 
    <>
    <div style={{position:"absolute", textAlign:"center", top:"1em", fontSize:"1em", color:"black"}}> {`Would you have liked to continue shopping?`} </div>
            <div style={{width:"100%", padding:"1em", display:"flex", justifyContent:"left"}}>
              <div style={{backgroundColor:"white", width:"100%", marginTop:"2em"}}>
                <VAS key="desireContinueShopping" minLabel='not at all' maxLabel='very much' setValue={(value)=>{createDispatchHandler(setDesireContinueShopping, dispatch)(value); }} />
      </div>
    </div>
    </>,
    transit:"VAS_FOLLOWUP_2",
    variable:"desireContinueShopping"
    },
    {slide:`${config.SLIDE_PATH}phase2/Slide16.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase2/Slide17.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase2/Slide18.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase2/Slide19.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase2/Slide20.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase2/Slide21.JPG`, children: <></>, transit:"CONTINGENCY"},
    
    {slide:`${config.SLIDE_PATH}phase3/Slide25.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}White.png`, children: 
      <>
      <div style={{position:"absolute", textAlign:"center", top:"1em", fontSize:"1em", color:"black"}}> {`Please mark on the line below how satisfied you are with the items that you successfully claimed.`} </div>
              <div style={{width:"100%", padding:"1em", display:"flex", justifyContent:"left"}}>
                <div style={{backgroundColor:"white", width:"100%", marginTop:"2em"}}>
                  <VAS key="claimSatisfaction" minLabel='not at all satisfied' maxLabel='very satisfied' setValue={(value)=>{createDispatchHandler(setClaimSatisfaction, dispatch)(value); }}/>
                </div>
              </div>
      </>,
    variable:"claimSatisfaction"
    },
    {slide:`${config.SLIDE_PATH}phase3/Slide27.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase3/Slide28.JPG`,
      children:     <div style={{fontSize: "0.75em", marginTop: "4.8em", width: "95%", paddingLeft: "0.7em", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0px"}}>
                      <div style={{backgroundColor: "white", width: "80%"}}> 
                        <Checkbox
                          key="column1"
                          initialOptions={["Perfume", "Flowers", "Umbrella", "Make-up", "Handbag"]}
                          columnLayout='single'
                          allowMultiple={false}
                          onChange={(itemsSelected)=>{ checkIfCorrect(itemsSelected[0], "Flowers") }}
                        />
                      </div>
                      <div style={{backgroundColor: "white", width: "80%"}}> 
                        <Checkbox
                          key="column2"
                          initialOptions={["Sunglasses", "Wine", "Chocolates", "Penknife", "Wallet"]}
                          columnLayout='single'
                          allowMultiple={false}
                          onChange={(itemsSelected)=>{ checkIfCorrect(itemsSelected[0], "Chocolates") }}
                        />
                      </div>
                      <div style={{backgroundColor: "white", width: "80%"}}> 
                        <Checkbox
                          key="column3"
                          initialOptions={["Lego", "Playmobile", "Barbie", "Chocolate", "Cuddly Toy"]}
                          columnLayout='single'
                          allowMultiple={false}
                          onChange={(itemsSelected)=>{ checkIfCorrect(itemsSelected[0], "Cuddly Toy") }}
                        />
                      </div>
                      <div style={{backgroundColor: "white", width: "80%"}}> 
                        <Checkbox
                          key="column4"
                          initialOptions={["BBQ", "Binoculars", "Book", "Plants", "Mug"]}
                          columnLayout='single'
                          allowMultiple={false}
                          onChange={(itemsSelected)=>{ checkIfCorrect(itemsSelected[0], "Book") }}
                        />
                      </div>
                    </div>,
        transit:"SHOP",
        hideNext: true
    },
    {slide:`${config.SLIDE_PATH}phase3/Slide29.JPG`, children: <></>},
    {slide:`${config.SLIDE_PATH}phase3/Slide30.JPG`, children: <></>, hideNext: true},
  ]


  const [allSlides, setAllSlides] = useState([...baseSlides]);

  let currentSlide: BaseSlides = { slide: "", children: <></> };

  const goToNextSlide = (forceTransit:boolean=false, forceTransitDelay:number=0) => {
    currentSlide = allSlides[currentSlideIndex]

    const transitDelay = forceTransitDelay || currentSlide.transitDelay || 0

    console.log("Transit delay", transitDelay)

    setTimeout(()=>{

      if(currentSlide.variable) {

        console.log(data[currentSlide.variable], initState[currentSlide.variable])

        if (!forceTransit) {
          if(areObjectsEqual(data[currentSlide.variable], initState[currentSlide.variable])) {
            return
          }
        }
      }
  
      setInitState(data)
      
      dispatch(setCurrentSlideIndex(currentSlideIndex + 1));
      console.log(currentSlideIndex)

  
      if (currentSlide.transit === "VAS_FOLLOWUP" || currentSlide.transit === "VAS_FOLLOWUP_2") {
  
        const setter = currentSlide.transit === "VAS_FOLLOWUP" ? setDrugDosages : setDrugDosages2
        const variable = currentSlide.transit === "VAS_FOLLOWUP" ? "drugDosages" : "drugDosages2"
  
        // Generate VAS slides for each selected drug
        const vasSlides: BaseSlides[] = data.selectedDrugs.filter((drug: string)=> drug !== "Other" && drug !== "None of these").map((drug: string) => (
          
          {slide:`${config.SLIDE_PATH}VasSlide.JPG`,
            children:getVasSlides(customSlideText(drug), 'not at all', 'very much', (value: number) => {(createDispatchHandler(setter, dispatch))({drug, value}); }  ),
            variable: variable,
            hideNext:false
            }
        ));
        
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
    }, transitDelay)
  }


  if ( interSlide ) {
    // let onClick = lastBlock? ()=> navigate("/slide"): ()=> navigate("/contingency")

    let onClick = (delay=1000)=> {
      setTimeout(()=>{
        setInterSlideIndex((currentInterSlideIndex)=> {
          currentInterSlideIndex = currentInterSlideIndex + 1
          if (currentInterSlideIndex == 3) {
            currentInterSlideIndex = 0
            navigate('/contingency')
          }
          return currentInterSlideIndex
        })
      }, delay)    
    }

    if ( interSlide === "vasExperiment") {
      
      const newSlideSequence = [
        {slide:`${config.SLIDE_PATH}White.png`,
          children:getVasSlides("Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR.", 'not at all', 'very much', 
          (value: number) => {(createDispatchHandler(setDrugDosages, dispatch))({drug:"vasExperiment", value}); }  )
          ,
          variable:"drugDosages",
          hideNext: true
        },
        {slide:`${config.SLIDE_PATH}/duringPhase2/SlideB2.PNG`, children: 

        <div style={{paddingTop: "3.5em", paddingLeft:"0.6em", display:"flex", width:"3em", gap:"2em", justifyContent:"center"}}>
        <Checkbox
        key="column8"
        initialOptions={[""]}
        columnLayout='single'
        allowMultiple={false}
        onChange={()=>onClick()}
      />
      <Checkbox
        key="column9"
        initialOptions={[""]}
        columnLayout='single'
        allowMultiple={false}
        onChange={()=>onClick()}
      />
        </div>,

       hideNext:true},
        {slide:`${config.SLIDE_PATH}/duringPhase2/SlideB3.PNG`, children: 
        <div style={{paddingTop: "3.5em", paddingLeft:"0.6em", display:"flex", width:"3em", gap:"2em", justifyContent:"center"}}>
        <Checkbox
        key="column10"
        initialOptions={[""]}
        columnLayout='single'
        allowMultiple={false}
        onChange={()=>onClick()}
      />
      <Checkbox
        key="column11"
        initialOptions={[""]}
        columnLayout='single'
        allowMultiple={false}
        onChange={()=>onClick()}
      />
        </div>, hideNext:true}
      ]

      let currentSlide = newSlideSequence[interSlideIndex]

      return (
        <div className={styles.slideShow}>
          <SlideView backgroundImage={currentSlide.slide} verticalAlign={true}>  
            {currentSlide.children}
            <button className={styles.nextButton} onClick={()=>onClick(0)} style={{visibility:currentSlide.hideNext?"hidden":"visible"}}>
              <img src={nextButtonImg} alt="Next" className={styles.nextIcon} />
            </button>
          </SlideView>
        </div>
      );
  }
  }

  useEffect(() => {
    const currentSlide = allSlides[currentSlideIndex];

    console.log("TIMEOUT", currentSlide.timeout)
    if ( currentSlide.timeout ) {

      const timer = setTimeout(()=> {
        goToNextSlide()
      }, currentSlide.timeout)

      return () => {
        clearTimeout(timer)
      }
    } else {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (currentSlideIndex < allSlides.length - 1) {
          if(!((event.ctrlKey || event.metaKey) && event.key === 'b')) {
            goToNextSlide();
          }
        }
      };

      if (currentSlide.transit === "COVER") {
        window.addEventListener('keydown', handleKeyPress);
      } else {
        window.removeEventListener('keydown', handleKeyPress);
      }

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }

  }, [currentSlideIndex]);

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
      `${config.SLIDE_PATH}shop/Slide10.JPG`,
      `${config.SLIDE_PATH}shop/Slide11.JPG`,
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

  // When rendering, use the allSlides array
  currentSlide = allSlides[currentSlideIndex];

  console.log("Current slide index", currentSlideIndex)


  // Render the current slide and selection state
  return (
    <div className={styles.slideShow}>
      <SlideView backgroundImage={currentSlide.slide} verticalAlign={true}>

        {currentSlide.children}
        <button className={styles.nextButton} onClick={()=>goToNextSlide()} style={{visibility:currentSlide.hideNext?"hidden":"visible"}}>
          <img src={nextButtonImg} alt="Next" className={styles.nextIcon} />
        </button>
      </SlideView>
    </div>
  );
};

export default SlideShow;