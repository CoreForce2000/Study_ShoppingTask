import React, { useState } from "react";
import styles from "./vas.module.css";

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

export default VAS;
