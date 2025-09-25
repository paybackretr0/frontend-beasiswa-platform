import { refreshToken } from "./authService";

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("access_token");

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      try {
        const newToken = await refreshToken();

        headers.Authorization = `Bearer ${newToken}`;
        const retryRes = await fetch(url, { ...options, headers });
        return retryRes.json();
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        throw new Error("Session expired. Please login again.");
      }
    }

    return res.json();
  } catch (error) {
    console.error("Error in authFetch:", error);
    throw error;
  }
};
