import { IMAGE_BASE_PATH } from "./constants.ts";

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

// await Promise.all(
//   slideImagePaths.map((path) => preloadImage(SLIDE_PATH + path))
// );
