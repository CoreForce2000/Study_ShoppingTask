import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DataEntry from "./views/data-entry";
import ImageViewer from "./views/image-viewer";
import SlideShow from "./views/slide";

import Slide29 from "./assets/slides/end/slide1.jpg";
import Slide30 from "./assets/slides/end/slide2.jpg";
import Slide1 from "./assets/slides/instructionsPhase1/slide1.jpg";
import Slide2 from "./assets/slides/instructionsPhase1/slide2.jpg";
import Slide3 from "./assets/slides/instructionsPhase1/slide3.jpg";
import Slide4 from "./assets/slides/instructionsPhase1/slide4.jpg";
import Slide5_1 from "./assets/slides/instructionsPhase1/slide5_10.jpg";
import Slide5_2 from "./assets/slides/instructionsPhase1/slide5_15.jpg";
import Slide6 from "./assets/slides/instructionsPhase1/slide6.jpg";
import Slide7_1 from "./assets/slides/instructionsPhase1/slide7_10.jpg";
import Slide7_2 from "./assets/slides/instructionsPhase1/slide7_15.jpg";
import Slide9 from "./assets/slides/instructionsPhase2/slide1.jpg";
import Slide18 from "./assets/slides/instructionsPhase2/slide10.jpg";
import Slide19 from "./assets/slides/instructionsPhase2/slide11.jpg";
import Slide20 from "./assets/slides/instructionsPhase2/slide12.jpg";
import Slide21 from "./assets/slides/instructionsPhase2/slide13.jpg";
import Slide10 from "./assets/slides/instructionsPhase2/slide2.jpg";
import Slide11 from "./assets/slides/instructionsPhase2/slide3.jpg";
import Slide12 from "./assets/slides/instructionsPhase2/slide4.jpg";
import Slide13 from "./assets/slides/instructionsPhase2/slide5.jpg";
import Slide14 from "./assets/slides/instructionsPhase2/slide6.jpg";
import Slide15 from "./assets/slides/instructionsPhase2/slide7.jpg";
import Slide16 from "./assets/slides/instructionsPhase2/slide8.jpg";
import Slide17 from "./assets/slides/instructionsPhase2/slide9.jpg";
import Slide26 from "./assets/slides/instructionsPhase3/slide1.jpg";
import Slide27 from "./assets/slides/instructionsPhase3/slide2.jpg";
import Slide28 from "./assets/slides/instructionsPhase3/slide3.jpg";
import Slide22 from "./assets/slides/phase2/slide1.jpg";
import Slide23 from "./assets/slides/phase2/slide2.jpg";
import Slide24 from "./assets/slides/phase2/slide3.jpg";
import Slide25 from "./assets/slides/phase2/slide4.jpg";

import VasSlide from "./assets/slides/vasslide.jpg";
import White from "./assets/slides/white.jpg";
import { preloadImage } from "./util/functions";

// mapping dict that mapps all file paths starting after slides/ to the imported slide
const slideMapping: Record<string, string> = {
  "instructionsPhase1/slide1.jpg": Slide1,
  "instructionsPhase1/slide2.jpg": Slide2,
  "instructionsPhase1/slide3.jpg": Slide3,
  "instructionsPhase1/slide4.jpg": Slide4,
  "instructionsPhase1/slide5_10.jpg": Slide5_1,
  "instructionsPhase1/slide5_15.jpg": Slide5_2,
  "instructionsPhase1/slide6.jpg": Slide6,
  "instructionsPhase1/slide7_10.jpg": Slide7_1,
  "instructionsPhase1/slide7_15.jpg": Slide7_2,
  "instructionsPhase2/slide1.jpg": Slide9,
  "instructionsPhase2/slide2.jpg": Slide10,
  "instructionsPhase2/slide3.jpg": Slide11,
  "instructionsPhase2/slide4.jpg": Slide12,
  "instructionsPhase2/slide5.jpg": Slide13,
  "instructionsPhase2/slide6.jpg": Slide14,
  "instructionsPhase2/slide7.jpg": Slide15,
  "instructionsPhase2/slide8.jpg": Slide16,
  "instructionsPhase2/slide9.jpg": Slide17,
  "instructionsPhase2/slide10.jpg": Slide18,
  "instructionsPhase2/slide11.jpg": Slide19,
  "instructionsPhase2/slide12.jpg": Slide20,
  "instructionsPhase2/slide13.jpg": Slide21,
  "phase2/slide1.jpg": Slide22,
  "phase2/slide2.jpg": Slide23,
  "phase2/slide3.jpg": Slide24,
  "phase2/slide4.jpg": Slide25,
  "instructionsPhase3/slide1.jpg": Slide26,
  "instructionsPhase3/slide2.jpg": Slide27,
  "instructionsPhase3/slide3.jpg": Slide28,
  "end/slide1.jpg": Slide29,
  "end/slide2.jpg": Slide30,
  "white.jpg": White,
  "vasslide.jpg": VasSlide,
};

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [preload, setPreload] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const images = [];
    for (const key in slideMapping) {
      images.push(preloadImage(slideMapping[key]));
    }
    Promise.all(images)
      .then((results) => {
        setPreload(results);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to preload images:", error);
        setIsLoaded(true); // even on error, we consider it loaded to stop the waiting state
      });
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/slide/:slideNumberRaw/:trialNumberRaw?"
            element={<SlideShow slideMapping={slideMapping} />}
          />
          <Route path="/" element={<DataEntry />} />
          <Route path="/images" element={<ImageViewer />} />
        </Routes>
      </Router>
      <div className="absolute top-0 left-0 scale-0">
        {isLoaded &&
          preload.map((img, index) => (
            <img key={index} src={img.src} alt={`Slide ${index + 1}`} />
          ))}
      </div>
    </div>
  );
};

export default App;
