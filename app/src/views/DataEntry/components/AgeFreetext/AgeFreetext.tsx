import React, { useState } from 'react';
import styles from './AgeFreetext.module.css';

interface AgeFreetextProps {
    setAge: (value: string) => void
    required?: boolean
}

const AgeFreetext: React.FC<AgeFreetextProps> = ({ setAge, required }) => {
    const [ageError, setAgeError] = useState('');

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAge(value); // Update age regardless of its value

        if (value && parseInt(value) < 18) {
            setAgeError('Age must be 18 or above.');
        } else {
            setAgeError(''); // Clear error message if age is valid
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
            {ageError && <div className={styles.ageError}>{ageError}</div>}
        </div>
    );
};

export default AgeFreetext;
