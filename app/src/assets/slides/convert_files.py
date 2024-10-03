# %%

import os
from PIL import Image

def convert_to_jpg(folder_path):
    # Check if the specified folder exists
    if not os.path.isdir(folder_path):
        print(f"The folder {folder_path} does not exist.")
        return

    # Loop through all the files in the folder
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        
        # Check if it's a file and not a sub-directory
        if os.path.isfile(file_path):
            # Open the image file
            try:
                # Convert filename to lowercase
                lower_filename = filename.lower()
                
                # If the filename was changed to lowercase, rename the file
                if filename != lower_filename:
                    new_file_path_lower = os.path.join(folder_path, lower_filename)
                    os.rename(file_path, new_file_path_lower)
                    file_path = new_file_path_lower
                    filename = lower_filename
                
                with Image.open(file_path) as img:
                    # Check if the image is already in JPG format
                    if img.format == 'JPEG' and file_path.endswith('.jpg'):
                        continue
                    
                    # Convert the image to RGB mode if it's not already
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    
                    # Define the new filename with .jpg extension
                    new_filename = os.path.splitext(filename)[0] + '.jpg'
                    new_file_path = os.path.join(folder_path, new_filename)
                    
                    # Save the image in JPG format
                    img.save(new_file_path, 'JPEG')
                    print(f"Converted {filename} to {new_filename}.")
                    
                    # Optionally, remove the old file
                    os.remove(file_path)
                    print(f"Removed the original file {filename}.")
            except Exception as e:
                print(f"Failed to convert {filename}: {e}")


    # Additional logic to find and adjust slide numbers
    slide_filenames = [f for f in os.listdir(folder_path) if "slide" in f]
    slide_numbers = [int(f.split('slide')[1].split('_')[0].split('.')[0]) for f in slide_filenames if f.split('slide')[1].split('_')[0].split('.')[0].isdigit()]
    print(slide_filenames)

    if slide_numbers:
        min_slide_number = min(slide_numbers)
        print(min_slide_number) 

        for filename in slide_filenames:
            slide_num_str = filename.split('slide')[1].split('_')[0].split('.')[0]
            if slide_num_str.isdigit():
                slide_num = int(slide_num_str)
                new_slide_num = slide_num - (min_slide_number - 1)
                new_filename = filename.replace(f"slide{slide_num}", f"slide{new_slide_num}")
                os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_filename))


# Specify the folder path here
folder_path = './'

convert_to_jpg('./phase2/')
convert_to_jpg('./end/')
convert_to_jpg('./instructionsPhase1/')
convert_to_jpg('./instructionsPhase2/')
convert_to_jpg('./instructionsPhase3/')
convert_to_jpg('./phase1_and_3')

# %%
