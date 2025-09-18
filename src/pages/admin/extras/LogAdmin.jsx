import React, { useEffect, useState } from "react";
import { message, Pagination, Select, Input } from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Button from "../../../components/Button";
import Card from "../../../components/Card";

const { Search } = Input;
const { Option } = Select;

// Data dummy log aktivitas
const logData = [
  {
    id: 1,
    namaUser: "Admin Utama",
    role: "Admin",
    aktivitas: "Login ke sistem",
    timestamp: "18 Jan 2025, 14:30",
  },
  {
    id: 2,
    namaUser: "Dr. Ahmad Verif",
    role: "Verifikator",
    aktivitas: "Memverifikasi berkas beasiswa KIP Kuliah",
    timestamp: "18 Jan 2025, 14:25",
  },
  {
    id: 3,
    namaUser: "Andi Pratama",
    role: "Mahasiswa",
    aktivitas: "Mendaftar beasiswa Unggulan UNAND",
    timestamp: "18 Jan 2025, 14:20",
  },
  {
    id: 4,
    namaUser: "Prof. Dr. Dekan Teknik",
    role: "Pimpinan Fakultas",
    aktivitas: "Menyetujui pendaftaran beasiswa",
    timestamp: "18 Jan 2025, 14:15",
  },
  {
    id: 5,
    namaUser: "Admin Utama",
    role: "Admin",
    aktivitas: "Menambahkan beasiswa baru",
    timestamp: "18 Jan 2025, 14:10",
  },
  {
    id: 6,
    namaUser: "Siti Nurhaliza",
    role: "Mahasiswa",
    aktivitas: "Upload dokumen persyaratan",
    timestamp: "18 Jan 2025, 14:05",
  },
  {
    id: 7,
    namaUser: "Prof. Sari Validator",
    role: "Verifikator",
    aktivitas: "Menolak berkas tidak lengkap",
    timestamp: "18 Jan 2025, 14:00",
  },
  {
    id: 8,
    namaUser: "Prof. Dr. Direktur Kemahasiswaan",
    role: "Pimpinan Ditmawa",
    aktivitas: "Menvalidasi hasil seleksi",
    timestamp: "18 Jan 2025, 13:55",
  },
  {
    id: 9,
    namaUser: "Budi Santoso",
    role: "Mahasiswa",
    aktivitas: "Melihat status pendaftaran",
    timestamp: "18 Jan 2025, 13:50",
  },
  {
    id: 10,
    namaUser: "Admin Utama",
    role: "Admin",
    aktivitas: "Export laporan pendaftaran",
    timestamp: "18 Jan 2025, 13:45",
  },
  {
    id: 11,
    namaUser: "Dewi Sartika",
    role: "Mahasiswa",
    aktivitas: "Edit profil mahasiswa",
    timestamp: "18 Jan 2025, 13:40",
  },
  {
    id: 12,
    namaUser: "Dr. Dekan Ekonomi",
    role: "Pimpinan Fakultas",
    aktivitas: "Review daftar penerima beasiswa",
    timestamp: "18 Jan 2025, 13:35",
  },
  {
    id: 13,
    namaUser: "Eka Putra",
    role: "Mahasiswa",
    aktivitas: "Download surat keterangan beasiswa",
    timestamp: "18 Jan 2025, 13:30",
  },
  {
    id: 14,
    namaUser: "Admin Utama",
    role: "Admin",
    aktivitas: "Backup database sistem",
    timestamp: "18 Jan 2025, 13:25",
  },
  {
    id: 15,
    namaUser: "Dr. Ahmad Verif",
    role: "Verifikator",
    aktivitas: "Logout dari sistem",
    timestamp: "18 Jan 2025, 13:20",
  },
];

// Filter options
const roleOptions = [
  "Semua",
  "Admin",
  "Mahasiswa",
  "Verifikator",
  "Pimpinan Fakultas",
  "Pimpinan Ditmawa",
];

const LogAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredLogs, setFilteredLogs] = useState(logData);
  const [filters, setFilters] = useState({
    search: "",
    role: "Semua",
  });
  const [isExporting, setIsExporting] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    document.title = "Log Aktivitas - Admin";
  }, []);

  // Handle export log
  const handleExportLog = () => {
    setIsExporting(true);
    message.loading("Sedang mengekspor log aktivitas...", 0);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      message.destroy();
      message.success("Log aktivitas berhasil diekspor!");

      // In real implementation, trigger file download
      const fileName = `log_aktivitas_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      console.log("Exporting log to:", fileName);
    }, 2000);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
    setCurrentPage(1); // Reset to first page
  };

  // Apply filters to data
  const applyFilters = (currentFilters) => {
    let filtered = logData;

    // Apply search filter
    if (currentFilters.search) {
      filtered = filtered.filter(
        (item) =>
          item.namaUser
            ?.toLowerCase()
            .includes(currentFilters.search.toLowerCase()) ||
          item.aktivitas
            ?.toLowerCase()
            .includes(currentFilters.search.toLowerCase())
      );
    }

    // Apply role filter
    if (currentFilters.role !== "Semua") {
      filtered = filtered.filter((item) => item.role === currentFilters.role);
    }

    setFilteredLogs(filtered);
  };

  // Handle search
  const handleSearch = (value) => {
    handleFilterChange("search", value);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Log Aktivitas</h1>
          <p className="text-gray-600 mt-1">
            Pantau semua aktivitas pengguna dalam sistem
          </p>
        </div>
        <Button
          onClick={handleExportLog}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <DownloadOutlined />
          {isExporting ? "Mengekspor..." : "Export Log"}
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Search
              placeholder="Cari nama user atau aktivitas..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={handleSearch}
              onChange={(e) => {
                if (!e.target.value) {
                  handleFilterChange("search", "");
                }
              }}
              style={{ maxWidth: 400 }}
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={filters.role}
              onChange={(value) => handleFilterChange("role", value)}
              placeholder="Semua Role"
              style={{ width: 180 }}
            >
              {roleOptions.map((option) => (
                <Option key={option} value={option}>
                  {option === "Semua" ? "Semua Role" : option}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Log History Cards */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            History Aktivitas
          </h2>
          <span className="text-sm text-gray-500">
            {filteredLogs.length} aktivitas ditemukan
          </span>
        </div>

        {currentLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileTextOutlined className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">Tidak ada log aktivitas ditemukan</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentLogs.map((log) => (
              <Card key={log.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {log.namaUser}
                      </h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {log.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">{log.aktivitas}</span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredLogs.length > pageSize && (
          <div className="flex justify-center pt-6">
            <Pagination
              current={currentPage}
              total={filteredLogs.length}
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
    </div>
  );
};

export default LogAdmin;
