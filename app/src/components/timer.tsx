import React, { useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectItemsInCart,
} from "../store/shopSlice";
import { RootState } from "../store/store";
import { shopConfig } from "../configs/config";
import { useTimer } from "react-use-precision-timer";
import { entryDataAtom } from "../sharedAtoms";
import { atom, useAtom } from "jotai";

interface TimerProps {
  page: string;
  onComplete: () => void;
  setInterSlide: Dispatch<SetStateAction<"timeIsRunningOut" | "extraBudget" | undefined>>;
}

const shopTimeAtom = atom(10*60)

const Timer: React.FC<TimerProps> = ({ page, onComplete, setInterSlide }) => {
  const dispatch = useDispatch();
  const [entryData] = useAtom(entryDataAtom);
  const itemsInCart = useSelector(selectItemsInCart);
  const budget = useSelector((state: RootState) => state.shop.budget);
  const [timer, setShopTime] = useAtom(shopTimeAtom);
  const isPhase3 = useSelector((state: RootState) => state.shop.isPhase3);

  // Timer tick function memoized
  const timerFunction = useCallback(() => {
    if (timer <= 1) {
      timerObject.stop();
      onComplete();
    } else {
      if (page != "cart") {
        setShopTime(prevShopTime=>prevShopTime-1);
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
      style={{ display: page === "cart" ? "none" : "block" }}
    >
      Timer: {formatTimeLeft()}
    </div>
  );
};

export default Timer;
