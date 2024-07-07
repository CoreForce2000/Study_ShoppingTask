import React, { useState } from "react";
import imageData from "../assets/categories/image_data.json";
import Button from "../components/button";
import { Item } from "../store/shop-slice";
import { getImagePath } from "../util/preload";

interface CategoryListProps {
  categories: Item[];
  onCategorySelect: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategorySelect,
}) => {
  const uniqueCategories = Array.from(
    new Set(categories.map((item) => item.category))
  );

  return (
    <div>
      <h2 className="text-2xl mb-10">Categories </h2>
      <ul>
        {uniqueCategories.map((category, index) => (
          <li key={index}>
            <a href="#" onClick={() => onCategorySelect(category)}>
              {category}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface CategoryGridProps {
  category: string;
  items: Item[];
  categories: string[];
  onNextClick: (category: string) => void;
  onBackClick: () => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  category,
  items,
  categories,
  onNextClick,
  onBackClick,
}) => {
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const currentIndex = categories.findIndex((cat) => cat === category);

  const handleMouseEnter = (item: Item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleNavigateClick = (next: boolean = true) => {
    const nextIndex =
      (next ? currentIndex + 1 : currentIndex - 1) % categories.length;
    onNextClick(categories[nextIndex]);
  };

  const categoryItems = items.filter((item) => item.category === category);

  // Center title and make large. Show also which item out of total number of items it is as (4/100)
  return (
    <div>
      <h2 className="text-center text-2xl">
        {category + ` (${currentIndex + 1}/${categories.length})`}
      </h2>

      <Button onClick={onBackClick}>BACK TO OVERVIEW</Button>
      <div className="grid grid-cols-3 gap-4 mt-10">
        {categoryItems.map((item) => (
          <div
            key={item.item_id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item)}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={getImagePath(item.category, item.image_name)} // Replace with your getImagePath function
              alt={item.category}
              className="w-full h-auto"
              style={{
                filter:
                  hoveredItem === item ? "brightness(90%)" : "brightness(100%)",
              }}
            />
            {hoveredItem === item && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white">
                <p className="text-center">{item.image_name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={() => handleNavigateClick(false)}>
          Previous Category
        </Button>
        <Button onClick={() => handleNavigateClick(true)}>Next Category</Button>
      </div>
    </div>
  );
};

const ImageViewer = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const categories: string[] = Array.from(
    new Set(imageData.map((item) => item.category))
  );

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory("");
  };

  const handleNextClick = (nextCategory: string) => {
    setSelectedCategory(nextCategory);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedCategory !== "" ? (
        <CategoryGrid
          category={selectedCategory}
          items={imageData}
          categories={categories}
          onNextClick={handleNextClick}
          onBackClick={handleBackClick}
        />
      ) : (
        <CategoryList
          categories={imageData}
          onCategorySelect={handleCategorySelect}
        />
      )}
    </div>
  );
};

export default ImageViewer;
