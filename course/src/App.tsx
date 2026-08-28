import { useState, useEffect } from "react";
import { diaryService, type DiaryEntry } from "./diaryService";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const data = await diaryService.getAll();
        setDiaries(data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch diaries";
        setError(errorMessage);
        console.error("Error fetching diaries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Flight Diaries</h1>

      {loading && <p>Loading diaries...</p>}

      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>Error: {error}</div>
      )}

      {!loading && diaries.length === 0 && !error && <p>No diaries found.</p>}

      {!loading && diaries.length > 0 && (
        <div>
          <div style={{ display: "grid", gap: "20px" }}>
            {diaries.map((diary) => (
              <div
                key={diary.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h3>{diary.date}</h3>
                <div>
                  <p>
                    <strong>Visibility:</strong> {diary.visibility}
                  </p>
                  <p>
                    <strong>Weather:</strong> {diary.weather}
                  </p>
                  {diary.comment && (
                    <p>
                      <strong>Comment:</strong> {diary.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
