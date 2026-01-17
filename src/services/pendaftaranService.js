import { authFetch } from "./tokenAuth";
import API_BASE_URL from "./apiConfig";

export const getScholarshipForm = async (scholarshipId, schemaId) => {
  try {
    const queryParams = schemaId ? `?schemaId=${schemaId}` : "";

    const response = await authFetch(
      `${API_BASE_URL}/pendaftaran/scholarship/${scholarshipId}/form${queryParams}`
    );

    if (!response.success) {
      throw new Error(response.message || "Gagal memuat form pendaftaran");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching scholarship form:", error);
    throw new Error(error.message || "Gagal memuat form pendaftaran");
  }
};

export const submitApplication = async (
  scholarshipId,
  schemaId,
  answers,
  isDraft = false
) => {
  try {
    const formData = new FormData();

    const answersData = {};

    Object.keys(answers).forEach((fieldId) => {
      const answer = answers[fieldId];

      if (answer instanceof File) {
        formData.append(`field_${fieldId}`, answer);
        answersData[fieldId] = {
          file_path: answer.name,
          mime_type: answer.type,
          size_bytes: answer.size,
        };
      } else if (answer?.path) {
        answersData[fieldId] = {
          file_path: answer.path,
          mime_type: answer.mime_type || null,
          size_bytes: answer.size_bytes || null,
        };
      } else {
        answersData[fieldId] = { answer_text: answer };
      }
    });

    formData.append("answers", JSON.stringify(answersData));
    formData.append("schemaId", schemaId); // ✅ ADD schema ID
    formData.append("isDraft", isDraft.toString());

    const response = await authFetch(
      `${API_BASE_URL}/pendaftaran/scholarship/${scholarshipId}/submit`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Gagal menyimpan aplikasi");
    }

    return response.data;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw new Error(error.message || "Gagal menyimpan aplikasi");
  }
};

export const saveDraft = async (scholarshipId, schemaId, answers) => {
  return submitApplication(scholarshipId, schemaId, answers, true);
};
