import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditStepOne from "./EditStepOne";
import EditStepTwo from "./EditStepTwo";
import EditStepThree from "./EditStepThree";
import {
  updateScholarship,
  getBeasiswaById,
} from "../../../../services/scholarshipService";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";

const ScholarshipEdit = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  const { success, error, alerts, removeAlert } = useAlert();

  const [scholarshipData, setScholarshipData] = useState({
    name: "",
    organizer: "",
    year: new Date().getFullYear(),
    description: "",
    is_external: false,
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
    study_programs: [],
  });

  useEffect(() => {
    document.title = "Edit Beasiswa - Admin";
    fetchScholarshipData();
  }, [id]);

  const fetchScholarshipData = async () => {
    try {
      setInitialLoading(true);
      const data = await getBeasiswaById(id);

      const transformedData = {
        id: data.id,
        name: data.name,
        organizer: data.organizer,
        year: data.year,
        description: data.description,
        is_external: data.is_external || false,
        requirements: data.requirements || [],
        start_date: data.start_date,
        end_date: data.end_date,
        quota: data.quota,
        gpa_minimum: data.gpa_minimum,
        semester_minimum: data.semester_minimum,
        documents:
          data.scholarshipDocuments?.map((doc) => doc.document_name) || [],
        benefits: data.benefits?.map((benefit) => benefit.benefit_text) || [],
        contact_person_name: data.contact_person_name,
        contact_person_email: data.contact_person_email,
        contact_person_phone: data.contact_person_phone,
        is_active: data.is_active,
        scholarship_value: data.scholarship_value,
        duration_semesters: data.duration_semesters,
        website_url: data.website_url,
        faculties: data.faculties?.map((faculty) => faculty.id) || [],
        departments: data.departments?.map((dept) => dept.id) || [],
        study_programs: data.study_programs?.map((prog) => prog.id) || [],
        existingLogo: data.logo_path,
        existingRequirementFiles:
          data.requirements?.filter((req) => req.requirement_type === "FILE") ||
          [],
        stages:
          data.stages?.map((stage) => ({
            id: stage.id,
            stage_name: stage.stage_name,
            order_no: stage.order_no,
          })) || [],
      };

      setScholarshipData(transformedData);
    } catch (err) {
      console.error("Error fetching scholarship data:", err);
      error("Gagal!", "Gagal memuat data beasiswa");
      navigate("/admin/scholarship");
    } finally {
      setInitialLoading(false);
    }
  };

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
      await updateScholarship(id, finalData);
      success("Berhasil!", "Beasiswa berhasil diperbarui!");

      setTimeout(() => {
        navigate("/admin/scholarship");
      }, 1200);
    } catch (err) {
      console.error("Error updating scholarship:", err);
      error("Gagal!", err.message || "Gagal memperbarui beasiswa");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data beasiswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      {currentStep === 1 && (
        <EditStepOne onNext={handleNext} initialData={scholarshipData} />
      )}
      {currentStep === 2 && (
        <EditStepTwo
          onNext={handleNext}
          onBack={handleBack}
          initialData={scholarshipData}
        />
      )}
      {currentStep === 3 && (
        <EditStepThree
          onBack={handleBack}
          onSubmit={handleSubmit}
          initialData={scholarshipData}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ScholarshipEdit;
