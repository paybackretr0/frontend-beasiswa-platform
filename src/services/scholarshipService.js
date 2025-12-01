import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const fetchAllScholarships = async () => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/beasiswa`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || `Gagal mengambil daftar beasiswa`);
  }

  return data.data;
};

export const createScholarship = async (scholarshipData) => {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();

  Object.keys(scholarshipData).forEach((key) => {
    if (key === "requirements") {
      const requirementsForAPI = scholarshipData[key].map((req) => ({
        type: req.type,
        text: req.text || "",
      }));
      formData.append("requirements", JSON.stringify(requirementsForAPI));
    } else if (
      key === "documents" ||
      key === "benefits" ||
      key === "faculties" ||
      key === "departments" ||
      key === "study_programs" ||
      key === "stages"
    ) {
      formData.append(key, JSON.stringify(scholarshipData[key]));
    } else if (
      key === "requirementFile" &&
      scholarshipData[key] instanceof File
    ) {
      formData.append("requirement_file", scholarshipData[key]);
    } else if (key === "logoFile" && scholarshipData[key] instanceof File) {
      formData.append("logo_file", scholarshipData[key]);
    } else if (
      key !== "requirementFile" &&
      key !== "logoFile" &&
      scholarshipData[key] !== null &&
      scholarshipData[key] !== undefined
    ) {
      formData.append(key, scholarshipData[key]);
    }
  });

  const data = await authFetch(`${API_BASE_URL}/beasiswa`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan beasiswa");
  }

  return data.data;
};

export const fetchActiveScholarships = async () => {
  const response = await fetch(`${API_BASE_URL}/beasiswa/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal mendapatkan daftar beasiswa");
  }

  return data.data;
};

export const getBeasiswaById = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/beasiswa/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || `Gagal mengambil beasiswa`);
  }

  return data.data;
};

export const updateScholarship = async (id, scholarshipData) => {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();

  Object.keys(scholarshipData).forEach((key) => {
    if (key === "requirements") {
      const requirementsForAPI = scholarshipData[key].map((req) => ({
        type: req.type,
        text: req.text || "",
        existingFile: req.existingFile || null,
      }));
      formData.append("requirements", JSON.stringify(requirementsForAPI));
    } else if (
      key === "documents" ||
      key === "benefits" ||
      key === "faculties" ||
      key === "departments" ||
      key === "study_programs" ||
      key === "stages"
    ) {
      formData.append(key, JSON.stringify(scholarshipData[key]));
    } else if (
      key === "requirementFile" &&
      scholarshipData[key] instanceof File
    ) {
      formData.append("requirement_file", scholarshipData[key]);
    } else if (key === "logoFile" && scholarshipData[key] instanceof File) {
      formData.append("logo_file", scholarshipData[key]);
    } else if (
      key !== "requirementFile" &&
      key !== "logoFile" &&
      scholarshipData[key] !== null &&
      scholarshipData[key] !== undefined
    ) {
      formData.append(key, scholarshipData[key]);
    }
  });

  const data = await authFetch(`${API_BASE_URL}/beasiswa/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal memperbarui beasiswa");
  }

  return data.data;
};

export const deactivateScholarship = async (id) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/beasiswa/${id}/deactivate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal menonaktifkan beasiswa");
  }
  return data.data;
};

export const activateScholarship = async (id) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/beasiswa/${id}/activate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengaktifkan beasiswa");
  }
  return data.data;
};

export const getScholarshipByIdPublic = async (id) => {
  const response = await fetch(`${API_BASE_URL}/beasiswa/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal mendapatkan detail beasiswa");
  }

  return data.data;
};

export const getOtherScholarships = async (id, limit = 5) => {
  const response = await fetch(
    `${API_BASE_URL}/beasiswa/user/${id}/others?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal mendapatkan beasiswa lainnya");
  }

  return data.data;
};
