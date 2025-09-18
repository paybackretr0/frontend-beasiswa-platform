import { useEffect } from "react";
import Card from "../../components/Card";
import {
  LineChart,
  HorizontalBarChart,
  PieChart,
  summaryData,
  fakultasData,
  departemenData,
  tahunData,
  genderData,
  ActivityCard,
  StatusSummary,
} from "../../components/Chart";

const AdminDashboard = () => {
  useEffect(() => {
    document.title = "Dashboard - Admin";
  }, []);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
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

      {/* Chart Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      {/* Aktivitas & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityCard />
        <StatusSummary />
      </div>
    </div>
  );
};

export default AdminDashboard;
