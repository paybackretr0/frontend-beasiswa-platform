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
  getAllNews,
  addInformation,
  editInformation,
  deleteInformation,
  publishInformation,
  archiveInformation,
} from "../../../services/websiteService";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";

const NewsAdmin = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [editingNews, setEditingNews] = useState(null);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const { alerts, success, error, removeAlert, warning } = useAlert();

  useEffect(() => {
    document.title = "Kelola Berita - Admin";
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getAllNews();
      setNewsData(data);
    } catch (err) {
      console.error("Error fetching news:", err);
      error("Gagal!", err.message || "Gagal mengambil data berita");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async (values) => {
    setModalLoading(true);
    try {
      if (!values.title || !values.content) {
        warning("Error!", "Judul dan konten wajib diisi");
        setModalLoading(false);
        return;
      }

      if (!uploadedFile && !editingNews?.cover_url) {
        warning("Error!", "Gambar wajib diupload");
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

      if (!editingNews) {
        formData.append("type", "NEWS");
      }

      if (editingNews) {
        await editInformation(editingNews.id, formData);
        success("Berhasil!", "Berita berhasil diperbarui");
      } else {
        await addInformation(formData);
        success("Berhasil!", "Berita berhasil ditambahkan");
      }

      setModalVisible(false);
      resetForm();
      setEditingNews(null);
      fetchNews();
    } catch (err) {
      console.error("Error saving news:", err);
      error("Gagal!", err.message || "Gagal menyimpan berita");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditNews = (news) => {
    setEditingNews(news);
    setModalVisible(true);
  };

  const showDeleteConfirm = (record) => {
    setConfirmAction({
      type: "delete",
      record: record,
      title: "Hapus Berita",
      content: `Apakah Anda yakin ingin menghapus berita "${record.title}"? Tindakan ini tidak dapat dibatalkan.`,
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
      title: "Publikasikan Berita",
      content: `Apakah Anda yakin ingin mempublikasikan berita "${record.title}"? Berita akan terlihat oleh publik.`,
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
      title: "Arsipkan Berita",
      content: `Apakah Anda yakin ingin mengarsipkan berita "${record.title}"? Berita tidak akan terlihat oleh publik.`,
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
          success("Berhasil!", "Berita berhasil dihapus");
          break;

        case "publish":
          await publishInformation(confirmAction.record.id);
          success("Berhasil!", "Berita berhasil dipublikasikan");
          break;

        case "archive":
          await archiveInformation(confirmAction.record.id);
          success("Berhasil!", "Berita berhasil diarsipkan");
          break;

        default:
          break;
      }

      setConfirmModalVisible(false);
      setConfirmAction(null);
      fetchNews();
    } catch (err) {
      console.error(`Error ${confirmAction.type}ing news:`, err);
      error("Gagal!", err.message || `Gagal ${confirmAction.type} berita`);
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

  const newsColumns = [
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
        onClick: (record) => handleEditNews(record),
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
        title="Kelola Berita"
        data={newsData}
        columns={newsColumns}
        loading={loading}
        searchFields={["title", "content"]}
        searchPlaceholder="Cari judul atau konten berita..."
        pageSize={10}
        addButtonText="Tambah Berita"
        onAdd={() => setModalVisible(true)}
      />

      <UniversalModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          resetForm();
          setEditingNews(null);
        }}
        onSubmit={handleAddNews}
        title={editingNews ? "Edit Berita" : "Tambah Berita"}
        loading={modalLoading}
        initialValues={
          editingNews
            ? {
                title: editingNews.title,
                content: editingNews.content,
                status: editingNews.status,
                category: editingNews.meta?.category,
                tags: editingNews.meta?.tags?.join(", "),
              }
            : {}
        }
        fields={[
          {
            name: "title",
            label: "Judul Berita",
            rules: [
              { required: true, message: "Judul wajib diisi" },
              { max: 200, message: "Judul maksimal 200 karakter" },
            ],
            maxLength: 200,
          },
          {
            name: "content",
            label: "Konten Berita",
            type: "textarea",
            rows: 6,
            maxLength: 5000,
            rules: [
              { required: true, message: "Konten wajib diisi" },
              { min: 50, message: "Konten minimal 50 karakter" },
            ],
            extra: "Tulis konten berita dengan lengkap dan jelas",
          },
          {
            name: "cover_image",
            label: "Gambar Cover",
            rules: editingNews
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
                {previewImage || editingNews?.cover_url ? (
                  <img
                    src={previewImage || editingNews.cover_url}
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

export default NewsAdmin;
