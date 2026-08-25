import { isNotNumber } from "./utils.js";
export const calculateBmi = (heightCm, weightKg) => {
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
};
// CLI parsing and error handling
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
}
catch (error) {
    let errorMessage = "Error: ";
    if (error instanceof Error) {
        errorMessage += error.message;
    }
    console.log(errorMessage);
}
