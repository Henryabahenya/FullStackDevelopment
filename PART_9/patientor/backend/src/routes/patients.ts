import express, { Request, Response } from "express";
import patientData from "../patients";
import { Patient, NonSensitivePatient } from "../types";

const router = express.Router();

router.get("/", (_req: Request, res: Response<NonSensitivePatient[]>) => {
  const nonSensitivePatients: NonSensitivePatient[] = patientData.map(
    ({ ssn: _ssn, entries: _entries, ...rest }) => rest
  );
  res.send(nonSensitivePatients);
});

router.get("/:id", (req: Request, res: Response) => {
  const patient = patientData.find((p) => p.id === req.params.id);
  
  if (!patient) {
    return res.status(404).send({ error: "Patient not found" });
  }
  
  res.send(patient as Patient);
});

router.post("/", (req: Request, res: Response<Patient>) => {
  const newPatient: Patient = {
    id: String(Math.floor(Math.random() * 1000000)),
    ...req.body,
    entries: []
  };
  
  patientData.push(newPatient);
  res.json(newPatient);
});

export default router;
