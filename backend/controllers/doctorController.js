const mongoose = require("mongoose");
const Doctor = require("../model/doctorSchema");
const Unavailability = require("../model/unavailablitySchema");
const bcrypt = require("bcryptjs");

// add Doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      age,
      specialization,
      experience,
      password,
      location,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !age ||
      !specialization ||
      !experience ||
      !password ||
      !location
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await Doctor.create({
      name,
      email,
      phone,
      age,
      specialization,
      experience,
      password: hashedPassword,
      location,
    });
    // never return the (hashed) password to clients
    const doctorObj = doctor.toObject();
    delete doctorObj.password;
    return res.status(201).json({ success: true, doctor: doctorObj });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// add slot
const addDoctorSlot = async (req, res) => {
  try {
    const { doctorId, day, from, to } = req.body;

    if (!doctorId || !day || !from || !to) {
      return res.status(400).json({
        success: false,
        message:
          "Fields doctorId, day, from, and to are required.please enter them",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }
    //duplicate slot: same day with overlapping start/end time
    const duplicate = doctor.availableSlots.find(
      (slot) => slot.day === day && (slot.from === from || slot.to === to)
    );
    if (duplicate) {
      return res
        .status(400)
        .json({ success: false, message: "Slot already alloted." });
    }
    doctor.availableSlots.push({ day, from, to });
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Slot added successfully.",
      slots: doctor.availableSlots,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const updateDoctorSlot = async (req, res) => {
  try {
    const { doctorId, day, from, to } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Remove old slot for the day if it exists
    doctor.availableSlots = doctor.availableSlots.filter(
      (slot) => slot.day !== day
    );

    // Push the new slot
    doctor.availableSlots.push({ day, from, to });

    await doctor.save();

    return res.status(200).json({
      message: `${day} slot updated successfully`,
      availableSlots: doctor.availableSlots,
    });
  } catch (error) {
    console.error("Error updating doctor slot:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get Doctor by id
const getDoctorById = async (req, res) => {
  try {
    const id = req.params.doctorId;
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const doctor = await Doctor.findById(id).populate("appointments");
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    console.log(doctor);

    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// get all doctors
const getDoctors = async (req, res) => {
  try {
    const { query, specialization, experience, city, state } = req.query;
    const filter = {};

    if (query && query.trim().length > 1) {
      filter.name = { $regex: query.trim(), $options: "i" };
    }

    if (specialization) {
      filter.specialization = { $in: [specialization.toUpperCase()] };
    }

    if (experience) {
      filter.experience = { $gte: Number(experience) };
    }

    if (city) {
      filter["location.city"] = { $regex: city, $options: "i" };
    }

    if (state) {
      filter["location.state"] = { $regex: state, $options: "i" };
    }

    const doctors = await Doctor.find(filter);

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// update Doctor
const updateDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    if (!id || !updatedData) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    const doctor = await Doctor.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    return res.status(200).json({ success: true, doctor });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// delete Doctor
const deleteDoctor = async (req, res) => {
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
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// controllers/unavailabilityController.js
const createUnavailability = async (req, res) => {
  try {
    const {
      doctorId,
      type,
      title,
      startTime,
      endTime,
      recurring,
      recurringDays,
      recurringEndDate,
      reason,
    } = req.body;

    const unavailability = new Unavailability({
      doctorId,
      type,
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      recurring: recurring || false,
      recurringDays: recurring ? recurringDays : [],
      recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null,
      reason,
      isActive: true,
    });

    await unavailability.save();

    res.status(201).json({
      message: "Unavailability created successfully",
      unavailability,
    });
  } catch (error) {
    console.error("Error creating unavailability:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDoctorUnavailabilities = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { doctorId, isActive: true };

    if (startDate && endDate) {
      query.$or = [
        // Single events in date range
        {
          startTime: { $gte: new Date(startDate) },
          endTime: { $lte: new Date(endDate) },
        },
        // Recurring events
        { recurring: true },
        // Events that overlap with date range
        {
          startTime: { $lte: new Date(endDate) },
          endTime: { $gte: new Date(startDate) },
        },
      ];
    }

    const unavailabilities = await Unavailability.find(query);
    res.status(200).json({ unavailabilities });
  } catch (error) {
    console.error("Error fetching unavailabilities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addDoctor,
  addDoctorSlot,
  getDoctorById,
  getDoctors,
  updateDoctor,
  deleteDoctor,
  updateDoctorSlot,
  createUnavailability,
  getDoctorUnavailabilities,
};
