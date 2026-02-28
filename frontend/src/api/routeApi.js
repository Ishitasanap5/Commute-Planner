
import api from "./axios";

export const createRoute = async (data) => {
  const response = await api.post("/routes", data);
  return response.data;
};

export const getUserRoutes = async () => {
  const response = await api.get("/routes");
  return response.data;
};

export const updateRoute = async (id, data) => {
  const response = await api.put(`/routes/${id}`, data);
  return response.data;
};

export const deleteRoute = async (id) => {
  const response = await api.delete(`/routes/${id}`);
  return response.data;
};

export const getRouteAnalytics = async () => {
  const response = await api.get("/routes/analytics");
  return response.data;
};