import React, { useEffect, useState } from "react";
import styles from "./tile.module.css"; // Updated CSS module

type TileState = "none" | "categoryClicked" | "itemClicked";

type TileProps = {
  text: string;
  imageUrl?: string;
  backgroundColor: string;
  tileState: TileState;
  onClick: () => void;
  backgroundIsBlack?: boolean;
  showCheckbox?: boolean;
  onTileSelect?: (tileName: string, isSelected: boolean) => void; // Callback for managing selected tiles
  setChecked?: boolean;
};

const Tile: React.FC<TileProps> = ({
  text,
  imageUrl,
  backgroundColor,
  tileState,
  onClick,
  backgroundIsBlack,
  showCheckbox = false,
  onTileSelect = () => {},
  setChecked = false,
}) => {
  const [tileStyle, setTileStyle] = useState<React.CSSProperties>({
    backgroundColor: backgroundColor,
  });
  const [displayText, setDisplayText] = useState(text);
  const [isChecked, setIsChecked] = useState(setChecked); // New state for checkbox

  useEffect(() => {
    if (tileState === "categoryClicked") {
      setTileStyle({ backgroundColor: shopConfig.clickedCategoryTileColor });
    } else if (tileState === "itemClicked") {
      setTileStyle({
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundColor: backgroundIsBlack ? "black" : "white",
        backgroundPosition: "center center",
      });
      setDisplayText("");
    }
  }, [tileState, imageUrl]);

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
    onTileSelect(text, !isChecked); // Update the list of selected tiles
  };

  return (
    <div
      className={styles.tile}
      onClick={
        showCheckbox
          ? () => {
              handleCheckboxClick();
              onClick();
            }
          : () => {
              onClick();
              setTileStyle({ ...tileStyle, border: "2px solid black" });
            }
      }
      style={tileStyle}
    >
      <div
        className={styles.tickBox}
        style={{
          backgroundColor: shopConfig.checkboxColorInCart,
          visibility: showCheckbox ? "visible" : "hidden",
        }}
      >
        {isChecked && <span>X</span>} {/* Display an X if checked */}
      </div>
      <span>{displayText}</span>
    </div>
  );
};

export default Tile;