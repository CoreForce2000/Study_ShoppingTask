import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css'; // Assuming you have a CSS module for styles

interface BackButtonProps {
  customStyle?: React.CSSProperties;
}

const BackButton: React.FC<BackButtonProps> = ({ customStyle }) => {
  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This will take you back one step in the history stack
  };

  return (
    <button className={styles.button} onClick={goBack} style={customStyle}>
      Back
    </button>
  );
};

export default BackButton;
