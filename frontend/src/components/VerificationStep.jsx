import React from 'react';
import QRCode from "react-qr-code";

const VerificationStep = ({ 
  isConnected, 
  requestUrl, 
  isVerifying, 
  verificationError, 
  setVerificationError, 
  setIsVerifying, 
  initializeReclaim 
}) => {
  return (
    <div className="min-w-full">
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">QR Code Verification</h3>
        {isConnected && requestUrl ? (
          isVerifying ? (
            <div className="bg-black p-8 rounded-lg text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300 text-sm">Verifying your credentials...</p>
            </div>
          ) : verificationError ? (
            <div className="bg-black p-8 rounded-lg text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-400 text-sm mb-4">{verificationError}</p>
              <button
                onClick={() => {
                  setVerificationError(null);
                  setIsVerifying(false);
                  initializeReclaim();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="bg-black p-4 rounded-lg">
              <a
                href={requestUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(requestUrl, "_blank", "noopener,noreferrer,width=600,height=800");
                }}
                className="block hover:opacity-90 transition-opacity"
              >
                <div className="flex justify-center w-full aspect-square max-w-[280px] mx-auto">
                  <QRCode value={requestUrl} className="w-full h-full" size={280} />
                </div>
                <div className="text-center mt-3">
                  <p className="text-xs text-blue-400 hover:underline cursor-pointer">
                    Click to open verification link
                  </p>
                </div>
              </a>
            </div>
          )
        ) : (
          <p className="text-sm text-gray-400">
            {isConnected ? "Loading QR Code..." : "Connect wallet first"}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerificationStep; 