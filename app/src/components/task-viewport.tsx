import React, { useEffect, useState } from "react";
import { SLIDE_PATH } from "../util/path";

interface TaskViewportProps {
  backgroundImage?: string;
  children?: React.ReactNode;
  verticalAlign?: boolean;
  backgroundColor?: string;
}

const TaskViewport: React.FC<TaskViewportProps> = ({
  backgroundImage,
  children,
  backgroundColor = "black",
}) => {
  const aspectRatio = 3 / 4; // Height / Width
  const [slideStyle, setSlideStyle] = useState<React.CSSProperties>({});

  const updateDimensions = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowHeight / windowWidth;
    let newWidth, newHeight;

    if (windowRatio >= aspectRatio) {
      newWidth = windowWidth;
      newHeight = windowWidth * aspectRatio;
    } else {
      newHeight = windowHeight;
      newWidth = windowHeight / aspectRatio;
    }

    const fontSize = newWidth * 0.05; // Example: 5% of the width

    const backgroundStyle = {
      backgroundImage: `url(${
        backgroundImage ? backgroundImage : SLIDE_PATH + "White.png"
      })`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
    };

    setSlideStyle({
      width: `${newWidth}px`,
      height: `${newHeight}px`,
      fontSize: `${fontSize}px`,
      ...backgroundStyle,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    updateDimensions(); // Also update dimensions on mount

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [backgroundImage]);

  return (
    <div
      className="w-screen h-screen box-border flex justify-center items-center"
      style={{ background: backgroundColor }}
    >
      <div
        style={slideStyle}
        className="box-border flex justify-center items-center overflow-hidden relative"
      >
        {children}
      </div>
    </div>
  );
};

export default TaskViewport;
