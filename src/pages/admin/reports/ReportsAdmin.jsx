import { useEffect, useState } from "react";
import { Select, Spin, Tag } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import UniversalTable, {
  createNumberColumn,
  createActionColumn,
} from "../../../components/Table";
import {
  HorizontalBarChart,
  LineChart,
  PieChart,
  PerformanceBarChart,
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
  getMonthlyTrend,
  getScholarshipPerformance,
  getTopPerformingFaculties,
  exportLaporanBeasiswa,
} from "../../../services/analyticsService";
import { getApplicationDetail } from "../../../services/applicationService";
import ApplicationDetailModal from "../../../components/ApplicationDetailModal";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonTable,
} from "../../../components/common/skeleton";
import ExportLoadingModal from "../../../components/ExportLoadingModal";

const { Option } = Select;

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 2025 + 1 },
  (_, i) => 2025 + i,
);

const ReportsAdmin = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  const [exportLoading, setExportLoading] = useState(false);

  const [mainSummaryData, setMainSummaryData] = useState([]);
  const [selectionSummaryData, setSelectionSummaryData] = useState([]);

  const [fakultasData, setFakultasData] = useState([]);
  const [departemenData, setDepartemenData] = useState([]);
  const [tahunData, setTahunData] = useState([]);
  const [genderData, setGenderData] = useState([]);

  const [pendaftarData, setPendaftarData] = useState([]);
  const [filteredPendaftar, setFilteredPendaftar] = useState([]);

  const [monthlyData, setMonthlyData] = useState([]);
  const [scholarshipPerformance, setScholarshipPerformance] = useState([]);
  const [topFaculties, setTopFaculties] = useState([]);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const { alerts, success, error, removeAlert, info, clearAlerts } = useAlert();

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

  let user = null;
  let facultyName = "";

  try {
    user = JSON.parse(localStorage.getItem("user"));
    if (user?.faculty) {
      facultyName = user.faculty.name;
    }
  } catch (e) {
    console.error("Error parsing user:", e);
  }

  const role = user?.role?.toUpperCase() || null;

  const isFacultyRole = ["VERIFIKATOR_FAKULTAS", "PIMPINAN_FAKULTAS"].includes(
    role,
  );

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
    setMonthlyData([]);
    setScholarshipPerformance([]);
    setTopFaculties([]);
    setPendaftarData([]);
    setFilteredPendaftar([]);

    setLoading(true);
    setChartsLoading(true);

    try {
      await Promise.all([fetchMainSummary(), fetchSelectionSummary()]);

      setLoading(false);

      await Promise.all([
        fetchChartData(),
        fetchPerformanceData(),
        fetchPendaftarData(),
      ]);
    } catch (err) {
      console.error("Error fetching all data:", err);
      error("Gagal", err.message || "Gagal memuat data laporan");
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
    } catch (err) {
      console.error("Error fetching main summary:", err);
      error("Gagal", err.message || "Gagal memuat ringkasan utama");
    }
  };

  const fetchSelectionSummary = async () => {
    try {
      const yearParam = selectedYear === "all" ? null : selectedYear;
      const data = await getSelectionSummary(yearParam);

      const summary = [
        {
          title: "Divalidasi (Lolos)",
          value: data.validated || 0,
          color: "text-green-600",
        },
        {
          title: "Menunggu Verifikasi",
          value: data.menungguVerifikasi || 0,
          color: "text-orange-600",
        },
        {
          title: "Menunggu Validasi",
          value: data.verified || 0,
          color: "text-blue-600",
        },
        {
          title: "Perlu Revisi",
          value: data.revisionNeeded || 0,
          color: "text-yellow-600",
        },
        {
          title: "Ditolak",
          value: data.rejected || 0,
          color: "text-red-600",
        },
      ];
      setSelectionSummaryData(summary);
    } catch (err) {
      console.error("Error fetching selection summary:", err);
      error("Gagal", err.message || "Gagal memuat ringkasan seleksi");
    }
  };

  const fetchChartData = async () => {
    try {
      const chartPromises = isFacultyRole
        ? [
            Promise.resolve([]),
            getDepartmentDistribution(selectedYear),
            getYearlyTrend(),
            getGenderDistribution(selectedYear),
            getMonthlyTrend(selectedYear),
          ]
        : [
            getFacultyDistribution(selectedYear),
            getDepartmentDistribution(selectedYear),
            getYearlyTrend(),
            getGenderDistribution(selectedYear),
            getMonthlyTrend(selectedYear),
          ];

      const [fakultas, departemen, tahun, gender, monthly] =
        await Promise.all(chartPromises);

      setFakultasData(fakultas || []);
      setDepartemenData(departemen || []);
      setTahunData(tahun || []);
      setGenderData(gender || []);
      setMonthlyData(monthly || []);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      error("Gagal", err.message || "Gagal memuat data grafik");
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const [scholarshipData, facultyData] = await Promise.all([
        getScholarshipPerformance(selectedYear),
        getTopPerformingFaculties(selectedYear),
      ]);
      setScholarshipPerformance(scholarshipData || []);
      setTopFaculties(facultyData || []);
    } catch (err) {
      console.error("Error fetching performance data:", err);
      error("Gagal", err.message || "Gagal memuat data performa");
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
        status: getStatusLabel(item.status),
        rawStatus: item.status,
        beasiswa: item.beasiswa,
        tanggalDaftar: item.tanggalDaftar,
      }));

      setPendaftarData(transformedData);
      setFilteredPendaftar(transformedData);
    } catch (err) {
      console.error("Error fetching pendaftar data:", err);
      error("Gagal", err.message || "Gagal memuat data pendaftar");
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
    } catch (err) {
      console.error("Error fetching filter options:", err);
      error("Gagal", err.message || "Gagal memuat opsi filter");
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    info("Memuat data untuk tahun " + year);
  };

  const handleExportReport = async () => {
    try {
      setExportLoading(true);

      await exportLaporanBeasiswa(selectedYear);

      setTimeout(() => {
        setExportLoading(false);
        success("Berhasil!", "Laporan berhasil diexport!");
      }, 1200);
    } catch (err) {
      setExportLoading(false);
      error("Gagal", err.message || "Gagal mengekspor laporan");
    }
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
          status: getStatusLabel(item.status),
          rawStatus: item.status,
          beasiswa: item.beasiswa,
          tanggalDaftar: item.tanggalDaftar,
        }));

        setFilteredPendaftar(transformedData);
      })
      .catch((err) => {
        console.error("Error applying filters:", err);
        error("Gagal", err.message || "Gagal menerapkan filter");
      });
  };

  const handleDetail = async (record) => {
    try {
      setDetailLoading(true);
      setDetailModalVisible(true);

      const detail = await getApplicationDetail(record.id);
      setSelectedApplication(detail);
    } catch (err) {
      console.error("Error fetching application detail:", err);
      error("Gagal!", err.message || "Gagal memuat detail pendaftaran");
      setDetailModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedApplication(null);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      DRAFT: "Draft",
      MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
      VERIFIED: "Terverifikasi",
      VALIDATED: "Divalidasi",
      REJECTED: "Ditolak",
      REVISION_NEEDED: "Perlu Revisi",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      Draft: "default",
      "Menunggu Verifikasi": "orange",
      "Menunggu Validasi": "blue",
      Divalidasi: "green",
      Ditolak: "red",
      "Perlu Revisi": "gold",
    };
    return colorMap[status] || "default";
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = getStatusColor(status);
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: "Menunggu Verifikasi", value: "Menunggu Verifikasi" },
        {
          text: "Menunggu Validasi",
          value: "Menunggu Validasi",
        },
        { text: "Divalidasi", value: "Divalidasi" },
        { text: "Ditolak", value: "Ditolak" },
        { text: "Perlu Revisi", value: "Perlu Revisi" },
      ],
      onFilter: (value, record) => record.status === value,
    },
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
      <div className="space-y-6">
        <AlertContainer
          alerts={alerts}
          onRemove={removeAlert}
          position="top-right"
        />

        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-56 animate-pulse mb-2"></div>
            {isFacultyRole && (
              <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonChart
            type="line"
            title="Tren Bulanan"
            description="Memuat data..."
          />
          <SkeletonChart
            type="line"
            title="Pendaftar Tahun ke Tahun"
            description="Memuat data..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonChart
            type="horizontal-bar"
            title="Performa Beasiswa"
            description="Memuat data..."
          />
          <SkeletonChart
            type="horizontal-bar"
            title="Fakultas/Departemen Terbaik"
            description="Memuat data..."
          />
        </div>

        {!isFacultyRole && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonChart
              type="horizontal-bar"
              title="Pendaftar Berdasarkan Fakultas"
              description="Memuat data..."
            />
            <SkeletonChart
              type="horizontal-bar"
              title="Pendaftar Berdasarkan Departemen"
              description="Memuat data..."
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <SkeletonChart
            type="pie"
            title="Pendaftar Berdasarkan Gender"
            description="Memuat data..."
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
          <SkeletonTable rows={8} columns={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />

      <ExportLoadingModal visible={exportLoading} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Beasiswa</h1>
          {isFacultyRole && facultyName && (
            <p className="text-sm text-gray-600 mt-1">
              Data untuk {facultyName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 150 }}
            size="large"
          >
            <Option value="all">Semua Tahun</Option>
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          <Button
            onClick={handleExportReport}
            className="flex items-center gap-2"
          >
            <DownloadOutlined />
            Export Laporan
          </Button>
        </div>
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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {selectionSummaryData.map((item, idx) => (
          <Card key={idx}>
            <div className="flex flex-col items-center py-4">
              <span className="text-3xl mb-2">{item.icon}</span>
              <span className="text-sm text-gray-600 mb-2 text-center">
                {item.title}
              </span>
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
            <SkeletonChart
              type="line"
              title="Tren Bulanan"
              description="Pendaftar per bulan tahun ini"
            />
            <SkeletonChart
              type="line"
              title="Pendaftar Tahun ke Tahun"
              description="Perbandingan pendaftar beasiswa dari tahun ke tahun"
            />
          </>
        ) : (
          <>
            <LineChart
              data={monthlyData}
              title="Tren Pendaftaran Bulanan"
              description={`Jumlah pendaftar per bulan tahun ${selectedYear}`}
            />
            <LineChart
              data={tahunData}
              title="Pendaftar Tahun ke Tahun"
              description="Perbandingan pendaftar beasiswa dari tahun ke tahun"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartsLoading ? (
          <>
            <SkeletonChart
              type="horizontal-bar"
              title="Performa Beasiswa"
              description="Tingkat penerimaan per beasiswa"
            />
            <SkeletonChart
              type="horizontal-bar"
              title={
                isFacultyRole ? "Performa per Departemen" : "Fakultas Terbaik"
              }
              description={
                isFacultyRole
                  ? "Tingkat keberhasilan per departemen"
                  : "Fakultas dengan tingkat keberhasilan tertinggi"
              }
            />
          </>
        ) : (
          <>
            <div className="flex flex-col h-full">
              <PerformanceBarChart
                data={scholarshipPerformance}
                title="Performa Beasiswa"
                description={`Top 10 beasiswa dengan peminat terbanyak tahun ${selectedYear}`}
              />
            </div>
            <div className="flex flex-col h-full">
              {isFacultyRole ? (
                <HorizontalBarChart
                  data={departemenData}
                  title="Performa per Departemen"
                  description={`Distribusi pendaftar per departemen di ${facultyName}`}
                />
              ) : (
                <PerformanceBarChart
                  data={topFaculties}
                  title="Fakultas Terbaik"
                  description="5 fakultas dengan tingkat keberhasilan tertinggi"
                />
              )}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartsLoading ? (
          <>
            {!isFacultyRole && (
              <>
                <SkeletonChart
                  type="horizontal-bar"
                  title="Pendaftar Berdasarkan Fakultas"
                  description={`Distribusi pendaftar beasiswa per fakultas tahun ${selectedYear}`}
                />
                <SkeletonChart
                  type="horizontal-bar"
                  title="Pendaftar Berdasarkan Departemen"
                  description={`Distribusi pendaftar beasiswa per departemen tahun ${selectedYear}`}
                />
              </>
            )}
          </>
        ) : (
          <>
            {!isFacultyRole && (
              <>
                <div className="flex flex-col h-full">
                  <HorizontalBarChart
                    data={fakultasData}
                    title="Pendaftar Berdasarkan Fakultas"
                    description={`Distribusi pendaftar beasiswa per fakultas tahun ${selectedYear}`}
                  />
                </div>
                <div className="flex flex-col h-full">
                  <HorizontalBarChart
                    data={departemenData}
                    title="Pendaftar Berdasarkan Departemen"
                    description={`Distribusi pendaftar beasiswa per departemen tahun ${selectedYear}`}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {chartsLoading ? (
          <SkeletonChart
            type="pie"
            title="Pendaftar Berdasarkan Gender"
            description="Distribusi pendaftar beasiswa berdasarkan gender"
          />
        ) : (
          <div className="flex flex-col h-full">
            <PieChart
              data={genderData}
              title="Pendaftar Berdasarkan Gender"
              description="Distribusi pendaftar beasiswa berdasarkan gender"
            />
          </div>
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
              {!isFacultyRole && (
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
              )}

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
              .catch((err) => {
                console.error("Error searching:", err);
                error("Gagal", err.message || "Gagal melakukan pencarian");
              });
          }}
        />
      </div>
      <ApplicationDetailModal
        visible={detailModalVisible}
        onClose={handleCloseDetailModal}
        applicationDetail={selectedApplication}
        loading={detailLoading}
        onVerify={null}
        onValidate={null}
        onReject={null}
        role={null}
      />
    </div>
  );
};

export default ReportsAdmin;
