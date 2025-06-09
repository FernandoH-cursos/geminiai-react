import axios from 'axios';

const geminiApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_GEMINI_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default geminiApi;