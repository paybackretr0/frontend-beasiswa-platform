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

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

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
        id: faculty.id,
        nama: faculty.name,
        kode: faculty.code,
        jumlahDepartemen: faculty.departments_count || 0,
        status: faculty.is_active ? "Aktif" : "Nonaktif",
        is_active: faculty.is_active,
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

  const handleToggleStatus = (record) => {
    const actionText = record.is_active ? "nonaktifkan" : "aktifkan";
    const actionTextCapital = record.is_active ? "Nonaktifkan" : "Aktifkan";

    setConfirmAction({
      type: record.is_active ? "deactivate" : "activate",
      record: record,
      title: `${actionTextCapital} Fakultas`,
      content: `Apakah Anda yakin ingin ${actionText} fakultas "${record.nama}"?`,
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
        await deactivateFaculty(confirmAction.record.id);
        success("Berhasil!", "Fakultas berhasil dinonaktifkan");
      } else {
        await activateFaculty(confirmAction.record.id);
        success("Berhasil!", "Fakultas berhasil diaktifkan");
      }

      setConfirmModalVisible(false);
      setConfirmAction(null);
      fetchFaculties();
    } catch (err) {
      error(
        "Gagal!",
        err.message ||
          `Gagal ${
            confirmAction.type === "deactivate"
              ? "menonaktifkan"
              : "mengaktifkan"
          } fakultas`,
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
    setModalVisible(true);
  };

  const handleSearch = (searchValue) => {
    let filtered = faculties;

    if (statusFilter !== "Semua") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (searchValue) {
      filtered = filtered.filter((item) =>
        item.nama?.toLowerCase().includes(searchValue.toLowerCase()),
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
        onClick: (record) => {
          setEditingFaculty(record);
          setModalVisible(true);
        },
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

export default Fakultas;
