import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DataEntry from "./views/data-entry";
import ImageViewer from "./views/image-viewer";
import SlideShow from "./views/slide";

import Cover from "./assets/slides/cover.jpg";
import SlideP21 from "./assets/slides/duringPhase2/slide1.jpg";
import SlideP22 from "./assets/slides/duringPhase2/slide2.jpg";
import SlideP222 from "./assets/slides/duringPhase2/slide22.jpg";
import SlideP23 from "./assets/slides/duringPhase2/slide3.jpg";
import SlideP24 from "./assets/slides/duringPhase2/slide4.jpg";
import SlideP25 from "./assets/slides/duringPhase2/slide5.jpg";
import SlideP26 from "./assets/slides/duringPhase2/slide6.jpg";
import SlideB1 from "./assets/slides/duringPhase2/slideb1.jpg";
import SlideB2 from "./assets/slides/duringPhase2/slideb2.jpg";
import SlideB3 from "./assets/slides/duringPhase2/slideb3.jpg";
import SlideB4 from "./assets/slides/duringPhase2/slideb4.jpg";
import Slide1 from "./assets/slides/phase1/slide1.jpg";
import Slide2 from "./assets/slides/phase1/slide2.jpg";
import Slide5 from "./assets/slides/phase1/slide5.jpg";
import Slide6 from "./assets/slides/phase1/slide6.jpg";
import Slide7_10 from "./assets/slides/phase1/slide7_10.jpg";
import Slide7_15 from "./assets/slides/phase1/slide7_15.jpg";
import Slide8 from "./assets/slides/phase1/slide8.jpg";
import Slide9_10 from "./assets/slides/phase1/slide9_10.jpg";
import Slide9_15 from "./assets/slides/phase1/slide9_15.jpg";
import Slide12 from "./assets/slides/phase2/slide12.jpg";
import Slide13 from "./assets/slides/phase2/slide13.jpg";
import Slide14 from "./assets/slides/phase2/slide14.jpg";
import Slide16 from "./assets/slides/phase2/slide16.jpg";
import Slide17 from "./assets/slides/phase2/slide17.jpg";
import Slide18 from "./assets/slides/phase2/slide18.jpg";
import Slide19 from "./assets/slides/phase2/slide19.jpg";
import Slide20_1 from "./assets/slides/phase2/slide20_1.jpg";
import Slide20_2 from "./assets/slides/phase2/slide20_2.jpg";
import Slide21 from "./assets/slides/phase2/slide21.jpg";
import Slide25 from "./assets/slides/phase3/slide25.jpg";
import Slide26 from "./assets/slides/phase3/slide26.jpg";
import Slide27 from "./assets/slides/phase3/slide27.jpg";
import Slide28 from "./assets/slides/phase3/slide28.jpg";
import Slide29 from "./assets/slides/phase3/slide29.jpg";
import Slide30 from "./assets/slides/phase3/slide30.jpg";
import SlideS10 from "./assets/slides/shop/slide10.jpg";
import SlideS11 from "./assets/slides/shop/slide11.jpg";
import VasSlide from "./assets/slides/vasslide.jpg";
import White from "./assets/slides/white.jpg";
import { preloadImage } from "./util/functions";

// mapping dict that mapps all file paths starting after slides/ to the imported slide
const slideMapping: Record<string, string> = {
  "duringPhase2/slideb1.jpg": SlideB1,
  "duringPhase2/slideb2.jpg": SlideB2,
  "duringPhase2/slideb3.jpg": SlideB3,
  "duringPhase2/slideb4.jpg": SlideB4,
  "duringPhase2/slide1.jpg": SlideP21,
  "duringPhase2/slide2.jpg": SlideP22,
  "duringPhase2/slide3.jpg": SlideP23,
  "duringPhase2/slide4.jpg": SlideP24,
  "duringPhase2/slide5.jpg": SlideP25,
  "duringPhase2/slide6.jpg": SlideP26,
  "duringPhase2/slide22.jpg": SlideP222,
  "phase1/slide1.jpg": Slide1,
  "phase1/slide2.jpg": Slide2,
  "phase1/slide5.jpg": Slide5,
  "phase1/slide6.jpg": Slide6,
  "phase1/slide7_10.jpg": Slide7_10,
  "phase1/slide7_15.jpg": Slide7_15,
  "phase1/slide8.jpg": Slide8,
  "phase1/slide9_10.jpg": Slide9_10,
  "phase1/slide9_15.jpg": Slide9_15,
  "shop/slide10.jpg": SlideS10,
  "shop/slide11.jpg": SlideS11,
  "phase2/slide12.jpg": Slide12,
  "phase2/slide13.jpg": Slide13,
  "phase2/slide14.jpg": Slide14,
  "phase2/slide16.jpg": Slide16,
  "phase2/slide17.jpg": Slide17,
  "phase2/slide18.jpg": Slide18,
  "phase2/slide19.jpg": Slide19,
  "phase2/slide20_1.jpg": Slide20_1,
  "phase2/slide20_2.jpg": Slide20_2,
  "phase2/slide21.jpg": Slide21,
  "phase3/slide25.jpg": Slide25,
  "phase3/slide26.jpg": Slide26,
  "phase3/slide27.jpg": Slide27,
  "phase3/slide28.jpg": Slide28,
  "phase3/slide29.jpg": Slide29,
  "phase3/slide30.jpg": Slide30,
  "white.jpg": White,
  "cover.jpg": Cover,
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
