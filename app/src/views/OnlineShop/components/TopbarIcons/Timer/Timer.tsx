import React from 'react';
import styles from './Timer.module.css';

interface TimerProps {
}

const Timer: React.FC<TimerProps> = ({ }) => {


    return (
        <div className={styles.timer}>
            Timer
        </div>
    );
};

export default Timer;



