// Import the useDispatch hook and the action creator from your Redux setup
import { useDispatch } from 'react-redux';
import { setVariable } from '../path/to/yourReduxActions'; // Adjust the import path to your actual action creator
import VAS from '../SlideShow/components/VAS/VAS';
import Checkbox from '../SlideShow/components/Checkbox/Checkbox';

// Extend the ElementConfig interface to include variableName
interface ElementConfig {
  type: 'VAS' | 'Checkbox';
  key: string;
  variableName: string; // This will be the key in the Redux store
  // Add other properties specific to each type
}

interface VASElementConfig extends ElementConfig {
  type: 'VAS';
  minLabel: string;
  maxLabel: string;
  // Removed 'drug' property since 'variableName' will be used instead
}

interface CheckboxElementConfig extends ElementConfig {
  type: 'Checkbox';
  options: string[];
  allowMultiple: boolean;
  columnLayout: 'single' | 'double'; // Add other possible values if needed
  fontSizeFactor: number;
}

// Define a type for the slide configuration
interface SlideConfig {
    backgroundImage: string;
    elements: Array<VASElementConfig | CheckboxElementConfig>;
    // Add other slide-related properties if needed
  }
  
  // Props for the SlideView component
  interface NiftySlideProps {
    slideData: SlideConfig;
    setDrugDosage: (drug: string, dosage: number) => void;
    setOnlineShoppingFrequency: (frequency: string) => void;
  }

const NiftySlide: React.FC<NiftySlideProps> = ({ slideData }) => {
  const dispatch = useDispatch();

  // Function to handle setting the value in the Redux store
  const handleSetValue = (variableName: string, value: any) => {
    dispatch(setVariable({ variableName, value }));
  };

  // Function to render the elements based on the slideData
  const renderElement = (element: VASElementConfig | CheckboxElementConfig) => {
    switch (element.type) {
      case 'VAS':
        const vasElement = element as VASElementConfig;
        return (
          <VAS
            key={vasElement.key}
            minLabel={vasElement.minLabel}
            maxLabel={vasElement.maxLabel}
            setValue={(value: number) => handleSetValue(vasElement.variableName, value)}
          />
        );
      case 'Checkbox':
        const checkboxElement = element as CheckboxElementConfig;
        return (
          <Checkbox
            key={checkboxElement.key}
            initialOptions={checkboxElement.options}
            allowMultiple={checkboxElement.allowMultiple}
            columnLayout={checkboxElement.columnLayout}
            onChange={(value: string | string[]) => handleSetValue(checkboxElement.variableName, value)}
            fontSizeFactor={checkboxElement.fontSizeFactor}
          />
        );
      // Add cases for other types of elements
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundImage: `url(${slideData.backgroundImage})` }}>
      {slideData.elements.map(renderElement)}
      {/* Here, you'd add your progression logic and other UI elements */}
    </div>
  );
};

export default NiftySlide;
