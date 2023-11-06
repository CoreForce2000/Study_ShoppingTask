import React from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
    options: string[];
    value: string;
    setValue: (value: string) => void
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, setValue }) => {


    return (
        <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
        >
            {options.map((option) => (
                <option key={option} value={option}>
                {option}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;



