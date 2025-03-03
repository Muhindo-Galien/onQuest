import React from 'react';

const WalletStep = ({ isConnected, connectWallet }) => {
  return (
    <div className="min-w-full">
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Connect Wallet</h3>
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
          >
            Connect MetaMask
          </button>
        ) : (
          <p className="text-sm text-green-400">Wallet Connected Successfully!</p>
        )}
      </div>
    </div>
  );
};

export default WalletStep; 