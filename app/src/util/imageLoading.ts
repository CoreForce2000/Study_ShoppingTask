
export const preloadImage = (path:string) => {
    console.log("Preloading image: " + path)
    const img = new Image();
    img.src = path;
};

