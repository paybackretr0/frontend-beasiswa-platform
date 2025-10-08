import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

// Main Summary
export const getMainSummary = async (year) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(
    `${API_BASE_URL}/reports/main-summary?year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil ringkasan utama");
  }
  return data.data;
};

// Selection Summary
export const getSelectionSummary = async (year) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(
    `${API_BASE_URL}/reports/selection-summary?year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil ringkasan seleksi");
  }
  return data.data;
};

// Faculty Distribution
export const getFacultyDistribution = async (year) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(
    `${API_BASE_URL}/reports/faculty-distribution?year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil distribusi fakultas");
  }
  return data.data;
};

// Department Distribution
export const getDepartmentDistribution = async (year) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(
    `${API_BASE_URL}/reports/department-distribution?year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil distribusi departemen");
  }
  return data.data;
};

// Yearly Trend
export const getYearlyTrend = async () => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/reports/yearly-trend`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil tren tahunan");
  }
  return data.data;
};

// Gender Distribution
export const getGenderDistribution = async (year) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(
    `${API_BASE_URL}/reports/gender-distribution?year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil distribusi gender");
  }
  return data.data;
};

// Applications List
export const getApplicationsList = async (filters = {}) => {
  const token = localStorage.getItem("access_token");
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "Semua") {
      params.append(key, value);
    }
  });

  const data = await authFetch(
    `${API_BASE_URL}/reports/applications-list?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar aplikasi");
  }
  return data.data;
};

// Get Filter Options (for dropdowns)
export const getFilterOptions = async () => {
  const token = localStorage.getItem("access_token");

  // Get faculties
  const facultiesData = await authFetch(`${API_BASE_URL}/faculties`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Get departments
  const departmentsData = await authFetch(`${API_BASE_URL}/departments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    faculties: facultiesData.success ? facultiesData.data : [],
    departments: departmentsData.success ? departmentsData.data : [],
    genders: ["Laki-laki", "Perempuan"],
  };
};
