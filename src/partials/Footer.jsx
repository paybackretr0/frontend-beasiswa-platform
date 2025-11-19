import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-r from-[#1e3a8a] to-[#2D60FF] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/unand.png" alt="Logo" className="w-10 h-10" />
              <h3 className="text-2xl font-bold">BeasiswaApp</h3>
            </div>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Platform digital untuk mengelola dan mengakses informasi beasiswa
              di Universitas Andalas.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/ditmawaunand/"
                target="_blank"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FaInstagram className="text-sm" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Menu Utama</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-blue-100 hover:text-white transition-colors cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/scholarship")}
                  className="text-blue-100 hover:text-white transition-colors cursor-pointer"
                >
                  Daftar Beasiswa
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/informations")}
                  className="text-blue-100 hover:text-white transition-colors cursor-pointer"
                >
                  Berita & Artikel
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-blue-100 hover:text-white transition-colors cursor-pointer"
                >
                  Panduan
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-blue-100 hover:text-white transition-colors cursor-pointer"
                >
                  Kontak
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MdLocationOn className="text-blue-200 flex-shrink-0" />
                <span className="text-blue-100 text-sm">
                  Jl. Limau Manis, Padang, Sumatera Barat 25163
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-blue-200 flex-shrink-0" />
                <span className="text-blue-100 text-sm">(0751) 71181</span>
              </div>
              <div className="flex items-center gap-3">
                <MdEmail className="text-blue-200 flex-shrink-0" />
                <span className="text-blue-100 text-sm">
                  beasiswa@unand.ac.id
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-100 text-sm">
              &copy; {new Date().getFullYear()} BeasiswaApp - Universitas
              Andalas. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
