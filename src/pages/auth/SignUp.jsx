import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthImg from "../../assets/auth.png";
import Button from "../../components/Button";
import useAlert from "../../hooks/useAlert";
import { register } from "../../services/authService";
import AlertContainer from "../../components/AlertContainer";

const SignUp = () => {
  const navigate = useNavigate();
  const { success, error, alerts, removeAlert } = useAlert();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Registrasi Akun - Beasiswa";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.full_name.trim()) {
      error("Data Tidak Lengkap", "Nama lengkap harus diisi");
      return false;
    }

    if (!form.email.trim()) {
      error("Data Tidak Lengkap", "Email harus diisi");
      return false;
    }

    // Validasi email unand
    if (!form.email.includes("@student.unand.ac.id")) {
      error(
        "Email Tidak Valid",
        "Gunakan email student Unand (@student.unand.ac.id)"
      );
      return false;
    }

    if (form.password.length < 6) {
      error("Password Lemah", "Password minimal 6 karakter");
      return false;
    }

    if (form.password !== form.password_confirmation) {
      error(
        "Password Tidak Cocok",
        "Konfirmasi password harus sama dengan password"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await register(form);

      if (res.success) {
        success(
          "Registrasi Berhasil!",
          "Silakan cek email untuk verifikasi akun Anda"
        );

        // Redirect ke halaman verifikasi dengan email
        setTimeout(() => {
          navigate("/verify-code", {
            state: {
              email: form.email,
              message: "Kode verifikasi telah dikirim ke email Anda",
            },
          });
        }, 2000);
      } else {
        error(
          "Registrasi Gagal",
          res.message || "Terjadi kesalahan saat registrasi"
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
      error("Error", "Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      {/* Left: Background Image with Gradient */}
      <div className="hidden md:block w-0 md:w-[70%] relative">
        <img
          src={AuthImg}
          alt="Auth Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2D60FF]/70 via-[#eaf0ff]/60 to-transparent" />
      </div>

      {/* Right: SignUp Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
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
                Email Student Unand
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="Masukkan email student unand"
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
                placeholder="Masukkan kata sandi"
                required
                minLength="6"
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
                placeholder="Ulangi kata sandi"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Sudah punya akun?{" "}
            <button
              type="button"
              className="text-[#2D60FF] font-semibold hover:cursor-pointer hover:underline"
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
