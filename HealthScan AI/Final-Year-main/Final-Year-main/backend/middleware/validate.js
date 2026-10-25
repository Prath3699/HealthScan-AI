const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

/**
 * Runs an array of express-validator chains and short-circuits with a
 * 400 response listing every failed rule.
 * Usage: router.post("/add", validate([check("email").isEmail()]), handler)
 */
const validate = (chains) => [
  ...chains,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new ApiError(
          400,
          errors.array().map((e) => e.msg).join("; ") || "Validation failed"
        )
      );
    }
    next();
  },
];

module.exports = validate;
