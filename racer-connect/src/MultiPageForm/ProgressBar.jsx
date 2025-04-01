import React from 'react';

function ProgressBar({ currentStep }) {
  return (
    <div className="progress-bar flex justify-between mb-4">
      <div className={`step ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'} flex-1 h-2 rounded-l`}></div>
      <div className={`step ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'} flex-1 h-2`}></div>
      <div className={`step ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'} flex-1 h-2 rounded-r`}></div>
    </div>
  );
}

export default ProgressBar;