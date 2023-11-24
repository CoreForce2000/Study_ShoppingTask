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

  const beerProducts = useSelector((state: RootState) => selectItemsByCategory(state, "Beer"));
  const cocaineProducts = useSelector((state: RootState) => selectItemsByCategory(state, "Cocaine"));
  const heroinProducts = useSelector((state: RootState) => selectItemsByCategory(state, "Heroin"));
  const yogaProducts = useSelector((state: RootState) => selectItemsByCategory(state, "Yoga"));
  const bbqProducts = useSelector((state: RootState) => selectItemsByCategory(state, "BBQ"));

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

  const allSlides: Slide[] = [offLightbulbSlide, blueLightbulbSlide, orangeLightbulbSlide, receiveItemSlide];

  const transitionSlide = () => {
    switch (currentSlide.type) {
      case 'offLightbulb':
        // Randomly select between blue and orange lightbulb
        setCurrentSlide(Math.random() < 0.5 ? blueLightbulbSlide : orangeLightbulbSlide);
        break;
      case 'coloredLightbulb':
        // Determine if an item is received
        if (calculateItemReceivingChance(currentBlock, pressedButton)) {
          setCurrentSlide(receiveItemSlide);
        } else {
          // End of trial, reset to off-lightbulb
          setCurrentSlide(offLightbulbSlide);
          // Reset the button press state for the next trial
          setPressedButton(false);
          // Handle block transition or trial count here (if needed)
        }
        break;
      case 'receiveItem':
        // End of trial, reset to off-lightbulb
        setCurrentSlide(offLightbulbSlide);
        // Reset the button press state for the next trial
        setPressedButton(false);
        // Handle block transition or trial count here (if needed)
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
      if (event.code === inputKey && currentSlide.type === 'coloredLightbulb') {
        setPressedButton(true);
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide.type, inputKey]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      transitionSlide();
    }, slideTimings[currentSlide.type]); // Using dynamic timing based on slide type
  
    return () => clearTimeout(250);
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
