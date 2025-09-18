import { useEffect, useState } from "react";
import { message, Pagination } from "antd";
import { DownloadOutlined, DatabaseOutlined } from "@ant-design/icons";
import Button from "../../../components/Button";
import Card from "../../../components/Card";

// Data dummy backup history
const backupData = [
  {
    id: 1,
    namaFile: "backup_beasiswa_2025_01_18_14_30.sql",
    timestamp: "18 Jan 2025, 14:30",
    ukuran: "45.2 MB",
  },
  {
    id: 2,
    namaFile: "backup_beasiswa_2025_01_17_09_15.sql",
    timestamp: "17 Jan 2025, 09:15",
    ukuran: "44.8 MB",
  },
  {
    id: 3,
    namaFile: "backup_beasiswa_2025_01_16_16_45.sql",
    timestamp: "16 Jan 2025, 16:45",
    ukuran: "43.9 MB",
  },
  {
    id: 4,
    namaFile: "backup_beasiswa_2025_01_15_12_20.sql",
    timestamp: "15 Jan 2025, 12:20",
    ukuran: "43.5 MB",
  },
  {
    id: 5,
    namaFile: "backup_beasiswa_2025_01_14_08_30.sql",
    timestamp: "14 Jan 2025, 08:30",
    ukuran: "43.1 MB",
  },
  {
    id: 6,
    namaFile: "backup_beasiswa_2025_01_13_15_45.sql",
    timestamp: "13 Jan 2025, 15:45",
    ukuran: "42.7 MB",
  },
  {
    id: 7,
    namaFile: "backup_beasiswa_2025_01_12_11_10.sql",
    timestamp: "12 Jan 2025, 11:10",
    ukuran: "42.3 MB",
  },
  {
    id: 8,
    namaFile: "backup_beasiswa_2025_01_11_14_25.sql",
    timestamp: "11 Jan 2025, 14:25",
    ukuran: "41.9 MB",
  },
  {
    id: 9,
    namaFile: "backup_beasiswa_2025_01_10_09_50.sql",
    timestamp: "10 Jan 2025, 09:50",
    ukuran: "41.5 MB",
  },
  {
    id: 10,
    namaFile: "backup_beasiswa_2025_01_09_16_35.sql",
    timestamp: "09 Jan 2025, 16:35",
    ukuran: "41.1 MB",
  },
  {
    id: 11,
    namaFile: "backup_beasiswa_2025_01_08_13_20.sql",
    timestamp: "08 Jan 2025, 13:20",
    ukuran: "40.8 MB",
  },
  {
    id: 12,
    namaFile: "backup_beasiswa_2025_01_07_10_45.sql",
    timestamp: "07 Jan 2025, 10:45",
    ukuran: "40.4 MB",
  },
];

const BackupAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    document.title = "Backup Data - Admin";
  }, []);

  // Handle backup data
  const handleBackupData = () => {
    setIsLoading(true);
    message.loading("Sedang membuat backup...", 0);

    // Simulate backup process
    setTimeout(() => {
      setIsLoading(false);
      message.destroy();
      message.success("Backup data berhasil dibuat!");

      // Add new backup to the list (simulate)
      const newBackup = {
        id: backupData.length + 1,
        namaFile: `backup_beasiswa_${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[-:]/g, "_")
          .replace("T", "_")}.sql`,
        timestamp: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        ukuran: `${(Math.random() * 10 + 40).toFixed(1)} MB`,
      };

      // In real implementation, you would update the state with new backup
      console.log("New backup created:", newBackup);
    }, 3000);
  };

  // Handle download backup
  const handleDownload = (backup) => {
    message.loading(`Mengunduh ${backup.namaFile}...`, 2);

    // Simulate download process
    setTimeout(() => {
      message.success(`${backup.namaFile} berhasil diunduh!`);
    }, 2000);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBackups = backupData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Backup Data</h1>
          <p className="text-gray-600 mt-1">
            Kelola backup database sistem beasiswa
          </p>
        </div>
        <Button
          onClick={handleBackupData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <DatabaseOutlined />
          {isLoading ? "Membuat Backup..." : "Backup Data"}
        </Button>
      </div>

      {/* Backup History Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">History Backup</h2>

        {currentBackups.length === 0 ? (
          <div className="text-center py-12">
            <DatabaseOutlined className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500">Belum ada history backup</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentBackups.map((backup) => (
              <Card key={backup.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {backup.namaFile}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{backup.timestamp}</span>
                      <span>•</span>
                      <span>{backup.ukuran}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(backup)}
                    className="flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <DownloadOutlined />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {backupData.length > pageSize && (
          <div className="flex justify-center pt-6">
            <Pagination
              current={currentPage}
              total={backupData.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper={true}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} dari ${total} backup`
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupAdmin;
