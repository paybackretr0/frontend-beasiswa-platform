import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getActiveTemplatesByType = async (type) => {
  const token = localStorage.getItem("access_token");

  const response = await authFetch(
    `${API_BASE_URL}/additional/comment-templates/active/${type}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.success) {
    throw new Error(response.message || "Gagal memuat template");
  }

  return response.data;
};

export const getApplicationComments = async (applicationId) => {
  const token = localStorage.getItem("access_token");

  const response = await authFetch(
    `${API_BASE_URL}/applications/${applicationId}/comments`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.success) {
    throw new Error(response.message || "Gagal memuat komentar");
  }

  return response.data;
};
