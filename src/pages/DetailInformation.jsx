import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Empty, Spin, Divider } from "antd";
import {
  HomeOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  StarOutlined,
  BookOutlined,
} from "@ant-design/icons";
import GuestLayout from "../layouts/GuestLayout";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  getInformationBySlug,
  getLatestInformation,
} from "../services/websiteService";
import AlertContainer from "../components/AlertContainer";
import useAlert from "../hooks/useAlert";

const DetailInformation = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [information, setInformation] = useState(null);
  const [otherInformation, setOtherInformation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { alerts, success, error: alertError, removeAlert } = useAlert();

  useEffect(() => {
    loadInformationDetail();
    loadOtherInformation();
  }, [slug]);

  const loadInformationDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInformationBySlug(slug);
      setInformation(data);
      document.title = `Informasi - ${data.title}`;
    } catch (err) {
      setError(err.message || "Gagal memuat detail informasi");
      alertError("Gagal", err.message || "Gagal memuat detail informasi");
    } finally {
      setLoading(false);
    }
  };

  const loadOtherInformation = async () => {
    try {
      const data = await getLatestInformation();
      const filtered = data.filter((item) => item.slug !== slug);
      setOtherInformation(filtered.slice(0, 3));
    } catch (err) {
      console.error("Error loading other information:", err);
      alertError("Gagal", err.message || "Gagal memuat informasi lainnya");
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

  if (loading) {
    return (
      <GuestLayout>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex justify-center items-center min-h-96">
            <Spin size="large" tip="Memuat detail informasi...">
              <div className="p-12" />
            </Spin>
          </div>
        </div>
      </GuestLayout>
    );
  }

  if (error && !information) {
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
                      Informasi Tidak Ditemukan
                    </div>
                    <div className="text-gray-500">{error}</div>
                  </div>
                }
              >
                <div className="space-x-3">
                  <Button
                    onClick={() => navigate("/informations")}
                    className="inline-flex items-center"
                  >
                    <HomeOutlined className="mr-2" />
                    Kembali ke Daftar Informasi
                  </Button>
                  <Button
                    onClick={loadInformationDetail}
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
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <GuestLayout>
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
            <nav className="mb-8 text-sm opacity-80">
              <Link
                to="/informations"
                className="hover:text-green-200 transition-colors"
              >
                Informasi
              </Link>
              <span className="mx-2">/</span>
              <span>{getTypeLabel(information.type)}</span>
              <span className="mx-2">/</span>
              <span>{information.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <img
                    src={
                      information.cover_url ||
                      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={information.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-4">
                    {information.title}
                  </h1>
                  <div className="flex items-center space-x-6 text-sm opacity-80">
                    <span className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      {formatDate(information.published_at)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <ClockCircleOutlined className="text-2xl mb-2 text-yellow-400" />
                    <div className="text-sm opacity-80">Dipublikasikan</div>
                    <div className="text-lg font-bold">
                      {formatDate(information.published_at)}
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <BookOutlined className="text-2xl mb-2 text-blue-400" />
                    <div className="text-sm opacity-80">Kategori</div>
                    <div className="text-lg font-bold">
                      {getTypeLabel(information.type)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOutlined className="mr-2 text-green-500" />
                  Konten
                </h2>
                {information.content ? (
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    {information.content.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0 text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Belum ada konten"
                    className="my-8"
                  />
                )}
              </Card>

              {information.meta && Object.keys(information.meta).length > 0 && (
                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <StarOutlined className="mr-2 text-purple-500" />
                    Informasi Tambahan
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(information.meta).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"
                      >
                        <span className="text-gray-600 capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Bagikan Informasi Ini
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Bagikan informasi ini kepada teman atau keluarga Anda.
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: information.title,
                          text: information.content.slice(0, 100) + "...",
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        success(
                          "Berhasil",
                          "Tautan telah disalin ke clipboard"
                        );
                      }
                    }}
                  >
                    Bagikan
                  </Button>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Informasi Lainnya
                  </h3>
                  {otherInformation.length > 0 ? (
                    <div className="space-y-4">
                      {otherInformation.map((otherInfo) => (
                        <Link
                          key={otherInfo.id}
                          to={`/informations/${otherInfo.slug}`}
                          className="block group"
                        >
                          <div className="flex space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group-hover:shadow-md">
                            <img
                              src={
                                otherInfo.cover_url ||
                                "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80"
                              }
                              alt={otherInfo.title}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-[#2D60FF]">
                                {otherInfo.title}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {getTypeLabel(otherInfo.type)}
                              </p>
                              <div className="text-xs text-gray-400">
                                {formatDate(otherInfo.published_at)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Divider className="my-4" />
                      <Link
                        to="/informations"
                        className="block text-center text-[#2D60FF] hover:text-blue-800 font-medium text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Lihat Semua Informasi →
                      </Link>
                    </div>
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Belum ada informasi lainnya"
                      className="my-4"
                    />
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </GuestLayout>
    </>
  );
};

export default DetailInformation;
