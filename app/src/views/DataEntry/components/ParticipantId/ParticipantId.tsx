import React from 'react';
import styles from './ParticipantId.module.css';

interface ParticipantIdProps {
    setParticipantId: (value: string) => void,
    required?: boolean
}

const ParticipantId: React.FC<ParticipantIdProps> = ({ setParticipantId, required }) => {
    
    const handleParticipantIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only up to 4 digits
        if (value.match(/^\d{0,4}$/)) {
          setParticipantId(value);
        }
      };

    return (
        <div className={styles.participantIdContainer}>
          <label htmlFor="participantId">Participant ID</label>
          <input
            id="participantId"
            type="text"
            className={styles.participantIdInput}
            maxLength={4}
            minLength={4}
            onChange={handleParticipantIdChange}
            required={required}
          />
        </div>
    );
};

export default ParticipantId;



