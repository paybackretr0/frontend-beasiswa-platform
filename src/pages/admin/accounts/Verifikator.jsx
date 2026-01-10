import React, { useEffect, useState } from "react";
import { Tag } from "antd";
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
  addVerifikator,
  updateVerifikator,
  deactivateUser,
  activateUser,
} from "../../../services/userService";
import { getFaculties } from "../../../services/facultyService";

const Verifikator = () => {
  const [verifikatorData, setVerifikatorData] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const { alerts, success, error, removeAlert } = useAlert();

  const fetchVerifikator = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersByRole("verifikator");
      setVerifikatorData(data);
    } catch (err) {
      console.error("Error fetching Verifikator:", err);
      error(
        "Gagal Memuat Data",
        err.message || "Gagal mengambil data Verifikator"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultyData = async () => {
    try {
      const data = await getFaculties();
      setFaculties(data);
    } catch (err) {
      console.error("Error fetching faculties:", err);
    }
  };

  useEffect(() => {
    document.title = "Kelola Verifikator";
    fetchVerifikator();
    fetchFacultyData();
  }, []);

  const handleAddVerifikator = async (values) => {
    setModalLoading(true);
    try {
      await addVerifikator(values);
      success("Sukses", "Verifikator berhasil ditambahkan");
      setModalVisible(false);
      setSelectedRole(null);
      await fetchVerifikator();
    } catch (err) {
      console.error("Error adding verifikator:", err);
      error("Gagal", err.message || "Gagal menambahkan verifikator");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeactivateUser = async (id) => {
    setLoading(true);
    try {
      await deactivateUser(id);
      success("Berhasil!", "User berhasil dinonaktifkan");
      fetchVerifikator();
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
      fetchVerifikator();
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
      await updateVerifikator(id, values);
      success("Sukses", "Verifikator berhasil diperbarui");
      setModalVisible(false);
      setEditingUser(null);
      fetchVerifikator();
    } catch (err) {
      console.error("Error updating verifikator:", err);
      error("Gagal", err.message || "Gagal memperbarui verifikator");
    } finally {
      setModalLoading(false);
    }
  };

  const getRoleTag = (role) => {
    if (role === "VERIFIKATOR_FAKULTAS") {
      return <Tag color="blue">Fakultas</Tag>;
    }
    if (role === "VERIFIKATOR_DITMAWA") {
      return <Tag color="green">Ditmawa</Tag>;
    }
    return <Tag>{role}</Tag>;
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
      title: "Tipe",
      dataIndex: "role",
      key: "role",
      render: (role) => getRoleTag(role),
      filters: [
        { text: "Verifikator Fakultas", value: "VERIFIKATOR_FAKULTAS" },
        { text: "Verifikator Ditmawa", value: "VERIFIKATOR_DITMAWA" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Fakultas/Unit",
      dataIndex: ["faculty", "name"],
      key: "faculty",
      render: (_, record) => record.faculty?.name || "Ditmawa Unand",
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
          setSelectedRole(record.role);
          setModalVisible(true);
        },
      },
      {
        key: "toggleActive",
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

  const getModalFields = () => {
    const baseFields = editingUser
      ? [
          {
            name: "full_name",
            label: "Nama Lengkap",
            rules: [{ required: true, message: "Nama lengkap wajib diisi" }],
          },
          {
            name: "phone_number",
            label: "Nomor Telepon",
            rules: [{ required: false }],
          },
        ]
      : [
          {
            name: "role",
            label: "Tipe Verifikator",
            type: "select",
            options: [
              { value: "VERIFIKATOR_FAKULTAS", label: "Verifikator Fakultas" },
              { value: "VERIFIKATOR_DITMAWA", label: "Verifikator Ditmawa" },
            ],
            rules: [
              { required: true, message: "Tipe verifikator wajib dipilih" },
            ],
            onChange: (value) => setSelectedRole(value),
          },
          {
            name: "full_name",
            label: "Nama Lengkap",
            rules: [{ required: true, message: "Nama lengkap wajib diisi" }],
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
        ];

    const needsFaculty = editingUser
      ? editingUser.role === "VERIFIKATOR_FAKULTAS"
      : selectedRole === "VERIFIKATOR_FAKULTAS";

    if (needsFaculty) {
      baseFields.push({
        name: "faculty_id",
        label: "Fakultas",
        type: "select",
        options: faculties.map((f) => ({ value: f.id, label: f.name })),
        rules: [{ required: true, message: "Fakultas wajib dipilih" }],
      });
    }

    return baseFields;
  };

  return (
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
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
          setSelectedRole(null);
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
                faculty_id: editingUser.faculty_id,
              }
            : {}
        }
        fields={getModalFields()}
      />
    </>
  );
};

export default Verifikator;
