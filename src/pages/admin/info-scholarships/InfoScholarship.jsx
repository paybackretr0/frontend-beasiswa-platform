import { useState, useEffect } from "react";
import { Spin, Input, Modal, Button } from "antd";
import {
  MdSearch,
  MdShare,
  MdCalendarToday,
  MdAttachMoney,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
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
  const [shareTemplate, setShareTemplate] = useState("");

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
            .includes(searchQuery.toLowerCase())
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

  const generateShareTemplate = (scholarship) => {
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
      scholarship.scholarshipDocuments
        ?.map((doc, idx) => `${idx + 1}. ${doc.document_name}`)
        .join("\n   ") || "-";

    const benefits =
      scholarship.benefits
        ?.map((benefit, idx) => `${idx + 1}. ${benefit.benefit_text}`)
        .join("\n   ") || "-";

    const stages =
      scholarship.stages
        ?.map((stage, idx) => `${idx + 1}. ${stage.stage_name}`)
        .join("\n   ") || "-";

    const requirements =
      scholarship.requirements
        ?.filter((req) => req.requirement_type === "TEXT")
        .map((req, idx) => `${idx + 1}. ${req.requirement_text}`)
        .join("\n   ") || "-";

    const template = `
🎓 *INFORMASI BEASISWA ${scholarship.name.toUpperCase()}* 🎓

📌 *Penyelenggara:* ${scholarship.organizer}
💰 *Nilai Beasiswa:* ${scholarshipValue}
⏰ *Durasi:* ${scholarship.duration_semesters} Semester
📅 *Batas Pendaftaran:* ${endDate}
${scholarship.quota ? `👥 *Kuota:* ${scholarship.quota} orang` : ""}

📝 *Deskripsi:*
${scholarship.description}

✅ *Persyaratan:*
   ${requirements}

📄 *Dokumen yang Dibutuhkan:*
   ${documents}

🎁 *Manfaat yang Diterima:*
   ${benefits}

📋 *Tahapan Seleksi:*
   ${stages}

${scholarship.gpa_minimum ? `📊 *IPK Minimum:* ${scholarship.gpa_minimum}` : ""}
🎯 *Semester Minimum:* ${scholarship.semester_minimum}

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

  const handleShare = (scholarship) => {
    setSelectedScholarship(scholarship);
    const template = generateShareTemplate(scholarship);
    setShareTemplate(template);
    setShareModalVisible(true);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(shareTemplate);
    success("Berhasil!", "Template berhasil disalin ke clipboard");
  };

  const handleWhatsAppShare = () => {
    const encodedMessage = encodeURIComponent(shareTemplate);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Informasi Beasiswa
          </h1>
          <p className="text-gray-600 mt-1">
            Daftar beasiswa aktif yang dapat dibagikan kepada mahasiswa
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-blue-700">
            {filteredScholarships.length} Beasiswa Aktif
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <Input
          prefix={<MdSearch className="text-gray-400" />}
          placeholder="Cari beasiswa berdasarkan nama atau penyelenggara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="large"
          className="w-full"
        />
      </div>

      {/* Scholarship Cards Grid */}
      {filteredScholarships.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500">
            {searchQuery
              ? "Tidak ada beasiswa yang sesuai dengan pencarian"
              : "Belum ada beasiswa aktif saat ini"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card
              key={scholarship.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              {/* Logo */}
              {scholarship.logo_path && (
                <div className="flex justify-center py-4 bg-gray-50">
                  <img
                    src={scholarship.logo_path}
                    alt={scholarship.name}
                    className="h-24 object-contain"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Title & Organizer */}
                <div>
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
                    {scholarship.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {scholarship.organizer}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3">
                  {scholarship.description}
                </p>

                {/* Info Grid */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MdAttachMoney className="text-green-600" />
                    <span className="text-gray-700">
                      {formatCurrency(scholarship.scholarship_value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MdCalendarToday className="text-blue-600" />
                    <span className="text-gray-700">
                      {formatDate(scholarship.end_date)}
                    </span>
                  </div>
                </div>

                {/* Days Remaining Badge */}
                <div className="flex items-center justify-between">
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
                  <span className="text-xs text-gray-500">
                    Tahun {scholarship.year}
                  </span>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => handleShare(scholarship)}
                  className="w-full flex items-center justify-center gap-2 bg-[#2D60FF] hover:bg-[#1E4FCC] text-white py-2.5 rounded-lg transition-colors duration-200 font-medium"
                >
                  <MdShare size={18} />
                  <span>Share Template</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Share Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MdShare className="text-[#2D60FF]" size={24} />
            <span>Template Berbagi Beasiswa</span>
          </div>
        }
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        width={700}
        footer={null}
      >
        {selectedScholarship && (
          <div className="space-y-4">
            {/* Scholarship Name */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-gray-800">
                {selectedScholarship.name}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedScholarship.organizer}
              </p>
            </div>

            {/* Template Preview */}
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {shareTemplate}
              </pre>
            </div>

            {/* Action Buttons */}
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

            {/* Info */}
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Tips:</strong> Anda dapat menyalin template dan
                mengirimnya melalui WhatsApp Business atau broadcast group untuk
                menjangkau lebih banyak mahasiswa.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InfoScholarship;
