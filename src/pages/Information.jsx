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
import Button from "../components/Button";
import { getAllInformations } from "../services/websiteService";
import { Link } from "react-router-dom";
import { SkeletonInformation } from "../components/common/skeleton";

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
          info.content.toLowerCase().includes(query),
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

  const displayedInformations = filteredInformations.slice(
    0,
    currentPage * itemsPerPage,
  );

  const hasMore = filteredInformations.length > currentPage * itemsPerPage;
  const remainingItems =
    filteredInformations.length - currentPage * itemsPerPage;

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
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

  return (
    <GuestLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Berita & Artikel
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Temukan berita terbaru dan artikel menarik seputar beasiswa di
            Universitas Andalas
          </p>
        </div>

        {loading ? (
          <SkeletonInformation items={9} />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <Button onClick={loadInformations}>Coba Lagi</Button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span>
                    Menampilkan{" "}
                    <span className="font-semibold text-slate-900">
                      {displayedInformations.length}
                    </span>{" "}
                    dari{" "}
                    <span className="font-semibold text-slate-900">
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
                {(typeFilter !== "ALL" ||
                  searchQuery ||
                  sortBy !== "newest") && (
                  <Button
                    onClick={clearFilters}
                    variant="secondary"
                    className="px-4 py-2 text-sm"
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
                    <div className="text-slate-500">
                      {searchQuery || typeFilter !== "ALL"
                        ? "Tidak ada informasi yang sesuai dengan filter"
                        : "Belum ada informasi tersedia"}
                    </div>
                  }
                >
                  {searchQuery || typeFilter !== "ALL" ? (
                    <Button onClick={clearFilters} variant="secondary">
                      Reset Filter
                    </Button>
                  ) : null}
                </Empty>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {displayedInformations.map((information) => (
                    <article
                      key={information.id}
                      className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col"
                    >
                      <img
                        src={getImageSource(information.cover_url)}
                        alt={information.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <div className="p-6 flex flex-col flex-1">
                        <p className="flex items-center text-xs text-slate-400 mb-2">
                          <CalendarOutlined className="mr-1" />
                          {formatDate(
                            information.published_at || information.createdAt,
                          )}
                        </p>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-snug">
                          {information.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                          {information.content.slice(0, 120)}
                          {information.content.length > 120 ? "…" : ""}
                        </p>

                        <div className="mt-auto pt-2 space-y-4">
                          <div>
                            <Tag
                              color={
                                information.type === "NEWS" ? "blue" : "purple"
                              }
                              icon={getTypeIcon(information.type)}
                            >
                              {getTypeLabel(information.type)}
                            </Tag>
                          </div>

                          <Link
                            to={`/informations/${information.slug}`}
                            className="block w-full text-center px-4 py-2 text-sm font-medium rounded-md transition-colors bg-[#2D60FF] text-white hover:bg-blue-700"
                          >
                            Baca Selengkapnya
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleLoadMore}
                      variant="secondary"
                      size="lg"
                    >
                      Lihat Lebih Banyak
                      {remainingItems > 0 && ` (${remainingItems} tersisa)`}
                    </Button>
                  </div>
                )}

                {displayedInformations.length > itemsPerPage && (
                  <div className="text-center mt-6 text-sm text-slate-500">
                    Menampilkan {displayedInformations.length} dari{" "}
                    {filteredInformations.length} informasi
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </GuestLayout>
  );
};

export default Information;
