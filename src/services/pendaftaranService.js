import { authFetch } from "./tokenAuth";
import API_BASE_URL from "./apiConfig";

export const getScholarshipForm = async (scholarshipId) => {
  try {
    const response = await authFetch(
      `${API_BASE_URL}/pendaftaran/scholarship/${scholarshipId}/form`
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
  answers,
  isDraft = false
) => {
  try {
    const formData = new FormData();

    // Add answers data
    const answersData = {};

    // Process answers and separate files
    Object.keys(answers).forEach((fieldId) => {
      const answer = answers[fieldId];

      if (answer instanceof File) {
        // Handle file upload
        formData.append(`field_${fieldId}`, answer);
        answersData[fieldId] = { file_path: answer.name };
      } else {
        // Handle text answers
        answersData[fieldId] = { answer_text: answer };
      }
    });

    formData.append("answers", JSON.stringify(answersData));
    formData.append("isDraft", isDraft.toString());

    const response = await authFetch(
      `${API_BASE_URL}/pendaftaran/scholarship/${scholarshipId}/submit`,
      {
        method: "POST",
        body: formData, // Don't set Content-Type header, let browser set it for FormData
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

export const saveDraft = async (scholarshipId, answers) => {
  return submitApplication(scholarshipId, answers, true);
};
