import React from "react";
import styles from './IconButton.module.css'; // Assuming styles are defined in this CSS file

interface IconButtonProps {
    iconUrl: string;
    text: string;
    onClick: () => void;
    visible: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ iconUrl, text, onClick, visible=true }) => {
    const buttonStyle = {
        visibility: visible ? "visible" : "hidden" as "visible" | "hidden"
    };

    return (
      <div className={styles.buttonStyle} onClick={onClick} style={buttonStyle}>
        <img src={iconUrl} alt="icon" className={styles.iconStyle} />
        <div>{text}</div>
      </div>
    );
  };

export default IconButton;