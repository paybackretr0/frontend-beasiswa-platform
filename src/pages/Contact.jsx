import React, { useEffect } from "react";
import GuestLayout from "../layouts/GuestLayout";

const Contact = () => {
  useEffect(() => {
    document.title = "Kontak - Beasiswa";
  }, []);

  return (
    <GuestLayout>
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Hubungi Kami
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Ada pertanyaan atau butuh bantuan terkait beasiswa? Silakan hubungi
            kami melalui form di bawah ini atau kontak langsung melalui email.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <form className="space-y-6 bg-white shadow-md rounded-lg p-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama
              </label>
              <input
                type="text"
                placeholder="Masukkan nama Anda"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesan
              </label>
              <textarea
                rows="4"
                placeholder="Tulis pesan Anda..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Kirim Pesan
            </button>
          </form>

          {/* Info Kontak */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Informasi Kontak
            </h2>
            <p className="text-gray-600 mb-6">
              Anda juga bisa langsung menghubungi kami melalui informasi di
              bawah ini.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li>
                <span className="font-semibold">Email:</span>{" "}
                beasiswa@unand.ac.id
              </li>
              <li>
                <span className="font-semibold">Telepon:</span> +62 751 123456
              </li>
              <li>
                <span className="font-semibold">Alamat:</span> Jl. Universitas
                Andalas, Padang, Sumatera Barat
              </li>
            </ul>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
};

export default Contact;
