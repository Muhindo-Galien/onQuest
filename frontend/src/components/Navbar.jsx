import React from 'react';

const Navbar = ({ isConnected, account, balance, handleDisconnect, connectWallet }) => {
  return (
    <nav className="w-full max-w-lg mb-6 flex items-center justify-between bg-gray-800 p-3 rounded-xl">
      <div className="flex items-center">
        <span className="text-xl font-bold text-white">OnQuest</span>
      </div>
      <div className="flex items-center gap-2">
        {isConnected ? (
          <div className="relative group">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm">
              <span>
                {`${account.substring(0, 6)}...${account.substring(
                  account.length - 4
                )}`}
              </span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-44 py-2 bg-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="px-3 py-2 border-b border-gray-600">
                <p className="text-xs text-gray-400">Balance</p>
                <p className="text-sm text-white font-medium">{balance} ETH</p>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full px-3 py-2 text-left text-white hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center text-sm"
          >
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 