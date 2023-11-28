// SlideViewPort.tsx
import React, { useEffect, useState } from 'react';
import styles from './SlideView.module.css'; // Make sure the path is correct
import FullscreenView from '../FullscreenView/FullscreenView';
import nextButtonImg from '/src/assets/buttonNext.png'
import { useDispatch } from 'react-redux';
import { setSlideWidth } from '../../store/slideSlice';

interface SlideViewProps {
    backgroundImage?: string;
    children?: React.ReactNode;
    nextButton?: () => void;
    verticalAlign?: boolean;
}

const SlideView: React.FC<SlideViewProps> = ({ backgroundImage, children, nextButton, verticalAlign }) => {
  const dispatch = useDispatch();

  const aspectRatio = 3 / 4; // Height / Width
  const [slideStyle, setSlideStyle] = useState<React.CSSProperties>({});

  const updateDimensions = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowHeight / windowWidth;
    let newWidth, newHeight, fontSize;
  
    if (windowRatio >= aspectRatio) {
      newWidth = windowWidth;
      newHeight = windowWidth * aspectRatio;
    } else {
      newHeight = windowHeight;
      newWidth = windowHeight / aspectRatio;
    }
  
    // Assuming you want the font size to be a certain percentage of the width
    fontSize = newWidth * 0.05; // Example: 2% of the width
  
    const backgroundStyle = backgroundImage
      ? { backgroundImage: `url(${backgroundImage})` }
      : { backgroundColor: 'white' };
  
    setSlideStyle({
      width: `${newWidth}px`,
      height: `${newHeight}px`,
      fontSize: `${fontSize}px`, // Set the dynamic font size here
      ...backgroundStyle
    });
  
    dispatch(setSlideWidth(`${newWidth}px`));
  };

  useEffect(() => {
    // Update the dimensions when the window is resized
    window.addEventListener('resize', updateDimensions);
    updateDimensions(); // Also update dimensions on mount

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [backgroundImage]);

  return (
    <FullscreenView style={{background:"black", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <div style={slideStyle} className={styles.slideContainer}>
        {children}
        {nextButton ? <button className={styles.nextButton} onClick={nextButton}>
          <img src={nextButtonImg} alt="Next" className={styles.nextIcon} />
        </button> : <></>}
      </div>
    </FullscreenView>
  );
};

export default SlideView;
