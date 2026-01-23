import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { changePassword } from "../../services/authService";
import Button from "../../components/Button";
import useAlert from "../../hooks/useAlert";
import AlertContainer from "../../components/AlertContainer";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { success, error, alerts, removeAlert } = useAlert();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.new_password !== formData.confirm_password) {
      error("Gagal!", "Password baru dan konfirmasi tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.confirm_password,
      });
      success("Berhasil!", "Password berhasil diubah!");

      setTimeout(() => {
        navigate(-1);
      }, 1200);
    } catch (err) {
      console.error("Error changing password:", err);
      error("Gagal!", err.message || "Gagal mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Ubah Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password Lama
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="current_password"
                value={formData.current_password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password lama"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                tabIndex={-1}
              >
                {showPassword.current ? (
                  <EyeInvisibleOutlined className="text-lg" />
                ) : (
                  <EyeOutlined className="text-lg" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password baru"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                tabIndex={-1}
              >
                {showPassword.new ? (
                  <EyeInvisibleOutlined className="text-lg" />
                ) : (
                  <EyeOutlined className="text-lg" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimal 8 karakter, kombinasi huruf dan angka
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Konfirmasi password baru"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                tabIndex={-1}
              >
                {showPassword.confirm ? (
                  <EyeInvisibleOutlined className="text-lg" />
                ) : (
                  <EyeOutlined className="text-lg" />
                )}
              </button>
            </div>
            {formData.confirm_password && (
              <p
                className={`text-xs mt-1 ${
                  formData.new_password === formData.confirm_password
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formData.new_password === formData.confirm_password ? (
                  <>Password cocok</>
                ) : (
                  <>Password tidak cocok</>
                )}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium"
            >
              Kembali
            </button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer font-medium"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Ubah Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
