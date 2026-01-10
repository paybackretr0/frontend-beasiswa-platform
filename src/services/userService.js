import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const fetchUsersByRole = async (role) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/users/${role}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || `Gagal mengambil daftar ${role}`);
  }

  return data.data;
};

export const addUser = async (userData) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan user");
  }

  return data.data;
};

export const addMahasiswa = async (userData) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/users/mahasiswa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan mahasiswa");
  }
  return data.data;
};

export const addPimpinanFakultas = async (userData) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/users/pimpinan-fakultas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan pimpinan fakultas");
  }
  return data.data;
};

export const addVerifikator = async (userData) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/users/verifikator`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan verifikator");
  }
  return data.data;
};

export const updateVerifikator = async (id, userData) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/users/verifikator/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal memperbarui verifikator");
  }
  return data.data;
};

export const updateUser = async (id, userData) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal memperbarui user");
  }
  return data.data;
};

export const deactivateUser = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menonaktifkan user");
  }
  return data.data;
};

export const activateUser = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/users/activate/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengaktifkan user");
  }
  return data.data;
};
