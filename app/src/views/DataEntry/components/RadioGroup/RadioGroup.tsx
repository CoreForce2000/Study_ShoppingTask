import React from 'react';
import styles from './RadioGroup.module.css';

interface RadioGroupProps {
    name: string;
    options: string[];
    value: string;
    setValue: (value: string) => void,
    required?: boolean
}

const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, value, setValue, required }) => {

  var radioButtons = options.map((option) => {
    return (
        <div className={styles.radioGroup}>
            <input
                key={option}
                type="radio"
                id={option}
                name={name}
                value={option}
                checked={value === option}
                onChange={() => setValue(option)}
                className={styles.radioButton}
                required={required}
            />
            <label htmlFor={option} className={styles.radioLabel}>{option}</label>
        </div>
    );
  });

  return (
    <div className={styles.radioGroup}>
        {
            radioButtons
        }
    </div>
  );
};

export default RadioGroup;



