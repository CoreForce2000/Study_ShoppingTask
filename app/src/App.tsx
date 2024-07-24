import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { task } from "./assets/configs/task.json";
import { SLIDE_PATH } from "./util/constants";
import { preloadImage } from "./util/functions";
import DataEntry from "./views/data-entry";
import ImageViewer from "./views/image-viewer";
import SlideShow from "./views/slide";

// import SlideB1 from "./assets/slides/duringPhase2/SlideB1.jpg";
// import SlideB2 from "./assets/slides/duringPhase2/SlideB2.jpg";
// import SlideB3 from "./assets/slides/duringPhase2/SlideB3.jpg";
// import Slide1 from "./assets/slides/phase1/Slide1.jpg";
// import Slide2 from "./assets/slides/phase1/Slide2.jpg";
// import Slide5 from "./assets/slides/phase1/Slide5.jpg";
// import Slide6 from "./assets/slides/phase1/Slide6.jpg";
// import Slide7 from "./assets/slides/phase1/Slide7_{time}.jpg";
// import Slide8 from "./assets/slides/phase1/Slide8.jpg";
// import Slide9 from "./assets/slides/phase1/Slide9_{time}.jpg";
// import Slide12 from "./assets/slides/phase2/Slide12.jpg";
// import Slide13 from "./assets/slides/phase2/Slide13.jpg";
// import Slide14 from "./assets/slides/phase2/Slide14.jpg";
// import Slide16 from "./assets/slides/phase2/Slide16.jpg";
// import Slide17 from "./assets/slides/phase2/Slide17.jpg";
// import Slide18 from "./assets/slides/phase2/Slide18.jpg";
// import Slide19 from "./assets/slides/phase2/Slide19.jpg";
// import Slide20 from "./assets/slides/phase2/Slide20.jpg";
// import Slide21 from "./assets/slides/phase2/Slide21.jpg";
// import Slide25 from "./assets/slides/phase3/Slide25.jpg";
// import Slide26 from "./assets/slides/phase3/Slide26.jpg";
// import Slide27 from "./assets/slides/phase3/Slide27.jpg";
// import Slide29 from "./assets/slides/phase3/Slide29.jpg";
// import Slide30 from "./assets/slides/phase3/Slide30.jpg";

// const taskSlides = [
//   {
//     slidePath: Slide1,
//     type: "checkboxShopping",
//     setPhase: "Shopping",
//     setPhaseNumber: 1,
//     setBlock: "shopping",
//     setBlockNumber: 1,
//   },
//   { showIf: "group!=Control", slidePath: Slide2, type: "checkboxDrugs" },
//   { type: "drugCravingPre" },
//   { slidePath: Slide5, keyPress: "any" },
//   { slidePath: Slide6 },
//   { slidePath: Slide7 },
//   { slidePath: Slide8 },
//   { slidePath: Slide9 },
//   { type: "onlineShop" },
//   { slidePath: Slide12, delay: 3000 },
//   { type: "exportData", variableName: "_phase1" },
//   { showIf: "time!=15", slidePath: Slide30, keyPress: "c" },
//   {
//     slidePath: Slide13,
//     type: "VAS",
//     variableName: "VAS_shopping_satisfaction",
//     minLabel: "Not at all satisfied",
//     maxLabel: "Very satisfied",
//   },
//   {
//     slidePath: Slide14,
//     type: "VAS",
//     variableName: "VAS_shopping_continuation",
//     minLabel: "Not at all",
//     maxLabel: "Very much",
//   },
//   { type: "drugCravingPost" },
//   { slidePath: Slide16 },
//   { slidePath: Slide17 },
//   { slidePath: Slide18 },
//   { slidePath: Slide19 },
//   { slidePath: Slide20 },
//   { slidePath: Slide21, setPhase: "CoDe", setPhaseNumber: 2 },
//   {
//     type: "contingency",
//     setBlock: "p(0|-A)=0",
//     setBlockNumber: 1,
//     probabilityGetItemNoPress: 0,
//   },
//   {
//     slidePath: SlideB1,
//     type: "VAS",
//     variableName: "CoDe_VAS1",
//     minLabel: "Not at all",
//     maxLabel: "Very much",
//   },
//   {
//     slidePath: SlideB2,
//     type: "checkboxBulb",
//     variableName: "Association_Color_other",
//   },
//   {
//     slidePath: SlideB3,
//     type: "checkboxBulb",
//     variableName: "Association_Color_own",
//   },
//   {
//     type: "contingency",
//     setBlock: "p(0|-A)=0",
//     setBlockNumber: 2,
//     probabilityGetItemNoPress: 0,
//   },
//   {
//     slidePath: SlideB1,
//     type: "VAS",
//     variableName: "CoDe_VAS2",
//     minLabel: "Not at all",
//     maxLabel: "Very much",
//   },
//   {
//     slidePath: SlideB2,
//     type: "checkboxBulb",
//     variableName: "Association_Color_other",
//   },
//   {
//     slidePath: SlideB3,
//     type: "checkboxBulb",
//     variableName: "Association_Color_own",
//   },
//   {
//     type: "contingency",
//     setBlock: "p(0|-A)=0",
//     setBlockNumber: 3,
//     probabilityGetItemNoPress: 0,
//   },
//   {
//     slidePath: SlideB1,
//     type: "VAS",
//     variableName: "CoDe_VAS3",
//     minLabel: "Not at all",
//     maxLabel: "Very much",
//   },
//   {
//     slidePath: SlideB2,
//     type: "checkboxBulb",
//     variableName: "Association_Color_other",
//   },
//   {
//     slidePath: SlideB3,
//     type: "checkboxBulb",
//     variableName: "Association_Color_own",
//   },
//   {
//     type: "contingency",
//     setBlock: "p(0|-A)=0.3",
//     setBlockNumber: 4,
//     probabilityGetItemNoPress: 0.3,
//   },
//   {
//     slidePath: SlideB1,
//     type: "VAS",
//     variableName: "CoDe_VAS4",
//     minLabel: "Not at all",
//     maxLabel: "Very much",
//   },
//   {
//     slidePath: SlideB2,
//     type: "checkboxBulb",
//     variableName: "Association_Color_other",
//   },
//   {
//     slidePath: SlideB3,
//     type: "checkboxBulb",
//     variableName: "Association_Color_own",
//   },
//   {
//     type: "contingency",
//     setBlock: "p(0|-A)=0.6",
//     setBlockNumber: 5,
//     probabilityGetItemNoPress: 0.6,
//   },
//   {
//     slidePath: SlideB1,
//     type: "VAS",
//     variableName: "CoDe_VAS5",
//     minLabel: "Not at all",
//     maxLabel: "Very much",
//   },
//   {
//     slidePath: SlideB2,
//     type: "checkboxBulb",
//     variableName: "Association_Color_other",
//   },
//   {
//     slidePath: SlideB3,
//     type: "checkboxBulb",
//     variableName: "Association_Color_own",
//   },
//   {
//     type: "contingency",
//     setBlock: "p(0|-A)=0",
//     setBlockNumber: 6,
//     probabilityGetItemNoPress: 0,
//   },
//   {
//     slidePath: SlideB1,
//     type: "VAS",
//     variableName: "CoDe_VAS6",
//     minLabel: "Not at all",
//     maxLabel: "Very much",
//   },
//   {
//     slidePath: SlideB2,
//     type: "checkboxBulb",
//     variableName: "Association_Color_other",
//   },
//   {
//     slidePath: SlideB3,
//     type: "checkboxBulb",
//     variableName: "Association_Color_own",
//   },
//   {
//     type: "contingency",
//     setBlock: "p(0|-A)=0.3",
//     setBlockNumber: 7,
//     probabilityGetItemNoPress: 0.3,
//   },
//   {
//     slidePath: SlideB1,
//     type: "VAS",
//     variableName: "CoDe_VAS7",
//     minLabel: "Not at all",
//     maxLabel: "Very much",
//   },
//   {
//     slidePath: SlideB2,
//     type: "checkboxBulb",
//     variableName: "Association_Color_other",
//   },
//   {
//     slidePath: SlideB3,
//     type: "checkboxBulb",
//     variableName: "Association_Color_own",
//   },
//   {
//     type: "contingency",
//     setBlock: "p(0|-A)=0.6",
//     setBlockNumber: 8,
//     probabilityGetItemNoPress: 0.6,
//   },
//   {
//     slidePath: SlideB1,
//     type: "VAS",
//     variableName: "CoDe_VAS8",
//     minLabel: "Not at all",
//     maxLabel: "Very much",
//   },
//   {
//     slidePath: SlideB2,
//     type: "checkboxBulb",
//     variableName: "Association_Color_other",
//   },
//   {
//     slidePath: SlideB3,
//     type: "checkboxBulb",
//     variableName: "Association_Color_own",
//   },
//   { slidePath: Slide25 },
//   {
//     slidePath: Slide26,
//     type: "VAS",
//     variableName: "VAS_claim_satisfaction",
//     minLabel: "Not at all satisfied",
//     maxLabel: "Very satisfied",
//   },
//   { type: "exportData", variableName: "_phase2" },
//   { slidePath: Slide27 },
//   { type: "quiz" },
//   { type: "onlineShopControl" },
//   { type: "exportData", variableName: "_final" },
//   { slidePath: Slide29 },
//   { slidePath: Slide30 },
// ];

const App: React.FC = () => {
  task.forEach((slide) => {
    if (slide.slidePath) {
      preloadImage(SLIDE_PATH + slide.slidePath);
    }
  });

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/slide/:slideNumberRaw/:trialNumberRaw?"
            element={<SlideShow />}
          />
          <Route path="/" element={<DataEntry />} />
          <Route path="/images" element={<ImageViewer />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
