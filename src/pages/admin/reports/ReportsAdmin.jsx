import { useEffect, useState } from "react";
import { Select, message } from "antd";
import {
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import {
  HorizontalBarChart,
  LineChart,
  PieChart,
  tahunData,
  genderData,
  fakultasData,
  departemenData,
} from "../../../components/Chart";

const { Option } = Select;

// Data untuk dropdown tahun
const years = [2021, 2022, 2023, 2024, 2025];

// Data summary utama
const mainSummaryData = [
  {
    title: "Jumlah Pendaftar",
    value: 1240,
    color: "text-blue-600",
  },
  {
    title: "Jumlah Beasiswa",
    value: 15,
    color: "text-purple-600",
  },
  {
    title: "Beasiswa Masih Buka",
    value: 8,
    color: "text-green-600",
  },
  {
    title: "Beasiswa Sudah Tutup",
    value: 7,
    color: "text-red-600",
  },
];

// Data summary status seleksi
const selectionSummaryData = [
  {
    title: "Lolos Seleksi Berkas",
    value: 450,
    color: "text-green-600",
  },
  {
    title: "Menunggu Verifikasi",
    value: 320,
    color: "text-orange-600",
  },
  {
    title: "Menunggu Validasi",
    value: 180,
    color: "text-yellow-600",
  },
  {
    title: "Tidak Lolos Seleksi",
    value: 290,
    color: "text-red-600",
  },
];

// Data pendaftar beasiswa
const pendaftarData = [
  {
    key: 1,
    nama: "Andi Pratama",
    nim: "2021001001",
    fakultas: "Teknik",
    departemen: "Informatika",
    gender: "Laki-laki",
    status: "Disetujui",
    beasiswa: "Beasiswa Unggulan UNAND",
  },
  {
    key: 2,
    nama: "Siti Nurhaliza",
    nim: "2021002002",
    fakultas: "Ekonomi",
    departemen: "Manajemen",
    gender: "Perempuan",
    status: "Menunggu Verifikasi",
    beasiswa: "Beasiswa KIP Kuliah",
  },
  {
    key: 3,
    nama: "Budi Santoso",
    nim: "2021003003",
    fakultas: "Hukum",
    departemen: "Ilmu Hukum",
    gender: "Laki-laki",
    status: "Ditolak",
    beasiswa: "Beasiswa Bank Indonesia",
  },
  {
    key: 4,
    nama: "Dewi Sartika",
    nim: "2021004004",
    fakultas: "Kedokteran",
    departemen: "Kedokteran",
    gender: "Perempuan",
    status: "Menunggu Validasi",
    beasiswa: "Beasiswa Djarum Foundation",
  },
  {
    key: 5,
    nama: "Eka Putra",
    nim: "2021005005",
    fakultas: "MIPA",
    departemen: "Matematika",
    gender: "Laki-laki",
    status: "Disetujui",
    beasiswa: "Beasiswa Tanoto Foundation",
  },
];

// Filter options
const fakultasOptions = [
  "Semua",
  "Teknik",
  "Ekonomi",
  "Hukum",
  "Kedokteran",
  "MIPA",
  "Pertanian",
];
const departemenOptions = [
  "Semua",
  "Informatika",
  "Manajemen",
  "Ilmu Hukum",
  "Kedokteran",
  "Matematika",
  "Agroteknologi",
];
const genderOptions = ["Semua", "Laki-laki", "Perempuan"];

const ReportsAdmin = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredPendaftar, setFilteredPendaftar] = useState(pendaftarData);
  const [filters, setFilters] = useState({
    fakultas: "Semua",
    departemen: "Semua",
    gender: "Semua",
  });

  useEffect(() => {
    document.title = "Laporan - Admin";
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    message.info(`Menampilkan data tahun ${year}`);
  };

  const handleExportReport = () => {
    message.success(`Mengunduh laporan tahun ${selectedYear}...`);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    let filtered = pendaftarData;

    if (newFilters.fakultas !== "Semua") {
      filtered = filtered.filter(
        (item) => item.fakultas === newFilters.fakultas
      );
    }
    if (newFilters.departemen !== "Semua") {
      filtered = filtered.filter(
        (item) => item.departemen === newFilters.departemen
      );
    }
    if (newFilters.gender !== "Semua") {
      filtered = filtered.filter((item) => item.gender === newFilters.gender);
    }

    setFilteredPendaftar(filtered);
  };

  const handleDetail = (record) => {
    message.info(`Detail pendaftar: ${record.nama}`);
  };

  const handleEdit = (record) => {
    message.info(`Edit pendaftar: ${record.nama}`);
  };

  const handleDelete = (record) => {
    message.warning(`Hapus pendaftar: ${record.nama}`);
  };

  const pendaftarColumns = [
    createNumberColumn(),
    {
      title: "Nama Pendaftar",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
    },
    {
      title: "NIM",
      dataIndex: "nim",
      key: "nim",
    },
    createStatusColumn({
      Disetujui: { color: "green" },
      "Menunggu Verifikasi": { color: "orange" },
      "Menunggu Validasi": { color: "gold" },
      Ditolak: { color: "red" },
    }),
    {
      title: "Beasiswa",
      dataIndex: "beasiswa",
      key: "beasiswa",
      sorter: (a, b) => a.beasiswa.localeCompare(b.beasiswa),
    },
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 120 }}
            size="large"
          >
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          onClick={handleExportReport}
          className="flex items-center gap-2"
        >
          <DownloadOutlined />
          Export Laporan
        </Button>
      </div>

      {/* Main Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mainSummaryData.map((item, idx) => (
          <Card key={idx}>
            <div className="flex flex-col items-center py-4">
              <span className="text-sm text-gray-600 mb-2">{item.title}</span>
              <span className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Selection Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {selectionSummaryData.map((item, idx) => (
          <Card key={idx}>
            <div className="flex flex-col items-center py-4">
              <span className="text-sm text-gray-600 mb-2">{item.title}</span>
              <span className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HorizontalBarChart
          data={fakultasData}
          title="Penerima Berdasarkan Fakultas"
          description={`Distribusi penerima beasiswa per fakultas tahun ${selectedYear}`}
        />
        <HorizontalBarChart
          data={departemenData}
          title="Penerima Berdasarkan Departemen"
          description={`Distribusi penerima beasiswa per departemen tahun ${selectedYear}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LineChart
          data={tahunData}
          title="Penerima Tahun ke Tahun"
          description="Perbandingan penerima beasiswa dari tahun ke tahun"
        />
        <PieChart
          data={genderData}
          title="Penerima Berdasarkan Gender"
          description="Distribusi penerima beasiswa berdasarkan gender"
        />
      </div>

      {/* Pendaftar Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Pendaftar Beasiswa
          </h2>
        </div>
        <UniversalTable
          title=""
          data={filteredPendaftar}
          columns={pendaftarColumns}
          searchFields={["nama", "nim", "beasiswa"]}
          searchPlaceholder="Cari nama, NIM, atau beasiswa..."
          onAdd={null}
          pageSize={8}
          customFilters={
            <>
              <Select
                value={filters.fakultas}
                onChange={(value) => handleFilterChange("fakultas", value)}
                placeholder="Semua Fakultas"
                style={{ width: 140 }}
              >
                {fakultasOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option === "Semua" ? "Semua Fakultas" : option}
                  </Option>
                ))}
              </Select>

              <Select
                value={filters.departemen}
                onChange={(value) => handleFilterChange("departemen", value)}
                placeholder="Semua Departemen"
                style={{ width: 150 }}
              >
                {departemenOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option === "Semua" ? "Semua Departemen" : option}
                  </Option>
                ))}
              </Select>

              <Select
                value={filters.gender}
                onChange={(value) => handleFilterChange("gender", value)}
                placeholder="Semua Gender"
                style={{ width: 130 }}
              >
                {genderOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option === "Semua" ? "Semua Gender" : option}
                  </Option>
                ))}
              </Select>
            </>
          }
          onSearch={(value) => {
            // Custom search logic yang mempertahankan filter
            let filtered = pendaftarData;

            // Apply filters
            if (filters.fakultas !== "Semua") {
              filtered = filtered.filter(
                (item) => item.fakultas === filters.fakultas
              );
            }
            if (filters.departemen !== "Semua") {
              filtered = filtered.filter(
                (item) => item.departemen === filters.departemen
              );
            }
            if (filters.gender !== "Semua") {
              filtered = filtered.filter(
                (item) => item.gender === filters.gender
              );
            }

            // Apply search
            if (value) {
              filtered = filtered.filter(
                (item) =>
                  item.nama?.toLowerCase().includes(value.toLowerCase()) ||
                  item.nim?.toLowerCase().includes(value.toLowerCase()) ||
                  item.beasiswa?.toLowerCase().includes(value.toLowerCase())
              );
            }

            setFilteredPendaftar(filtered);
          }}
        />
      </div>
    </div>
  );
};

export default ReportsAdmin;
