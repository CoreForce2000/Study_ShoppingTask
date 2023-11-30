import React, { useEffect, useState } from 'react';
import styles from './Tile.module.css'; // Updated CSS module

type TileState = 'none' | 'categoryClicked' | 'itemClicked';

type TileProps = {
    text: string;
    imageUrl?: string;
    backgroundColor: string;
    tileState: TileState;
    onClick: () => void;
};

const Tile: React.FC<TileProps> = ({ text, imageUrl, backgroundColor, tileState, onClick }) => {

  const [tileStyle, setTileStyle] = useState<React.CSSProperties>({backgroundColor: backgroundColor});
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    
    if (tileState === 'categoryClicked') {
      setTileStyle(
        {
          textDecoration: "underline",
          //color code for pink: #FFC0CB
          backgroundColor: "#c157db"
        } 
      ) 

    } else if (tileState === 'itemClicked') {

      setTileStyle(
        {
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'white',
          backgroundPosition: 'center center',
        } 
      )
      setDisplayText("");
    }

  }, [tileState, imageUrl]);

  
  return (
    <div
      className={styles.tile}
      onClick={onClick}
      style={tileStyle}
    >
      <span>{displayText}</span>
    </div>
  );
};

export default Tile;
