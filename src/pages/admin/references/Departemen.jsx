import { useEffect, useState } from "react";
import { message, Select } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";

const { Option } = Select;

// Data dummy departemen
const departemenData = [
  {
    key: 1,
    nama: "Teknik Informatika",
    fakultas: "Fakultas Teknik",
    status: "Aktif",
  },
  {
    key: 2,
    nama: "Teknik Sipil",
    fakultas: "Fakultas Teknik",
    status: "Aktif",
  },
  {
    key: 3,
    nama: "Manajemen",
    fakultas: "Fakultas Ekonomi",
    status: "Aktif",
  },
  {
    key: 4,
    nama: "Akuntansi",
    fakultas: "Fakultas Ekonomi",
    status: "Aktif",
  },
  {
    key: 5,
    nama: "Ilmu Hukum",
    fakultas: "Fakultas Hukum",
    status: "Aktif",
  },
  {
    key: 6,
    nama: "Kedokteran",
    fakultas: "Fakultas Kedokteran",
    status: "Aktif",
  },
  {
    key: 7,
    nama: "Matematika",
    fakultas: "Fakultas MIPA",
    status: "Nonaktif",
  },
  {
    key: 8,
    nama: "Fisika",
    fakultas: "Fakultas MIPA",
    status: "Aktif",
  },
  {
    key: 9,
    nama: "Agroteknologi",
    fakultas: "Fakultas Pertanian",
    status: "Aktif",
  },
  {
    key: 10,
    nama: "Peternakan",
    fakultas: "Fakultas Pertanian",
    status: "Aktif",
  },
];

// Filter options
const statusOptions = ["Semua", "Aktif", "Nonaktif"];
const fakultasOptions = [
  "Semua",
  "Fakultas Teknik",
  "Fakultas Ekonomi",
  "Fakultas Hukum",
  "Fakultas Kedokteran",
  "Fakultas MIPA",
  "Fakultas Pertanian",
];

const Departemen = () => {
  const [filteredDepartments, setFilteredDepartments] =
    useState(departemenData);
  const [filters, setFilters] = useState({
    status: "Semua",
    fakultas: "Semua",
  });

  useEffect(() => {
    document.title = "Kelola Departemen - Admin";
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    let filtered = departemenData;

    // Apply status filter
    if (newFilters.status !== "Semua") {
      filtered = filtered.filter((item) => item.status === newFilters.status);
    }

    // Apply fakultas filter
    if (newFilters.fakultas !== "Semua") {
      filtered = filtered.filter(
        (item) => item.fakultas === newFilters.fakultas
      );
    }

    setFilteredDepartments(filtered);
  };

  // Handle actions
  const handleAdd = () => {
    message.info("Menuju halaman tambah departemen...");
  };

  const handleDetail = (record) => {
    message.info(`Detail departemen: ${record.nama}`);
  };

  const handleEdit = (record) => {
    message.info(`Edit departemen: ${record.nama}`);
  };

  const handleDelete = (record) => {
    message.warning(`Hapus departemen: ${record.nama}`);
  };

  // Custom search function yang mempertahankan filters
  const handleSearch = (searchValue) => {
    let filtered = departemenData;

    // Apply filters first
    if (filters.status !== "Semua") {
      filtered = filtered.filter((item) => item.status === filters.status);
    }
    if (filters.fakultas !== "Semua") {
      filtered = filtered.filter((item) => item.fakultas === filters.fakultas);
    }

    // Apply search
    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.nama?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.fakultas?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredDepartments(filtered);
  };

  const departmentColumns = [
    createNumberColumn(),
    {
      title: "Nama Departemen",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
      width: "45%",
    },
    {
      title: "Fakultas",
      dataIndex: "fakultas",
      key: "fakultas",
      sorter: (a, b) => a.fakultas.localeCompare(b.fakultas),
      width: "25%",
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
      title="Kelola Departemen"
      data={filteredDepartments}
      columns={departmentColumns}
      searchFields={["nama", "fakultas"]}
      searchPlaceholder="Cari nama departemen atau fakultas..."
      addButtonText="Tambah Departemen"
      onAdd={handleAdd}
      pageSize={10}
      customFilters={
        <>
          <Select
            value={filters.fakultas}
            onChange={(value) => handleFilterChange("fakultas", value)}
            placeholder="Semua Fakultas"
            style={{ width: 180 }}
          >
            {fakultasOptions.map((option) => (
              <Option key={option} value={option}>
                {option === "Semua" ? "Semua Fakultas" : option}
              </Option>
            ))}
          </Select>
          <Select
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            placeholder="Semua Status"
            style={{ width: 150 }}
          >
            {statusOptions.map((option) => (
              <Option key={option} value={option}>
                {option === "Semua" ? "Semua Status" : option}
              </Option>
            ))}
          </Select>
        </>
      }
      onSearch={handleSearch}
    />
  );
};

export default Departemen;
