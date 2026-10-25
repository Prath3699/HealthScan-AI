const request = require("supertest");
const app = require("../server");
const Appointment = require("../model/appointmentSchema");

// Seed users through the real registration endpoints so passwords are
// bcrypt-hashed exactly like production (the schemas have no pre-save hook).
const seed = async () => {
  const docRes = await request(app).post("/api/doctors/add").send({
    name: "Slot Doctor",
    email: "slot.doc@test.com",
    phone: "9876543210",
    age: 45,
    specialization: ["General"],
    experience: 12,
    password: "password123",
    location: { city: "Pune", state: "MH" },
  });
  expect(docRes.status).toBe(201);
  const patRes = await request(app).post("/api/patients/add").send({
    name: "Slot Patient",
    email: "slot.pat@test.com",
    password: "password123",
  });
  expect(patRes.status).toBe(201);
  return { doctor: docRes.body.doctor, patientId: patRes.body.id };
};

// A doctor available Mon-Sun 09:00-17:00.
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const bookPayload = (doctor, patientId, fromIso, toIso) => ({
  doctorId: String(doctor._id),
  patientId: String(patientId),
  day: { from: fromIso },
  time: { from: fromIso, to: toIso },
  reason: "checkup",
});

describe("Appointments", () => {
  let doctor, patientId, token;

  beforeAll(async () => {
    ({ doctor, patientId } = await seed());
    const login = await request(app)
      .post("/api/login")
      .send({ email: "slot.doc@test.com", password: "password123", role: "Doctor" });
    token = login.body.token;
    // Grant the doctor Mon-Sun 09:00-17:00 working hours via their own session.
    for (const day of days) {
      const slot = await request(app)
        .post("/api/doctors/slots")
        .set("Authorization", `Bearer ${token}`)
        .send({ doctorId: String(doctor._id), day, from: "09:00", to: "17:00" });
      expect(slot.status).toBe(200);
    }
  });

  test("available slots are generated inside working hours", async () => {
    const res = await request(app)
      .get("/api/appointment/available-slots")
      .query({ doctorId: String(doctor._id), date: "2026-11-02" }); // Monday
    expect(res.status).toBe(200);
    expect(res.body.totalSlots).toBe(16); // 8h / 30min
    expect(res.body.availableCount).toBe(16);
    expect(res.body.dayOfWeek).toBe("Monday");
  });

  test("no slots on a non-working day", async () => {
    const limitedRes = await request(app).post("/api/doctors/add").send({
      name: "Weekday Only",
      email: "weekday@test.com",
      phone: "9876500000",
      age: 40,
      specialization: ["General"],
      experience: 5,
      password: "password123",
      location: { city: "Pune", state: "MH" },
    });
    expect(limitedRes.status).toBe(201);
    const login = await request(app)
      .post("/api/login")
      .send({ email: "weekday@test.com", password: "password123", role: "Doctor" });
    const slot = await request(app)
      .post("/api/doctors/slots")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ doctorId: String(limitedRes.body.doctor._id), day: "Monday", from: "09:00", to: "10:00" });
    expect(slot.status).toBe(200);
    const res = await request(app)
      .get("/api/appointment/available-slots")
      .query({ doctorId: String(limitedRes.body.doctor._id), date: "2026-11-03" }); // Tuesday
    expect(res.status).toBe(200);
    expect(res.body.availableSlots).toHaveLength(0);
  });

  test("booking requires authentication", async () => {
    const res = await request(app).post("/api/appointment/book").send({});
    expect(res.status).toBe(401);
  });

  test("valid booking succeeds and marks the slot taken", async () => {
    const from = new Date(Date.UTC(2026, 10, 2, 9, 30)).toISOString();
    const to = new Date(Date.UTC(2026, 10, 2, 10, 0)).toISOString();
    const res = await request(app)
      .post("/api/appointment/book")
      .set("Authorization", `Bearer ${token}`)
      .send(bookPayload(doctor, patientId, from, to));
    expect(res.status).toBe(201);
    expect(res.body.appointment.status).toBe("Scheduled");

    const slots = await request(app)
      .get("/api/appointment/available-slots")
      .query({ doctorId: String(doctor._id), date: "2026-11-02" });
    expect(slots.body.availableCount).toBe(15);
  });

  test("overlapping booking is rejected with 409", async () => {
    const from = new Date(Date.UTC(2026, 10, 2, 9, 45)).toISOString();
    const to = new Date(Date.UTC(2026, 10, 2, 10, 15)).toISOString();
    const res = await request(app)
      .post("/api/appointment/book")
      .set("Authorization", `Bearer ${token}`)
      .send(bookPayload(doctor, patientId, from, to));
    expect(res.status).toBe(409);
  });

  test("booking outside working hours is rejected with 400", async () => {
    const from = new Date(Date.UTC(2026, 10, 2, 19, 0)).toISOString();
    const to = new Date(Date.UTC(2026, 10, 2, 19, 30)).toISOString();
    const res = await request(app)
      .post("/api/appointment/book")
      .set("Authorization", `Bearer ${token}`)
      .send(bookPayload(doctor, patientId, from, to));
    expect(res.status).toBe(400);
  });

  test("invalid ids fail validation with 400", async () => {
    const res = await request(app)
      .post("/api/appointment/book")
      .set("Authorization", `Bearer ${token}`)
      .send({ doctorId: "bad", patientId: "bad", time: { from: "x", to: "y" }, day: { from: "z" } });
    expect(res.status).toBe(400);
  });

  test("third party cannot view or cancel an appointment", async () => {
    const appt = await Appointment.findOne({ doctorId: doctor._id });
    const strangerLogin = await request(app)
      .post("/api/patients/add")
      .send({ name: "Stranger", email: "stranger@test.com", password: "password123" });
    expect(strangerLogin.status).toBe(201);
    const stranger = await request(app)
      .post("/api/login")
      .send({ email: "stranger@test.com", password: "password123", role: "Patient" });

    const view = await request(app)
      .get(`/api/appointment/${appt._id}`)
      .set("Authorization", `Bearer ${stranger.body.token}`);
    expect(view.status).toBe(403);

    const del = await request(app)
      .delete(`/api/appointment/cancel/${appt._id}`)
      .set("Authorization", `Bearer ${stranger.body.token}`);
    expect(del.status).toBe(403);
  });

  test("involved user can view and cancel; cancel preserves history", async () => {
    const appt = await Appointment.findOne({ doctorId: doctor._id });
    const view = await request(app)
      .get(`/api/appointment/${appt._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(view.status).toBe(200);

    const del = await request(app)
      .delete(`/api/appointment/cancel/${appt._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(del.status).toBe(200);

    const fresh = await Appointment.findById(appt._id);
    expect(fresh.status).toBe("Cancelled"); // soft delete, not removed
  });

  test("day query returns appointments for the actor only", async () => {
    const patLogin = await request(app)
      .post("/api/login")
      .send({ email: "slot.pat@test.com", password: "password123", role: "Patient" });
    const res = await request(app)
      .get("/api/appointment/day")
      .query({ date: "2026-11-02" })
      .set("Authorization", `Bearer ${patLogin.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
    for (const a of res.body.appointments) {
      expect(String(a.patientId._id ?? a.patientId)).toBe(String(patientId));
    }
  });
});
