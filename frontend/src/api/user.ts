import axios from "axios";

const API_URL = "https://access-compass-django.onrender.com/api"; // or your backend URL

export const getUserProfile = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("No access token");

  const response = await axios.get(`${API_URL}/users/profile/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data; // { id, username, email, is_special_user }
};
