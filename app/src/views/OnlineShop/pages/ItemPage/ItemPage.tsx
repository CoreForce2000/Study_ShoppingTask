import React from 'react';
import styles from './ItemPage.module.css';
import { selectProduct } from '../../../../store/productSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

interface ItemPageProps {
    category: string;
    item: number;
}

const ItemPage: React.FC<ItemPageProps> = ( { category, item }) => {
    
    
    const product = useSelector((state: RootState )=>selectProduct(state, category, item));



    return (
        <div className={styles.component}>
            <img className={styles.itemImage} src={`src/assets/categories/${category}/${product.image_name}`} alt={product.image_name} />
            <button className={styles.addToCartButton} onClick>Add to Cart</button>  
        </div>
    );
};


export default ItemPage;
