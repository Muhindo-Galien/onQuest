import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import Navbar from "./components/Navbar";
import ProgressBar from "./components/ProgressBar";
import WalletStep from "./components/WalletStep";
import VerificationStep from "./components/VerificationStep";
import RewardsStep from "./components/RewardsStep";
import NavigationButtons from "./components/NavigationButtons";
import useWallet from "./hooks/useWallet";
import useVerification from "./hooks/useVerification";

function App() {
  // Wallet States
  const {
    account,
    balance,
    isConnected,
    connectWallet,
    handleDisconnect,
    checkWalletConnection,
  } = useWallet();

  // Verification States
  const {
    requestUrl,
    isVerifying,
    verificationError,
    proofs,
    initializeReclaim,
    setVerificationError,
    setIsVerifying,
  } = useVerification();

  // Step Management States
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({
    1: false,
    2: false,
    3: false,
  });

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

  const canNavigateToStep = (targetStep) => {
    if (targetStep < currentStep) return true;
    if (targetStep === 1) return true;
    if (targetStep === 2) return completedSteps[1];
    if (targetStep === 3) return completedSteps[2];
    return false;
  };

  const handleStepChange = (targetStep) => {
    if (canNavigateToStep(targetStep)) {
      setCurrentStep(targetStep);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-3 font-['roboto']">
      <Navbar
        isConnected={isConnected}
        account={account}
        balance={balance}
        handleDisconnect={handleDisconnect}
        connectWallet={connectWallet}
      />

      <div className="max-w-lg w-full bg-gray-800 rounded-xl p-4 shadow-2xl text-white">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Verification Process</h1>
          <p className="text-sm text-gray-300">
            Complete all steps to claim your rewards
          </p>
        </header>

        <ProgressBar
          currentStep={currentStep}
          completedSteps={completedSteps}
          canNavigateToStep={canNavigateToStep}
          handleStepChange={handleStepChange}
        />

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
          >
            <WalletStep
              isConnected={isConnected}
              connectWallet={connectWallet}
            />
            <VerificationStep
              isConnected={isConnected}
              requestUrl={requestUrl}
              isVerifying={isVerifying}
              verificationError={verificationError}
              setVerificationError={setVerificationError}
              setIsVerifying={setIsVerifying}
              initializeReclaim={initializeReclaim}
            />
            <RewardsStep
              completedSteps={completedSteps}
              completeStep={completeStep}
            />
          </div>
        </div>

        <NavigationButtons
          currentStep={currentStep}
          canNavigateToStep={canNavigateToStep}
          handleStepChange={handleStepChange}
        />
      </div>
    </div>
  );
}

export default App;
