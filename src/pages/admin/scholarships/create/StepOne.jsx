import { useState } from "react";
import Button from "../../../../components/Button";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";

const StepOne = ({ onNext, initialData = {} }) => {
  const { warning, alerts, removeAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    organizer: initialData.organizer || "",
    year: initialData.year || new Date().getFullYear(),
    description: initialData.description || "",
    is_external: initialData.is_external || false,
    verification_level: initialData.verification_level || "DITMAWA",
  });

  const [logoFile, setLogoFile] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        warning(
          "Peringatan!",
          "Format file tidak didukung. Gunakan PNG, JPG, atau JPEG.",
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
    } else {
      setLogoFile(null);
    }
  };

  const handleNext = () => {
    if (
      !formData.name ||
      !formData.organizer ||
      !formData.description ||
      !formData.year ||
      !formData.verification_level
    ) {
      warning(
        "Data Belum Lengkap",
        "Mohon lengkapi semua field yang wajib diisi sebelum melanjutkan",
      );
      return;
    }

    const stepData = {
      ...formData,
      logoFile: logoFile,
    };

    onNext(stepData);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tambah Beasiswa Baru
        </h1>
        <p className="text-gray-600 mt-1">
          Lengkapi data umum beasiswa terlebih dahulu.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
            1
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Data Umum Beasiswa
          </h2>
        </div>
        <hr className="border-gray-300 mb-6" />

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
                  name="scholarshipType"
                  checked={!formData.is_external}
                  onChange={() => handleInputChange("is_external", false)}
                  className="text-blue-500"
                />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Beasiswa Internal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mahasiswa mendaftar langsung di sistem ini.
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
                  name="scholarshipType"
                  checked={formData.is_external}
                  onChange={() => handleInputChange("is_external", true)}
                  className="text-blue-500"
                />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Beasiswa Eksternal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hanya ditampilkan sebagai informasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!formData.is_external && (
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
            <p className="text-xs text-gray-500 mt-1">
              {formData.verification_level === "FACULTY"
                ? "Verifikasi akan dilakukan oleh Verifikator Fakultas"
                : "Verifikasi akan dilakukan oleh Verifikator Ditmawa"}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
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
              min="2024"
              max={new Date().getFullYear() + 1}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            />
          </div>
        </div>

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
          ></textarea>
        </div>

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
                Format: PNG, JPG, JPEG. Max 5MB.
              </p>
            </div>
            {logoFile && (
              <div className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext}>Berikutnya</Button>
      </div>
    </div>
  );
};

export default StepOne;
