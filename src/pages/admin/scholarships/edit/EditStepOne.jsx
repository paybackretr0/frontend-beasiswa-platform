import { useState, useEffect } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../../components/Button";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";

const EditStepOne = ({ onNext, initialData = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    organizer: initialData.organizer || "",
    year: initialData.year || new Date().getFullYear(),
    description: initialData.description || "",
    is_external: initialData.is_external || false,
    verification_level: initialData.verification_level || "DITMAWA",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [existingLogo, setExistingLogo] = useState(
    initialData.existingLogo || null
  );

  const { warning, alerts, removeAlert } = useAlert();

  useEffect(() => {
    setFormData({
      name: initialData.name || "",
      organizer: initialData.organizer || "",
      year: initialData.year || new Date().getFullYear(),
      description: initialData.description || "",
      is_external: initialData.is_external || false,
      verification_level: initialData.verification_level || "DITMAWA",
    });
    setExistingLogo(initialData.existingLogo || null);
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    if (location.state?.from === "detail" && initialData.id) {
      navigate(`/admin/scholarship/${initialData.id}`);
    } else {
      navigate("/admin/scholarship");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        warning(
          "Peringatan!",
          "Format file tidak didukung. Gunakan PNG, JPG, atau JPEG."
        );
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        warning("Peringatan!", "Ukuran file terlalu besar. Maksimal 5MB.");
        e.target.value = "";
        return;
      }

      setLogoFile(file);
      setExistingLogo(null);
    }
  };

  const handleNext = () => {
    if (
      !formData.name ||
      !formData.organizer ||
      !formData.description ||
      !formData.year
    ) {
      warning("Peringatan!", "Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    const stepData = {
      ...formData,
      logoFile: logoFile,
    };

    onNext(stepData);
  };

  const getImageSource = (logoPath) => {
    if (logoPath) {
      return logoPath.startsWith("http")
        ? logoPath
        : `${import.meta.env.VITE_IMAGE_URL}/${logoPath}`;
    }
    return null;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />

      <div className="mb-6 flex items-center gap-2">
        <button
          className="text-gray-600 hover:text-blue-500 cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeftOutlined />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Beasiswa</h1>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Data Utama</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
            1
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Informasi Umum Beasiswa
          </h2>
        </div>
        <hr className="border-gray-300 mb-6" />

        {/* Jenis Beasiswa */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Beasiswa <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                !formData.is_external
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("is_external", false)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={!formData.is_external}
                  onChange={() => handleInputChange("is_external", false)}
                  className="text-blue-500"
                />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Beasiswa Internal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Beasiswa yang proses pendaftarannya dikelola oleh admin.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                formData.is_external
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("is_external", true)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={formData.is_external}
                  onChange={() => handleInputChange("is_external", true)}
                  className="text-blue-500"
                />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Beasiswa Eksternal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Beasiswa yang hanya ditampilkan sebagai informasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Beasiswa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="Masukkan nama beasiswa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sumber/Penyedia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.organizer}
              onChange={(e) => handleInputChange("organizer", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="Masukkan penyedia beasiswa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahun <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) =>
                handleInputChange("year", parseInt(e.target.value))
              }
              min="2000"
              max={new Date().getFullYear() + 1}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Singkat <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            rows="4"
            placeholder="Masukkan deskripsi singkat beasiswa"
          />
        </div>

        {/* Verification Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level Verifikasi <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.verification_level}
            onChange={(e) =>
              handleInputChange("verification_level", e.target.value)
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
          >
            <option value="FACULTY">Fakultas</option>
            <option value="DITMAWA">Ditmawa</option>
          </select>
        </div>

        {/* Logo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo Beasiswa/Penyedia
          </label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                onChange={handleLogoChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: PNG, JPG, JPEG. Maksimal 5MB.
              </p>
            </div>

            {logoFile && (
              <div className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Preview logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {existingLogo && !logoFile && (
              <div className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={getImageSource(existingLogo)}
                  alt="Existing logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {logoFile && (
            <div className="mt-2">
              <p className="text-xs text-green-600">
                File baru: {logoFile.name} (
                {(logoFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <button
                type="button"
                onClick={() => {
                  setLogoFile(null);
                  document.querySelector('input[type="file"]').value = "";
                }}
                className="text-red-500 hover:text-red-700 text-xs mt-1"
              >
                Hapus Logo Baru
              </button>
            </div>
          )}

          {existingLogo && !logoFile && (
            <p className="text-xs text-blue-600 mt-2">
              Logo saat ini tersimpan
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext}>Berikutnya</Button>
      </div>
    </div>
  );
};

export default EditStepOne;
