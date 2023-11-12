// ItemTile.tsx
import React, { useState } from 'react';
import styles from './ItemTile.module.css'; // Import the CSS module

// Define the props for the ItemTile component
type ItemTileProps = {
    categoryName: string;
    imageName: string;
    onClick: () => void;
};

const ItemTile: React.FC<ItemTileProps> = ({ categoryName, imageName, onClick }) => {
  const [showImage, setShowImage] = useState(false);

  let imageUrl = `url('src/assets/categories/${categoryName}/${imageName}')`;

  const handleClick = () => {
    setShowImage(true);
  };

  const tileStyle = showImage ? {
    backgroundImage: imageUrl,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'white',
    backgroundPosition: 'center center'
  } : {};

  return (
    <div
      className={styles.tile}
      onClick={()=> {handleClick(); onClick();} }
      style={tileStyle}
    >
      {!showImage && <span>{imageName}</span>}
    </div>
  );
};

export default ItemTile;
