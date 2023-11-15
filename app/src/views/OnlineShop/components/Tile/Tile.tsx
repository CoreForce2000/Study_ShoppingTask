import React, { useEffect, useState } from 'react';
import styles from './Tile.module.css'; // Updated CSS module

type TileProps = {
    categoryName: string;
    imageName?: string;
    backgroundColor: string;
    onClick: () => void;
    type: 'category' | 'item'; // New prop to distinguish between category and item
};

const Tile: React.FC<TileProps> = ({ categoryName, imageName, backgroundColor, onClick, type }) => {
  const [isActive, setIsActive] = useState(false);

  // Check sessionStorage for the clicked state of the tile
  const getInitialClickedState = () => {
    const key = type === 'category' ? `afterShadow_${categoryName}` : `showImage_${imageName}`;
    const savedState = sessionStorage.getItem(key);
    console.log(`Loaded state for ${key}:`, savedState);
    return savedState === 'true';
  };

  const [clickedState, setClickedState] = useState(getInitialClickedState);

  // Update sessionStorage when the clickedState changes
  useEffect(() => {
    const key = type === 'category' ? `afterShadow_${categoryName}` : `showImage_${imageName}`;
    sessionStorage.setItem(key, clickedState.toString());
  }, [clickedState, categoryName, imageName, type]);

  useEffect(() => {
    if (isActive) {
      onClick();
    }
  }, [isActive, onClick]);

  const handleClick = () => {
    setClickedState(true);
    setIsActive(true);
  }

  let tileStyle = {};
  if (type === 'category') {
    tileStyle = clickedState ? {
      textDecoration: "underline",
      backgroundColor: backgroundColor,
    } : {
      backgroundColor: backgroundColor,
    };
  } else {
    let imageUrl = `url('src/assets/categories/${categoryName}/${imageName}')`;
    tileStyle = clickedState ? {
      backgroundImage: imageUrl,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'white',
      backgroundPosition: 'center center',
    } : {
      backgroundColor: backgroundColor,
    };
  }

  const displayText = type === 'category' ? categoryName : "";

  return (
    <div
      className={styles.tile}
      onClick={handleClick}
      style={tileStyle}
    >
      <span>{displayText}</span>
    </div>
  );
};

export default Tile;
