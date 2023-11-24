import React, { useState, useEffect } from 'react';
import styles from './OverviewPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import { selectAllCategories, selectShuffledCategories, setShuffledCategories } from '../../../../store/shopSlice';
import { pseudorandomize } from '../../../../util/randomize';

// Define a type for the category, which is a simple string in this case
type Category = string;

const illicitDrugCategories = [
    "Cannabis",
    "Cannabis\nProducts",
    "Cigarettes",
    "Cigars",
    "Ecstasy",
    "Hashish",
    "Hookah",
    "Pipers",
    "Rolling\nTobacco",
    "Vapin"
]

const alcoholCategories = [
    "Alcopops",
    "Beer",
    "Brandy",
    "Champagne",
    "Cider",
    "Cocktails",
    "Gin",
    "Prosecco",
    "Red\nWine",
    "Vodka",
    "Rum",
    "Whisky",
    "White Wine",
]

const initialScreenCategories = [
    "Cocaine",
    "Crack",
    "Heroin",
]

const drugCategories = [...illicitDrugCategories, ...alcoholCategories, ...initialScreenCategories];
        


const OverviewPage: React.FC = ( ) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const navigateToCategoryPage = (category: string) => {
        navigate(`/shop?category=${category}`);
    };

    const storedShuffledCategories: string[] = useSelector(selectShuffledCategories)
    const allCategories = useSelector(selectAllCategories);

    const [displayCategories, setdisplayCategories] = useState<string[]>([]);


    

    useEffect(() => {

        if(storedShuffledCategories.length > 0) {

            let categories: string[] = []
            for (let i = 0; i < 10; i++) {
                categories = categories.concat(storedShuffledCategories);
            }
            setdisplayCategories(categories);
        } else {
            
            const nonDrugCategories = allCategories.filter(category => !drugCategories.includes(category));
            const shuffledCategories = pseudorandomize(nonDrugCategories, drugCategories, alcoholCategories, initialScreenCategories);
        
            dispatch(setShuffledCategories(shuffledCategories));
            setdisplayCategories(shuffledCategories);
        }

    }, [])

    return (
        <div className={styles.overviewPage}>
            {displayCategories.map((category: Category, index: number) => (
                <Tile 
                    key={`${category}-${index}`} 
                    categoryName={category} 
                    onClick={ ()=>navigateToCategoryPage(category) }
                    backgroundColor='royalblue'
                    type='category'
                />
            ))}
        </div>
    );
};

export default OverviewPage;
