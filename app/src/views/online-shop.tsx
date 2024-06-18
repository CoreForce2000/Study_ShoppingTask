import { ArrowLeftIcon, ListTodoIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import config from "../assets/configs/config.json";

import Button from "../components/button";
import EvenlySpacedRow from "../components/evenly-spaced-row";
import TaskViewport from "../components/task-viewport";
import Tile from "../components/tile";
import Timer from "../components/timer";
import { TileItem, TrolleyItem } from "../store/shopSlice";
import useTaskStore from "../store/store";
import {
  END_SHOPPING_SOUND,
  LUCKY_CUSTOMER_SOUND,
  TIME_IS_RUNNING_OUT_SOUND,
} from "../util/constants";
import { useScrollRestoration } from "../util/hooks";
import { getImagePath } from "../util/preload";

export interface Tile {
  category: string;
  tile: number;
}

function delayAfterClick(callback: () => void) {
  setTimeout(callback, 500);
}

const GridPage: React.FC<{
  view: "categories" | "items" | "trolley";
  category?: string;
}> = ({ view, category }) => {
  const store = useTaskStore();

  return (
    <div className="grid grid-cols-7">
      {view === "categories" &&
        store.categories.map((category, index) => (
          <Tile
            key={`${category}-${index}`}
            text={category}
            tileState={
              store.clickedCategories.includes(category)
                ? "categoryClicked"
                : "none"
            }
            onClick={() => delayAfterClick(() => store.clickCategory(category))}
            backgroundColor={config.colors.categoryTileColor}
          />
        ))}

      {view === "items" &&
        category &&
        Array.from(
          { length: config.shop.randomization.numberOfItemTiles },
          (_, index) => {
            const tileItem = store.clickedItemTiles.find(
              (itemTile) => itemTile.tile_id === index
            );

            return (
              <Tile
                key={index}
                text={""}
                tileState={tileItem ? "itemClicked" : "none"}
                onClick={() =>
                  delayAfterClick(() => store.clickItemTile(index))
                }
                backgroundColor={config.colors.itemTileColor}
                imageUrl={
                  tileItem
                    ? getImagePath(category, tileItem.item.image_name)
                    : ""
                }
                backgroundIsBlack={category === "Cocaine"}
              />
            );
          }
        )}

      {view === "trolley" &&
        store.trolley.map((trolleyItem, index) => (
          <Tile
            key={`${trolleyItem.index}-${index}`}
            tileState={"itemClicked"}
            backgroundColor={"white"}
            onClick={() => store.removeItemFromCart(trolleyItem)}
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
  );
};

const ItemPage: React.FC<{
  type: "item" | "trolleyItem";
}> = ({ type }) => {
  const store = useTaskStore();

  return (
    store.currentCategory &&
    store.currentItem && (
      <div className="flex flex-col items-center justify-center h-[11em]">
        <img
          className="h-[6.5em] object-cover pb-2"
          src={getImagePath(
            store.currentCategory,
            store.currentItem.item.image_name
          )}
          alt={store.currentItem.item.image_name}
        />
        <div className="grid grid-cols-2 text-xs">
          <Button onClick={() => (store.currentItem = null)}>Back</Button>
          {type === "item" ? (
            <Button
              onClick={() =>
                store.addItemToCart((store.currentItem as TileItem).item)
              }
            >
              Add to Trolley
            </Button>
          ) : (
            <Button
              onClick={() =>
                store.removeItemFromCart(store.currentItem as TrolleyItem)
              }
            >
              Remove from Trolley
            </Button>
          )}
        </div>
      </div>
    )
  );
};

interface OnlineShopProps {}

const OnlineShop: React.FC<OnlineShopProps> = ({}) => {
  const store = useTaskStore();
  const [interSlide, setInterSlide] = useState<keyof typeof interSlides>();

  const scrollRef = useScrollRestoration(
    "category_" + store.currentCategory,
    false
  );

  useEffect(() => {
    if (interSlide === "timeIsRunningOut") {
      TIME_IS_RUNNING_OUT_SOUND.play();
      const timer = setTimeout(() => {
        setInterSlide(undefined);
      }, config.shop.general.alarmBellDuration);

      return () => clearTimeout(timer);
    }
    if (interSlide === "extraBudget") {
      LUCKY_CUSTOMER_SOUND.play();
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
                      END_SHOPPING_SOUND.play();
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
