import axios from "axios";

// const API_URL = "https://access-compass-django.onrender.com/api";
const API_URL = "https://access-compass-django.onrender.com/api";

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match?.[2];
}

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/token/`, {
    username,
    password,
  });
  return response.data; // contains access and refresh tokens
};

export const register = async (
  username: string,
  password: string,
  email: string
) => {
  const response = await axios.post(
    `${API_URL}/users/register/`,
    {
      username,
      password,
      email,
      is_special_user: false,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFTOKEN": "",
      },
      withCredentials: false,
    }
  );

  return response.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await axios.post(`${API_URL}/token/refresh/`, {
    refresh: refreshToken,
  });
  return response.data; // contains new access token
};
