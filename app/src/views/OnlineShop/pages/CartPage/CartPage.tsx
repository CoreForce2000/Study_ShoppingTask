// Cart.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './CartPage.module.css';
import { RootState } from '../../../../store/store';
import { removeItem } from '../../../../store/shopSlice';

const CartPage: React.FC = () => {
    const items = useSelector((state: RootState) => state.shop.items);
    const dispatch = useDispatch();

    return (
        <div>
            {items.map((item) => (
                <div key={item.image_name} className={styles.cartItem}>
                    <img src={item.image_name} alt="Item Image" className={styles.cartItemImage} />
                    <p className={styles.cartItemPrice}>{item.minimum}</p>
                    <button className={styles.removeButton} onClick={
                        () => dispatch(removeItem(item.image_name))}>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CartPage;
