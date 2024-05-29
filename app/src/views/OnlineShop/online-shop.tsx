import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import ItemPage from "./pages/ItemPage/ItemPage";
import OverviewPage from "./pages/OverviewPage/OverviewPage";
import CartPage from "./pages/CartPage/CartPage";
import { config, shopConfig } from "../../configs/config";
import EvenlySpacedRow from "../../components/EvenlySpacedRow/EvenlySpacedRow";
import Timer from "../../components/timer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { CartItem, removeItemFromCart, selectIsPhase3 } from "../../store/shopSlice";
import TaskViewport from "../../components/task-viewport";
import { logShopAction } from "../../store/dataSlice";
import { setScrollPosition } from '../../store/shopSlice';
import Button from "../../components/button";
import { ArrowLeftIcon, ListTodoIcon, ShoppingCart, Trash2Icon} from "lucide-react";

export const useScrollRestoration = (scrollKey: string, disable:boolean) => {
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollPosition = useSelector(
    (state: RootState) => state.shop.scrollPositions[scrollKey] || 3
  );

  useEffect(() => {
    if(!disable) {
        const handleScroll = () => {
            if (scrollRef.current) {
                if(scrollRef.current.scrollTop > 2) {
                    dispatch(setScrollPosition({ key: scrollKey, position: scrollRef.current.scrollTop }));
                }
            }
            };
            
            const scrollElement = scrollRef.current;
            if (scrollElement) { 
                scrollElement.scrollTop = scrollPosition;
                scrollElement.addEventListener('scroll', handleScroll);
            }
        
            return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
            }
            
    }
  }, [dispatch, scrollPosition, scrollKey, disable]);

  return scrollRef;
};

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
  const isPhase3 = useSelector(selectIsPhase3)

  const scrollRef = useScrollRestoration("category_" + category, item !== 0);

  const budget: number = useSelector((state: RootState) => state.shop.budget);
  const numItemsInTrolley: number = useSelector(
    (state: RootState) => state.shop.itemsInCart.length
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
        logShopAction({
          Shopping_budget: budget,
          Shopping_event: "remove_from_cart",
          Shopping_item: cartItem.product.image_name,
          Shopping_category: cartItem.product.category,
          Shopping_price: cartItem.price,
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
    <TaskViewport backgroundImage={interSlides[interSlide]} verticalAlign={true} />
  ) : interSlide === "extraBudget" ? (
    <TaskViewport backgroundImage={interSlides[interSlide]} verticalAlign={true}>
      <button
        className={styles.continueShoppingButton}
        onClick={() => setInterSlide(undefined)}
      ></button>
    </TaskViewport>
  ) : (
    <TaskViewport backgroundImage={interSlides[interSlide]} verticalAlign={true}>
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
                    navigate('/slide');
                    endOfPhase1Sound.play();
                  }}
                  setInterSlide={setInterSlide}
                />
              }
              lastChild={
                <Button
                  prefixText={'Trolley\u00A0\u00A0'}
                  icon={ShoppingCart}
                  suffixText={`${numItemsInTrolley}`}
                  onClick={() => {
                    navigate('/shop?page=cart');
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
                  suffixText={'Back'}
                  variant="transparent"
                  color="black"
                  onClick={() => {
                    setSelectedItems([]);
                    navigate('/shop');
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
                  suffixText={'Remove from Trolley'}
                  onClick={() => removeFromCart(selectedItems)}
                  visible={visibility.removeFromTrolley}
                />
              }
            />
          </div>

          <div className="flex flex-col w-[15em] h-[calc((5/7)*(15em+0.4em))]">
            <div className="overflow-y-auto no-scrollbar" ref={scrollRef}>
              {page === 'cart' ? (
                <CartPage
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              ) : category === '' ? (
                <OverviewPage />
              ) : item === 0 ? (
                <CategoryPage category={category} />
              ) : (
                <ItemPage category={category} item={item} setInterSlide={setInterSlide} />
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
