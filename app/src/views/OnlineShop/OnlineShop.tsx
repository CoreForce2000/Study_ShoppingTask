import React from 'react';
import styles from './OnlineShop.module.css';
import FullscreenView from '../../components/FullscreenView/FullscreenView';
import BackButton from './components/BackButton/BackButton';
import TopbarIcons from './components/TopbarIcons/TopbarIcons';
import { useSearchParams} from 'react-router-dom';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ItemPage from './pages/ItemPage/ItemPage';
import OverviewPage from './pages/OverviewPage/OverviewPage';

interface OnlineShopProps {
}

const OnlineShop: React.FC<OnlineShopProps> = ({ }) => {
    const [searchParams] = useSearchParams();

    const category = searchParams.get('category') || '';
    const item = Number(searchParams.get('item')) || 0;

    let visibility: string = "visible";
    if (category === '') {
        visibility = "hidden";
    }

    return (
        <FullscreenView>
            <div className={styles.topbar} />
            <div className={styles.onlineShop}>
                <div className={styles.content}>
                    <div style={{flex: "0 0 auto"}}><TopbarIcons /></div>
                    <div style={{flex:1, margin:"10px"}}><BackButton customStyle={{margin:"10px", flex:1, visibility:visibility}} /></div>

                    <div style={{overflowY:"auto"}}>
                        {category === '' ? (
                            <OverviewPage />
                        ) : item === 0 ? (
                            <CategoryPage category={category} />
                        ) : (
                            <ItemPage category={category} item={item} />
                        )}
                    </div>
                </div>
            </div>
        </FullscreenView>
    );
};

export default OnlineShop;