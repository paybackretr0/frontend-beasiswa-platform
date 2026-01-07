import { useEffect, useState } from "react";
import { Spin, Tag } from "antd";
import UniversalTable, {
  createNumberColumn,
  createActionColumn,
} from "../../../components/Table";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Card from "../../../components/Card";
import {
  getAllApplications,
  getApplicationsSummary,
  getApplicationDetail,
} from "../../../services/applicationService";
import {
  verifyApplication,
  rejectApplication,
} from "../../../services/verifikatorService";
import {
  validateApplication,
  rejectApplicationByValidator,
} from "../../../services/validatorService";
import ApplicationDetailModal from "../../../components/ApplicationDetailModal";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";
import UniversalModal from "../../../components/Modal";

const ApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedApplicationForReject, setSelectedApplicationForReject] =
    useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const { alerts, success, error, removeAlert, clearAlerts, warning } =
    useAlert();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {}
  const role = user?.role?.toUpperCase() || null;

  useEffect(() => {
    document.title = "Kelola Pendaftaran - Admin";
    clearAlerts();
    fetchApplications();
    fetchSummary();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getAllApplications();
      const transformedData = data.map((item, index) => ({
        key: item.id || index,
        id: item.id,
        nama: item.nama,
        email: item.email,
        beasiswa: item.beasiswa,
        tanggalDaftar: item.tanggalDaftar,
        status: getStatusLabel(item.status),
        rawStatus: item.status,
        notes: item.notes,
        scholarship_id: item.scholarship_id,
        student_id: item.student_id,
      }));
      setApplications(transformedData);
    } catch (err) {
      console.error("Error fetching applications:", err);
      error("Gagal!", err.message || "Gagal memuat data pendaftaran");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const data = await getApplicationsSummary();
      const summary = [
        {
          title: "Total Pendaftar",
          value: data.total,
          color: "text-blue-600",
        },
        {
          title: "Menunggu Verifikasi",
          value: data.menunggu_verifikasi,
          color: "text-orange-600",
        },
        {
          title: "Terverifikasi - Menunggu Validasi",
          value: data.menunggu_validasi,
          color: "text-yellow-600",
        },
        {
          title: "Dikembalikan",
          value: data.dikembalikan,
          color: "text-red-600",
        },
      ];
      setSummaryData(summary);
    } catch (err) {
      console.error("Error fetching summary:", err);
      error("Gagal!", err.message || "Gagal memuat ringkasan data");
    } finally {
      setSummaryLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
      VERIFIED: "Terverifikasi - Menunggu Validasi",
      REJECTED: "Dikembalikan",
      VALIDATED: "Disetujui",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      "Menunggu Verifikasi": "orange",
      "Terverifikasi - Menunggu Validasi": "blue",
      Dikembalikan: "red",
      Disetujui: "green",
    };
    return colorMap[status] || "default";
  };

  const handleDetail = async (record) => {
    try {
      setDetailLoading(true);
      setDetailModalVisible(true);

      const detail = await getApplicationDetail(record.id);
      setSelectedApplication(detail);
    } catch (err) {
      console.error("Error fetching application detail:", err);
      error("Gagal!", err.message || "Gagal memuat detail pendaftaran");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedApplication(null);
  };

  const handleVerify = async (record) => {
    try {
      await verifyApplication(record.id, "");
      success(
        "Berhasil!",
        `Pendaftaran ${
          record.nama || record.student?.nama
        } berhasil diverifikasi`
      );

      await fetchApplications();
      await fetchSummary();

      if (detailModalVisible) {
        setDetailModalVisible(false);
        setSelectedApplication(null);
      }
    } catch (err) {
      console.error("Error verifying application:", err);
      error("Gagal!", err.message || "Gagal memverifikasi pendaftaran");
    }
  };

  const handleValidate = async (record) => {
    try {
      await validateApplication(record.id, "");
      success(
        "Berhasil!",
        `Pendaftaran ${record.nama || record.student?.nama} berhasil divalidasi`
      );

      await fetchApplications();
      await fetchSummary();

      if (detailModalVisible) {
        setDetailModalVisible(false);
        setSelectedApplication(null);
      }
    } catch (err) {
      console.error("Error validating application:", err);
      error("Gagal!", err.message || "Gagal memvalidasi pendaftaran");
    }
  };

  const handleReject = async (record) => {
    setSelectedApplicationForReject(record);
    setRejectModalVisible(true);
  };

  const handleCloseRejectModal = () => {
    setRejectModalVisible(false);
    setSelectedApplicationForReject(null);
  };

  const handleSubmitReject = async (values) => {
    const { notes } = values;
    const record = selectedApplicationForReject;

    if (!notes || !notes.trim()) {
      warning("Gagal!", "Alasan penolakan harus diisi");
      return;
    }

    try {
      setRejectLoading(true);

      const currentStatus = record.status || record.rawStatus;

      if (role === "VERIFIKATOR" && currentStatus === "Menunggu Verifikasi") {
        await rejectApplication(record.id, notes);
      } else if (
        role === "PIMPINAN_DITMAWA" &&
        currentStatus === "Terverifikasi - Menunggu Validasi"
      ) {
        await rejectApplicationByValidator(record.id, notes);
      } else {
        warning(
          "Gagal!",
          "Anda tidak memiliki akses untuk menolak pendaftaran ini"
        );
        return;
      }

      success(
        "Berhasil!",
        `Pendaftaran ${record.nama || record.student?.nama} berhasil ditolak`
      );

      await fetchApplications();
      await fetchSummary();

      if (detailModalVisible) {
        setDetailModalVisible(false);
        setSelectedApplication(null);
      }

      handleCloseRejectModal();
    } catch (err) {
      console.error("Error rejecting application:", err);
      warning("Gagal!", err.message || "Gagal menolak pendaftaran");
    } finally {
      setRejectLoading(false);
    }
  };

  const rejectModalFields = [
    {
      name: "notes",
      label: "Alasan Penolakan",
      type: "textarea",
      placeholder: "Masukkan alasan penolakan...",
      rows: 5,
      maxLength: 500,
      rules: [
        { required: true, message: "Alasan penolakan harus diisi" },
        { min: 10, message: "Alasan penolakan minimal 10 karakter" },
      ],
    },
  ];

  const columns = [
    createNumberColumn(),
    {
      title: "Nama Pendaftar",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Beasiswa",
      dataIndex: "beasiswa",
      key: "beasiswa",
      sorter: (a, b) => a.beasiswa.localeCompare(b.beasiswa),
    },
    {
      title: "Tanggal Daftar",
      dataIndex: "tanggalDaftar",
      key: "tanggalDaftar",
      sorter: (a, b) => new Date(a.tanggalDaftar) - new Date(b.tanggalDaftar),
      render: (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = getStatusColor(status);
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: "Menunggu Verifikasi", value: "Menunggu Verifikasi" },
        {
          text: "Terverifikasi - Menunggu Validasi",
          value: "Terverifikasi - Menunggu Validasi",
        },
        { text: "Dikembalikan", value: "Dikembalikan" },
        { text: "Disetujui", value: "Disetujui" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    createActionColumn([
      {
        key: "detail",
        label: "Detail",
        icon: <EyeOutlined />,
        onClick: handleDetail,
      },
      {
        key: "verify",
        label: "Verifikasi",
        icon: <CheckOutlined />,
        hidden: (record) =>
          !(
            role === "VERIFIKATOR" && record.rawStatus === "MENUNGGU_VERIFIKASI"
          ),
        onClick: handleVerify,
      },
      {
        key: "validate",
        label: "Validasi",
        icon: <CheckOutlined />,
        hidden: (record) =>
          !(role === "PIMPINAN_DITMAWA" && record.rawStatus === "VERIFIED"),
        onClick: handleValidate,
      },
      {
        key: "reject",
        label: "Tolak",
        icon: <CloseOutlined />,
        danger: true,
        hidden: (record) => {
          if (role === "VERIFIKATOR") {
            return record.rawStatus !== "MENUNGGU_VERIFIKASI";
          }

          if (role === "PIMPINAN_DITMAWA") {
            return record.rawStatus !== "VERIFIED";
          }

          return true;
        },
        onClick: handleReject,
      },
    ]),
  ];

  if (loading && summaryLoading) {
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
        onRemove={removeAlert}
        position="top-right"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx}>
                <div className="flex flex-col items-center py-4">
                  <Spin size="small" />
                </div>
              </Card>
            ))
          : summaryData.map((item, idx) => (
              <Card key={idx}>
                <div className="flex flex-col items-center py-4">
                  <span className="text-sm text-gray-600 mb-2">
                    {item.title}
                  </span>
                  <span className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              </Card>
            ))}
      </div>

      <UniversalTable
        title="Kelola Pendaftaran"
        data={applications}
        columns={columns}
        searchFields={["nama", "email", "beasiswa"]}
        searchPlaceholder="Cari nama pendaftar, email, atau beasiswa..."
        onAdd={null}
        loading={loading}
      />

      <ApplicationDetailModal
        visible={detailModalVisible}
        onClose={handleCloseDetailModal}
        applicationDetail={selectedApplication}
        loading={detailLoading}
        onVerify={handleVerify}
        onValidate={handleValidate}
        onReject={handleReject}
        role={role}
      />

      <UniversalModal
        visible={rejectModalVisible}
        onCancel={handleCloseRejectModal}
        onSubmit={handleSubmitReject}
        title={`Tolak Pendaftaran - ${
          selectedApplicationForReject?.nama || "Unknown"
        }`}
        fields={rejectModalFields}
        loading={rejectLoading}
      />
    </div>
  );
};

export default ApplicationsAdmin;
