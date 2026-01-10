import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepOne from "./StepOne";
import StepSchemas from "./StepSchemas";
import StepFinalize from "./StepFinalize";
import { createScholarship } from "../../../../services/scholarshipService";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";

const ScholarshipAdd = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { success, error, alerts, removeAlert } = useAlert();

  const [scholarshipData, setScholarshipData] = useState({
    name: "",
    organizer: "",
    year: new Date().getFullYear(),
    description: "",
    is_external: false,
    verification_level: "DITMAWA",

    schemas: [],

    start_date: "",
    end_date: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
    scholarship_value: "",
    duration_semesters: "",
    website_url: "",
    is_active: true,
    benefits: [],
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
        "Berhasil!",
        `Beasiswa "${finalData.name}" dengan ${finalData.schemas.length} schema telah berhasil ditambahkan.`
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
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              Data Umum
            </span>
          </div>

          <div
            className={`flex-1 h-1 mx-2 ${
              currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"
            }`}
          ></div>

          <div
            className={`flex items-center gap-2 ${
              currentStep >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium hidden sm:inline">Schema</span>
          </div>

          <div
            className={`flex-1 h-1 mx-2 ${
              currentStep >= 3 ? "bg-blue-500" : "bg-gray-200"
            }`}
          ></div>

          <div
            className={`flex items-center gap-2 ${
              currentStep >= 3 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              3
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              Finalisasi
            </span>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <StepOne onNext={handleNext} initialData={scholarshipData} />
      )}
      {currentStep === 2 && (
        <StepSchemas
          onNext={handleNext}
          onBack={handleBack}
          initialData={scholarshipData}
        />
      )}
      {currentStep === 3 && (
        <StepFinalize
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
