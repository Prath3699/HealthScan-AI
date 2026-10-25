const Doctor = require("../model/doctorSchema");
const bcrypt = require("bcryptjs");
const Patient = require("../model/patientSchema");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user;
    if (role == "Doctor") user = await Doctor.findOne({ email });
    else user = await Patient.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({ success: true, token, id: user._id, role });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { login };
