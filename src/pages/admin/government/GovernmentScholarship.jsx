import { useEffect, useState } from "react";
import { Select, Spin, Tag, Modal, Upload, message } from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  UserOutlined,
  TrophyOutlined,
  BookOutlined,
  WarningOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
} from "../../../components/Chart";
import {
  getGovernmentScholarshipSummary,
  getGovernmentScholarshipDistribution,
  getGovernmentScholarshipCategories,
  getGovernmentScholarshipYearlyTrend,
  getGovernmentScholarshipList,
  exportGovernmentScholarships,
  importGovernmentScholarships,
} from "../../../services/governmentService";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";

const { Option } = Select;

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 2020 + 1 },
  (_, i) => 2020 + i,
);

const GovernmentScholarship = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [summaryData, setSummaryData] = useState([]);

  const [distributionData, setDistributionData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  const [syncingIPK, setSyncingIPK] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    status: "Semua",
    program: "Semua",
  });
  const [filterOptions, setFilterOptions] = useState({
    statuses: ["Semua", "NORMAL", "WARNING", "REVOKED"],
    programs: ["Semua"],
  });

  const { alerts, success, error, removeAlert, info, clearAlerts } = useAlert();

  useEffect(() => {
    document.title = "Beasiswa APBN - Admin";
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [selectedYear]);

  const fetchAllData = async () => {
    setSummaryData([]);
    setDistributionData([]);
    setCategoriesData([]);
    setYearlyData([]);
    setStatusData([]);
    setTableData([]);
    setFilteredData([]);

    setLoading(true);
    setChartsLoading(true);

    try {
      await fetchSummary();
      setLoading(false);

      await Promise.all([fetchChartData(), fetchTableData()]);
    } catch (err) {
      console.error("Error fetching data:", err);
      error("Gagal", err.message || "Gagal memuat data");
    } finally {
      setChartsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await getGovernmentScholarshipSummary(
        selectedYear === "all" ? null : selectedYear,
      );

      const summary = [
        {
          title: "Total Penerima",
          value: data.totalPenerima || 0,
          icon: <UserOutlined className="text-3xl text-blue-600" />,
          color: "text-blue-600",
        },
        {
          title: "Mahasiswa Unik",
          value: data.totalMahasiswaUnik || 0,
          icon: <TrophyOutlined className="text-3xl text-green-600" />,
          color: "text-green-600",
        },
        {
          title: "Total Program",
          value: data.totalProgram || 0,
          icon: <BookOutlined className="text-3xl text-purple-600" />,
          color: "text-purple-600",
        },
      ];

      setSummaryData(summary);
    } catch (err) {
      console.error("Error fetching summary:", err);
      throw err;
    }
  };

  const fetchChartData = async () => {
    try {
      const yearParam = selectedYear === "all" ? null : selectedYear;

      const [distribution, categories, yearly] = await Promise.all([
        getGovernmentScholarshipDistribution(yearParam),
        getGovernmentScholarshipCategories(yearParam),
        getGovernmentScholarshipYearlyTrend(),
      ]);

      setDistributionData(distribution || []);
      setCategoriesData(categories || []);
      setYearlyData(yearly || []);

      const statusDistribution = [
        { label: "Normal", value: 0, color: "#22c55e" },
        { label: "Warning", value: 0, color: "#f59e0b" },
        { label: "Revoked", value: 0, color: "#ef4444" },
      ];

      setStatusData(statusDistribution);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      throw err;
    }
  };

  const fetchTableData = async () => {
    try {
      const searchFilters = {
        year: selectedYear === "all" ? null : selectedYear,
        ...filters,
      };

      const data = await getGovernmentScholarshipList(searchFilters);

      const transformedData = data.map((item, index) => ({
        key: item.id || index,
        id: item.id,
        nim: item.nim,
        nama: item.student_name,
        angkatan: item.student_batch,
        prodi: item.study_program,
        semester: item.semester,
        tahun: item.fiscal_year,
        periode: item.period,
        ipk: item.ipk?.toFixed(2) || "0.00",
        status: item.academic_status,
        skema: item.assistance_scheme,
        lastSync: item.last_synced_at,
      }));

      setTableData(transformedData);
      setFilteredData(transformedData);

      const programs = [
        ...new Set(data.map((d) => d.study_program).filter(Boolean)),
      ];
      setFilterOptions({
        statuses: ["Semua", "NORMAL", "WARNING", "REVOKED"],
        programs: ["Semua", ...programs],
      });

      const normalCount = data.filter(
        (d) => d.academic_status === "NORMAL",
      ).length;
      const warningCount = data.filter(
        (d) => d.academic_status === "WARNING",
      ).length;
      const revokedCount = data.filter(
        (d) => d.academic_status === "REVOKED",
      ).length;

      setStatusData([
        { label: "Normal", value: normalCount, color: "#22c55e" },
        { label: "Warning", value: warningCount, color: "#f59e0b" },
        { label: "Revoked", value: revokedCount, color: "#ef4444" },
      ]);
    } catch (err) {
      console.error("Error fetching table data:", err);
      throw err;
    }
  };

  const handleSyncIPK = async () => {
    try {
      setSyncingIPK(true);
      info("Sinkronisasi IPK", "Memproses sinkronisasi data IPK mahasiswa...");

      //   const result = await syncGovernmentScholarshipIPK(
      //     selectedYear === "all" ? null : selectedYear,
      //   );

      clearAlerts();
      success(
        "Sinkronisasi Berhasil!",
        `${result.updated} data IPK berhasil diperbarui. ` +
          `${result.status_changed} status akademik berubah.`,
      );

      if (result.summary) {
        setTimeout(() => {
          info(
            "Detail Perubahan",
            `Normal: ${result.summary.normal} | Warning: ${result.summary.warning} | Revoked: ${result.summary.revoked}`,
          );
        }, 1000);
      }

      fetchAllData();
    } catch (err) {
      clearAlerts();
      error("Gagal!", err.message || "Gagal melakukan sinkronisasi IPK");
    } finally {
      setSyncingIPK(false);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    info("Memuat data untuk tahun " + (year === "all" ? "semua tahun" : year));
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    let filtered = tableData;

    if (newFilters.status !== "Semua") {
      filtered = filtered.filter((item) => item.status === newFilters.status);
    }

    if (newFilters.program !== "Semua") {
      filtered = filtered.filter((item) => item.prodi === newFilters.program);
    }

    setFilteredData(filtered);
  };

  const handleImport = () => {
    setImportModalVisible(true);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const result = await importGovernmentScholarships(formData);

      clearAlerts();

      success(
        "Import Berhasil!",
        `${result.imported} data berhasil diimport untuk periode ${result.period}/${result.fiscal_year}. ` +
          `${result.deleted > 0 ? `(Menggantikan ${result.deleted} data lama)` : ""}`,
      );

      if (result.summary) {
        setTimeout(() => {
          info(
            "Ringkasan Import",
            `Normal: ${result.summary.normal_status} | Warning: ${result.summary.warning_status}`,
          );
        }, 1000);
      }

      setImportModalVisible(false);
      fetchAllData();
    } catch (err) {
      clearAlerts();
      error("Gagal!", err.message || "Gagal mengimport data");
    } finally {
      setUploading(false);
    }

    return false;
  };

  const handleExport = async () => {
    try {
      info("Export Data", "Memproses export data...");
      await exportGovernmentScholarships(
        selectedYear === "all" ? null : selectedYear,
      );
      clearAlerts();
      success("Berhasil!", "Data berhasil diexport!");
    } catch (err) {
      clearAlerts();
      error("Gagal!", err.message || "Gagal mengexport data");
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      NORMAL: "green",
      WARNING: "orange",
      REVOKED: "red",
    };
    return colorMap[status] || "default";
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      NORMAL: "Normal",
      WARNING: "Warning (IPK < 2.75)",
      REVOKED: "Dicabut",
    };
    return labelMap[status] || status;
  };

  const columns = [
    createNumberColumn(),
    {
      title: "NIM",
      dataIndex: "nim",
      key: "nim",
      width: 120,
      sorter: (a, b) => a.nim.localeCompare(b.nim),
    },
    {
      title: "Nama Mahasiswa",
      dataIndex: "nama",
      key: "nama",
      width: 200,
      sorter: (a, b) => a.nama.localeCompare(b.nama),
    },
    {
      title: "Angkatan",
      dataIndex: "angkatan",
      key: "angkatan",
      width: 100,
      align: "center",
      sorter: (a, b) => (a.angkatan || 0) - (b.angkatan || 0),
    },
    {
      title: "Program Studi",
      dataIndex: "prodi",
      key: "prodi",
      width: 180,
      sorter: (a, b) => (a.prodi || "").localeCompare(b.prodi || ""),
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      width: 90,
      align: "center",
      sorter: (a, b) => (a.semester || 0) - (b.semester || 0),
    },
    {
      title: "IPK",
      dataIndex: "ipk",
      key: "ipk",
      width: 80,
      align: "center",
      sorter: (a, b) => parseFloat(a.ipk) - parseFloat(b.ipk),
      render: (ipk) => (
        <span
          className={
            parseFloat(ipk) < 2.75
              ? "text-red-600 font-semibold"
              : "text-green-600 font-semibold"
          }
        >
          {ipk}
        </span>
      ),
    },
    {
      title: "Status Akademik",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          icon={status === "WARNING" ? <WarningOutlined /> : null}
        >
          {getStatusLabel(status)}
        </Tag>
      ),
      filters: [
        { text: "Normal", value: "NORMAL" },
        { text: "Warning", value: "WARNING" },
        { text: "Revoked", value: "REVOKED" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Skema Bantuan",
      dataIndex: "skema",
      key: "skema",
      width: 180,
    },
    {
      title: "Tahun Fiskal",
      dataIndex: "tahun",
      key: "tahun",
      width: 100,
      align: "center",
      sorter: (a, b) => a.tahun - b.tahun,
    },
    {
      title: "Periode",
      dataIndex: "periode",
      key: "periode",
      width: 100,
      align: "center",
    },
    createActionColumn([
      {
        key: "detail",
        label: "Detail",
        icon: <EyeOutlined />,
        onClick: (record) => {
          Modal.info({
            title: `Detail Penerima - ${record.nama}`,
            width: 600,
            content: (
              <div className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">NIM</p>
                    <p className="font-semibold">{record.nim}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-semibold">{record.nama}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Angkatan</p>
                    <p className="font-semibold">{record.angkatan || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Semester</p>
                    <p className="font-semibold">{record.semester || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Program Studi</p>
                    <p className="font-semibold">{record.prodi || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IPK</p>
                    <p
                      className={`font-semibold ${parseFloat(record.ipk) < 2.75 ? "text-red-600" : "text-green-600"}`}
                    >
                      {record.ipk}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status Akademik</p>
                    <Tag color={getStatusColor(record.status)}>
                      {getStatusLabel(record.status)}
                    </Tag>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Skema Bantuan</p>
                    <p className="font-semibold">{record.skema || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tahun Fiskal</p>
                    <p className="font-semibold">{record.tahun}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Periode</p>
                    <p className="font-semibold">{record.periode || "-"}</p>
                  </div>
                </div>
                {record.lastSync && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Terakhir sinkronisasi:{" "}
                      {new Date(record.lastSync).toLocaleString("id-ID")}
                    </p>
                  </div>
                )}
              </div>
            ),
          });
        },
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
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Beasiswa Pemerintah (APBN)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Data penerima beasiswa yang bersumber dari APBN
          </p>
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
            onClick={handleExport}
            className="flex items-center gap-2"
            icon={<DownloadOutlined />}
          >
            Export Data
          </Button>
          <Button
            type="primary"
            onClick={handleImport}
            className="flex items-center gap-2"
            icon={<UploadOutlined />}
          >
            Import Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryData.map((item, idx) => (
          <Card key={idx}>
            <div className="flex items-center justify-between py-4">
              <div>
                <span className="text-sm text-gray-600">{item.title}</span>
                <div className={`text-3xl font-bold ${item.color} mt-2`}>
                  {item.value.toLocaleString("id-ID")}
                </div>
              </div>
              <div>{item.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartsLoading ? (
          <>
            <Card title="Tren Tahunan" description="Jumlah penerima per tahun">
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
            <Card
              title="Distribusi per Program Studi"
              description="Top 10 program studi"
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
          </>
        ) : (
          <>
            <LineChart
              data={yearlyData}
              title="Tren Penerima Beasiswa APBN"
              description="Jumlah penerima beasiswa per tahun"
            />
            <HorizontalBarChart
              data={distributionData}
              title="Distribusi per Program Studi"
              description={`Top 10 program studi dengan penerima terbanyak tahun ${selectedYear === "all" ? "semua tahun" : selectedYear}`}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartsLoading ? (
          <>
            <Card
              title="Skema Bantuan"
              description="Distribusi berdasarkan skema"
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
            <Card
              title="Status Akademik"
              description="Distribusi status mahasiswa"
            >
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            </Card>
          </>
        ) : (
          <>
            <HorizontalBarChart
              data={categoriesData}
              title="Skema Bantuan"
              description="Distribusi penerima berdasarkan skema bantuan"
            />
            <PieChart
              data={statusData}
              title="Status Akademik Penerima"
              description="Distribusi berdasarkan status akademik (IPK)"
            />
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Data Penerima Beasiswa APBN
          </h2>

          <Button
            onClick={handleSyncIPK}
            loading={syncingIPK}
            className="flex items-center gap-2"
            icon={<SyncOutlined spin={syncingIPK} />}
            disabled={syncingIPK}
          >
            {syncingIPK ? "Menyinkronkan..." : "Sinkronisasi IPK"}
          </Button>
        </div>

        <UniversalTable
          data={filteredData}
          columns={columns}
          searchFields={["nim", "nama", "prodi", "skema"]}
          searchPlaceholder="Cari NIM, nama, program studi, atau skema..."
          onAdd={null}
          pageSize={10}
          customFilters={
            <>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                placeholder="Status Akademik"
                style={{ width: 180 }}
              >
                {filterOptions.statuses.map((option) => (
                  <Option key={option} value={option}>
                    {option === "Semua"
                      ? "Semua Status"
                      : getStatusLabel(option)}
                  </Option>
                ))}
              </Select>

              <Select
                value={filters.program}
                onChange={(value) => handleFilterChange("program", value)}
                placeholder="Program Studi"
                style={{ width: 200 }}
              >
                {filterOptions.programs.map((option) => (
                  <Option key={option} value={option}>
                    {option === "Semua" ? "Semua Program" : option}
                  </Option>
                ))}
              </Select>
            </>
          }
        />
      </div>

      <Modal
        title="Import Data Beasiswa APBN"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
        width={500}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <FileExcelOutlined className="mr-2" />
              Upload file Excel (.xlsx) yang berisi data penerima beasiswa APBN
            </p>
          </div>

          <Upload.Dragger
            name="file"
            accept=".xlsx,.xls"
            beforeUpload={handleUpload}
            maxCount={1}
            disabled={uploading}
          >
            <p className="ant-upload-drag-icon">
              <FileExcelOutlined style={{ color: "#2D60FF" }} />
            </p>
            <p className="ant-upload-text">Klik atau drag file untuk upload</p>
            <p className="ant-upload-hint">Support format: .xlsx, .xls</p>
          </Upload.Dragger>

          <div className="text-xs text-gray-500">
            <p className="font-semibold mb-2">Format Excel yang diperlukan:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>NIM (wajib)</li>
              <li>Nama Mahasiswa (wajib)</li>
              <li>Angkatan</li>
              <li>Program Studi</li>
              <li>Semester</li>
              <li>IPK</li>
              <li>Tahun Fiskal (wajib)</li>
              <li>Periode</li>
              <li>Skema Bantuan</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GovernmentScholarship;
