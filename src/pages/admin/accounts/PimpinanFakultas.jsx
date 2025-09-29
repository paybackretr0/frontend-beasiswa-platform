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
  addPimpinanFakultas,
  deactivateUser,
  updateUser,
  activateUser,
} from "../../../services/userService";
import { getFaculties } from "../../../services/facultyService";
import { message } from "antd";

const PimpinanFakultas = () => {
  const [pimpinanFakultasData, setPimpinanFakultasData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchFaculties = async () => {
    try {
      const data = await getFaculties();
      setFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      message.error(error.message || "Gagal mengambil daftar fakultas");
    }
  };

  const fetchPimpinanFakultas = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersByRole("pimpinan-fakultas");
      setPimpinanFakultasData(data);
    } catch (error) {
      console.error("Error fetching Pimpinan Fakultas:", error);
      message.error(error.message || "Gagal mengambil data Pimpinan Fakultas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Kelola Pimpinan Fakultas";
    fetchPimpinanFakultas(); // Panggil saat komponen pertama kali dimuat
    fetchFaculties();
  }, []);

  const handleAddPimpinanFakultas = async (values) => {
    setModalLoading(true);
    try {
      await addPimpinanFakultas(values); // Tambahkan user
      message.success("Pimpinan Fakultas berhasil ditambahkan");
      setModalVisible(false); // Tutup modal
      await fetchPimpinanFakultas(); // Panggil ulang fungsi fetch untuk refresh data
    } catch (error) {
      console.error("Error adding Pimpinan Fakultas:", error);
      message.error(error.message || "Gagal menambahkan Pimpinan Fakultas");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeactivateUser = async (id) => {
    setLoading(true);
    try {
      await deactivateUser(id);
      message.success("User berhasil dinonaktifkan");
      fetchPimpinanFakultas(); // Refresh data
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
      fetchPimpinanFakultas(); // Refresh data
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
      fetchPimpinanFakultas(); // Refresh data
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
        title="Kelola Pimpinan Fakultas"
        data={pimpinanFakultasData}
        columns={columns}
        rowKey="id"
        loading={loading}
        searchFields={["full_name", "email"]}
        searchPlaceholder="Cari nama atau email..."
        addButtonText="Tambah Pimpinan Fakultas"
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
            handleAddPimpinanFakultas(values);
          }
        }}
        title={
          editingUser ? "Edit Pimpinan Fakultas" : "Tambah Pimpinan Fakultas"
        }
        loading={modalLoading}
        initialValues={
          editingUser
            ? {
                full_name: editingUser.full_name,
                phone_number: editingUser.phone_number,
                faculty_id: editingUser.faculty_id,
              }
            : {}
        }
        fields={
          editingUser
            ? [
                // Field untuk edit - full_name, phone_number, faculty_id
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
                  name: "faculty_id",
                  label: "Fakultas",
                  type: "select",
                  options: faculties.map((faculty) => ({
                    label: faculty.name,
                    value: faculty.id,
                  })),
                  rules: [
                    { required: true, message: "Fakultas wajib dipilih" },
                  ],
                },
              ]
            : [
                // Field untuk tambah pimpinan fakultas baru
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
                {
                  name: "faculty_id",
                  label: "Fakultas",
                  type: "select",
                  options: faculties.map((faculty) => ({
                    label: faculty.name,
                    value: faculty.id,
                  })),
                  rules: [
                    { required: true, message: "Fakultas wajib dipilih" },
                  ],
                },
              ]
        }
      />
    </>
  );
};

export default PimpinanFakultas;
