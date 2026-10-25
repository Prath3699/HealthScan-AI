require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const loginRoutes = require("./routes/loginRoutes");
const auth = require("./middleware/auth");
const reportRoutes = require("./routes/reportRoutes");
const app = express();
const PORT = process.env.PORT || 3003;
app.use(express.json());

app.use(cors({ origin: "*" }));
dbConnect();

// JWT auth guard for all /api routes except the public ones listed in the middleware
app.use("/api", auth);

app.use("/api/appointment", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
// alias: the frontend calls "/api/patient/..." (singular)
app.use("/api/patient", patientRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/reports", reportRoutes);

app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
