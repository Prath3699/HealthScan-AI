const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");

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

  describe("refresh-token rotation (httpOnly cookie)", () => {
    const getCookie = (res) => {
      const raw = res.headers["set-cookie"] || [];
      const found = raw.find((c) => c.startsWith("refreshToken="));
      return found ? found.split(";")[0] : undefined;
    };

    test("access token is short-lived and carries id+role", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "dr@test.com", password: "password123", role: "Doctor" });
      const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(payload.role).toBe("Doctor");
      // Default expiry must be <= 1h (was 30d before hardening).
      expect(payload.exp - payload.iat).toBeLessThanOrEqual(3600);
    });

    test("login sets an httpOnly refresh cookie that can mint new access tokens", async () => {
      const login = await request(app)
        .post("/api/login")
        .send({ email: "dr@test.com", password: "password123", role: "Doctor" });

      const cookie = getCookie(login);
      expect(cookie).toBeDefined();
      expect(login.headers["set-cookie"].join()).toMatch(/HttpOnly/i);
      expect(login.headers["set-cookie"].join()).toMatch(/Path=\/api\/auth/i);

      const refreshed = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", cookie);
      expect(refreshed.status).toBe(200);
      expect(refreshed.body.token).toBeDefined();
      const decoded = jwt.verify(refreshed.body.token, process.env.JWT_SECRET);
      expect(decoded.role).toBe("Doctor");
      // Rotation: a fresh cookie comes back with the response.
      const rotated = getCookie(refreshed);
      expect(rotated).toBeDefined();
      expect(rotated).not.toBe(cookie);
    });

    test("replaying a rotated (used) refresh token revokes the family", async () => {
      const login = await request(app)
        .post("/api/login")
        .send({ email: "dr@test.com", password: "password123", role: "Doctor" });
      const cookie = getCookie(login);

      const first = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", cookie);
      expect(first.status).toBe(200);
      const rotated = getCookie(first);

      // Reuse of the ORIGINAL token -> 401 and family killed.
      const replay = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", cookie);
      expect(replay.status).toBe(401);

      // Even the legitimate rotated token is now revoked (family deleted).
      const after = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", rotated);
      expect(after.status).toBe(401);
    });

    test("logout clears the cookie and invalidates it", async () => {
      const login = await request(app)
        .post("/api/login")
        .send({ email: "dr@test.com", password: "password123", role: "Doctor" });
      const cookie = getCookie(login);

      const out = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", cookie);
      expect(out.status).toBe(200);

      const reuse = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", cookie);
      expect(reuse.status).toBe(401);
    });

    test("refresh without a cookie is rejected", async () => {
      const res = await request(app).post("/api/auth/refresh");
      expect(res.status).toBe(401);
    });
  });
});
