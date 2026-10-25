const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ms = require("ms");
const RefreshToken = require("../model/refreshTokenSchema");

/**
 * Single source of truth for the auth token lifecycle.
 *
 * - Access token: short-lived JWT returned in the response body; the
 *   frontend keeps it in memory/localStorage and sends it as a Bearer
 *   header (existing behavior, unchanged).
 * - Refresh token: long-lived opaque random string stored ONLY as a
 *   hash in MongoDB and delivered via an httpOnly cookie (not readable
 *   by JS), rotated on every use with reuse detection.
 */

const REFRESH_COOKIE = "refreshToken";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (user, role) =>
  jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/api/auth", // only sent to the refresh/logout endpoints
  maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d"),
});

/** Issues a brand-new refresh-token family for a logged-in user. */
const issueRefreshToken = async (res, user, role) => {
  const token = crypto.randomBytes(48).toString("hex");
  await RefreshToken.create({
    userKey: `${role}:${user._id}`,
    tokenHash: hashToken(token),
    family: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d")),
  });
  res.cookie(REFRESH_COOKIE, token, cookieOptions());
  return token;
};

/**
 * Rotates the presented refresh token.
 * Returns { userKey, token } on success, null when the cookie is
 * missing/expired/invalid, and throws ApiError-like { code: "REUSE" }
 * when a previously-used token is replayed (family revoked).
 */
const rotateRefreshToken = async (req, res) => {
  const presented = req.cookies?.[REFRESH_COOKIE];
  if (!presented) return null;

  const record = await RefreshToken.findOne({ tokenHash: hashToken(presented) });
  if (!record) return null;

  if (record.used) {
    // Reuse of a rotated token: someone replayed a stolen value.
    // Kill the whole family and force re-login everywhere.
    await RefreshToken.deleteMany({ family: record.family });
    res.clearCookie(REFRESH_COOKIE, { ...cookieOptions(), maxAge: undefined });
    const err = new Error("Refresh token reuse detected");
    err.code = "REUSE";
    throw err;
  }

  record.used = true;
  await record.save();

  const token = crypto.randomBytes(48).toString("hex");
  await RefreshToken.create({
    userKey: record.userKey,
    tokenHash: hashToken(token),
    family: record.family,
    expiresAt: new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN || "7d")),
  });
  res.cookie(REFRESH_COOKIE, token, cookieOptions());
  return { userKey: record.userKey, token };
};

/** Revokes the session tied to the cookie (single logout). */
const revokeRefreshCookie = async (req, res) => {
  const presented = req.cookies?.[REFRESH_COOKIE];
  if (presented) {
    const record = await RefreshToken.findOne({ tokenHash: hashToken(presented) });
    if (record) await RefreshToken.deleteMany({ family: record.family });
  }
  res.clearCookie(REFRESH_COOKIE, { ...cookieOptions(), maxAge: undefined });
};

module.exports = {
  REFRESH_COOKIE,
  hashToken,
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshCookie,
};
