import React, { useState, useEffect } from 'react';
import CategoryTile from './CategoryTile/CategoryTile';
import styles from './OverviewPage.module.css';
import { useSelector } from 'react-redux';
import { selectAllCategories } from '../../../../store/productSlice';
import { useNavigate } from 'react-router-dom';

// Define a type for the category, which is a simple string in this case
type Category = string;

const OverviewPage: React.FC = ( ) => {
    const navigate = useNavigate();
    const navigateToCategoryPage = (category: string) => {
        navigate(`/shop?category=${category}`);
    };

    const categories = useSelector(selectAllCategories);

    return (
        <div className={styles.overviewPage}>
            {categories.map((category: Category) => (
                <CategoryTile 
                    key={category} 
                    categoryName={category} 
                    onClick={ ()=>navigateToCategoryPage(category) }
                />
            ))}
        </div>
    );
};

export default OverviewPage;
