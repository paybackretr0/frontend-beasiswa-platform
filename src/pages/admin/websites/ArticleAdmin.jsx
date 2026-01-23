import { useEffect, useState } from "react";
import { Tag, Image, Upload, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SendOutlined,
  InboxOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import UniversalTable, { createActionColumn } from "../../../components/Table";
import UniversalModal from "../../../components/Modal";
import {
  addInformation,
  editInformation,
  deleteInformation,
  publishInformation,
  archiveInformation,
  getAllArticles,
} from "../../../services/websiteService";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";

const ArticleAdmin = () => {
  const [articleData, setArticleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [editingArticle, setEditingArticle] = useState(null);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const { alerts, success, error, removeAlert, warning } = useAlert();

  useEffect(() => {
    document.title = "Kelola Artikel - Admin";
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const data = await getAllArticles();
      setArticleData(data);
    } catch (err) {
      console.error("Error fetching articles:", err);
      error("Gagal!", err.message || "Gagal mengambil data artikel");
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = async (values) => {
    setModalLoading(true);
    try {
      if (!values.title || !values.content) {
        warning("Peringatan!", "Judul dan konten wajib diisi");
        setModalLoading(false);
        return;
      }

      if (!uploadedFile && !editingArticle?.cover_url) {
        warning("Peringatan!", "Gambar wajib diupload");
        setModalLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title || "");
      formData.append("content", values.content || "");
      formData.append("status", values.status || "DRAFT");

      const meta = {
        category: values.category || "",
        tags: values.tags
          ? values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
      };
      formData.append("meta", JSON.stringify(meta));

      if (uploadedFile) {
        formData.append("file", uploadedFile);
      }

      if (!editingArticle) {
        formData.append("type", "ARTICLE");
      }

      if (editingArticle) {
        await editInformation(editingArticle.id, formData);
        success("Berhasil!", "Artikel berhasil diperbarui");
      } else {
        await addInformation(formData);
        success("Berhasil!", "Artikel berhasil ditambahkan");
      }

      setModalVisible(false);
      resetForm();
      setEditingArticle(null);
      fetchArticle();
    } catch (err) {
      console.error("Error saving article:", err);
      error("Gagal!", err.message || "Gagal menyimpan artikel");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setModalVisible(true);
  };

  const showDeleteConfirm = (record) => {
    setConfirmAction({
      type: "delete",
      record: record,
      title: "Hapus Artikel",
      content: `Apakah Anda yakin ingin menghapus artikel "${record.title}"? Tindakan ini tidak dapat dibatalkan.`,
      okText: "Hapus",
      okType: "danger",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
    });
    setConfirmModalVisible(true);
  };

  const showPublishConfirm = (record) => {
    setConfirmAction({
      type: "publish",
      record: record,
      title: "Publikasikan Artikel",
      content: `Apakah Anda yakin ingin mempublikasikan artikel "${record.title}"? Artikel akan terlihat oleh publik.`,
      okText: "Publikasikan",
      okType: "primary",
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    });
    setConfirmModalVisible(true);
  };

  const showArchiveConfirm = (record) => {
    setConfirmAction({
      type: "archive",
      record: record,
      title: "Arsipkan Artikel",
      content: `Apakah Anda yakin ingin mengarsipkan artikel "${record.title}"? Artikel tidak akan terlihat oleh publik.`,
      okText: "Arsipkan",
      okType: "default",
      icon: <InboxOutlined style={{ color: "#faad14" }} />,
    });
    setConfirmModalVisible(true);
  };

  const handleConfirmOk = async () => {
    if (!confirmAction) return;

    try {
      setConfirmLoading(true);

      switch (confirmAction.type) {
        case "delete":
          await deleteInformation(confirmAction.record.id);
          success("Berhasil!", "Artikel berhasil dihapus");
          break;

        case "publish":
          await publishInformation(confirmAction.record.id);
          success("Berhasil!", "Artikel berhasil dipublikasikan");
          break;

        case "archive":
          await archiveInformation(confirmAction.record.id);
          success("Berhasil!", "Artikel berhasil diarsipkan");
          break;

        default:
          break;
      }

      setConfirmModalVisible(false);
      setConfirmAction(null);
      fetchArticle();
    } catch (err) {
      console.error(`Error ${confirmAction.type}ing article:`, err);
      error("Gagal!", err.message || `Gagal ${confirmAction.type} artikel`);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleConfirmCancel = () => {
    setConfirmModalVisible(false);
    setConfirmAction(null);
  };

  const resetForm = () => {
    setUploadedFile(null);
    setPreviewImage("");
  };

  const handleImageUpload = (info) => {
    const { file } = info;

    if (file.status === "removed") {
      setUploadedFile(null);
      setPreviewImage("");
      return;
    }

    setUploadedFile(file.originFileObj || file);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file.originFileObj || file);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      warning("Peringatan!", "Hanya file JPG/PNG yang diperbolehkan!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      warning("Peringatan!", "Ukuran gambar harus kurang dari 5MB!");
      return false;
    }

    return false;
  };

  const articleColumns = [
    {
      title: "Judul",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: "25%",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      width: "30%",
      render: (content) => (
        <span>
          {content && content.length > 100
            ? `${content.substring(0, 100)}...`
            : content}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status) => {
        const color =
          status === "PUBLISHED"
            ? "green"
            : status === "DRAFT"
              ? "orange"
              : "red";
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: "Draft", value: "DRAFT" },
        { text: "Published", value: "PUBLISHED" },
        { text: "Archived", value: "ARCHIVED" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Published At",
      dataIndex: "published_at",
      key: "published_at",
      width: "15%",
      sorter: (a, b) =>
        new Date(a.published_at || 0) - new Date(b.published_at || 0),
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    },
    {
      title: "Cover",
      dataIndex: "cover_url",
      key: "cover_url",
      width: "20%",
      render: (url) =>
        url ? (
          <Image
            src={url}
            alt="Cover"
            width={80}
            height={50}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          "No Image"
        ),
    },
    createActionColumn([
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: (record) => handleEditArticle(record),
      },
      {
        key: "publish",
        label: "Publish",
        icon: <SendOutlined />,
        onClick: (record) => showPublishConfirm(record),
        hidden: (record) => record.status === "PUBLISHED",
      },
      {
        key: "archive",
        label: "Archive",
        icon: <InboxOutlined />,
        onClick: (record) => showArchiveConfirm(record),
        hidden: (record) =>
          !record.published_at || record.status === "ARCHIVED",
      },
      {
        key: "delete",
        label: "Hapus",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: (record) => showDeleteConfirm(record),
      },
    ]),
  ];

  return (
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <UniversalTable
        title="Kelola Artikel"
        data={articleData}
        columns={articleColumns}
        loading={loading}
        searchFields={["title", "content"]}
        searchPlaceholder="Cari judul atau konten artikel..."
        pageSize={10}
        addButtonText="Tambah Artikel"
        onAdd={() => setModalVisible(true)}
      />

      <UniversalModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          resetForm();
          setEditingArticle(null);
        }}
        onSubmit={handleAddArticle}
        title={editingArticle ? "Edit Artikel" : "Tambah Artikel"}
        loading={modalLoading}
        initialValues={
          editingArticle
            ? {
                title: editingArticle.title,
                content: editingArticle.content,
                status: editingArticle.status,
                category: editingArticle.meta?.category,
                tags: editingArticle.meta?.tags?.join(", "),
              }
            : {}
        }
        fields={[
          {
            name: "title",
            label: "Judul Artikel",
            rules: [
              { required: true, message: "Judul wajib diisi" },
              { max: 200, message: "Judul maksimal 200 karakter" },
            ],
            maxLength: 200,
          },
          {
            name: "content",
            label: "Konten Artikel",
            type: "textarea",
            rows: 6,
            maxLength: 5000,
            rules: [
              { required: true, message: "Konten wajib diisi" },
              { min: 50, message: "Konten minimal 50 karakter" },
            ],
            extra: "Tulis konten artikel dengan lengkap dan jelas",
          },
          {
            name: "cover_image",
            label: "Gambar Cover",
            rules: editingArticle
              ? []
              : [{ required: true, message: "Gambar cover wajib diupload" }],
            render: (
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleImageUpload}
                accept="image/*"
              >
                {previewImage || editingArticle?.cover_url ? (
                  <img
                    src={previewImage || editingArticle.cover_url}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload Gambar</div>
                  </div>
                )}
              </Upload>
            ),
            extra: "Format: JPG, PNG. Maksimal 5MB",
          },
          {
            name: "status",
            label: "Status Publikasi",
            type: "select",
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Archived", value: "ARCHIVED" },
            ],
            rules: [{ required: true, message: "Status wajib dipilih" }],
          },
          {
            name: "category",
            label: "Kategori",
            rules: [{ required: true, message: "Kategori wajib diisi" }],
            placeholder: "Contoh: Beasiswa, Akademik, Kemahasiswaan",
          },
          {
            name: "tags",
            label: "Tags",
            placeholder: "beasiswa, pendidikan, mahasiswa",
            extra: "Pisahkan dengan koma untuk multiple tags",
          },
        ]}
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
        <p className="text-gray-700">{confirmAction?.content}</p>
      </Modal>
    </>
  );
};

export default ArticleAdmin;
