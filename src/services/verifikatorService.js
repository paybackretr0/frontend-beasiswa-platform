import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const verifyApplication = async (applicationId, notes = "") => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(
    `${API_BASE_URL}/verifikator/applications/${applicationId}/verify`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    }
  );

  if (!data.success) {
    throw new Error(data.message || "Gagal memverifikasi pendaftaran");
  }

  return data.data;
};

export const rejectApplication = async (applicationId, notes) => {
  const token = localStorage.getItem("access_token");

  const response = await authFetch(
    `${API_BASE_URL}/verifikator/applications/${applicationId}/reject`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    }
  );

  return response.data;
};
