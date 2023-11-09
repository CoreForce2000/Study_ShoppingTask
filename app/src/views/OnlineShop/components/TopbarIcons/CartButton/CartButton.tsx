import React from 'react';
import styles from './CartButton.module.css';

interface CartButtonProps {
}

const CartButton: React.FC<CartButtonProps> = ({ }) => {


    return (
        <div className={styles.cartButton}>
            Cart button
        </div>
    );
};

export default CartButton;



