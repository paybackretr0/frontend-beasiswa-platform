import { Modal, Tabs, Descriptions, Tag, Button, Space, Timeline } from "antd";
import {
  FileOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const ApplicationDetailModal = ({
  visible,
  onClose,
  applicationDetail,
  loading,
  onVerify,
  onReject,
  role,
}) => {
  if (!applicationDetail) return null;

  const getStatusColor = (status) => {
    const colorMap = {
      MENUNGGU_VERIFIKASI: "orange",
      VERIFIED: "blue",
      VALIDATED: "green",
      REJECTED: "red",
    };
    return colorMap[status] || "default";
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
      VERIFIED: "Terverifikasi - Menunggu Validasi",
      VALIDATED: "Disetujui",
      REJECTED: "Dikembalikan",
    };
    return statusMap[status] || status;
  };

  const renderProcessHistory = () => {
    const history = [];

    const dateTimeOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    };

    if (applicationDetail.submitted_at) {
      history.push({
        color: "blue",
        dot: <ClockCircleOutlined />,
        children: (
          <div>
            <div className="font-medium">Pendaftaran Disubmit</div>
            <div className="text-sm text-gray-600">
              oleh: {applicationDetail.student.nama}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(applicationDetail.submitted_at).toLocaleDateString(
                "id-ID",
                dateTimeOptions
              )}
            </div>
          </div>
        ),
      });
    }

    if (applicationDetail.verified_at && applicationDetail.verificator) {
      history.push({
        color: "green",
        dot: <CheckCircleOutlined />,
        children: (
          <div>
            <div className="font-medium">Diverifikasi</div>
            <div className="text-sm text-gray-600">
              oleh: {applicationDetail.verificator.full_name}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(applicationDetail.verified_at).toLocaleDateString(
                "id-ID",
                dateTimeOptions
              )}
            </div>
          </div>
        ),
      });
    }

    if (applicationDetail.validated_at && applicationDetail.validator) {
      history.push({
        color: "green",
        dot: <CheckCircleOutlined />,
        children: (
          <div>
            <div className="font-medium">Divalidasi & Disetujui</div>
            <div className="text-sm text-gray-600">
              oleh: {applicationDetail.validator.full_name}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(applicationDetail.validated_at).toLocaleDateString(
                "id-ID",
                dateTimeOptions
              )}
            </div>
          </div>
        ),
      });
    }

    if (applicationDetail.rejected_at && applicationDetail.rejector) {
      history.push({
        color: "red",
        dot: <CloseCircleOutlined />,
        children: (
          <div>
            <div className="font-medium">Ditolak</div>
            <div className="text-sm text-gray-600">
              oleh: {applicationDetail.rejector.full_name}
            </div>
            {applicationDetail.notes && (
              <div className="text-sm text-red-600 mt-1 p-2 bg-red-50 rounded">
                <strong>Alasan:</strong> {applicationDetail.notes}
              </div>
            )}
            <div className="text-xs text-gray-400">
              {new Date(applicationDetail.rejected_at).toLocaleDateString(
                "id-ID",
                dateTimeOptions
              )}
            </div>
          </div>
        ),
      });
    }

    return history.length > 0 ? (
      <Timeline mode="left" items={history} className="mt-4" />
    ) : (
      <div className="text-center py-8 text-gray-500">
        Belum ada riwayat proses
      </div>
    );
  };

  const renderActionButtons = () => {
    const buttons = [];
    const status = applicationDetail.status;

    if (!role || role === "MAHASISWA") {
      return buttons;
    }

    if (
      status === "MENUNGGU_VERIFIKASI" &&
      (role === "SUPERADMIN" || role === "VERIFIKATOR")
    ) {
      buttons.push(
        <Button key="reject" danger onClick={() => onReject(applicationDetail)}>
          Tolak
        </Button>
      );
      buttons.push(
        <Button
          key="verify"
          type="primary"
          onClick={() => onVerify(applicationDetail)}
        >
          Verifikasi
        </Button>
      );
    }

    if (status === "VERIFIED" && role === "PIMPINAN_DITMAWA") {
      buttons.push(
        <Button key="reject" danger onClick={() => onReject(applicationDetail)}>
          Tolak
        </Button>
      );
      buttons.push(
        <Button
          key="validate"
          type="primary"
          onClick={() => onVerify(applicationDetail)}
        >
          Validasi
        </Button>
      );
    }

    return buttons;
  };

  const tabItems = [
    {
      key: "1",
      label: "Informasi Pendaftar",
      children: (
        <div className="space-y-4">
          <Descriptions title="Data Pribadi" bordered column={2}>
            <Descriptions.Item label="Nama Lengkap" span={2}>
              {applicationDetail.student.nama}
            </Descriptions.Item>
            <Descriptions.Item label="NIM">
              {applicationDetail.student.nim}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {applicationDetail.student.email}
            </Descriptions.Item>
            <Descriptions.Item label="No. Telepon">
              {applicationDetail.student.phone_number}
            </Descriptions.Item>
            <Descriptions.Item label="Jenis Kelamin">
              {applicationDetail.student.gender}
            </Descriptions.Item>
            <Descriptions.Item label="Tempat Lahir">
              {applicationDetail.student.birth_place}
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Lahir">
              {applicationDetail.student.birth_date
                ? new Date(
                    applicationDetail.student.birth_date
                  ).toLocaleDateString("id-ID")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Fakultas">
              {applicationDetail.student.fakultas}
            </Descriptions.Item>
            <Descriptions.Item label="Departemen" span={2}>
              {applicationDetail.student.departemen}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="Status Pendaftaran" bordered>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(applicationDetail.status)}>
                {getStatusLabel(applicationDetail.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Daftar">
              {applicationDetail.submitted_at
                ? new Date(applicationDetail.submitted_at).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Jakarta",
                    }
                  )
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Verifikasi">
              {applicationDetail.verified_at
                ? new Date(applicationDetail.verified_at).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Jakarta",
                    }
                  )
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal Validasi">
              {applicationDetail.validated_at
                ? new Date(applicationDetail.validated_at).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Jakarta",
                    }
                  )
                : "-"}
            </Descriptions.Item>
            {applicationDetail.rejected_at && (
              <Descriptions.Item label="Tanggal Penolakan">
                {new Date(applicationDetail.rejected_at).toLocaleDateString(
                  "id-ID",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Jakarta",
                  }
                )}
              </Descriptions.Item>
            )}
            {applicationDetail.notes && (
              <Descriptions.Item label="Catatan" span={3}>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  {applicationDetail.notes}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      ),
    },
    {
      key: "2",
      label: "Riwayat Proses",
      children: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center">
              <UserOutlined className="mr-2" />
              Timeline Proses Pendaftaran
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Berikut adalah riwayat lengkap proses pendaftaran mulai dari
              pengajuan hingga keputusan akhir.
            </p>
          </div>
          {renderProcessHistory()}
        </div>
      ),
    },
    {
      key: "3",
      label: "Dokumen",
      children: (
        <div className="space-y-4">
          {!applicationDetail.documents ||
          applicationDetail.documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada dokumen yang diupload
            </div>
          ) : (
            <div className="grid gap-4">
              {applicationDetail.documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileOutlined className="text-blue-500 text-xl" />
                      <div>
                        <div className="font-medium">{doc.type}</div>
                        <div className="text-sm text-gray-500">
                          {doc.fileName}
                        </div>
                        <div className="text-xs text-gray-400">
                          Upload:{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                              timeZone: "Asia/Jakarta",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <Space>
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() =>
                          window.open(
                            `${import.meta.env.VITE_IMAGE_URL}/${doc.filePath}`,
                            "_blank"
                          )
                        }
                      >
                        Lihat
                      </Button>
                    </Space>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "4",
      label: "Beasiswa",
      children: (
        <div className="space-y-4">
          <Descriptions title="Informasi Beasiswa" bordered>
            <Descriptions.Item label="Nama Beasiswa" span={3}>
              {applicationDetail.scholarship.name}
            </Descriptions.Item>
            <Descriptions.Item label="Deskripsi" span={3}>
              {applicationDetail.scholarship.description || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Persyaratan" span={3}>
              <div
                dangerouslySetInnerHTML={{
                  __html: applicationDetail.scholarship.requirements || "-",
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Manfaat" span={3}>
              <div
                dangerouslySetInnerHTML={{
                  __html: applicationDetail.scholarship.benefits || "-",
                }}
              />
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: "5",
      label: "Formulir",
      children: (
        <div className="space-y-4">
          {applicationDetail.form_data ? (
            <div className="space-y-4">
              {Object.entries(applicationDetail.form_data).map(
                ([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <div className="font-medium text-gray-700 mb-1">
                      {key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                    <div className="text-gray-600">
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : value}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Belum ada data formulir
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={`Detail Pendaftaran - ${applicationDetail.student.nama}`}
      open={visible}
      onCancel={onClose}
      width={900}
      loading={loading}
      footer={[
        <Button key="close" onClick={onClose}>
          Tutup
        </Button>,
        ...renderActionButtons(),
      ]}
    >
      <Tabs defaultActiveKey="1" items={tabItems} />
    </Modal>
  );
};

export default ApplicationDetailModal;
