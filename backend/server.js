const express = require("express");
const { ReclaimProofRequest, verifyProof } = require("@reclaimprotocol/js-sdk");
const cors = require("cors");

const app = express();
const port = 3000;

// Configure CORS with specific options
// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173/", // Allow frontend requests
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Enable cookies/session handling
};

// Apply CORS middleware with options
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.text({ type: "*/*", limit: "50mb" }));

// Add security headers middleware
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// Start server with error handling
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
