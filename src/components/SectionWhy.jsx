import React from "react";

const features = [
  {
    title: "Monitoring",
    desc: "Proses monitoring mahasiswa pendaftar beasiswa lebih mudah dan terpusat.",
    icon: (
      <svg
        className="w-10 h-10 text-[#2D60FF]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M9.75 17.25h4.5M12 6.75v10.5m9 0A9 9 0 1 1 3 17.25a9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Mudah",
    desc: "Bisa diakses dimana dan kapan saja yang diinginkan mahasiswa.",
    icon: (
      <svg
        className="w-10 h-10 text-[#2D60FF]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 3v18m9-9H3" />
      </svg>
    ),
  },
  {
    title: "Digitalisasi",
    desc: "Bentuk proses digitalisasi data di Universitas Andalas.",
    icon: (
      <svg
        className="w-10 h-10 text-[#2D60FF]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M4 7V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3M7 12h10" />
      </svg>
    ),
  },
];

const SectionWhy = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-5">
          Kenapa?
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Sistem informasi beasiswa ini dibuat untuk memudahkan mahasiswa dalam
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col items-center p-8 text-center"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionWhy;
