const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { predictDisease } = require("../controllers/predictionController");

const router = express.Router();

// Public AI screening endpoint – stores no PHI, only reads the disease catalog.
router.post(
  "/",
  validate([
    body("patientName").optional({ nullable: true }).trim().isLength({ max: 100 }),
    body("patientAge")
      .isInt({ min: 0, max: 130 })
      .withMessage("patientAge must be an integer between 0 and 130"),
    body("diseaseDuration")
      .isFloat({ min: 0, max: 3650 })
      .withMessage("diseaseDuration must be a number of days between 0 and 3650"),
    body("patientLocation").optional({ nullable: true }).trim().isLength({ max: 120 }),
    body("patientSymptoms")
      .customSanitizer((v) => (Array.isArray(v) ? v.join(", ") : v))
      .trim()
      .notEmpty()
      .withMessage("patientSymptoms is required")
      .isLength({ max: 500 })
      .withMessage("patientSymptoms too long (max 500 characters)"),
  ]),
  asyncHandler(predictDisease)
);

module.exports = router;
