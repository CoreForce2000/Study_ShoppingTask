import classNames from "classnames";
import { LucideIcon, LucideProps } from "lucide-react"; // Assuming you're using Lucide React
import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "transparent";
  style?: React.CSSProperties;
  className?: string;
  icon?: LucideIcon;
  iconProps?: LucideProps;
  prefixText?: string;
  suffixText?: string;
  color?: string;
  visible?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  variant = "secondary",
  style = {},
  className = "",
  icon: Icon,
  iconProps = {},
  prefixText,
  suffixText,
  color,
  visible = true,
}) => {
  const buttonClass = classNames(
    "border-none text-center text-decoration-none  inline-flex flex justify-center items-center m-1 cursor-pointer rounded-lg py-1.5 px-3 transition duration-250 ease-in-out",
    {
      "bg-gray-600 text-white": variant === "secondary",
      "bg-green-500 text-white": variant === "primary",
      "bg-transparent": variant === "transparent",
    },
    className
  );

  const combinedStyle: React.CSSProperties = {
    color,
    visibility: visible ? "visible" : "hidden",
    ...style,
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={buttonClass}
      style={combinedStyle}
    >
      {prefixText && <span className="mr-2">{prefixText}</span>}
      {Icon && <Icon className="mr-2" {...iconProps} />}
      {children}
      {suffixText && <span className="ml-2">{suffixText}</span>}
    </button>
  );
};

export default Button;
