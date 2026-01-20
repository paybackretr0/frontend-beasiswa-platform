import { useState, useEffect } from "react";
import Button from "../../../../components/Button";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const StepFinalize = ({
  onBack,
  onSubmit,
  initialData = {},
  loading = false,
}) => {
  const isExternal = initialData.is_external || false;

  const [formData, setFormData] = useState({
    start_date: initialData.start_date || "",
    end_date: initialData.end_date || "",
    contact_person_name: initialData.contact_person_name || "",
    contact_person_email: initialData.contact_person_email || "",
    contact_person_phone: initialData.contact_person_phone || "",
    scholarship_value: initialData.scholarship_value || "",
    duration_semesters: initialData.duration_semesters || "",
    website_url: initialData.website_url || "",
    is_active:
      initialData.is_active !== undefined ? initialData.is_active : true,
  });

  const [benefits, setBenefits] = useState(
    initialData.benefits && initialData.benefits.length > 0
      ? initialData.benefits.map((b, i) => ({
          id: i + 1,
          text: typeof b === "string" ? b : b.benefit_text || "",
        }))
      : [{ id: 1, text: "" }]
  );

  const { warning, alerts, removeAlert } = useAlert();

  useEffect(() => {
    setFormData({
      start_date: initialData.start_date || "",
      end_date: initialData.end_date || "",
      contact_person_name: initialData.contact_person_name || "",
      contact_person_email: initialData.contact_person_email || "",
      contact_person_phone: initialData.contact_person_phone || "",
      scholarship_value: initialData.scholarship_value || "",
      duration_semesters: initialData.duration_semesters || "",
      website_url: initialData.website_url || "",
      is_active:
        initialData.is_active !== undefined ? initialData.is_active : true,
    });

    setBenefits(
      initialData.benefits && initialData.benefits.length > 0
        ? initialData.benefits.map((b, i) => ({
            id: i + 1,
            text: typeof b === "string" ? b : b.benefit_text || "",
          }))
        : [{ id: 1, text: "" }]
    );
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addBenefit = () => {
    setBenefits([...benefits, { id: Date.now(), text: "" }]);
  };

  const removeBenefit = (id) => {
    if (benefits.length === 1) {
      warning("Minimal Satu Benefit", "Minimal harus ada 1 benefit/manfaat");
      return;
    }
    setBenefits(benefits.filter((b) => b.id !== id));
  };

  const updateBenefit = (id, value) => {
    setBenefits(benefits.map((b) => (b.id === id ? { ...b, text: value } : b)));
  };

  const handleSubmit = () => {
    if (!formData.start_date || !formData.end_date) {
      warning(
        "Data Belum Lengkap",
        "Tanggal mulai dan selesai pendaftaran wajib diisi"
      );
      return;
    }

    if (
      !formData.contact_person_name ||
      !formData.contact_person_email ||
      !formData.contact_person_phone
    ) {
      warning("Data Belum Lengkap", "Data contact person wajib diisi lengkap");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_person_email)) {
      warning("Format Email Tidak Valid", "Mohon masukkan email yang valid");
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.contact_person_phone)) {
      warning(
        "Format Telepon Tidak Valid",
        "Mohon masukkan nomor telepon yang valid"
      );
      return;
    }

    if (!formData.scholarship_value || !formData.duration_semesters) {
      warning(
        "Data Belum Lengkap",
        "Nilai beasiswa dan durasi pemberian wajib diisi"
      );
      return;
    }

    if (parseFloat(formData.scholarship_value) <= 0) {
      warning("Nilai Tidak Valid", "Nilai beasiswa harus lebih besar dari 0");
      return;
    }

    if (parseInt(formData.duration_semesters) <= 0) {
      warning("Durasi Tidak Valid", "Durasi harus lebih besar dari 0 semester");
      return;
    }

    if (isExternal && !formData.website_url) {
      warning(
        "Data Belum Lengkap",
        "Website URL wajib diisi untuk beasiswa eksternal"
      );
      return;
    }

    const validBenefits = benefits.filter((b) => b.text.trim() !== "");
    if (validBenefits.length === 0) {
      warning(
        "Benefit Tidak Valid",
        "Minimal harus ada 1 benefit/manfaat yang diisi"
      );
      return;
    }

    const finalData = {
      ...formData,
      benefits: validBenefits.map((b) => b.text),
    };

    onSubmit(finalData);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />

      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Data Utama &gt; Skema Beasiswa &gt;{" "}
          <span className="font-semibold">Finalisasi</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
            3
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Data Administrasi & Kontak
          </h2>
        </div>
        <hr className="border-gray-300 mb-6" />
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Periode Pendaftaran
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Selesai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Data Contact Person
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama PIC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contact_person_name}
              onChange={(e) =>
                handleInputChange("contact_person_name", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="Masukkan nama PIC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email PIC <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.contact_person_email}
              onChange={(e) =>
                handleInputChange("contact_person_email", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="pic@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telepon PIC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contact_person_phone}
              onChange={(e) =>
                handleInputChange("contact_person_phone", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="081234567890"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Informasi Finansial
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nilai Beasiswa per Penerima{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.scholarship_value}
              onChange={(e) =>
                handleInputChange("scholarship_value", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="5000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durasi Pemberian (Semester){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.duration_semesters}
              onChange={(e) =>
                handleInputChange("duration_semesters", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="4"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Manfaat/Benefit Beasiswa <span className="text-red-500">*</span>
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Sebutkan benefit yang akan didapat penerima beasiswa
        </p>
        {benefits.map((benefit, index) => (
          <div key={benefit.id} className="flex gap-2 mb-2 items-center">
            <span className="text-sm font-medium text-gray-600 w-8">
              {index + 1}.
            </span>
            <input
              type="text"
              value={benefit.text}
              onChange={(e) => updateBenefit(benefit.id, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Contoh: Bantuan uang kuliah penuh selama 4 semester"
            />
            {benefits.length > 1 && (
              <button
                onClick={() => removeBenefit(benefit.id)}
                className="text-red-500 hover:text-red-700 px-2"
              >
                <DeleteOutlined />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addBenefit}
          className="text-blue-500 hover:text-blue-700 text-sm mt-2 flex items-center gap-1"
        >
          <PlusOutlined /> Tambah Benefit
        </button>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Lainnya</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website Penyedia{" "}
              {isExternal && <span className="text-red-500">*</span>}
            </label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => handleInputChange("website_url", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="https://example.com"
            />
            {isExternal && (
              <p className="text-xs text-gray-500 mt-1">
                Wajib diisi untuk beasiswa eksternal
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Beasiswa <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.is_active ? "AKTIF" : "NONAKTIF"}
              onChange={(e) =>
                handleInputChange("is_active", e.target.value === "AKTIF")
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            >
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} disabled={loading}>
          Kembali
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Beasiswa"}
        </Button>
      </div>
    </div>
  );
};

export default StepFinalize;
