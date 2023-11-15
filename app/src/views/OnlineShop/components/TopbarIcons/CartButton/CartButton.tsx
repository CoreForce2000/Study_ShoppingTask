import React from 'react';
import styles from './CartButton.module.css';
import ShopButton from '../../ShopButton/ShopButton';

interface CartButtonProps {
}

const CartButton: React.FC<CartButtonProps> = ({ }) => {


    return (
        <div className={styles.cartButton}>
            <ShopButton buttonType='cart' />
        </div>
    );
};

export default CartButton;



