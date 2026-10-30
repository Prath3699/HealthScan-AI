const request = require("supertest");
const app = require("../server");
const Disease = require("../model/diseaseSchema");

describe("AI prediction endpoint (/api/predict)", () => {
  beforeAll(async () => {
    await Disease.deleteMany({});
    await Disease.create([
      {
        name: "Dengue Fever",
        description: "Mosquito-borne viral infection causing severe flu-like illness.",
        precautions: "Use repellents, remove stagnant water.",
        medication: "Paracetamol; avoid NSAIDs.",
        notes: "Stay hydrated, papaya leaf extract commonly recommended.",
        symptoms: ["fever", "headache", "myalgia", "rash", "eye pain"],
        spreadLevel: "High",
        affectedRegions: [
          { city: "Pune", state: "MH", country: "India", caseCount: 350 },
        ],
      },
      {
        name: "Malaria",
        description: "Parasitic disease transmitted by Anopheles mosquitoes.",
        precautions: "Sleep under nets, take prophylaxis in endemic areas.",
        medication: "Artemisinin-based combination therapy.",
        notes: "Light diet, plenty of fluids.",
        symptoms: ["fever", "chills", "headache", "fatigue", "nausea"],
        spreadLevel: "Moderate",
        affectedRegions: [{ city: "Kolkata", state: "WB", country: "India", caseCount: 120 }],
      },
      {
        name: "Gastroenteritis",
        description: "Inflammation of the stomach and intestines.",
        precautions: "Wash hands, drink boiled water.",
        medication: "ORS, zinc supplements.",
        notes: "BRAT diet.",
        symptoms: ["diarrhea", "vomiting", "abdominal pain", "fever"],
        spreadLevel: "Low",
        affectedRegions: [],
      },
    ]);
  });

  afterAll(async () => {
    await Disease.deleteMany({});
  });

  test("ranks matching diseases and returns full recommendation payload", async () => {
    const res = await request(app)
      .post("/api/predict")
      .send({
        patientName: "Ravi",
        patientAge: 29,
        diseaseDuration: 4,
        patientLocation: "Pune",
        patientSymptoms: "high fever, body pains, headache, red spots",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.predictions.length).toBeGreaterThan(0);

    const top = res.body.predictions[0];
    expect(top.name).toBe("Dengue Fever");
    expect(top.confidence).toBeGreaterThan(0);
    expect(top.description).toMatch(/Mosquito-borne/);
    expect(top.medication).toMatch(/Paracetamol/);
    expect(top.precautions).toMatch(/repellent/i);
    expect(top.matchedSymptoms.length).toBeGreaterThanOrEqual(3);
    // Synonym normalization: "high fever" -> fever, "body pains" -> myalgia,
    // "red spots" -> rash
    expect(res.body.input.normalizedSymptoms).toEqual(
      expect.arrayContaining(["fever", "myalgia", "rash"])
    );
    // Location-aware: Pune region surfaced for Dengue
    expect(top.nearbyAffectedRegions[0].city).toBe("Pune");
    expect(res.body.disclaimer).toMatch(/not a medical diagnosis/i);
  });

  test("tolerates typos via fuzzy matching", async () => {
    const res = await request(app)
      .post("/api/predict")
      .send({
        patientAge: 35,
        diseaseDuration: 2,
        patientSymptoms: "fevre, chils",
      });
    expect(res.status).toBe(200);
    expect(res.body.predictions[0].name).toBe("Malaria");
  });

  test("returns empty predictions (not an error) when nothing matches", async () => {
    const res = await request(app)
      .post("/api/predict")
      .send({
        patientAge: 8,
        diseaseDuration: 1,
        patientSymptoms: "hair turning green",
      });
    expect(res.status).toBe(200);
    expect(res.body.predictions).toEqual([]);
  });

  test("validates input: missing symptoms rejected with 400", async () => {
    const res = await request(app)
      .post("/api/predict")
      .send({ patientAge: 30, diseaseDuration: 3 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("validates input: out-of-range age rejected with 400", async () => {
    const res = await request(app)
      .post("/api/predict")
      .send({ patientAge: 200, diseaseDuration: 3, patientSymptoms: "fever" });
    expect(res.status).toBe(400);
  });

  test("works without authentication (public screening aid)", async () => {
    const res = await request(app)
      .post("/api/predict")
      .send({ patientAge: 40, diseaseDuration: 1, patientSymptoms: "fever" });
    expect(res.status).toBe(200);
  });
});
