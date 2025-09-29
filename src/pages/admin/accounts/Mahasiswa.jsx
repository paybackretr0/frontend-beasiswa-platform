import React, { useEffect, useState } from "react";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import UniversalModal from "../../../components/Modal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  fetchUsersByRole,
  addMahasiswa,
  updateUser,
  deactivateUser,
  activateUser,
} from "../../../services/userService";
import { message } from "antd";

const Mahasiswa = () => {
  const [mahasiswaData, setMahasiswaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchMahasiswa = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersByRole("mahasiswa");
      setMahasiswaData(data);
    } catch (error) {
      console.error("Error fetching mahasiswa:", error);
      message.error(error.message || "Gagal mengambil data mahasiswa");
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
      message.success("Mahasiswa berhasil ditambahkan");
      setModalVisible(false);
      fetchMahasiswa(); // Refresh data
    } catch (error) {
      console.error("Error adding mahasiswa:", error);
      message.error(error.message || "Gagal menambahkan mahasiswa");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeactivateUser = async (id) => {
    setLoading(true);
    try {
      await deactivateUser(id);
      message.success("User berhasil dinonaktifkan");
      fetchMahasiswa(); // Refresh data
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
      fetchMahasiswa(); // Refresh data
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
      fetchMahasiswa(); // Refresh data
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
          console.log("Editing user:", record);
          setEditingUser(record);
          setModalVisible(true);
        },
      },
      {
        key: "toggleActive",
        label: (record) => (record.is_active ? "Nonaktifkan" : "Aktifkan"),
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
                // Field untuk tambah mahasiswa baru
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
