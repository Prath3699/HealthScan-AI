const { mongoose } = require("mongoose");
const Patient = require("../model/patientSchema");
const bcrypt = require("bcryptjs");

const createPatient = async (req, res) => {
  const { name, email, phone, gender, password, bloodGroup, age, address } =
    req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email and password are required",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const patient = await Patient.create({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      bloodGroup: bloodGroup,
      address: address,
      gender: gender,
      age: age,
    });
    if (!patient) {
      return res
        .status(500)
        .json({ success: false, message: "Failed, Try again later!" });
    }

    return res.status(201).json({
      success: true,
      message: "Created Successfully",
      id: patient._id,
    });
  } catch (error) {
    console.log(error);
    // duplicate key error -> 409 with a clear message
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const patient = await Patient.findById(id).populate("appointments");
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    return res.status(200).json({ success: true, patient });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deletePatient = async (req, res) => {
  const _id = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const patient = await Patient.findByIdAndDelete(_id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Patient Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const { medicalHistory, ...otherData } = req.body;
    if (!id || !req.body) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    let updateQuery = { ...otherData };

    // if medicalHistory provided, push instead of replacing
    if (medicalHistory) {
      updateQuery = { $push: { medicalHistory } };
    }
    const patient = await Patient.findByIdAndUpdate(id, updateQuery, {
      new: true,
    }).populate("medicalHistory.diseaseId");

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    return res.status(200).json({ success: true, patient });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, error: error.message });
  }
};

const getPatientFullSummary = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const patient = await Patient.findById(id).populate({
      path: "medicalHistory.diseaseId",
      select: "name description precautions medication workflow notes symptoms",
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Full patient summary fetched successfully",
      patient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createPatient,
  deletePatient,
  updatePatient,
  getPatientById,
  getPatientFullSummary,
};
