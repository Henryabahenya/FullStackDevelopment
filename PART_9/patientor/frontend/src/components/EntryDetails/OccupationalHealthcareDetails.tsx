import { Box, Typography } from "@mui/material";
import { OccupationalHealthcareEntry } from "../../types";
import { useDiagnoses } from "../../context/DiagnosesContext";

interface Props {
  entry: OccupationalHealthcareEntry;
}

const OccupationalHealthcareDetails: React.FC<Props> = ({ entry }) => {
  const { diagnoses } = useDiagnoses();

  const getDiagnosisDescription = (code: string): string => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  return (
    <Box>
      <Typography sx={{ marginTop: 1 }}>
        <strong>Type:</strong> Occupational Healthcare
      </Typography>
      <Typography sx={{ marginTop: 0.5 }}>
        <strong>Employer:</strong> {entry.employerName}
      </Typography>
      {entry.sickLeave && (
        <Typography sx={{ marginTop: 0.5 }}>
          <strong>Sick Leave:</strong> {entry.sickLeave.startDate} to{" "}
          {entry.sickLeave.endDate}
        </Typography>
      )}
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

export default OccupationalHealthcareDetails;
