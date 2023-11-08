import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css'; // Assuming you have a CSS module for styles

const BackButton: React.FC = () => {
  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This will take you back one step in the history stack
  };

  return (
    <button className={styles.button} onClick={goBack}>
      Back
    </button>
  );
};

export default BackButton;
