const Disease = require("../model/diseaseSchema");

// --- Symptom text normalization -----------------------------------------
// Maps common free-text symptom phrases to canonical tokens so that a
// patient typing "high fever and bad headaches" matches catalog entries
// listing "fever" / "headache".
const SYNONYMS = {
  "high temperature": "fever",
  "elevated temperature": "fever",
  "very high fever": "fever",
  "high fever": "fever",
  "mild fever": "fever",
  "stomach ache": "abdominal pain",
  "stomach pain": "abdominal pain",
  "belly pain": "abdominal pain",
  "tummy ache": "abdominal pain",
  "running nose": "rhinorrhea",
  "runny nose": "rhinorrhea",
  "nasal congestion": "rhinorrhea",
  "stuffy nose": "rhinorrhea",
  "body pains": "myalgia",
  "muscle pain": "myalgia",
  "muscle aches": "myalgia",
  "aching muscles": "myalgia",
  "joint pains": "arthralgia",
  "joint pain": "arthralgia",
  "shortness of breath": "dyspnea",
  "difficulty breathing": "dyspnea",
  "breathlessness": "dyspnea",
  "lack of breath": "dyspnea",
  "diarrhoea": "diarrhea",
  "throwing up": "vomiting",
  "nauseousness": "nausea",
  "feeling sick": "nausea",
  "head pains": "headache",
  "migraine": "headache",
  "sore throat": "pharyngitis",
  "throat pain": "pharyngitis",
  "itching": "pruritus",
  "rashes": "rash",
  "skin rash": "rash",
  "red spots": "rash",
  "weight loss": "weight-loss",
  "loss of weight": "weight-loss",
  "extreme fatigue": "fatigue",
  "tiredness": "fatigue",
  "exhaustion": "fatigue",
  "chill": "chills",
  "shivering": "chills",
  "rigors": "chills",
  "coughing": "cough",
  "dry cough": "cough",
};

// Split raw symptoms into normalized, lower-case tokens.
const normalizeSymptoms = (raw) => {
  if (!raw) return [];
  const parts = String(raw)
    .toLowerCase()
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const tokens = [];
  for (const part of parts) {
    // Try longest synonym phrase first (e.g. "shortness of breath").
    let matched = null;
    for (const [phrase, canonical] of Object.entries(SYNONYMS)) {
      if (part === phrase || part.includes(phrase)) {
        matched = canonical;
        break;
      }
    }
    tokens.push(matched || part.replace(/\s+/g, "-"));
  }
  return [...new Set(tokens)];
};

// Levenshtein distance for fuzzy matching (symptom typos like "fevre").
const editDistance = (a, b) => {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 3) return Math.max(m, n); // quick reject
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
};

// Score how well one query token matches one catalog symptom (0..1).
const tokenScore = (query, catalogSymptom) => {
  const c = catalogSymptom.toLowerCase().replace(/\s+/g, "-");
  if (c === query) return 1;
  if (c.includes(query) || query.includes(c)) {
    // Substring match – scale by relative length so exact beats partial.
    return 0.75;
  }
  const maxLen = Math.max(query.length, c.length);
  const dist = editDistance(query, c);
  if (dist <= 2 && dist / maxLen <= 0.34) {
    return 0.6; // fuzzy typo tolerance
  }
  return 0;
};

// Jaccard-style weighted score between patient symptoms and a disease entry.
const scoreDisease = (queryTokens, disease) => {
  const symptoms = disease.symptoms || [];
  if (!queryTokens.length || !symptoms.length) return 0;

  // For each query token keep its best match against this disease's symptoms.
  let matchedWeight = 0;
  const matchedNames = [];
  for (const q of queryTokens) {
    let best = 0;
    let bestName = null;
    for (const s of symptoms) {
      const sc = tokenScore(q, s);
      if (sc > best) {
        best = sc;
        bestName = s;
      }
    }
    if (best > 0) {
      matchedWeight += best;
      matchedNames.push(bestName);
    }
  }

  const coverage = matchedWeight / queryTokens.length; // how many symptoms explained
  const specificity = matchedWeight / symptoms.length; // how much of the disease profile hit
  // F1-like blend, then dampen by spread level risk (High-risk diseases
  // surface slightly higher when evidence is comparable).
  const base = 2 * coverage * specificity / Math.max(coverage + specificity, 1e-9);
  const spreadBoost =
    disease.spreadLevel === "High" ? 1.05 : disease.spreadLevel === "Moderate" ? 1.02 : 1;
  return {
    score: Math.min(base * spreadBoost, 1),
    coverage,
    matchedSymptoms: matchedNames,
  };
};

/**
 * POST /api/predict
 * Public endpoint (no PHI stored): given symptoms + demographics, rank the
 * disease catalog and return top candidate diagnoses with description,
 * medication, precautions, diet notes and a nearby-spread summary.
 */
const predictDisease = async (req, res) => {
  const { patientName, patientAge, diseaseDuration, patientLocation, patientSymptoms } = req.body;

  const age = Number(patientAge);
  const duration = Number(diseaseDuration);

  if (!Number.isInteger(age) || age < 0 || age > 130) {
    return res.status(400).json({ success: false, message: "patientAge must be a number between 0 and 130." });
  }
  if (!Number.isFinite(duration) || duration < 0 || duration > 3650) {
    return res.status(400).json({ success: false, message: "diseaseDuration must be a non-negative number (days)." });
  }

  const queryTokens = normalizeSymptoms(patientSymptoms);
  if (!queryTokens.length) {
    return res.status(400).json({ success: false, message: "At least one symptom is required." });
  }

  const diseases = await Disease.find().lean();
  if (!diseases.length) {
    return res.status(200).json({
      success: true,
      predictions: [],
      message: "The disease catalog is empty. Ask a doctor to add disease entries first.",
    });
  }

  const scored = diseases
    .map((d) => {
      const { score, coverage, matchedSymptoms } = scoreDisease(queryTokens, d);
      const location = String(patientLocation || "").trim().toLowerCase();
      const affectedRegions = (d.affectedRegions || []).filter((r) => {
        if (!location) return false;
        const regionText = `${r.city || ""} ${r.state || ""} ${r.country || ""}`.toLowerCase();
        return regionText.includes(location) || location.includes((r.city || "~").toLowerCase());
      });
      return {
        diseaseId: d._id,
        name: d.name,
        confidence: Number((score * 100).toFixed(1)),
        description: d.description || "",
        medication: d.medication || "",
        precautions: d.precautions || "",
        dietNotes: d.notes || "",
        workflow: d.workflow || "",
        spreadLevel: d.spreadLevel || "Low",
        matchedSymptoms: matchedSymptoms.filter(Boolean),
        coverage: Number((coverage * 100).toFixed(1)),
        nearbyAffectedRegions: affectedRegions.map((r) => ({
          city: r.city,
          state: r.state,
          country: r.country,
          caseCount: r.caseCount,
        })),
      };
    })
    .filter((p) => p.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  return res.status(200).json({
    success: true,
    input: {
      patientName: String(patientName || "").trim(),
      patientAge: age,
      diseaseDuration: duration,
      patientLocation: String(patientLocation || "").trim(),
      normalizedSymptoms: queryTokens,
    },
    predictions: scored,
    disclaimer:
      "This is an automated screening aid based on recorded symptoms only. It is not a medical diagnosis. Consult a qualified doctor before taking any medication.",
  });
};

module.exports = { predictDisease, normalizeSymptoms };
