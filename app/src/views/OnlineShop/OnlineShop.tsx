import React, { useEffect } from 'react';
import styles from './OnlineShop.module.css';
import FullscreenView from '../../components/FullscreenView/FullscreenView';
import BackButton from './components/BackButton/BackButton';
import TopbarIcons from './components/TopbarIcons/TopbarIcons';
import { useSearchParams} from 'react-router-dom';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ItemPage from './pages/ItemPage/ItemPage';
import OverviewPage from './pages/OverviewPage/OverviewPage';
import CartPage from './pages/CartPage/CartPage';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllCategories, setShuffledCategories } from '../../store/shopSlice';
import { pseudorandomize } from '../../util/randomize';

interface OnlineShopProps {
}


const drugCategories = [
    "Cannabis",
    "Cannabis\nProducts",
    "Cigarettes",
    "Cigars",
    "Ecstasy",
    "Hashish",
    "Hookah",
    "Pipers",
    "Rolling\nTobacco",
    "Vapin"
]

const alcoholCategories = [
    "Alcopops",
    "Beer",
    "Brandy",
    "Champagne",
    "Cider",
    "Cocktails",
    "Gin",
    "Prosecco",
    "Red\nWine",
    "Vodka",
    "Rum",
    "Whisky",
    "White Wine",
]

const initialScreenCategories = [
    "Cocaine",
    "Crack",
    "Heroin",
]

const OnlineShop: React.FC<OnlineShopProps> = ({ }) => {
    const [searchParams] = useSearchParams();

    const page = searchParams.get('page') || '';
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
                        {
                            page === 'cart' ? (
                                <CartPage></CartPage>    
                            ) : category === '' ? (
                                <OverviewPage />
                            ) : item === 0 ? (
                                <CategoryPage category={category} />
                            ) : (
                                <ItemPage category={category} item={item} />
                            )
                        }
                    </div>
                </div>
            </div>
        </FullscreenView>
    );
};

export default OnlineShop;