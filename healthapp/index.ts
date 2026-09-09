import express from "express";
import { calculateBmi } from "./bmiCalculator.ts";
import { calculateExercises } from "./exerciseCalculator.ts";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight || Array.isArray(height) || Array.isArray(weight)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const h = Number(height);
  const w = Number(weight);

  if (isNaN(h) || isNaN(w)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(h, w);
  return res.json({ weight: w, height: h, bmi });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const body: any = req.body;

  if (!("daily_exercises" in body) || !("target" in body)) {
    return res.status(400).json({ error: "parameters missing" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const daily_exercises = body.daily_exercises;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const target = body.target;

  if (!Array.isArray(daily_exercises) || typeof target !== "number") {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  if (
    !daily_exercises.every(
      (exercise: unknown) => typeof exercise === "number" && !isNaN(exercise),
    )
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const result = calculateExercises(daily_exercises as number[], target);
  return res.json(result);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
