import { IMAGE_BASE_PATH, SLIDE_PATH } from "./constants.ts";

export const preloadImage = (path: string) => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = (error) => {
      console.error(`Failed to load image at ${path}:`, error);
      reject(error);
    };
    img.src = path;
  });
};

export const getImagePath = (category: string, imageName: string) => {
  return IMAGE_BASE_PATH + category + "/" + imageName;
};

export const preloadSlides = async () => {
  const slideImagePaths = [
    `phase1/Slide1.JPG`,
    `phase1/Slide2.JPG`,
    `phase1/Slide6.JPG`,
    `phase1/Slide7_10.JPG`,
    `phase1/Slide7_15.JPG`,
    `phase1/Slide8.JPG`,
    `phase1/Slide9_10.jpg`,
    `phase1/Slide9_15.jpg`,
    `phase1/Slide5.JPG`,
    `shop/Slide10.JPG`,
    `shop/Slide11.JPG`,
    `phase2/Slide12.JPG`,
    `phase2/Slide13.JPG`,
    `phase2/Slide14.JPG`,
    `phase2/Slide15.JPG`,
    `phase2/Slide16.JPG`,
    `phase2/Slide17.JPG`,
    `phase2/Slide18.jpg`,
    `phase2/Slide19.JPG`,
    `phase2/Slide20.JPG`,
    `phase2/Slide21.JPG`,
    `duringPhase2/Slide1.PNG`,
    `duringPhase2/Slide2.PNG`,
    `duringPhase2/Slide3.PNG`,
    `duringPhase2/Slide4.PNG`,
    `duringPhase2/Slide5.PNG`,
    `duringPhase2/Slide6.PNG`,
    `duringPhase2/Slide22.jpg`,
    `duringPhase2/SlideB1.PNG`,
    `duringPhase2/SlideB2.PNG`,
    `duringPhase2/SlideB3.PNG`,
  ];

  await Promise.all(
    slideImagePaths.map((path) => preloadImage(SLIDE_PATH + path))
  );
};
