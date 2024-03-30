import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryPage.module.css';
import Tile from '../../components/Tile/Tile';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { selectClickedItemTiles, selectShuffledItemsByCategory, selectItemsByCategory, setShuffledItems, setItemTileClicked, Product, logAction, addItemToClickedItems } from '../../../../store/shopSlice';
import { shuffleArray } from '../../../../util/randomize';
import { shopConfig } from '../../../../configs/config';
import { getImagePath, preloadImage } from '../../../../util/imageLoading';
import { delayAfterClick } from '../../../../util/delayAfterClick';

interface CategoryPageProps {
    category: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const clickedTiles = useSelector((state: RootState) => selectClickedItemTiles(state, category));
    const allItems = useSelector((state: RootState) => selectItemsByCategory(state, category));
    let shuffledItems = useSelector((state: RootState) => selectShuffledItemsByCategory(state, category));


    
    const onItemTileClick = (index: number, item: Product | null) => {
        dispatch(setItemTileClicked({category: category, tile: index}));
            
        if (item) {
            navigate(`/shop?category=${category}&item=${item.item_id}`);
        }else {
            const currentItem: Product = shuffledItems[clickedTiles.length % shuffledItems.length];
            
            dispatch(logAction({type: "click_item", item: currentItem.item_id, category: category}));
            dispatch(addItemToClickedItems(currentItem));
            // Preload next image and navigate to the current item
            if (clickedTiles.length < shuffledItems.length - 1) {
                const nextItem: Product = shuffledItems[(clickedTiles.length + 1) % shuffledItems.length];
                preloadImage(getImagePath(category, nextItem.image_name));
            }
    
            navigate(`/shop?category=${category}&item=${currentItem.item_id}`);
        }
    }

    useEffect(() => {

        preloadImage(getImagePath(category, allItems[0].image_name));

        if (shuffledItems.length == 0) {     
            const shuffledItems = shuffleArray(allItems)
            dispatch(setShuffledItems({ category, item_id_list: shuffledItems }));
        }
    }, [allItems, shuffledItems, dispatch, category]);
    
    return (
        <div className={styles.grid}>
            {Array.from({ length: shopConfig.numberOfItemTiles }, (_, index) => {
                // Find the order in which the tile was clicked
                const clickOrder = clickedTiles.indexOf(index);
                // If the tile was clicked, determine the corresponding item, otherwise set to null
                const item = clickOrder !== -1 ? shuffledItems[clickOrder % shuffledItems.length] : null;

                return (
                    <Tile
                        key={index}
                        text={''} // Assuming each item has a 'name'
                        tileState={clickOrder !== -1 ? 'itemClicked' : 'none'}
                        // onClick={() => onItemTileClick(index, item)}
                        onClick={() => {
                            delayAfterClick(() => onItemTileClick(index, item));
                          }}

                        backgroundColor={shopConfig.itemTileColor}
                        imageUrl={item ? getImagePath(category, item.image_name) : ''}
                        backgroundIsBlack={category == "Cocaine"}
                    />
                );
            })}
        </div>
    );
};

export default CategoryPage;