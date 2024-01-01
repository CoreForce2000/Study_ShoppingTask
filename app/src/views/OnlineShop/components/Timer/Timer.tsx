import React, { useState, useEffect, useRef } from 'react';
import styles from './Timer.module.css';
import { shopConfig } from '../../../../configs/config';
import { shopConfigDev } from '../../../../configs/developerConfig';
import { useSelector } from 'react-redux';
import { selectIsDeveloperOptions } from '../../../../store/configSlice';

interface TimerProps {
  onComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ onComplete }) => {

  const isDeveloperMode = useSelector(selectIsDeveloperOptions)

  const [timeLeft, setTimeLeft] = useState(isDeveloperMode?shopConfig.initialTime:shopConfigDev.initialTime);
  const timeLeftRef = useRef(timeLeft); // Create a ref to track timeLeft

  useEffect(() => {
    timeLeftRef.current = timeLeft; // Update ref value when timeLeft changes
  }, [timeLeft]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timeLeftRef.current <= 1) {
        clearInterval(intervalId);
        onComplete();
      } else {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        timeLeftRef.current -= 1; // Update ref inside interval
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onComplete]); // Add onComplete to the dependency array

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.timer}>
      Timer : {formatTimeLeft()}
    </div>
  );
};

export default Timer;
