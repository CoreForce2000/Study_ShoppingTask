import React, { useEffect, useState } from "react";
import config from "../assets/configs/config.json";
import useTaskStore from "../store/store";
import styles from "./tile.module.css"; // Updated CSS module

type TileState = "none" | "categoryClicked" | "itemClicked";

type TileProps = {
  text: string;
  actionName?: string;
  imageUrl?: string;
  backgroundColor: string;
  tileState: TileState;
  onClick?: () => void;
  onClickTimeout?: () => void;
  backgroundIsBlack?: boolean;
  showCheckbox?: boolean;
  onTileSelect?: (tileName: string, isSelected: boolean) => void; // Callback for managing selected tiles
  setChecked?: boolean;
};

const Tile: React.FC<TileProps> = ({
  actionName,
  text,
  imageUrl,
  backgroundColor,
  tileState,
  onClick,
  onClickTimeout,
  backgroundIsBlack,
  showCheckbox = false,
  onTileSelect = () => {},
  setChecked = false,
}) => {
  const store = useTaskStore();

  const [tileStyle, setTileStyle] = useState<React.CSSProperties>({
    backgroundColor: backgroundColor,
  });

  // Split text if it has two words, or if it is too long
  let newText = text;
  if (text.includes(" ")) {
    newText = text.split(" ").join("\n");
  } else if (text.length > 12) {
    newText = text.slice(0, 12) + "\n" + text.slice(12);
  }

  const [displayText, setDisplayText] = useState(newText);
  const [isChecked, setIsChecked] = useState(setChecked); // New state for checkbox

  useEffect(() => {
    if (tileState === "categoryClicked") {
      setTileStyle({ backgroundColor: config.colors.clickedCategoryTileColor });
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

  // Split text into two lines

  return (
    <div
      className={styles.tile}
      onClick={() => {
        if (showCheckbox) {
          handleCheckboxClick();
        } else {
          setTileStyle({ ...tileStyle, border: "2px solid black" });
        }
        if (onClick) onClick();
        if (onClickTimeout) {
          setTimeout(() => {
            onClickTimeout();
            if (actionName) store.logShopAction(actionName);
          }, 500);
        } else {
          if (actionName) store.logShopAction(actionName);
        }
      }}
      style={{
        ...tileStyle,
        fontSize: text.split(" ")[0].length > 10 ? "0.3em" : "0.33em",
      }}
    >
      <div
        className={styles.tickBox}
        style={{
          backgroundColor: config.colors.checkboxColorInCart,
          visibility: showCheckbox ? "visible" : "hidden",
        }}
      >
        {isChecked && <span>X</span>}
      </div>
      <span>{displayText}</span>
    </div>
  );
};

export default Tile;
