import React, { useEffect, useState } from "react";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import UniversalModal from "../../../components/Modal";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import {
  fetchUsersByRole,
  addUser,
  deactivateUser,
  updateUser,
  activateUser,
} from "../../../services/userService";
import { message } from "antd";

const Verifikator = () => {
  const [verifikatorData, setVerifikatorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fungsi untuk mengambil data
  const fetchVerifikator = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersByRole("verifikator");
      setVerifikatorData(data);
    } catch (error) {
      console.error("Error fetching Verifikator:", error);
      message.error(error.message || "Gagal mengambil data Verifikator");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Kelola Verifikator";
    fetchVerifikator(); // Panggil saat komponen pertama kali dimuat
  }, []);

  // Fungsi untuk menambahkan verifikator
  const handleAddVerifikator = async (values) => {
    setModalLoading(true);
    try {
      await addUser({ ...values, role: "VERIFIKATOR" }); // Tambahkan user
      message.success("Verifikator berhasil ditambahkan");
      setModalVisible(false); // Tutup modal
      await fetchVerifikator(); // Panggil ulang fungsi fetch untuk refresh data
    } catch (error) {
      console.error("Error adding verifikator:", error);
      message.error(error.message || "Gagal menambahkan verifikator");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeactivateUser = async (id) => {
    setLoading(true);
    try {
      await deactivateUser(id);
      message.success("User berhasil dinonaktifkan");
      fetchVerifikator(); // Refresh data
    } catch (error) {
      console.error("Error deactivating user:", error);
      message.error(error.message || "Gagal menonaktifkan user");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (id) => {
    setLoading(true);
    try {
      await activateUser(id);
      message.success("User berhasil diaktifkan");
      fetchVerifikator(); // Refresh data
    } catch (error) {
      console.error("Error activating user:", error);
      message.error(error.message || "Gagal mengaktifkan user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (id, values) => {
    setModalLoading(true);
    try {
      await updateUser(id, values);
      message.success("User berhasil diperbarui");
      setModalVisible(false);
      fetchVerifikator(); // Refresh data
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(error.message || "Gagal memperbarui user");
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
    createStatusColumn({
      Aktif: { color: "green" },
      Nonaktif: { color: "red" },
      mapValue: (record) => (record.is_active ? "Aktif" : "Nonaktif"),
    }),
    createActionColumn([
      {
        key: "edit",
        icon: <EditOutlined />,
        onClick: (record) => {
          setEditingUser(record);
          setModalVisible(true);
        },
      },
      {
        key: "toggleActive",
        icon: <DeleteOutlined />,
        danger: (record) => record.is_active, // kasih warna merah kalau aktif → mau dinonaktifkan
        onClick: (record) => {
          if (record.is_active) {
            handleDeactivateUser(record.id);
          } else {
            handleActivateUser(record.id);
          }
        },
      },
    ]),
  ];

  return (
    <>
      <UniversalTable
        title="Kelola Verifikator"
        data={verifikatorData}
        columns={columns}
        rowKey="id"
        loading={loading}
        searchFields={["full_name", "email"]}
        searchPlaceholder="Cari nama atau email..."
        addButtonText="Tambah Verifikator"
        onAdd={() => setModalVisible(true)}
      />

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
            handleAddVerifikator(values);
          }
        }}
        title={editingUser ? "Edit Verifikator" : "Tambah Verifikator"}
        loading={modalLoading}
        initialValues={
          editingUser
            ? {
                full_name: editingUser.full_name,
                phone_number: editingUser.phone_number,
              }
            : {}
        }
        fields={
          editingUser
            ? [
                // Field untuk edit - hanya full_name dan phone_number
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
              ]
            : [
                // Field untuk tambah verifikator baru
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

export default Verifikator;
