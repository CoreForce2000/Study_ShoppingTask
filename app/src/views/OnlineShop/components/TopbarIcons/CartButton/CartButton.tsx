import React from 'react';
import styles from './CartButton.module.css';

interface CartButtonProps {
}

const CartButton: React.FC<CartButtonProps> = ({ }) => {


    return (
        <button className={styles.cartButton}>
            <img className={styles.cartImage} src={'src/assets/cart_white.png'} alt={"shop-button"}/>
        </button>
    );
};

export default CartButton;