import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string().regex(dateRegex, "Invalid date format, expected YYYY-MM-DD"),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z
    .object({ date: z.string().regex(dateRegex), criteria: z.string() })
    .required(),
});

export const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().regex(dateRegex),
      endDate: z.string().regex(dateRegex),
    })
    .optional(),
});

export const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]),
});

export const EntryUnionSchema = z.union([
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
  HealthCheckEntrySchema,
]);

export type NewEntry = z.infer<typeof EntryUnionSchema>;
