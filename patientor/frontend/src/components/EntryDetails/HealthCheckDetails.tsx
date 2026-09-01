import { Box, Typography } from "@mui/material";
import { HealthCheckEntry } from "../../types";
import { useDiagnoses } from "../../context/DiagnosesContext";

interface Props {
  entry: HealthCheckEntry;
}

const HealthCheckDetails: React.FC<Props> = ({ entry }) => {
  const { diagnoses } = useDiagnoses();

  const getDiagnosisDescription = (code: string): string => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  const getRatingColor = (rating: number): string => {
    switch (rating) {
      case 0:
        return "#31a049";
      case 1:
        return "#ffc400";
      case 2:
        return "#ff9800";
      case 3:
        return "#d32f2f";
      default:
        return "#757575";
    }
  };

  const getRatingLabel = (rating: number): string => {
    switch (rating) {
      case 0:
        return "Excellent";
      case 1:
        return "Good";
      case 2:
        return "Fair";
      case 3:
        return "Poor";
      default:
        return "Unknown";
    }
  };

  return (
    <Box>
      <Typography sx={{ marginTop: 1 }}>
        <strong>Type:</strong> Health Check
      </Typography>
      <Typography sx={{ marginTop: 0.5 }}>
        <strong>Health Rating:</strong>{" "}
        <span style={{ color: getRatingColor(entry.healthCheckRating) }}>
          ●
        </span>{" "}
        {getRatingLabel(entry.healthCheckRating)} ({entry.healthCheckRating})
      </Typography>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <Box sx={{ marginTop: 1 }}>
          <Typography sx={{ marginBottom: 0.5 }}>
            <strong>Diagnosis Codes:</strong>
          </Typography>
          <ul style={{ marginTop: 0.5, marginBottom: 0 }}>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>
                {code}: {getDiagnosisDescription(code)}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default HealthCheckDetails;
