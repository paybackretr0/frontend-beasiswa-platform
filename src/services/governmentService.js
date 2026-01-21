import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getGovernmentScholarshipSummary = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(
    `${API_BASE_URL}/government-scholarships/summary${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil ringkasan beasiswa APBN");
  }
  return data.data;
};

export const getGovernmentScholarshipDistribution = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(
    `${API_BASE_URL}/government-scholarships/distribution${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil distribusi beasiswa APBN");
  }
  return data.data;
};

export const getGovernmentScholarshipCategories = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(
    `${API_BASE_URL}/government-scholarships/categories${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil kategori beasiswa APBN");
  }
  return data.data;
};

export const getGovernmentScholarshipYearlyTrend = async () => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(
    `${API_BASE_URL}/government-scholarships/yearly-trend`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil tren beasiswa APBN");
  }
  return data.data;
};

export const getGovernmentScholarshipList = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.year) params.append("year", filters.year);
    if (filters.status && filters.status !== "Semua")
      params.append("status", filters.status);
    if (filters.program && filters.program !== "Semua")
      params.append("program", filters.program);
    if (filters.search) params.append("search", filters.search);

    const queryString = params.toString();
    const response = await authFetch(
      `${API_BASE_URL}/government-scholarships/list${queryString ? `?${queryString}` : ""}`,
    );

    if (!response.success) {
      throw new Error(
        response.message || "Gagal memuat daftar penerima beasiswa",
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching government scholarship list:", error);
    throw error;
  }
};

export const exportGovernmentScholarships = async (year = null) => {
  try {
    const queryParams = year ? `?year=${year}` : "";
    const response = await authFetch(
      `${API_BASE_URL}/government-scholarships/export${queryParams}`,
      {
        method: "GET",
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Gagal mengexport data");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beasiswa-apbn-${year || "all"}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return response.data;
  } catch (error) {
    console.error("Error exporting government scholarships:", error);
    throw error;
  }
};

export const importGovernmentScholarships = async (formData) => {
  try {
    const response = await authFetch(
      `${API_BASE_URL}/government-scholarships/import`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.success) {
      throw new Error(response.message || "Gagal mengimport data");
    }

    return response.data;
  } catch (error) {
    console.error("Error importing government scholarships:", error);

    throw new Error(
      error.message || error.response?.data?.message || "Gagal mengimport data",
    );
  }
};
