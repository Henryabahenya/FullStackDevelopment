import express from "express";
import cors from "cors";
import diagnoses from "./data/diagnoses";
import patients from "./data/patients";
import { getAllPatients } from "./data/patientService";
import { Patient, PublicPatient } from "./types";
import { v4 as uuidv4 } from "uuid";
import { toNewPatient } from "./utils";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  res.json({ message: "pong" });
});

app.get("/api/diagnoses", (_req, res) => {
  res.json(diagnoses);
});

app.get("/api/patients", (_req, res) => {
  const allPatients: PublicPatient[] = getAllPatients().map((patient) => {
    const { ssn, ...publicPatient } = patient;
    return publicPatient;
  });

  res.json(allPatients);
});

// Parsers and validation are handled in `src/utils.ts`

app.post("/api/patients", (req, res) => {
  try {
    const newPatientData = toNewPatient(req.body);

    const newPatient: Patient = {
      id: uuidv4(),
      ...newPatientData,
      entries: [],
    };

    patients.push(newPatient);

    res.status(201).json(newPatient);
  } catch (e: unknown) {
    let errorMessage = "Something went wrong.";
    if (e instanceof Error) {
      errorMessage += " " + e.message;
    }
    res.status(400).send({ error: errorMessage });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
