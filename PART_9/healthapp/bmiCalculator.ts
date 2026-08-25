export const calculateBmi = (heightCm: number, weightKg: number): string => {
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

console.log(calculateBmi(180, 74));
