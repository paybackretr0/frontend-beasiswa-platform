import React from "react";

const Card = ({ image, title, subtitle, description, children }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition p-0 flex flex-col overflow-hidden">
    {image && (
      <img src={image} alt={title} className="w-full h-40 object-cover" />
    )}
    <div className="p-6 flex flex-col flex-1">
      {subtitle && (
        <span className="text-xs text-gray-400 mb-2">{subtitle}</span>
      )}
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-[#2D60FF]">{title}</h3>
      )}
      {description && <p className="text-gray-600 flex-1">{description}</p>}
      {children}
    </div>
  </div>
);

export default Card;
