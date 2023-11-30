import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css'; // Assuming you have a CSS module for styles

interface BackButtonProps {
  customStyle:React.CSSProperties;
}

const BackButton: React.FC<BackButtonProps> = ({ customStyle }) => {
  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This will take you back one step in the history stack
  };

  return (
    <div style={customStyle}>
      <img className={styles.backButton} src={'src/assets/back_button.png'} alt={"back-button"} onClick={goBack}/>
    </div>

  );
};

export default BackButton;
