import { useState } from "react";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

export default function useVerification() {
  const [requestUrl, setRequestUrl] = useState(null);
  const [reclaimProofRequest, setReclaimProofRequest] = useState(null);
  const [statusUrl, setStatusUrl] = useState("");
  const [proofs, setProofs] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  const initializeReclaim = async () => {
    try {
      const APP_ID = import.meta.env.VITE_APP_ID;
      const APP_SECRET = import.meta.env.VITE_APP_SECRET;
      const PROVIDER_ID = import.meta.env.VITE_PROVIDER_ID;

      const proofRequest = await ReclaimProofRequest.init(
        APP_ID,
        APP_SECRET,
        PROVIDER_ID
      );

      proofRequest.setAppCallbackUrl("http://localhost:5173", true);
      proofRequest.setRedirectUrl("http://localhost:5173");

      const requestUrl = await proofRequest.getRequestUrl();
      setRequestUrl(requestUrl);
      console.log("Request URL:", requestUrl);

      setReclaimProofRequest(proofRequest);

      await proofRequest.startSession({
        onSuccess: async (proofs) => {
          console.log("Verification success, received proofs:", proofs);
          setIsVerifying(true);

          try {
            if (proofs) {
              if (typeof proofs === "string") {
                console.log("Received proof message:", proofs);
              } else {
                console.log("Processing proof data:", proofs);
                if (Array.isArray(proofs)) {
                  console.log(
                    "Multiple proofs:",
                    proofs.map((p) => p.claimData?.context)
                  );
                } else {
                  console.log("Single proof:", proofs.claimData?.context);
                }

                try {
                  const response = await fetch(
                    "http://localhost:3000/receive-proofs",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ proofs }),
                    }
                  );

                  if (!response.ok) {
                    throw new Error("Failed to verify proof");
                  }

                  const result = await response.json();
                  console.log("Verification result:", result);

                  if (result.success) {
                    setIsVerifying(false);
                    setVerificationError(null);
                    setProofs(proofs);
                  } else {
                    throw new Error(result.message || "Verification failed");
                  }
                } catch (error) {
                  throw new Error(
                    `Proof verification failed: ${error.message}`
                  );
                }
              }
            }
          } catch (error) {
            console.error("Error processing verification:", error);
            setIsVerifying(false);
            setVerificationError(
              error.message || "Failed to process verification"
            );
          }
        },
        onFailure: (error) => {
          console.error("Verification failed:", error);
          setIsVerifying(false);
          setVerificationError("Verification failed. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error initializing Reclaim:", error);
      setVerificationError(
        "Failed to initialize verification. Please try again."
      );
    }
  };

  return {
    requestUrl,
    isVerifying,
    verificationError,
    proofs,
    initializeReclaim,
    setVerificationError,
    setIsVerifying,
  };
}
