export const preloadImage = (path: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = path;
    });
  };

export const getImagePath = (category: string, imageName: string) => {
    return `assets/categories/${category}/${imageName}`
}