import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { login } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login - Beasiswa";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(form);

      if (res?.data?.access_token && res?.data?.user) {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role?.toUpperCase();
        if (role === "MAHASISWA") {
          navigate("/", { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      } else {
        setError(res?.message || "Email atau kata sandi salah");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan pada server. Coba lagi nanti.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-[70%] bg-[#142a5c] flex-col justify-between p-10 lg:p-16">
        <div className="flex items-center gap-3">
          <img
            src="/unand.png"
            alt="Logo Universitas Andalas"
            className="h-10 w-10 object-contain"
          />
          <div>
            <p className="font-bold text-white text-lg leading-tight">
              BeasiswaApp
            </p>
            <p className="text-blue-200 text-xs">Universitas Andalas</p>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sistem Informasi Beasiswa
          </h2>
          <p className="text-blue-200 leading-relaxed">
            Platform resmi untuk pendaftaran, verifikasi, dan pemantauan
            beasiswa Non-APBN di lingkungan Universitas Andalas.
          </p>
        </div>

        <p className="text-blue-200 text-sm">
          © {new Date().getFullYear()} Universitas Andalas
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Masuk Sistem Beasiswa
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Email Unand
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan email unand Anda"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">
                Kata Sandi
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan kata sandi"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                className="text-[#2D60FF] hover:text-blue-800 hover:cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Lupa Password?
              </button>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-700 hover:cursor-pointer"
                onClick={() => navigate("/")}
              >
                Beranda
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Belum punya akun?{" "}
            <button
              type="button"
              className="text-[#2D60FF] font-semibold hover:text-blue-800 hover:cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Buat akun disini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
