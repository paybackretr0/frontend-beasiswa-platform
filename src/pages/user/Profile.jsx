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
  ExclamationCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import Button from "../../components/Button";
import GuestLayout from "../../layouts/GuestLayout";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../services/authService";

import useAlert from "../../hooks/useAlert";
import { getProfileCompleteness } from "../../utils/profileUtils";
import RequireEmailVerification from "../../components/RequireEmailVerification";
import { SkeletonProfile } from "../../components/common/skeleton";

const ProfileWithVerification = () => {
  return (
    <RequireEmailVerification>
      <Profile />
    </RequireEmailVerification>
  );
};

const Profile = () => {
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
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
    study_program: "",
  });

  const [originalFormData, setOriginalFormData] = useState({});
  const [errors, setErrors] = useState({});

  const { success, error } = useAlert();

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    document.title = "Profil Saya - Beasiswa";
    loadUserProfile();
  }, []);

  const buildProfileFormData = (user) => {
    const student = user?.student;
    const staff = user?.staff;
    const studyProgram = student?.study_program;
    const department = studyProgram?.department;
    const faculty = department?.faculty || staff?.faculty;

    return {
      full_name: user?.full_name || "",
      email: user?.email || "",
      nim: student?.nim || "",
      phone_number: user?.phone_number || "",
      gender: student?.gender || staff?.gender || "",
      birth_date: student?.birth_date ? student.birth_date.split("T")[0] : "",
      birth_place: student?.birth_place || "",
      faculty: faculty?.name || "N/A",
      department: department?.name || "N/A",
      study_program: studyProgram
        ? `${studyProgram.degree} - ${studyProgram.name}`
        : "N/A",
    };
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();

      if (response && response.data) {
        const user = response.data;
        const userData = buildProfileFormData(user);

        setFormData(userData);
        setOriginalFormData(userData);
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

    if (formData.birth_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const birthDate = new Date(formData.birth_date);
      if (birthDate > today) {
        newErrors.birth_date = "Tanggal lahir tidak boleh di masa depan";
      }
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      error("Gagal!", "Mohon perbaiki kesalahan pada form");
      return;
    }

    setIsPasswordModalVisible(true);
  };

  const confirmPasswordChange = async () => {
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
      setPasswordErrors({});
      setIsPasswordModalVisible(false);
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
        birth_date: formData.birth_date || null,
        birth_place: formData.birth_place || null,
      };

      const response = await updateProfile(updateData);

      if (response.success) {
        success("Berhasil!", "Profil berhasil diperbarui!");

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          ...response.data,
          student: currentUser.student
            ? {
                ...currentUser.student,
                gender:
                  response.data?.gender ?? currentUser.student.gender,
                birth_date:
                  response.data?.birth_date ?? currentUser.student.birth_date,
                birth_place:
                  response.data?.birth_place ?? currentUser.student.birth_place,
              }
            : currentUser.student,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        const updatedFormData = {
          ...formData,
          phone_number: response.data?.phone_number ?? formData.phone_number,
          gender: response.data?.gender ?? formData.gender,
          birth_date: response.data?.birth_date
            ? response.data.birth_date.split("T")[0]
            : formData.birth_date,
          birth_place:
            response.data?.birth_place ?? formData.birth_place,
        };
        setOriginalFormData(updatedFormData);
        setFormData(updatedFormData);
        setIsEditing(false);
        setErrors({});
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

  const handleCancel = () => {
    setFormData({ ...originalFormData });
    setIsEditing(false);
    setErrors({});
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setErrors({});
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

  const { missing: missingFields } = getProfileCompleteness({
    phone_number: formData.phone_number,
    student: formData,
  });
  const missingFieldLabels = missingFields.map((field) => field.label);
  const isProfileComplete = missingFields.length === 0;

  if (loading) {
    return (
      <GuestLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 text-center">
                Profil Saya
              </h1>
            </div>

            <SkeletonProfile />
          </div>
        </div>
      </GuestLayout>
    );
  }

  return (
    <>
      <GuestLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 text-center">
                Profil Saya
              </h1>
            </div>

            {!isProfileComplete && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <ExclamationCircleOutlined className="text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800">
                    Profil Anda belum lengkap
                  </h3>
                  <p className="text-amber-700 text-sm mt-1">
                    Lengkapi data berikut agar dapat mendaftar beasiswa:{" "}
                    <strong>{missingFieldLabels.join(", ")}</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserOutlined className="text-3xl text-white" />
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {formData.full_name || "Nama Pengguna"}
                  </h2>
                  <p className="text-sm text-slate-500 mb-1">
                    {formData.nim ? "Mahasiswa" : "Staff"}
                  </p>
                  <div className="inline-flex items-center justify-center gap-2 px-3 py-1">
                    <span className="text-sm font-medium text-blue-700">
                      {formData.nim}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Informasi Kontak
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <MailOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-sm text-slate-900 break-all">
                          {formData.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <PhoneOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 mb-1">Telepon</p>
                        <p className="text-sm text-slate-900">
                          {formData.phone_number || "Belum diatur"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <CalendarOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 mb-1">
                          Tanggal Lahir
                        </p>
                        <p className="text-sm text-slate-900">
                          {formatDate(formData.birth_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <EnvironmentOutlined className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 mb-1">
                          Tempat Lahir
                        </p>
                        <p className="text-sm text-slate-900">
                          {formData.birth_place || "Belum diatur"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="mb-6 bg-white border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                  <InfoCircleOutlined className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Informasi Penting
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Hanya <strong>nomor telepon</strong>,{" "}
                      <strong>jenis kelamin</strong>,{" "}
                      <strong>tempat lahir</strong>, dan{" "}
                      <strong>tanggal lahir</strong> yang dapat diubah melalui
                      profil ini. Untuk perubahan data lainnya seperti nama,
                      email, fakultas, atau program studi, silakan menghubungi
                      <strong>
                        {" "}
                        Direktorat Kemahasiswaan Universitas Andalas
                      </strong>
                      .
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Informasi Profil
                      </h2>
                      <p className="text-slate-600">
                        {isEditing
                          ? "Edit informasi profil Anda di bawah ini"
                          : "Kelola dan perbarui data profil Anda"}
                      </p>
                    </div>
                    {!isEditing && (
                      <Button onClick={handleStartEdit}>
                        <EditOutlined className="mr-2" />
                        Edit Profil
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          disabled={true}
                          className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-500"
                          placeholder="Tidak dapat diubah disini"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email Unand
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled={true}
                          className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-500"
                          placeholder="Email tidak dapat diubah"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          NIM
                        </label>
                        <input
                          type="text"
                          name="nim"
                          value={formData.nim}
                          disabled={true}
                          className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-500"
                          placeholder="NIM tidak dapat diubah"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Tempat Lahir
                        </label>
                        <input
                          type="text"
                          name="birth_place"
                          value={formData.birth_place}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            !isEditing
                              ? "bg-slate-50 text-slate-500 border-slate-200"
                              : "border-slate-300"
                          }`}
                          placeholder="Contoh: Padang"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Tanggal Lahir
                        </label>
                        <input
                          type="date"
                          name="birth_date"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            !isEditing
                              ? "bg-slate-50 text-slate-500 border-slate-200"
                              : errors.birth_date
                                ? "border-red-300 focus:ring-red-500"
                                : "border-slate-300"
                          }`}
                        />
                        {errors.birth_date && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.birth_date}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          No. Telepon
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            !isEditing
                              ? "bg-slate-50 text-slate-500 border-slate-200"
                              : errors.phone_number
                                ? "border-red-300 focus:ring-red-500"
                                : "border-slate-300"
                          }`}
                          placeholder="Contoh: 081234567890"
                        />
                        {errors.phone_number && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone_number}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Jenis Kelamin
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            !isEditing
                              ? "bg-slate-50 text-slate-500 border-slate-200"
                              : "border-slate-300"
                          }`}
                        >
                          <option value="">Pilih jenis kelamin</option>
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Fakultas
                        </label>
                        <input
                          type="text"
                          name="faculty"
                          value={formData.faculty}
                          disabled={true}
                          className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-500"
                          placeholder="Fakultas berdasarkan NIM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Departemen
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          disabled={true}
                          className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-500"
                          placeholder="Departemen berdasarkan NIM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Program Studi
                        </label>
                        <input
                          type="text"
                          name="study_program"
                          value={formData.study_program}
                          disabled={true}
                          className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-500"
                          placeholder="Program studi berdasarkan NIM"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                        <Button
                          type="submit"
                          variant="success"
                          disabled={saveLoading}
                          className="flex items-center justify-center gap-2"
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
                          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2"
                        >
                          <CloseOutlined />
                          Batal
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Ubah Password
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password Lama
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      className={`w-full border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordErrors.current_password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-slate-300"
                      }`}
                      placeholder="Masukkan password lama"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("current")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword.current ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </button>
                  </div>
                  {passwordErrors.current_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.current_password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      className={`w-full border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordErrors.new_password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-slate-300"
                      }`}
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword.new ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </button>
                  </div>
                  {passwordErrors.new_password && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.new_password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="new_password_confirmation"
                      value={passwordData.new_password_confirmation}
                      onChange={handlePasswordChange}
                      className={`w-full border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordErrors.new_password_confirmation
                          ? "border-red-300 focus:ring-red-500"
                          : "border-slate-300"
                      }`}
                      placeholder="Konfirmasi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword("confirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword.confirm ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </button>
                  </div>
                  {passwordErrors.new_password_confirmation && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.new_password_confirmation}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? "Menyimpan..." : "Ubah Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </GuestLayout>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined style={{ color: "#faad14" }} />
            <span>Konfirmasi Ubah Password</span>
          </div>
        }
        open={isPasswordModalVisible}
        onOk={confirmPasswordChange}
        onCancel={() => setIsPasswordModalVisible(false)}
        confirmLoading={passwordLoading}
        okText="Ya, Ubah Password"
        cancelText="Batal"
      >
        <p className="text-slate-600">
          Apakah Anda yakin ingin mengubah password akun Anda? Pastikan Anda
          mengingat password baru yang telah dibuat.
        </p>
      </Modal>
    </>
  );
};

export default ProfileWithVerification;
