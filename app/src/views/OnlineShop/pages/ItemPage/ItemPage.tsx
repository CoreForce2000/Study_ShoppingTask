import React from 'react';
import styles from './ItemPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { createDispatchHandler } from '../../../../util/reduxUtils';
import config from '../../../../config.json';
import { addItem, selectProduct, setBudget } from '../../../../store/shopSlice';
import { useNavigate } from 'react-router-dom';
import { getImagePath } from '../../../../util/imageLoading';

interface ItemPageProps {
    category: string;
    item: number;
}

const ItemPage: React.FC<ItemPageProps> = ( { category, item }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const product = useSelector((state: RootState )=>selectProduct(state, category, item));
    const budget = useSelector((state: RootState) => state.shop.budget);

    const purchaseItem = () => {
        const price = budget < config.thresholdMinimumPrice ? product.minimum : product.maximum;

        if (budget >= price) {
            createDispatchHandler(setBudget, dispatch)(budget-price);
        } else {
            console.log("Insufficient budget to purchase this item.");
        }
        
        dispatch(addItem(product))
        navigate(-1)
    };


    return (
        <div className={styles.component}>
            <img className={styles.itemImage} src={getImagePath(category, product.image_name)} alt={product.image_name} />
            <button className={styles.addToCartButton} onClick={purchaseItem}>Add to Cart</button>  
        </div>
    );
};



export default ItemPage;
