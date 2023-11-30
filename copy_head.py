
import os
import shutil

def copy_first_three_images(src_dir, dest_dir):
    # Ensure the source directory exists
    if not os.path.exists(src_dir):
        print(f"The source directory {src_dir} does not exist.")
        return

    # Create the destination directory if it does not exist
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

    # Iterate through each category in the source directory
    for category in os.listdir(src_dir):
        category_path = os.path.join(src_dir, category)

        # Skip if it's not a directory
        if not os.path.isdir(category_path):
            continue

        # Create corresponding category directory in destination
        dest_category_path = os.path.join(dest_dir, category)
        os.makedirs(dest_category_path, exist_ok=True)

        # Copy the first three images
        images = [img for img in os.listdir(category_path) if img.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
        for img in images[:3]:
            src_img_path = os.path.join(category_path, img)
            dest_img_path = os.path.join(dest_category_path, img)
            shutil.copy2(src_img_path, dest_img_path)

# Example usage
source_directory = './categories'
destination_directory = './categories_head'
copy_first_three_images(source_directory, destination_directory)
