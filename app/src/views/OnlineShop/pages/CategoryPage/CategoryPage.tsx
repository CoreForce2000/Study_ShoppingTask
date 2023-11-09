import React, { useState, useEffect } from 'react';
import CategoryTile from '../../components/CategoryTile/CategoryTile';
import styles from './CategoryPage.module.css';

// Define a type for the category, which is a simple string in this case
type Category = string;

const ShopHome: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        // API call to fetch categories
        fetch('http://localhost:3001/categories')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    return (
        <div className={styles.categoryPage}>
            {categories.map((category: Category) => (
                <CategoryTile key={category} categoryName={category} />
            ))}
        </div>
    );
};

export default ShopHome;
