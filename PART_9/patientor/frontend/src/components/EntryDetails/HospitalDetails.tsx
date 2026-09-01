import { Box, Typography } from "@mui/material";
import { HospitalEntry } from "../../types";
import { useDiagnoses } from "../../context/DiagnosesContext";

interface Props {
  entry: HospitalEntry;
}

const HospitalDetails: React.FC<Props> = ({ entry }) => {
  const { diagnoses } = useDiagnoses();

  const getDiagnosisDescription = (code: string): string => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  return (
    <Box>
      <Typography sx={{ marginTop: 1 }}>
        <strong>Type:</strong> Hospital
      </Typography>
      <Typography sx={{ marginTop: 0.5 }}>
        <strong>Discharge Date:</strong> {entry.discharge.date}
      </Typography>
      <Typography sx={{ marginTop: 0.5 }}>
        <strong>Discharge Criteria:</strong> {entry.discharge.criteria}
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

export default HospitalDetails;
