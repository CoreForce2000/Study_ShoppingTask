import os

# Define the directory you want to search in
directory = './'

# Initialize the variables
imports = []
mapping = []

# Function to convert file path into a unique slide name
def create_slide_name(file_path, base_dir):
    # Get relative path without the base directory
    relative_path = os.path.relpath(file_path, base_dir)
    # Replace directory separators with underscores and remove file extension
    slide_name = relative_path.replace("\\", "/").replace("/", "_").replace(".jpg", "")
    # Capitalize the first letter and return it
    return slide_name.capitalize()

# Check if the directory exists
if not os.path.exists(directory):
    print(f"Directory {directory} does not exist!")
else:
    # Walk through all subdirectories and files
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.jpg'):
                # Get the full path to the file
                full_path = os.path.join(root, file)
                
                # Create a unique slide name including the path
                slide_name = create_slide_name(full_path, directory)

                # Get relative path for the import and mapping
                relative_path = os.path.relpath(full_path, directory)
                
                # Clean relative path for mapping
                clean_path = relative_path.replace("\\", "/")
                
                # Add the imports and mappings
                imports.append(f'import {slide_name} from "./{clean_path}";')
                mapping.append(f'"{clean_path}": {slide_name},')

    # Print the results
    if imports:
        print("Imports:\n")
        print("\n".join(imports))

        print("\n\nSlide Mapping:\n")
        print('const slideMapping: Record<string, string> = {')
        print("\n".join(mapping))
        print("};")
    else:
        print(f"No .jpg files found in {directory}")
