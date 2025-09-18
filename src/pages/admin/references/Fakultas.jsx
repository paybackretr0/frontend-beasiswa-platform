import { useEffect, useState } from "react";
import { message, Select } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";

const { Option } = Select;

// Data dummy fakultas yang benar
const fakultasData = [
  {
    key: 1,
    nama: "Fakultas Teknik",
    jumlahDepartemen: 4,
    status: "Aktif",
  },
  {
    key: 2,
    nama: "Fakultas Ekonomi",
    jumlahDepartemen: 3,
    status: "Aktif",
  },
  {
    key: 3,
    nama: "Fakultas Hukum",
    jumlahDepartemen: 2,
    status: "Aktif",
  },
  {
    key: 4,
    nama: "Fakultas Kedokteran",
    jumlahDepartemen: 5,
    status: "Aktif",
  },
  {
    key: 5,
    nama: "Fakultas MIPA",
    jumlahDepartemen: 6,
    status: "Nonaktif",
  },
  {
    key: 6,
    nama: "Fakultas Pertanian",
    jumlahDepartemen: 4,
    status: "Aktif",
  },
];

// Filter options
const statusOptions = ["Semua", "Aktif", "Nonaktif"];

const Fakultas = () => {
  const [filteredFaculties, setFilteredFaculties] = useState(fakultasData);
  const [statusFilter, setStatusFilter] = useState("Semua");

  useEffect(() => {
    document.title = "Kelola Fakultas - Admin";
  }, []);

  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);

    if (status === "Semua") {
      setFilteredFaculties(fakultasData);
    } else {
      const filtered = fakultasData.filter((item) => item.status === status);
      setFilteredFaculties(filtered);
    }
  };

  // Handle actions
  const handleAdd = () => {
    message.info("Menuju halaman tambah fakultas...");
  };

  const handleDetail = (record) => {
    message.info(`Detail fakultas: ${record.nama}`);
  };

  const handleEdit = (record) => {
    message.info(`Edit fakultas: ${record.nama}`);
  };

  const handleDelete = (record) => {
    message.warning(`Hapus fakultas: ${record.nama}`);
  };

  // Custom search function yang mempertahankan filter status
  const handleSearch = (searchValue) => {
    let filtered = fakultasData;

    // Apply status filter first
    if (statusFilter !== "Semua") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply search
    if (searchValue) {
      filtered = filtered.filter((item) =>
        item.nama?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredFaculties(filtered);
  };

  const facultyColumns = [
    createNumberColumn(),
    {
      title: "Nama Fakultas",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      width: "45%",
    },
    {
      title: "Jumlah Departemen",
      dataIndex: "jumlahDepartemen",
      key: "jumlahDepartemen",
      sorter: (a, b) => a.jumlahDepartemen - b.jumlahDepartemen,
      width: "25%",
      align: "center",
    },
    createStatusColumn({
      Aktif: { color: "green" },
      Nonaktif: { color: "red" },
    }),
    createActionColumn([
      {
        key: "detail",
        label: "Detail",
        icon: <EyeOutlined />,
        onClick: handleDetail,
      },
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: handleEdit,
      },
      {
        key: "delete",
        label: "Hapus",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: handleDelete,
      },
    ]),
  ];

  return (
    <UniversalTable
      title="Kelola Fakultas"
      data={filteredFaculties}
      columns={facultyColumns}
      searchFields={["nama"]}
      searchPlaceholder="Cari nama fakultas..."
      addButtonText="Tambah Fakultas"
      onAdd={handleAdd}
      pageSize={10}
      customFilters={
        <Select
          value={statusFilter}
          onChange={handleStatusFilter}
          placeholder="Semua Status"
          style={{ width: 150 }}
        >
          {statusOptions.map((option) => (
            <Option key={option} value={option}>
              {option === "Semua" ? "Semua Status" : option}
            </Option>
          ))}
        </Select>
      }
      onSearch={handleSearch}
    />
  );
};

export default Fakultas;
