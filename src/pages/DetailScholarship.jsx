import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Empty,
  Tag,
  Timeline,
  Divider,
  Tabs,
  Modal as AntModal,
} from "antd";
import {
  HomeOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  BookOutlined,
  FileTextOutlined,
  BankOutlined,
  RightOutlined,
  StarOutlined,
  InfoCircleOutlined,
  FormOutlined,
  ShareAltOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { FaWhatsapp } from "react-icons/fa";
import GuestLayout from "../layouts/GuestLayout";
import Button from "../components/Button";
import {
  getScholarshipByIdPublic,
  getOtherScholarships,
} from "../services/scholarshipService";
import useAlert from "../hooks/useAlert";
import { getProfileCompleteness } from "../utils/profileUtils";

import { SkeletonDetailScholarship } from "../components/common/skeleton";

const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    const parsedUser = JSON.parse(storedUser);
    const student = parsedUser?.student || null;

    return {
      ...parsedUser,
      faculty_id: parsedUser?.faculty_id || student?.faculty?.id || null,
      department_id:
        parsedUser?.department_id || student?.department?.id || null,
      study_program_id:
        parsedUser?.study_program_id || student?.study_program_id || null,
    };
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

const DetailScholarship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [otherScholarships, setOtherScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSchemaTab, setActiveSchemaTab] = useState(null);
  const [expandedEligible, setExpandedEligible] = useState({
    faculties: false,
    departments: false,
    studyPrograms: false,
  });

  const { success, warning, error: alertError } = useAlert();

  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedSchemaId, setSelectedSchemaId] = useState(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    setActiveSchemaTab(null);
    loadScholarshipDetail();
    loadOtherScholarships();
  }, [id]);

  useEffect(() => {
    const activeSchemas = (scholarship?.schemas || []).filter(
      (schema) => schema.is_active,
    );

    if (activeSchemas.length > 0 && !activeSchemaTab) {
      setActiveSchemaTab(activeSchemas[0].id);
    }
  }, [scholarship, activeSchemaTab]);

  const loadScholarshipDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getScholarshipByIdPublic(id);
      setScholarship(data);
      document.title = `${data.name} - Detail Beasiswa`;
    } catch (error) {
      setError(error.message || "Gagal memuat detail beasiswa");
      alertError(error.message || "Gagal memuat detail beasiswa");
    } finally {
      setLoading(false);
    }
  };

  const loadOtherScholarships = async () => {
    try {
      const data = await getOtherScholarships(id, 5);
      setOtherScholarships(data);
    } catch (error) {
      console.error("Error loading other scholarships:", error);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return "Belum ditentukan";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getImageSource = (logoPath) => {
    if (logoPath) {
      return logoPath.startsWith("http")
        ? logoPath
        : `${import.meta.env.VITE_IMAGE_URL}/${logoPath}`;
    }
    return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop";
  };

  const handleExternalApplication = (websiteUrl) => {
    if (!websiteUrl) {
      warning("Oops!", "URL website tidak tersedia");
      return;
    }

    let url = websiteUrl;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening external URL:", error);
      alertError("Gagal!", "Gagal membuka website penyedia");
    }
  };

  const getActiveSchemas = () =>
    (scholarship?.schemas || []).filter((schema) => schema.is_active);

  const generateShareTemplate = (schema) => {
    if (!scholarship) return "";

    const endDate = scholarship.end_date
      ? new Date(scholarship.end_date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Tidak ditentukan";

    const scholarshipValue = scholarship.scholarship_value
      ? `Rp ${parseFloat(scholarship.scholarship_value).toLocaleString("id-ID")}`
      : "Tidak disebutkan";

    const documents =
      schema?.documents
        ?.map((doc, idx) => `${idx + 1}. ${doc.document_name}`)
        .join("\n   ") || "-";

    const benefits =
      scholarship.benefits
        ?.map((benefit, idx) => `${idx + 1}. ${benefit.benefit_text}`)
        .join("\n   ") || "-";

    const stages =
      schema?.stages
        ?.map((stage, idx) => `${idx + 1}. ${stage.stage_name}`)
        .join("\n   ") || "-";

    const textRequirements = (schema?.requirements || [])
      .filter((req) => req.requirement_type === "TEXT")
      .map((req, idx) => `${idx + 1}. ${req.requirement_text}`)
      .join("\n   ");

    const fileRequirements = (schema?.requirements || [])
      .filter((req) => req.requirement_type === "FILE")
      .map((req, idx) => `${idx + 1}. Lihat file persyaratan terlampir`)
      .join("\n   ");

    const requirements =
      [textRequirements, fileRequirements].filter(Boolean).join("\n   ") || "-";

    const link = window.location.href;

    const template = `
🎓 *INFORMASI BEASISWA ${scholarship.name.toUpperCase()}* 🎓
${schema ? `📋 *Skema:* ${schema.name}\n` : ""}
📌 *Penyelenggara:* ${scholarship.organizer}
💰 *Nilai Beasiswa:* ${scholarshipValue}
⏰ *Durasi:* ${scholarship.duration_semesters} Semester
📅 *Batas Pendaftaran:* ${endDate}
${schema?.quota ? `👥 *Kuota Skema:* ${schema.quota} orang` : ""}

📝 *Deskripsi Beasiswa:*
${scholarship.description}

${schema?.description ? `📖 *Deskripsi Skema:*\n${schema.description}\n` : ""}

✅ *Persyaratan:*
   ${requirements}

📄 *Dokumen yang Dibutuhkan:*
   ${documents}

🎁 *Manfaat yang Diterima:*
   ${benefits}

📋 *Tahapan Seleksi:*
   ${stages}

${schema?.gpa_minimum ? `📊 *IPK Minimum:* ${schema.gpa_minimum}` : ""}
${schema?.semester_minimum ? `🎯 *Semester Minimum:* ${schema.semester_minimum}` : ""}

📞 *Contact Person:*
Nama: ${scholarship.contact_person_name}
Email: ${scholarship.contact_person_email}
Phone: ${scholarship.contact_person_phone}
${scholarship.website_url ? `\n🌐 *Website:* ${scholarship.website_url}` : ""}

🔗 *Link Pendaftaran:*
${link}

_Segera daftar dan raih kesempatan mendapatkan beasiswa ini!_
_Jangan lewatkan kesempatan emas ini! 🚀_
    `.trim();

    return template;
  };

  const handleOpenShare = () => {
    const activeSchemas = getActiveSchemas();
    setSelectedSchemaId(activeSchemas[0]?.id || null);
    setShareModalVisible(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    success("Tersalin!", "Link beasiswa telah disalin ke clipboard");
  };

  const handleCopyTemplate = () => {
    const activeSchemas = getActiveSchemas();
    const schema =
      activeSchemas.find((s) => s.id === selectedSchemaId) || activeSchemas[0];
    const template = generateShareTemplate(schema);
    navigator.clipboard.writeText(template);
    success("Berhasil!", "Template pengumuman berhasil disalin ke clipboard");
  };

  const handleWhatsAppShare = () => {
    const activeSchemas = getActiveSchemas();
    const schema =
      activeSchemas.find((s) => s.id === selectedSchemaId) || activeSchemas[0];
    const template = generateShareTemplate(schema);
    const encodedMessage = encodeURIComponent(template);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const getSchemaFaculties = (schema) =>
    schema?.effectiveFaculties || schema?.faculties || [];

  const getSchemaDepartments = (schema) =>
    schema?.effectiveDepartments || schema?.departments || [];

  const getSchemaStudyPrograms = (schema) =>
    schema?.effectiveStudyPrograms ||
    schema?.studyPrograms ||
    schema?.study_programs ||
    [];

  const isStudentEligibleForSchema = (user, schema) => {
    if (!user || !schema) return false;

    const studyProgramIds = new Set(
      getSchemaStudyPrograms(schema).map((sp) => sp.id),
    );

    const departmentIds = new Set(
      getSchemaDepartments(schema).map((d) => d.id),
    );

    const facultyIds = new Set(getSchemaFaculties(schema).map((f) => f.id));

    const hasRestriction =
      studyProgramIds.size > 0 || departmentIds.size > 0 || facultyIds.size > 0;

    if (!hasRestriction) return true;

    return (
      studyProgramIds.has(user.study_program_id) ||
      departmentIds.has(user.department_id) ||
      facultyIds.has(user.faculty_id)
    );
  };

  const handleApplyScholarship = (schema) => {
    const accessToken = localStorage.getItem("access_token");
    const user = getCurrentUser();

    if (!accessToken || !user) {
      warning("Perlu Login", "Silakan login terlebih dahulu sebagai mahasiswa");
      navigate("/login");
      return;
    }

    if (String(user.role || "").toUpperCase() !== "MAHASISWA") {
      warning(
        "Akses Ditolak",
        "Hanya akun mahasiswa yang dapat mendaftar beasiswa",
      );
      return;
    }

    if (!schema) {
      warning("Skema Tidak Ditemukan", "Silakan pilih skema yang tersedia");
      return;
    }

    if (!isStudentEligibleForSchema(user, schema)) {
      warning(
        "Tidak Memenuhi Cakupan",
        "Skema ini tidak mencakup fakultas/departemen/program studi Anda",
      );
      return;
    }

    const { complete: isProfileComplete, missing: missingFields } =
      getProfileCompleteness(user);

    if (!isProfileComplete) {
      warning(
        "Lengkapi Profil",
        `Lengkapi data berikut terlebih dahulu: ${missingFields
          .map((f) => f.label)
          .join(", ")}`,
      );
      navigate("/profile");
      return;
    }

    navigate(`/scholarship/${id}/apply?schema=${schema.id}`);
  };

  const getStatusTag = (isActive, endDate) => {
    if (!isActive) {
      return (
        <Tag
          color="red"
          icon={<ExclamationCircleOutlined />}
          className="px-3 py-1"
        >
          Tidak Aktif
        </Tag>
      );
    }

    if (!endDate) {
      return (
        <Tag color="green" icon={<CheckCircleOutlined />} className="px-3 py-1">
          Aktif
        </Tag>
      );
    }

    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <Tag color="red" icon={<ClockCircleOutlined />} className="px-3 py-1">
          Berakhir
        </Tag>
      );
    }
    if (diffDays <= 7) {
      return (
        <Tag
          color="orange"
          icon={<ClockCircleOutlined />}
          className="px-3 py-1"
        >
          Berakhir {diffDays} hari lagi
        </Tag>
      );
    }
    return (
      <Tag color="green" icon={<CheckCircleOutlined />} className="px-3 py-1">
        Aktif
      </Tag>
    );
  };

  const toggleEligible = (key) => {
    setExpandedEligible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderRegistrationSection = (schema) => {
    const user = currentUser;
    const isDeadlinePassed =
      scholarship.end_date && new Date() > new Date(scholarship.end_date);
    const isStillActive = scholarship.is_active && !isDeadlinePassed;

    if (!isStillActive) {
      return (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExclamationCircleOutlined className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-700 font-medium">
                Pendaftaran telah ditutup
              </p>
              {scholarship.end_date && (
                <p className="text-sm text-slate-500 mt-1">
                  Batas pendaftaran:{" "}
                  {new Date(scholarship.end_date).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div>
          <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <InfoCircleOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-slate-900 font-medium">
                  Silakan login terlebih dahulu
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Anda perlu login sebagai mahasiswa untuk mendaftar beasiswa
                  ini.
                </p>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              warning(
                "Perlu Login",
                "Silakan login terlebih dahulu sebagai mahasiswa",
              );
              navigate("/login");
            }}
          >
            Login untuk Mendaftar
          </Button>
        </div>
      );
    }

    if (String(user.role || "").toUpperCase() !== "MAHASISWA") {
      return (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExclamationCircleOutlined className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-900 font-medium">
                Hanya mahasiswa yang dapat mendaftar
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Akun Anda terdaftar sebagai {user.role}, bukan sebagai
                mahasiswa.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (schema && !isStudentEligibleForSchema(user, schema)) {
      return (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExclamationCircleOutlined className="text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-900 font-medium">
                Kamu tidak memenuhi cakupan skema ini
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Skema {schema.name} tidak mencakup fakultas/departemen/program
                studi Anda.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (scholarship.is_external) {
      return (
        <>
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationCircleOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                Pendaftaran dilakukan melalui website penyedia beasiswa.
              </div>
            </div>
          </div>
          <Button
            variant="success"
            className="w-full"
            onClick={() => handleExternalApplication(scholarship.website_url)}
          >
            Daftar di Website Penyedia
          </Button>
        </>
      );
    }

    const { complete: isProfileComplete, missing: missingFields } =
      getProfileCompleteness(user);

    if (!isProfileComplete) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationCircleOutlined className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-slate-900 font-medium">
                  Lengkapi profil Anda terlebih dahulu
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Data berikut belum lengkap:{" "}
                  <strong>{missingFields.map((f) => f.label).join(", ")}</strong>
                  . Silakan lengkapi data di halaman profil agar dapat
                  mendaftar beasiswa ini.
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="warning"
            className="w-full"
            onClick={() => navigate("/profile")}
          >
            Lengkapi Profil
          </Button>
        </div>
      );
    }

    return (
      <Button className="w-full" onClick={() => handleApplyScholarship(schema)}>
        Daftar Skema Ini Sekarang
      </Button>
    );
  };

  const renderSchemaTabs = () => {
    if (!scholarship.schemas || scholarship.schemas.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Belum ada skema beasiswa"
          className="my-8"
        />
      );
    }

    const activeSchemas = getActiveSchemas();

    if (activeSchemas.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Tidak ada skema aktif saat ini"
          className="my-8"
        />
      );
    }

    const tabItems = activeSchemas.map((schema) => {
      const schemaFaculties = getSchemaFaculties(schema);
      const schemaDepartments = getSchemaDepartments(schema);
      const schemaStudyPrograms = getSchemaStudyPrograms(schema);

      return {
        key: schema.id,
        label: (
          <span className="flex items-center gap-2">
            <FormOutlined />
            {schema.name}
          </span>
        ),
        children: (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <InfoCircleOutlined className="mr-2 text-blue-600" />
                Informasi Skema
              </h3>
              {schema.description && (
                <p className="text-slate-700 mb-4">{schema.description}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schema.quota && (
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                    <span className="text-slate-600">Kuota:</span>
                    <span className="font-semibold text-slate-900">
                      {schema.quota} orang
                    </span>
                  </div>
                )}
                {schema.gpa_minimum && (
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                    <span className="text-slate-600">Minimum IPK:</span>
                    <span className="font-semibold text-slate-900">
                      {schema.gpa_minimum}
                    </span>
                  </div>
                )}
                {schema.semester_minimum && (
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                    <span className="text-slate-600">Minimum Semester:</span>
                    <span className="font-semibold text-slate-900">
                      {schema.semester_minimum}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <CheckCircleOutlined className="mr-2 text-emerald-600" />
                Persyaratan Skema
              </h3>
              {schema.requirements && schema.requirements.length > 0 ? (
                <div className="space-y-3">
                  {schema.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <div className="flex-1">
                        {req.requirement_type === "TEXT" && (
                          <span className="text-slate-700">
                            {req.requirement_text}
                          </span>
                        )}
                        {req.requirement_type === "FILE" &&
                          req.requirement_file && (
                            <a
                              href={`${import.meta.env.VITE_IMAGE_URL}/${
                                req.requirement_file
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                            >
                              <FileTextOutlined />
                              Lihat syarat & ketentuan (PDF)
                            </a>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Belum ada persyaratan khusus"
                  className="my-4"
                />
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <FileTextOutlined className="mr-2 text-blue-600" />
                Dokumen yang Diperlukan
              </h3>
              {schema.documents && schema.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {schema.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <div className="flex-1">
                        <span className="text-slate-700">
                          {doc.document_name}
                        </span>
                        {doc.template_file && (
                          <a
                            href={`${import.meta.env.VITE_IMAGE_URL}/${
                              doc.template_file
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-blue-600 hover:text-blue-800 mt-1"
                          >
                            Download template
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Tidak ada dokumen yang diperlukan"
                  className="my-4"
                />
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <TrophyOutlined className="mr-2 text-blue-600" />
                Tahapan Seleksi
              </h3>
              {schema.stages && schema.stages.length > 0 ? (
                <Timeline
                  items={schema.stages
                    .sort((a, b) => a.order_no - b.order_no)
                    .map((stage, stageIdx) => {
                      const formatStageDate = (date) => {
                        if (!date) return null;
                        return new Date(date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      };

                      const startLabel = stage.start_date
                        ? formatStageDate(stage.start_date)
                        : null;
                      const endLabel = stage.end_date
                        ? formatStageDate(stage.end_date)
                        : null;

                      return {
                        dot: (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {stageIdx + 1}
                          </div>
                        ),
                        children: (
                          <div className="ml-4">
                            <h4 className="font-semibold text-slate-900">
                              {stage.stage_name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              Waktu Pelaksanaan:{" "}
                              {startLabel && endLabel
                                ? `${startLabel} — ${endLabel}`
                                : startLabel
                                  ? `${startLabel}`
                                  : endLabel
                                    ? `${endLabel}`
                                    : "TBA"}
                            </p>
                          </div>
                        ),
                      };
                    })}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Belum ada tahapan seleksi"
                  className="my-4"
                />
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Cakupan Eligible
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Fakultas Eligible</h4>

                  {schemaFaculties.length > 0 ? (
                    <div className="space-y-2">
                      {[...schemaFaculties]
                        .sort((a, b) =>
                          (a.name || "").localeCompare(b.name || "", "id-ID"),
                        )
                        .slice(
                          0,
                          expandedEligible.faculties
                            ? schemaFaculties.length
                            : 6,
                        )
                        .map((faculty) => (
                          <div
                            key={faculty.id}
                            className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md"
                          >
                            <RightOutlined className="text-slate-400 text-xs" />
                            <span className="text-slate-700">
                              {faculty.name}
                            </span>
                          </div>
                        ))}

                      {schemaFaculties.length > 6 && (
                        <button
                          type="button"
                          onClick={() => toggleEligible("faculties")}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {expandedEligible.faculties
                            ? "Sembunyikan"
                            : `Lihat semua (${schemaFaculties.length})`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">Tidak Ada</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Departemen Eligible</h4>

                  {schemaDepartments?.length > 0 ? (
                    <div className="space-y-2">
                      {[...schemaDepartments]
                        .sort((a, b) =>
                          (a.name || "").localeCompare(b.name || "", "id-ID"),
                        )
                        .slice(
                          0,
                          expandedEligible.departments
                            ? schemaDepartments.length
                            : 6,
                        )
                        .map((department) => (
                          <div
                            key={department.id}
                            className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md"
                          >
                            <RightOutlined className="text-slate-400 text-xs" />
                            <span className="text-slate-700">
                              {department.name}
                            </span>
                          </div>
                        ))}

                      {schemaDepartments.length > 6 && (
                        <button
                          type="button"
                          onClick={() => toggleEligible("departments")}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {expandedEligible.departments
                            ? "Sembunyikan"
                            : `Lihat semua (${schemaDepartments.length})`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">Tidak Ada</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Program Studi Eligible</h4>

                {schemaStudyPrograms?.length > 0 ? (
                  <div className="space-y-2">
                    {[...schemaStudyPrograms]
                      .sort((a, b) => {
                        const nameCompare = (a.name || "").localeCompare(
                          b.name || "",
                          "id-ID",
                        );
                        if (nameCompare !== 0) return nameCompare;

                        return (a.degree || "").localeCompare(
                          b.degree || "",
                          "id-ID",
                        );
                      })
                      .slice(
                        0,
                        expandedEligible.studyPrograms
                          ? schemaStudyPrograms.length
                          : 6,
                      )
                      .map((studyProgram) => (
                        <div
                          key={studyProgram.id}
                          className="flex items-center justify-between space-x-2 p-2 bg-slate-50 rounded-md"
                        >
                          <div className="flex items-center space-x-2">
                            <RightOutlined className="text-slate-400 text-xs" />
                            <span className="text-slate-700">
                              {studyProgram.name}
                            </span>
                          </div>

                          {studyProgram.degree && (
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {studyProgram.degree}
                            </span>
                          )}
                        </div>
                      ))}

                    {schemaStudyPrograms.length > 6 && (
                      <button
                        type="button"
                        onClick={() => toggleEligible("studyPrograms")}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {expandedEligible.studyPrograms
                          ? "Sembunyikan"
                          : `Lihat semua (${schemaStudyPrograms.length})`}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Tidak Ada</p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                Tertarik dengan skema ini?
              </h4>
              {renderRegistrationSection(schema)}
            </div>
          </div>
        ),
      };
    });

    return (
      <Tabs
        activeKey={activeSchemaTab || activeSchemas[0]?.id}
        onChange={(key) => {
          setActiveSchemaTab(key);
          setExpandedEligible({
            faculties: false,
            departments: false,
            studyPrograms: false,
          });
        }}
        items={tabItems}
        type="card"
        className="schema-tabs"
      />
    );
  };

  if (loading) {
    return (
      <GuestLayout>
        <SkeletonDetailScholarship />
      </GuestLayout>
    );
  }

  if (error && !scholarship) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center max-w-md">
              <Empty
                image={
                  <FileSearchOutlined className="text-6xl text-slate-300" />
                }
                description={
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-slate-700">
                      Beasiswa Tidak Ditemukan
                    </div>
                    <div className="text-slate-500">{error}</div>
                  </div>
                }
              >
                <div className="space-x-3">
                  <Button
                    onClick={() => navigate("/scholarship")}
                    className="inline-flex items-center"
                  >
                    <HomeOutlined className="mr-2" />
                    Kembali ke Daftar Beasiswa
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={loadScholarshipDetail}
                    className="inline-flex items-center"
                  >
                    <ReloadOutlined className="mr-2" />
                    Coba Lagi
                  </Button>
                </div>
              </Empty>
            </div>
          </div>
        </div>
      </GuestLayout>
    );
  }

  return (
    <>
      <GuestLayout>
        <div className="bg-[#142a5c] text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
            <nav className="mb-8 text-sm text-blue-200">
              <Link
                to="/scholarship"
                className="hover:text-white transition-colors"
              >
                Beasiswa
              </Link>
              <span className="mx-2">/</span>
              <span>{scholarship.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-4">
                  <img
                    src={getImageSource(scholarship.logo_path)}
                    alt={scholarship.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-4">
                    {scholarship.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="flex items-center bg-white/10 px-3 py-1 rounded-md">
                      <BankOutlined className="mr-2" />
                      {scholarship.organizer}
                    </span>
                    <span className="flex items-center bg-white/10 px-3 py-1 rounded-md">
                      <CalendarOutlined className="mr-2" />
                      {scholarship.year}
                    </span>
                    {getStatusTag(scholarship.is_active, scholarship.end_date)}
                    <button
                      onClick={handleOpenShare}
                      className="flex items-center bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md transition-colors ml-auto"
                      title="Bagikan beasiswa"
                    >
                      <ShareAltOutlined className="mr-1" />
                      <span className="text-sm">Bagikan</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">
                      {formatCurrency(scholarship.scholarship_value)}
                    </div>
                    <div className="text-sm text-blue-200">
                      Nilai Beasiswa
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">
                      {scholarship.duration_semesters}
                    </div>
                    <div className="text-sm text-blue-200">
                      Durasi (Semester)
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">
                      {scholarship.schemas?.filter((s) => s.is_active).length ||
                        0}
                    </div>
                    <div className="text-sm text-blue-200">Skema Aktif</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <StarOutlined className="mr-2 text-blue-600" />
                  Informasi Umum
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Periode Pendaftaran:</span>
                    <span className="font-semibold text-slate-900">
                      {formatDate(scholarship.start_date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Batas Pendaftaran:</span>
                    <span className="font-semibold text-red-600">
                      {formatDate(scholarship.end_date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <FileTextOutlined className="mr-2 text-blue-600" />
                  Deskripsi Beasiswa
                </h2>
                {scholarship.description ? (
                  <div className="prose max-w-none text-slate-700 leading-relaxed">
                    {scholarship.description
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0 text-justify">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Belum ada deskripsi"
                    className="my-8"
                  />
                )}
              </div>

              {scholarship.benefits && scholarship.benefits.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <StarOutlined className="mr-2 text-blue-600" />
                    Benefit Beasiswa
                  </h2>
                  <div className="space-y-3">
                    {scholarship.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-md"
                      >
                        <span className="text-slate-700">
                          {benefit.benefit_text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <FormOutlined className="mr-2 text-blue-600" />
                  Skema Beasiswa yang Tersedia
                </h2>
                {renderSchemaTabs()}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Beasiswa Lainnya
                  </h3>
                  {otherScholarships.length > 0 ? (
                    <div className="space-y-4">
                      {otherScholarships.map((otherScholarship) => (
                        <Link
                          key={otherScholarship.id}
                          to={`/scholarship/${otherScholarship.id}`}
                          className="block"
                        >
                          <div className="flex space-x-3 p-3 rounded-md hover:bg-slate-50 transition-colors">
                            <img
                              src={getImageSource(otherScholarship.logo_path)}
                              alt={otherScholarship.name}
                              className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-slate-900 truncate hover:text-blue-600">
                                {otherScholarship.name}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {otherScholarship.organizer}
                              </p>
                              <div className="text-xs font-semibold text-emerald-600">
                                {formatCurrency(
                                  otherScholarship.scholarship_value,
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Divider className="my-4" />
                      <Link
                        to="/scholarship"
                        className="block text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-2 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        Lihat Semua Beasiswa
                      </Link>
                    </div>
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Belum ada beasiswa lainnya"
                      className="my-4"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </GuestLayout>

      <AntModal
        title={
          <div className="flex items-center gap-2">
            <ShareAltOutlined className="text-blue-600" />
            <span className="font-semibold">Bagikan Beasiswa</span>
          </div>
        }
        open={shareModalVisible}
        onCancel={() => {
          setShareModalVisible(false);
          setSelectedSchemaId(null);
        }}
        width={800}
        footer={null}
      >
        {scholarship && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900">
                {scholarship.name}
              </h4>
              <p className="text-sm text-slate-600">{scholarship.organizer}</p>
            </div>

            {getActiveSchemas().length > 1 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pilih Skema:
                </label>
                <Tabs
                  activeKey={selectedSchemaId}
                  onChange={setSelectedSchemaId}
                  items={getActiveSchemas().map((schema) => ({
                    key: schema.id,
                    label: (
                      <span className="flex items-center gap-2">
                        {schema.name}
                        {schema.quota && (
                          <Tag color="blue">{schema.quota} kuota</Tag>
                        )}
                      </span>
                    ),
                  }))}
                  type="card"
                />
              </div>
            )}

            <div className="bg-white border border-slate-200 p-4 rounded-lg max-h-72 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                {generateShareTemplate(
                  getActiveSchemas().find((s) => s.id === selectedSchemaId) ||
                    getActiveSchemas()[0],
                )}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1"
                onClick={handleCopyLink}
              >
                <CopyOutlined className="mr-1" />
                Salin Link
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleCopyTemplate}
              >
                <CopyOutlined className="mr-1" />
                Salin Template
              </Button>
              <Button
                variant="success"
                className="flex-1"
                onClick={handleWhatsAppShare}
              >
                <FaWhatsapp className="mr-1 inline" />
                WhatsApp
              </Button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <p className="text-xs text-slate-600">
                <strong>Tips:</strong> Gunakan tombol WhatsApp untuk langsung
                mengirim pengumuman, atau salin template untuk diedit terlebih
                dahulu sebelum dibagikan.
              </p>
            </div>
          </div>
        )}
      </AntModal>
    </>
  );
};

export default DetailScholarship;
