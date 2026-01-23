import { useEffect, useState } from "react";
import { Switch, Modal } from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import UniversalTable, {
  createNumberColumn,
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

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

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
        id: studyProgram.id,
        kode: studyProgram.code,
        jenjang: studyProgram.degree,
        departemen: studyProgram.department
          ? studyProgram.department.name
          : "-",
        departemenId: studyProgram.department
          ? studyProgram.department.id
          : null,
        status: studyProgram.is_active ? "Aktif" : "Nonaktif",
        is_active: studyProgram.is_active,
      }));
      setStudyPrograms(formattedData);
      setFilteredStudyPrograms(formattedData);

      const uniqueDepartemen = [
        ...new Set(formattedData.map((item) => item.departemen)),
      ].filter((f) => f !== "-");
      setDepartmentOptions(["Semua", ...uniqueDepartemen]);
    } catch (err) {
      console.error("Error fetching study programs:", err);
      error(
        "Gagal memuat data",
        err.message || "Gagal mengambil daftar program studi",
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
        err.message || "Gagal mengambil daftar departemen",
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

  const handleToggleStatus = (record) => {
    const actionText = record.is_active ? "nonaktifkan" : "aktifkan";
    const actionTextCapital = record.is_active ? "Nonaktifkan" : "Aktifkan";

    setConfirmAction({
      type: record.is_active ? "deactivate" : "activate",
      record: record,
      title: `${actionTextCapital} Program Studi`,
      content: `Apakah Anda yakin ingin ${actionText} program studi "${record.jenjang} - ${record.kode}"?`,
      okText: actionTextCapital,
      okType: record.is_active ? "danger" : "primary",
      icon: record.is_active ? (
        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "#52c41a" }} />
      ),
    });

    setConfirmModalVisible(true);
  };

  const handleConfirmOk = async () => {
    if (!confirmAction) return;

    try {
      setConfirmLoading(true);

      if (confirmAction.type === "deactivate") {
        await deactivateStudyProgram(confirmAction.record.id);
        success("Berhasil!", "Program Studi berhasil dinonaktifkan");
      } else {
        await activateStudyProgram(confirmAction.record.id);
        success("Berhasil!", "Program Studi berhasil diaktifkan");
      }

      setConfirmModalVisible(false);
      setConfirmAction(null);
      fetchStudyPrograms();
    } catch (err) {
      error(
        "Gagal!",
        err.message ||
          `Gagal ${
            confirmAction.type === "deactivate"
              ? "menonaktifkan"
              : "mengaktifkan"
          } program studi`,
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleConfirmCancel = () => {
    setConfirmModalVisible(false);
    setConfirmAction(null);
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
          item.jenjang?.toLowerCase().includes(searchValue.toLowerCase()),
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
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active, record) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              is_active
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {is_active ? "Aktif" : "Nonaktif"}
          </span>
          <Switch
            checked={is_active}
            onChange={() => handleToggleStatus(record)}
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren={<CloseCircleOutlined />}
            size="small"
          />
        </div>
      ),
      filters: [
        { text: "Aktif", value: true },
        { text: "Nonaktif", value: false },
      ],
      onFilter: (value, record) => record.is_active === value,
      width: "20%",
    },
    createActionColumn([
      {
        key: "edit",
        icon: <EditOutlined />,
        onClick: handleEdit,
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

      <Modal
        title={
          <div className="flex items-center gap-2">
            {confirmAction?.icon}
            <span>{confirmAction?.title}</span>
          </div>
        }
        open={confirmModalVisible}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        confirmLoading={confirmLoading}
        okText={confirmAction?.okText || "OK"}
        cancelText="Batal"
        okButtonProps={{
          danger: confirmAction?.okType === "danger",
          loading: confirmLoading,
        }}
      >
        <p>{confirmAction?.content}</p>
      </Modal>
    </>
  );
};

export default ProgramStudi;
