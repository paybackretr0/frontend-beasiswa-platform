import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getSummary = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(`${API_BASE_URL}/analytics/summary${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil ringkasan");
  }
  return data.data;
};

export const getMonthlyTrend = async (year) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(
    `${API_BASE_URL}/analytics/monthly-trend?year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil tren bulanan");
  }
  return data.data;
};

export const getSelectionSummary = async (year) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(
    `${API_BASE_URL}/analytics/selection-summary?year=${year}`,
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

export const getStatusSummary = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(
    `${API_BASE_URL}/analytics/status-summary${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil ringkasan status");
  }
  return data.data;
};

export const getFacultyDistribution = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(
    `${API_BASE_URL}/analytics/faculty-distribution${params}`,
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

export const getDepartmentDistribution = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(
    `${API_BASE_URL}/analytics/department-distribution${params}`,
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

export const getYearlyTrend = async () => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/analytics/yearly-trend`, {
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

export const getGenderDistribution = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(
    `${API_BASE_URL}/analytics/gender-distribution${params}`,
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

export const getActivities = async () => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/analytics/activities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil aktivitas");
  }
  return data.data;
};

export const getApplicationsList = async (filters = {}) => {
  const token = localStorage.getItem("access_token");
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "Semua") {
      params.append(key, value);
    }
  });

  const data = await authFetch(
    `${API_BASE_URL}/analytics/applications-list?${params}`,
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

export const getFilterOptions = async () => {
  const token = localStorage.getItem("access_token");

  const facultiesData = await authFetch(`${API_BASE_URL}/faculties`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

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

export const getScholarshipPerformance = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(
    `${API_BASE_URL}/analytics/scholarship-performance${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil performa beasiswa");
  }
  return data.data;
};

export const getTopPerformingFaculties = async (year = null) => {
  const token = localStorage.getItem("access_token");
  const params = year ? `?year=${year}` : "";
  const data = await authFetch(
    `${API_BASE_URL}/analytics/top-performing-faculties${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!data.success) {
    throw new Error(
      data.message || "Gagal mengambil fakultas berperforma terbaik"
    );
  }
  return data.data;
};
