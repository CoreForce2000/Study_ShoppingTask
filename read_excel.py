# %%

import os
import re
import pandas as pd
from typing import Tuple

category_path = "./app/src/assets/categories"

def find_item_id(name_column: pd.Series) -> pd.Series:
    return name_column.apply(lambda x: re.findall(r'\d+', x)[0] if re.findall(r'\d+', x) else None).astype(int)

def remove_apple_double_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.startswith('._'):
                os.remove(os.path.join(root, file))
                print(f"Removed: {os.path.join(root, file)}")

def process_excel_file(excel_path: str) -> pd.DataFrame:
    # Read the excel file
    df = pd.read_excel(excel_path)

    # Lowercase all column names
    df.columns = [col.lower() for col in df.columns]

    # Find column names containing 'item', 'min', 'max' to identify the correct columns
    col_mappings = {}
    for col in df.columns:
        if 'item' in col:
            col_mappings[col] = 'item'
        elif 'min' in col:
            col_mappings[col] = 'minimum'
        elif 'max' in col:
            col_mappings[col] = 'maximum'

    # Check if all necessary columns are identified
    col_mapping_values = set(col_mappings.values())
    if not ('item' in col_mapping_values and 'minimum' in col_mapping_values and 'maximum' in col_mapping_values):
        raise ValueError(f"Not all columns could be identified in {excel_path}: {col_mappings}.")

    # Rename the columns to standard names
    df.rename(columns=col_mappings, inplace=True)

    df["item"] = find_item_id(df['item'])

    return df[['item', 'minimum', 'maximum']]

def create_image_dataframe(image_files: list) -> pd.DataFrame:
    # Extract the numeric part from the image file name
    image_df = pd.DataFrame(image_files, columns=['image_name'])
    image_df['item'] = find_item_id(image_df['image_name'])

    return image_df

def process_category(category_name: str, categories_path: str) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    # Define the paths for images and Excel file
    print("Processing", category_name, "...")
    category_path = os.path.join(categories_path, category_name)
    files_in_category = os.listdir(category_path)
    
    # Identify image and excel files
    image_files = [file for file in files_in_category if file.lower().endswith(('.png', '.jpg', '.jpeg'))]
    excel_files = [file for file in files_in_category if file.lower().endswith(('.xls', '.xlsx'))]
    
    if not excel_files:
        raise ValueError(f"No Excel file found in category {category_name}.")
    
    excel_path = os.path.join(category_path, excel_files[0])
    
    # Process Excel file
    df_excel = process_excel_file(excel_path)
    
    # Create dataframe for images
    df_images = create_image_dataframe(image_files)
    
    # Merge image dataframe with the Excel dataframe on item IDs
    df_merged = pd.merge(df_images, df_excel, on='item', how='outer', indicator=True)
    
    # Find unmatched records
    unmatched_images = df_merged[df_merged['_merge'] == 'left_only']
    unmatched_excel_rows = df_merged[df_merged['_merge'] == 'right_only']
    
    # Drop the merge indicator column for final output
    df_merged.drop(columns=['_merge'], inplace=True)
    
    df_merged['category'] = category_name  # Add a category column
    
    return df_merged, unmatched_images, unmatched_excel_rows

def combine_all_categories(categories_path: str) -> pd.DataFrame:
    category_folders = os.listdir(categories_path)
    all_dataframes = []  # List to hold all the dataframes

    for category_folder in category_folders:
        # Process each category

        remove_apple_double_files(os.path.join(categories_path, category_folder))

        merged_df, _, _ = process_category(category_folder, categories_path)
        all_dataframes.append(merged_df)

    # Combine all dataframes into one
    combined_df = pd.concat(all_dataframes, ignore_index=True)
    
    combined_df["minimum"] = combined_df["minimum"].fillna(0)
    combined_df["maximum"] = combined_df["maximum"].fillna(0)

    return combined_df

# Combine all categories into one dataframe
combined_categories_df = combine_all_categories(category_path)

combined_categories_df = combined_categories_df.astype({
    'image_name':'string',
    'item': 'int',
    'minimum': 'int',
    'maximum': 'int',
    'category': 'string'
})


# Now, let's write this dataframe to an SQL file using pandas' to_sql function with an SQLite connection
from sqlalchemy import create_engine

# Create an in-memory SQLite engine
engine = create_engine('sqlite:///:memory:')

# Write the combined dataframe to the SQLite database
combined_categories_df.to_sql('products', con=engine, index=False, if_exists='replace')

combined_categories_df.sort_values(["category", "item"], inplace=True)

combined_categories_df.to_excel("Items_to_be_priced_raw.xlsx")

# Read the SQLite database to SQL file
sql_file_path = './server/combined_categories.sql'
with open(sql_file_path, 'w') as f:
    for line in engine.raw_connection().iterdump():
        f.write('%s\n' % line)

# %% 
