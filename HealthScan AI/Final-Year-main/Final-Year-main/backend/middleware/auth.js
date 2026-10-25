const jwt = require("jsonwebtoken");

// Normalize URL: strip trailing slash so "/api/login/" matches "/api/login"
const normalize = (p) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);

const auth = (req, res, next) => {
  const publicPaths = [
    "/api/doctors/add",
    "/api/patients/add",
    "/api/patient/add",
    "/api/login",
  ];
  // Use originalUrl because this middleware is mounted with app.use("/api", ...),
  // which strips the mount point from req.path.
  if (publicPaths.includes(normalize(req.originalUrl.split("?")[0]))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};

module.exports = auth;
