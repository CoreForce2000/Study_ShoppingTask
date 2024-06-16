import { SLIDE_PATH } from "./constants.ts";

export const preloadImage = (path: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = path;
  });
};

export const getImagePath = (category: string, imageName: string) => {
  return `assets/categories/${category}/${imageName}`;
};

export const preloadSlides = () => {
  const slideImagePaths = [
    `phase1/Slide1.JPG`,
    `phase1/Slide2.JPG`,
    `phase1/Slide6.JPG`,
    `phase1/Slide7.JPG`,
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
    `phase2/Slide18.JPG`,
    `phase2/Slide19.JPG`,
    `phase2/Slide20.JPG`,
    `phase2/Slide21.JPG`,
  ];

  // Preload all images
  slideImagePaths.forEach((path) => {
    preloadImage(SLIDE_PATH + path);
  });
};
