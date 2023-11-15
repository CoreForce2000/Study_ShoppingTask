import React, { useState, useEffect } from 'react';
import styles from './OverviewPage.module.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import { selectAllCategories } from '../../../../store/shopSlice';
import { pseudorandomize } from '../../../../util/randomize';

// Define a type for the category, which is a simple string in this case
type Category = string;

const drugCategories = [
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

const OverviewPage: React.FC = ( ) => {
    const navigate = useNavigate();
    const navigateToCategoryPage = (category: string) => {
        navigate(`/shop?category=${category}`);
    };

    const categories = useSelector(selectAllCategories);

    const [allCategoriesRandomized, setallCategoriesRandomized] = useState<string[]>([]);

    useEffect(() => {

        const allCategories = [...new Set([...categories])];
        const excludedCategories = [...drugCategories, ...alcoholCategories, ...initialScreenCategories];
    
        const nonDrugCategories = allCategories.filter(category => !excludedCategories.includes(category));
    
        const categoriesRandomized = pseudorandomize(nonDrugCategories, drugCategories, alcoholCategories, initialScreenCategories);
    
        for (let i = 0; i < 10; i++) {
            setallCategoriesRandomized(allCategoriesRandomized.concat(categoriesRandomized));
        }
    }, [])

    return (
        <div className={styles.overviewPage}>
            {allCategoriesRandomized.map((category: Category) => (
                <Tile 
                    key={category} 
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
