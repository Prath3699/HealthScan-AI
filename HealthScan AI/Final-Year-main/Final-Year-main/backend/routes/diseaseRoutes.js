const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { protect, requireRole } = require("../middleware/roleAuth");
const {
  CreateDisease,
  getAllDiseases,
  deleteDisease,
  getDiseaseById,
} = require("../controllers/diseaseController");

const router = express.Router();

// Public reference data (not PHI)
router.get("/", asyncHandler(getAllDiseases));
router.get("/:id", asyncHandler(getDiseaseById));

// Only doctors may create or remove entries in the disease catalog
router.post(
  "/add",
  protect,
  requireRole("Doctor"),
  validate([
    body("name").trim().notEmpty().withMessage("name is required"),
  ]),
  asyncHandler(CreateDisease)
);

router.delete(
  "/delete",
  protect,
  requireRole("Doctor"),
  asyncHandler(deleteDisease)
);

module.exports = router;
