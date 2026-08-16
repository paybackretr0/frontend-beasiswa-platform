import React, { useEffect, useState } from "react";
import { Tag, Tooltip, Select, Input, Empty } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import GuestLayout from "../layouts/GuestLayout";
import Button from "../components/Button";
import { fetchActiveScholarships } from "../services/scholarshipService";
import { Link } from "react-router-dom";
import EmptyInformation from "../assets/empty-state-news.svg";
import { SkeletonScholarshipCard } from "../components/common/skeleton";

const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    const parsedUser = JSON.parse(storedUser);
    const student = parsedUser?.student || null;
    return {
      ...parsedUser,
      faculty_id: parsedUser?.faculty_id || student?.faculty?.id || null,
      department_id:
        parsedUser?.department_id || student?.department?.id || null,
      study_program_id:
        parsedUser?.study_program_id || student?.study_program_id || null,
    };
  } catch {
    return null;
  }
};

const isStudentEligibleForAnySchema = (user, schemas) => {
  if (!user || !schemas || schemas.length === 0) return false;

  return schemas.some((schema) => {
    const facultyIds = new Set((schema.faculties || []).map((f) => f.id));
    const departmentIds = new Set((schema.departments || []).map((d) => d.id));
    const studyProgramIds = new Set(
      (schema.study_programs || []).map((sp) => sp.id),
    );

    const hasRestriction =
      facultyIds.size > 0 || departmentIds.size > 0 || studyProgramIds.size > 0;

    if (!hasRestriction) return true;

    return (
      studyProgramIds.has(user.study_program_id) ||
      departmentIds.has(user.department_id) ||
      facultyIds.has(user.faculty_id)
    );
  });
};

const { Option } = Select;
const { Search } = Input;

const Scholarship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [displayedScholarships, setDisplayedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(9);
  const itemsPerLoad = 9;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("closing_soon");

  useEffect(() => {
    document.title = "Daftar Beasiswa - UNAND";
    loadScholarships();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [scholarships, searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    setDisplayedScholarships(filteredScholarships.slice(0, displayCount));
  }, [displayCount, filteredScholarships]);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchActiveScholarships();
      setScholarships(data);
      setFilteredScholarships(data);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setError(error.message || "Gagal memuat daftar beasiswa");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...scholarships];
    const today = new Date();

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.organizer.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((s) => {
        const isClosed =
          !s.is_active || (s.end_date && new Date(s.end_date) < today);
        if (statusFilter === "OPEN") return !isClosed;
        if (statusFilter === "CLOSED") return isClosed;
        return true;
      });
    }

    filtered.sort((a, b) => {
      const aIsClosed =
        !a.is_active || (a.end_date && new Date(a.end_date) < today);
      const bIsClosed =
        !b.is_active || (b.end_date && new Date(b.end_date) < today);

      if (aIsClosed && !bIsClosed) return 1;
      if (!aIsClosed && bIsClosed) return -1;

      switch (sortBy) {
        case "closing_soon":
          if (!a.end_date && !b.end_date) return 0;
          if (!a.end_date) return 1;
          if (!b.end_date) return -1;

          if (aIsClosed && bIsClosed) {
            return new Date(b.end_date) - new Date(a.end_date);
          }

          return new Date(a.end_date) - new Date(b.end_date);

        case "newest_year":
          return b.year - a.year;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredScholarships(filtered);
    setDisplayCount(itemsPerLoad);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setSortBy("closing_soon");
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + itemsPerLoad);
  };

  const remainingCount = filteredScholarships.length - displayCount;
  const hasMore = displayCount < filteredScholarships.length;

  const [currentUser] = useState(() => getCurrentUser());

  const getRegistrationInfo = (scholarship) => {
    if (!scholarship.is_active) return { canRegister: false, reason: "tutup" };

    const deadlinePassed =
      scholarship.end_date && new Date(scholarship.end_date) < new Date();
    if (deadlinePassed) return { canRegister: false, reason: "tutup" };

    if (!currentUser) return { canRegister: false, reason: "not_logged_in" };

    if (String(currentUser.role || "").toUpperCase() !== "MAHASISWA") {
      return { canRegister: false, reason: "not_mahasiswa" };
    }

    const eligible = isStudentEligibleForAnySchema(
      currentUser,
      scholarship.schemas || [],
    );

    return {
      canRegister: eligible,
      reason: eligible ? "eligible" : "not_eligible",
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belum ditentukan";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getImageSource = (logoPath) => {
    if (logoPath) {
      return logoPath.startsWith("http")
        ? logoPath
        : `${import.meta.env.VITE_IMAGE_URL}/${logoPath}`;
    }
    return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop";
  };

  const getStatusTags = (isActive, endDate) => {
    if (!isActive) {
      return (
        <Tag color="red" icon={<ExclamationCircleOutlined />}>
          Tutup
        </Tag>
      );
    }

    if (!endDate) {
      return (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Aktif
        </Tag>
      );
    }

    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <Tag color="red" icon={<ClockCircleOutlined />}>
          Berakhir
        </Tag>
      );
    }

    return (
      <>
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Aktif
        </Tag>
        <Tag color="orange" icon={<ClockCircleOutlined />}>
          Berakhir {diffDays} hari lagi
        </Tag>
      </>
    );
  };

  if (loading) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">
            Daftar Beasiswa
          </h1>
          <div className="text-center mb-10">
            <div className="h-5 bg-slate-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <SkeletonScholarshipCard items={9} />
        </div>
      </GuestLayout>
    );
  }

  if (error) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <Button onClick={loadScholarships}>Coba Lagi</Button>
          </div>
        </div>
      </GuestLayout>
    );
  }

  if (scholarships.length === 0) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Daftar Beasiswa
          </h1>
          <div className="flex flex-col items-center justify-center">
            <div className="max-w-md w-full text-center">
              <img
                src={EmptyInformation}
                alt="Tidak ada beasiswa"
                className="w-50 h-50 mx-auto opacity-80"
              />
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">
                  Belum Ada Beasiswa
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Saat ini belum ada beasiswa yang tersedia. Pantau terus
                  halaman ini untuk mendapatkan informasi beasiswa terbaru.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button onClick={loadScholarships} size="lg">
                    Muat Ulang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">
          Daftar Beasiswa
        </h1>

        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <SearchOutlined className="mr-1" />
                Cari Beasiswa
              </label>
              <Search
                placeholder="Cari nama beasiswa atau penyelenggara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                size="large"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FilterOutlined className="mr-1" />
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full"
                size="large"
              >
                <Option value="ALL">Semua Status</Option>
                <Option value="OPEN">Pendaftaran Buka</Option>
                <Option value="CLOSED">Pendaftaran Tutup</Option>
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
                <Option value="closing_soon">Batas Waktu Terdekat</Option>
                <Option value="newest_year">Tahun Terbaru</Option>
                <Option value="name_asc">Nama A-Z</Option>
                <Option value="name_desc">Nama Z-A</Option>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span>
                Menampilkan{" "}
                <span className="font-semibold text-slate-900">
                  {displayedScholarships.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-900">
                  {filteredScholarships.length}
                </span>{" "}
                beasiswa
              </span>
              {(statusFilter !== "ALL" || searchQuery) && (
                <span className="text-blue-600">
                  (dari {scholarships.length} total)
                </span>
              )}
            </div>
            {(statusFilter !== "ALL" ||
              searchQuery ||
              sortBy !== "closing_soon") && (
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

        {filteredScholarships.length === 0 ? (
          <div className="text-center py-12">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-slate-500">
                  Tidak ada beasiswa yang sesuai dengan pencarian atau filter
                  Anda
                </div>
              }
            >
              <Button onClick={clearFilters} variant="secondary">
                Reset Filter
              </Button>
            </Empty>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {displayedScholarships.map((scholarship) => (
                <article
                  key={scholarship.id}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col"
                >
                  <img
                    src={getImageSource(scholarship.logo_path)}
                    alt={scholarship.name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-slate-400 mb-2">
                      {scholarship.organizer} • {scholarship.year}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-snug">
                      {scholarship.name}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {getStatusTags(
                        scholarship.is_active,
                        scholarship.end_date,
                      )}
                    </div>

                    {scholarship.total_schemas > 0 && (
                      <div className="bg-slate-50 border border-slate-200 rounded-md p-3 mb-4">
                        <div className="text-xs text-slate-600 space-y-1">
                          {scholarship.total_quota > 0 && (
                            <div className="flex justify-between">
                              <span>Total Kuota:</span>
                              <span className="font-medium text-slate-900">
                                {scholarship.total_quota} orang
                              </span>
                            </div>
                          )}
                          {scholarship.min_gpa && (
                            <div className="flex justify-between">
                              <span>Min. IPK:</span>
                              <span className="font-medium text-slate-900">
                                {scholarship.min_gpa}
                              </span>
                            </div>
                          )}
                          {scholarship.min_semester && (
                            <div className="flex justify-between">
                              <span>Min. Semester:</span>
                              <span className="font-medium text-slate-900">
                                {scholarship.min_semester}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-slate-600 space-y-1 mb-4">
                      <div className="flex justify-between">
                        <span>Nilai:</span>
                        <span className="font-medium text-emerald-600">
                          {formatCurrency(scholarship.scholarship_value)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durasi:</span>
                        <span className="font-medium text-slate-900">
                          {scholarship.duration_semesters} semester
                        </span>
                      </div>
                      {scholarship.end_date && (
                        <div className="flex justify-between">
                          <span>Batas:</span>
                          <span className="font-medium text-orange-600">
                            {formatDate(scholarship.end_date)}
                          </span>
                        </div>
                      )}
                    </div>

                    {scholarship.benefits && scholarship.benefits.length > 0 && (
                      <Tooltip
                        title={
                          <div>
                            <strong>Benefit:</strong>
                            <ul className="list-disc pl-4 mt-1">
                              {scholarship.benefits
                                .slice(0, 3)
                                .map((benefit, idx) => (
                                  <li key={idx}>{benefit}</li>
                                ))}
                              {scholarship.benefits.length > 3 && (
                                <li>
                                  + {scholarship.benefits.length - 3} lainnya
                                </li>
                              )}
                            </ul>
                          </div>
                        }
                      >
                        <div className="text-xs text-blue-600 cursor-help mb-2">
                          {scholarship.benefits.length} benefit tersedia
                        </div>
                      </Tooltip>
                    )}

                    {(() => {
                      const info = getRegistrationInfo(scholarship);
                      if (info.canRegister) {
                        return (
                          <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5 mb-3">
                            <CheckCircleOutlined className="text-emerald-600" />
                            <span>Kamu bisa mendaftar di beasiswa ini</span>
                          </div>
                        );
                      }
                      if (info.reason === "not_eligible") {
                        return (
                          <div className="flex items-center gap-1 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-1.5 mb-3">
                            <CloseCircleOutlined className="text-red-600" />
                            <span>Tidak sesuai fakultas/prodi kamu</span>
                          </div>
                        );
                      }
                      if (info.reason === "not_logged_in") {
                        return (
                          <div className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-1.5 mb-3">
                            <InfoCircleOutlined className="text-blue-600" />
                            <span>Login untuk cek eligibility kamu</span>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <div className="pt-2 mt-auto">
                      <Link
                        to={`/scholarship/${scholarship.id}`}
                        className="block w-full text-center px-4 py-2 text-sm font-medium rounded-md transition-colors bg-[#2D60FF] text-white hover:bg-blue-700"
                      >
                        Lihat Detail & Skema
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {hasMore && (
              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  variant="secondary"
                  className="px-8"
                >
                  Lihat Lebih Banyak
                  {remainingCount > 0 && ` (${remainingCount} tersisa)`}
                </Button>
              </div>
            )}

            {!hasMore && filteredScholarships.length > itemsPerLoad && (
              <div className="text-center py-6">
                <p className="text-slate-600 font-medium">
                  Semua beasiswa telah ditampilkan
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </GuestLayout>
  );
};

export default Scholarship;
