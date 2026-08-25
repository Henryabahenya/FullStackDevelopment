export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export function calculateExercises(
  dailyHours: number[],
  target: number,
): Result {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((h) => h > 0).length;
  const total = dailyHours.reduce((sum, h) => sum + h, 0);
  const average = total / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (success) {
    rating = 3;
    ratingDescription = "great job, target met or exceeded";
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "you need to work harder";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}

// Hard-coded test execution
const sampleInput = [3, 0, 2, 4.5, 0, 3, 1];
const sampleTarget = 2;
console.log(calculateExercises(sampleInput, sampleTarget));
