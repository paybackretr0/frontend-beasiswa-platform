import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const register = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Gagal login");
    }

    return res.json();
  } catch (err) {
    console.error("Login service error:", err);
    return { message: err.message };
  }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getProfile = async () => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateProfile = async (data) => {
  const token = localStorage.getItem("access_token");
  const response = await authFetch(`${API_BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) {
    throw new Error("No refresh token found. Please login again.");
  }

  const res = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to refresh token");
  }

  localStorage.setItem("access_token", data.data.access_token);

  return data.data.access_token;
};

export const changePassword = async (data) => {
  const token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");

  const response = await authFetch(`${API_BASE_URL}/auth/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data, refresh_token }),
  });

  if (!response.success) {
    throw new Error(response.message || "Gagal mengubah password");
  }

  return response;
};

export const forgotPassword = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || "Gagal mengirim kode reset");
  }

  return response;
};

export const verifyResetCode = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.message || "Kode reset salah atau sudah kadaluarsa"
    );
  }

  return response;
};

export const resetPassword = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || "Gagal mereset password");
  }

  return response;
};

// ===== FUNGSI VERIFIKASI EMAIL =====

export const verifyEmail = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || "Gagal memverifikasi email");
  }

  return response;
};
