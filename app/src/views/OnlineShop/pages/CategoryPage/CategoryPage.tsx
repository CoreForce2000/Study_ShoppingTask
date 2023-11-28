import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryPage.module.css';
import Tile from '../../components/Tile/Tile';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { selectItemsByCategory } from '../../../../store/shopSlice';
import { shuffleArray } from '../../../../util/randomize';

interface CategoryPageProps {
    category: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ( { category } ) => {
    const navigate = useNavigate();    
    const navigateToItemPage = (item_id: number) => {
        navigate(`/shop?category=${category}&item=${item_id}`);
    };

    const items: Product[] = Object.values(useSelector((state: RootState) => selectItemsByCategory(state, category)));

    const [shuffledItems, setshuffledItems] = useState<Product[]>([]);

    useEffect(() => {
        let newShuffledItems: Product[] = [...items];
        // for (let i = 0; i < 10; i++) {
        newShuffledItems = newShuffledItems.concat(shuffleArray(items));
        // }
        setshuffledItems(newShuffledItems);
    }, [])

    return (
        <div className={styles.grid}>
            {shuffledItems.map((item: Product) => (
                <Tile
                    key={item.image_name}
                    categoryName={category}
                    imageName={item.image_name}
                    onClick={() => navigateToItemPage(Number(item.image_name))}
                    backgroundColor='royalblue'
                    type='item'
                />
            ))}
        </div>
    );
};


export default CategoryPage;
