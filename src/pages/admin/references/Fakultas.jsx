import { useEffect, useState } from "react";
import { message } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import UniversalModal from "../../../components/Modal";
import {
  getFaculties,
  addFaculty,
  editFaculty,
  activateFaculty,
  deactivateFaculty,
} from "../../../services/facultyService";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";

const Fakultas = () => {
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const { alerts, success, error, removeAlert } = useAlert();

  useEffect(() => {
    document.title = "Kelola Fakultas - Admin";
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const data = await getFaculties();
      const formattedData = data.map((faculty, index) => ({
        key: faculty.id,
        nama: faculty.name,
        kode: faculty.code,
        jumlahDepartemen: faculty.departments_count || 0,
        status: faculty.is_active ? "Aktif" : "Nonaktif",
      }));
      setFaculties(formattedData);
      setFilteredFaculties(formattedData);
    } catch (err) {
      console.error("Error fetching faculties:", err);
      error("Gagal!", err.message || "Gagal mengambil daftar fakultas");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculties = async (values) => {
    setModalLoading(true);
    try {
      await addFaculty(values);
      success("Berhasil!", "Fakultas berhasil ditambahkan");
      setModalVisible(false);
      await fetchFaculties();
    } catch (err) {
      console.error("Error adding Fakultas:", err);
      error("Gagal", err.message || "Gagal menambahkan Fakultas");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditFaculties = async (id, values) => {
    setModalLoading(true);
    try {
      await editFaculty(id, values);
      success("Berhasil!", "Fakultas berhasil diubah");
      setModalVisible(false);
      await fetchFaculties();
    } catch (err) {
      console.error("Error editing Fakultas:", err);
      error("Gagal", err.message || "Gagal mengubah Fakultas");
    } finally {
      setModalLoading(false);
    }
  };

  const handleActivateFaculty = async (id) => {
    setLoading(true);
    try {
      await activateFaculty(id);
      success("Berhasil!", "Fakultas berhasil diaktifkan");
      await fetchFaculties();
    } catch (err) {
      console.error("Error activating faculty:", err);
      error("Gagal", err.message || "Gagal mengaktifkan fakultas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateFaculty = async (id) => {
    setLoading(true);
    try {
      await deactivateFaculty(id);
      success("Berhasil!", "Fakultas berhasil dinonaktifkan");
      await fetchFaculties();
    } catch (err) {
      console.error("Error deactivating faculty:", err);
      error("Gagal", err.message || "Gagal menonaktifkan fakultas");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleSearch = (searchValue) => {
    let filtered = faculties;

    if (statusFilter !== "Semua") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (searchValue) {
      filtered = filtered.filter((item) =>
        item.nama?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredFaculties(filtered);
  };

  const facultyColumns = [
    createNumberColumn(),
    {
      title: "Kode Fakultas",
      dataIndex: "kode",
      key: "kode",
      sorter: (a, b) => a.kode.localeCompare(b.kode),
      width: "20%",
    },
    {
      title: "Nama Fakultas",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      width: "35%",
    },
    {
      title: "Jumlah Departemen",
      dataIndex: "jumlahDepartemen",
      key: "jumlahDepartemen",
      sorter: (a, b) => a.jumlahDepartemen - b.jumlahDepartemen,
      width: "20%",
      align: "center",
    },
    createStatusColumn({
      Aktif: { color: "green" },
      Nonaktif: { color: "red" },
    }),
    createActionColumn([
      {
        key: "edit",
        icon: <EditOutlined />,
        onClick: (record) => {
          setEditingFaculty(record);
          setModalVisible(true);
        },
      },
      {
        key: "toggleStatus",
        icon: (record) =>
          record.status === "Aktif" ? <DeleteOutlined /> : <CheckOutlined />,
        danger: (record) => record.status === "Aktif",
        onClick: (record) =>
          record.status === "Aktif"
            ? handleDeactivateFaculty(record.key)
            : handleActivateFaculty(record.key),
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
        title="Kelola Fakultas"
        data={filteredFaculties}
        columns={facultyColumns}
        loading={loading}
        searchFields={["nama", "kode"]}
        searchPlaceholder="Cari nama atau kode fakultas..."
        addButtonText="Tambah Fakultas"
        onAdd={handleAdd}
        pageSize={10}
        onSearch={handleSearch}
      />

      <UniversalModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingFaculty(null);
        }}
        onSubmit={(values) => {
          if (editingFaculty) {
            handleEditFaculties(editingFaculty.key, values);
          } else {
            handleAddFaculties(values);
          }
        }}
        title={editingFaculty ? "Edit Fakultas" : "Tambah Fakultas"}
        loading={modalLoading}
        initialValues={
          editingFaculty
            ? {
                name: editingFaculty.nama,
                code: editingFaculty.kode,
              }
            : {}
        }
        fields={[
          {
            name: "name",
            label: "Nama Fakultas",
            rules: [{ required: true, message: "Nama fakultas wajib diisi" }],
          },
          {
            name: "code",
            label: "Kode Fakultas",
            rules: [
              { required: true, message: "Kode fakultas wajib diisi" },
              {
                max: 2,
                message: "Kode fakultas harus terdiri dari 2 karakter",
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default Fakultas;
