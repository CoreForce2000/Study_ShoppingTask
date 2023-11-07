import React, { useState } from 'react';
import styles from './SlideShow.module.css';
import Slide from './components/Slide/Slide';
import { CheckboxOption } from './SlideShowInterface';
import Checkbox from './components/Checkbox/Checkbox';
import VAS from './components/VAS/VAS';


// SlideShow component to manage the slideshow state
const SlideShow: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedVAS, setSelectedVAS] = useState<number | null>(null);

  const [options, setOptions] = useState<CheckboxOption[]>([
    { label: 'several times a day', checked: false },
    { label: 'once a day', checked: false },
    { label: 'a few times a week', checked: false },
    { label: 'once a week', checked: false },
    { label: 'once a month or less', checked: false },
    { label: 'very rarely / not at all', checked: false }
  ]);

  const slides = [
    <Slide backgroundImage={`/src/assets/slides/Phase1/Slide1.png`} >
          <div style={{width:"100%", padding:"7%", display:"flex", justifyContent:"left"}}>
            <div style={{backgroundColor:"white", width:"100%", marginTop:"20%"}}> 
              <Checkbox options={options} setOptions={setOptions}/>
            </div>
          </div>
    </Slide>,

    <Slide backgroundImage={`/src/assets/slides/Phase1/Slide2.png`} >
      <div style={{width:"100%", padding:"7%", display:"flex", justifyContent:"left"}}>
        <div style={{backgroundColor:"white", width:"100%", marginTop:"20%"}}>
          <VAS minLabel='Not at all' maxLabel='Very much' setValue={setSelectedVAS} />
        </div>
      </div>
    </Slide>
  ]

  const currentSlide = slides[currentSlideIndex];

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => prevIndex + 1);
  };

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) => prevIndex - 1);
  };
  

  // Render the current slide
  return (
    <div className={styles.slideShow}>
      {currentSlide && (
        currentSlide
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