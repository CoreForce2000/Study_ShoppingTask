import React, { useEffect } from 'react';
import styles from './ItemPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { addItemToCart, logAction, selectProduct, setBudget } from '../../../../store/shopSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { getImagePath } from '../../../../util/imageLoading';
import { shopConfig } from '../../../../configs/config';

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


const ItemPage: React.FC<ItemPageProps> = ( { category, item, setInterSlide }) => {
    useScrollRestoration();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const product = useSelector((state: RootState )=>selectProduct(state, category, item));
    const budget = useSelector((state: RootState )=>state.shop.budget);

    const purchaseItem = () => {

        console.log("Budget:", budget, "Minimum:", product.minimum)

        const price = (budget < shopConfig.useMinimumPriceBelow)?product.minimum:product.maximum;

        if(budget <= price)  {
            setInterSlide(`extraBudget`)
            // alert("Congrats! You are one of our lucky shoppers! You get an extra £1000 from us to continue shopping!")
            dispatch(setBudget(1000));
            return;
        }else{
            dispatch(addItemToCart(product))
        }
        dispatch(logAction({type: "add_to_cart", item: product.item_id, category: product.category}));
        navigate(-1)
    };

    const backClicked = () => {
        dispatch(logAction({type: "not_add_to_cart", item: product.item_id, category: product.category}));
        navigate(-1)
    }

    return (
        <div className={styles.component}>
            <img className={styles.itemImage} src={getImagePath(category, product.image_name)} alt={product.image_name} />
            <div className={styles.buttons}>
                <button className={styles.button} style={{backgroundColor:shopConfig.backButtonColor}} onClick={backClicked}>Back</button>  
                <button className={styles.button} style={{backgroundColor:shopConfig.addToCartButtonColor}} onClick={purchaseItem}>Add to Trolley</button>  
            </div>
        </div>
    );
};

export default ItemPage;