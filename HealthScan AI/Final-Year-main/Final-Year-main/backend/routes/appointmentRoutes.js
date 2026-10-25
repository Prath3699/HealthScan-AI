const {
  bookAppointment,
  cancelAppointment,
  getAppointmentById,
  getAvailableSlots,
  getAppointmentsforthatday,
  getUpcomingForUser,
} = require("../controllers/appointmentController");

const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { protect } = require("../middleware/roleAuth");

const router = express.Router();

// Public: patients browse doctor availability before booking
router.get("/available-slots", asyncHandler(getAvailableSlots));

// Everything else requires a valid token
router.use(protect);

router.get("/upcoming", asyncHandler(getUpcomingForUser));
router.post(
  "/book",
  validate([
    body("doctorId").isMongoId().withMessage("Valid doctorId is required"),
    body("patientId").isMongoId().withMessage("Valid patientId is required"),
    body("time.from").isISO8601().withMessage("time.from must be an ISO date"),
    body("time.to").isISO8601().withMessage("time.to must be an ISO date"),
    body("day.from").isISO8601().withMessage("day.from must be an ISO date"),
  ]),
  asyncHandler(bookAppointment)
);

router.delete("/cancel/:id", asyncHandler(cancelAppointment));
router.get("/day", asyncHandler(getAppointmentsforthatday));
router.get("/:id", asyncHandler(getAppointmentById));

module.exports = router;
