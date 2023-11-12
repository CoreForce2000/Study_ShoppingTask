// CategoryTile.tsx
import React, { useEffect, useState } from 'react';
import styles from './CategoryTile.module.css'; // Import the CSS module
import { useNavigate } from 'react-router-dom';

// Define the props for the CategoryTile component
type CategoryTileProps = {
    categoryName: string;
};

const CategoryTile: React.FC<CategoryTileProps> = ({ categoryName }) => {
  const navigate = useNavigate();

  
  const [goTo, setGoTo] = useState(false);
  
  // Check sessionStorage for the clicked state of the tile
  const getInitialClickedState = () => {
    const savedState = sessionStorage.getItem(`afterShadow_${categoryName}`);
    console.log(`Loaded state for ${categoryName}:`, savedState);
    return savedState == 'true';
  };

  const [afterShadow, setAfterShadow] = useState(getInitialClickedState);

  // Update sessionStorage when the afterShadow state changes
  useEffect(() => {
    sessionStorage.setItem(`afterShadow_${categoryName}`, afterShadow.toString());
  }, [afterShadow, categoryName]);

  useEffect(() => {
    if (goTo) {
      navigate(`/shop?page=item&name=${encodeURIComponent(categoryName)}`);
    }
  }, [goTo, categoryName]);

  const handleClick = () => {
    setAfterShadow(true)
    setGoTo(true)
  }

  const tileStyle = afterShadow ? {
    // backgroundColor: "rgb(227, 110, 150)",
    textDecoration: "underline"
  } : {};


  return (
    <div
      className={styles.tile}
      onClick={handleClick}
      style={tileStyle}
    >
      {categoryName}
    </div>
  );
};

export default CategoryTile;
