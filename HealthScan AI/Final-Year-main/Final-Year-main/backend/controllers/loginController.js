const Doctor = require("../model/doctorSchema");
const Patient = require("../model/patientSchema");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const {
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshCookie,
} = require("../utils/tokenService");

const modelsByRole = { Doctor, Patient };

/** Resolve the model for a role, throwing a clean 400 for unknown roles. */
const modelForRole = (role) => {
  const Model = modelsByRole[role];
  if (!Model) throw new ApiError(400, 'role must be "Doctor" or "Patient"');
  return Model;
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new ApiError(400, "email, password and role are required");
  }

  // password has select:false on both schemas, so explicitly opt it in here.
  const user = await modelForRole(role).findOne({ email }).select("+password");

  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Incorrect password");

  // Short-lived access token in the body + long-lived httpOnly refresh cookie.
  const token = signAccessToken(user, role);
  await issueRefreshToken(res, user, role);

  return res.status(200).json({ success: true, token, id: user._id, role });
};

/**
 * POST /api/auth/refresh — exchanges a valid refresh cookie for a fresh
 * access token. The cookie is rotated on every call; replaying an old
 * value revokes the whole session family (401).
 */
const refresh = async (req, res) => {

  let rotated;
  try {
    rotated = await rotateRefreshToken(req, res);
  } catch (err) {
    if (err.code === "REUSE") throw new ApiError(401, err.message);
    throw err;
  }

  if (!rotated) throw new ApiError(401, "Invalid or expired refresh token");

  const [role, id] = rotated.userKey.split(":");
  const user = await modelForRole(role).findById(id);
  if (!user) throw new ApiError(401, "Account no longer exists");

  const token = signAccessToken(user, role);
  return res.status(200).json({ success: true, token, id: user._id, role });
};

/** POST /api/auth/logout — revokes the current refresh-token family. */
const logout = async (req, res) => {
  await revokeRefreshCookie(req, res);
  return res.status(200).json({ success: true, message: "Logged out" });
};

module.exports = { login, refresh, logout };
