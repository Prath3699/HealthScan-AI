const Doctor = require("../model/doctorSchema");
const Patient = require("../model/patientSchema");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");

const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new ApiError(400, "email, password and role are required");
  }

  // password has select:false on both schemas, so explicitly opt it in here.
  let user;
  if (role === "Doctor") user = await Doctor.findOne({ email }).select("+password");
  else if (role === "Patient") user = await Patient.findOne({ email }).select("+password");
  else throw new ApiError(400, 'role must be "Doctor" or "Patient"');

  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Incorrect password");

  const token = generateToken(user, role);

  return res.status(200).json({ success: true, token, id: user._id, role });
};

module.exports = { login };
