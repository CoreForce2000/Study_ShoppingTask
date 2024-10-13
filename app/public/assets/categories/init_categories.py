# %%

import os
import re
import pandas as pd
from typing import Tuple

category_path = "./"

# Load the generic and subcategories Excel file
subcategory_file = "./Generic and subcategories.xlsx"
subcategory_df = pd.read_excel(subcategory_file)

# Ensure the category names are lowercase for case-insensitive comparison
subcategory_df["Category"] = subcategory_df["Category"].str.lower()



def find_item_id(name_column: pd.Series) -> pd.Series:
    return name_column.apply(
        lambda x: re.findall(r"\d+", x)[0] if re.findall(r"\d+", x) else None
    ).astype(int)


def remove_apple_double_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.startswith("._"):
                os.remove(os.path.join(root, file))
                print(f"Removed: {os.path.join(root, file)}")


def process_excel_file(excel_path: str) -> pd.DataFrame:
    # Read the excel file
    df = pd.read_excel(excel_path)

    # Lowercase all column names
    df.columns = [col.lower().strip() for col in df.columns]

    # Find column names containing 'item', 'min', 'max' to identify the correct columns
    other_names = ["item", "picture", "bath", "travel"]
    # Now add strings included in the excel file name
    excel_file_name = os.path.basename(excel_path).lower()
    other_names.extend(re.findall(r"\w+", excel_file_name))

    # filter out pricing and xlsx, and remove any trailing "s"
    other_names = [name[:-1] if name.endswith("s") else name for name in other_names]
    other_names = [name for name in other_names if name not in ["pricing", "xlsx", ""]]

    col_mappings = {}
    for col in df.columns:
        if any(name in col for name in other_names):
            col_mappings[col] = "item"
        elif "min" in col or "mim" in col:
            col_mappings[col] = "minimum"
        elif "max" in col:
            col_mappings[col] = "maximum"

    # Check if all necessary columns are identified
    col_mapping_values = set(col_mappings.values())
    if not (
        "item" in col_mapping_values
        and "minimum" in col_mapping_values
        and "maximum" in col_mapping_values
    ):
        raise ValueError(
            f"Not all columns could be identified in {excel_path}: {df.columns}."
        )

    # Rename the columns to standard names
    df.rename(columns=col_mappings, inplace=True)

    df = df[["item", "minimum", "maximum"]]
    
    df.dropna(how="all", inplace=True)

    df["item"] = find_item_id(df["item"])

    return df


def create_image_dataframe(image_files: list) -> pd.DataFrame:
    # Extract the numeric part from the image file name
    image_df = pd.DataFrame(image_files, columns=["image_name"])
    image_df["item"] = find_item_id(image_df["image_name"])

    return image_df


def process_category(
    category_name: str, categories_path: str
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    # Check if the category exists in the "Categories" column of the Excel file
    if category_name.lower() not in subcategory_df["Category"].values:
        print(f"Category '{category_name}' not found in the 'Categories' column of the Excel file.")
        return pd.DataFrame(), pd.DataFrame(), pd.DataFrame()  # Return empty dataframes
    
    # Define the paths for images and Excel file
    category_path = os.path.join(categories_path, category_name)
    files_in_category = os.listdir(category_path)

    # Identify image and excel files
    image_files = [
        file
        for file in files_in_category
        if file.lower().endswith((".png", ".jpg", ".jpeg"))
    ]
    excel_files = [
        file for file in files_in_category if file.lower().endswith((".xls", ".xlsx"))
    ]

    if len(excel_files) != 1:
        raise ValueError(f"There must be exactly one Excel file in category {category_name}. Found {len(excel_files)}.")

    excel_path = os.path.join(category_path, excel_files[0])

    # Process Excel file
    df_excel = process_excel_file(excel_path)

    # Create dataframe for images
    df_images = create_image_dataframe(image_files)

    # Merge image dataframe with the Excel dataframe on item IDs
    df_merged = pd.merge(df_images, df_excel, on="item", how="outer", indicator=True)

    # Find unmatched records
    unmatched_images = df_merged[df_merged["_merge"] == "left_only"]
    unmatched_excel_rows = df_merged[df_merged["_merge"] == "right_only"]

    df_merged = df_merged[df_merged["_merge"] == "both"]

    # Drop the merge indicator column for final output
    df_merged.drop(columns=["_merge"], inplace=True)

    df_merged["category"] = category_name  # Add a category column

    highlight = "Err >>" if len(unmatched_images) > 0 or len(unmatched_excel_rows) > 0 else ""

    global counter
    counter = 1 if "counter" not in globals() else counter
    counter += 1

    if highlight:
        print(f"unmatched images: {len(unmatched_images)} (N={len(image_files)})\tunmatched excel rows: {len(unmatched_excel_rows)} (N={len(df_merged)})\t{category_name}")

    return df_merged, unmatched_images, unmatched_excel_rows



def combine_all_categories(categories_path: str) -> pd.DataFrame:
    category_folders = [
        f
        for f in os.listdir(categories_path)
        if os.path.isdir(os.path.join(categories_path, f))
    ]

    all_dataframes = []  # List to hold all the dataframes

    for category_folder in category_folders:
        # Process each category

        remove_apple_double_files(os.path.join(categories_path, category_folder))

        try:    
            merged_df, _, _ = process_category(category_folder, categories_path)
            all_dataframes.append(merged_df)
        except Exception as e:
            print(f"Error processing category {category_folder}: {e}")

    # Combine all dataframes into one
    combined_df = pd.concat(all_dataframes, ignore_index=True)

    combined_df["minimum"] = combined_df["minimum"].fillna(0)
    combined_df["maximum"] = combined_df["maximum"].fillna(0)

    return combined_df


# Combine all categories into one dataframe
combined_categories_df = combine_all_categories(category_path)

combined_categories_df = combined_categories_df.astype(
    {
        "image_name": "string",
        "item": "int",
        "minimum": "int",
        "maximum": "int",
        "category": "string",
    }
)


import json

# Define a dictionary to hold the data
data = []

combined_categories_df = combined_categories_df.dropna()

# Loop through each category in the dataframe
for category in combined_categories_df["category"].unique():
    # Filter the dataframe to only include rows for the current category
    category_df = combined_categories_df[combined_categories_df["category"] == category]

    # Loop through each row in the filtered dataframe
    for index, row in category_df.iterrows():
        # Add the item data to the dictionary
        item_data = {
            "item_id": row["item"],
            "category": row["category"],
            "image_name": row["image_name"],
            "minimum": row["minimum"],
            "maximum": row["maximum"],
        }
        data.append(item_data) 


# Create the JSON mapping of Category to Generic Category
category_mapping = [
    {"name": row["Category"], "genericCategory": row["Generic Category"]}
    for _, row in subcategory_df.iterrows()
]

# Write the mapping to a JSON file
with open('../../../src/assets/configs/category_mapping.json', 'w') as json_file:
    json.dump(category_mapping, json_file, indent=4)

# Get all Generic Categories where Flagged is 1
flagged_generic_categories = subcategory_df[subcategory_df["Flagged"] == 1]["Generic Category"].unique().tolist()

print("Flagged Generic Categories:", flagged_generic_categories)

# Write the mapping to a JSON file
with open('../../../src/assets/configs/flagged_generic_categories.json', 'w') as json_file:
    json.dump(flagged_generic_categories, json_file, indent=4)

# Write the dictionary to a JSON file
with open("../../../src/assets/categories/image_data.json", "w") as f:
    json.dump(data, f)

# %%

# Now, let's write this dataframe to an SQL file using pandas' to_sql function with an SQLite connection
from sqlalchemy import create_engine

# Create an in-memory SQLite engine
engine = create_engine("sqlite:///:memory:")

# Write the combined dataframe to the SQLite database
combined_categories_df.to_sql("products", con=engine, index=False, if_exists="replace")

combined_categories_df.sort_values(["category", "item"], inplace=True)

combined_categories_df.to_excel("Items_to_be_priced_raw.xlsx")

# Read the SQLite database to SQL file
sql_file_path = "./combined_categories.sql"
with open(sql_file_path, "w") as f:
    for line in engine.raw_connection().iterdump():
        f.write("%s\n" % line)

# %%
