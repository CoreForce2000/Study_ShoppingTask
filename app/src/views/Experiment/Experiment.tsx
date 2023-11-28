// Experiment.tsx
import React, { useState, useEffect } from 'react';
import SlideView from '../../components/SlideView/SlideView';

import styles from './Experiment.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { selectItemsByCategory } from '../../store/shopSlice';

// Experiment.tsx
import { experimentConfig } from '../../configs/config';
import { config } from '../../configs/config';
import { preloadImage } from '../../util/imageLoading';

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
type SlideType = 'offLightbulb' | 'coloredLightbulb' | 'receiveItem' | 'offLightbulbNoItem';


const Experiment: React.FC = () => {
  const dispatch = useDispatch();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [currentBlock, setCurrentBlock] = useState<BlockType>('nonDegraded');
  const [pressedButton, setPressedButton] = useState<boolean>(false);
  
  // In Experiment component's state
  const [currentSlideType, setCurrentSlideType] = useState<SlideType>('offLightbulb');

  const drugCategories = ["Beer"];
  const nonDrugCategories = ["Yoga", "BBQ"];

  const [drugProducts, setDrugProducts] = useState(useSelector((state: RootState) =>
          drugCategories.flatMap(category => selectItemsByCategory(state, category))
        ))

  const [nonDrugProducts, setNonDrugProducts] = useState(useSelector((state: RootState) =>
          nonDrugCategories.flatMap(category => selectItemsByCategory(state, category))
        ));

  // In Experiment.tsx or a separate slides data file

  const pathToSlides = 'src/assets/slides/contingency/'

  const offLightbulbSlide: Slide = {
    id:"offLightbulb",
    type: 'offLightbulb',
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
    
  }, []); // Include drugProducts and nonDrugProducts in the dependency array
  

  useEffect(() => {
    console.log(drugProducts)
  }, [drugProducts])

  
  useEffect(() => {
    console.log(nonDrugProducts)
  }, [nonDrugProducts])

  const transitionSlide = () => {
    switch (currentSlide.type) {
      case 'offLightbulb':
        // Randomly select between blue and orange lightbulb
        setCurrentSlide(Math.random() < 0.5 ? blueLightbulbSlide : orangeLightbulbSlide);
        setPressedButton(false);
        break;
      case 'coloredLightbulb':
        // If the button was pressed during the coloredLightbulb slide
        if (pressedButton) {

          // If an item is received, show the receiveItem slide
          const selectedItem = (currentSlide.id == 'blueLightbulb' ? nonDrugProducts : drugProducts)
            [Math.floor(Math.random() * (currentSlide.id == 'blueLightbulb' ? nonDrugProducts.length : drugProducts.length))];
          
          const imagePath = `${config.IMAGE_BASE_PATH}${selectedItem.category}/${selectedItem.image_name}`;

          preloadImage(imagePath);

          if (calculateItemReceivingChance(currentBlock, true)) {
              
              setCurrentSlide({
              ...receiveItemSlide,
              itemImage: imagePath // Assuming each item has an 'imagePath'
              });
              
              // Reset the button press state for the next trial
              setPressedButton(false);
          } else {
            // If no item is received, transition back to offLightbulb
            setCurrentSlide(offLightbulbNoItemSlide);
            setPressedButton(false);
          }
        } else {
          // If no button press, transition back to offLightbulb
          setCurrentSlide(offLightbulbSlide);
        }
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
        console.log("SPACE pressed")
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputKey, currentSlide.allowKeyPress, pressedButton, currentBlock]);
  


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
      {currentSlide.type === 'receiveItem' && currentSlide.itemImage && (
        <img src={currentSlide.itemImage} alt="Item" className={styles.itemImage} />
      )}
      {/* Include any other children or elements here */}
    </SlideView>
  </div>
);

};

export default Experiment;
