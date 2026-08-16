import React, { useEffect, useState } from "react";
import { Select, DatePicker, Tag } from "antd";
import { EyeOutlined, FormOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UniversalTable, {
  createNumberColumn,
  createActionColumn,
} from "../../components/Table";
import GuestLayout from "../../layouts/GuestLayout";
import { getUserApplications } from "../../services/historyService";
import ApplicationDetailModal from "../../components/ApplicationDetailModal";
import { getApplicationDetailUser } from "../../services/applicationService";

import useAlert from "../../hooks/useAlert";
import RequireEmailVerification from "../../components/RequireEmailVerification";
import {
  formatToWIB,
  isDeadlinePassed as checkDeadlinePassed,
} from "../../utils/timezone";
import { SkeletonHistory } from "../../components/common/skeleton";
import CelebrationOverlay from "../../components/CelebrationOverlay";

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

  const [showCelebration, setShowCelebration] = useState(false);
  const [newAwardees, setNewAwardees] = useState([]);

  const { success, error } = useAlert();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }
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

      const awardeeApps = (data || []).filter(
        (item) => item.status === "AWARDEE",
      );
      if (awardeeApps.length > 0) {
        const seenIds = JSON.parse(
          localStorage.getItem("seen_awardees") || "[]",
        );
        const unseenIds = awardeeApps.filter((a) => !seenIds.includes(a.id));

        if (unseenIds.length > 0) {
          const updated = [...seenIds, ...unseenIds.map((a) => a.id)];
          localStorage.setItem("seen_awardees", JSON.stringify(updated));
          setNewAwardees(unseenIds);
          setShowCelebration(true);
        }
      }
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

  const isRevisionDeadlinePassed = (deadline) => {
    return checkDeadlinePassed(deadline);
  };

  const handleCompleteDraft = (record) => {
    success(
      "Mengalihkan...",
      `Mengarahkan ke form pendaftaran ${record.beasiswa}`,
    );

    setTimeout(() => {
      navigate(
        `/scholarship/${record.scholarship_id}/apply?schema=${record.schema_id}`,
      );
    }, 1000);
  };

  const columns = [
    createNumberColumn(),
    {
      title: "Nama Beasiswa",
      dataIndex: "beasiswa",
      key: "beasiswa",
      sorter: (a, b) => a.beasiswa?.localeCompare(b.beasiswa) || 0,
      render: (text) => (
        <div className="font-medium text-slate-900">{text || "-"}</div>
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
        <div className="text-slate-600 text-sm">{text || "-"}</div>
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
          <div className="text-slate-600 text-sm">
            {new Date(date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        ) : (
          <span className="text-slate-400 text-xs">Belum disubmit</span>
        ),
    },
    {
      title: "Batas Daftar",
      dataIndex: "deadline_pendaftaran",
      key: "deadline_pendaftaran",
      sorter: (a, b) => {
        if (!a.deadline_pendaftaran) return 1;
        if (!b.deadline_pendaftaran) return -1;
        return (
          new Date(a.deadline_pendaftaran) - new Date(b.deadline_pendaftaran)
        );
      },
      render: (date) => {
        if (!date) return <span className="text-slate-400 text-xs">-</span>;
        const deadlinePassed = new Date(date) < new Date();
        return (
          <div
            className={`flex items-center gap-2 text-sm ${
              deadlinePassed ? "text-red-600" : "text-orange-600"
            }`}
          >
            <span>
              {new Date(date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>

            {deadlinePassed && (
              <Tag color="red" className="text-xs m-0">
                Tutup
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const statusConfig = {
          VALIDATED: { color: "green", text: "Divalidasi" },
          REJECTED: { color: "red", text: "Ditolak" },
          MENUNGGU_VERIFIKASI: { color: "blue", text: "Menunggu Verifikasi" },
          VERIFIED: {
            color: "cyan",
            text: "Terverifikasi - Menunggu Validasi",
          },
          DRAFT: { color: "orange", text: "Draft" },
          AWARDEE: { color: "purple", text: "Penerima Beasiswa" },
          REVISION_NEEDED: { color: "purple", text: "Perlu Revisi" },
        };

        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };

        return (
          <div>
            <Tag color={config.color}>{config.text}</Tag>
            {status === "REVISION_NEEDED" && record.revision_deadline && (
              <div className="mt-1">
                <div
                  className={`text-xs font-medium ${
                    isRevisionDeadlinePassed(record.revision_deadline)
                      ? "text-red-600"
                      : "text-orange-600"
                  }`}
                >
                  Deadline:{" "}
                  {formatToWIB(record.revision_deadline, "DD MMM YYYY, HH:mm")}{" "}
                  WIB
                </div>
                {isRevisionDeadlinePassed(record.revision_deadline) && (
                  <Tag color="red" className="text-xs mt-1">
                    Deadline Sudah Lewat
                  </Tag>
                )}
              </div>
            )}
          </div>
        );
      },
      filters: [
        { text: "Divalidasi", value: "VALIDATED" },
        { text: "Ditolak", value: "REJECTED" },
        { text: "Menunggu Verifikasi", value: "MENUNGGU_VERIFIKASI" },
        { text: "Terverifikasi - Menunggu Validasi", value: "VERIFIED" },
        { text: "Draft", value: "DRAFT" },
        { text: "Perlu Revisi", value: "REVISION_NEEDED" },
        { text: "Penerima Beasiswa", value: "AWARDEE" },
      ],
      onFilter: (value, record) => record.status === value,
    },
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
      {
        key: "revision",
        label: "Revisi",
        icon: <FormOutlined />,
        type: "default",
        danger: true,
        hidden: (record) =>
          record.status !== "REVISION_NEEDED" ||
          isRevisionDeadlinePassed(record.revision_deadline),
        onClick: (record) =>
          navigate(
            `/scholarship/${record.scholarship_id}/apply?revision=${record.id}&schema=${record.schema_id}`,
          ),
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
              (item) => item.status === value,
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
        <Option value="REVISION_NEEDED">Perlu Revisi</Option>
        <Option value="AWARDEE">Penerima Beasiswa</Option>
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
  const awardeeCount = applications.filter(
    (item) => item.status === "AWARDEE",
  ).length;
  const validatedCount = applications.filter(
    (item) => item.status === "VALIDATED",
  ).length;
  const inProgressCount = applications.filter(
    (item) =>
      !["VALIDATED", "AWARDEE", "REJECTED", "DRAFT"].includes(item.status),
  ).length;
  const draftCount = applications.filter(
    (item) => item.status === "DRAFT",
  ).length;

  const statCards = [
    { label: "Total Pendaftaran", value: totalApplications },
    { label: "Diterima", value: awardeeCount },
    { label: "Divalidasi", value: validatedCount },
    { label: "Dalam Proses", value: inProgressCount },
    { label: "Draft", value: draftCount },
  ];

  return (
    <>
      <GuestLayout>
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Riwayat Pendaftaran Beasiswa
              </h1>
              <p className="text-slate-600">
                Data lengkap pendaftaran beasiswa yang pernah Anda lakukan
              </p>
            </div>

            {loading ? (
              <SkeletonHistory />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  {statCards.map((card) => (
                    <div
                      key={card.label}
                      className="bg-white border border-slate-200 rounded-lg p-4 text-center"
                    >
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {card.value}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {card.label}
                      </div>
                    </div>
                  ))}
                </div>

                {draftCount > 0 && (
                  <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center">
                      <FormOutlined className="text-amber-600 mr-2 text-lg" />
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          Anda memiliki {draftCount} pendaftaran yang belum
                          selesai
                        </h4>
                        <p className="text-slate-600 text-sm">
                          Klik tombol "Lengkapi" pada tabel di bawah untuk
                          melanjutkan pendaftaran yang tersimpan sebagai draft.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg border border-slate-200">
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

                {showCelebration && newAwardees.length > 0 && (
                  <CelebrationOverlay
                    awardees={newAwardees}
                    onDismiss={() => setShowCelebration(false)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </GuestLayout>
    </>
  );
};

export default HistoryWithVerification;
