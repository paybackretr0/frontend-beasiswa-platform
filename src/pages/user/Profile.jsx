import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Button from "../../components/Button";
import Card from "../../components/Card";
import GuestLayout from "../../layouts/GuestLayout";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../services/authService";
import AlertContainer from "../../components/AlertContainer";
import useAlert from "../../hooks/useAlert";

const Profile = () => {
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    nim: "",
    phone_number: "",
    gender: "",
    birth_date: "",
    birth_place: "",
    faculty: "",
    department: "",
  });

  const [originalFormData, setOriginalFormData] = useState({});
  const [errors, setErrors] = useState({});

  const { alerts, success, error, removeAlert } = useAlert();

  useEffect(() => {
    document.title = "Profil Saya - Beasiswa";
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();

      if (response && response.data) {
        const user = response.data;
        const userData = {
          full_name: user.full_name || "",
          email: user.email || "",
          nim: user.nim || "",
          phone_number: user.phone_number || "",
          gender: user.gender || "",
          birth_date: user.birth_date ? user.birth_date.split("T")[0] : "",
          birth_place: user.birth_place || "",
          faculty: user.faculty?.name || "N/A",
          department: user.department?.name || "N/A",
        };

        setFormData(userData);
        setOriginalFormData(userData); // PERBAIKAN: Simpan data original
      } else {
        error("Gagal!", "Gagal memuat profil");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      error("Error!", "Terjadi kesalahan saat memuat profil");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      formData.phone_number &&
      !/^[0-9+\-\s()]+$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Format nomor telepon tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.current_password) {
      errors.current_password = "Password lama wajib diisi";
    }

    if (!passwordData.new_password) {
      errors.new_password = "Password baru wajib diisi";
    } else if (passwordData.new_password.length < 6) {
      errors.new_password = "Password baru minimal 6 karakter";
    }

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      errors.new_password_confirmation = "Konfirmasi password tidak sesuai";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      error("Gagal!", "Mohon perbaiki kesalahan pada form");
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });

      success("Berhasil!", "Password berhasil diubah!");
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setPasswordErrors({}); // Clear errors
    } catch (err) {
      console.error("Error changing password:", err);
      error("Gagal!", err.message || "Gagal mengubah password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      error("Gagal!", "Mohon perbaiki kesalahan pada form");
      return;
    }

    setSaveLoading(true);

    try {
      const updateData = {
        phone_number: formData.phone_number || null,
        gender: formData.gender || null,
      };

      const response = await updateProfile(updateData);

      if (response.success) {
        success("Berhasil!", "Profil berhasil diperbarui!");

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // PERBAIKAN: Update original data dan tutup edit mode
        const updatedFormData = { ...formData, ...response.data };
        setOriginalFormData(updatedFormData);
        setFormData(updatedFormData);
        setIsEditing(false);
        setErrors({}); // Clear errors

        // PERBAIKAN: Tidak perlu reload profile lagi
        // await loadUserProfile(); // HAPUS INI
      } else {
        error("Gagal!", response.message || "Gagal memperbarui profil");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      error("Gagal!", "Terjadi kesalahan saat memperbarui profil");
    } finally {
      setSaveLoading(false);
    }
  };

  // PERBAIKAN: Simplify cancel logic
  const handleCancel = () => {
    setFormData({ ...originalFormData }); // Reset ke data original
    setIsEditing(false);
    setErrors({});
    // PERBAIKAN: Tidak perlu reload data
    // loadUserProfile(); // HAPUS INI
  };

  // PERBAIKAN: Simplify edit mode
  const handleStartEdit = () => {
    setIsEditing(true);
    setErrors({});
    // PERBAIKAN: Tidak perlu clear alerts saat mulai edit
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belum diatur";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <GuestLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingOutlined className="text-4xl text-blue-600 mb-4" spin />
            <p className="text-gray-600">Memuat profil...</p>
          </div>
        </div>
      </GuestLayout>
    );
  }

  return (
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <GuestLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 text-center">
                Profil Saya
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                {/* Profile Card */}
                <Card className="text-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <UserOutlined className="text-3xl text-white" />
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {formData.full_name || "Nama Pengguna"}
                  </h2>
                  <p className="text-sm text-gray-500 mb-1">Mahasiswa</p>
                  <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-blue-700">
                      {formData.nim}
                    </span>
                  </div>
                </Card>

                {/* Quick Info Card */}
                <Card>
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Informasi Kontak
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MailOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-800 break-all">
                          {formData.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <PhoneOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-1">Telepon</p>
                        <p className="text-sm text-gray-800">
                          {formData.phone_number || "Belum diatur"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CalendarOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-1">
                          Tanggal Lahir
                        </p>
                        <p className="text-sm text-gray-800">
                          {formatDate(formData.birth_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <EnvironmentOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-1">
                          Tempat Lahir
                        </p>
                        <p className="text-sm text-gray-800">
                          {formData.birth_place || "Belum diatur"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-8">
                {/* Info Notice Card */}
                <Card className="mb-6 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <InfoCircleOutlined className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Informasi Penting
                      </h3>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        Hanya <strong>nomor telepon</strong> dan{" "}
                        <strong>jenis kelamin</strong> yang dapat diubah melalui
                        profil ini. Untuk perubahan data lainnya seperti nama,
                        email, tempat/tanggal lahir, fakultas, atau program
                        studi, silakan menghubungi
                        <strong>
                          {" "}
                          Direktorat Kemahasiswaan Universitas Andalas
                        </strong>
                        .
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Informasi Profil
                      </h2>
                      <p className="text-gray-600">
                        {isEditing
                          ? "Edit informasi profil Anda di bawah ini"
                          : "Kelola dan perbarui data profil Anda"}
                      </p>
                    </div>
                    {!isEditing && (
                      <Button
                        onClick={handleStartEdit}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm"
                      >
                        <EditOutlined className="mr-2" />
                        Edit Profil
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nama Lengkap */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          disabled={true}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                          placeholder="Tidak dapat diubah disini"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Unand
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled={true}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                          placeholder="Email tidak dapat diubah"
                        />
                      </div>

                      {/* NIM */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          NIM
                        </label>
                        <input
                          type="text"
                          name="nim"
                          value={formData.nim}
                          disabled={true}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                          placeholder="NIM tidak dapat diubah"
                        />
                      </div>

                      {/* Tempat Lahir */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tempat Lahir
                        </label>
                        <input
                          type="text"
                          name="birth_place"
                          value={formData.birth_place}
                          disabled={true}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                          placeholder="Tidak dapat diubah disini"
                        />
                      </div>

                      {/* Tanggal Lahir */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tanggal Lahir
                        </label>
                        <input
                          type="date"
                          name="birth_date"
                          value={formData.birth_date}
                          disabled={true}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                        />
                      </div>

                      {/* No. Telepon - Editable */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          No. Telepon ✏️
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            !isEditing
                              ? "bg-gray-50 text-gray-600 border-gray-200"
                              : errors.phone_number
                              ? "border-red-300 focus:ring-red-500"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          placeholder="Contoh: +62 812 3456 7890"
                        />
                        {errors.phone_number && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone_number}
                          </p>
                        )}
                      </div>

                      {/* Jenis Kelamin - Editable */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Jenis Kelamin ✏️
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            !isEditing
                              ? "bg-gray-50 text-gray-600 border-gray-200"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <option value="">Pilih jenis kelamin</option>
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                    </div>

                    {/* Fakultas & Program Studi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fakultas
                        </label>
                        <input
                          type="text"
                          name="faculty"
                          value={formData.faculty}
                          disabled={true}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                          placeholder="Fakultas berdasarkan NIM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Program Studi
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          disabled={true}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                          placeholder="Program studi berdasarkan NIM"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <Button
                          type="submit"
                          disabled={saveLoading}
                          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          {saveLoading ? (
                            <LoadingOutlined spin />
                          ) : (
                            <SaveOutlined />
                          )}
                          {saveLoading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={saveLoading}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CloseOutlined />
                          Batal
                        </button>
                      </div>
                    )}
                  </form>
                </Card>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="mt-8 p-6 bg-white rounded-2xl border border-[#DFEAF2]">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Ubah Password
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.current_password
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Masukkan password lama"
                  />
                  {passwordErrors.current_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.current_password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.new_password
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Masukkan password baru"
                  />
                  {passwordErrors.new_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.new_password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    name="new_password_confirmation"
                    value={passwordData.new_password_confirmation}
                    onChange={handlePasswordChange}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordErrors.new_password_confirmation
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Konfirmasi password baru"
                  />
                  {passwordErrors.new_password_confirmation && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.new_password_confirmation}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm"
                  >
                    {passwordLoading ? "Menyimpan..." : "Ubah Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </GuestLayout>
    </>
  );
};

export default Profile;
