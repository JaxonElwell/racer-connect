import React from 'react';

function SkeletonEventCard() {
  return (
    <div className="bg-gray-100 rounded-lg p-4 flex items-center animate-pulse">
      {/* Skeleton Image */}
      <div className="bg-gray-300 rounded-lg w-20 h-20 mr-4"></div>

      {/* Skeleton Text */}
      <div className="flex-1">
        <div className="bg-gray-300 h-6 w-3/4 mb-2 rounded"></div>
        <div className="bg-gray-300 h-4 w-1/2 mb-2 rounded"></div>
        <div className="bg-gray-300 h-4 w-1/3 mb-2 rounded"></div>
      </div>
    </div>
  );
}

export default SkeletonEventCard;