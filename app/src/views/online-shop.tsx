import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckSquare,
  ShoppingCartIcon,
  Square,
  SquareXIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import config from "../assets/configs/config.json";

import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useTimer } from "react-use-precision-timer";
import Button from "../components/button";
import EvenlySpacedRow from "../components/evenly-spaced-row";
import Tile from "../components/tile";
import { TileItem } from "../store/shop-slice";
import useTaskStore from "../store/store";
import { getImagePath, isScrollAreaAtBottom } from "../util/functions";
import { useScrollRestoration } from "../util/hooks";

export interface Tile {
  category: string;
  tile: number;
}

const GridPage: React.FC<{
  view: "categories" | "items" | "trolley";
  category?: string;
}> = ({ view, category }) => {
  const store = useTaskStore();

  return (
    <div className="grid grid-cols-7">
      {view === "categories" &&
        store.categories
          .slice(0, store.numVisibleRows * 7)
          .map((category, index) => (
            <Tile
              actionName="open category"
              key={`${category}-${index}`}
              text={category}
              tileState={
                store.clickedCategories.includes(category)
                  ? "categoryClicked"
                  : "none"
              }
              onClickTimeout={() => {
                store.clickCategory(category);
                store.navigateTo("items");
              }}
              backgroundColor={config.colors.categoryTileColor}
            />
          ))}

      {view === "items" &&
        category &&
        Array.from(
          { length: config.shop.randomization.numberOfItemTiles },
          (_, index) => {
            const tileItem = (
              store.clickedItemTiles[store.currentCategory] || []
            ).find((itemTile) => itemTile.tile_id === index);

            return (
              <Tile
                actionName="select item"
                key={index}
                text={""}
                tileState={tileItem ? "itemClicked" : "none"}
                onClick={() => {
                  store.clickItemTile(index, true);
                }}
                onClickTimeout={() => {
                  store.clickItemTile(index, false);
                  store.navigateTo("item");
                }}
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

      {view === "trolley" && (
        <>
          {store.trolley.map((trolleyItem, index) => (
            <Tile
              actionName={
                store.selectedTrolleyItems.includes(trolleyItem)
                  ? "deselect item trolley"
                  : "select item trolley"
              }
              key={`${trolleyItem.index}-${index}`}
              tileState={"itemClicked"}
              backgroundColor={"white"}
              onClick={() => {
                store.selectTrolleyItem(trolleyItem);
              }}
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
        </>
      )}
    </div>
  );
};

const ItemPage: React.FC<{ hidden: boolean }> = ({ hidden = false }) => {
  const store = useTaskStore();

  return (
    store.currentCategory &&
    store.currentItem && (
      <div
        className={classNames(
          "flex flex-col items-center justify-evenly",
          hidden ? "hidden" : "flex"
        )}
      >
        <img
          className="h-[6.5em] object-fit pb-2"
          src={`${getImagePath(
            store.currentItem.item.category,
            store.currentItem.item.image_name
          )}`}
          alt={store.currentItem.item.image_name}
        />
        <div className="grid grid-cols-2 text-[0.4em]">
          <Button actionName="back" onClick={store.backPressed}>
            Back
          </Button>
          <Button
            actionName="add item to trolley"
            onClick={() =>
              store.addItemToCart((store.currentItem as TileItem).item)
            }
          >
            Add to Trolley
          </Button>
        </div>
      </div>
    )
  );
};

// ShoppingListPage: Simple page similar to itempage that contains just a list of four items taken from the config (same as quiz)
// with a button to go back to the main page
const ShoppingListPage: React.FC = () => {
  const store = useTaskStore();

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1">
        {config.memoryQuestionConfig.map((category) => {
          const isInTrolley = store.trolley
            .map((x) => x.item.category)
            .some((x) => x.includes(category.correct));

          return (
            <div
              key={category.correct}
              className={classNames("flex items-center text-[0.5em] italic", {
                "line-through text-gray-500 italic": isInTrolley,
              })}
            >
              {isInTrolley ? (
                <CheckSquare className="mr-2" />
              ) : (
                <Square className="mr-2" />
              )}
              {category.shoppingListLabel}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Timer: React.FC<{}> = ({}) => {
  const store = useTaskStore();
  const navigate = useNavigate();

  const timerObject = useTimer({ delay: 1000 }, () => {
    if (store.time === 1) {
      navigate(`../slide/${store.slideNumber + 1}`);
    }
    store.tickTimer();
  });

  useEffect(() => {
    timerObject.start();
    return () => timerObject.stop();
  }, [timerObject]);

  return (
    <div className={classNames(store.page === "trolley" ? "hidden" : "")}>
      {"Timer:  "}
      {Math.floor(store.time / 60)}:{store.time % 60 < 10 ? "0" : ""}
      {store.time % 60}
    </div>
  );
};

// Main OnlineShop Component
const OnlineShop: React.FC<{}> = () => {
  const store = useTaskStore();

  const showScrollDownForMore = ["items", "categories"].includes(store.page);

  const scrollRef = useScrollRestoration(
    "category_" + store.currentCategory,
    false
  );

  const onScroll = () => {
    if (scrollRef.current) {
      if (isScrollAreaAtBottom(scrollRef.current, 50)) {
        if (store.page === "categories") {
          store.addVisibleRows();
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Header */}
      <div
        className="w-full p-4 pb-2 text-white bg-black box-border text-[0.2em]"
        style={{ borderBottom: `7px solid ${config.colors.lineColor}` }}
      >
        <EvenlySpacedRow
          firstChild={
            store.budget < 0 ? (
              <div>Budget : unlimited</div>
            ) : (
              <div>Budget : £{store.budget}</div>
            )
          }
          secondChild={<Timer />}
          lastChild={
            <Button
              actionName="check trolley"
              icon={ShoppingCartIcon}
              prefixText={"Trolley"}
              suffixText={`${store.trolley.length}`}
              onClick={() => store.navigateTo("trolley")}
              variant="transparent"
              visible={true}
            />
          }
        />
      </div>

      {/* Second Header  */}
      <div className="w-full p-4 box-border pt-0.5 pb-2 text-[0.2em]">
        <EvenlySpacedRow
          firstChild={
            <Button
              actionName="back"
              icon={ArrowLeftIcon}
              suffixText={"Back"}
              variant="transparent"
              color="black"
              onClick={() => {
                store.backPressed();
              }}
              visible={store.page !== "categories" && store.page !== "item"}
            />
          }
          secondChild={
            <Button
              actionName="open shopping list"
              variant="secondary"
              suffixText="To Your Shopping List"
              visible={store.isPhase3 && store.page !== "shoppingList"}
              onClick={() => {
                store.navigateTo("shoppingList");
              }}
            />
          }
          lastChild={
            store.page === "trolley" ? (
              <Button
                actionName="remove trolley items"
                icon={SquareXIcon}
                variant="transparent"
                color="black"
                suffixText="Remove from Trolley"
                onClick={() => store.removeTrolleyItems()}
              />
            ) : (
              <Button
                actionName="check trolley"
                icon={ArrowRightIcon}
                variant="transparent"
                color="black"
                prefixText="Go to trolley"
                onClick={() => store.navigateTo("trolley")}
              />
            )
          }
          secondSize={store.page === "trolley" ? "flex-0" : "flex-1"}
          lastSize={store.page === "trolley" ? "flex-2" : "flex-1"}
        />
      </div>

      {/* Content */}
      <div className="flex justify-start">
        {showScrollDownForMore ? (
          <div className="w-[1.8em] object-contain"></div>
        ) : (
          <></>
        )}

        <div className="flex flex-col w-[15em] h-[calc((5/7)*(15em+0.4em))]">
          <div
            className="overflow-y-auto overflow-x-hidden"
            ref={scrollRef}
            onScroll={onScroll}
          >
            <ItemPage hidden={store.page !== "item"} />
            {store.page === "item" ? (
              <></>
            ) : store.page === "shoppingList" ? (
              <ShoppingListPage></ShoppingListPage>
            ) : (
              <GridPage view={store.page} category={store.currentCategory} />
            )}
            <EvenlySpacedRow
              secondChild={
                <Button
                  actionName="remove trolley items"
                  onClick={store.removeTrolleyItems}
                  className="text-[0.25em]"
                  visible={
                    store.page === "trolley" &&
                    store.selectedTrolleyItems.length > 0
                  }
                >
                  Remove
                </Button>
              }
            ></EvenlySpacedRow>
          </div>
        </div>
        {showScrollDownForMore ? (
          <div>
            <img
              src="/assets/scroll_down.jpg"
              className="w-[1.8em] object-contain"
              alt="scroll down"
            ></img>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default OnlineShop;
