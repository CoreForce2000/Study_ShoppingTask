import React from 'react';
import styles from './FullscreenView.module.css';

interface FullscreenViewProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const FullscreenView: React.FC<FullscreenViewProps> = ({ children, style }) => {


    return (
        <div className={styles.fullscreenView} style={style}> 
            {children}
        </div>
    );
};

export default FullscreenView;



