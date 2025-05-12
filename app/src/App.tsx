import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { exportCsv, preloadImage } from "./util/functions";
import DataEntry from "./views/data-entry";
import ImageViewer from "./views/image-viewer";
import SlideShow from "./views/slide";

import End_slide1 from "./assets/slides/end/slide1.jpg";
import End_slide2 from "./assets/slides/end/slide2.jpg";
import Instructionsphase1_slide1 from "./assets/slides/instructionsPhase1/slide1.jpg";
import Instructionsphase1_slide2 from "./assets/slides/instructionsPhase1/slide2.jpg";
import Instructionsphase1_slide3 from "./assets/slides/instructionsPhase1/slide3.jpg";
import Instructionsphase1_slide4 from "./assets/slides/instructionsPhase1/slide4.jpg";
import Instructionsphase1_slide5 from "./assets/slides/instructionsPhase1/slide5.jpg";
import Instructionsphase1_slide6 from "./assets/slides/instructionsPhase1/slide6.jpg";
import Instructionsphase1_slide7 from "./assets/slides/instructionsPhase1/slide7.jpg";
import Instructionsphase2_slide1 from "./assets/slides/instructionsPhase2/slide1.jpg";
import Instructionsphase2_slide10 from "./assets/slides/instructionsPhase2/slide10.jpg";
import Instructionsphase2_slide11 from "./assets/slides/instructionsPhase2/slide11.jpg";
import Instructionsphase2_slide12 from "./assets/slides/instructionsPhase2/slide12.jpg";
import Instructionsphase2_slide13 from "./assets/slides/instructionsPhase2/slide13.jpg";
import Instructionsphase2_slide14 from "./assets/slides/instructionsPhase2/slide14.jpg";
import Instructionsphase2_slide15 from "./assets/slides/instructionsPhase2/slide15.jpg";
import Instructionsphase2_slide16 from "./assets/slides/instructionsPhase2/slide16.jpg";
import Instructionsphase2_slide17 from "./assets/slides/instructionsPhase2/slide17.jpg";
import Instructionsphase2_slide2_craving from "./assets/slides/instructionsPhase2/slide2_craving.jpg";
import Instructionsphase2_slide2_nocraving from "./assets/slides/instructionsPhase2/slide2_nocraving.jpg";
import Instructionsphase2_slide3 from "./assets/slides/instructionsPhase2/slide3.jpg";
import Instructionsphase2_slide4 from "./assets/slides/instructionsPhase2/slide4.jpg";
import Instructionsphase2_slide5 from "./assets/slides/instructionsPhase2/slide5.jpg";
import Instructionsphase2_slide6 from "./assets/slides/instructionsPhase2/slide6.jpg";
import Instructionsphase2_slide7 from "./assets/slides/instructionsPhase2/slide7.jpg";
import Instructionsphase2_slide8 from "./assets/slides/instructionsPhase2/slide8.jpg";
import Instructionsphase2_slide9 from "./assets/slides/instructionsPhase2/slide9.jpg";
import Instructionsphase3_slide1 from "./assets/slides/instructionsPhase3/slide1.jpg";
import Instructionsphase3_slide2 from "./assets/slides/instructionsPhase3/slide2.jpg";
import Instructionsphase3_slide3 from "./assets/slides/instructionsPhase3/slide3.jpg";
import Instructionsphase3_slide4 from "./assets/slides/instructionsPhase3/slide4.jpg";
import Phase1_and_3_slide1 from "./assets/slides/phase1_and_3/slide1.jpg";
import Phase1_and_3_slide2 from "./assets/slides/phase1_and_3/slide2.jpg";
import Phase2_slide1 from "./assets/slides/phase2/slide1.jpg";
import Phase2_slide2 from "./assets/slides/phase2/slide2.jpg";
import Phase2_slide3 from "./assets/slides/phase2/slide3.jpg";
import Phase2_slide4 from "./assets/slides/phase2/slide4.jpg";
import Phase2_slide5 from "./assets/slides/phase2/slide5.jpg";
import Phase2_slide6 from "./assets/slides/phase2/slide6.jpg";
import Phase2_slide7 from "./assets/slides/phase2/slide7.jpg";
import Phase2_slide8 from "./assets/slides/phase2/slide8.jpg";
import Phase2_trial_slide1 from "./assets/slides/phase2/trial/slide1.jpg";
import Phase2_trial_slide2 from "./assets/slides/phase2/trial/slide2.jpg";
import Phase2_trial_slide3 from "./assets/slides/phase2/trial/slide3.jpg";
import Phase2_trial_slide4 from "./assets/slides/phase2/trial/slide4.jpg";
import Phase2_trial_slide5 from "./assets/slides/phase2/trial/slide5.jpg";
import Vasslide from "./assets/slides/vasslide.jpg";
import White from "./assets/slides/white.jpg";
import { taskStore } from "./store/store";

const slideMapping: Record<string, string> = {
  "vasslide.jpg": Vasslide,
  "white.jpg": White,
  "end/slide1.jpg": End_slide1,
  "end/slide2.jpg": End_slide2,
  "instructionsPhase1/slide1.jpg": Instructionsphase1_slide1,
  "instructionsPhase1/slide2.jpg": Instructionsphase1_slide2,
  "instructionsPhase1/slide3.jpg": Instructionsphase1_slide3,
  "instructionsPhase1/slide4.jpg": Instructionsphase1_slide4,
  "instructionsPhase1/slide5.jpg": Instructionsphase1_slide5,
  "instructionsPhase1/slide6.jpg": Instructionsphase1_slide6,
  "instructionsPhase1/slide7.jpg": Instructionsphase1_slide7,
  "instructionsPhase2/slide1.jpg": Instructionsphase2_slide1,
  "instructionsPhase2/slide10.jpg": Instructionsphase2_slide10,
  "instructionsPhase2/slide11.jpg": Instructionsphase2_slide11,
  "instructionsPhase2/slide12.jpg": Instructionsphase2_slide12,
  "instructionsPhase2/slide13.jpg": Instructionsphase2_slide13,
  "instructionsPhase2/slide14.jpg": Instructionsphase2_slide14,
  "instructionsPhase2/slide15.jpg": Instructionsphase2_slide15,
  "instructionsPhase2/slide16.jpg": Instructionsphase2_slide16,
  "instructionsPhase2/slide17.jpg": Instructionsphase2_slide17,
  "instructionsPhase2/slide2_craving.jpg": Instructionsphase2_slide2_craving,
  "instructionsPhase2/slide2_nocraving.jpg":
    Instructionsphase2_slide2_nocraving,
  "instructionsPhase2/slide3.jpg": Instructionsphase2_slide3,
  "instructionsPhase2/slide4.jpg": Instructionsphase2_slide4,
  "instructionsPhase2/slide5.jpg": Instructionsphase2_slide5,
  "instructionsPhase2/slide6.jpg": Instructionsphase2_slide6,
  "instructionsPhase2/slide7.jpg": Instructionsphase2_slide7,
  "instructionsPhase2/slide8.jpg": Instructionsphase2_slide8,
  "instructionsPhase2/slide9.jpg": Instructionsphase2_slide9,
  "instructionsPhase3/slide1.jpg": Instructionsphase3_slide1,
  "instructionsPhase3/slide2.jpg": Instructionsphase3_slide2,
  "instructionsPhase3/slide3.jpg": Instructionsphase3_slide3,
  "instructionsPhase3/slide4.jpg": Instructionsphase3_slide4,
  "phase1_and_3/slide1.jpg": Phase1_and_3_slide1,
  "phase1_and_3/slide2.jpg": Phase1_and_3_slide2,
  "phase2/slide1.jpg": Phase2_slide1,
  "phase2/slide2.jpg": Phase2_slide2,
  "phase2/slide3.jpg": Phase2_slide3,
  "phase2/slide4.jpg": Phase2_slide4,
  "phase2/slide5.jpg": Phase2_slide5,
  "phase2/slide6.jpg": Phase2_slide6,
  "phase2/slide7.jpg": Phase2_slide7,
  "phase2/slide8.jpg": Phase2_slide8,
  "phase2/trial/slide1.jpg": Phase2_trial_slide1,
  "phase2/trial/slide2.jpg": Phase2_trial_slide2,
  "phase2/trial/slide3.jpg": Phase2_trial_slide3,
  "phase2/trial/slide4.jpg": Phase2_trial_slide4,
  "phase2/trial/slide5.jpg": Phase2_trial_slide5,
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

  useEffect(() => {
    let hasExported = false;

    const handleGlobalError = () => {
      if (hasExported) return;
      hasExported = true;
      console.log("Global error handler triggered. Exporting CSV...");
      // Attempt to export CSV here
      try {
        const state = taskStore.getState();
        if (typeof state.getCsvString === "function") {
          exportCsv(state, "_CRASHED");
        }
      } catch (e) {
        console.error("Failed to auto-export on global error:", e);
      }
    };

    window.onerror = handleGlobalError;
    window.onunhandledrejection = handleGlobalError;

    return () => {
      window.onerror = null;
      window.onunhandledrejection = null;
    };
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
