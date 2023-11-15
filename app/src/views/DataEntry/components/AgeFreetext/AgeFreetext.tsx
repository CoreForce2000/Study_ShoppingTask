import React from 'react';
import styles from './AgeFreetext.module.css';

interface AgeFreetextProps {
    setAge: (value: string) => void
    required?: boolean
}

const AgeFreetext: React.FC<AgeFreetextProps> = ({ setAge, required }) => {

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only up to 2 digits
        if (value.match(/^\d{0,2}$/)) {
            setAge(value);
        }
        };

    return (
        <div className={styles.AgeFreetext}>
            <input
                id="age"
                type="text"
                className={styles.ageInput}
                maxLength={2}
                minLength={2}
                onChange={handleAgeChange}
                required={required}
            />
        </div>
    );
};

export default AgeFreetext;



