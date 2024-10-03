# %%

import fitz  # PyMuPDF

# Open the provided PDF file
pdf_path = 'Shopping task outline 4.pdf'
pdf_document = fitz.open(pdf_path)

# Function to parse the text blocks
def parse_text_blocks(blocks):
    text_content = []
    for block in blocks:
        if block['type'] == 0:  # Block contains text
            for line in block['lines']:
                for span in line['spans']:
                    text_content.append({
                        'text': span['text'],
                        'font': span['font'],
                        'color': span['color'],
                        'size': span['size'],
                    })
    return text_content

# Extract text and font information from each page
extracted_info = {}
for page_num in range(len(pdf_document)):
    page = pdf_document[page_num]
    blocks = page.get_text("dict")["blocks"]
    extracted_info[f'Page_{page_num + 1}'] = parse_text_blocks(blocks)

pdf_document.close()

# Example usage: Print the extracted text and font information
for page, content in extracted_info.items():
    print(f"Text from {page}:")
    for text_block in content:
        print(f"Text: {text_block['text']}, Font: {text_block['font']}, Color: {text_block['color']}, Size: {text_block['size']}")



# %%
