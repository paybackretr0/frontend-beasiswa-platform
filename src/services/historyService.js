import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getUserApplications = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/history`, {
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user applications:", error);
    throw error;
  }
};
