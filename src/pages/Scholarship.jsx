import React, { useEffect, useState } from "react";
import GuestLayout from "../layouts/GuestLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { fetchActiveScholarships } from "../services/scholarshipService";
import { Link } from "react-router-dom";

const Scholarship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    document.title = "Daftar Beasiswa - UNAND";
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchActiveScholarships();
      setScholarships(data);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setError(error.message || "Gagal memuat daftar beasiswa");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentScholarships = scholarships.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(scholarships.length / itemsPerPage);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
    return "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80";
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
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              📚 Belum ada beasiswa aktif saat ini
            </div>
            <p className="text-gray-400 mb-6">
              Silakan kembali lagi nanti untuk melihat beasiswa terbaru
            </p>
            <Button onClick={loadScholarships}>Muat Ulang</Button>
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
              {Math.min(indexOfLastItem, scholarships.length)}
            </span>{" "}
            dari <span className="font-semibold">{scholarships.length}</span>{" "}
            beasiswa aktif
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {currentScholarships.map((scholarship) => (
            <Card
              key={scholarship.id}
              image={getImageSource(scholarship.logo_path)}
              title={scholarship.name}
              subtitle={`${scholarship.organizer} • ${scholarship.year}`}
            >
              <div className="mt-4 space-y-2">
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
                    className="block w-full text-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {currentPage < totalPages && (
          <div className="flex justify-center">
            <Button onClick={handleLoadMore}>
              Lihat Lebih Banyak ({scholarships.length - indexOfLastItem}{" "}
              tersisa)
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="text-center mt-6 text-sm text-gray-500">
            Halaman {currentPage} dari {totalPages}
          </div>
        )}
      </div>
    </GuestLayout>
  );
};

export default Scholarship;
