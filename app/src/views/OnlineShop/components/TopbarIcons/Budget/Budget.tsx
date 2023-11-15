import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Budget.module.css';
import { RootState } from '../../../../../store/store';

interface BudgetProps {}

const Budget: React.FC<BudgetProps> = () => {
    const budget = useSelector((state: RootState) => state.shop.budget);

    return <div className={styles.budget}>Budget : {budget}</div>;
};

export default Budget;