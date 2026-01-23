import React, { useEffect, useState } from "react";
import { Pagination, Select, Input, DatePicker } from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Button from "../../../components/Button";
import {
  getAllActivityLogs,
  exportActivityLogs,
} from "../../../services/extraService";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";
import { SkeletonLog } from "../../../components/common/skeleton";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const roleOptions = [
  { label: "Semua Role", value: "Semua" },
  { label: "Mahasiswa", value: "MAHASISWA" },
  { label: "Verifikator Fakultas", value: "VERIFIKATOR_FAKULTAS" },
  { label: "Verifikator Ditmawa", value: "VERIFIKATOR_DITMAWA" },
  { label: "Validator Ditmawa", value: "VALIDATOR_DITMAWA" },
  { label: "Pimpinan Fakultas", value: "PIMPINAN_FAKULTAS" },
  { label: "Pimpinan Ditmawa", value: "PIMPINAN_DITMAWA" },
  { label: "Super Admin", value: "SUPERADMIN" },
];

const LogAdmin = () => {
  const [logData, setLogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    role: "Semua",
    dateRange: null,
  });
  const pageSize = 15;

  const { alerts, success, error, removeAlert, clearAlerts, info } = useAlert();

  useEffect(() => {
    document.title = "Log Aktivitas - Admin";
    fetchActivityLogs();
  }, [currentPage, filters]);

  const fetchActivityLogs = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: filters.search || undefined,
        role: filters.role !== "Semua" ? filters.role : undefined,
        startDate: filters.dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: filters.dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      const response = await getAllActivityLogs(params);
      setLogData(response.logs);
      setTotalRecords(response.pagination.totalRecords);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      error(
        "Gagal Memuat Log Aktivitas",
        err.message || "Gagal memuat log aktivitas",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportLog = async () => {
    setIsExporting(true);
    info("Mengekspor Log Aktivitas", "Sedang mengekspor log aktivitas...");

    try {
      const exportFilters = {
        search: filters.search || undefined,
        role: filters.role !== "Semua" ? filters.role : undefined,
        startDate: filters.dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: filters.dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      const result = await exportActivityLogs(exportFilters);

      clearAlerts();
      success(
        "Berhasil Mengekspor Log Aktivitas",
        "Log aktivitas berhasil diekspor",
      );

      const downloadUrl = `${
        import.meta.env.VITE_IMAGE_URL || "http://localhost:5000"
      }/${result.filePath}`;
      window.open(downloadUrl, "_blank");
    } catch (err) {
      clearAlerts();
      error("Gagal Mengekspor Log Aktivitas", "Gagal mengekspor log aktivitas");
      console.error("Error exporting logs:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    handleFilterChange("search", value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case "MAHASISWA":
        return "Mahasiswa";
      case "VERIFIKATOR_FAKULTAS":
        return "Verifikator Fakultas";
      case "VERIFIKATOR_DITMAWA":
        return "Verifikator Ditmawa";
      case "VALIDATOR_DITMAWA":
        return "Validator Ditmawa";
      case "PIMPINAN_FAKULTAS":
        return "Pimpinan Fakultas";
      case "PIMPINAN_DITMAWA":
        return "Pimpinan Ditmawa";
      case "SUPERADMIN":
        return "Super Admin";
      default:
        return role || "System";
    }
  };

  return (
    <div>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Log Aktivitas</h1>
          <p className="text-gray-600 mt-1">
            Pantau semua aktivitas pengguna dalam sistem
          </p>
        </div>
        <Button
          onClick={handleExportLog}
          disabled={isExporting || isLoading}
          className="flex items-center gap-2"
        >
          <DownloadOutlined />
          {isExporting ? "Mengekspor..." : "Export Log"}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
          <div className="lg:col-span-2">
            <Search
              placeholder="Cari nama user, email, atau aktivitas..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={handleSearch}
              onChange={(e) => {
                if (!e.target.value) {
                  handleFilterChange("search", "");
                }
              }}
              disabled={isLoading}
            />
          </div>
          <div>
            <Select
              value={filters.role}
              onChange={(value) => handleFilterChange("role", value)}
              placeholder="Semua Role"
              style={{ width: "100%" }}
              disabled={isLoading}
            >
              {roleOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange("dateRange", dates)}
              placeholder={["Tanggal Mulai", "Tanggal Akhir"]}
              style={{ width: "100%" }}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLog items={10} />
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              History Aktivitas
            </h2>
            <span className="text-sm text-gray-500">
              {totalRecords} aktivitas ditemukan
            </span>
          </div>

          {logData.length === 0 ? (
            <div className="text-center py-12">
              <FileTextOutlined className="text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">Tidak ada log aktivitas ditemukan</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logData.map((log) => (
                <div
                  key={log.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {log.User?.full_name || log.User?.email || "System"}
                        </h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 flex-shrink-0">
                          {getRoleDisplay(log.User?.role)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{log.action}</p>
                      {log.description && (
                        <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                          {log.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{formatDate(log.createdAt)}</span>
                        {log.ip_address && (
                          <>
                            <span>•</span>
                            <span>{log.ip_address}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {log.entity_type && (
                      <div className="flex-shrink-0 ml-4">
                        <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                          {log.entity_type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalRecords > pageSize && (
            <div className="flex justify-center pt-6">
              <Pagination
                current={currentPage}
                total={totalRecords}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper={true}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} dari ${total} aktivitas`
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogAdmin;
