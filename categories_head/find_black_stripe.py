import os
import cv2
import numpy as np
import shutil

# Function to check if an image has a dark stripe
def has_dark_stripe(image_path):
    # Load the image
    img = cv2.imread(image_path)
    
    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Define a threshold value (adjust as needed)
    threshold = 100
    
    # Apply a binary threshold to the image
    _, thresh = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)
    
    # Calculate the percentage of black pixels
    black_pixel_percentage = (np.sum(thresh == 0) / thresh.size) * 100
    
    # Adjust this threshold percentage as needed to detect dark stripes
    dark_stripe_threshold = 5
    
    # If the percentage of black pixels is above the threshold, it has a dark stripe
    return black_pixel_percentage > dark_stripe_threshold

# Input and output folders
input_folder = "categories"
output_folder = "categories/_CHECK"

# Create the output folder if it doesn't exist
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Iterate through all image files in the input folder and its subfolders
for root, dirs, files in os.walk(input_folder):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            image_path = os.path.join(root, file)
            
            if has_dark_stripe(image_path):
                # Copy the image to the output folder
                output_path = os.path.join(output_folder, file)
                shutil.copy(image_path, output_path)
                print(f"Image with dark stripe copied: {image_path} -> {output_path}")
