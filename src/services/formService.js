import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

// ✅ Changed to use schemaId
export const checkScholarshipForm = async (schemaId) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/forms/check/${schemaId}`, {
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

export const createFormField = async (schemaId, fields) => {
  const token = localStorage.getItem("access_token");
  const response = await authFetch(`${API_BASE_URL}/forms/${schemaId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fields }), // ✅ No need to send schemaId in body
  });

  if (!response.success) {
    throw new Error(response.message || "Gagal membuat form");
  }

  return response.data;
};

export const getFormFields = async (schemaId) => {
  const token = localStorage.getItem("access_token");
  const response = await authFetch(`${API_BASE_URL}/forms/${schemaId}`, {
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

export const updateFormField = async (schemaId, fields) => {
  const token = localStorage.getItem("access_token");
  const response = await authFetch(`${API_BASE_URL}/forms/${schemaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fields }), // ✅ No need to send schemaId in body
  });

  if (!response.success) {
    throw new Error(response.message || "Gagal mengupdate form");
  }

  return response.data;
};
