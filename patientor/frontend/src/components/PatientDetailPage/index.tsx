import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Alert } from "@mui/material";
import { Patient, Entry } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "../EntryDetails";
import AddHealthCheckEntryForm from "../AddHealthCheckEntryForm";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        try {
          const data = await patientService.getById(id);
          setPatient(data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch patient data");
          console.error(err);
        }
      };
      void fetchPatient();
    }
  }, [id]);

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate("/")} variant="contained">
          Go Back
        </Button>
      </Box>
    );
  }

  if (!patient) {
    return <Typography>Loading patient details...</Typography>;
  }

  return (
    <Box sx={{ marginTop: 2 }}>
      <Button
        onClick={() => navigate("/")}
        variant="contained"
        sx={{ marginBottom: 2 }}
      >
        Back to Patients
      </Button>

      <Box sx={{ border: "1px solid #ccc", padding: 2, borderRadius: 1 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          {patient.name}
        </Typography>

        <Typography>
          <strong>Gender:</strong> {patient.gender}
        </Typography>

        <Typography>
          <strong>Occupation:</strong> {patient.occupation}
        </Typography>

        {patient.dateOfBirth && (
          <Typography>
            <strong>Date of Birth:</strong> {patient.dateOfBirth}
          </Typography>
        )}

        {patient.ssn && (
          <Typography>
            <strong>SSN:</strong> {patient.ssn}
          </Typography>
        )}

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Entries</Typography>
          <Button
            variant="outlined"
            sx={{ mt: 1, mb: 1 }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide entry form" : "Add HealthCheck Entry"}
          </Button>

          {showForm && (
            <Box>
              {formError && <Alert severity="error">{formError}</Alert>}
              <AddHealthCheckEntryForm
                onCancel={() => {
                  setShowForm(false);
                  setFormError(null);
                }}
                onSubmit={async (newEntry) => {
                  if (!patient) return;
                  try {
                    setFormError(null);
                    const created = await patientService.addEntry(
                      patient.id,
                      newEntry as Entry,
                    );
                    setPatient({
                      ...patient,
                      entries: patient.entries.concat(created),
                    });
                    setShowForm(false);
                  } catch (e: unknown) {
                    const msg =
                      (e as any)?.response?.data ||
                      (e as any)?.message ||
                      "Error adding entry";
                    setFormError(String(msg));
                  }
                }}
              />
            </Box>
          )}

          {patient.entries.length === 0 ? (
            <Typography>No entries</Typography>
          ) : (
            <Box sx={{ marginTop: 1 }}>
              {patient.entries.map((entry) => (
                <Box
                  key={entry.id}
                  sx={{
                    marginTop: 2,
                    padding: 2,
                    backgroundColor: "#f5f5f5",
                    borderLeft: "4px solid #1976d2",
                  }}
                >
                  <Typography>
                    <strong>{entry.date}</strong> - {entry.description}
                  </Typography>
                  <Typography sx={{ marginTop: 1 }}>
                    <strong>Specialist:</strong> {entry.specialist}
                  </Typography>
                  <EntryDetails entry={entry} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PatientDetailPage;
