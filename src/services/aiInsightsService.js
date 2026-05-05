import axios from "../api/axiosInstance";

export const fetchAIInsights = async () => {
  try {
    const res = await axios.get("/api/ai-insights");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch AI insights:", error);
    return null;
  }
};
