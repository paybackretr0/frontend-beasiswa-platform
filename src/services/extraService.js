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

export const getAllCommentTemplates = async (params = {}) => {
  const token = localStorage.getItem("access_token");

  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      queryParams.append(key, params[key]);
    }
  });

  const data = await authFetch(
    `${API_BASE_URL}/additional/comment-templates?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar template komentar");
  }

  return data.data;
};

export const getCommentTemplateById = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(
    `${API_BASE_URL}/additional/comment-templates/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil template komentar");
  }

  return data.data;
};

export const createCommentTemplate = async (templateData) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/additional/comment-templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(templateData),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal membuat template komentar");
  }

  return data.data;
};

export const updateCommentTemplate = async (id, templateData) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(
    `${API_BASE_URL}/additional/comment-templates/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(templateData),
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal memperbarui template komentar");
  }

  return data.data;
};

export const activateCommentTemplate = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(
    `${API_BASE_URL}/additional/comment-templates/activate/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal mengaktifkan template komentar");
  }

  return data.data;
};

export const deactivateCommentTemplate = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(
    `${API_BASE_URL}/additional/comment-templates/deactivate/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal menonaktifkan template komentar");
  }

  return data.data;
};

export const getActiveTemplatesByType = async (type) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(
    `${API_BASE_URL}/additional/comment-templates/active/${type}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil template aktif");
  }

  return data.data;
};
