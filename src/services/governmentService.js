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
    }
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
    }
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
    }
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
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil tren beasiswa APBN");
  }
  return data.data;
};
