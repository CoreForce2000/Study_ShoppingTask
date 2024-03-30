// Experiment.tsx
import React, { useState, useEffect } from 'react';
import SlideView from '../../components/SlideView/SlideView';

import styles from './Experiment.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { selectClickedItems, selectItemsByCategory, setTimer } from '../../store/shopSlice';

// Experiment.tsx
import { experimentConfig, shopConfig } from '../../configs/config';
import { config } from '../../configs/config';
import { preloadImage } from '../../util/imageLoading';
import { useOtherCategories } from './ExperimentHooks';
import { selectIsDeveloperOptions } from '../../store/configSlice';
import { experimentConfigDev } from '../../configs/developerConfig';
import { selectBlock, selectTrial, setBlock, setTrial } from '../../store/experimentSlice';
import { useNavigate } from 'react-router-dom';
import { resetState } from '../../store/shopSlice';

const { slideTimings, inputKey, probabilities } = experimentConfig;

// Use these values throughout your component

export interface Slide {
  id: string;
  type: SlideType;
  image: string; // Background image
  itemImage?: string; // Optional item image
  allowKeyPress: boolean;
}

export interface SlideViewProps {
backgroundImage: string;
children: React.ReactNode;
onTimeout: () => void;
slideDuration: number;
}

type BlockType = 'nonDegraded' | 'partiallyDegraded' | 'fullyDegraded';
type SlideType = 'offLightbulb' | 'coloredLightbulb' | 'receiveItem' | 'offLightbulbNoItem' | 'offLightbulb2';


const Experiment: React.FC = () => {
  const isDeveloperMode = useSelector(selectIsDeveloperOptions)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // const [currentBlock] = useState<number>(0);
  // const [currentTrial, setCurrentTrial] = useState<number>(0);

  // const [isVasSlide, setIsVasSlide] = useState<boolean>(false);

  // const correctClaimSound = new Audio(`${config.SOUND_PATH}correct_claim_phase2.mp3`);
  const ratingSound = new Audio(`${config.SOUND_PATH}rating_phase_2.mp3`);

  const [pressedButton, setPressedButton] = useState<boolean>(false);

  const otherCategories = useOtherCategories();
  const block = useSelector(selectBlock);
  const trial = useSelector(selectTrial);

  const [selfProducts] = useState(useSelector(selectClickedItems))

  const [otherProducts] = useState(useSelector((state: RootState) =>
          otherCategories.flatMap(category => selectItemsByCategory(state, category))
  ));

  const endOfPhase2Sound = new Audio(`${config.SOUND_PATH}End of phase2.mp3`);
  
  if(block === 7) {
    endOfPhase2Sound.play();
    navigate(`/slide`);
    dispatch(resetState());
    dispatch(setTimer(shopConfig.secondTime));
  }


  const [imagePath, setImagePath] = useState<string>("none");
 
  // In Experiment.tsx or a separate slides data file

  const pathToSlides = '/assets/slides/duringPhase2/'

  const offLightbulbSlide: Slide = {
    id:"offLightbulb",
    type: 'offLightbulb',
    image: pathToSlides + "Slide1.PNG", // Replace with the actual path
    allowKeyPress: false
  };

  const offLightbulbSlide2: Slide = {
    id:"offLightbulb2",
    type: 'offLightbulb2',
    image: pathToSlides + "Slide1.PNG", // Replace with the actual path
    allowKeyPress: false
  };

  const blueLightbulbSlide: Slide = {
    id:"blueLightbulb",
    type: 'coloredLightbulb',
    image: pathToSlides + "Slide3.PNG", // Replace with the actual path
    allowKeyPress: true
  };

  const orangeLightbulbSlide: Slide = {
    id:"orangeLightbulb",
    type: 'coloredLightbulb',
    image: pathToSlides + "Slide2.PNG", // Replace with the actual path
    allowKeyPress: true
  };

  const receiveItemSlide: Slide = {
    id:"receiveItem",
    type: 'receiveItem',
    image: pathToSlides + "Slide4.PNG", // Replace with the actual path
    allowKeyPress: false
  };

  const offLightbulbNoItemSlide: Slide = {
    id:"offLightbulbNoItem",
    type: 'offLightbulb',
    image: pathToSlides + "Slide1.PNG", // Replace with the actual path
    allowKeyPress: false
  };

  const [currentSlide, setCurrentSlide] = useState<Slide>(offLightbulbSlide);
  const [futureSlide, setFutureSlide] = useState<Slide>(offLightbulbSlide);

  useEffect(() => {
    // Existing slide paths
    const slideImagePaths = [
      pathToSlides + "Slide1.PNG",
      pathToSlides + "Slide2.PNG",
      pathToSlides + "Slide3.PNG",
      pathToSlides + "Slide4.PNG",
      // Add paths for any other slides you need to preload
    ];

    // Preload all images
    slideImagePaths.forEach(path => {
      preloadImage(path);
    });
    
  }, []); // Include selfProducts and otherProducts in the dependency array
  
  // const vasSlide = getVasSlides("Please indicate on the line below how satisfied you are with the items that you successfully claimed. ", 'Not at all', 'Very much', (value: number) => console.log(value));
  


  const transitionSlide = async () => {


    const currentBlockData = getBlockData(block);

    const onFinishTrial = () => {

      setPressedButton(false);
          
      dispatch(setTrial(trial + 1))

      // Check if the current trial exceeds the number of trials in the current block
      const totalTrialsInCurrentBlock = currentBlockData.numberOfTrials.self + currentBlockData.numberOfTrials.other;
      
      console.log("Total Trials in Current Block", totalTrialsInCurrentBlock)
      
      if (trial >= totalTrialsInCurrentBlock) {
        
        ratingSound.play();

        dispatch(setBlock(block + 1))

        // Reset the trial count
        dispatch(setTrial(1))

        navigate(`/slide?interSlide=vasExperiment`);

        // setIsVasSlide(true);
      } else {
        // setIsVasSlide(false);
      }
    }


    switch (currentSlide.type) {
      case 'offLightbulb':

        setFutureSlide(Math.random() < 0.5 ? blueLightbulbSlide : orangeLightbulbSlide);

        setPressedButton(false);
        setCurrentSlide(offLightbulbSlide2);
  
        // If an item is received, show the receiveItem slide
        const selectedItem = (futureSlide.id === 'blueLightbulb' ? otherProducts : selfProducts)
        [Math.floor(Math.random() * (futureSlide.id === 'blueLightbulb' ? otherProducts.length : selfProducts.length))];
      
        const localImagePath = `${config.IMAGE_BASE_PATH}${selectedItem.category}/${selectedItem.image_name}`;
        await preloadImage(localImagePath);
  
        setImagePath(localImagePath);
        console.log("Image Path", imagePath)
        break;

      case 'offLightbulb2':

        setCurrentSlide(futureSlide);
        break;

      case 'coloredLightbulb':
        // If the button was pressed during the coloredLightbulb slide



        if (calculateItemReceivingChance(currentBlockData.trialType, pressedButton)) {
            
            setCurrentSlide({
            ...receiveItemSlide, 
            });
            
            // Reset the button press state for the next trial
            setPressedButton(false);
            // correctClaimSound.play();
        } else {
          // If no item is received, transition back to offLightbulb
          setCurrentSlide(offLightbulbNoItemSlide);

          onFinishTrial()
        }
        break;

      case 'receiveItem':
        // After showing receiveItem, transition back to offLightbulb
        setCurrentSlide(offLightbulbSlide);
        // Reset the button press state for the next trial


        onFinishTrial()
        break;
    }
  };
  
  const calculateItemReceivingChance = (blockType: BlockType, buttonPressed: boolean): boolean => {
    let probability = 0;
    const blockProbabilities = probabilities[blockType];
  
    probability = buttonPressed ? blockProbabilities.pressButton : blockProbabilities.noPressButton;
  
    return Math.random() < probability;
  };

  const getBlockData = (blockNumber: number): any => {
    return isDeveloperMode?experimentConfigDev.trialSequence[blockNumber-1]:experimentConfig.trialSequence[blockNumber-1]
  };


  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === inputKey && currentSlide.allowKeyPress && !pressedButton) {
        setPressedButton(true);
        console.log("SPACE pressed")
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputKey, currentSlide.allowKeyPress, pressedButton, block]);

  
useEffect(() => {
  if (pressedButton) {
    // If the button is pressed, transition immediately
    transitionSlide();
  } else {
    // If the button is not pressed, set a timer for the current slide
    const timer = setTimeout(() => {
      transitionSlide();
    }, slideTimings[currentSlide.type].getRandomValue());

    // Cleanup function to clear the timer if the slide changes
    return () => clearTimeout(timer);
  }
}, [currentSlide, slideTimings, pressedButton]);



return (
  <div className={styles.experiment}>
    <SlideView
      backgroundImage={currentSlide.image}
    >
      <img src={imagePath} alt="Item" className={styles.itemImage} style={{visibility:currentSlide.type === 'receiveItem' && imagePath?"visible":"hidden" }}/>
      

     {/* <span className={styles.debugText}>{`Trial: ${trial}, Block: ${block}`}</span> */}
    </SlideView>
  </div>
);
};

export default Experiment;
