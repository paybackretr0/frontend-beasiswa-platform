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
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const ScholarshipAdmin = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Kelola Beasiswa - Admin";
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const data = await fetchAllScholarships();
      const formattedData = data.map((item) => ({
        key: item.id,
        id: item.id,
        nama: item.name,
        penyedia: item.organizer || "Tidak Diketahui",
        status: item.scholarship_status === "AKTIF" ? "Aktif" : "Nonaktif",
        batasWaktu: item.end_date || "Tidak Ada",
      }));
      setScholarships(formattedData);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      message.error("Gagal memuat data beasiswa");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateScholarship(id);
      message.success("Beasiswa diaktifkan");
      fetchScholarships();
    } catch (error) {
      console.error("Error activating scholarship:", error);
      message.error("Gagal mengaktifkan beasiswa");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateScholarship(id);
      message.success("Beasiswa dinonaktifkan");
      fetchScholarships();
    } catch (error) {
      console.error("Error deactivating scholarship:", error);
      message.error("Gagal menonaktifkan beasiswa");
    }
  };

  const columns = [
    createNumberColumn(),
    {
      title: "Nama Beasiswa",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
    },
    {
      title: "Penyedia",
      dataIndex: "penyedia",
      key: "penyedia",
    },
    createStatusColumn({
      Aktif: { color: "green" },
      Nonaktif: { color: "red" },
      "Segera Berakhir": { color: "orange" },
    }),
    {
      title: "Batas Waktu",
      dataIndex: "batasWaktu",
      key: "batasWaktu",
    },
    createActionColumn([
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
    ]),
  ];

  return (
    <UniversalTable
      title="Kelola Beasiswa"
      data={scholarships}
      columns={columns}
      searchFields={["nama", "penyedia"]}
      searchPlaceholder="Cari nama beasiswa atau penyedia..."
      addButtonText="Tambah Beasiswa"
      onAdd={() => navigate("/admin/scholarship/add")}
      loading={loading}
    />
  );
};

export default ScholarshipAdmin;
