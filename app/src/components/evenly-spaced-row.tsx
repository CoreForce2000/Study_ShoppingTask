import React from 'react';
import styles from './evenly-spaced-row.module.css';

interface EvenlySpacedRowProps {
    firstChild: React.ReactNode;
    secondChild: React.ReactNode;
    lastChild: React.ReactNode;
}

const EvenlySpacedRow: React.FC<EvenlySpacedRowProps> = ({ firstChild, secondChild, lastChild }) => {

    return (
        <div className={styles.evenlySpacedRow}>
            <div className={styles.icon}>{firstChild}</div>
            <div className={styles.icon}>{secondChild}</div>
            <div className={styles.icon}>{lastChild}</div>
        </div>
    );
};

export default EvenlySpacedRow;
