/**
 * Operational API error with an HTTP status code.
 * Throw these from controllers/validation; the global error handler
 * converts them into clean JSON responses without leaking stack traces.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
