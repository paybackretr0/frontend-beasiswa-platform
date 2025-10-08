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
      console.error("Error fetching dashboard data:", error);
      message.error("Gagal memuat data dashboard");
    } finally {
      setChartsLoading(false);
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

      setFakultasData(fakultas || []);
      setDepartemenData(departemen || []);
      setTahunData(tahun || []);
      setGenderData(gender || []);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const fetchStatusAndActivities = async () => {
    try {
      const [statusData, activitiesData] = await Promise.all([
        getStatusSummary(),
        getActivities(),
      ]);

      setStatusCounts(statusData || []);
      setActivities(activitiesData || []);
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
              title="Penerima Berdasarkan Fakultas"
              description="Distribusi penerima beasiswa per fakultas"
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
            <Card
              title="Penerima Berdasarkan Departemen"
              description="Distribusi penerima beasiswa per departemen"
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
              title="Penerima Berdasarkan Fakultas"
              description="Distribusi penerima beasiswa per fakultas"
            />
            <HorizontalBarChart
              data={departemenData}
              title="Penerima Berdasarkan Departemen"
              description="Distribusi penerima beasiswa per departemen"
            />
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
              title="Penerima Berdasarkan Gender"
              description="Distribusi penerima beasiswa berdasarkan gender"
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
              title="Penerima Tahun ke Tahun"
              description="Perbandingan penerima beasiswa dari tahun ke tahun"
            />
            <PieChart
              data={genderData}
              title="Penerima Berdasarkan Gender"
              description="Distribusi penerima beasiswa berdasarkan gender"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartsLoading ? (
          <>
            <Card
              title="Aktivitas Terbaru"
              description="Aktivitas sistem dalam 24 jam terakhir"
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
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
            <ActivityCard activities={activities} />
            <StatusSummary statusCounts={statusCounts} />
          </>
        )}
      </div>
    </div>
  );
};

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
