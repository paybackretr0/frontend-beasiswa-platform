import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getAllBackups = async () => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/additional/backups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar backup");
  }

  return data.data;
};

export const createBackup = async (backupType) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/additional/backups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ backupType }),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal membuat backup");
  }

  return data.data;
};

export const getAllActivityLogs = async (params = {}) => {
  const token = localStorage.getItem("access_token");

  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      queryParams.append(key, params[key]);
    }
  });

  const data = await authFetch(
    `${API_BASE_URL}/additional/activity-logs?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar log aktivitas");
  }

  return data.data;
};

export const exportActivityLogs = async (filters = {}) => {
  const token = localStorage.getItem("access_token");

  const queryParams = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      queryParams.append(key, filters[key]);
    }
  });

  const data = await authFetch(
    `${API_BASE_URL}/additional/activity-logs/export?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal mengekspor log aktivitas");
  }

  return data.data;
};
