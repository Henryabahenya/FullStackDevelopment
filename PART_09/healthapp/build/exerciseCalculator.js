export function calculateExercises(dailyHours, target) {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter((h) => h > 0).length;
    const total = dailyHours.reduce((sum, h) => sum + h, 0);
    const average = total / periodLength;
    const success = average >= target;
    let rating;
    let ratingDescription;
    if (success) {
        rating = 3;
        ratingDescription = "great job, target met or exceeded";
    }
    else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = "not too bad but could be better";
    }
    else {
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
import { isNotNumber } from "./utils.js";
// CLI parsing and error handling
try {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        throw new Error("Provide target and at least one day of exercise hours");
    }
    const [targetArg, ...hoursArgs] = args;
    if (isNotNumber(targetArg)) {
        throw new Error("Target value is not a number");
    }
    const target = Number(targetArg);
    const dailyHours = hoursArgs.map((h) => {
        if (isNotNumber(h)) {
            throw new Error("All daily hour values must be numbers");
        }
        return Number(h);
    });
    console.log(calculateExercises(dailyHours, target));
}
catch (error) {
    let errorMessage = "Error: ";
    if (error instanceof Error) {
        errorMessage += error.message;
    }
    console.log(errorMessage);
}
