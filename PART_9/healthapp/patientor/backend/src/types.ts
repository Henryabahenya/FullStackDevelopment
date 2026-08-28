export type Gender = string;

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: unknown[];
};

export type PublicPatient = Omit<Patient, "ssn">;
export type NewPatient = Omit<Patient, "id" | "entries">;
