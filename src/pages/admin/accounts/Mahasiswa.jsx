import React, { useEffect, useState } from "react";
import { Switch, Modal } from "antd";
import UniversalTable, {
  createNumberColumn,
  createActionColumn,
} from "../../../components/Table";
import UniversalModal from "../../../components/Modal";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";
import {
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  fetchUsersByRole,
  addMahasiswa,
  updateUser,
  deactivateUser,
  activateUser,
} from "../../../services/userService";

const Mahasiswa = () => {
  const [mahasiswaData, setMahasiswaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const { alerts, success, error, removeAlert } = useAlert();

  const fetchMahasiswa = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersByRole("mahasiswa");
      setMahasiswaData(data);
    } catch (err) {
      console.error("Error fetching mahasiswa:", err);
      error(
        "Gagal Memuat Data",
        err.message || "Gagal mengambil data mahasiswa",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Kelola Mahasiswa";
    fetchMahasiswa();
  }, []);

  const handleAddMahasiswa = async (values) => {
    setModalLoading(true);
    try {
      await addMahasiswa(values);
      success("Sukses", "Mahasiswa berhasil ditambahkan");
      setModalVisible(false);
      fetchMahasiswa();
    } catch (err) {
      console.error("Error adding mahasiswa:", err);
      error("Gagal", err.message || "Gagal menambahkan mahasiswa");
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
      title: `${actionTextCapital} User`,
      content: `Apakah Anda yakin ingin ${actionText} user "${record.full_name}"?`,
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
        await deactivateUser(confirmAction.record.id);
        success("Berhasil!", "User berhasil dinonaktifkan");
      } else {
        await activateUser(confirmAction.record.id);
        success("Berhasil!", "User berhasil diaktifkan");
      }

      setConfirmModalVisible(false);
      setConfirmAction(null);
      fetchMahasiswa();
    } catch (err) {
      error(
        "Gagal!",
        err.message ||
          `Gagal ${
            confirmAction.type === "deactivate"
              ? "menonaktifkan"
              : "mengaktifkan"
          } user`,
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleConfirmCancel = () => {
    setConfirmModalVisible(false);
    setConfirmAction(null);
  };

  const handleEditUser = async (id, values) => {
    setModalLoading(true);
    try {
      await updateUser(id, values);
      success("Sukses", "User berhasil diperbarui");
      setModalVisible(false);
      fetchMahasiswa();
    } catch (err) {
      console.error("Error updating user:", err);
      error("Gagal", err.message || "Gagal memperbarui user");
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    createNumberColumn(),
    {
      title: "Nama",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Login Terakhir",
      dataIndex: "last_login_at",
      key: "last_login_at",
      sorter: (a, b) => new Date(a.last_login_at) - new Date(b.last_login_at),
      render: (date) =>
        date ? new Date(date).toLocaleString() : "Belum login",
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
    },
    createActionColumn([
      {
        key: "edit",
        icon: <EditOutlined />,
        onClick: (record) => {
          setEditingUser(record);
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
        title="Kelola Mahasiswa"
        data={mahasiswaData}
        columns={columns}
        rowKey="id"
        loading={loading}
        searchFields={["full_name", "email"]}
        searchPlaceholder="Cari nama atau email..."
        addButtonText="Tambah Mahasiswa"
        onAdd={() => setModalVisible(true)}
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
      <UniversalModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
        }}
        onSubmit={(values) => {
          if (editingUser) {
            handleEditUser(editingUser.id, values);
          } else {
            handleAddMahasiswa(values);
          }
        }}
        title={editingUser ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
        loading={modalLoading}
        initialValues={
          editingUser
            ? {
                full_name: editingUser.full_name,
                phone_number: editingUser.phone_number,
                email: editingUser.email,
              }
            : {}
        }
        fields={
          editingUser
            ? [
                {
                  name: "full_name",
                  label: "Nama Lengkap",
                  rules: [
                    { required: true, message: "Nama lengkap wajib diisi" },
                  ],
                },
                {
                  name: "phone_number",
                  label: "Nomor Telepon",
                  rules: [{ required: false }],
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  rules: [
                    { required: true, message: "Email wajib diisi" },
                    { type: "email", message: "Format email tidak valid" },
                  ],
                },
              ]
            : [
                {
                  name: "full_name",
                  label: "Nama Lengkap",
                  rules: [
                    { required: true, message: "Nama lengkap wajib diisi" },
                  ],
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  rules: [
                    { required: true, message: "Email wajib diisi" },
                    { type: "email", message: "Format email tidak valid" },
                  ],
                },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  rules: [{ required: true, message: "Password wajib diisi" }],
                },
              ]
        }
      />
    </>
  );
};

export default Mahasiswa;
