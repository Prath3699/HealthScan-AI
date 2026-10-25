const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { protect, requireRole } = require("../middleware/roleAuth");
const {
  createReport,
  deleteReport,
  getAllReports,
  getReportById,
} = require("../controllers/reportController");

const reportRoutes = express.Router();

// All report data is PHI — every route requires a valid token.
reportRoutes.use(protect);

// Only the treating doctor may write a prescription/report.
reportRoutes.post(
  "/add",
  requireRole("Doctor"),
  validate([
    body("appointmentId").isMongoId().withMessage("Valid appointmentId is required"),
    body("patientId").isMongoId().withMessage("Valid patientId is required"),
    body("doctorId").isMongoId().withMessage("Valid doctorId is required"),
    body("diseases").notEmpty().withMessage("diseases is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("medicines")
      .isArray({ min: 1 })
      .withMessage("At least one medicine must be provided"),
  ]),
  asyncHandler(createReport)
);

reportRoutes.delete("/delete/:id", requireRole("Doctor"), asyncHandler(deleteReport));
reportRoutes.get("/", asyncHandler(getAllReports));
reportRoutes.get("/:id", asyncHandler(getReportById));

module.exports = reportRoutes;
