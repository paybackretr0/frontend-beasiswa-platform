import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  size = "md",
  variant = "primary",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const variantClasses = {
    primary: "bg-[#2D60FF] text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    sky: "bg-sky-600 text-white hover:bg-sky-700",
    violet: "bg-violet-600 text-white hover:bg-violet-700",
  };

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-1.5
        rounded-md font-medium
        shadow-sm transition-colors duration-200
        hover:cursor-pointer
        disabled:bg-gray-300 disabled:text-gray-500 
        disabled:hover:bg-gray-300 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
