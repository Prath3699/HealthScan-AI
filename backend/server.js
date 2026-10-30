require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dbConnect = require("./config/dbConnect");
const logger = require("./utils/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const loginRoutes = require("./routes/loginRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();
const PORT = process.env.PORT || 3003;

// --- Security & parsing middleware -------------------------------------
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

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
    credentials: true, // required for the httpOnly refresh-token cookie
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

// Connect with bounded exponential backoff so a slow-starting MongoDB
// (e.g. the docker-compose service on first boot) doesn't kill the API.
const connectWithRetry = async (attempt = 1) => {
  try {
    await dbConnect();
  } catch (err) {
    if (attempt >= 10) {
      logger.error("MongoDB connection failed after max retries", { error: err.message });
      process.exit(1);
    }
    const delay = Math.min(2000 * attempt, 15000);
    logger.warn("MongoDB unavailable, retrying", { attempt, delayMs: delay });
    setTimeout(() => connectWithRetry(attempt + 1), delay);
  }
};
if (process.env.NODE_ENV !== "test") connectWithRetry();

// --- Appointment reminders -------------------------------------------------
// Hourly scan for Scheduled appointments starting within 24h; emails the
// patient & doctor (idempotent via appointment.reminded). Disabled in tests.
let reminderTimer = null;
if (process.env.NODE_ENV !== "test") {
  const { sendUpcomingReminders } = require("./utils/emailService");
  const runReminders = () =>
    sendUpcomingReminders().catch((err) =>
      logger.error("Reminder job failed", { error: err.message })
    );
  // First run shortly after boot, then every hour.
  setTimeout(runReminders, 60 * 1000);
  reminderTimer = setInterval(runReminders, 60 * 60 * 1000);
}

// --- Routes -------------------------------------------------------------
app.use("/api/appointment", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
// alias: the frontend calls "/api/patient/..." (singular)
app.use("/api/patient", patientRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/predict", predictionRoutes);
app.use("/api/stats", statsRoutes);

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
  const server = app.listen(PORT, () => {
    logger.info("Server started", { port: PORT, env: process.env.NODE_ENV || "development" });
  });

  // Graceful shutdown: stop accepting connections, close the reminder job and
  // the DB connection, then exit (with a hard timeout fallback).
  const shutdown = (signal) => {
    logger.info("Shutting down", { signal });
    if (reminderTimer) clearInterval(reminderTimer);
    server.close(async () => {
      try {
        await require("mongoose").disconnect();
      } finally {
        process.exit(0);
      }
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

module.exports = app;
