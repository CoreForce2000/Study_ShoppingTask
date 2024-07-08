import React, { useState } from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  initialOptions: string[];
  exclusiveOptions?: string[];
  allowMultiple: boolean;
  columnLayout: "single" | "double";
  onChange: (selectedOptions: string[]) => void;
  allowedOption?: string;
  gap?: string;
  disableOnClick?: boolean;
}

export interface CheckboxOption {
  label: string;
  checked: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  initialOptions,
  exclusiveOptions = [],
  allowMultiple,
  columnLayout,
  onChange,
  allowedOption,
  gap = "0.3em",
  disableOnClick = false,
}) => {
  const [options, setOptions] = useState<CheckboxOption[]>(
    [...initialOptions, ...exclusiveOptions].map((label) => ({
      label,
      checked: false,
    }))
  );
  const [disabled, setDisabled] = useState<boolean>(false);

  // Function to toggle the checked state of a checkbox
  const toggleCheckbox = (index: number) => {
    // If the clicked option is exclusive, only the clicked checkbox is checked

    const isExclusive =
      options.some(
        (option) => option.checked && exclusiveOptions.includes(option.label)
      ) || exclusiveOptions.includes(options[index].label);

    const newOptions = options.map((option, i) => {
      if (allowMultiple && !isExclusive) {
        // For multiple selections and non-exclusive options, toggle the checked state of the clicked checkbox

        return i === index ? { ...option, checked: !option.checked } : option;
      } else {
        // For single selection or exclusive option
        // If the clicked option is exclusive or if it's a single selection, only the clicked checkbox is checked
        return i === index
          ? { ...option, checked: !option.checked }
          : { ...option, checked: false };
      }
    });

    // Update the internal state
    if (allowedOption) {
      if (
        newOptions
          .filter((option) => option.checked)
          .map((option) => option.label)
          .includes(allowedOption)
      ) {
        setOptions(newOptions);
      }
    } else {
      setOptions(newOptions);
    }

    // Notify the parent component about the change
    onChange(
      newOptions
        .filter((option) => option.checked)
        .map((option) => option.label)
    );

    setDisabled(disableOnClick);
  };

  let fontSizeParentNum = 0.7;
  let boxSizeNum = 1;

  let fontSizeParent = `${fontSizeParentNum}em`;
  let boxSize = `${boxSizeNum}em`;

  const optionRows =
    columnLayout === "double" ? options.length / 2 : options.length;

  if (optionRows > 6) {
    fontSizeParent = `${fontSizeParentNum / (optionRows / 6)}em`;
    boxSize = `${boxSizeNum / (optionRows / 6)}em`;
  }

  return (
    <div
      className={styles.checkboxContainer}
      style={{
        fontSize: fontSizeParent,
        gridTemplateColumns: columnLayout === "double" ? "1fr 1fr" : "1fr",
        gap: gap,
      }}
    >
      {options.map((option, index) => (
        <div className="flex justify-end">
          <label
            key={index}
            className={`${styles.checkboxLabel} ${
              columnLayout === "double"
                ? index % 2 === 0
                  ? styles.leftColumn
                  : styles.rightColumn
                : ""
            }`}
          >
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => toggleCheckbox(index)}
              className={styles.checkboxInput}
              disabled={disabled}
            />
            {option.label !== "" ? (
              <span style={{ color: "white", textShadow: "none" }}>-</span>
            ) : null}
            <span
              className={styles.customCheckbox}
              style={{ height: boxSize, width: boxSize }}
            ></span>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Checkbox;
