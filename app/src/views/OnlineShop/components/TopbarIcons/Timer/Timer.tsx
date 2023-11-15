// Timer.tsx
import React, { useState, useEffect } from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  onComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ onComplete }) => {
  // Set initial time to 15 minutes (900 seconds)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    // Exit early and call onComplete when we reach 0
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    // Decrease time left by one second every second
    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    // Clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // No dependencies array, so it runs once on mount and unmount only
  }, []);

  // Format timeLeft into minutes and seconds
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
