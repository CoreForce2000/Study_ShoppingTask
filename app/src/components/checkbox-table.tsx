import React, { useState } from "react";
import styles from "./Checkbox.module.css"; // Ensure this CSS file exists and is correctly styled for four columns
import { CheckboxOption } from "./checkbox";

interface CheckboxTableProps {
  initialOptions: string[];
  exclusiveOptions?: string[];
  allowMultiple: boolean;
  onChange: (selectedOptions: string[]) => void;
}

const CheckboxTable: React.FC<CheckboxTableProps> = ({
  initialOptions,
  exclusiveOptions = [],
  allowMultiple,
  onChange,
}) => {
  const [options, setOptions] = useState<CheckboxOption[]>(
    [...initialOptions, ...exclusiveOptions].map((label) => ({
      label,
      checked: false,
    }))
  );

  const toggleCheckbox = (index: number) => {
    const isExclusive =
      options.some(
        (option) => option.checked && exclusiveOptions.includes(option.label)
      ) || exclusiveOptions.includes(options[index].label);

    const newOptions = options.map((option, i) => {
      if (allowMultiple && !isExclusive) {
        return i === index ? { ...option, checked: !option.checked } : option;
      } else {
        return i === index
          ? { ...option, checked: !option.checked }
          : { ...option, checked: false };
      }
    });

    setOptions(newOptions);
    onChange(
      newOptions
        .filter((option) => option.checked)
        .map((option) => option.label)
    );
  };

  let fontSizeParentNum = 0.7;
  let boxSizeNum = 1;

  let fontSizeParent = `${fontSizeParentNum}em`;
  let boxSize = `${boxSizeNum}em`;

  const optionRows = Math.ceil(options.length / 4); // Determine rows for four columns

  if (optionRows > 6) {
    fontSizeParent = `${fontSizeParentNum / (optionRows / 6)}em`;
    boxSize = `${boxSizeNum / (optionRows / 6)}em`;
  }

  return (
    <div
      className={styles.checkboxTableContainer}
      style={{ fontSize: fontSizeParent }}
    >
      {options.map((option, index) => (
        <label key={index} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={option.checked}
            onChange={() => toggleCheckbox(index)}
            className={styles.checkboxInput}
          />
          <span style={{ color: "white", textShadow: "none" }}>-</span>
          <span
            className={styles.customCheckbox}
            style={{ height: boxSize, width: boxSize }}
          ></span>
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default CheckboxTable;
