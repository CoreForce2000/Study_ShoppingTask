import React, { useState } from 'react';
import slidesData from './slides.json';
import styles from './SlideShow.module.css';
import { SlideData } from './SlideShowInterface';
import SlideViewPort from './components/Slide/Slide';
import { CheckboxOption } from './SlideShowInterface';
import Checkbox from './components/Checkbox/Checkbox';


// SlideShow component to manage the slideshow state
const SlideShow: React.FC = () => {
  const [slides] = useState<SlideData[]>(slidesData);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);


  const [options, setOptions] = useState<CheckboxOption[]>([
    { label: 'several times a day', checked: false },
    { label: 'once a day', checked: false },
    { label: 'a few times a week', checked: false },
    { label: 'once a week', checked: false },
    { label: 'once a month or less', checked: false },
    { label: 'very rarely / not at all', checked: false },
  ]);

  const currentSlide = slides[currentSlideIndex];

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => prevIndex + 1);
  };

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => prevIndex - 1);
  };
  

  // Render the current slide https://open.spotify.com/intl-de/track/4lEDVWeadQqpJElNbPMec1?si=cf56f88f9e634c3e
  return (
    <div className={styles.slideShow}>
      {currentSlide && (
        <SlideViewPort backgroundImage={'/src/assets/slides/phase1/Slide1.png'} >
          <div style={{width:"100%", padding:"7%", display:"flex", justifyContent:"left"}}>
            <div style={{backgroundColor:"white", width:"100%", marginTop:"20%"}}> 
              <Checkbox options={options} setOptions={setOptions}/>
            </div>
          </div>
        </SlideViewPort>
      )}
      <button onClick={goToPreviousSlide} disabled={currentSlideIndex === 0}>
        Previous
      </button>
      <button onClick={goToNextSlide} disabled={currentSlideIndex === slides.length - 1}>
        Next
      </button>
    </div>
  );
};

export default SlideShow;