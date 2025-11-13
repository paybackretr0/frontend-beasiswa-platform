import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const validateApplication = async (applicationId, notes = "") => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(
    `${API_BASE_URL}/validator/applications/${applicationId}/validate`,
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
    throw new Error(data.message || "Gagal memvalidasi pendaftaran");
  }

  return data.data;
};
