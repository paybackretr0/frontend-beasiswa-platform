import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getFaculties = async () => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/faculties`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar fakultas");
  }

  return data.data;
};
