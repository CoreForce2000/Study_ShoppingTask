import React from 'react';

interface DropdownProps {
    options: string[];
    value: string;
    setValue: (value: string) => void,
    required?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, setValue, required }) => {


    return (
        <select
            value={value}
            required={required}
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



