import { useState, useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { createScholarship } from "../../../../services/scholarshipService";

const ScholarshipAdd = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    scholarship_status: "AKTIF",
    scholarship_value: "",
    duration_semesters: "",
    website_url: "",
    faculties: [],
    departments: [],
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
      message.success("Beasiswa berhasil dibuat!");
      navigate("/admin/scholarship");
    } catch (error) {
      console.error("Error creating scholarship:", error);
      message.error(error.message || "Gagal membuat beasiswa");
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
