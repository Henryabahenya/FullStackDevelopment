import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Diagnosis } from "../types";
import diagnosesService from "../services/diagnoses";

interface DiagnosesContextType {
  diagnoses: Diagnosis[];
  loading: boolean;
}

const DiagnosesContext = createContext<DiagnosesContextType | undefined>(
  undefined,
);

export const DiagnosesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const data = await diagnosesService.getAll();
        setDiagnoses(data);
      } catch (error) {
        console.error("Failed to fetch diagnoses:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchDiagnoses();
  }, []);

  return (
    <DiagnosesContext.Provider value={{ diagnoses, loading }}>
      {children}
    </DiagnosesContext.Provider>
  );
};

export const useDiagnoses = () => {
  const context = useContext(DiagnosesContext);
  if (!context) {
    throw new Error("useDiagnoses must be used within DiagnosesProvider");
  }
  return context;
};
