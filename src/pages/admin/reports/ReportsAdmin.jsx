import { useEffect, useState } from "react";
import { Select, message, Spin } from "antd";
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
  ChartEmptyState,
} from "../../../components/Chart";
import {
  getSummary,
  getSelectionSummary,
  getFacultyDistribution,
  getDepartmentDistribution,
  getYearlyTrend,
  getGenderDistribution,
  getApplicationsList,
  getFilterOptions,
} from "../../../services/analyticsService";

const { Option } = Select;

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 2025 + 1 },
  (_, i) => 2025 + i
);

const ReportsAdmin = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  const [mainSummaryData, setMainSummaryData] = useState([]);
  const [selectionSummaryData, setSelectionSummaryData] = useState([]);

  const [fakultasData, setFakultasData] = useState([]);
  const [departemenData, setDepartemenData] = useState([]);
  const [tahunData, setTahunData] = useState([]);
  const [genderData, setGenderData] = useState([]);

  const [pendaftarData, setPendaftarData] = useState([]);
  const [filteredPendaftar, setFilteredPendaftar] = useState([]);

  const [filters, setFilters] = useState({
    fakultas: "Semua",
    departemen: "Semua",
    gender: "Semua",
  });
  const [filterOptions, setFilterOptions] = useState({
    faculties: [],
    departments: [],
    genders: [],
  });

  useEffect(() => {
    document.title = "Laporan - Admin";
    fetchAllData();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [selectedYear]);

  const fetchAllData = async () => {
    setMainSummaryData([]);
    setSelectionSummaryData([]);
    setFakultasData([]);
    setDepartemenData([]);
    setTahunData([]);
    setGenderData([]);
    setPendaftarData([]);
    setFilteredPendaftar([]);

    setLoading(true);
    setChartsLoading(true);

    try {
      await Promise.all([fetchMainSummary(), fetchSelectionSummary()]);

      setLoading(false);

      await Promise.all([fetchChartData(), fetchPendaftarData()]);
    } catch (error) {
      console.error("Error fetching all data:", error);
      message.error("Gagal memuat data laporan");
    } finally {
      setChartsLoading(false);
    }
  };

  const fetchMainSummary = async () => {
    try {
      const data = await getSummary(selectedYear);
      const summary = [
        {
          title: "Jumlah Pendaftar",
          value: data.totalPendaftar || 0,
          color: "text-blue-600",
        },
        {
          title: "Jumlah Beasiswa",
          value: data.totalBeasiswa || 0,
          color: "text-purple-600",
        },
        {
          title: "Beasiswa Masih Buka",
          value: data.beasiswaMasihBuka || 0,
          color: "text-green-600",
        },
        {
          title: "Beasiswa Sudah Tutup",
          value: data.beasiswaSudahTutup || 0,
          color: "text-red-600",
        },
      ];
      setMainSummaryData(summary);
    } catch (error) {
      console.error("Error fetching main summary:", error);
    }
  };

  const fetchSelectionSummary = async () => {
    try {
      const data = await getSelectionSummary(selectedYear);
      const summary = [
        {
          title: "Jumlah Mahasiswa Diterima",
          value: data.lolosSeleksiBerkas || 0,
          color: "text-green-600",
        },
        {
          title: "Menunggu Verifikasi",
          value: data.menungguVerifikasi || 0,
          color: "text-orange-600",
        },
        {
          title: "Menunggu Validasi",
          value: data.menungguValidasi || 0,
          color: "text-yellow-600",
        },
        {
          title: "Tidak Lolos Seleksi",
          value: data.tidakLolosSeleksi || 0,
          color: "text-red-600",
        },
      ];
      setSelectionSummaryData(summary);
    } catch (error) {
      console.error("Error fetching selection summary:", error);
    }
  };

  const fetchChartData = async () => {
    try {
      const [fakultas, departemen, tahun, gender] = await Promise.all([
        getFacultyDistribution(selectedYear),
        getDepartmentDistribution(selectedYear),
        getYearlyTrend(),
        getGenderDistribution(selectedYear),
      ]);

      setFakultasData(fakultas || []);
      setDepartemenData(departemen || []);
      setTahunData(tahun || []);
      setGenderData(gender || []);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const fetchPendaftarData = async () => {
    try {
      const searchFilters = {
        year: selectedYear,
        ...filters,
      };
      const data = await getApplicationsList(searchFilters);

      const transformedData = data.map((item, index) => ({
        key: item.id || index,
        id: item.id,
        nama: item.nama,
        nim: item.nim,
        fakultas: item.fakultas,
        departemen: item.departemen,
        gender: item.gender,
        status: item.status,
        beasiswa: item.beasiswa,
        tanggalDaftar: item.tanggalDaftar,
      }));

      setPendaftarData(transformedData);
      setFilteredPendaftar(transformedData);
    } catch (error) {
      console.error("Error fetching pendaftar data:", error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const options = await getFilterOptions();
      const fakultasOptions = [
        "Semua",
        ...options.faculties.map((f) => f.name),
      ];
      const departemenOptions = [
        "Semua",
        ...options.departments.map((d) => d.name),
      ];
      const genderOptions = ["Semua", ...options.genders];

      setFilterOptions({
        faculties: fakultasOptions,
        departments: departemenOptions,
        genders: genderOptions,
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    message.info(`Menampilkan data tahun ${year}`);
  };

  const handleExportReport = () => {
    message.success(`Mengunduh laporan tahun ${selectedYear}...`);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    const searchFilters = {
      year: selectedYear,
      ...newFilters,
    };

    getApplicationsList(searchFilters)
      .then((data) => {
        const transformedData = data.map((item, index) => ({
          key: item.id || index,
          id: item.id,
          nama: item.nama,
          nim: item.nim,
          fakultas: item.fakultas,
          departemen: item.departemen,
          gender: item.gender,
          status: item.status,
          beasiswa: item.beasiswa,
          tanggalDaftar: item.tanggalDaftar,
        }));

        setFilteredPendaftar(transformedData);
      })
      .catch((error) => {
        console.error("Error applying filters:", error);
        message.error("Gagal menerapkan filter");
      });
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
      sorter: (a, b) => a.nim.localeCompare(b.nim),
    },
    {
      title: "Fakultas",
      dataIndex: "fakultas",
      key: "fakultas",
      sorter: (a, b) => a.fakultas.localeCompare(b.fakultas),
    },
    {
      title: "Departemen",
      dataIndex: "departemen",
      key: "departemen",
      sorter: (a, b) => a.departemen.localeCompare(b.departemen),
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
    ]),
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartsLoading ? (
          <>
            <Card
              title="Pendaftar Berdasarkan Fakultas"
              description={`Distribusi pendaftar beasiswa per fakultas tahun ${selectedYear}`}
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
            <Card
              title="Pendaftar Berdasarkan Departemen"
              description={`Distribusi pendaftar beasiswa per departemen tahun ${selectedYear}`}
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
          </>
        ) : (
          <>
            <HorizontalBarChart
              data={fakultasData}
              title="Pendaftar Berdasarkan Fakultas"
              description={`Distribusi pendaftar beasiswa per fakultas tahun ${selectedYear}`}
            />
            <HorizontalBarChart
              data={departemenData}
              title="Pendaftar Berdasarkan Departemen"
              description={`Distribusi pendaftar beasiswa per departemen tahun ${selectedYear}`}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartsLoading ? (
          <>
            <Card
              title="Pendaftar Tahun ke Tahun"
              description="Perbandingan pendaftar beasiswa dari tahun ke tahun"
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
            <Card
              title="Pendaftar Berdasarkan Gender"
              description="Distribusi pendaftar beasiswa berdasarkan gender"
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
          </>
        ) : (
          <>
            <LineChart
              data={tahunData}
              title="Pendaftar Tahun ke Tahun"
              description="Perbandingan pendaftar beasiswa dari tahun ke tahun"
            />
            <PieChart
              data={genderData}
              title="Pendaftar Berdasarkan Gender"
              description="Distribusi pendaftar beasiswa berdasarkan gender"
            />
          </>
        )}
      </div>

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
                {filterOptions.faculties.map((option) => (
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
                {filterOptions.departments.map((option) => (
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
                {filterOptions.genders.map((option) => (
                  <Option key={option} value={option}>
                    {option === "Semua" ? "Semua Gender" : option}
                  </Option>
                ))}
              </Select>
            </>
          }
          onSearch={(value) => {
            const searchFilters = {
              year: selectedYear,
              search: value,
              ...filters,
            };

            getApplicationsList(searchFilters)
              .then((data) => {
                const transformedData = data.map((item, index) => ({
                  key: item.id || index,
                  id: item.id,
                  nama: item.nama,
                  nim: item.nim,
                  fakultas: item.fakultas,
                  departemen: item.departemen,
                  gender: item.gender,
                  status: item.status,
                  beasiswa: item.beasiswa,
                  tanggalDaftar: item.tanggalDaftar,
                }));

                setFilteredPendaftar(transformedData);
              })
              .catch((error) => {
                console.error("Error searching:", error);
                message.error("Gagal mencari data");
              });
          }}
        />
      </div>
    </div>
  );
};

export default ReportsAdmin;
