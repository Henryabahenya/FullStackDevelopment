import axios from "axios";

export interface DiaryEntry {
  id: number;
  date: string;
  visibility: string;
  weather: string;
  comment?: string;
}

export interface NewDiaryEntry {
  date: string;
  visibility: string;
  weather: string;
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
