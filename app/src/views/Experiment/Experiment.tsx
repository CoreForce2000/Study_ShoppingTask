// Experiment.tsx
import React, { useState, useEffect } from 'react';
import SlideView from '../../components/SlideView/SlideView';

import styles from './Experiment.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { selectItemsByCategory } from '../../store/shopSlice';

// Experiment.tsx
import { experimentConfig } from '../../configs/experimentConfig';

const { slideTimings, inputKey, probabilities } = experimentConfig;

// Use these values throughout your component



// Slide.ts
export interface Slide {
  type: SlideType;
  image: string;
  allowKeyPress: boolean;
}


export interface SlideViewProps {
backgroundImage: string;
children: React.ReactNode;
onTimeout: () => void;
slideDuration: number;
}

type BlockType = 'nonDegraded' | 'partiallyDegraded' | 'fullyDegraded';
type SlideType = 'offLightbulb' | 'coloredLightbulb' | 'receiveItem' | 'none';


const Experiment: React.FC = () => {
  const dispatch = useDispatch();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [currentBlock, setCurrentBlock] = useState<BlockType>('nonDegraded');
  const [pressedButton, setPressedButton] = useState<boolean>(false);
  
  // In Experiment component's state
  const [currentSlideType, setCurrentSlideType] = useState<SlideType>('offLightbulb');

  const drugCategories = ["Beer", "Cocaine", "Heroin"];
  const nonDrugCategories = ["Yoga", "BBQ"];

  const drugProducts = useSelector((state: RootState) =>
    drugCategories.flatMap(category => selectItemsByCategory(state, category))
  );
  const nonDrugProducts = useSelector((state: RootState) =>
    nonDrugCategories.flatMap(category => selectItemsByCategory(state, category))
  );



  // In Experiment.tsx or a separate slides data file

  const pathToSlides = 'src/assets/slides/contingency/'

  const offLightbulbSlide: Slide = {
    type: 'offLightbulb',
    image: pathToSlides + "Slide1.PNG", // Replace with the actual path
    allowKeyPress: false
  };

  const blueLightbulbSlide: Slide = {
    type: 'coloredLightbulb',
    image: pathToSlides + "Slide3.PNG", // Replace with the actual path
    allowKeyPress: true
  };

  const orangeLightbulbSlide: Slide = {
    type: 'coloredLightbulb',
    image: pathToSlides + "Slide2.PNG", // Replace with the actual path
    allowKeyPress: true
  };

  const receiveItemSlide: Slide = {
    type: 'receiveItem',
    image: pathToSlides + "Slide4.PNG", // Replace with the actual path
    allowKeyPress: false
  };

  const [currentSlide, setCurrentSlide] = useState<Slide>(offLightbulbSlide);

  const transitionSlide = () => {
    switch (currentSlide.type) {
      case 'offLightbulb':
        // Randomly select between blue and orange lightbulb
        setCurrentSlide(Math.random() < 0.5 ? blueLightbulbSlide : orangeLightbulbSlide);
        break;
      case 'coloredLightbulb':
        // If the button was pressed during the coloredLightbulb slide
        if (pressedButton) {
          if (calculateItemReceivingChance(currentBlock, true)) {
            // If an item is received, show the receiveItem slide
            const selectedItem = (currentSlide === blueLightbulbSlide ? nonDrugProducts : drugProducts)
              [Math.floor(Math.random() * (currentSlide === blueLightbulbSlide ? nonDrugProducts.length : drugProducts.length))];
            setCurrentSlide({
              ...receiveItemSlide,
              image: selectedItem.image_name // Assuming each item has an 'imagePath'
            });
          } else {
            // If no item is received, go back to offLightbulb
            setCurrentSlide(offLightbulbSlide);
          }
        } else {
          // If no button press, transition back to offLightbulb
          setCurrentSlide(offLightbulbSlide);
        }
        // Reset the button press state for the next trial
        setPressedButton(false);
        break;
      case 'receiveItem':
        // After showing receiveItem, transition back to offLightbulb
        setCurrentSlide(offLightbulbSlide);
        // Reset the button press state for the next trial
        setPressedButton(false);
        break;
    }
  };
  
  

  const calculateItemReceivingChance = (blockType: BlockType, buttonPressed: boolean): boolean => {
    let probability = 0;
    const blockProbabilities = probabilities[blockType];
  
    probability = buttonPressed ? blockProbabilities.pressButton : blockProbabilities.noPressButton;
  
    return Math.random() < probability;
  };
  

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === inputKey && currentSlide.allowKeyPress && !pressedButton) {
        setPressedButton(true);
        // Immediately determine if an item is received and transition
        if (calculateItemReceivingChance(currentBlock, true)) {
          setCurrentSlide(receiveItemSlide);
        } else {
          setCurrentSlide(offLightbulbSlide);
          setPressedButton(false); // Reset for the next trial
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputKey, currentSlide.allowKeyPress, pressedButton, currentBlock]);
  

useEffect(() => {
  // Set a timer for the current slide
  const timer = setTimeout(() => {
    transitionSlide();
  }, slideTimings[currentSlide.type]);

  // Cleanup function to clear the timer if the slide changes
  return () => clearTimeout(timer);
}, [currentSlide, slideTimings]);


  return (
    <div className={styles.experiment}>
      <SlideView
        backgroundImage={currentSlide.image}
        // Include other props or content as needed
      >
        {/* Additional content for the slide */}
      </SlideView>
    </div>
  );

};

export default Experiment;
