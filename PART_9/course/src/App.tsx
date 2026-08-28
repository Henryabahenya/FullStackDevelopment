import { useState, useEffect } from "react";
import {
  diaryService,
  type DiaryEntry,
  type NewDiaryEntry,
} from "./diaryService";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewDiaryEntry>({
    date: "",
    visibility: "good",
    weather: "sunny",
    comment: "",
  });

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

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.date) {
      setSubmitError("Please select a date");
      return;
    }

    try {
      setSubmitting(true);
      const newEntry = await diaryService.create(formData);
      setDiaries((prev) => [...prev, newEntry]);
      setFormData({
        date: "",
        visibility: "good",
        weather: "sunny",
        comment: "",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create diary entry";
      setSubmitError(errorMessage);
      console.error("Error creating diary entry:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Flight Diaries</h1>

      {/* Form Section */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #ddd",
        }}
      >
        <h2>Add New Entry</h2>
        {submitError && (
          <div
            style={{ color: "red", marginBottom: "15px", fontWeight: "bold" }}
          >
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="date"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              required
              style={{
                padding: "8px",
                width: "100%",
                maxWidth: "300px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Visibility:
            </label>
            <div style={{ display: "flex", gap: "15px" }}>
              {["great", "good", "ok", "poor"].map((visibility) => (
                <label
                  key={visibility}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={visibility}
                    checked={formData.visibility === visibility}
                    onChange={handleFormChange}
                  />
                  {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Weather:
            </label>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              {["sunny", "rainy", "cloudy", "stormy", "windy"].map(
                (weather) => (
                  <label
                    key={weather}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <input
                      type="radio"
                      name="weather"
                      value={weather}
                      checked={formData.weather === weather}
                      onChange={handleFormChange}
                    />
                    {weather.charAt(0).toUpperCase() + weather.slice(1)}
                  </label>
                ),
              )}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="comment"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Comment:
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleFormChange}
              placeholder="Optional comment about your flight..."
              rows={4}
              style={{
                padding: "8px",
                width: "100%",
                maxWidth: "500px",
                boxSizing: "border-box",
                fontFamily: "Arial, sans-serif",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
              fontSize: "16px",
            }}
          >
            {submitting ? "Submitting..." : "Add Entry"}
          </button>
        </form>
      </div>

      {/* Diaries List Section */}
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
