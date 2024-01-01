import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { selectCategoryClickCount } from '../../store/shopSlice'; // Adjust the import path
import { config } from '../../configs/config';

const drugCategories = [...config.illicitDrugCategories, ...config.alcoholCategories, ...config.initialScreenCategories];


const findCategories = (categories: { [key: string]: number }, startCount: number) => {
    let count = startCount;
    
    while (true) {
        const foundCategories = Object.keys(categories).filter(category => categories[category] === count);
        if (foundCategories.length > 0) {
            return foundCategories;
        }
        count++;
    }
};

export const useOtherCategories = () => {
    // Use the selector to get the category click counts
    const categoryClickCount = useSelector((state: RootState) => selectCategoryClickCount(state));

    // Find other categories starting from -1
    const otherCategories = findCategories(categoryClickCount, -1);

    const otherCategoriesWithoutDrugs = otherCategories.filter(category => !drugCategories.includes(category));

    return otherCategoriesWithoutDrugs;
};

