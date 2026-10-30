const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { protect } = require("../middleware/roleAuth");
const { getDashboardSummary } = require("../controllers/statsController");

const router = express.Router();

// All stats endpoints require a valid token.
router.use(protect);

router.get("/summary", asyncHandler(getDashboardSummary));

module.exports = router;
