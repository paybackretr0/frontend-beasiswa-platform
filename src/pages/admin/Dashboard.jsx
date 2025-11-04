import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import Card from "../../components/Card";
import {
  LineChart,
  HorizontalBarChart,
  PieChart,
  ChartEmptyState,
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
} from "../../services/analyticsService";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  const [summaryData, setSummaryData] = useState([]);
  const [fakultasData, setFakultasData] = useState([]);
  const [departemenData, setDepartemenData] = useState([]);
  const [tahunData, setTahunData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [activities, setActivities] = useState([]);

  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    document.title = "Dashboard - Admin";
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setChartsLoading(true);

    try {
      await fetchSummaryData();
      setLoading(false);

      await Promise.all([fetchChartData(), fetchStatusAndActivities()]);
    } catch (error) {
      message.error("Gagal memuat data dashboard");
    } finally {
      setChartsLoading(false);
    }
  };

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {}
  const role = user?.role?.toUpperCase() || null;

  const fetchRecentApplications = async () => {
    try {
      const data = await getApplicationsList({ limit: 5 }); // Ambil 5 terakhir
      setRecentApplications(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching recent applications:", error);
    }
  };

  const fetchSummaryData = async () => {
    try {
      const data = await getSummary();
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
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  const fetchChartData = async () => {
    try {
      const [fakultas, departemen, tahun, gender] = await Promise.all([
        getFacultyDistribution(),
        getDepartmentDistribution(),
        getYearlyTrend(),
        getGenderDistribution(),
      ]);

      const defaultGenderData = [
        { label: "Laki-laki", value: 0, color: "#2D60FF" },
        { label: "Perempuan", value: 0, color: "#FF6384" },
      ];

      const mergedGenderData = defaultGenderData.map((defaultItem) => {
        const existingItem = gender.find(
          (item) => item.label === defaultItem.label
        );
        return existingItem || defaultItem;
      });

      setFakultasData(fakultas || []);
      setDepartemenData(departemen || []);
      setTahunData(tahun || []);
      setGenderData(mergedGenderData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const fetchStatusAndActivities = async () => {
    try {
      const promises = [getStatusSummary()];

      if (role === "SUPERADMIN") {
        promises.push(getActivities());
      } else {
        // Panggil fetchRecentApplications untuk role selain SUPERADMIN
        await fetchRecentApplications();
      }

      const results = await Promise.all(promises);

      setStatusCounts(results[0] || []);

      if (role === "SUPERADMIN") {
        setActivities(results[1] || []);
      }
    } catch (error) {
      console.error("Error fetching status and activities:", error);
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {summaryData.map((item, idx) => (
          <Card key={idx}>
            <div className="flex flex-col items-left py-6">
              <span className="text-sm text-gray-700">{item.title}</span>
              <span className="text-2xl font-bold text-gray-800 mt-2">
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
              description="Distribusi pendaftar beasiswa per fakultas"
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
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
              <HorizontalBarChart
                data={fakultasData}
                title="Pendaftar Berdasarkan Fakultas"
                description="Distribusi pendaftar beasiswa per fakultas"
              />
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
              title="Penerima Tahun ke Tahun"
              description="Perbandingan penerima beasiswa dari tahun ke tahun"
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
