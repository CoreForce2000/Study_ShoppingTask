import React from 'react';
import styles from './TopbarIcons.module.css';
import Budget from './Budget/Budget';
import Timer from './Timer/Timer';
import CartButton from './CartButton/CartButton';

interface TopbarIconsProps {
}

const TopbarIcons: React.FC<TopbarIconsProps> = ({  }) => {


    return (
        <div className={styles.topbarIcons}>
            <div className={styles.icon}><Budget /></div>
            <div className={styles.icon}><Timer /></div>
            <div className={styles.icon}><CartButton /></div>
        </div>
    );
};

export default TopbarIcons;



