import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthImg from "../../assets/auth.png";
import Button from "../../components/Button";
import useAlert from "../../hooks/useAlert";
import AlertContainer from "../../components/AlertContainer";
import {
  verifyEmail,
  resendVerificationCode,
} from "../../services/authService";

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error, alerts, removeAlert } = useAlert();

  const [form, setForm] = useState({
    email: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    document.title = "Verifikasi Email - Beasiswa";

    if (location.state?.email) {
      setForm((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "code") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.code) {
      error("Data Tidak Lengkap", "Email dan kode verifikasi harus diisi");
      return;
    }

    if (form.code.length !== 6) {
      error("Kode Tidak Valid", "Kode verifikasi harus 6 digit");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmail(form);

      if (res.success) {
        success("Berhasil!", "Email berhasil diverifikasi. Silakan login.");

        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Email berhasil diverifikasi. Silakan login.",
              email: form.email,
            },
          });
        }, 2000);
      } else {
        error("Verifikasi Gagal", res.message || "Kode verifikasi tidak valid");
      }
    } catch (err) {
      console.error("Verification error:", err);
      error(
        "Verifikasi Gagal",
        err.message || "Terjadi kesalahan saat verifikasi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!form.email) {
      error("Email Diperlukan", "Masukkan email terlebih dahulu");
      return;
    }

    setResendLoading(true);
    try {
      const res = await resendVerificationCode(form.email);

      if (res.success) {
        success(
          "Kode Terkirim",
          "Kode verifikasi baru telah dikirim ke email Anda"
        );
      } else {
        error(
          "Gagal Kirim Ulang",
          res.message || "Gagal mengirim ulang kode verifikasi"
        );
      }
    } catch (err) {
      console.error("Resend code error:", err);
      error(
        "Gagal Kirim Ulang",
        err.message || "Terjadi kesalahan saat mengirim ulang kode"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <div className="hidden md:block w-0 md:w-[70%] relative">
        <img
          src={AuthImg}
          alt="Auth Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2D60FF]/70 via-[#eaf0ff]/60 to-transparent" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verifikasi Email
            </h2>
            <p className="text-gray-600 text-sm">
              Kami telah mengirim kode verifikasi 6 digit ke email Anda
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF] bg-gray-50"
                placeholder="Masukkan email Anda"
                required
                disabled={!!location.state?.email}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Kode Verifikasi
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#2D60FF] text-center text-xl font-mono tracking-wider"
                placeholder="000000"
                maxLength="6"
                pattern="[0-9]{6}"
                required
                autoComplete="one-time-code"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Masukkan 6 digit kode yang dikirim ke email Anda
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || form.code.length !== 6}
            >
              {loading ? "Memverifikasi..." : "Verifikasi Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Tidak menerima kode?</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || !form.email}
              className="text-[#2D60FF] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {resendLoading ? "Mengirim..." : "Kirim Ulang Kode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
