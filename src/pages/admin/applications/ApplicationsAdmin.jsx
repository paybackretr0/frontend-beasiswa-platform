import { useEffect } from "react";
import { message } from "antd";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Card from "../../../components/Card";

// Data dummy pendaftaran
const pendaftaranData = [
  {
    key: 1,
    nama: "Andi Pratama",
    beasiswa: "Beasiswa Unggulan UNAND",
    tanggalDaftar: "2025-01-10",
    status: "Menunggu Verifikasi",
  },
  {
    key: 2,
    nama: "Siti Nurhaliza",
    beasiswa: "Beasiswa KIP Kuliah",
    tanggalDaftar: "2025-01-12",
    status: "Menunggu Validasi",
  },
  {
    key: 3,
    nama: "Budi Santoso",
    beasiswa: "Beasiswa Bank Indonesia",
    tanggalDaftar: "2025-01-08",
    status: "Dikembalikan",
  },
  {
    key: 4,
    nama: "Dewi Sartika",
    beasiswa: "Beasiswa Unggulan UNAND",
    tanggalDaftar: "2025-01-15",
    status: "Menunggu Verifikasi",
  },
  {
    key: 5,
    nama: "Eka Putra",
    beasiswa: "Beasiswa Djarum Foundation",
    tanggalDaftar: "2025-01-14",
    status: "Disetujui",
  },
];

// Data untuk card summary
const summaryData = [
  {
    title: "Total Pendaftar",
    value: 125,
    color: "text-blue-600",
  },
  {
    title: "Menunggu Verifikasi",
    value: 45,
    color: "text-orange-600",
  },
  {
    title: "Menunggu Validasi",
    value: 32,
    color: "text-yellow-600",
  },
  {
    title: "Dikembalikan",
    value: 18,
    color: "text-red-600",
  },
];

const ApplicationsAdmin = () => {
  useEffect(() => {
    document.title = "Kelola Pendaftaran - Admin";
  }, []);

  const handleDetail = (record) => {
    message.info(`Detail pendaftaran: ${record.nama}`);
  };

  const handleApprove = (record) => {
    message.success(`Setujui pendaftaran: ${record.nama}`);
  };

  const handleReject = (record) => {
    message.warning(`Tolak pendaftaran: ${record.nama}`);
  };

  const columns = [
    createNumberColumn(),
    {
      title: "Nama Pendaftar",
      dataIndex: "nama",
      key: "nama",
      sorter: (a, b) => a.nama.localeCompare(b.nama),
    },
    {
      title: "Beasiswa",
      dataIndex: "beasiswa",
      key: "beasiswa",
      sorter: (a, b) => a.beasiswa.localeCompare(b.beasiswa),
    },
    {
      title: "Tanggal Daftar",
      dataIndex: "tanggalDaftar",
      key: "tanggalDaftar",
      sorter: (a, b) => new Date(a.tanggalDaftar) - new Date(b.tanggalDaftar),
    },
    createStatusColumn({
      "Menunggu Verifikasi": { color: "orange" },
      "Menunggu Validasi": { color: "gold" },
      Dikembalikan: { color: "red" },
      Disetujui: { color: "green" },
    }),
    createActionColumn([
      {
        key: "detail",
        label: "Detail",
        icon: <EyeOutlined />,
        onClick: handleDetail,
      },
      {
        key: "approve",
        label: "Setujui",
        icon: <CheckOutlined />,
        onClick: handleApprove,
      },
      {
        key: "reject",
        label: "Tolak",
        icon: <CloseOutlined />,
        danger: true,
        onClick: handleReject,
      },
    ]),
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryData.map((item, idx) => (
          <Card key={idx}>
            <div className="flex flex-col items-center py-4">
              <span className="text-sm text-gray-600 mb-2">{item.title}</span>
              <span className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <UniversalTable
        title="Kelola Pendaftaran"
        data={pendaftaranData}
        columns={columns}
        searchFields={["nama", "beasiswa"]}
        searchPlaceholder="Cari nama pendaftar atau beasiswa..."
        onAdd={null} // Tidak ada tombol tambah
      />
    </div>
  );
};

export default ApplicationsAdmin;
