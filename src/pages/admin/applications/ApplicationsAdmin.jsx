import { useEffect, useState } from "react";
import { Tag } from "antd";
import UniversalTable, {
  createNumberColumn,
  createActionColumn,
} from "../../../components/Table";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  FormOutlined,
} from "@ant-design/icons";
import Card from "../../../components/Card";
import {
  getAllApplications,
  getApplicationsSummary,
  getApplicationDetail,
} from "../../../services/applicationService";
import {
  verifyApplication,
  rejectApplication,
  requestRevisionApplication,
} from "../../../services/verifikatorService";
import {
  validateApplication,
  rejectApplicationByValidator,
  requestRevisionByValidator,
} from "../../../services/validatorService";
import ApplicationDetailModal from "../../../components/ApplicationDetailModal";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";
import RevisionRejectModal from "../../../components/RevisionRejectModal";
import {
  SkeletonCard,
  SkeletonTable,
} from "../../../components/common/skeleton";

const ApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [revisionModalVisible, setRevisionModalVisible] = useState(false);
  const [selectedApplicationForRevision, setSelectedApplicationForRevision] =
    useState(null);
  const [revisionLoading, setRevisionLoading] = useState(false);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedApplicationForReject, setSelectedApplicationForReject] =
    useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [selectedApplicationForVerify, setSelectedApplicationForVerify] =
    useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [validateModalVisible, setValidateModalVisible] = useState(false);
  const [selectedApplicationForValidate, setSelectedApplicationForValidate] =
    useState(null);
  const [validateLoading, setValidateLoading] = useState(false);

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
        schema_id: item.schema_id,
        scholarship_id: item.scholarship_id,
        student_id: item.student_id,
        verification_level: item.verification_level,
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

  const refreshData = async () => {
    await fetchApplications();
    await fetchSummary();
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
    setSelectedApplicationForVerify(record);
    setVerifyModalVisible(true);
  };

  const handleSubmitVerify = async (values) => {
    const { notes, template_ids } = values;
    const record = selectedApplicationForVerify;

    try {
      setVerifyLoading(true);

      const payload = {
        notes: notes || "",
        template_ids: template_ids || [],
      };

      await verifyApplication(record.id, payload);

      success("Berhasil!", `Pendaftaran ${record.nama} berhasil diverifikasi`);

      setTimeout(refreshData, 1500);

      if (detailModalVisible) {
        setDetailModalVisible(false);
        setSelectedApplication(null);
      }

      setVerifyModalVisible(false);
      setSelectedApplicationForVerify(null);
    } catch (err) {
      console.error("Error verifying application:", err);
      error("Gagal!", err.message || "Gagal memverifikasi pendaftaran");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleValidate = async (record) => {
    setSelectedApplicationForValidate(record);
    setValidateModalVisible(true);
  };

  const handleSubmitValidate = async (values) => {
    const { notes, template_ids } = values;
    const record = selectedApplicationForValidate;

    try {
      setValidateLoading(true);

      const payload = {
        notes: notes || "",
        template_ids: template_ids || [],
      };

      await validateApplication(record.id, payload);

      success("Berhasil!", `Pendaftaran ${record.nama} berhasil divalidasi`);

      setTimeout(refreshData, 1500);

      if (detailModalVisible) {
        setDetailModalVisible(false);
        setSelectedApplication(null);
      }

      setValidateModalVisible(false);
      setSelectedApplicationForValidate(null);
    } catch (err) {
      console.error("Error validating application:", err);
      error("Gagal!", err.message || "Gagal memvalidasi pendaftaran");
    } finally {
      setValidateLoading(false);
    }
  };

  const handleReject = async (record) => {
    setSelectedApplicationForReject(record);
    setRejectModalVisible(true);
  };

  const handleSubmitReject = async (values) => {
    const { notes, template_ids } = values;
    const record = selectedApplicationForReject;

    try {
      setRejectLoading(true);

      const payload = {
        notes: notes || "",
        template_ids: template_ids || [],
      };

      const currentStatus = record.status;

      if (
        (role === "VERIFIKATOR_FAKULTAS" || role === "VERIFIKATOR_DITMAWA") &&
        currentStatus === "MENUNGGU_VERIFIKASI"
      ) {
        await rejectApplication(record.id, payload);
      } else if (role === "VALIDATOR_DITMAWA" && currentStatus === "VERIFIED") {
        await rejectApplicationByValidator(record.id, payload);
      } else {
        warning(
          "Gagal!",
          "Anda tidak memiliki akses untuk menolak pendaftaran ini",
        );
        return;
      }

      success("Berhasil!", `Pendaftaran ${record.nama} berhasil ditolak`);

      setTimeout(refreshData, 1500);

      if (detailModalVisible) {
        setDetailModalVisible(false);
        setSelectedApplication(null);
      }

      setRejectModalVisible(false);
      setSelectedApplicationForReject(null);
    } catch (err) {
      console.error("Error rejecting application:", err);
      error("Gagal!", err.message || "Gagal menolak pendaftaran");
    } finally {
      setRejectLoading(false);
    }
  };

  const handleRequestRevision = async (record) => {
    setSelectedApplicationForRevision(record);
    setRevisionModalVisible(true);
  };

  const handleSubmitRevision = async (values) => {
    const { notes, template_ids, revision_deadline } = values;
    const record = selectedApplicationForRevision;

    try {
      setRevisionLoading(true);

      const payload = {
        notes: notes || "",
        template_ids: template_ids || [],
        revision_deadline: revision_deadline,
      };

      if (role === "VALIDATOR_DITMAWA" || role === "PIMPINAN_DITMAWA") {
        await requestRevisionByValidator(record.id, payload);
      } else {
        await requestRevisionApplication(record.id, payload);
      }

      success("Berhasil!", `Revisi berhasil diminta untuk ${record.nama}`);

      setTimeout(refreshData, 1500);

      if (detailModalVisible) {
        setDetailModalVisible(false);
        setSelectedApplication(null);
      }

      setRevisionModalVisible(false);
      setSelectedApplicationForRevision(null);
    } catch (err) {
      console.error("Error requesting revision:", err);
      error("Gagal!", err.message || "Gagal meminta revisi");
    } finally {
      setRevisionLoading(false);
    }
  };

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
      title: "Level Verifikasi",
      dataIndex: "verification_level",
      key: "verification_level",
      render: (level) => {
        const config = {
          FACULTY: { color: "blue", text: "Fakultas" },
          DITMAWA: { color: "purple", text: "Ditmawa" },
        };
        const { color, text } = config[level] || {
          color: "default",
          text: level,
        };
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Fakultas", value: "FACULTY" },
        { text: "Ditmawa", value: "DITMAWA" },
      ],
      onFilter: (value, record) => record.verification_level === value,
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
        hidden: (record) => {
          if (role === "VERIFIKATOR_FAKULTAS") {
            return !(
              record.status === "MENUNGGU_VERIFIKASI" &&
              record.verification_level === "FACULTY"
            );
          }
          if (role === "VERIFIKATOR_DITMAWA") {
            return record.status !== "MENUNGGU_VERIFIKASI";
          }
          return true;
        },
        onClick: handleVerify,
      },
      {
        key: "validate",
        label: "Validasi",
        icon: <CheckOutlined />,
        hidden: (record) =>
          !(role === "VALIDATOR_DITMAWA" && record.status === "VERIFIED"),
        onClick: handleValidate,
      },
      {
        key: "reject",
        label: "Tolak",
        icon: <CloseOutlined />,
        danger: true,
        hidden: (record) => {
          if (role === "VERIFIKATOR_FAKULTAS") {
            return !(
              record.status === "MENUNGGU_VERIFIKASI" &&
              record.verification_level === "FACULTY"
            );
          }
          if (role === "VERIFIKATOR_DITMAWA") {
            return record.status !== "MENUNGGU_VERIFIKASI";
          }
          if (role === "VALIDATOR_DITMAWA") {
            return record.status !== "VERIFIED";
          }
          return true;
        },
        onClick: handleReject,
      },
      {
        key: "requestRevision",
        label: "Minta Revisi",
        icon: <FormOutlined />,
        hidden: (record) => {
          if (role === "VERIFIKATOR_FAKULTAS") {
            return !(
              record.status === "MENUNGGU_VERIFIKASI" &&
              record.verification_level === "FACULTY"
            );
          }
          if (role === "VERIFIKATOR_DITMAWA") {
            return record.status !== "MENUNGGU_VERIFIKASI";
          }
          if (role === "VALIDATOR_DITMAWA") {
            return record.status !== "VERIFIED";
          }
          return true;
        },
        onClick: handleRequestRevision,
      },
    ]),
  ];

  if (loading && summaryLoading) {
    return (
      <div className="space-y-6">
        <AlertContainer
          alerts={alerts}
          onRemove={removeAlert}
          position="top-right"
        />

        {(role === "VERIFIKATOR_FAKULTAS" ||
          role === "VERIFIKATOR_DITMAWA") && (
          <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <SkeletonTable rows={10} columns={9} />
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

      {(role === "VERIFIKATOR_FAKULTAS" || role === "VERIFIKATOR_DITMAWA") && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-sm text-blue-700 font-medium">
              {role === "VERIFIKATOR_FAKULTAS" ? (
                <>
                  Anda hanya melihat pendaftaran beasiswa{" "}
                  <strong>Level Fakultas</strong> untuk fakultas{" "}
                  {user?.faculty?.name || "Anda"}
                </>
              ) : (
                <>
                  Anda hanya melihat pendaftaran beasiswa{" "}
                  <strong>Level Ditmawa</strong>
                </>
              )}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {summaryLoading
          ? [...Array(6)].map((_, idx) => <SkeletonCard key={idx} />)
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
        onRequestRevision={handleRequestRevision}
        role={role}
      />

      <RevisionRejectModal
        visible={verifyModalVisible}
        onCancel={() => {
          setVerifyModalVisible(false);
          setSelectedApplicationForVerify(null);
        }}
        onSubmit={handleSubmitVerify}
        title={`Verifikasi Pendaftaran - ${
          selectedApplicationForVerify?.nama || "Unknown"
        }`}
        loading={verifyLoading}
        type="VERIFICATION"
        zIndex={1100}
      />

      <RevisionRejectModal
        visible={validateModalVisible}
        onCancel={() => {
          setValidateModalVisible(false);
          setSelectedApplicationForValidate(null);
        }}
        onSubmit={handleSubmitValidate}
        title={`Validasi Pendaftaran - ${
          selectedApplicationForValidate?.nama || "Unknown"
        }`}
        loading={validateLoading}
        type="VALIDATION"
        zIndex={1100}
      />

      <RevisionRejectModal
        visible={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          setSelectedApplicationForReject(null);
        }}
        onSubmit={handleSubmitReject}
        title={`Tolak Pendaftaran - ${
          selectedApplicationForReject?.nama || "Unknown"
        }`}
        loading={rejectLoading}
        type="REJECTION"
        zIndex={1100}
      />

      <RevisionRejectModal
        visible={revisionModalVisible}
        onCancel={() => {
          setRevisionModalVisible(false);
          setSelectedApplicationForRevision(null);
        }}
        onSubmit={handleSubmitRevision}
        title={`Minta Revisi - ${
          selectedApplicationForRevision?.nama || "Unknown"
        }`}
        loading={revisionLoading}
        type="REVISION"
        zIndex={1100}
      />
    </div>
  );
};

export default ApplicationsAdmin;
