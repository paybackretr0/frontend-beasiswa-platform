import React, { useEffect, useState } from "react";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import UniversalModal from "../../../components/Modal";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";
import { EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import {
  fetchUsersByRole,
  addPimpinanFakultas,
  deactivateUser,
  updateUser,
  activateUser,
} from "../../../services/userService";
import { getFaculties } from "../../../services/facultyService";

const PimpinanFakultas = () => {
  const [pimpinanFakultasData, setPimpinanFakultasData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const { alerts, success, error, warning, removeAlert } = useAlert();

  const fetchFaculties = async () => {
    try {
      const data = await getFaculties();
      setFaculties(data);
    } catch (err) {
      console.error("Error fetching faculties:", err);
      error(
        "Gagal Memuat Data",
        err.message || "Gagal mengambil data fakultas"
      );
    }
  };

  const fetchPimpinanFakultas = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersByRole("pimpinan-fakultas");
      setPimpinanFakultasData(data);
    } catch (err) {
      console.error("Error fetching Pimpinan Fakultas:", err);
      error(
        "Gagal Memuat Data",
        err.message || "Gagal mengambil data pimpinan fakultas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Kelola Pimpinan Fakultas";
    fetchPimpinanFakultas();
    fetchFaculties();
  }, []);

  const handleAddPimpinanFakultas = async (values) => {
    setModalLoading(true);
    try {
      await addPimpinanFakultas(values);
      success("Sukses", "Pimpinan Fakultas berhasil ditambahkan");
      setModalVisible(false);
      await fetchPimpinanFakultas();
    } catch (err) {
      console.error("Error adding Pimpinan Fakultas:", err);
      error("Gagal", err.message || "Gagal menambahkan Pimpinan Fakultas");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeactivateUser = async (id) => {
    setLoading(true);
    try {
      await deactivateUser(id);
      success("Berhasil!", "User berhasil dinonaktifkan");
      fetchPimpinanFakultas();
    } catch (err) {
      console.error("Error deactivating user:", err);
      error("Gagal", err.message || "Gagal menonaktifkan user");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (id) => {
    setLoading(true);
    try {
      await activateUser(id);
      success("Sukses", "User berhasil diaktifkan");
      fetchPimpinanFakultas();
    } catch (err) {
      console.error("Error activating user:", err);
      error("Gagal", err.message || "Gagal mengaktifkan user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (id, values) => {
    setModalLoading(true);
    try {
      await updateUser(id, values);
      success("Sukses", "User berhasil diperbarui");
      setModalVisible(false);
      fetchPimpinanFakultas();
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
        danger: (record) => record.is_active,
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
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
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
