import React from 'react';
import styles from './Popup.module.css';
import config from '../../../../config.json'; 
import { createDispatchHandler } from '../../../../util/reduxUtils';
import { useDispatch, useSelector } from 'react-redux';
import { setBudget } from '../../../../store/shopSlice';
import { RootState } from '../../../../store/store';



type PopupProps = {
    image: string;
    item: Item;
};

const Popup: React.FC<PopupProps> = ({ image, item }) => {


    const budget = useSelector((state: RootState) => state.shop.budget);
    const dispatch = useDispatch();
        
    const addItemToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
        let itemPrice = item.maximum;
        if (budget < config.thresholdMinimumPrice ) {
            itemPrice = item.minimum;
        }

        if (budget >= itemPrice) {
            createDispatchHandler(setBudget, dispatch)(budget - itemPrice);
        } else {
            // Handle the scenario where the budget is insufficient
            console.log("Insufficient budget to purchase this item.");
        }
    }

    const hideImage = () => {
        // Implement hideImage function here
    }

    return (
        <div id="popup" className={styles.popup}>
            <div id="item-price-row">
                <img src={image} alt="Product" className={styles.popupImage} />
            </div>
            <div id="popup-below-image" className={styles.popupBelowImage}>
                <button className={styles.popupButton} id="purchase-button" onClick={addItemToCart}>
                    Add to Basket
                </button>
                <button className={styles.popupButton} id="back-button" onClick={hideImage}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default Popup;
