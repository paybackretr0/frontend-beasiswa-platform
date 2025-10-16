import React, { useEffect, useState } from "react";
import { Select, DatePicker, Tag, message } from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import UniversalTable, {
  createNumberColumn,
  createActionColumn,
} from "../../components/Table";
import GuestLayout from "../../layouts/GuestLayout";
import Card from "../../components/Card";
import { getUserApplications } from "../../services/historyService";

const { Option } = Select;
const { RangePicker } = DatePicker;

const History = () => {
  const [applications, setApplications] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Riwayat Pendaftaran Beasiswa - UNAND";
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getUserApplications();
      setApplications(data || []);
      setFilteredData(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      message.error("Gagal memuat data riwayat pendaftaran");
      setApplications([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Custom status column untuk history
  const createStatusColumn = () => ({
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const statusConfig = {
        VALIDATED: { color: "green", text: "Divalidasi" },
        REJECTED: { color: "red", text: "Ditolak" },
        MENUNGGU_VERIFIKASI: { color: "blue", text: "Menunggu Verifikasi" },
        MENUNGGU_VALIDASI: { color: "orange", text: "Pending" },
        VERIFIED: { color: "cyan", text: "Terverifikasi" },
        DRAFT: { color: "gray", text: "Draft" },
      };

      const config = statusConfig[status] || { color: "default", text: status };
      return <Tag color={config.color}>{config.text}</Tag>;
    },
    filters: [
      { text: "Divalidasi", value: "VALIDATED" },
      { text: "Ditolak", value: "REJECTED" },
      { text: "Menunggu Verifikasi", value: "MENUNGGU_VERIFIKASI" },
      { text: "Pending", value: "MENUNGGU_VALIDASI" },
      { text: "Terverifikasi", value: "VERIFIED" },
      { text: "Draft", value: "DRAFT" },
    ],
    onFilter: (value, record) => record.status === value,
  });

  const columns = [
    createNumberColumn(),
    {
      title: "Nama Beasiswa",
      dataIndex: "beasiswa",
      key: "beasiswa",
      sorter: (a, b) => a.beasiswa?.localeCompare(b.beasiswa) || 0,
      render: (text) => (
        <div className="font-medium text-gray-800">{text || "-"}</div>
      ),
    },
    {
      title: "Penyelenggara",
      dataIndex: "penyelenggara",
      key: "penyelenggara",
      render: (text) => (
        <div className="text-gray-600 text-sm">{text || "-"}</div>
      ),
    },
    {
      title: "Tanggal Daftar",
      dataIndex: "tanggalDaftar",
      key: "tanggalDaftar",
      sorter: (a, b) => new Date(a.tanggalDaftar) - new Date(b.tanggalDaftar),
      render: (date) =>
        date ? (
          <div className="text-gray-600 text-sm">
            {new Date(date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    createStatusColumn(),
    {
      title: "Tahapan",
      dataIndex: "tahapan",
      key: "tahapan",
      render: () => <Tag color="default">-</Tag>,
    },
    createActionColumn([
      {
        key: "detail",
        label: "Detail",
        icon: <EyeOutlined />,
        type: "default",
        onClick: (record) => console.log("View detail", record),
      },
      {
        key: "download",
        label: "Unduh",
        icon: <DownloadOutlined />,
        onClick: (record) => console.log("Download", record),
      },
      {
        key: "document",
        label: "Dokumen",
        icon: <FileTextOutlined />,
        onClick: (record) => console.log("View documents", record),
      },
    ]),
  ];

  // Custom filters
  const customFilters = (
    <div className="flex gap-4">
      <Select
        placeholder="Filter Status"
        style={{ width: 150 }}
        allowClear
        onChange={(value) => {
          if (value) {
            const filtered = applications.filter(
              (item) => item.status === value
            );
            setFilteredData(filtered);
          } else {
            setFilteredData(applications);
          }
        }}
      >
        <Option value="VALIDATED">Divalidasi</Option>
        <Option value="REJECTED">Ditolak</Option>
        <Option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</Option>
        <Option value="MENUNGGU_VALIDASI">Pending</Option>
        <Option value="VERIFIED">Terverifikasi</Option>
        <Option value="DRAFT">Draft</Option>
      </Select>

      <RangePicker
        placeholder={["Dari Tanggal", "Sampai Tanggal"]}
        style={{ width: 280 }}
        onChange={(dates) => {
          if (dates && dates[0] && dates[1]) {
            const [startDate, endDate] = dates;
            const filtered = applications.filter((item) => {
              const itemDate = new Date(item.tanggalDaftar);
              return (
                itemDate >= startDate.toDate() && itemDate <= endDate.toDate()
              );
            });
            setFilteredData(filtered);
          } else {
            setFilteredData(applications);
          }
        }}
      />
    </div>
  );

  // Calculate stats
  const totalApplications = applications.length;
  const validatedCount = applications.filter(
    (item) => item.status === "VALIDATED"
  ).length;
  const inProgressCount = applications.filter(
    (item) => !["VALIDATED", "REJECTED"].includes(item.status)
  ).length;
  const totalValue = applications
    .filter((item) => item.status === "VALIDATED")
    .reduce((total, item) => total + (item.scholarship_value || 0), 0);

  if (loading) {
    return (
      <GuestLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data riwayat pendaftaran...</p>
          </div>
        </div>
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Riwayat Pendaftaran Beasiswa
            </h1>
            <p className="text-gray-600">
              Data lengkap pendaftaran beasiswa yang pernah Anda lakukan
            </p>
          </div>

          {/* Statistik Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center bg-white hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {totalApplications}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Total Pendaftaran
                </div>
              </div>
            </Card>

            <Card className="text-center bg-white hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {validatedCount}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Divalidasi
                </div>
              </div>
            </Card>

            <Card className="text-center bg-white hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {inProgressCount}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Dalam Proses
                </div>
              </div>
            </Card>

            <Card className="text-center bg-white hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  Rp {totalValue.toLocaleString("id-ID")}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Total Dana Diterima
                </div>
              </div>
            </Card>
          </div>

          {/* Tabel */}
          <div className="bg-white rounded-lg shadow-sm">
            <UniversalTable
              title="Data Pendaftaran Beasiswa"
              data={filteredData}
              columns={columns}
              searchFields={["beasiswa", "organizer"]}
              searchPlaceholder="Cari nama beasiswa atau penyelenggara..."
              customFilters={customFilters}
              pageSize={10}
              scroll={{ x: 1200 }}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default History;
