import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Entry } from "../../types";
import { useDiagnoses } from "../../context/DiagnosesContext";

type NewEntry = Omit<Entry, "id">;

interface Props {
  onSubmit: (entry: NewEntry) => Promise<void> | void;
  onCancel: () => void;
}

const AddHealthCheckEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [entryType, setEntryType] = useState<
    "HealthCheck" | "OccupationalHealthcare" | "Hospital"
  >("HealthCheck");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const { diagnoses } = useDiagnoses();
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  // Occupational fields
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  // Hospital fields
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleTypeChange = (e: SelectChangeEvent) => {
    setEntryType(e.target.value as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const diagnosisCodes = selectedCodes;

    let entry: NewEntry;

    if (entryType === "HealthCheck") {
      entry = {
        type: "HealthCheck",
        date,
        description,
        specialist,
        healthCheckRating: typeof rating === "number" ? rating : 0,
        ...(diagnosisCodes.length > 0 ? { diagnosisCodes } : {}),
      } as NewEntry;
    } else if (entryType === "OccupationalHealthcare") {
      entry = {
        type: "OccupationalHealthcare",
        date,
        description,
        specialist,
        employerName,
        ...(sickLeaveStart && sickLeaveEnd
          ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } }
          : {}),
        ...(diagnosisCodes.length > 0 ? { diagnosisCodes } : {}),
      } as NewEntry;
    } else {
      // Hospital
      entry = {
        type: "Hospital",
        date,
        description,
        specialist,
        discharge: {
          date: dischargeDate,
          criteria: dischargeCriteria,
        },
        ...(diagnosisCodes.length > 0 ? { diagnosisCodes } : {}),
      } as NewEntry;
    }

    try {
      setSubmitting(true);
      await onSubmit(entry);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="entry-type-label">Entry Type</InputLabel>
        <Select
          labelId="entry-type-label"
          label="Entry Type"
          value={entryType}
          onChange={handleTypeChange}
        >
          <MenuItem value={"HealthCheck"}>HealthCheck</MenuItem>
          <MenuItem value={"OccupationalHealthcare"}>
            OccupationalHealthcare
          </MenuItem>
          <MenuItem value={"Hospital"}>Hospital</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Specialist"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />

      {entryType === "HealthCheck" && (
        <TextField
          select
          label="Health Check Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          <MenuItem value={0}>0 — Healthy</MenuItem>
          <MenuItem value={1}>1 — Low Risk</MenuItem>
          <MenuItem value={2}>2 — High Risk</MenuItem>
          <MenuItem value={3}>3 — Critical Risk</MenuItem>
        </TextField>
      )}

      {entryType === "OccupationalHealthcare" && (
        <>
          <TextField
            label="Employer Name"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Sick Leave Start"
            type="date"
            value={sickLeaveStart}
            onChange={(e) => setSickLeaveStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Sick Leave End"
            type="date"
            value={sickLeaveEnd}
            onChange={(e) => setSickLeaveEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 2 }}
          />
        </>
      )}

      {entryType === "Hospital" && (
        <>
          <TextField
            label="Discharge Date"
            type="date"
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Discharge Criteria"
            value={dischargeCriteria}
            onChange={(e) => setDischargeCriteria(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
        </>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          multiple
          value={selectedCodes}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCodes(
              typeof value === "string"
                ? value.split(",")
                : (value as string[]),
            );
          }}
          renderValue={(selected) => (selected as string[]).join(", ")}
          label="Diagnosis Codes"
        >
          {diagnoses.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              <Checkbox checked={selectedCodes.indexOf(d.code) > -1} />
              <ListItemText primary={`${d.code}: ${d.name}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button type="submit" variant="contained" disabled={submitting}>
          Add
        </Button>
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddHealthCheckEntryForm;
