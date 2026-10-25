---

## 🩺 Medical Management System – Backend

This is a backend API for managing a medical system with support for doctors, patients, appointments, disease tracking, prescriptions (reports), and AI predictions.

---

### 📦 Technologies Used

* **Node.js**
* **Express.js**
* **MongoDB (Mongoose)**
* **RESTful API**
* **Postman** for testing

---

### 📁 Folder Structure

```
project-root/
│
├── controllers/       # Business logic (create patient, add slot, etc.)
├── models/            # Mongoose schemas (Doctor, Patient, Disease, etc.)
├── routes/            # API routes
├── config/            # DB connection, environment setup
├── app.js             # Express app setup
├── server.js          # Server startup
└── README.md          # Project documentation
```

---

### 🔌 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/medical-api-backend.git
cd medical-api-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

4. **Start the server**

```bash
npm run dev
```

---

### 🔗 API Endpoints

#### 👩‍⚕️ Doctor Routes

| Method | Route            | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/doctors/add`   | Register a doctor  |
| POST   | `/doctors/slots` | Add available slot |
| GET    | `/doctors/:id`   | Get doctor by ID   |

#### 🧑‍💼 Patient Routes

| Method | Route           | Description        |
| ------ | --------------- | ------------------ |
| POST   | `/patients`     | Register a patient |
| GET    | `/patients/:id` | Get patient by ID  |

#### 🧬 Disease Routes

| Method | Route       | Description                        |
| ------ | ----------- | ---------------------------------- |
| POST   | `/disease/add` | Create a new disease               |
| GET    | `/disease` | Get all diseases (with pagination) |
| DELETE | `/disease/delete` | Delete a disease (from body)       |

#### 📄 Report Routes

| Method | Route          | Description              |
| ------ | -------------- | ------------------------ |
| POST   | `/reports`     | Create medical report    |
| GET    | `/reports/:id` | Get report by patient ID |

#### 🤖 AI Prediction Routes

| Method | Route       | Description                                                                                     |
| ------ | ----------- | ----------------------------------------------------------------------------------------------- |
| POST   | `/predict`  | Symptom-based disease screening (public). Ranks the disease catalog with synonym normalization, fuzzy typo matching and location-aware spread info. Returns top-5 candidates with confidence %, description, medication, precautions and diet notes. No PHI is stored. |

Example request:

```json
POST /api/predict
{
  "patientName": "Ravi",
  "patientAge": 29,
  "diseaseDuration": 4,
  "patientLocation": "Pune",
  "patientSymptoms": "high fever, body pains, headache, red spots"
}
```

---

### 📦 Sample Data for Testing (Postman)

#### Disease Creation

```json
{
  "name": "Dengue",
  "symptoms": ["Fever", "Rash", "Headache"],
  "spreadLevel": "High",
  "affectedRegions": [
    {
      "city": "Delhi",
      "state": "Delhi",
      "country": "India",
      "coordinates": {
        "lat": 28.6139,
        "long": 77.209
      },
      "caseCount": 2500,
      "lastUpdated": "2025-07-10"
    }
  ]
}
```

---

### ✅ Features

* 🔒 Doctor and Patient registration
* 📅 Appointment scheduling
* 🩺 Disease tracking & regional spread
* 📃 Medical reports & prescriptions
* 🤖 AI symptom-based disease prediction (live: `POST /api/predict` + MedicalAI page)
* 📖 Pagination support for disease lists

---

### 🚀 Quick Start (Monorepo)

1. **Backend** (`backend/`)

   ```bash
   cd backend
   cp .env.example .env        # then edit MONGO_URL / JWT_SECRET
   npm install
   npm run dev                 # Express server on http://localhost:5000
   ```

2. **Frontend** (`frontend/`)

   ```bash
   cd frontend
   cp .env.example .env        # VITE_BACKEND_URL=http://localhost:5000
   npm install
   npm run dev                 # Vite dev server on http://localhost:5173
   ```

---

### 🧪 Testing

Automated Jest + Supertest integration tests run against an in-memory MongoDB:

```bash
cd backend
npm test
```

They cover password leakage, duplicate-email handling, request validation, login/token issuance, protected routes, and role-based access control. You can still use [Postman](https://www.postman.com/) or any REST client for manual testing.

Security notes:

* Password hashes are never returned by any API (Mongoose `select: false`).
* JWTs expire after `JWT_EXPIRES_IN` (default 2h) and are verified with role-based middleware.
* `helmet`, rate limiting, CORS allow-list (`CLIENT_URL`), and a centralized error handler are enabled.

---

### 📌 Future Improvements

* JWT-based authentication
* Role-based access (admin/doctor/patient)
* Admin dashboard (React)
* ML-based disease prediction model (currently rule/similarity engine; can be swapped behind `POST /api/predict`)

---

### 🤝 Contributing

Feel free to submit issues or pull requests. All suggestions are welcome!

---

### 📄 License

MIT License

---

