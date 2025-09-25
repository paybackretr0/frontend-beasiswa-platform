import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthImg from "../../assets/auth.png";
import Button from "../../components/Button";
import { login } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login - Beasiswa";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);

    if (res?.data?.access_token) {
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // cek role untuk redirect
      if (res.data.user.role === "MAHASISWA") {
        navigate("/", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    } else {
      setError(res.message || "Login gagal");
    }
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
      {/* Right: Login Form Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-600 mb-6 text-center">
            Masuk Sistem Beasiswa
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
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
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                className="text-[#2D60FF] hover:cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Lupa Password?
              </button>
              <button
                type="button"
                className="text-gray-500 hover:cursor-pointer"
                onClick={() => navigate("/")}
              >
                Beranda
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Belum punya akun?{" "}
            <button
              type="button"
              className="text-[#2D60FF] font-semibold hover:cursor-pointer"
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
