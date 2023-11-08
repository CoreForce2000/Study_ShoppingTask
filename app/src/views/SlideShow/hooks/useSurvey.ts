// useSurvey.js
import { useState, useCallback } from 'react';

function useSurvey(initialResponses) {
  const [surveyResponses, setSurveyResponses] = useState(initialResponses);

  const updateSurveyResponse = useCallback((key, value) => {
    setSurveyResponses(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);
  
  const generateVASSlides = useCallback((selectedDrugs, updateFunction) => {
    // Assume `generateSlide` is a function that creates a slide JSX
    // `updateFunction` is a callback to update the dosage for a drug

    return selectedDrugs.map(drug => generateSlide(drug, updateFunction));
  }, []);
  

  // Logic to generate VAS slides based on selected drugs
  const generateVASSlides = useCallback((selectedDrugs) => {
    // Assume generateSlide is a function that creates a slide JSX
    return selectedDrugs.map(drug => generateSlide(drug, updateSurveyResponse));
  }, [updateSurveyResponse]);

  // Other survey-related logic...

  

  return {
    surveyResponses,
    updateSurveyResponse,
    generateVASSlides,
  };
}

export default useSurvey;
