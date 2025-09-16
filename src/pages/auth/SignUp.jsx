import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthImg from "../../assets/auth.png";
import Button from "../../components/Button";

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registrasi Akun - Beasiswa";
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left: Background Image with Gradient */}
      <div className="hidden md:block w-0 md:w-[70%] relative">
        <img
          src={AuthImg}
          alt="Auth Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2D60FF]/70 via-[#eaf0ff]/60 to-transparent" />
      </div>
      {/* Right: SignUp Form Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-600 mb-6 text-center">
            Buat Akun Baru
          </h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="Masukkan Nama Lengkap"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email Unand
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="nama@student.unand.ac.id"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Kata Sandi
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="******"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="******"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Daftar
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Sudah punya akun?{" "}
            <button
              type="button"
              className="text-[#2D60FF] font-semibold hover:cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Masuk disini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
