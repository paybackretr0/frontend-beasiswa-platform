import React, { useEffect, useState } from "react";
import { Select, Input, Tag, Empty } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  CalendarOutlined,
  BookOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import GuestLayout from "../layouts/GuestLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { getAllInformations } from "../services/websiteService";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;

const Information = () => {
  const [allInformations, setAllInformations] = useState([]);
  const [filteredInformations, setFilteredInformations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    document.title = "Informasi & Berita - UNAND";
    loadInformations();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allInformations, typeFilter, searchQuery, sortBy]);

  const loadInformations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllInformations();
      setAllInformations(data);
    } catch (error) {
      console.error("Error fetching informations:", error);
      setError(error.message || "Gagal memuat daftar informasi");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...allInformations];

    if (typeFilter !== "ALL") {
      filtered = filtered.filter((info) => info.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (info) =>
          info.title.toLowerCase().includes(query) ||
          info.content.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.published_at || b.createdAt) -
            new Date(a.published_at || a.createdAt)
          );
        case "oldest":
          return (
            new Date(a.published_at || a.createdAt) -
            new Date(b.published_at || b.createdAt)
          );
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredInformations(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInformations = filteredInformations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredInformations.length / itemsPerPage);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belum ditentukan";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTypeLabel = (type) => {
    return type === "NEWS" ? "Berita" : "Artikel";
  };

  const getTypeIcon = (type) => {
    return type === "NEWS" ? <FileTextOutlined /> : <BookOutlined />;
  };

  const getImageSource = (coverUrl) => {
    if (coverUrl) {
      return coverUrl;
    }
    return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80";
  };

  const clearFilters = () => {
    setTypeFilter("ALL");
    setSearchQuery("");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat daftar informasi...</p>
            </div>
          </div>
        </div>
      </GuestLayout>
    );
  }

  if (error) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <Button onClick={loadInformations}>Coba Lagi</Button>
          </div>
        </div>
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Berita & Artikel
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan berita terbaru dan artikel menarik seputar beasiswa di
            Universitas Andalas
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SearchOutlined className="mr-1" />
                Cari Informasi
              </label>
              <Search
                placeholder="Cari berdasarkan judul atau konten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                size="large"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FilterOutlined className="mr-1" />
                Tipe
              </label>
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                className="w-full"
                size="large"
              >
                <Option value="ALL">Semua Tipe</Option>
                <Option value="NEWS">Berita</Option>
                <Option value="ARTICLE">Artikel</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SortAscendingOutlined className="mr-1" />
                Urutkan
              </label>
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="w-full"
                size="large"
              >
                <Option value="newest">Terbaru</Option>
                <Option value="oldest">Terlama</Option>
                <Option value="title_asc">Judul A-Z</Option>
                <Option value="title_desc">Judul Z-A</Option>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                Menampilkan{" "}
                <span className="font-semibold text-gray-800">
                  {Math.min(indexOfLastItem, filteredInformations.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-gray-800">
                  {filteredInformations.length}
                </span>{" "}
                informasi
              </span>
              {(typeFilter !== "ALL" || searchQuery) && (
                <span className="text-blue-600">
                  (dari {allInformations.length} total)
                </span>
              )}
            </div>
            {(typeFilter !== "ALL" || searchQuery || sortBy !== "newest") && (
              <Button
                onClick={clearFilters}
                className="text-sm bg-red-500 text-white hover:bg-red-700 px-4 py-2"
              >
                Reset Filter
              </Button>
            )}
          </div>
        </div>

        {filteredInformations.length === 0 ? (
          <div className="text-center py-12">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-gray-500">
                  {searchQuery || typeFilter !== "ALL"
                    ? "Tidak ada informasi yang sesuai dengan filter"
                    : "Belum ada informasi tersedia"}
                </div>
              }
            >
              {searchQuery || typeFilter !== "ALL" || (
                <Button onClick={clearFilters}>Reset Filter</Button>
              )}
            </Empty>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {currentInformations.map((information) => (
                <Card
                  key={information.id}
                  image={getImageSource(information.cover_url)}
                  title={information.title}
                  subtitle={
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-500">
                        <CalendarOutlined className="mr-1" />
                        {formatDate(
                          information.published_at || information.createdAt
                        )}
                      </span>
                    </div>
                  }
                  description={information.content.slice(0, 120) + "..."}
                >
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Tag
                          color={
                            information.type === "NEWS" ? "blue" : "purple"
                          }
                          icon={getTypeIcon(information.type)}
                        >
                          {getTypeLabel(information.type)}
                        </Tag>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/informations/${information.slug}`}
                        className="block w-full text-center px-4 py-2 text-sm bg-[#2D60FF] text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Baca Selengkapnya
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {currentPage < totalPages && (
              <div className="flex justify-center">
                <Button onClick={handleLoadMore}>
                  Lihat Lebih Banyak (
                  {filteredInformations.length - indexOfLastItem} tersisa)
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="text-center mt-6 text-sm text-gray-500">
                Halaman {currentPage} dari {totalPages}
              </div>
            )}
          </>
        )}
      </div>
    </GuestLayout>
  );
};

export default Information;
