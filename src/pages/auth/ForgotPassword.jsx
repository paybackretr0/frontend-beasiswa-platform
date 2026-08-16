import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Button from "../../components/Button";
import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "../../services/authService";
import useAlert from "../../hooks/useAlert";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    code: "",
    new_password: "",
    confirm_password: "",
  });

  const { success, error } = useAlert();

  useEffect(() => {
    document.title = "Lupa Password - Beasiswa";

    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResendCode = async () => {
    if (cooldown > 0 || resendLoading) return;

    setResendLoading(true);
    try {
      await forgotPassword({ email: formData.email });
      success("Berhasil!", "Kode reset baru telah dikirim ke email Anda.");
      setCooldown(60);
    } catch (err) {
      console.error("Error resending code:", err);
      error("Gagal!", err.message || "Gagal mengirim ulang kode.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword({ email: formData.email });
      success("Berhasil!", "Kode reset telah dikirim ke email Anda.");
      setStep(2);
    } catch (err) {
      console.error("Error sending reset email:", err);
      error("Gagal!", err.message || "Gagal mengirim kode reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyResetCode({ email: formData.email, code: formData.code });
      success("Berhasil!", "Kode reset valid. Silakan atur password baru.");
      setStep(3);
    } catch (err) {
      console.error("Error verifying reset code:", err);
      error("Gagal!", err.message || "Kode reset salah atau sudah kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.new_password !== formData.confirm_password) {
      error("Gagal!", "Password baru dan konfirmasi tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword({
        email: formData.email,
        code: formData.code,
        new_password: formData.new_password,
      });
      success("Berhasil!", "Password berhasil direset. Silakan login.");

      setTimeout(() => {
        navigate("/login", { replace: true });
        setFormData({
          email: "",
          code: "",
          new_password: "",
          confirm_password: "",
        });
      }, 1200);
    } catch (err) {
      console.error("Error resetting password:", err);
      error("Gagal!", err.message || "Gagal mereset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
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
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-8 h-0.5 ${
                        step > stepNumber ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Email</span>
              <span>Kode</span>
              <span>Password</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-8">
            {step === 1 && (
              <form onSubmit={handleSubmitEmail}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Lupa Password?
                  </h2>
                  <p className="text-slate-600">
                    Masukkan email Anda untuk menerima kode reset password
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Unand
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan email Unand Anda"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mb-4"
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Kirim Kode Reset"}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Sudah ingat password?{" "}
                    <span className="font-medium">Login</span>
                  </Link>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitCode}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Verifikasi Kode
                  </h2>
                  <p className="text-slate-600">
                    Kami telah mengirim kode 6 digit ke
                  </p>
                  <p className="text-blue-600 font-medium">{formData.email}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kode Reset (6 digit)
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex items-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeftOutlined />
                    Kembali
                  </button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Memverifikasi..." : "Verifikasi Kode"}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Tidak menerima kode?{" "}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendLoading || cooldown > 0}
                      className="font-medium transition-colors text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {resendLoading
                        ? "Mengirim..."
                        : cooldown > 0
                          ? `Kirim ulang (${cooldown}s)`
                          : "Kirim ulang"}
                    </button>
                  </p>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmitPassword}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Password Baru
                  </h2>
                  <p className="text-slate-600">
                    Buat password baru yang aman dan mudah diingat
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Minimal 6 karakter"
                      minLength={6}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ulangi password baru"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex items-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeftOutlined />
                    Kembali
                  </button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Menyimpan..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
