import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTimer,
  decrementTimer,
  selectItemsInCart,
  setTimer,
} from "../../../../store/shopSlice";
import styles from "./Timer.module.css";
import { RootState } from "../../../../store/store";
import { shopConfig } from "../../../../configs/config";
import { shopConfigDev } from "../../../../configs/developerConfig";
import { selectIsDeveloperOptions } from "../../../../store/configSlice";
import { useTimer } from "react-use-precision-timer";

interface TimerProps {
  page: string;
  onComplete: () => void;
  setInterSlide: (slide: any) => void;
}

const Timer: React.FC<TimerProps> = ({ page, onComplete, setInterSlide }) => {
  const dispatch = useDispatch();
  const timer = useSelector(selectTimer);
  const itemsInCart = useSelector(selectItemsInCart);
  const budget = useSelector((state: RootState) => state.shop.budget);
  const isDeveloperMode = useSelector(selectIsDeveloperOptions);
  const isPhase3 = useSelector((state: RootState) => state.shop.isPhase3);
  const initialTime = isDeveloperMode
    ? shopConfigDev.initialTime
    : shopConfig.initialTime;

  // Set initial timer on mount
  useEffect(() => {
    if (timer === shopConfig.initialTime) {
      dispatch(setTimer(initialTime));
    }
  }, [dispatch, initialTime]);

  // Timer tick function memoized
  const timerFunction = useCallback(() => {
    if (timer <= 1) {
      timerObject.stop();
      onComplete();
    } else {
      if (page != "cart") {
        dispatch(decrementTimer());
        if (!isPhase3) {
          if (
            (timer === 5 * 60 && itemsInCart.length === 0) ||
            (timer === 2 * 60 && itemsInCart.length < 10)
          ) {
            timerObject.pause();
            setInterSlide("timeIsRunningOut");
            timerObject.pause();
          }
        } else {
          if (timer === 2.5 * 60 && itemsInCart.length === 0) {
            timerObject.pause();
            setInterSlide("timeIsRunningOut");
            timerObject.pause();
          }
        }
      }
    }
  }, [
    timer,
    dispatch,
    onComplete,
    budget,
    itemsInCart.length,
    initialTime,
    setInterSlide,
  ]);

  // Define the timer object
  const timerObject = useTimer({ delay: 1000 }, timerFunction);

  useEffect(() => {
    timerObject.start();
    return () => timerObject.stop();
  }, [timerObject]);

  // Format the remaining time
  const formatTimeLeft = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className={styles.timer}
      style={{ display: page === "cart" ? "none" : "block" }}
    >
      Timer: {formatTimeLeft()}
    </div>
  );
};

export default Timer;
