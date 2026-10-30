const mongoose = require("mongoose");

/**
 * Opaque refresh tokens stored hashed (SHA-256) so a database leak
 * cannot be used to mint access tokens. Rotated on every refresh:
 * the old token is marked used and its family is revoked if it is
 * ever presented again (token-reuse detection).
 */
const refreshTokenSchema = new mongoose.Schema(
  {
    userKey: {
      type: String,
      required: true,
      index: true, // "Doctor:<id>" or "Patient:<id>" – roles share no id space
    },
    tokenHash: { type: String, required: true, unique: true },
    family: { type: String, required: true, index: true },
    used: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB reaps expired sessions automatically (no cron needed).
      index: true,
      expires: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
