import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Empty, Spin, Tag } from "antd";
import {
  HomeOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
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
        <Tag color="red" icon={<ExclamationCircleOutlined />}>
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
        <Tag color="red" icon={<ClockCircleOutlined />}>
          Berakhir
        </Tag>
      );
    }
    if (diffDays <= 7) {
      return (
        <Tag color="orange" icon={<ClockCircleOutlined />}>
          Berakhir {diffDays} hari lagi
        </Tag>
      );
    }
    return (
      <Tag color="green" icon={<CheckCircleOutlined />}>
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
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <nav className="mb-6 text-sm">
          <Link to="/scholarship" className="text-blue-600 hover:text-blue-800">
            Beasiswa
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{scholarship.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card
              image={getImageSource(scholarship.logo_path)}
              title={scholarship.name}
              subtitle={scholarship.organizer}
              className="mb-0"
            >
              <div className="flex items-center space-x-4 mb-2">
                <span className="flex items-center text-gray-600">
                  <UserOutlined className="mr-2" /> {scholarship.organizer}
                </span>
                <span className="flex items-center text-gray-600">
                  <ClockCircleOutlined className="mr-2" /> {scholarship.year}
                </span>
                {getStatusTag(scholarship.is_active, scholarship.end_date)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nilai Beasiswa:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(scholarship.scholarship_value)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durasi:</span>
                    <span className="font-semibold">
                      {scholarship.duration_semesters} semester
                    </span>
                  </div>
                  {scholarship.quota && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kuota:</span>
                      <span className="font-semibold">
                        {scholarship.quota} orang
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {scholarship.gpa_minimum && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min. IPK:</span>
                      <span className="font-semibold">
                        {scholarship.gpa_minimum}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min. Semester:</span>
                    <span className="font-semibold">
                      {scholarship.semester_minimum}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batas Pendaftaran:</span>
                    <span className="font-semibold text-orange-600">
                      {formatDate(scholarship.end_date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Deskripsi
                </h2>
                {scholarship.description ? (
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    {scholarship.description
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Belum ada deskripsi"
                    className="my-4"
                  />
                )}
              </div>
              {scholarship.is_active && (
                <div className="mt-8 text-center">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3"
                    onClick={() => navigate(`/scholarship/${id}/apply`)}
                  >
                    Daftar Beasiswa
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card title="Beasiswa Lainnya" className="mb-0">
                {otherScholarships.length > 0 ? (
                  <div className="space-y-4">
                    {otherScholarships.map((otherScholarship) => (
                      <Link
                        key={otherScholarship.id}
                        to={`/scholarship/${otherScholarship.id}`}
                        className="block hover:bg-gray-50 rounded-lg p-3 transition-colors"
                      >
                        <div className="flex space-x-3">
                          <img
                            src={getImageSource(otherScholarship.logo_path)}
                            alt={otherScholarship.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {otherScholarship.name}
                            </h4>
                            <p className="text-xs text-gray-600 truncate">
                              {otherScholarship.organizer}
                            </p>
                            <div className="text-xs text-green-600 font-medium">
                              {formatCurrency(
                                otherScholarship.scholarship_value
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        to="/scholarship"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Lihat Semua Beasiswa →
                      </Link>
                    </div>
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
