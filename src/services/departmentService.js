import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getDepartments = async () => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/departments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar departemen");
  }

  return data.data;
};

export const addDepartment = async (department) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/departments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(department),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan departemen");
  }

  return data.data;
};

export const editDepartment = async (id, department) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/departments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(department),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengedit departemen");
  }

  return data.data;
};

export const activateDepartment = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/departments/${id}/activate`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengaktifkan departemen");
  }
  return data.data;
};

export const deactivateDepartment = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/departments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menonaktifkan departemen");
  }

  return data.data;
};
