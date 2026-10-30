const request = require("supertest");
const app = require("../server");

// Seed a doctor and a patient through the real registration endpoints,
// then book appointments directly via the model so we control the times
// (past vs future) deterministically.
const Appointment = require("../model/appointmentSchema");

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

describe("Dashboard stats summary", () => {
  let doctor, patientId, doctorToken, patientToken;

  beforeAll(async () => {
    const docRes = await request(app).post("/api/doctors/add").send({
      name: "Stats Doctor",
      email: "stats.doc@test.com",
      phone: "9876501111",
      age: 50,
      specialization: ["General"],
      experience: 20,
      password: "password123",
      location: { city: "Pune", state: "MH" },
    });
    expect(docRes.status).toBe(201);
    doctor = docRes.body.doctor;

    const patRes = await request(app).post("/api/patients/add").send({
      name: "Stats Patient",
      email: "stats.pat@test.com",
      password: "password123",
    });
    expect(patRes.status).toBe(201);
    patientId = patRes.body.id;

    const docLogin = await request(app)
      .post("/api/login")
      .send({
        email: "stats.doc@test.com",
        password: "password123",
        role: "Doctor",
      });
    doctorToken = docLogin.body.token;

    const patLogin = await request(app)
      .post("/api/login")
      .send({
        email: "stats.pat@test.com",
        password: "password123",
        role: "Patient",
      });
    patientToken = patLogin.body.token;

    // Grant working hours so booking validation passes.
    for (const day of days) {
      const slot = await request(app)
        .post("/api/doctors/slots")
        .set("Authorization", `Bearer ${doctorToken}`)
        .send({
          doctorId: String(doctor._id),
          day,
          from: "09:00",
          to: "17:00",
        });
      expect(slot.status).toBe(200);
    }
  });

  const book = async (offsetDays, status = "Scheduled") => {
    const start = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const appt = await Appointment.create({
      doctorId: doctor._id,
      patientId,
      date: new Date(start.setHours(0, 0, 0, 0)),
      time: start,
      endTime: end,
      status,
      reason: "checkup",
    });
    return appt;
  };

  test("requires authentication", async () => {
    const res = await request(app).get("/api/stats/summary");
    expect(res.status).toBe(401);
  });

  test("returns real counts for a doctor", async () => {
    await book(2); // upcoming scheduled
    await book(5); // upcoming scheduled
    await book(-3, "Cancelled");
    await book(-1, "Completed");

    const res = await request(app)
      .get("/api/stats/summary")
      .set("Authorization", `Bearer ${doctorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.role).toBe("Doctor");
    expect(res.body.stats.scheduled).toBeGreaterThanOrEqual(2);
    expect(res.body.stats.cancelled).toBeGreaterThanOrEqual(1);
    // Consistency: every Scheduled appointment is either upcoming or pending.
    const totalScheduled = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: "Scheduled",
    });
    expect(res.body.stats.scheduled + res.body.stats.pending).toBe(
      totalScheduled
    );
  });

  test("returns real counts for a patient", async () => {
    const before = await Appointment.countDocuments({ patientId });
    const upcomingBefore = await Appointment.countDocuments({
      patientId,
      status: "Scheduled",
      time: { $gte: new Date() },
    });

    const res = await request(app)
      .get("/api/stats/summary")
      .set("Authorization", `Bearer ${patientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("Patient");
    expect(res.body.stats.upcoming).toBe(upcomingBefore);
    expect(res.body.stats.past).toBe(before - upcomingBefore);
    expect(typeof res.body.stats.reports).toBe("number");
  });

  test("patient past count includes overdue scheduled appointments", async () => {
    await book(-2); // scheduled but in the past -> counts as "past"

    const res = await request(app)
      .get("/api/stats/summary")
      .set("Authorization", `Bearer ${patientToken}`);

    const total = await Appointment.countDocuments({ patientId });
    const upcoming = await Appointment.countDocuments({
      patientId,
      status: "Scheduled",
      time: { $gte: new Date() },
    });
    expect(res.body.stats.upcoming).toBe(upcoming);
    expect(res.body.stats.past).toBe(total - upcoming);
  });
});
