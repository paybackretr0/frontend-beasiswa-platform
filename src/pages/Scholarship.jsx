import React, { useEffect, useState } from "react";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import GuestLayout from "../layouts/GuestLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { fetchActiveScholarships } from "../services/scholarshipService";
import { Link } from "react-router-dom";
import EmptyInformation from "../assets/empty-state-news.svg";

const Scholarship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [displayedScholarships, setDisplayedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(9);
  const itemsPerLoad = 9;

  useEffect(() => {
    document.title = "Daftar Beasiswa - UNAND";
    loadScholarships();
  }, []);

  useEffect(() => {
    // Update displayed scholarships when displayCount changes
    setDisplayedScholarships(scholarships.slice(0, displayCount));
  }, [displayCount, scholarships]);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchActiveScholarships();
      setScholarships(data);
      setDisplayedScholarships(data.slice(0, displayCount));
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setError(error.message || "Gagal memuat daftar beasiswa");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + itemsPerLoad);
  };

  const remainingCount = scholarships.length - displayCount;
  const hasMore = displayCount < scholarships.length;

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
    return "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80";
  };

  const getStatusTag = (isActive, endDate) => {
    if (!isActive) {
      return (
        <Tag color="red" icon={<ExclamationCircleOutlined />} className="mb-2">
          Tutup
        </Tag>
      );
    }

    if (!endDate) {
      return (
        <Tag color="green" icon={<CheckCircleOutlined />} className="mb-2">
          Buka
        </Tag>
      );
    }

    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <Tag color="red" icon={<ClockCircleOutlined />} className="mb-2">
          Berakhir
        </Tag>
      );
    }
    if (diffDays <= 7) {
      return (
        <Tag color="orange" icon={<ClockCircleOutlined />} className="mb-2">
          Berakhir {diffDays} hari lagi
        </Tag>
      );
    }
    return (
      <Tag color="green" icon={<CheckCircleOutlined />} className="mb-2">
        Aktif
      </Tag>
    );
  };

  const getButtonStyle = (isActive, endDate) => {
    if (!isActive) {
      return "bg-gray-500 text-white hover:bg-gray-600";
    }

    if (endDate) {
      const today = new Date();
      const end = new Date(endDate);
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return "bg-gray-500 text-white hover:bg-gray-600";
      }
      if (diffDays <= 7) {
        return "bg-orange-600 text-white hover:bg-orange-700";
      }
    }

    return "bg-blue-600 text-white hover:bg-blue-700";
  };

  const getButtonText = (isActive, endDate) => {
    if (!isActive) {
      return "Lihat Detail";
    }

    if (endDate) {
      const today = new Date();
      const end = new Date(endDate);
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return "Lihat Detail";
      }
    }

    return "Lihat Detail";
  };

  if (loading) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat daftar beasiswa...</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
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
                <h3 className="text-2xl font-bold text-gray-800">
                  Belum Ada Beasiswa
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed">
                  Saat ini belum ada beasiswa yang tersedia. Pantau terus
                  halaman ini untuk mendapatkan informasi beasiswa terbaru.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button
                    onClick={loadScholarships}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  >
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Daftar Beasiswa
        </h1>

        <div className="text-center mb-10">
          <p className="text-gray-600">
            Menampilkan{" "}
            <span className="font-semibold">
              {displayedScholarships.length}
            </span>{" "}
            dari <span className="font-semibold">{scholarships.length}</span>{" "}
            beasiswa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {displayedScholarships.map((scholarship) => (
            <Card
              key={scholarship.id}
              image={getImageSource(scholarship.logo_path)}
              title={scholarship.name}
              subtitle={`${scholarship.organizer} • ${scholarship.year}`}
            >
              <div className="mt-4 space-y-3">
                <div className="flex justify-start">
                  {getStatusTag(scholarship.is_active, scholarship.end_date)}
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  {scholarship.quota && (
                    <div className="flex justify-between">
                      <span>Kuota:</span>
                      <span className="font-medium">
                        {scholarship.quota} orang
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Nilai:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(scholarship.scholarship_value)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durasi:</span>
                    <span className="font-medium">
                      {scholarship.duration_semesters} semester
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batas:</span>
                    <span className="font-medium text-orange-600">
                      {formatDate(scholarship.end_date)}
                    </span>
                  </div>
                  {scholarship.gpa_minimum && (
                    <div className="flex justify-between">
                      <span>Min. IPK:</span>
                      <span className="font-medium">
                        {scholarship.gpa_minimum}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    to={`/scholarship/${scholarship.id}`}
                    className={`block w-full text-center px-4 py-2 text-sm rounded-lg transition-colors ${getButtonStyle(
                      scholarship.is_active,
                      scholarship.end_date
                    )}`}
                  >
                    {getButtonText(scholarship.is_active, scholarship.end_date)}
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {hasMore && (
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base"
            >
              Lihat Lebih Banyak
              {remainingCount > 0 && ` (${remainingCount} tersisa)`}
            </Button>

            <p className="text-sm text-gray-500">
              Menampilkan {displayedScholarships.length} dari{" "}
              {scholarships.length} beasiswa
            </p>
          </div>
        )}

        {!hasMore && scholarships.length > itemsPerLoad && (
          <div className="text-center py-6">
            <p className="text-gray-600 font-medium">
              Semua beasiswa telah ditampilkan
            </p>
          </div>
        )}
      </div>
    </GuestLayout>
  );
};

export default Scholarship;
