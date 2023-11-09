import React from 'react';
import styles from './OnlineShop.module.css';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import FullscreenView from '../../components/FullscreenView/FullscreenView';
import BackButton from './components/BackButton/BackButton';
import TopbarIcons from './components/TopbarIcons/TopbarIcons';

interface OnlineShopProps {
}

const OnlineShop: React.FC<OnlineShopProps> = ({ }) => {


    return (
        <FullscreenView>
            <div className={styles.topbar} />
            <div className={styles.onlineShop}>
                <div className={styles.content}>
                    <div style={{flex: "0 0 auto"}}><TopbarIcons /></div>
                    <div style={{flex:1, margin:"10px"}}><BackButton customStyle={{margin:"10px", flex:1}} /></div>
                    <div style={{flex:"0 0 auto"}}><CategoryPage /></div>
                </div>
            </div>
        </FullscreenView>
    );
};

export default OnlineShop;



