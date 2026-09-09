import { isNotNumber } from "./utils.ts";

export function calculateBmi(heightCm: number, weightKg: number): string {
  const heightInMeters = heightCm / 100;
  const bmi = weightKg / (heightInMeters * heightInMeters);

  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi >= 18.5 && bmi <= 24.9) {
    return "Normal range";
  }

  if (bmi >= 25 && bmi <= 29.9) {
    return "Overweight";
  }

  return "Obese";
}

// CLI execution only when this file is run directly
const getCurrentFilePath = (): string => {
  if (typeof import.meta.filename === "string") {
    return import.meta.filename;
  }
  return new URL(import.meta.url).pathname;
};

const entryFile = getCurrentFilePath();
if (process.argv[1] === entryFile) {
  try {
    const args = process.argv.slice(2);
    if (args.length < 2) {
      throw new Error("Provide height (cm) and weight (kg) as arguments");
    }

    const [heightArg, weightArg] = args;
    if (isNotNumber(heightArg) || isNotNumber(weightArg)) {
      throw new Error("Provided values were not numbers");
    }

    const height = Number(heightArg);
    const weight = Number(weightArg);

    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = "Error: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}
