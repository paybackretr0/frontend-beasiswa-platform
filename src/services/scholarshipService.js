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

  if (formData.benefits && formData.benefits.length > 0) {
    multipartFormData.append("benefits", JSON.stringify(formData.benefits));
  }

  if (formData.logoFile) {
    multipartFormData.append("logo_file", formData.logoFile);
  }

  let hasRequirementFile = false;
  if (formData.schemas && formData.schemas.length > 0) {
    for (const schema of formData.schemas) {
      if (schema.requirements && schema.requirements.length > 0) {
        const fileRequirement = schema.requirements.find(
          (req) => req.type === "FILE" && req.file
        );
        if (fileRequirement && !hasRequirementFile) {
          multipartFormData.append("requirement_file", fileRequirement.file);
          hasRequirementFile = true;
          break;
        }
      }
    }

    const schemasForBackend = formData.schemas.map((schema) => ({
      ...schema,
      requirements: schema.requirements.map((req) => ({
        type: req.type,
        text: req.type === "TEXT" ? req.text : null,
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

export const updateScholarship = async (id, formData) => {
  const token = localStorage.getItem("access_token");

  const multipartFormData = new FormData();

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

  if (formData.benefits && formData.benefits.length > 0) {
    multipartFormData.append("benefits", JSON.stringify(formData.benefits));
  }

  if (formData.logoFile && formData.logoFile instanceof File) {
    multipartFormData.append("logo_file", formData.logoFile);
  }

  let hasRequirementFile = false;
  if (formData.schemas && formData.schemas.length > 0) {
    for (const schema of formData.schemas) {
      if (schema.requirements && schema.requirements.length > 0) {
        const fileRequirement = schema.requirements.find(
          (req) => req.type === "FILE" && req.file instanceof File
        );
        if (fileRequirement && !hasRequirementFile) {
          multipartFormData.append("requirement_file", fileRequirement.file);
          hasRequirementFile = true;
          break;
        }
      }
    }

    const schemasForBackend = formData.schemas.map((schema) => ({
      id: schema.id,
      name: schema.name,
      description: schema.description,
      quota: schema.quota,
      gpa_minimum: schema.gpa_minimum,
      semester_minimum: schema.semester_minimum,
      is_active: schema.is_active !== undefined ? schema.is_active : true,

      requirements: schema.requirements.map((req) => ({
        type: req.type,
        text: req.type === "TEXT" ? req.text : null,
        existingFile:
          req.type === "FILE" && !req.file ? req.existingFile : null,
        hasFile: req.type === "FILE" && req.file instanceof File ? true : false,
      })),

      documents: schema.documents || [],

      stages: schema.stages.map((stage, index) => ({
        name: stage.name || stage.stage_name,
        stage_name: stage.name || stage.stage_name,
        order_no: stage.order_no || index + 1,
      })),

      faculties: schema.faculties || [],
      departments: schema.departments || [],
      study_programs: schema.study_programs || [],
    }));

    multipartFormData.append("schemas", JSON.stringify(schemasForBackend));
  }

  const data = await authFetch(`${API_BASE_URL}/beasiswa/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: multipartFormData,
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
