// StyledCheckboxes.tsx
import React, { useState } from 'react';
import styles from './Checkbox.module.css';
import { CheckboxOption } from '../../SlideShowInterface';

interface CheckboxProps {
    options: CheckboxOption[];
    setOptions: (options: CheckboxOption[]) => void;
}  

const StyledCheckboxes: React.FC<CheckboxProps> = ( { options, setOptions } ) => {

  // Function to toggle the checked state of a checkbox
  const toggleCheckbox = (index: number) => {
    // Uncheck all options
    const newOptions = options.map((option) => ({
      ...option,
      checked: false
    }));

    // Check the selected option
    newOptions[index].checked = true;

    // Update the state with the new options
    setOptions(newOptions);
  };

  return (
    <div className={styles.checkboxContainer}>
      {options.map((option, index) => (
        <label key={index} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={option.checked}
            onChange={() => toggleCheckbox(index)}
            className={styles.checkboxInput}
          />
          <span className={styles.customCheckbox}></span>
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default StyledCheckboxes;
