const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

/**
 * Authentication middleware: verifies the Bearer token and attaches
 * { id, role } to req.user. Use together with requireRole(...) for
 * role-based authorization.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "No token, authorization denied"));
  }

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

/** Restricts a route to one or more roles ("Doctor" | "Patient"). */
const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Not authorized for this action"));
    }
    next();
  };

module.exports = { protect, requireRole };
