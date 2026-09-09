import express, { Request, Response } from "express";
import diagnosesData from "../diagnoses";
import { Diagnosis } from "../types";

const router = express.Router();

router.get("/", (_req: Request, res: Response<Diagnosis[]>) => {
  res.send(diagnosesData);
});

export default router;
