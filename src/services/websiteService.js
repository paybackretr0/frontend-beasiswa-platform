import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const getAllNews = async () => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/websites/news`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar berita");
  }

  const baseUrl = import.meta.env.VITE_IMAGE_URL;
  const newsWithFullUrl = data.data.map((news) => ({
    ...news,
    cover_url: news.cover_url ? `${baseUrl}/${news.cover_url}` : null,
  }));

  return newsWithFullUrl;
};

export const getAllArticles = async () => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/websites/articles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar artikel");
  }

  const baseUrl = import.meta.env.VITE_IMAGE_URL;
  const articlesWithFullUrl = data.data.map((article) => ({
    ...article,
    cover_url: article.cover_url ? `${baseUrl}/${article.cover_url}` : null,
  }));

  return articlesWithFullUrl;
};

export const addInformation = async (formData) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/websites`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan informasi");
  }

  return data.data;
};

export const editInformation = async (id, formData) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/websites/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal mengedit informasi");
  }

  return data.data;
};

export const deleteInformation = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/websites/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menghapus informasi");
  }
  return data.data;
};

export const publishInformation = async (id) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/websites/${id}/publish`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mempublikasikan informasi");
  }
  return data.data;
};

export const archiveInformation = async (id) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/websites/${id}/archive`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengarsipkan informasi");
  }
  return data.data;
};

export const getLatestInformation = async () => {
  const response = await fetch(`${API_BASE_URL}/websites/informations/latest`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil informasi terbaru");
  }

  const baseUrl = import.meta.env.VITE_IMAGE_URL;
  const informationWithFullUrl = data.data.map((information) => ({
    ...information,
    cover_url: information.cover_url
      ? `${baseUrl}/${information.cover_url}`
      : null,
  }));

  return informationWithFullUrl;
};

export const getInformationBySlug = async (slug) => {
  const response = await fetch(
    `${API_BASE_URL}/websites/informations/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil informasi");
  }

  const baseUrl = import.meta.env.VITE_IMAGE_URL;
  const information = {
    ...data.data,
    cover_url: data.data.cover_url ? `${baseUrl}/${data.data.cover_url}` : null,
  };

  return information;
};

export const getAllInformations = async () => {
  const response = await fetch(`${API_BASE_URL}/websites/informations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Gagal mengambil daftar informasi");
  }

  const baseUrl = import.meta.env.VITE_IMAGE_URL;
  const informationsWithFullUrl = data.data.map((information) => ({
    ...information,
    cover_url: information.cover_url
      ? `${baseUrl}/${information.cover_url}`
      : null,
  }));

  return informationsWithFullUrl;
};
