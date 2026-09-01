import { Patient, Gender } from "./types";

const patients: Patient[] = [
  {
    id: "d2773336-f723-11e9-8f0b-362b9e155667",
    name: "John Leslie",
    dateOfBirth: "1946-04-02",
    ssn: "050471-123N",
    gender: Gender.Male,
    occupation: "Houseman",
    entries: [
      {
        id: "a1101c1f-6f50-40a5-a4eb-a7ad73dc8f49",
        type: "Hospital",
        date: "2024-01-15",
        specialist: "Dr. Sarah Johnson",
        description: "Hernia repair surgery",
        diagnosisCodes: ["K40.90"],
        discharge: {
          date: "2024-01-20",
          criteria:
            "Post-operative recovery normal, patient stable for discharge",
        },
      },
      {
        id: "a1101c1f-6f50-40a5-a4eb-a7ad73dc8f50",
        type: "OccupationalHealthcare",
        date: "2024-02-10",
        specialist: "Dr. James Wilson",
        description: "Annual occupational health check-up and immunization",
        employerName: "United Hospital",
        diagnosisCodes: ["Z00.00"],
      },
      {
        id: "a1101c1f-6f50-40a5-a4eb-a7ad73dc8f51",
        type: "HealthCheck",
        date: "2024-03-05",
        specialist: "Dr. Emma Garcia",
        description: "Regular health check-up",
        healthCheckRating: 2,
      },
    ],
  },
  {
    id: "d2773598-f723-11e9-8f0b-362b9e155667",
    name: "Henry Conde",
    dateOfBirth: "1958-11-11",
    ssn: "070382-916L",
    gender: Gender.Male,
    occupation: "Nurse",
    entries: [
      {
        id: "b1101c1f-6f50-40a5-a4eb-a7ad73dc8f49",
        type: "OccupationalHealthcare",
        date: "2024-02-15",
        specialist: "Dr. Michael Chang",
        description: "Back strain assessment and treatment plan",
        employerName: "City Hospital",
        diagnosisCodes: ["M54.5"],
        sickLeave: {
          startDate: "2024-02-15",
          endDate: "2024-02-28",
        },
      },
      {
        id: "b1101c1f-6f50-40a5-a4eb-a7ad73dc8f50",
        type: "HealthCheck",
        date: "2024-03-20",
        specialist: "Dr. Lisa Roberts",
        description: "Quarterly health check",
        healthCheckRating: 3,
      },
    ],
  },
  {
    id: "d27736a3-f723-11e9-8f0b-362b9e155667",
    name: "Mary Statham",
    dateOfBirth: "1953-04-25",
    ssn: "090389-122S",
    gender: Gender.Female,
    occupation: "CEO",
    entries: [
      {
        id: "c1101c1f-6f50-40a5-a4eb-a7ad73dc8f49",
        type: "Hospital",
        date: "2024-01-08",
        specialist: "Dr. David Anderson",
        description: "Cardiac investigation and treatment",
        diagnosisCodes: ["I10", "I25.9"],
        discharge: {
          date: "2024-01-14",
          criteria:
            "Stable condition, normal ECG findings, discharged with medications",
        },
      },
      {
        id: "c1101c1f-6f50-40a5-a4eb-a7ad73dc8f50",
        type: "OccupationalHealthcare",
        date: "2024-02-20",
        specialist: "Dr. Karen Lee",
        description: "Executive health screening",
        employerName: "Tech Solutions Inc.",
        diagnosisCodes: [],
      },
      {
        id: "c1101c1f-6f50-40a5-a4eb-a7ad73dc8f51",
        type: "HealthCheck",
        date: "2024-03-15",
        specialist: "Dr. John Smith",
        description: "Annual health check-up",
        healthCheckRating: 1,
      },
    ],
  },
];

export default patients;
