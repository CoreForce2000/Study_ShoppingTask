import React, { useState } from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  initialOptions: string[];
  exclusiveOptions?: string[];
  allowMultiple?: boolean;
  columnLayout?: "single" | "double";
  onChange: (selectedOptions: string[]) => void;
  allowedOption?: string;
  gap?: string;
  disableOnClick?: boolean;
  hideLabel?: boolean;
}

export interface CheckboxOption {
  label: string;
  checked: boolean;
}

/**
 * A custom checkbox component that allows for single or multiple selections
 * @param initialOptions - The initial options to display
 * @param exclusiveOptions - Options that can only be selected exclusively (must be contained in initialOptions)
 * @param allowMultiple - Whether multiple options can be selected
 * @param columnLayout - The layout of the checkboxes
 * @param onChange - The function to call when the selection changes
 * @param allowedOption - The option that is allowed to be selected
 * @param gap - The gap between the checkboxes
 * @param disableOnClick - Whether to disable the checkboxes after clicking
 * @param hideLabel - Whether to hide the label of the checkboxes
 * @returns The custom checkbox component
 */
const Checkbox: React.FC<CheckboxProps> = ({
  initialOptions,
  exclusiveOptions = [],
  allowMultiple = false,
  columnLayout = "single",
  onChange,
  allowedOption,
  gap = "0.5em",
  disableOnClick = false,
  hideLabel = false,
}) => {
  const [options, setOptions] = useState<CheckboxOption[]>(
    initialOptions.map((label) => ({
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
        <div className="flex justify-end" key={index}>
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
              style={{
                height: boxSize,
                width: boxSize,
              }}
            ></span>
            <span
              style={{
                display: hideLabel ? "none" : "inline-block",
              }}
            >
              {option.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default Checkbox;
