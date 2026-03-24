import axiosClient from "./axiosClient";

export const getTasksApi = async (query) => {
  const response = await axiosClient.get("/tasks", { params: query });
  return response.data;
};

export const createTaskApi = async (payload) => {
  const response = await axiosClient.post("/tasks", payload);
  return response.data;
};

export const updateTaskApi = async (taskId, payload) => {
  const response = await axiosClient.put(`/tasks/${taskId}`, payload);
  return response.data;
};

export const deleteTaskApi = async (taskId) => {
  const response = await axiosClient.delete(`/tasks/${taskId}`);
  return response.data;
};

export const getAnalyticsApi = async () => {
  const response = await axiosClient.get("/tasks/analytics/summary");
  return response.data;
};
