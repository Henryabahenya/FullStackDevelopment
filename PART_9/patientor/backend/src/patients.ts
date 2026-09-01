import { Patient, Gender } from "./types";

const patients: Patient[] = [
  {
    id: "d2773336-f723-11e9-8f0b-362b9e155667",
    name: "John Leslie",
    dateOfBirth: "1946-04-02",
    ssn: "050471-123N",
    gender: Gender.Male,
    occupation: "Houseman",
    entries: []
  },
  {
    id: "d2773598-f723-11e9-8f0b-362b9e155667",
    name: "Henry Conde",
    dateOfBirth: "1958-11-11",
    ssn: "070382-916L",
    gender: Gender.Male,
    occupation: "Nurse",
    entries: []
  },
  {
    id: "d27736a3-f723-11e9-8f0b-362b9e155667",
    name: "Mary Statham",
    dateOfBirth: "1953-04-25",
    ssn: "090389-122S",
    gender: Gender.Female,
    occupation: "CEO",
    entries: []
  }
];

export default patients;
