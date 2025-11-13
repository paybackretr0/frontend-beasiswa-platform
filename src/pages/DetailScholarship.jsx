import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Empty, Spin, Tag, Timeline, Divider } from "antd";
import {
  HomeOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  BookOutlined,
  FileTextOutlined,
  BankOutlined,
  ApartmentOutlined,
  RightOutlined,
  StarOutlined,
} from "@ant-design/icons";
import GuestLayout from "../layouts/GuestLayout";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  getScholarshipByIdPublic,
  getOtherScholarships,
} from "../services/scholarshipService";

const DetailScholarship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [otherScholarships, setOtherScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadScholarshipDetail();
    loadOtherScholarships();
  }, [id]);

  const loadScholarshipDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getScholarshipByIdPublic(id);
      setScholarship(data);
      document.title = `${data.name} - Detail Beasiswa`;
    } catch (error) {
      setError(error.message || "Gagal memuat detail beasiswa");
    } finally {
      setLoading(false);
    }
  };

  const loadOtherScholarships = async () => {
    try {
      const data = await getOtherScholarships(id, 5);
      setOtherScholarships(data);
    } catch (error) {
      // ignore
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

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
        <Tag
          color="red"
          icon={<ExclamationCircleOutlined />}
          className="px-3 py-1"
        >
          Tidak Aktif
        </Tag>
      );
    }
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return (
        <Tag color="red" icon={<ClockCircleOutlined />} className="px-3 py-1">
          Berakhir
        </Tag>
      );
    }
    if (diffDays <= 7) {
      return (
        <Tag
          color="orange"
          icon={<ClockCircleOutlined />}
          className="px-3 py-1"
        >
          Berakhir {diffDays} hari lagi
        </Tag>
      );
    }
    return (
      <Tag color="green" icon={<CheckCircleOutlined />} className="px-3 py-1">
        Aktif
      </Tag>
    );
  };

  if (loading) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex justify-center items-center min-h-96">
            <Spin size="large" tip="Memuat detail beasiswa...">
              <div className="p-12" />
            </Spin>
          </div>
        </div>
      </GuestLayout>
    );
  }

  if (error && !scholarship) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center max-w-md">
              <Empty
                image={
                  <FileSearchOutlined className="text-6xl text-gray-300" />
                }
                description={
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-gray-700">
                      Beasiswa Tidak Ditemukan
                    </div>
                    <div className="text-gray-500">{error}</div>
                  </div>
                }
              >
                <div className="space-x-3">
                  <Button
                    onClick={() => navigate("/scholarship")}
                    className="inline-flex items-center"
                  >
                    <HomeOutlined className="mr-2" />
                    Kembali ke Daftar Beasiswa
                  </Button>
                  <Button
                    onClick={loadScholarshipDetail}
                    className="inline-flex items-center bg-gray-200 text-gray-700"
                  >
                    <ReloadOutlined className="mr-2" />
                    Coba Lagi
                  </Button>
                </div>
              </Empty>
            </div>
          </div>
        </div>
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm opacity-80">
            <Link
              to="/scholarship"
              className="hover:text-blue-200 transition-colors"
            >
              Beasiswa
            </Link>
            <span className="mx-2">/</span>
            <span>{scholarship.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Logo */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <img
                  src={getImageSource(scholarship.logo_path)}
                  alt={scholarship.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{scholarship.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="flex items-center">
                    <BankOutlined className="mr-2" />
                    {scholarship.organizer}
                  </span>
                  <span className="flex items-center">
                    <CalendarOutlined className="mr-2" />
                    {scholarship.year}
                  </span>
                  {getStatusTag(scholarship.is_active, scholarship.end_date)}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(scholarship.scholarship_value)}
                  </div>
                  <div className="text-sm opacity-80">Nilai Beasiswa</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {scholarship.duration_semesters}
                  </div>
                  <div className="text-sm opacity-80">Semester</div>
                </div>
                {scholarship.quota && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">
                      {scholarship.quota}
                    </div>
                    <div className="text-sm opacity-80">Kuota</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Card */}
            <Card className="border-l-4 border-l-blue-500">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <StarOutlined className="mr-2 text-blue-500" />
                Informasi Singkat
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Minimum IPK:</span>
                    <span className="font-semibold text-lg">
                      {scholarship.gpa_minimum || "Tidak ditentukan"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Minimum Semester:</span>
                    <span className="font-semibold text-lg">
                      {scholarship.semester_minimum}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Periode Pendaftaran:</span>
                    <span className="font-semibold text-lg">
                      {formatDate(scholarship.start_date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Batas Pendaftaran:</span>
                    <span className="font-semibold text-lg text-red-600">
                      {formatDate(scholarship.end_date)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description Card */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileTextOutlined className="mr-2 text-blue-500" />
                Deskripsi Beasiswa
              </h2>
              {scholarship.description ? (
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  {scholarship.description
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0 text-justify">
                        {paragraph}
                      </p>
                    ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Belum ada deskripsi"
                  className="my-8"
                />
              )}
            </Card>

            {/* Requirements Card */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircleOutlined className="mr-2 text-green-500" />
                Persyaratan
              </h2>
              {scholarship.requirements &&
              scholarship.requirements.length > 0 ? (
                <div className="space-y-3">
                  {scholarship.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400"
                    >
                      <div className="flex-1">
                        {req.requirement_type === "TEXT" && (
                          <span className="text-gray-700">
                            {req.requirement_text}
                          </span>
                        )}
                        {req.requirement_type === "FILE" && (
                          <a
                            href={`${import.meta.env.VITE_IMAGE_URL}/${
                              req.requirement_file
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Lihat syarat & ketentuan disini
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Belum ada persyaratan"
                  className="my-8"
                />
              )}
            </Card>

            {/* Selection Stages Card */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrophyOutlined className="mr-2 text-purple-500" />
                Tahapan Seleksi
              </h2>
              {scholarship.stages && scholarship.stages.length > 0 ? (
                <Timeline
                  items={scholarship.stages
                    .sort((a, b) => a.order_no - b.order_no)
                    .map((stage, index) => ({
                      dot: (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      ),
                      children: (
                        <div className="ml-4">
                          <h4 className="font-semibold text-gray-900">
                            {stage.stage_name}
                          </h4>
                        </div>
                      ),
                    }))}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Belum ada tahapan seleksi"
                  className="my-8"
                />
              )}
            </Card>

            {/* Eligible Faculties and Departments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ApartmentOutlined className="mr-2 text-indigo-500" />
                  Fakultas Eligible
                </h2>
                {scholarship.faculties && scholarship.faculties.length > 0 ? (
                  <div className="space-y-2">
                    {scholarship.faculties.map((faculty, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-indigo-50 rounded-lg"
                      >
                        <RightOutlined className="text-indigo-500 text-xs" />
                        <span className="text-gray-700">{faculty.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Semua fakultas</p>
                )}
              </Card>

              <Card>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <BookOutlined className="mr-2 text-orange-500" />
                  Departemen Eligible
                </h2>
                {scholarship.departments &&
                scholarship.departments.length > 0 ? (
                  <div className="space-y-2">
                    {scholarship.departments.map((department, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg"
                      >
                        <RightOutlined className="text-orange-500 text-xs" />
                        <span className="text-gray-700">{department.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Semua departemen</p>
                )}
              </Card>
            </div>

            {/* Required Documents Card */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FileTextOutlined className="mr-2 text-red-500" />
                Dokumen yang Diperlukan
              </h2>
              {scholarship.scholarshipDocuments &&
              scholarship.scholarshipDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scholarship.scholarshipDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400"
                    >
                      <FileTextOutlined className="text-red-500 flex-shrink-0" />
                      <span className="text-gray-700">{doc.document_name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Tidak ada dokumen yang diperlukan"
                  className="my-8"
                />
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Action Card */}
              {scholarship.is_active &&
                new Date() <= new Date(scholarship.end_date) && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Siap untuk mendaftar?
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Pastikan Anda memenuhi semua persyaratan sebelum
                      mendaftar.
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/scholarship/${id}/apply`)}
                    >
                      Daftar Sekarang
                    </Button>
                  </Card>
                )}

              {/* Other Scholarships Card */}
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Beasiswa Lainnya
                </h3>
                {otherScholarships.length > 0 ? (
                  <div className="space-y-4">
                    {otherScholarships.map((otherScholarship) => (
                      <Link
                        key={otherScholarship.id}
                        to={`/scholarship/${otherScholarship.id}`}
                        className="block group"
                      >
                        <div className="flex space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group-hover:shadow-md">
                          <img
                            src={getImageSource(otherScholarship.logo_path)}
                            alt={otherScholarship.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                              {otherScholarship.name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {otherScholarship.organizer}
                            </p>
                            <div className="text-xs font-semibold text-green-600">
                              {formatCurrency(
                                otherScholarship.scholarship_value
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Divider className="my-4" />
                    <Link
                      to="/scholarship"
                      className="block text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Lihat Semua Beasiswa →
                    </Link>
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Belum ada beasiswa lainnya"
                    className="my-4"
                  />
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default DetailScholarship;
