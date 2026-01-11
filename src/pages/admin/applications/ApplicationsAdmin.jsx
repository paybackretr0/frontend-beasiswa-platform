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
        skema: item.skema,
        tanggalDaftar: item.tanggalDaftar,
        status: item.status,
        statusLabel: getStatusLabel(item.status),
        notes: item.notes,
        schema_id: item.schema_id,
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
          value: data.total || 0,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Menunggu Verifikasi",
          value: data.menunggu_verifikasi || 0,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          title: "Menunggu Validasi",
          value: data.menunggu_validasi || 0,
          color: "text-yellow-600",
        },
        {
          title: "Revisi",
          value: data.revisi || 0,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          title: "Lolos Validasi",
          value: data.lolos_validasi || 0,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Ditolak",
          value: data.ditolak || 0,
          color: "text-red-600",
          bgColor: "bg-red-50",
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
      VERIFIED: "Menunggu Validasi",
      REJECTED: "Ditolak",
      VALIDATED: "Lolos Validasi",
      REVISION_NEEDED: "Revisi",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      MENUNGGU_VERIFIKASI: "orange",
      VERIFIED: "blue",
      VALIDATED: "green",
      REJECTED: "red",
      REVISION_NEEDED: "purple",
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
      setDetailModalVisible(false);
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
      success("Berhasil!", `Pendaftaran ${record.nama} berhasil diverifikasi`);

      setTimeout(async () => {
        await fetchApplications();
        await fetchSummary();
      }, 1500);

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
      success("Berhasil!", `Pendaftaran ${record.nama} berhasil divalidasi`);

      setTimeout(async () => {
        await fetchApplications();
        await fetchSummary();
      }, 1500);

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

      const currentStatus = record.status;

      if (
        role === "VERIFIKATOR_DITMAWA" &&
        currentStatus === "MENUNGGU_VERIFIKASI"
      ) {
        await rejectApplication(record.id, notes);
      } else if (role === "PIMPINAN_DITMAWA" && currentStatus === "VERIFIED") {
        await rejectApplicationByValidator(record.id, notes);
      } else {
        warning(
          "Gagal!",
          "Anda tidak memiliki akses untuk menolak pendaftaran ini"
        );
        return;
      }

      success("Berhasil!", `Pendaftaran ${record.nama} berhasil ditolak`);

      setTimeout(async () => {
        await fetchApplications();
        await fetchSummary();
      }, 1500);

      if (detailModalVisible) {
        setDetailModalVisible(false);
        setSelectedApplication(null);
      }

      handleCloseRejectModal();
    } catch (err) {
      console.error("Error rejecting application:", err);
      error("Gagal!", err.message || "Gagal menolak pendaftaran");
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
      sorter: (a, b) => (a.nama || "").localeCompare(b.nama || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Beasiswa",
      dataIndex: "beasiswa",
      key: "beasiswa",
      sorter: (a, b) => (a.beasiswa || "").localeCompare(b.beasiswa || ""),
    },
    {
      title: "Skema",
      dataIndex: "skema",
      key: "skema",
      sorter: (a, b) => (a.skema || "").localeCompare(b.skema || ""),
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
        const label = getStatusLabel(status);
        return <Tag color={color}>{label}</Tag>;
      },
      filters: [
        { text: "Menunggu Verifikasi", value: "MENUNGGU_VERIFIKASI" },
        { text: "Menunggu Validasi", value: "VERIFIED" },
        { text: "Lolos Validasi", value: "VALIDATED" },
        { text: "Ditolak", value: "REJECTED" },
        { text: "Revisi", value: "REVISION_NEEDED" },
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
            role === "VERIFIKATOR_DITMAWA" &&
            record.status === "MENUNGGU_VERIFIKASI"
          ),
        onClick: handleVerify,
      },
      {
        key: "validate",
        label: "Validasi",
        icon: <CheckOutlined />,
        hidden: (record) =>
          !(role === "PIMPINAN_DITMAWA" && record.status === "VERIFIED"),
        onClick: handleValidate,
      },
      {
        key: "reject",
        label: "Tolak",
        icon: <CloseOutlined />,
        danger: true,
        hidden: (record) => {
          if (role === "VERIFIKATOR_DITMAWA") {
            return record.status !== "MENUNGGU_VERIFIKASI";
          }
          if (role === "PIMPINAN_DITMAWA") {
            return record.status !== "VERIFIED";
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

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {summaryLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx}>
                <div className="flex flex-col items-center py-4">
                  <Spin size="small" />
                </div>
              </Card>
            ))
          : summaryData.map((item, idx) => (
              <Card key={idx} className={item.bgColor}>
                <div className="flex flex-col items-center py-4">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <span className="text-xs text-gray-600 mb-2 text-center">
                    {item.title}
                  </span>
                  <span className={`text-3xl font-bold ${item.color}`}>
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
        searchFields={["nama", "email", "beasiswa", "skema"]}
        searchPlaceholder="Cari nama pendaftar, email, beasiswa, atau skema..."
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
