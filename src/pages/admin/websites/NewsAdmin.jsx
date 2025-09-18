import { useEffect, useState } from "react";
import { message, Select } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UniversalTable, {
  createNumberColumn,
  createStatusColumn,
  createActionColumn,
} from "../../../components/Table";

const { Option } = Select;

// Data dummy berita
const newsData = [
  {
    key: 1,
    judul: "Pembukaan Beasiswa Unggulan UNAND 2025",
    kategori: "Beasiswa",
    status: "Published",
    tanggalRilis: "2025-01-15",
  },
  {
    key: 2,
    judul: "Tips Sukses Mendaftar Beasiswa KIP Kuliah",
    kategori: "Tips",
    status: "Draft",
    tanggalRilis: "2025-01-12",
  },
  {
    key: 3,
    judul: "Pengumuman Hasil Seleksi Beasiswa Bank Indonesia",
    kategori: "Pengumuman",
    status: "Published",
    tanggalRilis: "2025-01-10",
  },
  {
    key: 4,
    judul: "Cara Mengisi Formulir Pendaftaran Beasiswa",
    kategori: "Panduan",
    status: "Published",
    tanggalRilis: "2025-01-08",
  },
  {
    key: 5,
    judul: "Event Sosialisasi Beasiswa Djarum Foundation",
    kategori: "Event",
    status: "Scheduled",
    tanggalRilis: "2025-01-20",
  },
  {
    key: 6,
    judul: "Syarat dan Ketentuan Beasiswa Tanoto Foundation",
    kategori: "Beasiswa",
    status: "Published",
    tanggalRilis: "2025-01-05",
  },
];

// Filter options
const categoryOptions = [
  "Semua",
  "Beasiswa",
  "Tips",
  "Pengumuman",
  "Panduan",
  "Event",
];

const NewsAdmin = () => {
  const [filteredNews, setFilteredNews] = useState(newsData);
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  useEffect(() => {
    document.title = "Kelola Berita - Admin";
  }, []);

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);

    if (category === "Semua") {
      setFilteredNews(newsData);
    } else {
      const filtered = newsData.filter((item) => item.kategori === category);
      setFilteredNews(filtered);
    }
  };

  // Handle actions
  const handleAdd = () => {
    message.info("Menuju halaman tambah berita...");
  };

  const handleDetail = (record) => {
    message.info(`Detail berita: ${record.judul}`);
  };

  const handleEdit = (record) => {
    message.info(`Edit berita: ${record.judul}`);
  };

  const handleDelete = (record) => {
    message.warning(`Hapus berita: ${record.judul}`);
  };

  // Custom search function yang mempertahankan filter kategori
  const handleSearch = (searchValue) => {
    let filtered = newsData;

    // Apply category filter first
    if (categoryFilter !== "Semua") {
      filtered = filtered.filter((item) => item.kategori === categoryFilter);
    }

    // Apply search
    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.judul?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.kategori?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  };

  const newsColumns = [
    createNumberColumn(),
    {
      title: "Judul",
      dataIndex: "judul",
      key: "judul",
      sorter: (a, b) => a.judul.localeCompare(b.judul),
      width: "40%",
    },
    {
      title: "Kategori",
      dataIndex: "kategori",
      key: "kategori",
      sorter: (a, b) => a.kategori.localeCompare(b.kategori),
      width: "15%",
    },
    createStatusColumn({
      Published: { color: "green" },
      Draft: { color: "orange" },
      Scheduled: { color: "blue" },
      Archived: { color: "gray" },
    }),
    {
      title: "Tanggal Rilis",
      dataIndex: "tanggalRilis",
      key: "tanggalRilis",
      sorter: (a, b) => new Date(a.tanggalRilis) - new Date(b.tanggalRilis),
      width: "15%",
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return formattedDate;
      },
    },
    createActionColumn([
      {
        key: "detail",
        label: "Detail",
        icon: <EyeOutlined />,
        onClick: handleDetail,
      },
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: handleEdit,
      },
      {
        key: "delete",
        label: "Hapus",
        icon: <DeleteOutlined />,
        danger: true,
        onClick: handleDelete,
      },
    ]),
  ];

  return (
    <UniversalTable
      title="Kelola Berita"
      data={filteredNews}
      columns={newsColumns}
      searchFields={["judul", "kategori"]}
      searchPlaceholder="Cari judul berita atau kategori..."
      addButtonText="Tambah Berita"
      onAdd={handleAdd}
      pageSize={10}
      customFilters={
        <Select
          value={categoryFilter}
          onChange={handleCategoryFilter}
          placeholder="Semua Kategori"
          style={{ width: 150 }}
        >
          {categoryOptions.map((option) => (
            <Option key={option} value={option}>
              {option === "Semua" ? "Semua Kategori" : option}
            </Option>
          ))}
        </Select>
      }
      onSearch={handleSearch}
    />
  );
};

export default NewsAdmin;
