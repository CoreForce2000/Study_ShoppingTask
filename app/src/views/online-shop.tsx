import { atom, useAtom } from "jotai";
import { ArrowLeftIcon, ListTodoIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/button";
import EvenlySpacedRow from "../components/evenly-spaced-row";
import TaskViewport from "../components/task-viewport";
import Tile from "../components/tile";
import Timer from "../components/timer";
import { useAtomConfig, useAtomStore } from "../store";
import { getImagePath, preloadImage } from "../util/preload";
import { shuffleArray } from "../util/randomize";
import { useScrollRestoration } from "../util/scrollRestoration";
import { Slide } from "./slide";

const shopTimeAtom = atom(10 * 60);
const budgetAtom = atom<number>(0);
const isPhase3Atom = atom<boolean>(false);
const trolleyItemsAtom = atom<TrolleyItem[]>([]);
const clickedItemsAtom = atom<Tile[]>([]);
const clickedCategoriesAtom = atom<string[]>([]);
const allItemsAtom = atom<Product[]>([]);
const shuffledItemsAtom = atom<Record<string, Product[]>>({});

const useAtomShop = () => {
  const [budget, setBudget] = useAtom(budgetAtom);
  const [isPhase3, setIsPhase3] = useAtom(isPhase3Atom);
  const [trolleyItems, setTrolleyItems] = useAtom(trolleyItemsAtom);
  const [clickedItems, setClickedItems] = useAtom(clickedItemsAtom);
  const [clickedCategories, setClickedCategories] = useAtom(
    clickedCategoriesAtom
  );
  const [allItems, setAllItems] = useAtom(allItemsAtom);
  const [shuffledItems, setShuffledItems] = useAtom(shuffledItemsAtom);

  const updateShuffledItems = (category: string) => {
    const shuffledItems = shuffleArray(allItems);
    setShuffledItems((prev) => ({ ...prev, [category]: shuffledItems }));
  };

  const updateClickedItems = (category: string, tile: number) => {
    setClickedItems((prev) => [...prev, { category, tile }]);
  };

  return {
    budget,
    setBudget,
    isPhase3,
    setIsPhase3,
    trolleyItems,
    setTrolleyItems,
    clickedItems,
    setClickedItems,
    updateClickedItems,
    clickedCategories,
    setClickedCategories,
    allItems,
    setAllItems,
    shuffledItems,
    setShuffledItems,
    updateShuffledItems,
  };
};

interface ItemPageProps {
  category: string;
  item: number;
  setInterSlide: (slide: Slide) => void;
}

export interface Tile {
  category: string;
  tile: number;
}

export interface Product {
  item_id: number;
  category: string;
  image_name: string;
  minimum: number;
  maximum: number;
}

export interface TrolleyItem {
  unique_id: string;
  item: Product;
  price: number;
  selected: boolean;
}

const TrolleyPage = () => {
  const [trolleyItems, setTrolleyItems] = useAtom(trolleyItemsAtom);

  return (
    <div>
      <div className="grid grid-cols-7">
        {trolleyItems.map((trolleyItem, index) => (
          <Tile
            key={`${trolleyItem.unique_id}-${index}`}
            tileState={"itemClicked"}
            backgroundColor={"white"}
            onClick={() => onTileSelect(trolleyItem)}
            imageUrl={
              trolleyItem
                ? getImagePath(
                    trolleyItem.item.category,
                    trolleyItem.item.image_name
                  )
                : ""
            }
            text={""}
            showCheckbox={true}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <button className="bg-red-500 text-white py-2 px-4 rounded">
          Remove from Trolley
        </button>
      </div>
      <div className="text-center bg-yellow-500 border border-black p-2 m-2">
        This is a warning message.
      </div>
    </div>
  );
};

interface CategoryPageProps {
  category: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const navigate = useNavigate();

  const store = useAtomStore();
  const config = useAtomConfig();
  const shop = useAtomShop();

  const shuffledItems = shop.shuffledItems[category];

  const onItemTileClick = (index: number, item: Product | null) => {
    shop.updateClickedItems(category, index);

    if (item) {
      navigate(`/shop?category=${category}&item=${item.item_id}`);
    } else {
      const currentItem: Product =
        shuffledItems[shop.clickedItems.length % shuffledItems.length];

      store.logShopAction({
        Shopping_budget: shop.budget,
        Shopping_event: "click_item",
        Shopping_item: currentItem.image_name,
        Shopping_category: currentItem.category,
        Shopping_price:
          shop.budget < config.data.shop.general.useMinimumPriceBelow
            ? currentItem.minimum
            : currentItem.maximum,
      });
      shop.updateClickedItems(category, index);
      // Preload next image and navigate to the current item
      if (shop.clickedItems.length < shuffledItems.length - 1) {
        const nextItem: Product =
          shuffledItems[(shop.clickedItems.length + 1) % shuffledItems.length];
        preloadImage(getImagePath(category, nextItem.image_name));
      }

      navigate(`/shop?category=${category}&item=${currentItem.item_id}`);
    }
  };

  useEffect(() => {
    preloadImage(getImagePath(category, shop.allItems[0].image_name));

    if (shuffledItems.length == 0) {
      shop.updateShuffledItems(category);
    }
  }, [shuffledItems, category]);

  return (
    <div className="grid grid-cols-7">
      {Array.from(
        { length: config.data.shop.randomization.numberOfItemTiles },
        (_, index) => {
          // Find the order in which the tile was clicked
          const clickOrder = shop.clickedItems.indexOf(index);
          // If the tile was clicked, determine the corresponding item, otherwise set to null
          const item =
            clickOrder !== -1
              ? shuffledItems[clickOrder % shuffledItems.length]
              : null;

          return (
            <Tile
              key={index}
              text={""} // Assuming each item has a 'name'
              tileState={clickOrder !== -1 ? "itemClicked" : "none"}
              onClick={() => {
                delayAfterClick(() => onItemTileClick(index, item));
              }}
              backgroundColor={config.data.shop.colors.itemTileColor}
              imageUrl={item ? getImagePath(category, item.image_name) : ""}
              backgroundIsBlack={category == "Cocaine"}
            />
          );
        }
      )}
    </div>
  );
};

const ItemPage: React.FC<ItemPageProps> = ({
  category,
  item,
  setInterSlide,
}) => {
  const navigate = useNavigate();

  const store = useAtomStore();
  const config = useAtomConfig();

  const purchaseItem = () => {
    const price =
      budget < config.data.shop.general.useMinimumPriceBelow
        ? product.minimum
        : product.maximum;

    if (isPhase3) {
      const shoppingList = shopConfig.phase3ShoppingList;

      const TrolleyCategories = Trolley.map((item) =>
        item.product.category.toLowerCase()
      );
      TrolleyCategories.push(product.category.toLowerCase());

      console.log("TrolleyCategories", TrolleyCategories);

      const missingCategories = shoppingList.filter(
        (shoppingListCategory) =>
          !TrolleyCategories.some((TrolleyCategory) =>
            TrolleyCategory.includes(shoppingListCategory.toLowerCase())
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
      dispatch(addItemToTrolley(product));
    }
    dispatch(
      logShopAction({
        Shopping_budget: budget,
        Shopping_event: "add_to_Trolley",
        Shopping_item: product.image_name,
        Shopping_category: product.category,
        Shopping_price:
          budget < shopConfig.useMinimumPriceBelow
            ? product.minimum
            : product.maximum,
      })
    );
    navigate(-1);
  };

  const backClicked = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col items-center justify-center h-[11em]">
      <img
        className="h-[6.5em] object-cover pb-2"
        src={getImagePath(category, product.image_name)}
        alt={product.image_name}
      />
      <div className="grid grid-cols-2 text-xs">
        <Button onClick={backClicked}>Back</Button>
        <Button onClick={purchaseItem}>Add to Trolley</Button>
      </div>
    </div>
  );
};

const drugCategories = [
  ...config.shop.randomization.drugsOptions,
  ...config.shop.randomization.alcoholCategories,
  ...config.shop.randomization.illicitDrugCategories,
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
    <div className="grid grid-cols-7">
      {displayCategories.map((category, index) => (
        <Tile
          key={`${category}-${index}`}
          text={category}
          tileState={
            getClickedCategories.includes(category) ? "categoryClicked" : "none"
          }
          onClick={() => {
            delayAfterClick(() => onCategoryTileClick(category));
          }}
          backgroundColor={shopConfig.categoryTileColor}
        />
      ))}
    </div>
  );
};

interface OnlineShopProps {}

const OnlineShop: React.FC<OnlineShopProps> = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedItems, setSelectedItems] = useState<TrolleyItem[]>([]);
  const [interSlide, setInterSlide] = useState<keyof typeof interSlides>();

  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || "";
  const category = searchParams.get("category") || "";
  const item = Number(searchParams.get("item")) || 0;
  const isPhase3 = useSelector(selectIsPhase3);

  const scrollRef = useScrollRestoration("category_" + category, item !== 0);

  const budget: number = useSelector((state: RootState) => state.shop.budget);
  const numItemsInTrolley: number = useSelector(
    (state: RootState) => state.shop.itemsInTrolley.length
  );

  const visibility: buttonsVisible = {
    back: true,
    removeFromTrolley: false,
    goToTrolley: true,
  };

  const timeIsRunningOutSound = new Audio(`${config.SOUND_PATH}Time's up.mp3`);
  const luckyCustomerSound = new Audio(
    `${config.SOUND_PATH}Lucky customer.mp3`
  );
  const endOfPhase1Sound = new Audio(`${config.SOUND_PATH}End of phase1.mp3`);

  if (
    (category === "" && page !== "Trolley") ||
    (category !== "" && item !== 0)
  ) {
    visibility.back = false;
  }
  if (page === "Trolley") {
    visibility.removeFromTrolley = selectedItems.length > 0;
    visibility.goToTrolley = false;
  }

  const removeFromTrolley = (selectedItems: TrolleyItem[]) => {
    selectedItems.forEach((TrolleyItem: TrolleyItem) => {
      dispatch(removeItemFromTrolley(TrolleyItem));

      dispatch(
        logShopAction({
          Shopping_budget: budget,
          Shopping_event: "remove_from_Trolley",
          Shopping_item: TrolleyItem.product.image_name,
          Shopping_category: TrolleyItem.product.category,
          Shopping_price: TrolleyItem.price,
        })
      );
    });
    setSelectedItems([]);
  };

  useEffect(() => {
    if (interSlide === "timeIsRunningOut") {
      timeIsRunningOutSound.play();
      const timer = setTimeout(() => {
        setInterSlide(undefined);
      }, shopConfig.shopSlidesDuration);

      return () => clearTimeout(timer);
    }
    if (interSlide === "extraBudget") {
      luckyCustomerSound.play();
    }
  }, [interSlide]);

  function showShoppingList(): () => void {
    throw new Error("Function not implemented.");
  }

  return interSlide === "timeIsRunningOut" ? (
    <TaskViewport
      backgroundImage={interSlides[interSlide]}
      verticalAlign={true}
    />
  ) : interSlide === "extraBudget" ? (
    <TaskViewport
      backgroundImage={interSlides[interSlide]}
      verticalAlign={true}
    >
      <button
        className={styles.continueShoppingButton}
        onClick={() => setInterSlide(undefined)}
      ></button>
    </TaskViewport>
  ) : (
    <TaskViewport
      backgroundImage={interSlides[interSlide]}
      verticalAlign={true}
    >
      {interSlide !== undefined ? (
        <button
          className="absolute text-xs top-[86%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-none border-none cursor-pointer px-16"
          onClick={() => setInterSlide(undefined)}
        ></button>
      ) : (
        <TaskViewport>
          <div className="w-full h-full flex flex-col items-center">
            <div
              className="w-full p-4 pb-2 text-white bg-black text-xs box-border"
              style={{ borderBottom: `7px solid ${shopConfig.lineColor}` }}
            >
              <EvenlySpacedRow
                firstChild={<div>Budget : £{budget}</div>}
                secondChild={
                  <Timer
                    page={page}
                    onComplete={() => {
                      navigate("/slide");
                      endOfPhase1Sound.play();
                    }}
                    setInterSlide={setInterSlide}
                  />
                }
                lastChild={
                  <Button
                    prefixText={"Trolley\u00A0\u00A0"}
                    icon={ShoppingTrolley}
                    suffixText={`${numItemsInTrolley}`}
                    onClick={() => {
                      navigate("/shop?page=Trolley");
                    }}
                    variant="transparent"
                    visible={true}
                  />
                }
              />
            </div>

            <div className="w-full p-4 text-xs box-border pt-0.5 pb-2">
              <EvenlySpacedRow
                firstChild={
                  <Button
                    icon={ArrowLeftIcon}
                    suffixText={"Back"}
                    variant="transparent"
                    color="black"
                    onClick={() => {
                      setSelectedItems([]);
                      navigate("/shop");
                    }}
                    visible={visibility.back}
                  />
                }
                secondChild={
                  <Button
                    icon={ListTodoIcon}
                    suffixText="Show Shopping List"
                    visible={isPhase3}
                    onClick={showShoppingList}
                  />
                }
                lastChild={
                  <Button
                    icon={Trash2Icon}
                    suffixText={"Remove from Trolley"}
                    onClick={() => removeFromTrolley(selectedItems)}
                    visible={visibility.removeFromTrolley}
                  />
                }
              />
            </div>

            <div className="flex flex-col w-[15em] h-[calc((5/7)*(15em+0.4em))]">
              <div className="overflow-y-auto no-scrollbar" ref={scrollRef}>
                {page === "Trolley" ? (
                  <TrolleyPage
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                ) : category === "" ? (
                  <OverviewPage />
                ) : item === 0 ? (
                  <CategoryPage category={category} />
                ) : (
                  <ItemPage
                    category={category}
                    item={item}
                    setInterSlide={setInterSlide}
                  />
                )}
              </div>
            </div>
          </div>
        </TaskViewport>
      )}
    </TaskViewport>
  );
};
export default OnlineShop;
