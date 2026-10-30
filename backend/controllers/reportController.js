const { mongoose } = require("mongoose");
const Report = require("../model/reportSchema");
const Appointment = require("../model/appointmentSchema");
const Patient = require("../model/patientSchema");

// Create a report
const createReport = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      doctorId,
      diseases,
      description,
      precautions,
      medicines,
      notes,
      nextVisit,
    } = req.body;

    if (!appointmentId || !patientId || !doctorId) {
      return res.status(400).json({
        success: false,
        message: "appointmentId, patientId, and doctorId are required.",
      });
    }

    if(!diseases || !description){
      return res.status(400).json({
        success: false,
        message: "diseases and description are required.",
      });
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one medicine must be provided. and medicines must be an array.",
      });
    }

    for (const med of medicines) {
      if (!med.name || !med.dosage || !med.duration) {
        return res.status(400).json({
          success: false,
          message: "Each medicine must include name, dosage, and duration.",
        });
      }
    }

    const report = await Report.create({
      appointmentId,
      patientId,
      doctorId,
      diseases,
      description,
      precautions,
      medicines,
      notes,
      nextVisit,
    });

    const patient=await Patient.findById(patientId);
    const appointment=await Appointment.findById(appointmentId);
    patient.reports.push(report._id);
    appointment.report=report._id;
    await patient.save();
    await appointment.save();

    return res.status(201).json({ success: true, report });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a report
const deleteReport = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    const patient = await Patient.findById(report.patientId);
    const appointment = await Appointment.findById(report.appointmentId);
    if (patient) {
      patient.reports.pull(report._id);
      await patient.save();
    }
    if (appointment) {
      appointment.report = null;
      await appointment.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization")
      .populate("appointmentId");

    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reports found" });
    }

    return res.status(200).json({ success: true, reports });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id)
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization")
      .populate("appointmentId");

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    return res.status(200).json({ success: true, report });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createReport, deleteReport, getAllReports, getReportById };
