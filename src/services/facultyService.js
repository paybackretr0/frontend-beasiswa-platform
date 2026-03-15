import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getPublicFaculties = async () => {
  const res = await fetch(`${API_BASE_URL}/faculties/public`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar fakultas");
  }

  return data.data;
};

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

export const addFaculty = async (faculty) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/faculties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(faculty),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan fakultas");
  }

  return data.data;
};

export const editFaculty = async (id, faculty) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/faculties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(faculty),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengedit fakultas");
  }

  return data.data;
};

export const activateFaculty = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/faculties/${id}/activate`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengaktifkan fakultas");
  }
  return data.data;
};

export const deactivateFaculty = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/faculties/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menonaktifkan fakultas");
  }

  return data.data;
};
