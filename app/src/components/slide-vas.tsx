import React, { useState } from "react";
import styles from "./slide-vas.module.css";

interface VASProps {
  minLabel: string;
  maxLabel: string;
  setValue: (value: number) => void; // Function to set the value in the parent state
  onClick?: () => void;
}

const VAS: React.FC<VASProps> = ({ minLabel, maxLabel, setValue }) => {
  const [indicatorPosition, setIndicatorPosition] = useState<number | null>(
    null
  );

  const handleVASClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // Click position relative to the line
    const width = rect.width; // Width of the line container
    const value = (x / width) * 100; // Convert the click position to a value from 0 to 100

    setIndicatorPosition(x); // Update the indicator's position
    setValue(value); // Update the value in the parent component
  };

  return (
    <div className={styles.rangeSlider}>
      <div className={styles.rangeSliderInner}>
        <span className={styles.label}>{minLabel}</span>
        <div className={styles.vasContainer} onClick={handleVASClick}>
          <div className={styles.line}></div>
          {indicatorPosition !== null && (
            <div
              className={styles.indicator}
              style={{ left: `${indicatorPosition}px` }} // Position the indicator
            ></div>
          )}
        </div>
        <span className={styles.label}>{maxLabel}</span>
      </div>
    </div>
  );
};

interface VASSlideProps {
  text: string;
  minLabel: string;
  maxLabel: string;
  setValue: (value: number) => void;
}

const VASSlide: React.FC<VASSlideProps> = ({
  text,
  minLabel,
  maxLabel,
  setValue,
}) => (
  <>
    <div className="absolute text-center top-4 text-black text-1em m-4 text-wrap">
      {text}
    </div>
    <div className="w-full p-4 flex justify-start">
      <div className="bg-white w-full mt-8">
        <VAS minLabel={minLabel} maxLabel={maxLabel} setValue={setValue} />
      </div>
    </div>
  </>
);

export default VASSlide;
