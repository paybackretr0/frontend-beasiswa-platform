import { useEffect, useState } from "react";
import { message, Pagination } from "antd";
import {
  DownloadOutlined,
  DatabaseOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import UniversalModal from "../../../components/Modal";
import { getAllBackups, createBackup } from "../../../services/extraService";

const BackupAdmin = () => {
  const [backupData, setBackupData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    document.title = "Backup Data - Admin";
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBackups();
      setBackupData(data);
    } catch (error) {
      console.error("Error fetching backups:", error);
      message.error("Gagal memuat data backup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupSubmit = async (values) => {
    setIsCreatingBackup(true);
    const backupTypeText = values.backupType === "excel" ? "Excel" : "SQL";
    message.loading(`Sedang membuat backup ${backupTypeText}...`, 0);

    try {
      await createBackup(values.backupType);
      message.destroy();
      message.success(`Backup ${backupTypeText} berhasil dibuat!`);

      setModalVisible(false);
      await fetchBackups();
    } catch (error) {
      message.destroy();
      message.error(`Gagal membuat backup ${backupTypeText}`);
      console.error("Error creating backup:", error);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDownload = (backup) => {
    if (!backup.file_path) {
      message.error("File backup tidak tersedia");
      return;
    }

    message.loading(`Mengunduh ${getFileName(backup.file_path)}...`, 2);

    const downloadUrl = `${import.meta.env.VITE_IMAGE_URL}/${backup.file_path}`;

    window.open(downloadUrl, "_blank");

    setTimeout(() => {
      message.success(`${getFileName(backup.file_path)} berhasil diunduh!`);
    }, 1000);
  };

  const getFileName = (filePath) => {
    if (!filePath) return "Unknown";
    return filePath.split("/").pop();
  };

  const getBackupType = (fileName) => {
    if (!fileName) return "Unknown";
    return fileName.includes(".xlsx") ? "Excel" : "SQL";
  };

  const getFileSize = (message) => {
    if (!message) return "Unknown";
    const match = message.match(/(\d+\.?\d*) MB/);
    return match ? match[0] : "Unknown";
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
          onClick={() => setModalVisible(true)}
          disabled={isCreatingBackup}
          className="flex items-center gap-2"
        >
          <DatabaseOutlined />
          Buat Backup
        </Button>
      </div>

      {/* Backup History Cards */}
      <div className="space-y-4 mt-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat data backup...</p>
          </div>
        ) : currentBackups.length === 0 ? (
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
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {getFileName(backup.file_path)}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          backup.status === "SUCCESS"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {backup.status}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {getBackupType(backup.file_path)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{formatDate(backup.createdAt)}</span>
                      <span>•</span>
                      <span>{getFileSize(backup.message)}</span>
                      {backup.User && (
                        <>
                          <span>•</span>
                          <span>
                            oleh {backup.User.full_name || backup.User.email}
                          </span>
                        </>
                      )}
                    </div>
                    {backup.message && (
                      <p className="text-sm text-gray-500 mt-1">
                        {backup.message}
                      </p>
                    )}
                  </div>
                  {backup.status === "SUCCESS" && backup.file_path && (
                    <Button
                      onClick={() => handleDownload(backup)}
                      className="flex items-center gap-2 px-4 py-2 text-sm"
                    >
                      <DownloadOutlined />
                      Download
                    </Button>
                  )}
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

      {/* Modal Pilih Jenis Backup */}
      <UniversalModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleBackupSubmit}
        title="Pilih Jenis Backup"
        loading={isCreatingBackup}
        fields={[
          {
            name: "backupType",
            label: "Jenis Backup",
            type: "select",
            options: [
              {
                label: (
                  <div className="flex items-center gap-2">
                    <DatabaseOutlined />
                    <span>
                      SQL Database - File .sql lengkap dengan struktur
                    </span>
                  </div>
                ),
                value: "sql",
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <FileExcelOutlined />
                    <span>Excel Export - Data tabel dalam format .xlsx</span>
                  </div>
                ),
                value: "excel",
              },
            ],
            rules: [{ required: true, message: "Pilih jenis backup" }],
          },
        ]}
      />
    </div>
  );
};

export default BackupAdmin;
