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
  AlignLeftOutlined,
} from "@ant-design/icons";
import {
  fetchAllScholarships,
  deactivateScholarship,
  activateScholarship,
} from "../../../services/scholarshipService";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { checkScholarshipForm } from "../../../services/formService";

const ScholarshipAdmin = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { alerts, success, error, removeAlert } = useAlert();

  useEffect(() => {
    document.title = "Kelola Beasiswa - Admin";
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const data = await fetchAllScholarships();
      const formatDate = (dateStr) => {
        if (!dateStr) return "Tidak Ada";
        const d = new Date(dateStr);
        if (isNaN(d)) return "Tidak Ada";
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const formattedData = data.map((item) => ({
        key: item.id,
        id: item.id,
        nama: item.name,
        penyedia: item.organizer || "Tidak Diketahui",
        status: item.is_active ? "Aktif" : "Nonaktif",
        batasWaktu: formatDate(item.end_date),
      }));
      setScholarships(formattedData);
    } catch (err) {
      console.error("Error fetching scholarships:", err);
      error(
        "Gagal Memuat Data",
        err.message || "Gagal mengambil data beasiswa"
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
        err.message || "Gagal mengaktifkan beasiswa"
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
        err.message || "Gagal menonaktifkan beasiswa"
      );
    }
  };

  const handleFormNavigation = async (scholarshipId) => {
    try {
      const { hasForm } = await checkScholarshipForm(scholarshipId);

      if (hasForm) {
        navigate(`/admin/scholarship/${scholarshipId}/form/preview`);
      } else {
        navigate(`/admin/scholarship/${scholarshipId}/form/create`);
      }
    } catch (err) {
      console.error("Error checking form status:", err);
      error(
        "Gagal Memeriksa Status Form",
        err.message || "Gagal memeriksa status form"
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
        key: "form",
        label: "Kelola Form",
        icon: <AlignLeftOutlined />,
        onClick: (record) => handleFormNavigation(record.id),
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
        searchFields={["nama", "penyedia"]}
        searchPlaceholder="Cari nama beasiswa atau penyedia..."
        addButtonText="Tambah Beasiswa"
        onAdd={() => navigate("/admin/scholarship/add")}
        loading={loading}
      />
    </>
  );
};

export default ScholarshipAdmin;
