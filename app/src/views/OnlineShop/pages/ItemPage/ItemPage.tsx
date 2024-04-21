import React, { useEffect } from "react";
import styles from "./ItemPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import {
  addItemToCart,
  logAction,
  selectProduct,
  setBudget,
  setTimer,
} from "../../../../store/shopSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getImagePath } from "../../../../util/imageLoading";
import { shopConfig } from "../../../../configs/config";
import { setCurrentSlideIndex } from "../../../../store/slideSlice";

interface ItemPageProps {
  category: string;
  item: number;
  setInterSlide: (slide: any) => void;
}

const useScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollPosition) {
      window.scrollTo(0, location.state.scrollPosition);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
};

const ItemPage: React.FC<ItemPageProps> = ({
  category,
  item,
  setInterSlide,
}) => {
  useScrollRestoration();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector((state: RootState) =>
    selectProduct(state, category, item)
  );
  const budget = useSelector((state: RootState) => state.shop.budget);

  const isPhase3 = useSelector((state: RootState) => state.shop.isPhase3);
  const cart = useSelector((state: RootState) => state.shop.itemsInCart);

  const purchaseItem = () => {
    const price =
      budget < shopConfig.useMinimumPriceBelow
        ? product.minimum
        : product.maximum;

    if (isPhase3) {
      const shoppingList = shopConfig.phase3ShoppingList;

      const cartCategories = cart.map((item) =>
        item.product.category.toLowerCase()
      );
      cartCategories.push(product.category.toLowerCase());

      console.log("cartCategories", cartCategories);

      const missingCategories = shoppingList.filter(
        (shoppingListCategory) =>
          !cartCategories.some((cartCategory) =>
            cartCategory.includes(shoppingListCategory.toLowerCase())
          )
      );

      console.log("missingCategories", missingCategories);

      if (missingCategories.length === 0) {
        console.log("All categories found");
        dispatch(setCurrentSlideIndex(19));
        dispatch(setTimer(0));
        navigate("/slide");
      }
    }

    if (budget <= price) {
      setInterSlide(`extraBudget`);
      dispatch(setBudget(1000));
      return;
    } else {
      dispatch(addItemToCart(product));
    }
    dispatch(
      logAction({
        type: "add_to_cart",
        item: product.item_id,
        category: product.category,
      })
    );
    navigate(-1);
  };

  const backClicked = () => {
    dispatch(
      logAction({
        type: "not_add_to_cart",
        item: product.item_id,
        category: product.category,
      })
    );
    navigate(-1);
  };

  return (
    <div className={styles.component}>
      <img
        className={styles.itemImage}
        src={getImagePath(category, product.image_name)}
        alt={product.image_name}
      />
      <div className={styles.buttons}>
        <button
          className={styles.button}
          style={{ backgroundColor: shopConfig.backButtonColor }}
          onClick={backClicked}
        >
          Back
        </button>
        <button
          className={styles.button}
          style={{ backgroundColor: shopConfig.addToCartButtonColor }}
          onClick={purchaseItem}
        >
          Add to Trolley
        </button>
      </div>
    </div>
  );
};

export default ItemPage;
