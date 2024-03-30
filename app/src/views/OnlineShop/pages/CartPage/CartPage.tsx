// Cart.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './CartPage.module.css';
import { CartItem, logAction, selectItemsInCart } from '../../../../store/shopSlice';
import Tile from '../../components/Tile/Tile';
import { getImagePath } from '../../../../util/imageLoading';

interface CartPageProps {
    selectedItems: CartItem[];
    setSelectedItems: (selectedItems: CartItem[]) => void;
}

const CartPage: React.FC<CartPageProps> = ({ selectedItems, setSelectedItems }) => {
    const itemsInCart = useSelector(selectItemsInCart);
    const dispatch = useDispatch();

    const onTileSelect = (item:CartItem) => {

        console.log("Selecting", item.unique_id)

        const isItemAlreadySelected = selectedItems.some(selectedItem => selectedItem === item);

        if (isItemAlreadySelected) {
            // If the item is already selected, remove it from the selected items list
            const updatedSelectedItems = selectedItems.filter(selectedItem => selectedItem !== item);
            setSelectedItems(updatedSelectedItems);
            dispatch(logAction({type: "deselect_trolley_item", item: item.product.item_id, category: item.product.category}));
        } else {
            // If the item is not selected, add it to the selected items list
            setSelectedItems([...selectedItems, item]);
            dispatch(logAction({type: "select_trolley_item", item: item.product.item_id, category: item.product.category}));
        }
    };


    return (
        <div>
            <div className={styles.grid}>
                {itemsInCart.map((cartItem: CartItem, index: number) => (
                    <Tile 
                        key={`${cartItem.unique_id}-${index}`}
                        tileState={"itemClicked"}
                        backgroundColor={"white"} 
                        onClick={()=>onTileSelect(cartItem)}
                        imageUrl={cartItem ? getImagePath(cartItem.product.category, cartItem.product.image_name) : ''}
                        text={''}
                        showCheckbox={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default CartPage;
