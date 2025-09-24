import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import Button from "../../components/Button";
import Card from "../../components/Card";
import GuestLayout from "../../layouts/GuestLayout";
import { getProfile, updateProfile } from "../../services/authService";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    nim: "",
    phone_number: "",
    gender: "",
    faculty: "",
    department: "",
  });

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
        setFormData({
          full_name: user.full_name || "",
          email: user.email || "",
          nim: user.nim || "",
          phone_number: user.phone_number || "",
          gender: user.gender || "",
          faculty: user.Faculty?.name || "N/A",
          department: user.Department?.name || "N/A",
        });
      } else {
        message.error("Gagal memuat profil");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      message.error("Terjadi kesalahan saat memuat profil");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Hanya kirim field yang bisa diupdate
      const updateData = {
        full_name: formData.full_name,
        phone_number: formData.phone_number || null,
        gender: formData.gender || null,
      };

      const response = await updateProfile(updateData);

      if (response.success) {
        message.success("Profil berhasil diperbarui!");

        // Update localStorage dengan data terbaru
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setIsEditing(false);
        // Reload profile untuk memastikan data terbaru
        await loadUserProfile();
      } else {
        message.error(response.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Terjadi kesalahan saat memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserProfile(); // Reset form
  };

  return (
    <GuestLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Profil Saya
            </h1>
            <p className="text-gray-600">
              Kelola informasi profil dan data pribadi Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Picture Card */}
            <div className="md:col-span-1">
              <Card>
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserOutlined className="text-4xl text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {formData.full_name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">Mahasiswa</p>
                  <p className="text-blue-600 text-sm font-medium">
                    NIM: {formData.nim}
                  </p>
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Informasi Cepat
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MailOutlined className="text-blue-600" />
                    <span className="text-sm truncate">{formData.email}</span>
                  </div>
                  {formData.phone_number && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <PhoneOutlined className="text-blue-600" />
                      <span className="text-sm">{formData.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-600">
                    <UserOutlined className="text-blue-600" />
                    <span className="text-sm">{formData.faculty}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <UserOutlined className="text-blue-600" />
                    <span className="text-sm">{formData.department}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="md:col-span-2">
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Data Profil
                  </h3>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm"
                    >
                      <EditOutlined className="mr-2" />
                      Edit Profil
                    </Button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Unand
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                        placeholder="Email tidak dapat diubah"
                      />
                    </div>

                    {/* NIM */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NIM
                      </label>
                      <input
                        type="text"
                        name="nim"
                        value={formData.nim}
                        disabled={true}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                        placeholder="NIM tidak dapat diubah"
                      />
                    </div>

                    {/* No. Telepon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        No. Telepon
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>

                    {/* Jenis Kelamin */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Kelamin
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !isEditing ? "bg-gray-50 text-gray-600" : ""
                        }`}
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>

                    {/* Fakultas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fakultas
                      </label>
                      <input
                        type="text"
                        name="faculty"
                        value={formData.faculty}
                        disabled={true}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                        placeholder="Fakultas berdasarkan NIM"
                      />
                    </div>
                  </div>

                  {/* Program Studi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Studi
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      disabled={true}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                      placeholder="Program studi berdasarkan NIM"
                    />
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2"
                      >
                        <SaveOutlined />
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <CloseOutlined className="mr-2" />
                        Batal
                      </button>
                    </div>
                  )}
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Profile;
