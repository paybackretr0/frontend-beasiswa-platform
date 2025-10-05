import { useEffect, useState } from "react";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchAllScholarships } from "../../../services/scholarshipService";
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
        nama: item.name,
        penyedia: item.organizer || "Tidak Diketahui",
        status: item.is_active ? "Aktif" : "Ditutup",
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
      Ditutup: { color: "red" },
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
        onClick: (record) => console.log("Detail", record),
      },
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: (record) => console.log("Edit", record),
      },
      {
        key: "delete",
        label: "Hapus",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: (record) => console.log("Delete", record),
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
