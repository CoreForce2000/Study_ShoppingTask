import React from 'react';
import styles from './ItemPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { addItemToCart, addItemToClickedItems, selectProduct } from '../../../../store/shopSlice';
import { useNavigate } from 'react-router-dom';
import { getImagePath } from '../../../../util/imageLoading';
import { shopConfig } from '../../../../configs/config';

interface ItemPageProps {
    category: string;
    item: number;
}

const ItemPage: React.FC<ItemPageProps> = ( { category, item }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const product = useSelector((state: RootState )=>selectProduct(state, category, item));



    const purchaseItem = () => {

        // console.log(categoryClicks);

        if(!dispatch(addItemToCart(product))) {
            alert("You don't have enough money to buy this item!");
            return;
        }else{
            dispatch(addItemToClickedItems(product));
        }
        navigate(-1)
    };

    return (
        <div className={styles.component}>
            <img className={styles.itemImage} src={getImagePath(category, product.image_name)} alt={product.image_name} />
            <div className={styles.buttons}>
                <button className={styles.addToCartButton} style={{backgroundColor:shopConfig.backButtonColor}} onClick={()=> navigate(-1)}>Back</button>  
                <button className={styles.addToCartButton} style={{backgroundColor:shopConfig.addToCartButtonColor}}onClick={purchaseItem}>Add to Trolley</button>  
            </div>
        </div>
    );
};

export default ItemPage;