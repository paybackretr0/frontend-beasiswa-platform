import React, { useEffect, useState } from "react";
import { Button, Select, DatePicker, Tag } from "antd";
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

export const historyData = [
  {
    key: 1,
    namaBeasiswa: "Beasiswa Unggulan UNAND",
    tanggalDaftar: "2025-01-10 10:30",
    statusPendaftaran: "Diterima",
    tahapan: "Pengumuman",
    nilaiBeasiswa: "Rp 10.000.000",
    periode: "2024/2025 Ganjil",
  },
  {
    key: 2,
    namaBeasiswa: "Beasiswa KIP Kuliah",
    tanggalDaftar: "2024-12-15 14:20",
    statusPendaftaran: "Dalam Review",
    tahapan: "Verifikasi Berkas",
    nilaiBeasiswa: "Rp 12.000.000",
    periode: "2024/2025 Ganjil",
  },
  {
    key: 3,
    namaBeasiswa: "Beasiswa Bank Indonesia",
    tanggalDaftar: "2024-11-20 09:45",
    statusPendaftaran: "Ditolak",
    tahapan: "Seleksi Administrasi",
    nilaiBeasiswa: "Rp 15.000.000",
    periode: "2024/2025 Ganjil",
  },
  {
    key: 4,
    namaBeasiswa: "Beasiswa Djarum Foundation",
    tanggalDaftar: "2024-10-05 16:15",
    statusPendaftaran: "Diterima",
    tahapan: "Pencairan Dana",
    nilaiBeasiswa: "Rp 8.000.000",
    periode: "2024/2025 Genap",
  },
  {
    key: 5,
    namaBeasiswa: "Beasiswa Tanoto Foundation",
    tanggalDaftar: "2024-09-12 11:30",
    statusPendaftaran: "Pending",
    tahapan: "Menunggu Pengumuman",
    nilaiBeasiswa: "Rp 20.000.000",
    periode: "2024/2025 Genap",
  },
];

const { Option } = Select;
const { RangePicker } = DatePicker;

const History = () => {
  const [filteredData, setFilteredData] = useState(historyData);

  useEffect(() => {
    document.title = "Riwayat Daftar Beasiswa";
  }, []);

  // Custom status column untuk history
  const createStatusColumn = () => ({
    title: "Status",
    dataIndex: "statusPendaftaran",
    key: "statusPendaftaran",
    render: (status) => {
      const statusConfig = {
        Diterima: { color: "green", text: "Diterima" },
        Ditolak: { color: "red", text: "Ditolak" },
        "Dalam Review": { color: "blue", text: "Dalam Review" },
        Pending: { color: "orange", text: "Pending" },
        Dibatalkan: { color: "gray", text: "Dibatalkan" },
      };

      const config = statusConfig[status] || { color: "default", text: status };
      return <Tag color={config.color}>{config.text}</Tag>;
    },
    filters: [
      { text: "Diterima", value: "Diterima" },
      { text: "Ditolak", value: "Ditolak" },
      { text: "Dalam Review", value: "Dalam Review" },
      { text: "Pending", value: "Pending" },
    ],
    onFilter: (value, record) => record.statusPendaftaran === value,
  });

  // Custom tahapan column
  const createTahapanColumn = () => ({
    title: "Tahapan",
    dataIndex: "tahapan",
    key: "tahapan",
    render: (tahapan, record) => {
      const tahapanConfig = {
        Pengumuman: { color: "green" },
        "Verifikasi Berkas": { color: "blue" },
        "Seleksi Administrasi": { color: "orange" },
        "Pencairan Dana": { color: "purple" },
        "Menunggu Pengumuman": { color: "gray" },
      };

      const config = tahapanConfig[tahapan] || { color: "default" };
      return <Tag color={config.color}>{tahapan}</Tag>;
    },
  });

  const columns = [
    createNumberColumn(),
    {
      title: "Nama Beasiswa",
      dataIndex: "namaBeasiswa",
      key: "namaBeasiswa",
      sorter: (a, b) => a.namaBeasiswa.localeCompare(b.namaBeasiswa),
      render: (text) => <div className="font-medium text-gray-800">{text}</div>,
    },
    {
      title: "Tanggal Daftar",
      dataIndex: "tanggalDaftar",
      key: "tanggalDaftar",
      sorter: (a, b) => new Date(a.tanggalDaftar) - new Date(b.tanggalDaftar),
      render: (date) => (
        <div className="text-gray-600">
          {new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    createStatusColumn(),
    createTahapanColumn(),
    {
      title: "Nilai Beasiswa",
      dataIndex: "nilaiBeasiswa",
      key: "nilaiBeasiswa",
      sorter: (a, b) => {
        const valueA = parseInt(a.nilaiBeasiswa.replace(/\D/g, ""));
        const valueB = parseInt(b.nilaiBeasiswa.replace(/\D/g, ""));
        return valueA - valueB;
      },
      render: (nilai) => (
        <div className="font-semibold text-green-600">{nilai}</div>
      ),
    },
    {
      title: "Periode",
      dataIndex: "periode",
      key: "periode",
      filters: [
        { text: "2024/2025 Ganjil", value: "2024/2025 Ganjil" },
        { text: "2024/2025 Genap", value: "2024/2025 Genap" },
      ],
      onFilter: (value, record) => record.periode === value,
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
    <>
      <Select
        placeholder="Filter Status"
        style={{ width: 150 }}
        allowClear
        onChange={(value) => {
          if (value) {
            const filtered = historyData.filter(
              (item) => item.statusPendaftaran === value
            );
            setFilteredData(filtered);
          } else {
            setFilteredData(historyData);
          }
        }}
      >
        <Option value="Diterima">Diterima</Option>
        <Option value="Ditolak">Ditolak</Option>
        <Option value="Dalam Review">Dalam Review</Option>
        <Option value="Pending">Pending</Option>
      </Select>

      <Select
        placeholder="Filter Periode"
        style={{ width: 160 }}
        allowClear
        onChange={(value) => {
          if (value) {
            const filtered = historyData.filter(
              (item) => item.periode === value
            );
            setFilteredData(filtered);
          } else {
            setFilteredData(historyData);
          }
        }}
      >
        <Option value="2024/2025 Ganjil">2024/2025 Ganjil</Option>
        <Option value="2024/2025 Genap">2024/2025 Genap</Option>
      </Select>

      <RangePicker
        placeholder={["Dari Tanggal", "Sampai Tanggal"]}
        style={{ width: 250 }}
        onChange={(dates) => {
          if (dates && dates[0] && dates[1]) {
            const [startDate, endDate] = dates;
            const filtered = historyData.filter((item) => {
              const itemDate = new Date(item.tanggalDaftar);
              return (
                itemDate >= startDate.toDate() && itemDate <= endDate.toDate()
              );
            });
            setFilteredData(filtered);
          } else {
            setFilteredData(historyData);
          }
        }}
      />
    </>
  );

  return (
    <GuestLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
              Riwayat Pendaftaran
            </h1>
          </div>

          {/* Statistik Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Pendaftaran</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {historyData.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileTextOutlined className="text-blue-600 text-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Diterima</p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      historyData.filter(
                        (item) => item.statusPendaftaran === "Diterima"
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <EyeOutlined className="text-green-600 text-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Dalam Proses</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      historyData.filter((item) =>
                        ["Dalam Review", "Pending"].includes(
                          item.statusPendaftaran
                        )
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <DownloadOutlined className="text-yellow-600 text-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Dana</p>
                  <p className="text-2xl font-bold text-purple-600">
                    Rp 65 Juta
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FileTextOutlined className="text-purple-600 text-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabel */}
          <UniversalTable
            title="Riwayat Pendaftaran Beasiswa"
            data={filteredData}
            columns={columns}
            searchFields={["namaBeasiswa", "tahapan"]}
            searchPlaceholder="Cari nama beasiswa atau tahapan..."
            customFilters={customFilters}
            pageSize={10}
            scroll={{ x: 1200 }}
          />
        </div>
      </div>
    </GuestLayout>
  );
};

export default History;
