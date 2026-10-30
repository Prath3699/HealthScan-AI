// Express 5 does not auto-catch rejected promises; wrap async handlers so
// thrown/rejected errors reach the centralized error handler.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
