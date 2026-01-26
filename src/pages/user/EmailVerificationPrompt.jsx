import React, { useState } from "react";
import {
  MailOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Button from "../../components/Button";
import Card from "../../components/Card";
import {
  resendVerificationCode,
  verifyEmail,
} from "../../services/authService";
import useAlert from "../../hooks/useAlert";
import AlertContainer from "../../components/AlertContainer";

const EmailVerificationPrompt = ({ userEmail, onVerificationSuccess }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { success, error, alerts, removeAlert } = useAlert();

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      await resendVerificationCode(userEmail);
      success("Berhasil!", "Kode verifikasi baru telah dikirim ke email Anda");
    } catch (err) {
      error("Gagal!", err.message || "Gagal mengirim ulang kode verifikasi");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      error("Gagal!", "Mohon masukkan kode verifikasi");
      return;
    }

    try {
      setIsVerifying(true);
      await verifyEmail({ email: userEmail, code: verificationCode.trim() });
      success("Berhasil!", "Email berhasil diverifikasi!");

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      currentUser.emailVerified = true;
      localStorage.setItem("user", JSON.stringify(currentUser));

      if (onVerificationSuccess) {
        setTimeout(() => {
          onVerificationSuccess();
        }, 1500);
      }
    } catch (err) {
      error(
        "Gagal!",
        err.message || "Kode verifikasi salah atau sudah kadaluarsa",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailOutlined className="text-3xl text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verifikasi Email Diperlukan
            </h1>
            <p className="text-gray-600">
              Sebelum mengakses halaman ini, mohon verifikasi email Anda
              terlebih dahulu.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <MailOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Kode verifikasi telah dikirim ke:
                </p>
                <p className="text-sm text-blue-700 break-all">{userEmail}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Verifikasi (6 digit)
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <ReloadOutlined spin />
                  Memverifikasi...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircleOutlined />
                  Verifikasi Email
                </span>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Tidak menerima kode verifikasi?
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 cursor-pointer"
              >
                {isResending ? (
                  <span className="flex items-center justify-center gap-1">
                    <ReloadOutlined spin />
                    Mengirim ulang...
                  </span>
                ) : (
                  "Kirim ulang kode"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Kode verifikasi berlaku selama 10 menit. Pastikan Anda memeriksa
              folder spam jika tidak menemukan email.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default EmailVerificationPrompt;
