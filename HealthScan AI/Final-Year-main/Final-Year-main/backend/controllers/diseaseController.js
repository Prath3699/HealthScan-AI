const { mongoose } = require("mongoose");
const Disease = require("../model/diseaseSchema");

const CreateDisease = async (req, res) => {
  const {
    name,
    description,
    precautions,
    medication,
    workflow,
    notes,
    symptoms,
    spreadLevel,
    affectedRegions,
  } = req.body;

  if (
    !name ||
    !Array.isArray(symptoms) ||
    symptoms.length === 0 ||
    !spreadLevel ||
    !affectedRegions
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Missing or invalid required fields: name, symptoms, spreadLevel, affectedRegions",
    });
  }

  // validate spreadLevel values
  const allowedSpreadLevels = ["Low", "Moderate", "High"];
  if (!allowedSpreadLevels.includes(spreadLevel)) {
    return res.status(400).json({
      success: false,
      message: `Invalid spreadLevel. Allowed values are: ${allowedSpreadLevels.join(
        ", "
      )}`,
    });
  }
  try {
    const disease = await Disease.create({
      name,
      description,
      precautions,
      medication,
      workflow,
      notes,
      symptoms,
      spreadLevel,
      affectedRegions,
    });
    return res.status(201).json({ success: true, disease });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//Get all disease
const getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find();
    return res.status(200).json({ success: true, diseases });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//Delete a Disease
const deleteDisease = async (req, res) => {
  const { id } = req.body;
  //validate id
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Disease ID is required in the request body.Please provide it",
    });
  }

  try {
    const disease = await Disease.findByIdAndDelete(id);
    if (!disease) {
      return res
        .status(404)
        .json({ success: false, message: "Disease not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Disease deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//get disease by id
const getDiseaseById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const disease = await Disease.findById(id);
    if (!disease) {
      return res
        .status(404)
        .json({ success: false, message: "Disease not found" });
    }
    return res.status(200).json({ success: true, disease });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = {
  CreateDisease,
  getAllDiseases,
  deleteDisease,
  getDiseaseById,
};
