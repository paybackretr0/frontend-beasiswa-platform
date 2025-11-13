import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getAllApplications = async () => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/applications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil data pendaftaran");
  }
  return data.data;
};

export const getApplicationsSummary = async () => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/applications/summary`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil ringkasan pendaftaran");
  }
  return data.data;
};

export const getApplicationDetail = async (id) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/applications/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil detail pendaftaran");
  }
  return data.data;
};

export const getApplicationDetailUser = async (id) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/applications/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil detail pendaftaran");
  }
  return data.data;
};
