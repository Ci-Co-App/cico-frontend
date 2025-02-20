import React from 'react';

interface ButtonProps {
  type: "button" | "submit" | "reset";
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ type, text, onClick, disabled, className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-6 py-3 rounded-lg font-semibold shadow-md transition-all transform hover:scale-105 focus:ring-2 focus:ring-yellow-400 ${
        disabled 
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-orange-500 hover:to-yellow-400"
      } ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
