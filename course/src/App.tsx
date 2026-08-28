import { useState, useEffect } from "react";
import axios from "axios";
import {
  diaryService,
  type DiaryEntry,
  type NewDiaryEntry,
  type Visibility,
  type Weather,
  VISIBILITY_OPTIONS,
  WEATHER_OPTIONS,
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

  // Auto-clear submit error after 5 seconds
  useEffect(() => {
    if (submitError) {
      const timer = setTimeout(() => {
        setSubmitError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitError]);

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

  const handleVisibilityChange = (visibility: Visibility) => {
    setFormData((prev) => ({
      ...prev,
      visibility,
    }));
  };

  const handleWeatherChange = (weather: Weather) => {
    setFormData((prev) => ({
      ...prev,
      weather,
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
      let errorMessage = "Failed to create diary entry";

      // Check if the error is an Axios error with a response
      if (axios.isAxiosError(err) && err.response?.data) {
        const respData = err.response.data;
        // Extract error message from backend response
        if (typeof respData === "string") {
          errorMessage = respData;
        } else if (
          respData &&
          typeof respData === "object" &&
          "message" in respData
        ) {
          errorMessage = (respData as { message: string }).message;
        } else if (
          respData &&
          typeof respData === "object" &&
          "error" in respData
        ) {
          errorMessage = (respData as { error: string }).error;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

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
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "12px 15px",
              marginBottom: "15px",
              borderRadius: "4px",
              border: "1px solid #f5c6cb",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>⚠️ {submitError}</span>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#721c24",
                padding: "0",
                marginLeft: "10px",
              }}
            >
              ×
            </button>
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
              {VISIBILITY_OPTIONS.map((visibility) => (
                <label
                  key={visibility}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={visibility}
                    checked={formData.visibility === visibility}
                    onChange={() => handleVisibilityChange(visibility)}
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
              {WEATHER_OPTIONS.map((weather) => (
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
                    onChange={() => handleWeatherChange(weather)}
                  />
                  {weather.charAt(0).toUpperCase() + weather.slice(1)}
                </label>
              ))}
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
