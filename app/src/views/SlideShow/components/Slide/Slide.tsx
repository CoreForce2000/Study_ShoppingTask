// SlideViewPort.tsx
import React, { useEffect, useState } from 'react';
import styles from './Slide.module.css'; // Make sure the path is correct

interface SlideProps {
    backgroundImage?: string;
    children: React.ReactNode;
}

const Slide: React.FC<SlideProps> = ({ backgroundImage, children }) => {
  const aspectRatio = 3 / 4; // Height / Width
  const [slideStyle, setSlideStyle] = useState<React.CSSProperties>({});

  const updateDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const windowRatio = height / width;
    let newWidth, newHeight;

    if (windowRatio > aspectRatio) {
      // Window is taller (relative to its width) than the aspect ratio
      newWidth = '100%';
      newHeight = `calc(${newWidth} * ${aspectRatio})`;
    } else {
      // Window is wider (relative to its height) than the aspect ratio
      newHeight = '100vh';
      newWidth = `calc(${newHeight} / ${aspectRatio})`;
    }
    const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : { backgroundColor: 'white' };

    setSlideStyle({
      width: newWidth,
      height: newHeight,
      ...backgroundStyle
    });
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
    <div style={slideStyle} className={styles.slideContainer}>
        {children}
    </div>
  );
};

export default Slide;
