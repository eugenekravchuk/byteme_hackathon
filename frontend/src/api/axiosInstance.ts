import axios from "axios";
import { refreshAccessToken } from "./auth";

// const api = axios.create({
//   baseURL: "https://access-compass-django.onrender.com/api",
// });
const api = axios.create({
  baseURL: "https://access-compass-django.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const { access } = await refreshAccessToken(refreshToken);

        localStorage.setItem("access_token", access);

        api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        originalRequest.headers["Authorization"] = `Bearer ${access}`;

        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token expired");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
