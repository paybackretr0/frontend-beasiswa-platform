import { useEffect, useState } from "react";
import { message, Select } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import UniversalModal from "../../../components/Modal";
import {
  getDepartments,
  addDepartment,
  editDepartment,
  activateDepartment,
  deactivateDepartment,
} from "../../../services/departmentService";
import { getFaculties } from "../../../services/facultyService";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";

const Departemen = () => {
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [fakultasOptions, setFakultasOptions] = useState(["Semua"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const { alerts, success, error, removeAlert, info, clearAlerts } = useAlert();

  useEffect(() => {
    document.title = "Kelola Departemen - Admin";
    fetchDepartments();
    fetchFaculties();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      const formattedData = data.map((department) => ({
        key: department.id,
        nama: department.name,
        kode: department.code,
        jenjang: department.degree,
        fakultas: department.faculty ? department.faculty.name : "-",
        fakultasId: department.faculty ? department.faculty.id : null,
        status: department.is_active ? "Aktif" : "Nonaktif",
      }));
      setDepartments(formattedData);
      setFilteredDepartments(formattedData);

      const uniqueFakultas = [
        ...new Set(formattedData.map((dept) => dept.fakultas)),
      ].filter((f) => f !== "-");
      setFakultasOptions(["Semua", ...uniqueFakultas]);
    } catch (err) {
      console.error("Error fetching departments:", err);
      error(
        "Gagal memuat data",
        err.message || "Gagal mengambil daftar departemen"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const data = await getFaculties();
      setFaculties(data);
    } catch (err) {
      console.error("Error fetching faculties:", err);
      error(
        "Gagal memuat data",
        err.message || "Gagal mengambil daftar fakultas"
      );
    }
  };

  const handleAddDepartment = async (values) => {
    setModalLoading(true);
    try {
      await addDepartment(values);
      success("Berhasil!", "Departemen berhasil ditambahkan");
      setModalVisible(false);
      await fetchDepartments();
    } catch (err) {
      console.error("Error adding department:", err);
      error("Gagal", err.message || "Gagal menambahkan departemen");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditDepartment = async (id, values) => {
    setModalLoading(true);
    try {
      await editDepartment(id, values);
      success("Berhasil!", "Departemen berhasil diperbarui");
      setModalVisible(false);
      setEditingDepartment(null);
      await fetchDepartments();
    } catch (err) {
      console.error("Error updating department:", err);
      error("Gagal", err.message || "Gagal memperbarui departemen");
    } finally {
      setModalLoading(false);
    }
  };

  const handleActivateDepartment = async (id) => {
    setLoading(true);
    try {
      await activateDepartment(id);
      success("Berhasil!", "Departemen berhasil diaktifkan");
      await fetchDepartments();
    } catch (err) {
      console.error("Error activating department:", err);
      error("Gagal", err.message || "Gagal mengaktifkan departemen");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateDepartment = async (id) => {
    setLoading(true);
    try {
      await deactivateDepartment(id);
      success("Berhasil!", "Departemen berhasil dinonaktifkan");
      await fetchDepartments();
    } catch (err) {
      console.error("Error deactivating department:", err);
      error("Gagal", err.message || "Gagal menonaktifkan departemen");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDepartment(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingDepartment(record);
    setModalVisible(true);
  };

  const handleSearch = (searchValue) => {
    let filtered = departments;

    if (statusFilter !== "Semua") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    if (fakultasFilter !== "Semua") {
      filtered = filtered.filter((item) => item.fakultas === fakultasFilter);
    }

    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.nama?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.fakultas?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.kode?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.jenjang?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredDepartments(filtered);
  };

  const departmentColumns = [
    createNumberColumn(),
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
      sorter: (a, b) => a.kode.localeCompare(b.kode),
      width: "15%",
    },
    {
      title: "Nama Departemen",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      width: "30%",
    },
    {
      title: "Jenjang",
      dataIndex: "jenjang",
      key: "jenjang",
      width: "15%",
      filters: [
        { text: "D3", value: "D3" },
        { text: "S1", value: "S1" },
        { text: "S2", value: "S2" },
        { text: "S3", value: "S3" },
      ],
      onFilter: (value, record) => record.jenjang === value,
    },
    {
      title: "Fakultas",
      dataIndex: "fakultas",
      key: "fakultas",
      width: "20%",
      filters: fakultasOptions
        .filter((option) => option !== "Semua")
        .map((fakultas) => ({
          text: fakultas,
          value: fakultas,
        })),
      onFilter: (value, record) => record.fakultas === value,
    },
    createStatusColumn({
      Aktif: { color: "green" },
      Nonaktif: { color: "red" },
    }),
    createActionColumn([
      {
        key: "edit",
        icon: <EditOutlined />,
        onClick: handleEdit,
      },
      {
        key: "toggleStatus",
        label: (record) =>
          record.status === "Aktif" ? "Nonaktifkan" : "Aktifkan",
        icon: (record) =>
          record.status === "Aktif" ? <DeleteOutlined /> : <CheckOutlined />,
        danger: (record) => record.status === "Aktif",
        onClick: (record) =>
          record.status === "Aktif"
            ? handleDeactivateDepartment(record.key)
            : handleActivateDepartment(record.key),
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
        title="Kelola Departemen"
        data={filteredDepartments}
        columns={departmentColumns}
        searchFields={["nama", "fakultas", "kode", "jenjang"]}
        searchPlaceholder="Cari nama departemen, fakultas, kode, atau jenjang..."
        addButtonText="Tambah Departemen"
        onAdd={handleAdd}
        loading={loading}
        pageSize={10}
        onSearch={handleSearch}
      />
      <UniversalModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingDepartment(null);
        }}
        onSubmit={(values) => {
          if (editingDepartment) {
            handleEditDepartment(editingDepartment.key, values);
          } else {
            handleAddDepartment(values);
          }
        }}
        title={editingDepartment ? "Edit Departemen" : "Tambah Departemen"}
        loading={modalLoading}
        initialValues={
          editingDepartment
            ? {
                name: editingDepartment.nama,
                code: editingDepartment.kode,
                degree: editingDepartment.jenjang,
                faculty_id: editingDepartment.fakultasId,
              }
            : {}
        }
        fields={[
          {
            name: "name",
            label: "Nama Departemen",
            rules: [{ required: true, message: "Nama departemen wajib diisi" }],
          },
          {
            name: "code",
            label: "Kode Departemen",
            rules: [
              { required: true, message: "Kode departemen wajib diisi" },
              {
                max: 5,
                message: "Kode departemen maksimal 5 karakter",
              },
            ],
          },
          {
            name: "degree",
            label: "Jenjang",
            type: "select",
            options: [
              { label: "D3", value: "D3" },
              { label: "S1", value: "S1" },
              { label: "S2", value: "S2" },
              { label: "S3", value: "S3" },
            ],
            rules: [{ required: true, message: "Jenjang wajib dipilih" }],
          },
          {
            name: "faculty_id",
            label: "Fakultas",
            type: "select",
            options: faculties.map((faculty) => ({
              label: faculty.name,
              value: faculty.id,
            })),
            rules: [{ required: true, message: "Fakultas wajib dipilih" }],
          },
        ]}
      />
    </>
  );
};

export default Departemen;
