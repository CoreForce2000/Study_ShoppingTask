import React, { useState } from 'react';
import styles from './OnlineShop.module.css';
import { useNavigate, useSearchParams} from 'react-router-dom';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ItemPage from './pages/ItemPage/ItemPage';
import OverviewPage from './pages/OverviewPage/OverviewPage';
import CartPage from './pages/CartPage/CartPage';
import { config, shopConfig } from '../../configs/config';
import IconButton from './components/IconButton/IconButton';
import EvenlySpacedRow from './components/EvenlySpacedRow/EvenlySpacedRow';
import Timer from './components/Timer/Timer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { CartItem, removeItemFromCart } from '../../store/shopSlice';
import FixedRatioView from '../../components/FixedRatioView/FixedRatioView';


interface OnlineShopProps {
}

interface buttonsVisible {
    back: boolean;
    removeFromTrolley: boolean;
    goToTrolley: boolean;
}


const OnlineShop: React.FC<OnlineShopProps> = ({ }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);

    const [searchParams] = useSearchParams();

    const page = searchParams.get('page') || '';
    const category = searchParams.get('category') || '';
    const item = Number(searchParams.get('item')) || 0;

    const budget: number = useSelector((state: RootState) => state.shop.budget);
    const numItemsInTrolley: number = useSelector((state: RootState) => state.shop.itemsInCart.length);

    let visibility: buttonsVisible = {back: true, removeFromTrolley: false, goToTrolley: true};

    if ((category === '' && page !== "cart")) {
        visibility.back = false;
    }
    if (page==="cart") {
        visibility.removeFromTrolley = selectedItems.length > 0;
        visibility.goToTrolley = false;
    }

    const removeFromCart = (selectedItems: CartItem[]) => {
        selectedItems.forEach((cartItem:CartItem) => {
            dispatch(removeItemFromCart(cartItem));
        });

        setSelectedItems([]);
    };

    

    return (
        <FixedRatioView>
            <div className={styles.onlineShop}>

                <div 
                    className={styles.infoBar} 
                    style={{borderBottom:`7px solid ${shopConfig.lineColor}`}}>
                    
                    <EvenlySpacedRow 
                        firstChild={<div>Budget : £{budget}</div>} 
                        secondChild={<Timer onComplete={()=>navigate("/slide")}/>}
                        lastChild={<div>Trolley : {numItemsInTrolley}</div>}
                    />
                </div>
                
                <div
                    className={styles.buttonBar}>

                    <EvenlySpacedRow 
                        firstChild={
                            <IconButton 
                                iconUrl={config.BUTTON_PATH + "arrow.png"} 
                                text={'Back'} 
                                onClick={function (): void {navigate(-1)} }
                                visible={visibility.back}
                            />
                        }
                        secondChild={
                            <IconButton 
                                iconUrl={config.BUTTON_PATH + "trash2.png"} 
                                text={'Remove From Trolley'} 
                                onClick={()=>removeFromCart(selectedItems) }
                                visible={visibility.removeFromTrolley}
                            />
                        }
                        lastChild={
                            <IconButton 
                                iconUrl={config.BUTTON_PATH + "cart.png"} 
                                text={'Go to Trolley'} 
                                onClick={function (): void {navigate("/shop?page=cart")} }
                                visible={visibility.goToTrolley}
                            />
                        } 
                    />
                </div>
                

                <div className={styles.content}>

                    <div style={{overflowY:"auto"}}>
                        {
                            page === 'cart' ? (
                                <CartPage selectedItems={selectedItems} setSelectedItems={setSelectedItems}></CartPage>    
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
        </FixedRatioView>
    );
};

export default OnlineShop;