import React from 'react';

const ProgressBar = ({ currentStep, completedSteps, canNavigateToStep, handleStepChange }) => {
  return (
    <div className="flex justify-between mb-8 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-600 -translate-y-1/2 z-0"></div>
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          onClick={() => handleStepChange(step)}
          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
            ${
              step === currentStep
                ? "bg-blue-500 border-2 border-blue-300"
                : completedSteps[step]
                ? "bg-green-500 cursor-pointer hover:opacity-80"
                : canNavigateToStep(step)
                ? "bg-gray-600 cursor-pointer hover:bg-gray-500"
                : "bg-gray-600 opacity-50 cursor-not-allowed"
            }`}
        >
          {completedSteps[step] ? "✓" : step}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar; 