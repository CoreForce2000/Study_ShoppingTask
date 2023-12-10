import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryPage.module.css';
import Tile from '../../components/Tile/Tile';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { setItemClicked, selectClickedItems, selectShuffledItemsByCategory, selectItemsByCategory, setShuffledItems } from '../../../../store/shopSlice';
import { shuffleArray } from '../../../../util/randomize';
import { shopConfig } from '../../../../configs/config';
import { getImagePath } from '../../../../util/imageLoading';

interface CategoryPageProps {
    category: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const clickedItems = useSelector((state: RootState) => selectClickedItems(state, category));
    const allItems = useSelector((state: RootState) => selectItemsByCategory(state, category));
    const storedShuffledItems = useSelector((state: RootState) => selectShuffledItemsByCategory(state, category));

    const [displayItems, setDisplayItems] = useState<Product[]>(storedShuffledItems);

    const onItemTileClick = (category: string, item: Product, index: number) => {
        dispatch(setItemClicked({category, item: [item, index]}));
        navigate(`/shop?category=${category}&item=${item.item_id}`);
    }

    useEffect(() => {

        if (storedShuffledItems.length > 0) {
            setDisplayItems(Array(shopConfig.repeatItems).fill(storedShuffledItems).flat());
        } else {            
            const shuffledItems = shuffleArray(allItems)
            
            dispatch(setShuffledItems({ category, item_id_list: shuffledItems }));
            setDisplayItems(Array(shopConfig.repeatItems).fill(shuffledItems).flat());
        }
    }, [allItems, storedShuffledItems, dispatch, category]);

    console.log(clickedItems);

    return (
        <div className={styles.grid}>
            {displayItems.map((item, index) => (
                <Tile
                    key={`${index}`}
                    text={""} // Assuming each item has a 'name'
                    tileState={clickedItems.some(([clickedItem, clickedIndex]) => clickedItem === item && clickedIndex === index) ? 'itemClicked' : 'none'}
                    onClick={() => onItemTileClick(category, item, index)}
                    backgroundColor='royalblue'
                    imageUrl={getImagePath(category, item.image_name)}
                />
            ))}
        </div>
    );
};

export default CategoryPage;
