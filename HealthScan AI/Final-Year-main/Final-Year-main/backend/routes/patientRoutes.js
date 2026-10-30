const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { protect, requireRole } = require("../middleware/roleAuth");
const {
  createPatient,
  deletePatient,
  updatePatient,
  getPatientById,
  getPatientFullSummary,
} = require("../controllers/patientController");

const router = express.Router();

// Public: self-registration of patients
router.post(
  "/add",
  validate([
    body("name").trim().notEmpty().withMessage("name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 characters"),
  ]),
  asyncHandler(createPatient)
);

// Protected: patient records are PHI — only the patient themself may read them.
router.get(
  "/:id",
  protect,
  (req, res, next) => {
    if (req.params.id !== req.user.id) {
      return next({ statusCode: 403, message: "Can only view your own record" });
    }
    next();
  },
  asyncHandler(getPatientById)
);

router.get(
  "/summary/:id",
  protect,
  (req, res, next) => {
    if (req.params.id !== req.user.id) {
      return next({ statusCode: 403, message: "Can only view your own record" });
    }
    next();
  },
  asyncHandler(getPatientFullSummary)
);

router.put(
  "/update/:id",
  protect,
  requireRole("Patient"),
  (req, res, next) => {
    if (req.params.id !== req.user.id) {
      return next({ statusCode: 403, message: "Can only update your own record" });
    }
    next();
  },
  asyncHandler(updatePatient)
);

router.delete(
  "/delete/:id",
  protect,
  requireRole("Patient"),
  (req, res, next) => {
    if (req.params.id !== req.user.id) {
      return next({ statusCode: 403, message: "Can only delete your own account" });
    }
    next();
  },
  asyncHandler(deletePatient)
);

module.exports = router;
