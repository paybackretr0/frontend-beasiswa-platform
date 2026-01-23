import React from "react";

const SkeletonTable = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div
          className="grid gap-4 animate-pulse"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {[...Array(columns)].map((_, idx) => (
            <div key={idx} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, rowIdx) => (
          <div key={rowIdx} className="p-4">
            <div
              className="grid gap-4 animate-pulse"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {[...Array(columns)].map((_, colIdx) => (
                <div key={colIdx} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-8 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonTable;
