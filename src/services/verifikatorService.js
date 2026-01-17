import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const verifyApplication = async (applicationId, payload = {}) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(
    `${API_BASE_URL}/verifikator/applications/${applicationId}/verify`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal memverifikasi pendaftaran");
  }

  return data.data;
};

export const rejectApplication = async (applicationId, payload) => {
  const token = localStorage.getItem("access_token");

  const response = await authFetch(
    `${API_BASE_URL}/verifikator/applications/${applicationId}/reject`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.success) {
    throw new Error(response.message || "Gagal menolak pendaftaran");
  }

  return response.data;
};

export const requestRevisionApplication = async (applicationId, payload) => {
  const token = localStorage.getItem("access_token");

  const response = await authFetch(
    `${API_BASE_URL}/verifikator/applications/${applicationId}/request-revision`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.success) {
    throw new Error(response.message || "Gagal meminta revisi");
  }

  return response.data;
};
