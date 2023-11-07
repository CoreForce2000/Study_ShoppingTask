import React, { useState } from 'react';
import styles from './Checkbox.module.css';
import { CheckboxOption } from '../../SlideShowInterface';


interface CheckboxProps {
    initialOptions: string[]; // Change to initialOptions which is a string array
    allowMultiple: boolean; // Prop to control if multiple selections are allowed
    columnLayout: 'single' | 'double'; // Prop to control column layout
    onChange: (selectedOptions: string[]) => void; // Callback to pass the selected options to the parent
    fontSizeFactor: number;
}  

const Checkbox: React.FC<CheckboxProps> = ({ initialOptions, allowMultiple, columnLayout, onChange, fontSizeFactor=1 }) => {
  // Convert initialOptions to CheckboxOption[] and manage state internally
  const [options, setOptions] = useState<CheckboxOption[]>(
    initialOptions.map(label => ({ label, checked: false }))
  );

  // Function to toggle the checked state of a checkbox
  const toggleCheckbox = (index: number) => {
    const newOptions = options.map((option, i) => {
      if (allowMultiple) {
        // For multiple selections, toggle the checked state of the clicked checkbox
        return i === index ? { ...option, checked: !option.checked } : option;
      } else {
        // For single selection, only the clicked checkbox is checked
        return i === index ? { ...option, checked: true } : { ...option, checked: false };
      }
    });

    // Update the internal state
    setOptions(newOptions);
    // Notify the parent component about the change
    onChange(newOptions.filter(option => option.checked).map(option => option.label));
  };

  return (
    <div className={styles.checkboxContainer} style={{ fontSize : `${fontSizeFactor*3}rem`, gridTemplateColumns: columnLayout === 'double' ? "1fr 1fr" : "1fr" }}>
      {options.map((option, index) => (
        <label key={index} style={{marginBottom: `${fontSizeFactor*0.5}rem`}} className={`${styles.checkboxLabel} ${columnLayout === 'double' ? (index % 2 === 0 ? styles.leftColumn : styles.rightColumn) : ''}`}>
          <input
            type="checkbox"
            checked={option.checked}
            onChange={() => toggleCheckbox(index)}
            className={styles.checkboxInput}
          />
          <span className={styles.customCheckbox} style={{marginTop: `${fontSizeFactor*1.2}rem`}}></span>
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default Checkbox;
