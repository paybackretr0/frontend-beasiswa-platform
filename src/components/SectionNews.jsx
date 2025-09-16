import React from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

import NewsImg1 from "../assets/dummy/news1.jpg";
import NewsImg2 from "../assets/dummy/news2.jpg";
import NewsImg3 from "../assets/dummy/news3.jpg";

const newsList = [
  {
    title: "Pendaftaran Beasiswa Unggulan 2025 Dibuka!",
    date: "15 September 2025",
    excerpt:
      "Universitas Andalas resmi membuka pendaftaran Beasiswa Unggulan untuk tahun akademik 2025/2026. Segera daftarkan diri Anda!",
    img: NewsImg1,
  },
  {
    title: "Tips Lolos Seleksi Administrasi Beasiswa",
    date: "10 September 2025",
    excerpt:
      "Simak tips dan trik agar dokumen Anda tidak gagal verifikasi pada tahap seleksi administrasi beasiswa.",
    img: NewsImg2,
  },
  {
    title: "Pengumuman Penerima Beasiswa KIP Kuliah",
    date: "1 September 2025",
    excerpt:
      "Daftar nama mahasiswa penerima Beasiswa KIP Kuliah Universitas Andalas tahun 2025 telah diumumkan.",
    img: NewsImg3,
  },
];

const SectionNews = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-10">
          Seputar Beasiswa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {newsList.map((news, idx) => (
            <Card
              key={idx}
              image={news.img}
              title={news.title}
              subtitle={news.date}
              description={news.excerpt}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionNews;
