import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const checkScholarshipForm = async (scholarshipId) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/forms/check/${scholarshipId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal memeriksa status form");
  }

  return data.data;
};

export const createFormField = async (scholarshipId, schemaId, fields) => {
  const token = localStorage.getItem("access_token");
  const response = await authFetch(`${API_BASE_URL}/forms/${scholarshipId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ schemaId, fields }),
  });

  if (!response.success) {
    throw new Error(response.message || "Gagal membuat form");
  }

  return response.data;
};

export const getFormFields = async (scholarshipId) => {
  const token = localStorage.getItem("access_token");
  const response = await authFetch(`${API_BASE_URL}/forms/${scholarshipId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.success) {
    throw new Error(response.message || "Gagal memuat form");
  }

  return response.data;
};

export const updateFormField = async (scholarshipId, schemaId, fields) => {
  const token = localStorage.getItem("access_token");
  const response = await authFetch(`${API_BASE_URL}/forms/${scholarshipId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ schemaId, fields }),
  });

  if (!response.success) {
    throw new Error(response.message || "Gagal mengupdate form");
  }

  return response.data;
};
