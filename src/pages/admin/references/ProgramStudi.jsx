import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import UniversalModal from "../../../components/Modal";
import {
  getStudyPrograms,
  addStudyProgram,
  editStudyProgram,
  activateStudyProgram,
  deactivateStudyProgram,
} from "../../../services/studyProgramService";
import { getDepartments } from "../../../services/departmentService";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";

const ProgramStudi = () => {
  const [filteredStudyPrograms, setFilteredStudyPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState(["Semua"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingStudyProgram, setEditingStudyProgram] = useState(null);

  const { alerts, success, error, removeAlert } = useAlert();

  useEffect(() => {
    document.title = "Kelola Program Studi - Admin";
    fetchStudyPrograms();
    fetchDepartments();
  }, []);

  const fetchStudyPrograms = async () => {
    setLoading(true);
    try {
      const data = await getStudyPrograms();
      const formattedData = data.map((studyProgram) => ({
        key: studyProgram.id,
        kode: studyProgram.code,
        jenjang: studyProgram.degree,
        departemen: studyProgram.department
          ? studyProgram.department.name
          : "-",
        departemenId: studyProgram.department
          ? studyProgram.department.id
          : null,
        status: studyProgram.is_active ? "Aktif" : "Nonaktif",
      }));
      setStudyPrograms(formattedData);
      setFilteredStudyPrograms(formattedData);

      // Update department options untuk filter
      const uniqueDepartemen = [
        ...new Set(formattedData.map((item) => item.departemen)),
      ].filter((f) => f !== "-");
      setDepartmentOptions(["Semua", ...uniqueDepartemen]);
    } catch (err) {
      console.error("Error fetching study programs:", err);
      error(
        "Gagal memuat data",
        err.message || "Gagal mengambil daftar program studi"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      error(
        "Gagal memuat data",
        err.message || "Gagal mengambil daftar departemen"
      );
    }
  };

  const handleAddStudyProgram = async (values) => {
    setModalLoading(true);
    try {
      await addStudyProgram(values);
      success("Berhasil!", "Program Studi berhasil ditambahkan");
      setModalVisible(false);
      await fetchStudyPrograms();
    } catch (err) {
      console.error("Error adding study program:", err);
      error("Gagal", err.message || "Gagal menambahkan program studi");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditStudyProgram = async (id, values) => {
    setModalLoading(true);
    try {
      await editStudyProgram(id, values);
      success("Berhasil!", "Program Studi berhasil diperbarui");
      setModalVisible(false);
      setEditingStudyProgram(null);
      await fetchStudyPrograms();
    } catch (err) {
      console.error("Error updating study program:", err);
      error("Gagal", err.message || "Gagal memperbarui program studi");
    } finally {
      setModalLoading(false);
    }
  };

  const handleActivateStudyProgram = async (id) => {
    setLoading(true);
    try {
      await activateStudyProgram(id);
      success("Berhasil!", "Program Studi berhasil diaktifkan");
      await fetchStudyPrograms();
    } catch (err) {
      console.error("Error activating study program:", err);
      error("Gagal", err.message || "Gagal mengaktifkan program studi");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateStudyProgram = async (id) => {
    setLoading(true);
    try {
      await deactivateStudyProgram(id);
      success("Berhasil!", "Program Studi berhasil dinonaktifkan");
      await fetchStudyPrograms();
    } catch (err) {
      console.error("Error deactivating study program:", err);
      error("Gagal", err.message || "Gagal menonaktifkan program studi");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStudyProgram(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingStudyProgram(record);
    setModalVisible(true);
  };

  const handleSearch = (searchValue) => {
    let filtered = studyPrograms;

    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.departemen?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.kode?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.jenjang?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredStudyPrograms(filtered);
  };

  const studyProgramColumns = [
    createNumberColumn(),
    {
      title: "Jenjang",
      dataIndex: "jenjang",
      key: "jenjang",
      width: "15%",
      filters: [
        { text: "D3", value: "D3" },
        { text: "D4", value: "D4" },
        { text: "S1", value: "S1" },
        { text: "S2", value: "S2" },
        { text: "S3", value: "S3" },
        { text: "Profesi", value: "Profesi" },
      ],
      onFilter: (value, record) => record.jenjang === value,
    },
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
      sorter: (a, b) => a.kode.localeCompare(b.kode),
      width: "20%",
    },
    {
      title: "Departemen",
      dataIndex: "departemen",
      key: "departemen",
      width: "30%",
      filters: departmentOptions
        .filter((option) => option !== "Semua")
        .map((dept) => ({
          text: dept,
          value: dept,
        })),
      onFilter: (value, record) => record.departemen === value,
    },
    createStatusColumn(
      {
        Aktif: { color: "green" },
        Nonaktif: { color: "red" },
      },
      "15%"
    ),
    createActionColumn(
      [
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
              ? handleDeactivateStudyProgram(record.key)
              : handleActivateStudyProgram(record.key),
        },
      ],
      "15%"
    ),
  ];

  return (
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <UniversalTable
        title="Kelola Program Studi"
        data={filteredStudyPrograms}
        columns={studyProgramColumns}
        searchFields={["departemen", "kode", "jenjang"]}
        searchPlaceholder="Cari program studi, departemen, kode, atau jenjang..."
        addButtonText="Tambah Program Studi"
        onAdd={handleAdd}
        loading={loading}
        pageSize={10}
        onSearch={handleSearch}
      />
      <UniversalModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingStudyProgram(null);
        }}
        onSubmit={(values) => {
          if (editingStudyProgram) {
            handleEditStudyProgram(editingStudyProgram.key, values);
          } else {
            handleAddStudyProgram(values);
          }
        }}
        title={
          editingStudyProgram ? "Edit Program Studi" : "Tambah Program Studi"
        }
        loading={modalLoading}
        initialValues={
          editingStudyProgram
            ? {
                degree: editingStudyProgram.jenjang,
                code: editingStudyProgram.kode,
                department_id: editingStudyProgram.departemenId,
              }
            : {}
        }
        fields={[
          {
            name: "degree",
            label: "Jenjang",
            type: "select",
            options: [
              { label: "D3 (Diploma 3)", value: "D3" },
              { label: "D4 (Diploma 4)", value: "D4" },
              { label: "S1 (Sarjana)", value: "S1" },
              { label: "S2 (Magister)", value: "S2" },
              { label: "S3 (Doktor)", value: "S3" },
              { label: "Profesi", value: "Profesi" },
            ],
            rules: [{ required: true, message: "Jenjang wajib dipilih" }],
          },
          {
            name: "code",
            label: "Kode Program Studi",
            rules: [
              { required: true, message: "Kode program studi wajib diisi" },
              {
                max: 50,
                message: "Kode program studi maksimal 50 karakter",
              },
            ],
          },
          {
            name: "department_id",
            label: "Departemen",
            type: "select",
            options: departments.map((department) => ({
              label: department.name,
              value: department.id,
            })),
            rules: [{ required: true, message: "Departemen wajib dipilih" }],
          },
        ]}
      />
    </>
  );
};

export default ProgramStudi;
