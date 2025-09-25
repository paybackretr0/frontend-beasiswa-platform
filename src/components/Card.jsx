import React from "react";

const Card = ({
  image,
  title,
  subtitle,
  description,
  children,
  className = "",
}) => (
  <div
    className={`
      bg-white border border-[#DFEAF2] rounded-2xl transition p-0 flex flex-col overflow-hidden
      w-full max-w-full ${className}
    `}
  >
    {image && (
      <img src={image} alt={title} className="w-full h-40 object-cover" />
    )}
    <div className="p-6 flex flex-col flex-1">
      {subtitle && (
        <span className="text-xs text-gray-400 mb-2">{subtitle}</span>
      )}
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
      )}
      {description && (
        <p className="text-gray-600 flex-1 text-sm">{description}</p>
      )}
      {children}
    </div>
  </div>
);

export default Card;
