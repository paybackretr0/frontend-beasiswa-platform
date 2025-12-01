import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getStudyPrograms = async () => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/study-programs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar program studi");
  }

  return data.data;
};

export const addStudyProgram = async (studyProgram) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/study-programs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(studyProgram),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan program studi");
  }

  return data.data;
};

export const editStudyProgram = async (id, studyProgram) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/study-programs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(studyProgram),
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengedit program studi");
  }

  return data.data;
};

export const activateStudyProgram = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(
    `${API_BASE_URL}/study-programs/${id}/activate`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal mengaktifkan program studi");
  }
  return data.data;
};

export const deactivateStudyProgram = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/study-programs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menonaktifkan program studi");
  }

  return data.data;
};
