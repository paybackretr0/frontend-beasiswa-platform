import { useState, useEffect } from "react";
import {
  Spin,
  Input,
  Button,
  Tabs,
  Tag,
  Collapse,
  Modal as AntModal,
} from "antd";
import {
  MdSearch,
  MdShare,
  MdCalendarToday,
  MdAttachMoney,
  MdSchool,
  MdCheckCircle,
  MdInfo,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import {
  FileTextOutlined,
  TrophyOutlined,
  FormOutlined,
  DownloadOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import Card from "../../../components/Card";
import { fetchActiveScholarshipsForInfo } from "../../../services/scholarshipService";
import useAlert from "../../../hooks/useAlert";
import AlertContainer from "../../../components/AlertContainer";

const InfoScholarship = () => {
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [selectedSchemaId, setSelectedSchemaId] = useState(null);

  const { alerts, success, error, removeAlert } = useAlert();

  useEffect(() => {
    document.title = "Informasi Beasiswa";
    fetchScholarships();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredScholarships(scholarships);
    } else {
      const filtered = scholarships.filter(
        (scholarship) =>
          scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.organizer
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          scholarship.schemas?.some((schema) =>
            schema.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredScholarships(filtered);
    }
  }, [searchQuery, scholarships]);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const data = await fetchActiveScholarshipsForInfo();
      setScholarships(data);
      setFilteredScholarships(data);
    } catch (err) {
      error("Gagal!", err.message || "Gagal memuat data beasiswa");
    } finally {
      setLoading(false);
    }
  };

  const getImageSource = (logoPath) => {
    if (logoPath) {
      return logoPath.startsWith("http")
        ? logoPath
        : `${import.meta.env.VITE_IMAGE_URL}/${logoPath}`;
    }
    return "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80";
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `${import.meta.env.VITE_IMAGE_URL}/${filePath}`;
  };

  const getCleanFileName = (filePath) => {
    if (!filePath) return "File";
    const fileName = filePath.split("/").pop().split("\\").pop();
    return fileName.replace(/^\d+-/, "");
  };

  const handleDownloadFile = (filePath, fileName = null) => {
    const fileUrl = getFileUrl(filePath);
    if (!fileUrl) {
      error("Gagal!", "File tidak ditemukan");
      return;
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || getCleanFileName(filePath);
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success("Berhasil!", "File sedang diunduh");
  };

  const generateShareTemplate = (scholarship, schema) => {
    const endDate = new Date(scholarship.end_date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const scholarshipValue = scholarship.scholarship_value
      ? `Rp ${parseFloat(scholarship.scholarship_value).toLocaleString(
          "id-ID"
        )}`
      : "Tidak disebutkan";

    const documents =
      schema.documents
        ?.map((doc, idx) => `${idx + 1}. ${doc.document_name}`)
        .join("\n   ") || "-";

    const benefits =
      scholarship.benefits
        ?.map((benefit, idx) => `${idx + 1}. ${benefit.benefit_text}`)
        .join("\n   ") || "-";

    const stages =
      schema.stages
        ?.map((stage, idx) => `${idx + 1}. ${stage.stage_name}`)
        .join("\n   ") || "-";

    const textRequirements = schema.requirements
      ?.filter((req) => req.requirement_type === "TEXT")
      .map((req, idx) => `${idx + 1}. ${req.requirement_text}`)
      .join("\n   ");

    const fileRequirements = schema.requirements
      ?.filter((req) => req.requirement_type === "FILE")
      .map((req, idx) => `${idx + 1}. Lihat file persyaratan terlampir`)
      .join("\n   ");

    const requirements =
      [textRequirements, fileRequirements].filter(Boolean).join("\n   ") || "-";

    const template = `
🎓 *INFORMASI BEASISWA ${scholarship.name.toUpperCase()}* 🎓
📋 *Skema: ${schema.name}*

📌 *Penyelenggara:* ${scholarship.organizer}
💰 *Nilai Beasiswa:* ${scholarshipValue}
⏰ *Durasi:* ${scholarship.duration_semesters} Semester
📅 *Batas Pendaftaran:* ${endDate}
${schema.quota ? `👥 *Kuota Skema:* ${schema.quota} orang` : ""}

📝 *Deskripsi Beasiswa:*
${scholarship.description}

${schema.description ? `📖 *Deskripsi Skema:*\n${schema.description}\n` : ""}

✅ *Persyaratan:*
   ${requirements}

📄 *Dokumen yang Dibutuhkan:*
   ${documents}

🎁 *Manfaat yang Diterima:*
   ${benefits}

📋 *Tahapan Seleksi:*
   ${stages}

${schema.gpa_minimum ? `📊 *IPK Minimum:* ${schema.gpa_minimum}` : ""}
${
  schema.semester_minimum
    ? `🎯 *Semester Minimum:* ${schema.semester_minimum}`
    : ""
}

📞 *Contact Person:*
Nama: ${scholarship.contact_person_name}
Email: ${scholarship.contact_person_email}
Phone: ${scholarship.contact_person_phone}

${scholarship.website_url ? `🌐 *Website:* ${scholarship.website_url}` : ""}

_Segera daftar dan raih kesempatan mendapatkan beasiswa ini!_
_Jangan lewatkan kesempatan emas ini! 🚀_
    `.trim();

    return template;
  };

  const handleShare = (scholarship, schemaId = null) => {
    setSelectedScholarship(scholarship);
    setSelectedSchemaId(schemaId || scholarship.schemas?.[0]?.id || null);
    setShareModalVisible(true);
  };

  const getShareTemplate = () => {
    if (!selectedScholarship || !selectedSchemaId) return "";
    const schema = selectedScholarship.schemas.find(
      (s) => s.id === selectedSchemaId
    );
    if (!schema) return "";
    return generateShareTemplate(selectedScholarship, schema);
  };

  const handleCopyTemplate = () => {
    const template = getShareTemplate();
    navigator.clipboard.writeText(template);
    success("Berhasil!", "Template berhasil disalin ke clipboard");
  };

  const handleWhatsAppShare = () => {
    const template = getShareTemplate();
    const encodedMessage = encodeURIComponent(template);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const formatCurrency = (value) => {
    return `Rp ${parseFloat(value).toLocaleString("id-ID")}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Sudah ditutup";
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Besok";
    return `${diffDays} hari lagi`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AlertContainer
        alerts={alerts}
        removeAlert={removeAlert}
        position="top-right"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Informasi Beasiswa
          </h1>
          <p className="text-gray-600 mt-1">
            Daftar beasiswa aktif dengan skema yang dapat dibagikan kepada
            mahasiswa
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              {filteredScholarships.length} Beasiswa
            </span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-green-700">
              {filteredScholarships.reduce(
                (sum, s) => sum + (s.total_schemas || 0),
                0
              )}{" "}
              Skema
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <Input
          prefix={<MdSearch className="text-gray-400" />}
          placeholder="Cari beasiswa berdasarkan nama, penyelenggara, atau skema..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="large"
          className="w-full"
        />
      </div>

      {filteredScholarships.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "Tidak ada beasiswa yang sesuai dengan pencarian"
              : "Belum ada beasiswa aktif saat ini"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card
              key={scholarship.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start gap-4 mb-4">
                {scholarship.logo_path && (
                  <img
                    src={getImageSource(scholarship.logo_path)}
                    alt={scholarship.name}
                    className="w-20 h-20 object-contain bg-gray-50 rounded-lg p-2"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {scholarship.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {scholarship.organizer}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Tag color="blue">{scholarship.year}</Tag>
                    <Tag color="green">{scholarship.total_schemas} Skema</Tag>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MdAttachMoney className="text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    {formatCurrency(scholarship.scholarship_value)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MdSchool className="text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    {scholarship.duration_semesters} Semester
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MdCalendarToday className="text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    {formatDate(scholarship.end_date)}
                  </span>
                </div>
              </div>

              {scholarship.total_quota > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Total Kuota:</span>
                      <div className="font-semibold text-blue-700">
                        {scholarship.total_quota} orang
                      </div>
                    </div>
                    {scholarship.min_gpa && (
                      <div>
                        <span className="text-gray-600">Min. IPK:</span>
                        <div className="font-semibold text-blue-700">
                          {scholarship.min_gpa}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <Collapse
                  size="small"
                  items={scholarship.schemas?.map((schema) => ({
                    key: schema.id,
                    label: (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">
                          <FormOutlined className="mr-2 text-blue-500" />
                          {schema.name}
                        </span>
                        {schema.quota && (
                          <Tag color="blue" className="ml-2">
                            {schema.quota} kuota
                          </Tag>
                        )}
                      </div>
                    ),
                    children: (
                      <div className="space-y-3">
                        {schema.description && (
                          <div className="text-sm text-gray-600 bg-gray-50 rounded">
                            {schema.description}
                          </div>
                        )}

                        {schema.requirements &&
                          schema.requirements.length > 0 && (
                            <div>
                              <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                                <MdCheckCircle className="mr-1 text-green-500" />
                                Persyaratan
                              </h5>
                              <ul className="space-y-2">
                                {schema.requirements.map((req, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-gray-600 flex items-start"
                                  >
                                    <span className="mr-2 mt-0.5">•</span>
                                    <div className="flex-1">
                                      {req.requirement_type === "TEXT" ? (
                                        <span>{req.requirement_text}</span>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <Button
                                            type="link"
                                            size="small"
                                            icon={<FilePdfOutlined />}
                                            onClick={() =>
                                              handleDownloadFile(
                                                req.requirement_file,
                                                `Persyaratan_${schema.name}_${
                                                  i + 1
                                                }.pdf`
                                              )
                                            }
                                            className="p-0 h-auto text-blue-600 hover:text-blue-800"
                                          >
                                            Lihat File Persyaratan
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {schema.documents && schema.documents.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                              <FileTextOutlined className="mr-1 text-red-500" />
                              Dokumen & Template
                            </h5>
                            <div className="space-y-2">
                              {schema.documents.map((doc, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between text-xs text-gray-600 bg-red-50 px-3 py-2 rounded hover:bg-red-100 transition-colors"
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    <span>{doc.document_name}</span>
                                  </div>
                                  {doc.template_file && (
                                    <Button
                                      type="link"
                                      size="small"
                                      icon={<DownloadOutlined />}
                                      onClick={() =>
                                        handleDownloadFile(
                                          doc.template_file,
                                          `Template_${doc.document_name}.pdf`
                                        )
                                      }
                                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                                    >
                                      Template
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {schema.stages && schema.stages.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                              <TrophyOutlined className="mr-1 text-purple-500" />
                              Tahapan
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {schema.stages.map((stage, i) => (
                                <Tag key={i} color="purple" className="text-xs">
                                  {i + 1}. {stage.stage_name}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(scholarship, schema.id);
                          }}
                          className="w-full mt-3 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <MdShare size={16} />
                          <span>Share Skema Ini</span>
                        </button>
                      </div>
                    ),
                  }))}
                  defaultActiveKey={scholarship.schemas?.[0]?.id}
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getDaysRemaining(scholarship.end_date).includes("hari")
                      ? "bg-yellow-100 text-yellow-800"
                      : getDaysRemaining(scholarship.end_date) === "Besok" ||
                        getDaysRemaining(scholarship.end_date) === "Hari ini"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {getDaysRemaining(scholarship.end_date)}
                </div>

                <button
                  onClick={() => handleShare(scholarship)}
                  className="flex items-center gap-2 bg-[#2D60FF] hover:bg-[#1E4FCC] text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  <MdShare size={16} />
                  <span>Share</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AntModal
        title={
          <div className="flex items-center gap-2">
            <MdShare className="text-[#2D60FF]" size={24} />
            <span className="font-semibold">Template Berbagi Beasiswa</span>
          </div>
        }
        open={shareModalVisible}
        onCancel={() => {
          setShareModalVisible(false);
          setSelectedScholarship(null);
          setSelectedSchemaId(null);
        }}
        width={800}
        footer={null}
      >
        {selectedScholarship && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800">
                {selectedScholarship.name}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedScholarship.organizer}
              </p>
            </div>

            {selectedScholarship.schemas &&
              selectedScholarship.schemas.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Skema yang Akan Dibagikan:
                  </label>
                  <Tabs
                    activeKey={selectedSchemaId}
                    onChange={setSelectedSchemaId}
                    items={selectedScholarship.schemas.map((schema) => ({
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

            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {getShareTemplate()}
              </pre>
            </div>

            <div className="flex gap-3">
              <Button
                type="default"
                icon={<MdShare />}
                onClick={handleCopyTemplate}
                className="flex-1"
                size="large"
              >
                Salin Template
              </Button>
              <Button
                type="primary"
                icon={<FaWhatsapp />}
                onClick={handleWhatsAppShare}
                className="flex-1 bg-green-500 hover:bg-green-600 border-green-500"
                size="large"
              >
                Bagikan ke WhatsApp
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Tips:</strong> Anda dapat menyalin template dan
                mengirimkan melalui WhatsApp Business atau broadcast group untuk
                menjangkau lebih banyak mahasiswa. Setiap skema memiliki
                template yang berbeda sesuai dengan persyaratan dan dokumen yang
                dibutuhkan.
              </p>
            </div>
          </div>
        )}
      </AntModal>
    </div>
  );
};

export default InfoScholarship;
