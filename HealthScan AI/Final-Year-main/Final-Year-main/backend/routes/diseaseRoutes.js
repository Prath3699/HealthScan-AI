const express = require("express");
const {
  CreateDisease,
  getAllDiseases,
  deleteDisease,
  getDiseaseById,
} = require("../controllers/diseaseController");
const router = express.Router();

// POST a disease
router.post("/add", CreateDisease);

// GET all disease
router.get("/", getAllDiseases);

// DELETE a disease
router.delete("/delete", deleteDisease);

router.get("/:id",getDiseaseById);

module.exports = router;
