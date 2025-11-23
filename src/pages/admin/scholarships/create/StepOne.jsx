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
  });

  const [requirements, setRequirements] = useState([
    { id: 1, type: "TEXT", text: "", file: null },
  ]);
  const [requirementType, setRequirementType] = useState("TEXT");
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
    } else {
      setLogoFile(null);
    }
  };

  const addRequirementField = () => {
    if (requirementType !== "FILE") {
      setRequirements([
        ...requirements,
        {
          id: requirements.length + 1,
          type: requirementType,
          text: "",
          file: null,
        },
      ]);
    }
  };

  const removeRequirementField = (id) => {
    setRequirements(requirements.filter((req) => req.id !== id));
  };

  const updateRequirementField = (id, key, value) => {
    setRequirements(
      requirements.map((req) =>
        req.id === id ? { ...req, [key]: value } : req
      )
    );
  };

  const handleTypeChange = (type) => {
    setRequirementType(type);
    if (type === "FILE") {
      setRequirements([{ id: 1, type: "FILE", text: "", file: null }]);
    } else {
      setRequirements([{ id: 1, type: "TEXT", text: "", file: null }]);
    }
  };

  const handleNext = () => {
    if (
      !formData.name ||
      !formData.organizer ||
      !formData.description ||
      !formData.year
    ) {
      warning(
        "Data Belum Lengkap",
        "Mohon lengkapi semua field yang wajib diisi sebelum melanjutkan"
      );
      return;
    }

    const validRequirements = requirements.filter((req) => {
      if (req.type === "TEXT") {
        return req.text.trim() !== "";
      } else {
        return req.file !== null;
      }
    });

    if (validRequirements.length === 0) {
      warning(
        "Syarat Ketentuan Kosong",
        "Mohon tambahkan minimal satu syarat dan ketentuan untuk beasiswa"
      );
      return;
    }

    const stepData = {
      ...formData,
      requirements: validRequirements,
      requirementFile:
        validRequirements.find((req) => req.type === "FILE")?.file || null,
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
          Lengkapi data berikut untuk menambahkan beasiswa baru.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
            1
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Data Utama</h2>
        </div>
        <hr className="border-gray-300 mb-6" />

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
              Sumber/Penyedia Beasiswa <span className="text-red-500">*</span>
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
              max={new Date().getFullYear()}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="Masukkan tahun"
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
                Format yang didukung: PNG, JPG, JPEG. Maksimal 5MB.
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
          </div>
          {logoFile && (
            <div className="mt-2">
              <p className="text-xs text-green-600">
                File dipilih: {logoFile.name} (
                {(logoFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <button
                type="button"
                onClick={() => {
                  setLogoFile(null);
                  const fileInput = document.querySelector(
                    'input[type="file"][accept*="image"]'
                  );
                  if (fileInput) fileInput.value = "";
                }}
                className="text-red-500 hover:text-red-700 text-xs mt-1"
              >
                Hapus Logo
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Syarat dan Ketentuan <span className="text-red-500">*</span>
          </label>
          <div className="mb-4">
            <select
              value={requirementType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            >
              <option value="TEXT">Teks</option>
              <option value="FILE">File</option>
            </select>
          </div>

          {requirements.map((requirement) => (
            <div key={requirement.id} className="flex items-center gap-4 mb-4">
              {requirementType === "FILE" ? (
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      updateRequirementField(
                        requirement.id,
                        "file",
                        e.target.files[0]
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                  />
                  {requirement.file && (
                    <p className="text-xs text-gray-500 mt-1">
                      File dipilih: {requirement.file.name}
                    </p>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={requirement.text}
                  onChange={(e) =>
                    updateRequirementField(
                      requirement.id,
                      "text",
                      e.target.value
                    )
                  }
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                  placeholder="Masukkan syarat atau ketentuan"
                />
              )}
              {requirementType !== "FILE" && requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirementField(requirement.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}

          {requirementType !== "FILE" && (
            <button
              type="button"
              onClick={addRequirementField}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              + Tambah Syarat/Ketentuan
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext}>Berikutnya</Button>
      </div>
    </div>
  );
};

export default StepOne;
