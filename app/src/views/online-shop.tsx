import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ListTodoIcon,
  ShoppingCartIcon,
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
import { isScrollAreaAtBottom } from "../util/functions";
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
              onClick={() =>
                delayAfterClick(() => {
                  store.clickCategory(category);
                  store.navigateTo("items");
                })
              }
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
                onClick={() =>
                  delayAfterClick(() => {
                    store.clickItemTile(index);
                    store.navigateTo("item");
                  })
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

      {view === "trolley" && (
        <>
          {store.trolley.map((trolleyItem, index) => (
            <Tile
              actionName="select item trolley"
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

const ItemPage: React.FC<{}> = ({}) => {
  const store = useTaskStore();

  return (
    store.currentCategory &&
    store.currentItem && (
      <div className="flex flex-col items-center justify-evenly">
        <img
          className="h-[6.5em] object-cover pb-2"
          src={`${getImagePath(
            store.currentItem.item.category,
            store.currentItem.item.image_name
          )}`}
          alt={store.currentItem.item.image_name}
        />
        <div className="grid grid-cols-2 text-sm">
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

const Timer: React.FC<{}> = ({}) => {
  const store = useTaskStore();
  const navigate = useNavigate();

  const timerObject = useTimer({ delay: 1000 }, () => {
    if (store.time === 1) {
      navigate(`../slide/${store.slide + 1}`);
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

  const scrollRef = useScrollRestoration(
    "category_" + store.currentCategory,
    false
  );

  const onScroll = () => {
    console.log("Scrolling");
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
        className="w-full p-4 pb-2 text-white bg-black text-xs box-border"
        style={{ borderBottom: `7px solid ${config.colors.lineColor}` }}
      >
        <EvenlySpacedRow
          firstChild={<div>Budget : £{store.budget}</div>}
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
      <div className="w-full p-4 text-xs box-border pt-0.5 pb-2">
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
              icon={ListTodoIcon}
              suffixText="Show Shopping List"
              visible={store.isPhase3}
              onClick={() => {}}
            />
          }
          lastChild={
            store.page === "trolley" ? (
              <Button
                icon={SquareXIcon}
                variant="transparent"
                color="black"
                prefixText="Remove from Trolley"
                onClick={() => store.removeTrolleyItems()}
              />
            ) : (
              <Button
                icon={ArrowRightIcon}
                variant="transparent"
                color="black"
                prefixText="Go to trolley"
                onClick={() => store.navigateTo("trolley")}
              />
            )
          }
        />
      </div>

      {/* Content */}
      <div className="flex flex-col w-[15em] h-[calc((5/7)*(15em+0.4em))]">
        <div className="overflow-y-auto" ref={scrollRef} onScroll={onScroll}>
          {store.page === "item" ? (
            <ItemPage />
          ) : (
            <GridPage view={store.page} category={store.currentCategory} />
          )}
          <EvenlySpacedRow
            firstChild={<div></div>}
            secondChild={
              <Button
                onClick={store.removeTrolleyItems}
                className="text-sm"
                visible={
                  store.page === "trolley" &&
                  store.selectedTrolleyItems.length > 0
                }
              >
                Remove
              </Button>
            }
            lastChild={<div></div>}
          ></EvenlySpacedRow>
        </div>
      </div>
    </div>
  );
};

export default OnlineShop;
