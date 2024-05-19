import React, { useState, useEffect } from "react";
import styles from "./OverviewPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tile from "../../components/Tile/Tile";
import {
  selectAllCategories,
  selectBudget,
  selectClickedCategories,
  selectShuffledCategories,
  setCategoryClicked,
  setShuffledCategories,
} from "../../../../store/shopSlice";
import { pseudorandomize } from "../../../../util/randomize";
import { shopConfig } from "../../../../configs/config";
import { config } from "../../../../configs/config";
import { delayAfterClick } from "../../../../util/delayAfterClick";
import { logShopAction } from "../../../../store/dataSlice";

// Define a type for the category, which is a simple string in this case
type Category = string;

const drugCategories = [
  ...config.illicitDrugCategories,
  ...config.alcoholCategories,
  ...config.initialScreenCategories,
];

const OverviewPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [displayCategories, setDisplayCategories] = useState<string[]>([]);

  const storedShuffledCategories: string[] = useSelector(
    selectShuffledCategories
  );
  const allCategories = useSelector(selectAllCategories);
  const budget = useSelector(selectBudget);
  const getClickedCategories = useSelector(selectClickedCategories);

  const onCategoryTileClick = (category: string) => {
    dispatch(setCategoryClicked(category));

    dispatch(
      logShopAction({
        Shopping_budget: budget,
        Shopping_event: "click_item",
        Shopping_item: undefined,
        Shopping_category: category,
        Shopping_price: undefined,
      })
    );

    navigate(`/shop?category=${category}`);
  };

  useEffect(() => {
    if (storedShuffledCategories.length > 0) {
      setDisplayCategories(
        Array(shopConfig.repeatCategories).fill(storedShuffledCategories).flat()
      );
    } else {
      const nonDrugCategories = allCategories.filter(
        (category) => !drugCategories.includes(category)
      );
      const shuffledCategories = pseudorandomize(
        nonDrugCategories,
        drugCategories,
        config.alcoholCategories,
        config.initialScreenCategories
      );

      dispatch(setShuffledCategories(shuffledCategories));
      setDisplayCategories(shuffledCategories);
    }
  }, [storedShuffledCategories, allCategories, dispatch]);

  return (
    <div className={styles.overviewPage}>
      {displayCategories.map((category: Category, index: number) => (
        <Tile
          key={`${category}-${index}`}
          text={category}
          tileState={
            getClickedCategories.includes(category) ? "categoryClicked" : "none"
          }
          // onClick={ ()=>onCategoryTileClick(category) }
          onClick={() => {
            delayAfterClick(() => onCategoryTileClick(category));
          }}
          backgroundColor={shopConfig.categoryTileColor}
        />
      ))}
    </div>
  );
};

export default OverviewPage;
