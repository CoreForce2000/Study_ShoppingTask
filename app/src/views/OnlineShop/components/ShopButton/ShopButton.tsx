import React from 'react';
import styles from './ShopButton.module.css'; // Import the CSS module

// Define the props for the ShopButton component
type ShopButtonProps = {
    buttonType: 'back' | 'cart';
};

const ShopButton: React.FC<ShopButtonProps> = ({ buttonType }) => {
  // Determine the image based on the button type
  const getImageSrc = (type: string): string => {
    switch (type) {
      case 'back':
        return 'src/assets/back.png'; // Replace with your actual back image path
      case 'cart':
        return 'src/assets/cart.png'; // Replace with your actual cart image path
      default:
        return `src/assets/back.png`;
    }
  };

  return (
    <button className={styles.button}>
      <img src={getImageSrc(buttonType)} alt={buttonType} />
    </button>
  );
};

export default ShopButton;
