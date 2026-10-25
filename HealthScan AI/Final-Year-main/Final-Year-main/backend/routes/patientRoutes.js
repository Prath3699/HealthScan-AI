const express = require("express");
const {
  createPatient,
  deletePatient,
  updatePatient,
  getPatientById,
  getPatientFullSummary,
} = require("../controllers/patientController");
const router = express.Router();

router.route("/add").post(createPatient);
router.route("/delete/:id").delete(deletePatient);
router.route("/update/:id").put(updatePatient);
router.route("/:id").get(getPatientById);
router.get("/summary/:id", getPatientFullSummary);

module.exports = router;
