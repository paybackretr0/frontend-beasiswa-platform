import { useEffect, useState } from "react";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import {
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  fetchAllScholarships,
  deactivateScholarship,
  activateScholarship,
} from "../../../services/scholarshipService";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { SkeletonTable } from "../../../components/common/skeleton";

const ScholarshipAdmin = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { alerts, success, error, removeAlert } = useAlert();

  useEffect(() => {
    document.title = "Kelola Beasiswa - Admin";
    fetchScholarships();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Belum ditentukan";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const data = await fetchAllScholarships();

      const formattedData = data.map((item) => ({
        key: item.id,
        id: item.id,
        nama: item.name,
        penyedia: item.organizer || "Tidak Diketahui",
        tahun: item.year,
        status: item.is_active ? "Aktif" : "Nonaktif",
        batasWaktu: item.end_date ? formatDate(item.end_date) : "Tidak Ada",
        is_external: item.is_external,
        jenis: item.is_external ? "Eksternal" : "Internal",
        verification_level: item.verification_level,
        total_schemas: item.total_schemas || 0,
        active_schemas: item.active_schemas || 0,
      }));

      setScholarships(formattedData);
    } catch (err) {
      console.error("Error fetching scholarships:", err);
      error(
        "Gagal Memuat Data",
        err.message || "Gagal mengambil data beasiswa",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateScholarship(id);
      success("Berhasil", "Beasiswa diaktifkan");
      fetchScholarships();
    } catch (err) {
      console.error("Error activating scholarship:", err);
      error(
        "Gagal Mengaktifkan Beasiswa",
        err.message || "Gagal mengaktifkan beasiswa",
      );
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateScholarship(id);
      success("Berhasil", "Beasiswa dinonaktifkan");
      fetchScholarships();
    } catch (err) {
      console.error("Error deactivating scholarship:", err);
      error(
        "Gagal Menonaktifkan Beasiswa",
        err.message || "Gagal menonaktifkan beasiswa",
      );
    }
  };

  const columns = [
    createNumberColumn(),
    {
      title: "Nama Beasiswa",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      width: "25%",
    },
    {
      title: "Penyedia",
      dataIndex: "penyedia",
      key: "penyedia",
      width: "15%",
    },
    {
      title: "Tahun",
      dataIndex: "tahun",
      key: "tahun",
      width: "8%",
      sorter: (a, b) => a.tahun - b.tahun,
    },
    {
      title: "Skema",
      dataIndex: "total_schemas",
      key: "total_schemas",
      width: "10%",
      render: (count, record) => (
        <span className="text-sm">
          {record.active_schemas}/{count}
          <span className="text-xs text-gray-500 ml-1">aktif</span>
        </span>
      ),
    },
    {
      title: "Jenis",
      dataIndex: "jenis",
      key: "jenis",
      width: "10%",
      filters: [
        { text: "Internal", value: "Internal" },
        { text: "Eksternal", value: "Eksternal" },
      ],
      onFilter: (value, record) => record.jenis === value,
      render: (jenis) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            jenis === "Eksternal"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {jenis}
        </span>
      ),
    },
    createStatusColumn(
      {
        Aktif: { color: "green" },
        Nonaktif: { color: "red" },
        "Segera Berakhir": { color: "orange" },
      },
      "12%",
    ),
    {
      title: "Batas Waktu",
      dataIndex: "batasWaktu",
      key: "batasWaktu",
      width: "15%",
    },
    createActionColumn(
      [
        {
          key: "detail",
          label: "Detail",
          icon: <EyeOutlined />,
          onClick: (record) => navigate(`/admin/scholarship/${record.id}`),
        },
        {
          key: "edit",
          label: "Edit",
          icon: <EditOutlined />,
          onClick: (record) => navigate(`/admin/scholarship/edit/${record.id}`),
        },
        {
          key: "activate",
          label: "Aktifkan",
          icon: <CheckOutlined />,
          onClick: (record) => {
            handleActivate(record.id);
          },
          hidden: (record) => record.status === "Aktif",
        },
        {
          key: "deactivate",
          label: "Nonaktifkan",
          icon: <DeleteOutlined />,
          onClick: (record) => {
            handleDeactivate(record.id);
          },
          hidden: (record) => record.status === "Nonaktif",
        },
      ],
      "15%",
    ),
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <AlertContainer
          alerts={alerts}
          onRemove={removeAlert}
          position="top-right"
        />

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <SkeletonTable rows={10} columns={8} />
      </div>
    );
  }

  return (
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <UniversalTable
        title="Kelola Beasiswa"
        data={scholarships}
        columns={columns}
        searchFields={["nama", "penyedia", "jenis"]}
        searchPlaceholder="Cari nama beasiswa, penyedia, atau jenis..."
        addButtonText="Tambah Beasiswa"
        onAdd={() => navigate("/admin/scholarship/add")}
        loading={loading}
        pageSize={10}
      />
    </>
  );
};

export default ScholarshipAdmin;
