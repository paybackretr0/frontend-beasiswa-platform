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
  });

  const [requirements, setRequirements] = useState([]);
  const [requirementType, setRequirementType] = useState("TEXT");
  const [logoFile, setLogoFile] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { warning, alerts, removeAlert } = useAlert();

  useEffect(() => {
    setFormData({
      name: initialData.name || "",
      organizer: initialData.organizer || "",
      year: initialData.year || new Date().getFullYear(),
      description: initialData.description || "",
      is_external: initialData.is_external || false,
    });

    if (initialData.requirements && initialData.requirements.length > 0) {
      const transformedReqs = initialData.requirements.map((req, index) => ({
        id: index + 1,
        type: req.requirement_type,
        text: req.requirement_text || "",
        file: null,
        existingFile: req.requirement_file || null,
      }));
      setRequirements(transformedReqs);

      const firstReqType = transformedReqs[0]?.type || "TEXT";
      setRequirementType(firstReqType);
      setIsDataLoaded(true);
    } else if (!isDataLoaded) {
      setRequirements([{ id: 1, type: "TEXT", text: "", file: null }]);
      setRequirementType("TEXT");
      setIsDataLoaded(true);
    }

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
    if (requirements.length > 1) {
      setRequirements(requirements.filter((req) => req.id !== id));
    }
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

    if (
      isDataLoaded &&
      initialData.requirements &&
      initialData.requirements.length > 0
    ) {
      const existingReqsOfType = requirements.filter(
        (req) => req.type === type
      );

      if (existingReqsOfType.length > 0) {
        setRequirements(existingReqsOfType);
      } else {
        setRequirements([{ id: 1, type: type, text: "", file: null }]);
      }
    } else {
      if (type === "FILE") {
        setRequirements([{ id: 1, type: "FILE", text: "", file: null }]);
      } else {
        setRequirements([{ id: 1, type: "TEXT", text: "", file: null }]);
      }
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

    const validRequirements = requirements.filter((req) => {
      if (req.type === "TEXT") {
        return req.text.trim() !== "";
      } else {
        return req.file !== null || req.existingFile;
      }
    });

    if (validRequirements.length === 0) {
      warning(
        "Peringatan!",
        "Mohon tambahkan minimal satu syarat dan ketentuan!"
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

  const getImageSource = (logoPath) => {
    if (logoPath) {
      return logoPath.startsWith("http")
        ? logoPath
        : `${import.meta.env.VITE_IMAGE_URL}/${logoPath}`;
    }
    return null;
  };

  const displayedRequirements = requirements.filter(
    (req) => req.type === requirementType
  );

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
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
            1
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Data Utama</h2>
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
                  id="internal-edit"
                  name="beasiswa_type"
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
                  id="external-edit"
                  name="beasiswa_type"
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
                    Pendaftaran dilakukan di website penyedia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                Hapus Logo Baru
              </button>
            </div>
          )}
          {existingLogo && (
            <div className="mt-2">
              <p className="text-xs text-blue-600">Logo saat ini tersimpan</p>
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

          {displayedRequirements.map((requirement) => (
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
                      File baru dipilih: {requirement.file.name}
                    </p>
                  )}
                  {requirement.existingFile && !requirement.file && (
                    <p className="text-xs text-blue-500 mt-1">
                      File sebelumnya:{" "}
                      <a
                        href={getImageSource(requirement.existingFile)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Lihat File
                      </a>
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
              {requirementType !== "FILE" &&
                displayedRequirements.length > 1 && (
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

export default EditStepOne;
