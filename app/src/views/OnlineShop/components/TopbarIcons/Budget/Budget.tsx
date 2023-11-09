import React from 'react';
import styles from './Budget.module.css';

interface BudgetProps {
}

const Budget: React.FC<BudgetProps> = ({ }) => {


    return (
        <div className={styles.budget}>
            Budget
        </div>
    );
};

export default Budget;



