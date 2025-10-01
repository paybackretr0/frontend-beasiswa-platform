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
  updateUser,
  deactivateUser,
  activateUser,
} from "../../../services/userService";
import { message } from "antd";

const PimpinanDitmawa = () => {
  const [pimpinanDitmawaData, setPimpinanDitmawaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchPimpinanDitmawa = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersByRole("pimpinan-ditmawa");
      setPimpinanDitmawaData(data);
    } catch (error) {
      console.error("Error fetching Pimpinan Ditmawa:", error);
      message.error(error.message || "Gagal mengambil data Pimpinan Ditmawa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Kelola Pimpinan Ditmawa";
    fetchPimpinanDitmawa(); // Panggil saat komponen pertama kali dimuat
  }, []);

  const handleAddPimpinanDitmawa = async (values) => {
    setModalLoading(true);
    try {
      await addUser({ ...values, role: "PIMPINAN_DITMAWA" }); // Tambahkan user
      message.success("Pimpinan Ditmawa berhasil ditambahkan");
      setModalVisible(false); // Tutup modal
      await fetchPimpinanDitmawa(); // Panggil ulang fungsi fetch untuk refresh data
    } catch (error) {
      console.error("Error adding Pimpinan Ditmawa:", error);
      message.error(error.message || "Gagal menambahkan Pimpinan Ditmawa");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditUser = async (id, values) => {
    setModalLoading(true);
    try {
      await updateUser(id, values);
      message.success("User berhasil diperbarui");
      setModalVisible(false);
      fetchPimpinanDitmawa(); // Refresh data
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(error.message || "Gagal memperbarui user");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeactivateUser = async (id) => {
    setLoading(true);
    try {
      await deactivateUser(id);
      message.success("User berhasil dinonaktifkan");
      fetchPimpinanDitmawa(); // Refresh data
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
      fetchPimpinanDitmawa(); // Refresh data
    } catch (error) {
      console.error("Error activating user:", error);
      message.error(error.message || "Gagal mengaktifkan user");
    } finally {
      setLoading(false);
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
        label: (record) => (record.is_active ? "Nonaktifkan" : "Aktifkan"),
        icon: (record) =>
          record.is_active ? <DeleteOutlined /> : <CheckOutlined />,
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
        title="Kelola Pimpinan Ditmawa"
        data={pimpinanDitmawaData}
        columns={columns}
        rowKey="id"
        loading={loading}
        searchFields={["full_name", "email"]}
        searchPlaceholder="Cari nama atau email..."
        addButtonText="Tambah Pimpinan Ditmawa"
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
            handleAddPimpinanDitmawa(values);
          }
        }}
        title={
          editingUser ? "Edit Pimpinan Ditmawa" : "Tambah Pimpinan Ditmawa"
        }
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
                // Field untuk tambah pimpinan ditmawa baru
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

export default PimpinanDitmawa;
