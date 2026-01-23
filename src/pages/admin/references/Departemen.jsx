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

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const { alerts, success, error, removeAlert } = useAlert();

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
        id: department.id,
        nama: department.name,
        kode: department.code,
        fakultas: department.faculty ? department.faculty.name : "-",
        fakultasId: department.faculty ? department.faculty.id : null,
        status: department.is_active ? "Aktif" : "Nonaktif",
        is_active: department.is_active,
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
        err.message || "Gagal mengambil daftar departemen",
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
        err.message || "Gagal mengambil daftar fakultas",
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

  const handleToggleStatus = (record) => {
    const actionText = record.is_active ? "nonaktifkan" : "aktifkan";
    const actionTextCapital = record.is_active ? "Nonaktifkan" : "Aktifkan";

    setConfirmAction({
      type: record.is_active ? "deactivate" : "activate",
      record: record,
      title: `${actionTextCapital} Departemen`,
      content: `Apakah Anda yakin ingin ${actionText} departemen "${record.nama}"?`,
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
        await deactivateDepartment(confirmAction.record.id);
        success("Berhasil!", "Departemen berhasil dinonaktifkan");
      } else {
        await activateDepartment(confirmAction.record.id);
        success("Berhasil!", "Departemen berhasil diaktifkan");
      }

      setConfirmModalVisible(false);
      setConfirmAction(null);
      fetchDepartments();
    } catch (err) {
      error(
        "Gagal!",
        err.message ||
          `Gagal ${
            confirmAction.type === "deactivate"
              ? "menonaktifkan"
              : "mengaktifkan"
          } departemen`,
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
    setEditingDepartment(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingDepartment(record);
    setModalVisible(true);
  };

  const handleSearch = (searchValue) => {
    let filtered = departments;

    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.nama?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.fakultas?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.kode?.toLowerCase().includes(searchValue.toLowerCase()),
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
        title="Kelola Departemen"
        data={filteredDepartments}
        columns={departmentColumns}
        searchFields={["nama", "fakultas", "kode"]}
        searchPlaceholder="Cari nama departemen, fakultas, atau kode..."
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

export default Departemen;
