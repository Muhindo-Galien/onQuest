const express = require("express");
const { ReclaimProofRequest, verifyProof } = require("@reclaimprotocol/js-sdk");
const cors = require("cors");

const app = express();
const port = 3000;

// Add verificationStatus variable at the top
let verificationStatus = null;

app.use(express.json());
app.use(express.text({ type: "*/*", limit: "50mb" }));
app.use(cors());

// Route to generate SDK configuration
app.get("/reclaim/generate-config", async (req, res) => {
  try {
    const APP_ID = "0x8195922fb26e6A61ADdBcdF162a06C868D438AeB";
    const APP_SECRET =
      "0xf6851da894794c5650f703966b8a17933b1a399e4658e2fb796b8927dabd2327";
    const PROVIDER_ID = "8573efb4-4529-47d3-80da-eaa7384dac19";

    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      PROVIDER_ID
    );

    reclaimProofRequest.setAppCallbackUrl(
      "http://localhost:3000/receive-proofs"
    );

    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

    // Reset verification status when generating new request
    verificationStatus = null;

    return res.json({ reclaimProofRequestConfig });
  } catch (error) {
    console.error("Error generating request config:", error);
    return res.status(500).json({
      error: "Failed to generate request config",
      message: error.message,
    });
  }
});

// Route to receive proofs
app.post("/receive-proofs", async (req, res) => {
  try {
    const decodedBody = decodeURIComponent(req.body);
    const proof = JSON.parse(decodedBody);

    // Verify the proof using the SDK verifyProof function
    const result = await verifyProof(proof);

    if (!result) {
      verificationStatus = {
        status: "failed",
        message: "Invalid proof data",
        timestamp: new Date().toISOString(),
        shouldProceed: false,
      };
      return res.status(400).json({ error: "Invalid proofs data" });
    }

    console.log("Received proofs:", proof);

    // Store successful verification status with auto-proceed flag
    verificationStatus = {
      status: "completed",
      message: "Verification successful",
      timestamp: new Date().toISOString(),
      data: proof,
      shouldProceed: true,
    };

    return res.sendStatus(200);
  } catch (error) {
    console.error("Error processing proof:", error);
    verificationStatus = {
      status: "failed",
      message: error.message || "Verification failed",
      timestamp: new Date().toISOString(),
      shouldProceed: false,
    };
    return res.status(500).json({ error: error.message });
  }
});

// Route to check verification status
app.get("/verification-status", (req, res) => {
  try {
    if (!verificationStatus) {
      return res.json({
        status: "pending",
        message: "Waiting for verification",
      });
    }
    return res.json(verificationStatus);
  } catch (error) {
    console.error("Error checking verification status:", error);
    return res.status(500).json({
      error: "Failed to check verification status",
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Start server with error handling
app
  .listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  })
  .on("error", (error) => {
    console.error("Server failed to start:", error);
  });
