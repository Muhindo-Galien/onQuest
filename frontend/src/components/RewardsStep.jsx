import React from 'react';

const RewardsStep = ({ completedSteps, completeStep }) => {
  return (
    <div className="min-w-full">
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Claim Rewards</h3>
        {completedSteps[2] ? (
          <button
            onClick={() => {
              completeStep(3);
              // Add any reward claiming logic here
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
          >
            Claim Rewards
          </button>
        ) : (
          <p className="text-sm text-gray-400">Complete verification first</p>
        )}
      </div>
    </div>
  );
};

export default RewardsStep; 