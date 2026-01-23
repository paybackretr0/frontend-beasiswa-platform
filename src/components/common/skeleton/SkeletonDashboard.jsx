import React from "react";
import SkeletonCard from "./SkeletonCard";
import SkeletonChart from "./SkeletonChart";

const SkeletonDashboard = ({ type = "NON-APBN", cardCount = 4 }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      <div
        className={`grid ${type === "NON-APBN" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"} gap-6`}
      >
        {[...Array(cardCount)].map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonChart
          type="horizontal-bar"
          title="Loading..."
          description="Memuat data..."
        />
        <SkeletonChart
          type="horizontal-bar"
          title="Loading..."
          description="Memuat data..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonChart
          type="line"
          title="Loading..."
          description="Memuat data..."
        />
        <SkeletonChart
          type="pie"
          title="Loading..."
          description="Memuat data..."
        />
      </div>

      {type === "NON-APBN" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="animate-pulse space-y-3 py-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="animate-pulse space-y-3 py-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkeletonDashboard;
