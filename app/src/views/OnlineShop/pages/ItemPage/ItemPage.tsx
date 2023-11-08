import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './ItemPage.module.css';
import ItemTile from '../../components/ItemTile/ItemTile';
import BackButton from '../../components/BackButton/BackButton';

// Define types for the item
interface Item {
    image_name: string;
    item: number;
    minimum: number;
    maximum: number;
  }

const CategoryPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [searchParams] = useSearchParams();
    const categoryName = searchParams.get('name') || '';

    useEffect(() => {
        if (categoryName) {
            // API call to fetch items for a category
            fetch(`http://localhost:3001/items?category=${categoryName}`)
                .then(response => response.json())
                .then(data => {
                    setItems(data);
                })
                .catch(error => {
                    console.error('Error fetching items for category:', error);
                });
        }
    }, [categoryName]);

    console.log('items', items)

    return (
        <div className={styles.grid}>
            <BackButton />
            <h1>{categoryName}</h1>
            {items.map((item: Item) => (
                <ItemTile key={item.item} categoryName={categoryName} imageName={item.image_name} />
            ))}
        </div>
    );
};


export default CategoryPage;
