import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './CategoryPage.module.css';
import ItemTile from './ItemTile/ItemTile';
import { useSelector } from 'react-redux';
import { selectItemsByCategory } from '../../../../store/productSlice';
import { RootState } from '../../../../store/store';

interface CategoryPageProps {
    category: string;
}

type Items = Record<string, Product>;


const CategoryPage: React.FC<CategoryPageProps> = ( { category } ) => {
    const navigate = useNavigate();    
    const navigateToItemPage = (item_id: number) => {
        navigate(`/shop?category=${category}&item=${item_id}`);
    };

    const items: Items = useSelector((state: RootState) => selectItemsByCategory(state, category));

    return (
        <div className={styles.grid}>
            {Object.entries(items).map(([itemId, item]) => (
                <ItemTile 
                    key={itemId} 
                    categoryName={category} 
                    imageName={item.image_name} 
                    onClick={() => navigateToItemPage(Number(itemId))} 
                />
            ))}
        </div>
    );
};


export default CategoryPage;
