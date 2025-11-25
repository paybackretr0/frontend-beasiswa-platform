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
    birth_date: "",
    birth_place: "",
    gender: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Registrasi Akun - Beasiswa";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format tanggal lahir
    if (name === "birth_date") {
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
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

    // Validasi tanggal lahir
    if (!form.birth_date) {
      error("Data Tidak Lengkap", "Tanggal lahir harus diisi");
      return false;
    }

    // Validasi umur (minimal 17 tahun)
    const birthDate = new Date(form.birth_date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 17) {
      error("Umur Tidak Valid", "Usia minimal 17 tahun untuk mendaftar");
      return false;
    }

    if (!form.birth_place.trim()) {
      error("Data Tidak Lengkap", "Tempat lahir harus diisi");
      return false;
    }

    if (!form.gender) {
      error("Data Tidak Lengkap", "Jenis kelamin harus dipilih");
      return false;
    }

    if (!form.phone_number.trim()) {
      error("Data Tidak Lengkap", "Nomor telepon harus diisi");
      return false;
    }

    // Validasi format nomor telepon Indonesia
    const phoneRegex = /^(08|628|\+628)[0-9]{8,12}$/;
    if (!phoneRegex.test(form.phone_number.replace(/\D/g, ""))) {
      error(
        "Format Tidak Valid",
        "Format nomor telepon tidak valid (contoh: 08123456789)"
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
      <div className="hidden lg:block w-0 lg:w-[60%] relative">
        <img
          src={AuthImg}
          alt="Auth Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2D60FF]/70 via-[#eaf0ff]/60 to-transparent" />
      </div>

      {/* Right: SignUp Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Buat Akun Baru
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email Student Unand <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="Masukkan email student Unand"
                required
              />
            </div>

            {/* Tempat dan Tanggal Lahir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Tempat Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="birth_place"
                  value={form.birth_place}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                  placeholder="Kota kelahiran"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={form.birth_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                  required
                />
              </div>
            </div>

            {/* Jenis Kelamin dan Nomor Telepon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF] bg-white"
                  required
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                  placeholder="08123456789"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="Minimal 6 karakter"
                required
                minLength="6"
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Konfirmasi Kata Sandi <span className="text-red-500">*</span>
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

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : "Daftar"}
              </Button>
            </div>
          </form>

          {/* Login Link */}
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
