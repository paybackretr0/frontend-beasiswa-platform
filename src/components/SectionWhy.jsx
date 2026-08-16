import React from "react";

const features = [
  {
    title: "Monitoring",
    desc: "Proses monitoring mahasiswa pendaftar beasiswa lebih mudah dan terpusat.",
  },
  {
    title: "Mudah",
    desc: "Bisa diakses dimana dan kapan saja yang diinginkan mahasiswa.",
  },
  {
    title: "Digitalisasi",
    desc: "Bentuk proses digitalisasi data di Universitas Andalas.",
  },
];

const SectionWhy = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Kenapa platform ini dibuat?
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Sistem informasi beasiswa ini dirancang untuk memudahkan mahasiswa
            dalam mengakses informasi dan mengikuti proses pendaftaran beasiswa
            secara digital.
          </p>
        </div>
        <div className="border-t border-slate-200">
          {features.map((f, i) => (
            <div
              key={i}
              className="grid md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-slate-200"
            >
              <span className="md:col-span-1 text-sm font-semibold text-slate-400 pt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="md:col-span-4 text-xl font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="md:col-span-7 text-slate-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionWhy;
