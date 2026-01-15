import React, { useEffect, useState } from "react";
import { Select, DatePicker, Tag } from "antd";
import { EyeOutlined, FormOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UniversalTable, {
  createNumberColumn,
  createActionColumn,
} from "../../components/Table";
import GuestLayout from "../../layouts/GuestLayout";
import Card from "../../components/Card";
import { getUserApplications } from "../../services/historyService";
import ApplicationDetailModal from "../../components/ApplicationDetailModal";
import { getApplicationDetailUser } from "../../services/applicationService";
import AlertContainer from "../../components/AlertContainer";
import useAlert from "../../hooks/useAlert";
import RequireEmailVerification from "../../components/RequireEmailVerification";

const { Option } = Select;
const { RangePicker } = DatePicker;

const HistoryWithVerification = () => {
  return (
    <RequireEmailVerification>
      <History />
    </RequireEmailVerification>
  );
};

const History = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const { alerts, success, error, removeAlert } = useAlert();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {}
  const role = user?.role?.toUpperCase() || null;

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
    } catch (err) {
      console.error("Error fetching applications:", err);
      error("Gagal!", "Gagal memuat data riwayat pendaftaran");
      setApplications([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = async (record) => {
    try {
      setDetailLoading(true);
      setDetailModalVisible(true);

      const detail = await getApplicationDetailUser(record.id);
      setSelectedApplication(detail);
    } catch (err) {
      console.error("Error fetching application detail:", err);
      error("Gagal!", "Gagal memuat detail pendaftaran");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedApplication(null);
  };

  const handleCompleteDraft = (record) => {
    success(
      "Mengalihkan...",
      `Mengarahkan ke form pendaftaran ${record.beasiswa}`
    );

    setTimeout(() => {
      navigate(
        `/scholarship/${record.scholarship_id}/apply?schema=${record.schema_id}`
      );
    }, 1000);
  };

  const createStatusColumn = () => ({
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const statusConfig = {
        VALIDATED: { color: "green", text: "Divalidasi" },
        REJECTED: { color: "red", text: "Ditolak" },
        MENUNGGU_VERIFIKASI: { color: "blue", text: "Menunggu Verifikasi" },
        VERIFIED: { color: "cyan", text: "Terverifikasi - Menunggu Validasi" },
        DRAFT: { color: "orange", text: "Draft" },
      };

      const config = statusConfig[status] || { color: "default", text: status };
      return <Tag color={config.color}>{config.text}</Tag>;
    },
    filters: [
      { text: "Divalidasi", value: "VALIDATED" },
      { text: "Ditolak", value: "REJECTED" },
      { text: "Menunggu Verifikasi", value: "MENUNGGU_VERIFIKASI" },
      { text: "Terverifikasi - Menunggu Validasi", value: "VERIFIED" },
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
      title: "Skema",
      dataIndex: "skema",
      key: "skema",
      render: (text) => (
        <Tag color="blue" className="text-xs">
          {text || "-"}
        </Tag>
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
      sorter: (a, b) => {
        if (!a.tanggalDaftar) return 1;
        if (!b.tanggalDaftar) return -1;
        return new Date(a.tanggalDaftar) - new Date(b.tanggalDaftar);
      },
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
          <span className="text-gray-400 text-xs">Belum disubmit</span>
        ),
    },
    createStatusColumn(),
    createActionColumn([
      {
        key: "detail",
        label: "Detail",
        icon: <EyeOutlined />,
        type: "default",
        onClick: handleDetail,
        hidden: (record) => record.status === "DRAFT",
      },
      {
        key: "complete",
        label: "Lengkapi",
        icon: <FormOutlined />,
        type: "primary",
        hidden: (record) => record.status !== "DRAFT",
        onClick: handleCompleteDraft,
      },
    ]),
  ];

  const customFilters = (
    <div className="flex gap-4">
      <Select
        placeholder="Filter Status"
        style={{ width: 180 }}
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
              if (!item.tanggalDaftar) return false;
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

  const totalApplications = applications.length;
  const validatedCount = applications.filter(
    (item) => item.status === "VALIDATED"
  ).length;
  const inProgressCount = applications.filter(
    (item) => !["VALIDATED", "REJECTED", "DRAFT"].includes(item.status)
  ).length;
  const draftCount = applications.filter(
    (item) => item.status === "DRAFT"
  ).length;

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
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <GuestLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Riwayat Pendaftaran Beasiswa
              </h1>
              <p className="text-gray-600">
                Data lengkap pendaftaran beasiswa yang pernah Anda lakukan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="text-center bg-white">
                <div className="p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {totalApplications}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Total Pendaftaran
                  </div>
                </div>
              </Card>

              <Card className="text-center bg-white">
                <div className="p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {validatedCount}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Divalidasi
                  </div>
                </div>
              </Card>

              <Card className="text-center bg-white">
                <div className="p-4">
                  <div className="text-2xl font-bold text-blue-500 mb-1">
                    {inProgressCount}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Dalam Proses
                  </div>
                </div>
              </Card>

              <Card className="text-center bg-white">
                <div className="p-4">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {draftCount}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Draft Belum Selesai
                  </div>
                </div>
              </Card>
            </div>

            {draftCount > 0 && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <FormOutlined className="text-orange-600 mr-2 text-lg" />
                  <div>
                    <h4 className="font-semibold text-orange-800">
                      Anda memiliki {draftCount} pendaftaran yang belum selesai
                    </h4>
                    <p className="text-orange-700 text-sm">
                      Klik tombol "Lengkapi" pada tabel di bawah untuk
                      melanjutkan pendaftaran yang tersimpan sebagai draft.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm">
              <UniversalTable
                title="Riwayat Pendaftaran Beasiswa"
                data={filteredData}
                columns={columns}
                searchFields={["beasiswa", "penyelenggara", "skema"]}
                searchPlaceholder="Cari nama beasiswa, skema, atau penyelenggara..."
                customFilters={customFilters}
                pageSize={10}
                scroll={{ x: 1400 }}
                loading={loading}
              />
              <ApplicationDetailModal
                visible={detailModalVisible}
                onClose={handleCloseDetailModal}
                applicationDetail={selectedApplication}
                loading={detailLoading}
                role={role}
              />
            </div>
          </div>
        </div>
      </GuestLayout>
    </>
  );
};

export default HistoryWithVerification;
