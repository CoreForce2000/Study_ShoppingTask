import os
import shutil

head_num = 5

def copy_first_three_images(src_dir, dest_dir):
    # Initialize lists to store names of outlier categories
    categories_with_fewer_images = []
    categories_without_excel = []

    # Ensure the source directory exists
    if not os.path.exists(src_dir):
        print(f"The source directory {src_dir} does not exist.")
        return

    # Create the destination directory if it does not exist
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

    init_file_path = os.path.join(src_dir, 'init_categories.py')
    if os.path.exists(init_file_path):
        shutil.copy2(init_file_path, dest_dir)

    # Iterate through each category in the source directory
    for category in os.listdir(src_dir):
        category_path = os.path.join(src_dir, category)

        # Skip if it's not a directory
        if not os.path.isdir(category_path):
            continue

        # Create corresponding category directory in destination
        dest_category_path = os.path.join(dest_dir, category)
        os.makedirs(dest_category_path, exist_ok=True)

        # Initialize variables to track category status
        excel_copied = False
        image_count = 0

        # Iterate through each file in the category directory
        for file in os.listdir(category_path):
            file_path = os.path.join(category_path, file)

            # Copy the Excel file
            if file.lower().endswith(('.xlsx', '.xls')) and not excel_copied:
                shutil.copy2(file_path, os.path.join(dest_category_path, file))
                excel_copied = True

            # Copy the first three images
            elif file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')) and image_count < head_num:
                src_img_path = os.path.join(category_path, file)
                dest_img_path = os.path.join(dest_category_path, file)
                shutil.copy2(src_img_path, dest_img_path)
                image_count += 1

        # Update lists with category names
        if image_count < head_num:
            categories_with_fewer_images.append(category)
        if not excel_copied:
            categories_without_excel.append(category)

    # Print the category names
    print(f"Categories with fewer than {head_num} images: {', '.join(categories_with_fewer_images) if categories_with_fewer_images else 'None'}")
    print(f"Categories without an Excel file: {', '.join(categories_without_excel) if categories_without_excel else 'None'}")

# Example usage
source_directory = './categories'
destination_directory = './categories_head'
copy_first_three_images(source_directory, destination_directory)
