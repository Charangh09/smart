import axiosClient from "./axiosClient";

export const signupApi = async (payload) => {
  const response = await axiosClient.post("/auth/signup", payload);
  return response.data;
};

export const loginApi = async (payload) => {
  const response = await axiosClient.post("/auth/login", payload);
  return response.data;
};
