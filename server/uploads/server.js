const express = require("express");
const path = require("path");
const cors = require("cors");
const config = require("./config");
const { initializeUploadDirs } = require("./utils/fileUtils");
const uploadRoutes = require("./routes/uploadRoutes");

// Initialize the Express app
const app = express();
const PORT = config.port;

// Initialize upload directories
initializeUploadDirs(config);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, config.uploadsDir)));

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "File Upload Server API",
    version: "1.0.0",
    endpoints: {
      uploadVideo: "/api/upload/video",
      uploadImage: "/api/upload/image",
      uploadDocument: "/api/upload/document",
      uploadAny: "/api/upload",
    },
  });
});

// Register routes
app.use("/api/upload", uploadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(
    `📁 File upload endpoints available at http://localhost:${PORT}/api/upload`
  );
  console.log(`👀 Uploads can be viewed at http://localhost:${PORT}/uploads`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

module.exports = app;
