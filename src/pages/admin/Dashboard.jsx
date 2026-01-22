import { useEffect, useState } from "react";
import { Spin, Select } from "antd";
import Card from "../../components/Card";
import {
  LineChart,
  HorizontalBarChart,
  PieChart,
  ChartEmptyState,
  PerformanceBarChart,
} from "../../components/Chart";
import {
  getSummary,
  getFacultyDistribution,
  getDepartmentDistribution,
  getYearlyTrend,
  getGenderDistribution,
  getStatusSummary,
  getActivities,
  getApplicationsList,
  getScholarshipPerformance,
} from "../../services/analyticsService";
import {
  getGovernmentScholarshipSummary,
  getGovernmentScholarshipDistribution,
  getGovernmentScholarshipCategories,
  getGovernmentScholarshipYearlyTrend,
} from "../../services/governmentService";
import AlertContainer from "../../components/AlertContainer";
import useAlert from "../../hooks/useAlert";

const { Option } = Select;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState("all");
  const [scholarshipType, setScholarshipType] = useState("NON-APBN");

  const [summaryData, setSummaryData] = useState([]);
  const [fakultasData, setFakultasData] = useState([]);
  const [departemenData, setDepartemenData] = useState([]);
  const [tahunData, setTahunData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [scholarshipPerformance, setScholarshipPerformance] = useState([]);

  const [govSummaryData, setGovSummaryData] = useState([]);
  const [govDistributionData, setGovDistributionData] = useState([]);
  const [govCategoriesData, setGovCategoriesData] = useState([]);
  const [govYearlyData, setGovYearlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  const { alerts, error, removeAlert } = useAlert();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {}
  const role = user?.role?.toUpperCase() || null;

  const isFacultyRole = ["VERIFIKATOR_FAKULTAS", "PIMPINAN_FAKULTAS"].includes(
    role,
  );

  const canSeeAPBN = [
    "SUPERADMIN",
    "PIMPINAN_DITMAWA",
    "PIMPINAN_FAKULTAS",
  ].includes(role);

  useEffect(() => {
    if (!canSeeAPBN) {
      setScholarshipType("NON-APBN");
    }
  }, [canSeeAPBN]);

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: "all", label: "Semua Tahun" },
    ...Array.from({ length: currentYear - 2023 }, (_, i) => ({
      value: 2024 + i,
      label: (2024 + i).toString(),
    })),
  ];

  useEffect(() => {
    document.title = "Dashboard - Admin";
    fetchAllData();
  }, [selectedYear, scholarshipType]);

  const fetchAllData = async () => {
    setLoading(true);
    setChartsLoading(true);

    try {
      if (scholarshipType === "NON-APBN") {
        await fetchNonAPBNData();
      } else {
        await fetchAPBNData();
      }
    } catch (err) {
      error("Gagal!", "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
      setChartsLoading(false);
    }
  };

  const fetchNonAPBNData = async () => {
    try {
      await fetchSummaryData();
      await Promise.all([fetchChartData(), fetchStatusAndActivities()]);
    } catch (err) {
      throw err;
    }
  };

  const fetchAPBNData = async () => {
    try {
      const yearParam = selectedYear === "all" ? null : selectedYear;

      const [summary, distribution, categories, yearly] = await Promise.all([
        getGovernmentScholarshipSummary(yearParam),
        getGovernmentScholarshipDistribution(yearParam),
        getGovernmentScholarshipCategories(yearParam),
        getGovernmentScholarshipYearlyTrend(),
      ]);

      const govSummary = [
        {
          title: "Total Penerima",
          value: summary.totalPenerima || 0,
        },
        {
          title: "Total Mahasiswa Unik",
          value: summary.totalMahasiswaUnik || 0,
        },
        {
          title: "Total Program",
          value: summary.totalProgram || 0,
        },
      ];

      setGovSummaryData(govSummary);
      setGovDistributionData(distribution || []);
      setGovCategoriesData(categories || []);
      setGovYearlyData(yearly || []);

      if (summary.statusBreakdown) {
        const statusDistribution = [
          {
            label: "Normal",
            value: summary.statusBreakdown.normal || 0,
            color: "#22c55e",
          },
          {
            label: "Warning",
            value: summary.statusBreakdown.warning || 0,
            color: "#f59e0b",
          },
          {
            label: "Revoked",
            value: summary.statusBreakdown.revoked || 0,
            color: "#ef4444",
          },
        ];
        setStatusData(statusDistribution);
      }
    } catch (err) {
      throw err;
    }
  };

  const fetchSummaryData = async () => {
    try {
      const yearParam = selectedYear === "all" ? null : selectedYear;
      const data = await getSummary(yearParam);
      const summary = [
        {
          title: "Jumlah Pendaftar",
          value: data.totalPendaftar || 0,
        },
        {
          title: "Jumlah Beasiswa",
          value: data.totalBeasiswa || 0,
        },
        {
          title: "Beasiswa Masih Buka",
          value: data.beasiswaMasihBuka || 0,
        },
        {
          title: "Total Mahasiswa",
          value: data.totalMahasiswa || 0,
        },
      ];
      setSummaryData(summary);
    } catch (err) {
      error("Gagal!", "Gagal memuat data ringkasan");
    }
  };

  const fetchChartData = async () => {
    try {
      const yearParam = selectedYear === "all" ? null : selectedYear;

      const chartPromises = isFacultyRole
        ? [
            Promise.resolve([]),
            getDepartmentDistribution(yearParam),
            getYearlyTrend(),
            getGenderDistribution(yearParam),
            getScholarshipPerformance(yearParam),
          ]
        : [
            getFacultyDistribution(yearParam),
            getDepartmentDistribution(yearParam),
            getYearlyTrend(),
            getGenderDistribution(yearParam),
            Promise.resolve([]),
          ];

      const [fakultas, departemen, tahun, gender, scholarship] =
        await Promise.all(chartPromises);

      const defaultGenderData = [
        { label: "Laki-laki", value: 0, color: "#2D60FF" },
        { label: "Perempuan", value: 0, color: "#FF69B4" },
      ];

      const mergedGenderData = defaultGenderData.map((defaultItem) => {
        const existingItem = gender.find(
          (item) => item.label === defaultItem.label,
        );
        return existingItem || defaultItem;
      });

      setFakultasData(fakultas || []);
      setDepartemenData(departemen || []);
      setTahunData(tahun || []);
      setGenderData(mergedGenderData);
      setScholarshipPerformance(scholarship || []);
    } catch (err) {
      error("Gagal!", "Gagal memuat data grafik");
    }
  };

  const fetchStatusAndActivities = async () => {
    try {
      const yearParam = selectedYear === "all" ? null : selectedYear;

      const [statusData, secondaryData] = await Promise.all([
        getStatusSummary(yearParam),
        role === "SUPERADMIN"
          ? getActivities()
          : getApplicationsList({
              limit: 5,
              year: yearParam || new Date().getFullYear(),
            }),
      ]);

      setStatusCounts(statusData || []);

      if (role === "SUPERADMIN") {
        setActivities(secondaryData || []);
      } else {
        setRecentApplications(secondaryData?.slice(0, 5) || []);
      }
    } catch (err) {
      error("Gagal!", "Gagal memuat data status dan aktivitas");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AlertContainer
        alerts={alerts}
        removeAlert={removeAlert}
        position="top-right"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {canSeeAPBN && (
            <div className="flex gap-2">
              <button
                onClick={() => setScholarshipType("NON-APBN")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  scholarshipType === "NON-APBN"
                    ? "bg-[#2D60FF] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Non-APBN
              </button>
              <button
                onClick={() => setScholarshipType("APBN")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  scholarshipType === "APBN"
                    ? "bg-[#2D60FF] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                APBN
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Tahun:</label>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              style={{ width: 150 }}
              className="rounded-lg"
            >
              {yearOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
          <span className="text-sm text-blue-700 font-medium">
            {!canSeeAPBN
              ? `Beasiswa Non-APBN ${
                  isFacultyRole ? `(Fakultas ${user?.faculty?.name || ""})` : ""
                }`
              : scholarshipType === "NON-APBN"
                ? `Beasiswa Non-APBN ${
                    isFacultyRole
                      ? `(Fakultas ${user?.faculty?.name || ""})`
                      : ""
                  }`
                : "Beasiswa Pemerintah (APBN)"}
            {" • "}
            {selectedYear === "all" ? "Semua Tahun" : `Tahun ${selectedYear}`}
          </span>
        </div>
      </div>

      <div
        className={`grid ${scholarshipType === "NON-APBN" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"} gap-6`}
      >
        {(scholarshipType === "NON-APBN" ? summaryData : govSummaryData).map(
          (item, idx) => (
            <Card key={idx}>
              <div className="flex flex-col items-left py-6">
                <span className="text-sm text-gray-700">{item.title}</span>
                <span className="text-2xl font-bold text-gray-800 mt-2">
                  {item.value}
                </span>
              </div>
            </Card>
          ),
        )}
      </div>

      {scholarshipType === "NON-APBN" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartsLoading ? (
              <>
                {isFacultyRole ? (
                  <Card
                    title="Performa Beasiswa"
                    description="Tingkat keberhasilan per beasiswa di fakultas Anda"
                  >
                    <div className="flex justify-center items-center py-12">
                      <Spin size="large" />
                    </div>
                  </Card>
                ) : (
                  <Card
                    title="Pendaftar Berdasarkan Fakultas"
                    description="Distribusi pendaftar beasiswa per fakultas"
                  >
                    <div className="flex justify-center items-center py-12">
                      <Spin size="large" />
                    </div>
                  </Card>
                )}
                <Card
                  title="Pendaftar Berdasarkan Departemen"
                  description="Distribusi pendaftar beasiswa per departemen"
                >
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                </Card>
              </>
            ) : (
              <>
                <div className="flex flex-col h-full">
                  {isFacultyRole ? (
                    <PerformanceBarChart
                      data={scholarshipPerformance}
                      title="Performa Beasiswa"
                      description="Tingkat keberhasilan per beasiswa di fakultas Anda"
                    />
                  ) : (
                    <HorizontalBarChart
                      data={fakultasData}
                      title="Pendaftar Berdasarkan Fakultas"
                      description="Distribusi pendaftar beasiswa per fakultas"
                    />
                  )}
                </div>
                <div className="flex flex-col h-full">
                  <HorizontalBarChart
                    data={departemenData}
                    title="Pendaftar Berdasarkan Departemen"
                    description="Distribusi pendaftar beasiswa per departemen"
                  />
                </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartsLoading ? (
              <>
                {role === "SUPERADMIN" ? (
                  <Card
                    title="Aktivitas Terbaru"
                    description="Aktivitas sistem dalam 24 jam terakhir"
                  >
                    <div className="flex justify-center items-center py-12">
                      <Spin size="large" />
                    </div>
                  </Card>
                ) : (
                  <Card
                    title="Pendaftaran Terbaru"
                    description="5 pendaftaran beasiswa terbaru"
                  >
                    <div className="flex justify-center items-center py-12">
                      <Spin size="large" />
                    </div>
                  </Card>
                )}
                <Card
                  title="Status Pendaftaran"
                  description="Ringkasan status pendaftaran beasiswa"
                >
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                </Card>
              </>
            ) : (
              <>
                <div className="flex flex-col h-full">
                  {role === "SUPERADMIN" ? (
                    <ActivityCard activities={activities} />
                  ) : (
                    <RecentApplicationsCard applications={recentApplications} />
                  )}
                </div>
                <div className="flex flex-col h-full">
                  <StatusSummary statusCounts={statusCounts} />
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartsLoading ? (
              <>
                <Card
                  title="Distribusi Berdasarkan Program Studi"
                  description="Distribusi penerima beasiswa APBN per program studi"
                >
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                </Card>
                <Card
                  title="Kategori Beasiswa"
                  description="Distribusi berdasarkan kategori beasiswa"
                >
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                </Card>
              </>
            ) : (
              <>
                <div className="flex flex-col h-full">
                  <HorizontalBarChart
                    data={govDistributionData}
                    title="Distribusi Berdasarkan Program Studi"
                    description="Distribusi penerima beasiswa APBN per program studi"
                  />
                </div>
                <div className="flex flex-col h-full">
                  <PieChart
                    data={govCategoriesData}
                    title="Kategori Beasiswa"
                    description="Distribusi berdasarkan kategori beasiswa"
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chartsLoading ? (
              <>
                <Card
                  title="Tren Penerima Tahun ke Tahun"
                  description="Perbandingan penerima beasiswa APBN dari tahun ke tahun"
                >
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                </Card>
                <Card
                  title="Status Akademik"
                  description="Distribusi status akademik penerima"
                >
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                </Card>
              </>
            ) : (
              <>
                <div className="flex flex-col h-full">
                  <LineChart
                    data={govYearlyData}
                    title="Tren Penerima Tahun ke Tahun"
                    description="Perbandingan penerima beasiswa APBN dari tahun ke tahun"
                  />
                </div>

                <div className="flex flex-col h-full">
                  <PieChart
                    data={statusData}
                    title="Status Akademik Penerima"
                    description="Distribusi berdasarkan status akademik mahasiswa"
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const RecentApplicationsCard = ({ applications }) => (
  <Card
    title="Pendaftaran Terbaru"
    description="5 pendaftaran beasiswa terbaru"
  >
    {applications.length === 0 ? (
      <ChartEmptyState message="Belum ada pendaftaran terbaru" />
    ) : (
      <ul className="mt-2 space-y-3">
        {applications.map((app, idx) => (
          <li
            key={idx}
            className="flex items-center gap-2 bg-[#D9D9D9] rounded-lg px-4 py-2"
          >
            <span className="text-xs text-[#2D60FF] font-semibold min-w-[80px]">
              {app.status}
            </span>
            <span className="text-sm text-gray-700 flex-1">{app.nama}</span>
            <span className="text-xs text-gray-500">{app.fakultas}</span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const ActivityCard = ({ activities }) => (
  <Card
    title="Aktivitas Terbaru"
    description="Aktivitas sistem dalam 24 jam terakhir"
  >
    {activities.length === 0 ? (
      <ChartEmptyState message="Belum ada aktivitas terbaru" />
    ) : (
      <ul className="mt-2 space-y-3">
        {activities.map((act, idx) => (
          <li
            key={idx}
            className="flex items-center gap-2 bg-[#D9D9D9] rounded-lg px-4 py-2"
          >
            <span className="text-xs text-[#2D60FF] font-semibold min-w-[110px]">
              {act.type}
            </span>
            <span className="text-sm text-gray-700 flex-1">{act.desc}</span>
            <span className="text-xs text-gray-500">{act.time}</span>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const StatusSummary = ({ statusCounts }) => (
  <Card
    title="Status Pendaftaran"
    description="Ringkasan status pendaftaran beasiswa"
  >
    {statusCounts.length === 0 ? (
      <ChartEmptyState message="Belum ada data status pendaftaran" />
    ) : (
      <div className="space-y-3 mt-2">
        {statusCounts.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-[#D9D9D9] rounded-lg px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-sm text-gray-700">{s.label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default AdminDashboard;
