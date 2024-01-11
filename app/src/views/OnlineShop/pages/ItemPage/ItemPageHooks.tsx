import { useDispatch } from "react-redux";
import { Product, addItemToCart, addItemToClickedItems } from "../../../../store/shopSlice";
import { useNavigate } from "react-router-dom";

function useCustomHook() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const purchaseItem = (product: Product) => {
        
        if(!dispatch(addItemToCart(product))) {
            alert("You don't have enough money to buy this item!");
            return;
        }else{
            dispatch(addItemToClickedItems(product));
        }
        navigate(-1)
    };
}
