import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthImg from "../../assets/auth.png";
import Button from "../../components/Button";
import { register } from "../../services/authService";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Registrasi Akun - Beasiswa";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await register(form);
      if (res.success) {
        alert("Registrasi berhasil! Silakan cek email untuk verifikasi.");
        navigate("/login");
      } else {
        setError(res.message || "Registrasi gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan server");
    }
    setLoading(false);
  };

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
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
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
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="Masukkan email unand Anda"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Kata Sandi
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
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
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="******"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
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
