import { useEffect, useState } from "react";
import { message, Tag, Image, Upload } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SendOutlined,
  InboxOutlined,
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

const NewsAdmin = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [editingNews, setEditingNews] = useState(null);

  useEffect(() => {
    document.title = "Kelola Berita - Admin";
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getAllNews();
      setNewsData(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      message.error(error.message || "Gagal mengambil data berita");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async (values) => {
    setModalLoading(true);
    try {
      if (!values.title || !values.content) {
        message.error("Judul dan konten wajib diisi");
        setModalLoading(false);
        return;
      }

      if (!uploadedFile && !editingNews?.cover_url) {
        message.error("Gambar wajib diupload");
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
        message.success("Berita berhasil diperbarui");
      } else {
        await addInformation(formData);
        message.success("Berita berhasil ditambahkan");
      }

      setModalVisible(false);
      resetForm();
      setEditingNews(null);
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      message.error(error.message || "Gagal menyimpan berita");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditNews = (news) => {
    setEditingNews(news);
    setModalVisible(true);
  };

  const handleDeleteNews = async (id) => {
    setLoading(true);
    try {
      await deleteInformation(id);
      message.success("Berita berhasil dihapus");
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      message.error(error.message || "Gagal menghapus berita");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNews = async (id) => {
    setLoading(true);
    try {
      await publishInformation(id);
      message.success("Berita berhasil dipublikasikan");
      fetchNews();
    } catch (error) {
      console.error("Error publishing news:", error);
      message.error(error.message || "Gagal mempublikasikan berita");
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveNews = async (id) => {
    setLoading(true);
    try {
      await archiveInformation(id);
      message.success("Berita berhasil diarsipkan");
      fetchNews();
    } catch (error) {
      console.error("Error archiving news:", error);
      message.error(error.message || "Gagal mengarsipkan berita");
    } finally {
      setLoading(false);
    }
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
      message.error("Hanya file JPG/PNG yang diperbolehkan!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ukuran gambar harus kurang dari 5MB!");
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
        onClick: (record) => handlePublishNews(record.id),
        className: (record) => (record.status === "PUBLISHED" ? "hidden" : ""),
      },
      {
        key: "archive",
        label: "Archive",
        icon: <InboxOutlined />,
        onClick: (record) => handleArchiveNews(record.id),
        className: (record) =>
          !record.published_at || record.status === "ARCHIVED" ? "hidden" : "",
      },
      {
        key: "delete",
        label: "Hapus",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: (record) => handleDeleteNews(record.id),
      },
    ]),
  ];

  return (
    <>
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
          setEditingNews(null); // Reset data edit
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
    </>
  );
};

export default NewsAdmin;
