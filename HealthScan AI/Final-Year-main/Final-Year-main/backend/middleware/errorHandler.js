const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

// 404 for unknown routes — forwarded to the error handler below.
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Centralized error handler (must have 4 args so Express treats it as such).
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Malformed ObjectId in a route param / query
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for "${err.path}"`;
  }

  // Schema validation failure
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
  }

  // Duplicate key (unique index) violation
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  // Never leak internals on unexpected errors in production.
  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
