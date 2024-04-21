import React, { useEffect, useState } from "react";
import styles from "./OnlineShop.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import ItemPage from "./pages/ItemPage/ItemPage";
import OverviewPage from "./pages/OverviewPage/OverviewPage";
import CartPage from "./pages/CartPage/CartPage";
import { config, shopConfig } from "../../configs/config";
import IconButton from "./components/IconButton/IconButton";
import EvenlySpacedRow from "./components/EvenlySpacedRow/EvenlySpacedRow";
import Timer from "./components/Timer/Timer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { CartItem, logAction, removeItemFromCart } from "../../store/shopSlice";
import FixedRatioView from "../../components/FixedRatioView/FixedRatioView";
import SlideView from "../../components/SlideView/SlideView";
import { useScrollRestoration } from "./OnlineShopHooks";

interface OnlineShopProps {}

interface buttonsVisible {
  back: boolean;
  removeFromTrolley: boolean;
  goToTrolley: boolean;
}

const interSlides = {
  timeIsRunningOut: `${config.SLIDE_PATH}/shop/Slide10.JPG`,
  extraBudget: `${config.SLIDE_PATH}/shop/Slide11.JPG`,
};

const OnlineShop: React.FC<OnlineShopProps> = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [interSlide, setInterSlide] = useState<keyof typeof interSlides>();

  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || "";
  const category = searchParams.get("category") || "";
  const item = Number(searchParams.get("item")) || 0;

  const scrollRef = useScrollRestoration("category_" + category, item !== 0);

  const budget: number = useSelector((state: RootState) => state.shop.budget);
  const numItemsInTrolley: number = useSelector(
    (state: RootState) => state.shop.itemsInCart.length
  );

  let visibility: buttonsVisible = {
    back: true,
    removeFromTrolley: false,
    goToTrolley: true,
  };

  const timeIsRunningOutSound = new Audio(`${config.SOUND_PATH}Time's up.mp3`);
  const luckyCustomerSound = new Audio(
    `${config.SOUND_PATH}Lucky customer.mp3`
  );
  const endOfPhase1Sound = new Audio(`${config.SOUND_PATH}End of phase1.mp3`);

  if ((category === "" && page !== "cart") || (category !== "" && item !== 0)) {
    visibility.back = false;
  }
  if (page === "cart") {
    visibility.removeFromTrolley = selectedItems.length > 0;
    visibility.goToTrolley = false;
  }

  const removeFromCart = (selectedItems: CartItem[]) => {
    selectedItems.forEach((cartItem: CartItem) => {
      dispatch(removeItemFromCart(cartItem));
      dispatch(
        logAction({
          type: "remove_from_cart",
          item: cartItem.product.item_id,
          category: cartItem.product.category,
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

  return interSlide === "timeIsRunningOut" ? (
    <SlideView backgroundImage={interSlides[interSlide]} verticalAlign={true} />
  ) : interSlide === "extraBudget" ? (
    <SlideView backgroundImage={interSlides[interSlide]} verticalAlign={true}>
      <button
        className={styles.continueShoppingButton}
        onClick={() => setInterSlide(undefined)}
      ></button>
    </SlideView>
  ) : (
    <FixedRatioView>
      <div className={styles.onlineShop}>
        <div
          className={styles.infoBar}
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
              <IconButton
                preText={"Trolley\u00A0\u00A0"}
                iconUrl={config.BUTTON_PATH + "cart_white.png"}
                text={`${numItemsInTrolley}`}
                onClick={function (): void {
                  dispatch(
                    logAction({ type: "to_trolley", item: -1, category: "" })
                  );
                  navigate("/shop?page=cart");
                }}
                visible={true}
              />
            }
          />
        </div>

        <div className={styles.buttonBar}>
          <EvenlySpacedRow
            firstChild={
              <IconButton
                iconUrl={config.BUTTON_PATH + "arrow.png"}
                text={"Back"}
                onClick={function (): void {
                  setSelectedItems([]);
                  navigate("/shop");
                }}
                visible={visibility.back}
              />
            }
            secondChild={<></>}
            lastChild={
              <IconButton
                iconUrl={config.BUTTON_PATH + "checkbox.png"}
                text={"Remove from Trolley"}
                onClick={() => removeFromCart(selectedItems)}
                visible={visibility.removeFromTrolley}
              />
            }
          />
        </div>

        <div className={styles.content}>
          <div className={styles.scrollContent} ref={scrollRef}>
            {page === "cart" ? (
              <CartPage
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              ></CartPage>
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
    </FixedRatioView>
  );
};

export default OnlineShop;
