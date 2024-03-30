import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTimer, decrementTimer, selectItemsInCart, setTimer } from '../../../../store/shopSlice';
import styles from './Timer.module.css';
import { RootState } from '../../../../store/store';
import { shopConfig } from '../../../../configs/config';
import { shopConfigDev } from '../../../../configs/developerConfig';
import { selectIsDeveloperOptions } from '../../../../store/configSlice';

interface TimerProps {
  onComplete: () => void;
  setInterSlide: (slide: any) => void;
}

const Timer: React.FC<TimerProps> = ({ onComplete, setInterSlide }) => {
  const dispatch = useDispatch();
  const timer = useSelector(selectTimer);

  const budget = useSelector((state: RootState )=>state.shop.budget);
  const itemsInCart = useSelector(selectItemsInCart);

  const isDeveloperMode = useSelector(selectIsDeveloperOptions)
  const initialTime = isDeveloperMode? shopConfigDev.initialTime:shopConfig.initialTime

  useEffect(() => {
    if(timer == shopConfig.initialTime) {
      dispatch(setTimer(initialTime));
    }
    return () => {
      // Cleanup logic here
    };
  }, []);

  useEffect(() => {

    const intervalId = setInterval(() => {
      if (timer <= 1) {
        clearInterval(intervalId);
        onComplete();
      } else {
        dispatch(decrementTimer()); // Dispatch the decrementTimer action
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [dispatch, timer, onComplete]);

  const formatTimeLeft = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
     

    if ( 
      (timer == initialTime / 2) && 
      ((budget >= shopConfig.halfTimeNotificationWhenBudgetMoreThan) &&
      (itemsInCart.length < shopConfig.halfTimeNotificationWhenItemsLessThan) )
    ) {
      setInterSlide(`timeIsRunningOut`)
      dispatch(decrementTimer()); 
    }

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.timer}>
      Timer : {formatTimeLeft()}
    </div>
  );
};

export default Timer;