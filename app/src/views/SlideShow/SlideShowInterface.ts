
// Define the structure of the slide and options based on the JSON
export interface SlideOption {
    id: string;
    label: string;
  }

export interface SlideData {
    id: number;
    type: string;
    imageUrl: string;
    text: string;
    options?: SlideOption[];
    variableName?: string;
    variableText?: string;
  }
  

export interface CheckboxOption {
label: string;
checked: boolean;
}