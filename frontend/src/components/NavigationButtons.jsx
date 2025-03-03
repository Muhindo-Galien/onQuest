import React from 'react';

const NavigationButtons = ({ currentStep, canNavigateToStep, handleStepChange }) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => handleStepChange(currentStep - 1)}
        className={`p-2 rounded-full text-sm ${
          currentStep === 1
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={currentStep === 1}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => handleStepChange(currentStep + 1)}
        className={`p-2 rounded-full text-sm ${
          !canNavigateToStep(currentStep + 1)
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={!canNavigateToStep(currentStep + 1)}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default NavigationButtons; 