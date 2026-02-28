
import api from "./axios";

export const getLiveComparison = async (data) => {
  const response = await api.post("/comparison/live", data);
  return response.data;
};