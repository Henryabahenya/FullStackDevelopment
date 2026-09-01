import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Patient } from "../../types";
import patientService from "../../services/patients";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          {patient.entries.length === 0 ? (
            <Typography>No entries</Typography>
          ) : (
            <Box>
              {patient.entries.map((_entry, index) => (
                <Box
                  key={index}
                  sx={{ marginTop: 1, padding: 1, backgroundColor: "#f5f5f5" }}
                >
                  Entry {index + 1}
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
