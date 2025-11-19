import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { createScholarship } from "../../../../services/scholarshipService";
import useAlert from "../../../../hooks/useAlert";

const ScholarshipAdd = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { success, error } = useAlert();

  const [scholarshipData, setScholarshipData] = useState({
    name: "",
    organizer: "",
    year: new Date().getFullYear(),
    description: "",
    terms_type: "TEXT",
    terms_content: "",
    requirements: [],

    start_date: "",
    end_date: "",
    quota: null,
    gpa_minimum: null,
    semester_minimum: "",
    documents: [],
    benefits: [],

    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
    is_active: true,
    scholarship_value: "",
    duration_semesters: "",
    website_url: "",
    faculties: [],
    departments: [],
    stages: [],
  });

  const handleNext = (stepData) => {
    setScholarshipData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (stepData) => {
    const finalData = { ...scholarshipData, ...stepData };

    setLoading(true);
    try {
      await createScholarship(finalData);
      success(
        "Beasiswa Berhasil Dibuat!",
        `Beasiswa "${finalData.name}" telah berhasil ditambahkan ke sistem.`
      );

      setTimeout(() => {
        navigate("/admin/scholarship");
      }, 2000);
    } catch (err) {
      console.error("Error creating scholarship:", err);

      let errorTitle = "Gagal Membuat Beasiswa";
      let errorMessage = "Terjadi kesalahan saat membuat beasiswa";

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 400) {
          errorTitle = "Data Tidak Valid";
          errorMessage =
            data.message || "Mohon periksa kembali data yang diinput";
        } else if (status === 413) {
          errorTitle = "File Terlalu Besar";
          errorMessage = "Ukuran file yang diupload melebihi batas maksimum";
        } else if (status === 500) {
          errorTitle = "Kesalahan Server";
          errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi";
        } else {
          errorMessage = data.message || `Error ${status}: ${err.message}`;
        }
      } else if (err.request) {
        errorTitle = "Kesalahan Jaringan";
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda";
      } else {
        errorMessage = err.message || "Terjadi kesalahan yang tidak diketahui";
      }

      error(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Tambah Beasiswa - Admin";
  }, []);

  return (
    <div>
      {currentStep === 1 && (
        <StepOne onNext={handleNext} initialData={scholarshipData} />
      )}
      {currentStep === 2 && (
        <StepTwo
          onNext={handleNext}
          onBack={handleBack}
          initialData={scholarshipData}
        />
      )}
      {currentStep === 3 && (
        <StepThree
          onBack={handleBack}
          onSubmit={handleSubmit}
          initialData={scholarshipData}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ScholarshipAdd;
