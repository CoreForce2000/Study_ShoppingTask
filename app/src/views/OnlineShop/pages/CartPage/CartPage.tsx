// Cart.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./CartPage.module.css";
import {
  CartItem,
  selectBudget,
  selectItemsInCart,
} from "../../../../store/shopSlice";
import Tile from "../../components/Tile/Tile";
import { getImagePath } from "../../../../util/imageLoading";
import { logShopAction } from "../../../../store/dataSlice";

interface CartPageProps {
  selectedItems: CartItem[];
  setSelectedItems: (selectedItems: CartItem[]) => void;
}

const CartPage: React.FC<CartPageProps> = ({
  selectedItems,
  setSelectedItems,
}) => {
  const itemsInCart = useSelector(selectItemsInCart);
  const budget = useSelector(selectBudget);
  const dispatch = useDispatch();

  const onTileSelect = (item: CartItem) => {
    console.log("Selecting", item.unique_id);

    const isItemAlreadySelected = selectedItems.some(
      (selectedItem) => selectedItem === item
    );

    if (isItemAlreadySelected) {
      // If the item is already selected, remove it from the selected items list
      const updatedSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem !== item
      );
      setSelectedItems(updatedSelectedItems);
      dispatch(
        logShopAction({
          Shopping_budget: budget,
          Shopping_event: "deselect_trolley_item",
          Shopping_item: item.product.image_name,
          Shopping_category: item.product.category,
          Shopping_price: item.price,
        })
      );
    } else {
      // If the item is not selected, add it to the selected items list
      setSelectedItems([...selectedItems, item]);
      dispatch(
        logShopAction({
          Shopping_budget: budget,
          Shopping_event: "select_trolley_item",
          Shopping_item: item.product.image_name,
          Shopping_category: item.product.category,
          Shopping_price: item.price,
        })
      );
    }
  };

  return (
    <div>
      <div
        className={styles.warningBox}
        style={{
          display: selectedItems.length > 0 ? "block" : "none",
          fontSize: 22,
        }}
      >
        Press the "Remove from Trolley" button to remove all selected items
      </div>
      <div className={styles.grid}>
        {itemsInCart.map((cartItem: CartItem, index: number) => (
          <Tile
            key={`${cartItem.unique_id}-${index}`}
            tileState={"itemClicked"}
            backgroundColor={"white"}
            onClick={() => onTileSelect(cartItem)}
            imageUrl={
              cartItem
                ? getImagePath(
                    cartItem.product.category,
                    cartItem.product.image_name
                  )
                : ""
            }
            text={""}
            showCheckbox={true}
          />
        ))}
      </div>
    </div>
  );
};

export default CartPage;
