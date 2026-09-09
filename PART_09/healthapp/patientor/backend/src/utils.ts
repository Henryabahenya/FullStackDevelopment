import { z } from "zod";
import { Gender, NewPatient } from "./types";

export const patientSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid dateOfBirth",
  }),
  ssn: z.string().min(1),
  gender: z.enum([Gender.Male, Gender.Female, Gender.Other]),
  occupation: z.string().min(1),
});

export const parseNewPatient = (input: unknown): NewPatient => {
  const parsed = patientSchema.parse(input);
  return {
    name: parsed.name,
    dateOfBirth: parsed.dateOfBirth,
    ssn: parsed.ssn,
    gender: parsed.gender,
    occupation: parsed.occupation,
  };
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: unknown): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name");
  }
  return name;
};

const parseDateOfBirth = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing dateOfBirth");
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Incorrect or missing ssn");
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender");
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }
  return occupation;
};

export const toNewPatientEntry = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Patient data is missing");
  }

  const candidate = object as Record<string, unknown>;

  return {
    name: parseName(candidate.name),
    dateOfBirth: parseDateOfBirth(candidate.dateOfBirth),
    ssn: parseSsn(candidate.ssn),
    gender: parseGender(candidate.gender),
    occupation: parseOccupation(candidate.occupation),
  };
};

export const toNewPatient = (object: unknown): NewPatient => {
  return toNewPatientEntry(object);
};

export { isString, isDate, isGender };
