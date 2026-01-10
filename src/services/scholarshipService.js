import API_BASE_URL from "./apiConfig";
import { authFetch } from "./tokenAuth";

export const fetchAllScholarships = async () => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/beasiswa`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || `Gagal mengambil daftar beasiswa`);
  }

  return data.data;
};

export const createScholarship = async (formData) => {
  const token = localStorage.getItem("access_token");

  const multipartFormData = new FormData();

  // Basic fields
  multipartFormData.append("name", formData.name);
  multipartFormData.append("organizer", formData.organizer);
  multipartFormData.append("year", formData.year);
  multipartFormData.append("description", formData.description);
  multipartFormData.append("is_external", formData.is_external);
  multipartFormData.append(
    "verification_level",
    formData.verification_level || "DITMAWA"
  );

  if (formData.start_date) {
    multipartFormData.append("start_date", formData.start_date);
  }
  if (formData.end_date) {
    multipartFormData.append("end_date", formData.end_date);
  }

  multipartFormData.append("contact_person_name", formData.contact_person_name);
  multipartFormData.append(
    "contact_person_email",
    formData.contact_person_email
  );
  multipartFormData.append(
    "contact_person_phone",
    formData.contact_person_phone
  );

  multipartFormData.append("scholarship_value", formData.scholarship_value);
  multipartFormData.append("duration_semesters", formData.duration_semesters);

  multipartFormData.append(
    "is_active",
    formData.is_active !== undefined ? formData.is_active : true
  );

  if (formData.website_url) {
    multipartFormData.append("website_url", formData.website_url);
  }

  // ✅ Logo file
  if (formData.logoFile) {
    multipartFormData.append("logo_file", formData.logoFile);
  }

  // ✅ Requirement file - ONLY ONE FILE
  let hasRequirementFile = false;
  if (formData.schemas && formData.schemas.length > 0) {
    // Find first FILE requirement across all schemas
    for (const schema of formData.schemas) {
      if (schema.requirements && schema.requirements.length > 0) {
        const fileRequirement = schema.requirements.find(
          (req) => req.type === "FILE" && req.file
        );
        if (fileRequirement && !hasRequirementFile) {
          multipartFormData.append("requirement_file", fileRequirement.file);
          hasRequirementFile = true;
          break; // Only upload first file found
        }
      }
    }

    // ✅ Prepare schemas data (without File objects)
    const schemasForBackend = formData.schemas.map((schema) => ({
      ...schema,
      requirements: schema.requirements.map((req) => ({
        type: req.type,
        text: req.type === "TEXT" ? req.text : null,
        // Mark if this requirement expects the uploaded file
        hasFile: req.type === "FILE" && req.file ? true : false,
      })),
    }));

    multipartFormData.append("schemas", JSON.stringify(schemasForBackend));
  }

  const data = await authFetch(`${API_BASE_URL}/beasiswa`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: multipartFormData,
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal menambahkan beasiswa");
  }

  return data.data;
};

export const fetchActiveScholarships = async () => {
  const response = await fetch(`${API_BASE_URL}/beasiswa/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal mendapatkan daftar beasiswa");
  }

  return data.data;
};

export const getBeasiswaById = async (id) => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/beasiswa/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || `Gagal mengambil beasiswa`);
  }

  return data.data;
};

export const updateScholarship = async (id, scholarshipData) => {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();

  Object.keys(scholarshipData).forEach((key) => {
    if (key === "requirements") {
      const requirementsForAPI = scholarshipData[key].map((req) => ({
        type: req.type,
        text: req.text || "",
        existingFile: req.existingFile || null,
      }));
      formData.append("requirements", JSON.stringify(requirementsForAPI));
    } else if (
      key === "documents" ||
      key === "benefits" ||
      key === "faculties" ||
      key === "departments" ||
      key === "study_programs" ||
      key === "stages"
    ) {
      formData.append(key, JSON.stringify(scholarshipData[key]));
    } else if (
      key === "requirementFile" &&
      scholarshipData[key] instanceof File
    ) {
      formData.append("requirement_file", scholarshipData[key]);
    } else if (key === "logoFile" && scholarshipData[key] instanceof File) {
      formData.append("logo_file", scholarshipData[key]);
    } else if (
      key !== "requirementFile" &&
      key !== "logoFile" &&
      scholarshipData[key] !== null &&
      scholarshipData[key] !== undefined
    ) {
      formData.append(key, scholarshipData[key]);
    }
  });

  const data = await authFetch(`${API_BASE_URL}/beasiswa/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!data.success) {
    throw new Error(data.message || "Gagal memperbarui beasiswa");
  }

  return data.data;
};

export const deactivateScholarship = async (id) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/beasiswa/${id}/deactivate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal menonaktifkan beasiswa");
  }
  return data.data;
};

export const activateScholarship = async (id) => {
  const token = localStorage.getItem("access_token");
  const data = await authFetch(`${API_BASE_URL}/beasiswa/${id}/activate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!data.success) {
    throw new Error(data.message || "Gagal mengaktifkan beasiswa");
  }
  return data.data;
};

export const getScholarshipByIdPublic = async (id) => {
  const response = await fetch(`${API_BASE_URL}/beasiswa/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal mendapatkan detail beasiswa");
  }

  return data.data;
};

export const getOtherScholarships = async (id, limit = 5) => {
  const response = await fetch(
    `${API_BASE_URL}/beasiswa/user/${id}/others?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal mendapatkan beasiswa lainnya");
  }

  return data.data;
};

export const fetchActiveScholarshipsForInfo = async () => {
  const token = localStorage.getItem("access_token");

  const data = await authFetch(`${API_BASE_URL}/beasiswa/info/active`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data.success) {
    throw new Error(data.message || `Gagal mengambil daftar beasiswa aktif`);
  }

  return data.data;
};
