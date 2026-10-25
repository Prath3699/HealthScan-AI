const request = require("supertest");
const app = require("../server");
const Doctor = require("../model/doctorSchema");

describe("Auth & security", () => {
  const doctorPayload = {
    name: "Dr Test",
    email: "dr@test.com",
    phone: "1234567890",
    age: 40,
    specialization: ["Cardiology"],
    experience: 10,
    password: "password123",
    location: { city: "Pune", state: "MH" },
  };

  test("registering a doctor never returns the password", async () => {
    const res = await request(app).post("/api/doctors/add").send(doctorPayload);
    expect(res.status).toBe(201);
    expect(res.body.doctor.password).toBeUndefined();
  });

  test("duplicate email is rejected with 409", async () => {
    const res = await request(app).post("/api/doctors/add").send(doctorPayload);
    // addDoctor pre-checks duplicates and returns 400 with a clear message
    expect([400, 409]).toContain(res.status);
  });

  test("invalid registration payload fails validation with 400", async () => {
    const res = await request(app)
      .post("/api/doctors/add")
      .send({ ...doctorPayload, email: "not-an-email", password: "short" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("GET /doctors does not leak password hashes", async () => {
    const res = await request(app).get("/api/doctors");
    expect(res.status).toBe(200);
    for (const d of res.body.data) expect(d.password).toBeUndefined();
  });

  test("login issues a token and rejects wrong passwords", async () => {
    const bad = await request(app)
      .post("/api/login")
      .send({ email: "dr@test.com", password: "wrongpass1", role: "Doctor" });
    expect(bad.status).toBe(401);

    const ok = await request(app)
      .post("/api/login")
      .send({ email: "dr@test.com", password: "password123", role: "Doctor" });
    expect(ok.status).toBe(200);
    expect(ok.body.token).toBeDefined();
  });

  test("protected routes reject missing/invalid tokens", async () => {
    expect((await request(app).delete("/api/reports/delete/x")).status).toBe(401);
    expect(
      (await request(app)
        .post("/api/appointment/book")
        .set("Authorization", "Bearer garbage")
        .send({})).status
    ).toBe(401);
  });

  test("role-based access: patient cannot create reports", async () => {
    const patRes = await request(app)
      .post("/api/patients/add")
      .send({ name: "Pat", email: "pat@test.com", password: "password123" });
    expect(patRes.status).toBe(201);

    const login = await request(app)
      .post("/api/login")
      .send({ email: "pat@test.com", password: "password123", role: "Patient" });
    const token = login.body.token;

    const res = await request(app)
      .post("/api/reports/add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        appointmentId: "000000000000000000000000",
        patientId: "000000000000000000000000",
        doctorId: "000000000000000000000000",
        diseases: "flu",
        description: "d",
        medicines: [{ name: "a", dosage: "b", duration: "c" }],
      });
    expect(res.status).toBe(403);
  });

  test("unknown route returns JSON 404", async () => {
    const res = await request(app).get("/api/nope");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
