import React, { useState, useEffect } from 'react';
import styles from './OverviewPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import { selectAllCategories, selectClickedCategories, selectShuffledCategories, setCategoryClicked, setShuffledCategories } from '../../../../store/shopSlice';
import { pseudorandomize } from '../../../../util/randomize';
import { shopConfig } from '../../../../configs/config';
import {config} from '../../../../configs/config';

// Define a type for the category, which is a simple string in this case
type Category = string;


const drugCategories = [...config.illicitDrugCategories, ...config.alcoholCategories, ...config.initialScreenCategories];


const OverviewPage: React.FC = ( ) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [displayCategories, setDisplayCategories] = useState<string[]>([]);

    const storedShuffledCategories: string[] = useSelector(selectShuffledCategories)
    const allCategories = useSelector(selectAllCategories);
    const getClickedCategories = useSelector(selectClickedCategories);

    const onCategoryTileClick = (category: string) => {
        dispatch(setCategoryClicked(category));
        navigate(`/shop?category=${category}`);
    }

    useEffect(() => {
    if (storedShuffledCategories.length > 0) {
        setDisplayCategories(Array(shopConfig.repeatCategories).fill(storedShuffledCategories).flat());
    } else {
        const nonDrugCategories = allCategories.filter(category => !drugCategories.includes(category));
        const shuffledCategories = pseudorandomize(nonDrugCategories, drugCategories, config.alcoholCategories, config.initialScreenCategories);
        
        dispatch(setShuffledCategories(shuffledCategories));
        setDisplayCategories(shuffledCategories);
    }
    }, [storedShuffledCategories, allCategories, dispatch]);


    return (
        <div className={styles.overviewPage}>
            {displayCategories.map((category: Category, index: number) => (
                <Tile 
                    key={`${category}-${index}`} 
                    text={category} 
                    tileState={getClickedCategories.includes(category) ? 'categoryClicked' : 'none'}
                    onClick={ ()=>onCategoryTileClick(category) }
                    backgroundColor={shopConfig.categoryTileColor}
                />
            ))}
        </div>
    );
};

export default OverviewPage;
