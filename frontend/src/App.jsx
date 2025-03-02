import QRCode from "react-qr-code";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { useEffect, useState } from "react";
import Web3 from "web3";

function App() {
  const [requestUrl, setRequestUrl] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [isConnected, setIsConnected] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem("walletConnected") === "true";
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({
    1: false,
    2: false,
    3: false,
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  useEffect(() => {
    initializeReclaim();
    // Only check wallet connection if user previously connected
    if (localStorage.getItem("walletConnected") === "true") {
      checkWalletConnection();
    }
  }, []);

  useEffect(() => {
    if (isConnected && !completedSteps[1]) {
      completeStep(1);
    }
  }, [isConnected]);

  const getBalance = async (address) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        setBalance(parseFloat(balanceEth).toFixed(4));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          localStorage.setItem("walletConnected", "true");
          getBalance(accounts[0]);
        } else {
          // If no accounts found, consider it disconnected
          handleDisconnect();
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        handleDisconnect();
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem("walletConnected", "true");
        getBalance(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        handleDisconnect();
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleDisconnect = () => {
    // Reset wallet states
    setAccount("");
    setBalance("0");
    setIsConnected(false);
    localStorage.removeItem("walletConnected");

    // Reset step states
    setCurrentStep(1);
    setCompletedSteps({
      1: false,
      2: false,
      3: false,
    });
  };

  const completeStep = (step) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [step]: true,
    }));
    setTimeout(() => {
      if (step < 3) {
        setCurrentStep(step + 1);
      }
    }, 800);
  };

  // Update the checkVerificationStatus function
  const checkVerificationStatus = async () => {
    try {
      const response = await fetch("http://localhost:3000/verification-status");
      const data = await response.json();
      
      switch (data.status) {
        case "completed":
          if (data.shouldProceed) {
            setIsVerifying(false);
            setVerificationError(null);
            completeStep(2);
            // Clear polling interval immediately after success
            return true;
          }
          return false;
        case "failed":
          setIsVerifying(false);
          setVerificationError(data.message || "Verification failed");
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      setVerificationError("Error checking verification status");
      return false;
    }
  };

  // Update handleVerificationSuccess to handle immediate progression
  const handleVerificationSuccess = (proofs) => {
    if (proofs) {
      if (typeof proofs === "string") {
        console.log("SDK Message:", proofs);
      } else if (typeof proofs !== "string") {
        console.log("Proof received:", proofs?.claimData.context);
        setIsVerifying(true);

        // Start polling with shorter interval for quicker response
        const pollInterval = setInterval(async () => {
          const isCompleted = await checkVerificationStatus();
          if (isCompleted) {
            clearInterval(pollInterval);
          }
        }, 1000); // Check every second for faster response

        // Cleanup after 30 seconds instead of 2 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          if (isVerifying) {
            setIsVerifying(false);
            setVerificationError("Verification timed out");
          }
        }, 30000);
      }
    }
  };

  async function initializeReclaim() {
    try {
      const response = await fetch(
        "http://localhost:3000/reclaim/generate-config"
      );
      const { reclaimProofRequestConfig } = await response.json();
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
        reclaimProofRequestConfig
      );
      const requestUrl = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(requestUrl);

      await reclaimProofRequest.startSession({
        onSuccess: handleVerificationSuccess,
        onError: (error) => {
          console.error("Verification failed", error);
        },
      });
    } catch (error) {
      console.error("Error initializing Reclaim:", error);
    }
  }

  // Add this function to check if we can navigate to a specific step
  const canNavigateToStep = (targetStep) => {
    // Can always go back
    if (targetStep < currentStep) return true;

    // Can only go forward if previous step is completed
    if (targetStep === 1) return true;
    if (targetStep === 2) return completedSteps[1];
    if (targetStep === 3) return completedSteps[2];
    return false;
  };

  // Update the navigation functions
  const handleStepChange = (targetStep) => {
    if (canNavigateToStep(targetStep)) {
      setCurrentStep(targetStep);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-3 font-['roboto']">
      {/* Navbar */}
      <nav className="w-full max-w-lg mb-6 flex items-center justify-between bg-gray-800 p-3 rounded-xl">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">OnQuest</span>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <div className="relative group">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm">
                <span>
                  {`${account.substring(0, 6)}...${account.substring(
                    account.length - 4
                  )}`}
                </span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-44 py-2 bg-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-3 py-2 border-b border-gray-600">
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="text-sm text-white font-medium">
                    {balance} ETH
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="w-full px-3 py-2 text-left text-white hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 text-sm"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Disconnect
                </button>
              </div>
            </div>
          )}
          {!isConnected && (
            <button
              onClick={connectWallet}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center text-sm"
            >
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-lg w-full bg-gray-800 rounded-xl p-4 shadow-2xl text-white">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Verification Process</h1>
          <p className="text-sm text-gray-300">
            Complete all steps to claim your rewards
          </p>
        </header>

        {/* Progress Bar */}
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

        {/* Step Content */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
          >
            {/* Step 1: Connect Wallet */}
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
                  <p className="text-sm text-green-400">
                    Wallet Connected Successfully!
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: QR Verification */}
            <div className="min-w-full">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">
                  QR Code Verification
                </h3>
                {isConnected && requestUrl ? (
                  isVerifying ? (
                    <div className="bg-black p-8 rounded-lg text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-300 text-sm">
                        Wait for verification...
                      </p>
                    </div>
                  ) : verificationError ? (
                    <div className="bg-black p-8 rounded-lg text-center">
                      <div className="text-red-500 mb-4">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-red-400 text-sm mb-4">
                        {verificationError}
                      </p>
                      <button
                        onClick={() => {
                          setVerificationError(null);
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
                        className="block hover:opacity-90 transition-opacity"
                      >
                        <div className="flex justify-center w-full aspect-square max-w-[280px] mx-auto">
                          <QRCode
                            value={requestUrl}
                            className="w-full h-full"
                            size={280}
                          />
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
                    {isConnected
                      ? "Loading QR Code..."
                      : "Connect wallet first"}
                  </p>
                )}
              </div>
            </div>

            {/* Step 3: Claim Rewards */}
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
                  <p className="text-sm text-gray-400">
                    Complete verification first
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
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
      </div>
    </div>
  );
}

export default App;
