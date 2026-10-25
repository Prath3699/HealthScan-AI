require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const loginRoutes = require("./routes/loginRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const PORT = process.env.PORT || 3003;

// --- Security & parsing middleware -------------------------------------
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// CORS: allow an explicit comma-separated list, or reflect any origin in dev.
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin:
      allowedOrigins.length > 0
        ? allowedOrigins
        : process.env.NODE_ENV === "production"
          ? false
          : true,
  })
);

// Basic rate limiting on all /api routes.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, try later." },
  })
);

dbConnect().catch((err) => {
  console.error("Initial DB connection failed:", err.message);
});

// --- Routes -------------------------------------------------------------
app.use("/api/appointment", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
// alias: the frontend calls "/api/patient/..." (singular)
app.use("/api/patient", patientRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/reports", reportRoutes);

app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// --- Error handling ------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// Export the app for tests (supertest), start the server only when run directly.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
  });
}

module.exports = app;
