import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Card from "../../../components/Card";
import {
  getAllApplications,
  getApplicationsSummary,
} from "../../../services/applicationService";

const ApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    document.title = "Kelola Pendaftaran - Admin";
    fetchApplications();
    fetchSummary();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getAllApplications();
      // Transform data untuk table
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
    } catch (error) {
      console.error("Error fetching applications:", error);
      message.error("Gagal memuat data pendaftaran");
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
          title: "Menunggu Validasi",
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
    } catch (error) {
      console.error("Error fetching summary:", error);
      message.error("Gagal memuat ringkasan data");
    } finally {
      setSummaryLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
      VERIFIED: "Terverifikasi",
      MENUNGGU_VALIDASI: "Menunggu Validasi",
      REJECTED: "Dikembalikan",
      VALIDATED: "Disetujui",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      "Menunggu Verifikasi": "orange",
      Terverifikasi: "blue",
      "Menunggu Validasi": "gold",
      Dikembalikan: "red",
      Disetujui: "green",
    };
    return colorMap[status] || "default";
  };

  const handleDetail = (record) => {
    // Navigate to detail page or open modal
    message.info(`Detail pendaftaran: ${record.nama}`);
    console.log("Application detail:", record);
  };

  const handleApprove = async (record) => {
    try {
      // TODO: Implement approve API call
      message.success(`Setujui pendaftaran: ${record.nama}`);
      // Refresh data after action
      fetchApplications();
      fetchSummary();
    } catch (error) {
      message.error("Gagal menyetujui pendaftaran");
    }
  };

  const handleReject = async (record) => {
    try {
      // TODO: Implement reject API call
      message.warning(`Tolak pendaftaran: ${record.nama}`);
      // Refresh data after action
      fetchApplications();
      fetchSummary();
    } catch (error) {
      message.error("Gagal menolak pendaftaran");
    }
  };

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
        { text: "Terverifikasi", value: "Terverifikasi" },
        { text: "Menunggu Validasi", value: "Menunggu Validasi" },
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
        key: "approve",
        label: "Setujui",
        icon: <CheckOutlined />,
        onClick: handleApprove,
        className: (record) =>
          record.rawStatus === "VALIDATED" || record.rawStatus === "REJECTED"
            ? "hidden"
            : "",
      },
      {
        key: "reject",
        label: "Tolak",
        icon: <CloseOutlined />,
        danger: true,
        onClick: handleReject,
        className: (record) =>
          record.rawStatus === "VALIDATED" || record.rawStatus === "REJECTED"
            ? "hidden"
            : "",
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
      {/* Summary Cards */}
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

      {/* Table */}
      <UniversalTable
        title="Kelola Pendaftaran"
        data={applications}
        columns={columns}
        searchFields={["nama", "email", "beasiswa"]}
        searchPlaceholder="Cari nama pendaftar, email, atau beasiswa..."
        onAdd={null} // Tidak ada tombol tambah
        loading={loading}
      />
    </div>
  );
};

export default ApplicationsAdmin;
