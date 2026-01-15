import { useEffect, useState } from "react";
import { Tag, Select, Switch, Modal, Button } from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import UniversalTable, {
  createNumberColumn,
  createActionColumn,
} from "../../../components/Table";
import UniversalModal from "../../../components/Modal";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";
import {
  getAllCommentTemplates,
  createCommentTemplate,
  updateCommentTemplate,
  activateCommentTemplate,
  deactivateCommentTemplate,
} from "../../../services/extraService";

const { Option } = Select;

const TemplateCommentAdmin = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [filters, setFilters] = useState({
    type: "Semua",
    status: "Semua",
  });

  const { alerts, success, error, removeAlert } = useAlert();

  useEffect(() => {
    document.title = "Template Komentar - Admin";
    fetchTemplates();
  }, [filters]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = {
        type: filters.type !== "Semua" ? filters.type : undefined,
        status: filters.status !== "Semua" ? filters.status : undefined,
      };
      const data = await getAllCommentTemplates(params);

      const transformedData = data.templates.map((item, index) => ({
        key: item.id || index,
        id: item.id,
        template_name: item.template_name,
        comment_text: item.comment_text,
        template_type: item.template_type,
        is_active: item.is_active,
        creator: item.creator?.full_name || "System",
        createdAt: item.createdAt,
      }));

      setTemplates(transformedData);
    } catch (err) {
      error("Gagal!", err.message || "Gagal memuat template komentar");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingTemplate(record);
    setModalVisible(true);
  };

  const handleToggleStatus = (record) => {
    const actionText = record.is_active ? "nonaktifkan" : "aktifkan";
    const actionTextCapital = record.is_active ? "Nonaktifkan" : "Aktifkan";

    setConfirmAction({
      type: record.is_active ? "deactivate" : "activate",
      record: record,
      title: `${actionTextCapital} Template`,
      content: `Apakah Anda yakin ingin ${actionText} template "${record.template_name}"?`,
      okText: actionTextCapital,
      okType: record.is_active ? "danger" : "primary",
      icon: record.is_active ? (
        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "#52c41a" }} />
      ),
    });

    setConfirmModalVisible(true);
  };

  const handleConfirmOk = async () => {
    if (!confirmAction) return;

    try {
      setConfirmLoading(true);

      if (confirmAction.type === "deactivate") {
        await deactivateCommentTemplate(confirmAction.record.id);
        success("Berhasil!", "Template berhasil dinonaktifkan");
      } else {
        await activateCommentTemplate(confirmAction.record.id);
        success("Berhasil!", "Template berhasil diaktifkan");
      }

      setConfirmModalVisible(false);
      setConfirmAction(null);
      fetchTemplates();
    } catch (err) {
      error(
        "Gagal!",
        err.message ||
          `Gagal ${
            confirmAction.type === "deactivate"
              ? "menonaktifkan"
              : "mengaktifkan"
          } template`
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleConfirmCancel = () => {
    setConfirmModalVisible(false);
    setConfirmAction(null);
  };

  const handleSubmit = async (values) => {
    try {
      setModalLoading(true);

      if (editingTemplate) {
        await updateCommentTemplate(editingTemplate.id, values);
        success("Berhasil!", "Template berhasil diperbarui");
      } else {
        await createCommentTemplate(values);
        success("Berhasil!", "Template berhasil dibuat");
      }

      setModalVisible(false);
      fetchTemplates();
    } catch (err) {
      error("Gagal!", err.message || "Gagal menyimpan template");
    } finally {
      setModalLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      REJECTION: "Penolakan",
      REVISION: "Revisi",
      GENERAL: "Umum",
    };
    return typeMap[type] || type;
  };

  const getTypeColor = (type) => {
    const colorMap = {
      REJECTION: "red",
      REVISION: "orange",
      GENERAL: "blue",
    };
    return colorMap[type] || "default";
  };

  const columns = [
    createNumberColumn(),
    {
      title: "Nama Template",
      dataIndex: "template_name",
      key: "template_name",
      sorter: (a, b) => a.template_name.localeCompare(b.template_name),
    },
    {
      title: "Isi Komentar",
      dataIndex: "comment_text",
      key: "comment_text",
      render: (text) => <div className="max-w-md truncate">{text}</div>,
    },
    {
      title: "Tipe",
      dataIndex: "template_type",
      key: "template_type",
      render: (type) => (
        <Tag color={getTypeColor(type)}>{getTypeLabel(type)}</Tag>
      ),
      filters: [
        { text: "Penolakan", value: "REJECTION" },
        { text: "Revisi", value: "REVISION" },
        { text: "Umum", value: "GENERAL" },
      ],
      onFilter: (value, record) => record.template_type === value,
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active, record) => (
        <div className="flex items-center gap-2">
          <Tag color={is_active ? "green" : "default"}>
            {is_active ? "Aktif" : "Nonaktif"}
          </Tag>
          <Switch
            checked={is_active}
            onChange={() => handleToggleStatus(record)}
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren={<CloseCircleOutlined />}
            size="small"
          />
        </div>
      ),
      filters: [
        { text: "Aktif", value: true },
        { text: "Nonaktif", value: false },
      ],
      onFilter: (value, record) => record.is_active === value,
    },
    {
      title: "Pembuat",
      dataIndex: "creator",
      key: "creator",
    },
    {
      title: "Tanggal Dibuat",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        new Date(date).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    createActionColumn([
      {
        key: "edit",
        icon: <EditOutlined />,
        onClick: handleEdit,
      },
    ]),
  ];

  const modalFields = [
    {
      name: "template_name",
      label: "Nama Template",
      type: "text",
      placeholder: "Contoh: Template Penolakan IPK",
      rules: [
        { required: true, message: "Nama template harus diisi" },
        { min: 3, message: "Nama template minimal 3 karakter" },
        { max: 191, message: "Nama template maksimal 191 karakter" },
      ],
    },
    {
      name: "comment_text",
      label: "Isi Komentar",
      type: "textarea",
      placeholder: "Tulis isi komentar yang akan digunakan...",
      rows: 6,
      rules: [
        { required: true, message: "Isi komentar harus diisi" },
        { min: 10, message: "Isi komentar minimal 10 karakter" },
      ],
    },
    {
      name: "template_type",
      label: "Tipe Template",
      type: "select",
      placeholder: "Pilih tipe template",
      options: [
        { value: "REJECTION", label: "Penolakan" },
        { value: "REVISION", label: "Revisi" },
        { value: "GENERAL", label: "Umum" },
      ],
      rules: [{ required: true, message: "Tipe template harus dipilih" }],
    },
    {
      name: "is_active",
      label: "Status",
      type: "select",
      placeholder: "Pilih status",
      options: [
        { value: true, label: "Aktif" },
        { value: false, label: "Nonaktif" },
      ],
      rules: [{ required: true, message: "Status harus dipilih" }],
    },
  ];

  return (
    <div className="space-y-6">
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircleOutlined className="text-blue-500 text-lg mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Informasi Status Template
            </h4>
            <p className="text-sm text-blue-700">
              Template dengan status <strong>Aktif</strong> akan muncul di
              dropdown saat verifikator/validator membuat komentar penolakan
              atau revisi. Gunakan toggle untuk mengaktifkan/menonaktifkan
              template.
            </p>
          </div>
        </div>
      </div>

      <UniversalTable
        title="Kelola Template Komentar"
        data={templates}
        columns={columns}
        searchFields={["template_name", "comment_text"]}
        searchPlaceholder="Cari nama template atau isi komentar..."
        addButtonText="Tambah Template"
        onAdd={handleAdd}
        loading={loading}
        customFilters={
          <>
            <Select
              value={filters.type}
              onChange={(value) => handleFilterChange("type", value)}
              placeholder="Semua Tipe"
              style={{ width: 150 }}
            >
              <Option value="Semua">Semua Tipe</Option>
              <Option value="REJECTION">Penolakan</Option>
              <Option value="REVISION">Revisi</Option>
              <Option value="GENERAL">Umum</Option>
            </Select>

            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              placeholder="Semua Status"
              style={{ width: 130 }}
            >
              <Option value="Semua">Semua Status</Option>
              <Option value="Aktif">Aktif</Option>
              <Option value="Nonaktif">Nonaktif</Option>
            </Select>
          </>
        }
      />

      <UniversalModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        title={editingTemplate ? "Edit Template" : "Tambah Template Baru"}
        fields={modalFields}
        loading={modalLoading}
        initialValues={
          editingTemplate
            ? {
                template_name: editingTemplate.template_name,
                comment_text: editingTemplate.comment_text,
                template_type: editingTemplate.template_type,
                is_active: editingTemplate.is_active,
              }
            : { is_active: true }
        }
      />

      <Modal
        title={
          <div className="flex items-center gap-2">
            {confirmAction?.icon}
            <span>{confirmAction?.title}</span>
          </div>
        }
        open={confirmModalVisible}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        confirmLoading={confirmLoading}
        okText={confirmAction?.okText || "OK"}
        cancelText="Batal"
        okButtonProps={{
          danger: confirmAction?.okType === "danger",
          loading: confirmLoading,
        }}
      >
        <p>{confirmAction?.content}</p>
      </Modal>
    </div>
  );
};

export default TemplateCommentAdmin;
