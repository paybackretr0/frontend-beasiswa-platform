import React from "react";

const Button = ({ children, onClick, className = "", ...props }) => (
  <button
    onClick={onClick}
    className={`
      bg-[#2D60FF] text-white rounded-md px-8 py-3 text-base font-semibold 
      shadow-md hover:bg-blue-700 transition-colors duration-200 hover:cursor-pointer
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

export default Button;
