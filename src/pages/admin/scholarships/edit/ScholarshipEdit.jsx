import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditStepOne from "./EditStepOne";
import EditStepSchemas from "./EditStepSchemas";
import EditStepFinalize from "./EditStepFinalize";
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

    existingLogo: null,
  });

  useEffect(() => {
    document.title = "Edit Beasiswa - Admin";
    fetchScholarshipData();
  }, [id]);

  const fetchScholarshipData = async () => {
    try {
      setInitialLoading(true);
      const data = await getBeasiswaById(id);

      const transformedSchemas = (data.schemas || []).map((schema) => ({
        id: schema.id,
        name: schema.name,
        description: schema.description,
        quota: schema.quota,
        gpa_minimum: schema.gpa_minimum,
        semester_minimum: schema.semester_minimum,
        is_active: schema.is_active,

        requirements: (schema.requirements || []).map((req) => ({
          id: req.id,
          type: req.requirement_type,
          text: req.requirement_text || "",
          file: null,
          fileName: req.requirement_file
            ? req.requirement_file.split("/").pop()
            : "",
          existingFile: req.requirement_file,
        })),

        documents: (schema.documents || []).map((doc) => doc.document_name),

        stages: (schema.stages || [])
          .sort((a, b) => a.order_no - b.order_no)
          .map((stage) => ({
            id: stage.id,
            name: stage.stage_name,
            stage_name: stage.stage_name,
            order_no: stage.order_no,
          })),

        faculties: data.faculties?.map((f) => f.id) || [],
        departments: data.departments?.map((d) => d.id) || [],
        study_programs: data.studyPrograms?.map((p) => p.id) || [],
      }));

      const transformedData = {
        id: data.id,

        name: data.name,
        organizer: data.organizer,
        year: data.year,
        description: data.description,
        is_external: data.is_external || false,
        verification_level: data.verification_level || "DITMAWA",
        existingLogo: data.logo_path,

        schemas: transformedSchemas,

        start_date: data.start_date,
        end_date: data.end_date,
        contact_person_name: data.contact_person_name,
        contact_person_email: data.contact_person_email,
        contact_person_phone: data.contact_person_phone,
        scholarship_value: data.scholarship_value,
        duration_semesters: data.duration_semesters,
        website_url: data.website_url,
        is_active: data.is_active,

        benefits: data.benefits?.map((b) => b.benefit_text) || [],
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
        <EditStepSchemas
          onNext={handleNext}
          onBack={handleBack}
          initialData={scholarshipData}
        />
      )}

      {currentStep === 3 && (
        <EditStepFinalize
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
