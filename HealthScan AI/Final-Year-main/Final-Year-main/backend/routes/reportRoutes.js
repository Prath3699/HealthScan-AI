const express = require("express");
const {
    createReport,
    deleteReport,
    getAllReports,
    getReportById,
} = require("../controllers/reportController");

const reportRoutes = express.Router();
reportRoutes.post("/add", createReport);
reportRoutes.delete("/delete/:id", deleteReport);
reportRoutes.get("/", getAllReports);
reportRoutes.get("/:id", getReportById);

module.exports = reportRoutes;