import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  MailOutlined,
  KeyOutlined,
  LockOutlined,
} from "@ant-design/icons";
import Card from "../../components/Card";
import Button from "../../components/Button";
import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "../../services/authService";
import useAlert from "../../hooks/useAlert";
import AlertContainer from "../../components/AlertContainer";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    new_password: "",
    confirm_password: "",
  });

  const { success, error, alerts, removeAlert } = useAlert();

  useEffect(() => {
    document.title = "Lupa Password - Beasiswa";
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-8 h-0.5 ${
                        step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Email</span>
              <span>Kode</span>
              <span>Password</span>
            </div>
          </div>

          <Card className="w-full">
            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSubmitEmail}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailOutlined className="text-2xl text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Lupa Password?
                  </h2>
                  <p className="text-gray-600">
                    Masukkan email Anda untuk menerima kode reset password
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Unand
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Sudah ingat password?{" "}
                    <span className="font-medium">Login</span>
                  </Link>
                </div>
              </form>
            )}

            {/* Step 2: Verify Code */}
            {step === 2 && (
              <form onSubmit={handleSubmitCode}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyOutlined className="text-2xl text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Verifikasi Kode
                  </h2>
                  <p className="text-gray-600">
                    Kami telah mengirim kode 6 digit ke
                  </p>
                  <p className="text-blue-600 font-medium">{formData.email}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Reset (6 digit)
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeftOutlined />
                    Kembali
                  </button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Memverifikasi..." : "Verifikasi Kode"}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Tidak menerima kode?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        handleSubmitEmail({ preventDefault: () => {} })
                      }
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Kirim ulang
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form onSubmit={handleSubmitPassword}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LockOutlined className="text-2xl text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Password Baru
                  </h2>
                  <p className="text-gray-600">
                    Buat password baru yang aman dan mudah diingat
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Minimal 6 karakter"
                      minLength={6}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ulangi password baru"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
