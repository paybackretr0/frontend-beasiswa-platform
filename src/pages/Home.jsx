import { useEffect } from "react";
import GuestLayout from "../layouts/GuestLayout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import PartnersCarousel from "../components/PartnersCarousel";
import SectionWhy from "../components/SectionWhy";
import SectionNews from "../components/SectionNews";

const steps = [
  {
    number: "01",
    title: "Pilih beasiswa",
    desc: "Telusuri daftar beasiswa yang sedang dibuka di halaman Beasiswa.",
  },
  {
    number: "02",
    title: "Lengkapi pendaftaran",
    desc: "Isi formulir dan unggah dokumen persyaratan yang dibutuhkan.",
  },
  {
    number: "03",
    title: "Pantau status",
    desc: "Ikuti perkembangan pengajuan secara berkala melalui akunmu.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Beranda - Beasiswa";
  }, []);

  return (
    <GuestLayout>
      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2D60FF] mb-4">
              Universitas Andalas
            </p>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Sistem Informasi Beasiswa
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Platform resmi untuk pendaftaran, verifikasi, dan pemantauan
              beasiswa Non-APBN di lingkungan Universitas Andalas. Semua proses
              terpusat, transparan, dan dapat diakses mahasiswa kapan saja.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={() => navigate("/scholarship")}>
                Lihat Beasiswa
              </Button>
              <button
                onClick={() => navigate("/informations")}
                className="text-[#2D60FF] font-medium hover:text-blue-800 transition-colors"
              >
                Baca berita &amp; informasi
              </button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg bg-white">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Alur Pendaftaran
              </h2>
            </div>
            <div className="divide-y divide-slate-200">
              {steps.map((step) => (
                <div key={step.number} className="px-6 py-5 flex gap-5">
                  <span className="text-sm font-semibold text-slate-400 pt-0.5">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PartnersCarousel />
      <SectionWhy />
      <SectionNews />
    </GuestLayout>
  );
};

export default Home;
