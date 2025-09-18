import React, { useEffect } from "react";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
  scholarshipData,
} from "../../../components/Table";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ScholarshipAdmin = () => {
  useEffect(() => {
    document.title = "Kelola Beasiswa - Admin";
  }, []);
  const columns = [
    createNumberColumn(),
    {
      title: "Nama Beasiswa",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
    },
    {
      title: "Penyedia",
      dataIndex: "penyedia",
      key: "penyedia",
    },
    createStatusColumn({
      Aktif: { color: "green" },
      Ditutup: { color: "red" },
      "Segera Berakhir": { color: "orange" },
    }),
    {
      title: "Batas Waktu",
      dataIndex: "batasWaktu",
      key: "batasWaktu",
    },
    createActionColumn([
      {
        key: "detail",
        label: "Detail",
        icon: <EyeOutlined />,
        onClick: (record) => console.log("Detail", record),
      },
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
      title="Kelola Beasiswa"
      data={scholarshipData}
      columns={columns}
      searchFields={["nama", "penyedia"]}
      searchPlaceholder="Cari nama beasiswa atau penyedia..."
      addButtonText="Tambah Beasiswa"
      onAdd={() => console.log("Add beasiswa")}
    />
  );
};

export default ScholarshipAdmin;
