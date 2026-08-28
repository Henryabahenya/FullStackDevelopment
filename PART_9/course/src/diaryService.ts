import axios from "axios";

export type Visibility = "great" | "good" | "ok" | "poor";
export type Weather = "sunny" | "rainy" | "cloudy" | "stormy" | "windy";

export const VISIBILITY_OPTIONS: Visibility[] = ["great", "good", "ok", "poor"];
export const WEATHER_OPTIONS: Weather[] = [
  "sunny",
  "rainy",
  "cloudy",
  "stormy",
  "windy",
];

export interface DiaryEntry {
  id: number;
  date: string;
  visibility: Visibility;
  weather: Weather;
  comment?: string;
}

export interface NewDiaryEntry {
  date: string;
  visibility: Visibility;
  weather: Weather;
  comment?: string;
}

const BASE_URL = "http://localhost:3000/api/diaries";

export const diaryService = {
  getAll: async () => {
    const response = await axios.get<DiaryEntry[]>(BASE_URL);
    return response.data;
  },
  create: async (entry: NewDiaryEntry) => {
    const response = await axios.post<DiaryEntry>(BASE_URL, entry);
    return response.data;
  },
};
