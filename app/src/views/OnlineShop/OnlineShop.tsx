import React from 'react';
import styles from './OnlineShop.module.css';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import FullscreenView from '../../components/FullscreenView/FullscreenView';
import BackButton from './components/BackButton/BackButton';
import TopbarIcons from './components/TopbarIcons/TopbarIcons';
import ItemPage from './pages/ItemPage/ItemPage';
import { Route, Routes, useSearchParams} from 'react-router-dom';

interface OnlineShopProps {
}

const OnlineShop: React.FC<OnlineShopProps> = ({ }) => {
    const [searchParams] = useSearchParams();

    const page = searchParams.get('page') || '';

    return (
        <FullscreenView>
            <div className={styles.topbar} />
            <div className={styles.onlineShop}>
                <div className={styles.content}>
                    <div style={{flex: "0 0 auto"}}><TopbarIcons /></div>
                    <div style={{flex:1, margin:"10px"}}><BackButton customStyle={{margin:"10px", flex:1}} /></div>

                    <div style={{overflowY:"auto"}}>
                        {page === 'category' ? <CategoryPage/> : <ItemPage/>}
                    </div>
                    
                </div>
            </div>
        </FullscreenView>
    );
};

export default OnlineShop;