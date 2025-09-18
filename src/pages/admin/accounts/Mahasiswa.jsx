import React, { useEffect } from "react";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
  mahasiswaData,
} from "../../../components/Table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Mahasiswa = () => {
  useEffect(() => {
    document.title = "Kelola Akun - Admin";
  }, []);
  const columns = [
    createNumberColumn(),
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Login Terakhir",
      dataIndex: "loginTerakhir",
      key: "loginTerakhir",
      sorter: (a, b) => new Date(a.loginTerakhir) - new Date(b.loginTerakhir),
    },
    createStatusColumn({
      Aktif: { color: "green" },
      Nonaktif: { color: "red" },
    }),
    createActionColumn([
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: (record) => console.log("Edit", record),
      },
      {
        key: "delete",
        label: "Hapus",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: (record) => console.log("Delete", record),
      },
    ]),
  ];

  return (
    <UniversalTable
      title="Kelola Mahasiswa"
      data={mahasiswaData}
      columns={columns}
      searchFields={["nama", "email"]}
      searchPlaceholder="Cari nama atau email..."
      addButtonText="Tambah Mahasiswa"
      onAdd={() => console.log("Add mahasiswa")}
    />
  );
};

export default Mahasiswa;
