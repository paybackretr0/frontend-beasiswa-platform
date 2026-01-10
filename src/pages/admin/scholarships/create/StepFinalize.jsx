import { useState } from "react";
import Button from "../../../../components/Button";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";

const StepFinalize = ({
  onBack,
  onSubmit,
  initialData = {},
  loading = false,
}) => {
  const { warning, alerts, removeAlert } = useAlert();
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (
      !formData.start_date ||
      !formData.end_date ||
      !formData.contact_person_name ||
      !formData.contact_person_email ||
      !formData.contact_person_phone ||
      !formData.scholarship_value ||
      !formData.duration_semesters
    ) {
      warning(
        "Data Belum Lengkap",
        "Mohon lengkapi semua field yang wajib diisi sebelum menyimpan"
      );
      return false;
    }

    if (isExternal && !formData.website_url) {
      warning(
        "Data Belum Lengkap",
        "Website URL wajib diisi untuk beasiswa eksternal"
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_person_email)) {
      warning(
        "Format Email Tidak Valid",
        "Mohon masukkan alamat email yang valid untuk contact person"
      );
      return false;
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.contact_person_phone)) {
      warning(
        "Format Telepon Tidak Valid",
        "Mohon masukkan nomor telepon yang valid"
      );
      return false;
    }

    if (parseFloat(formData.scholarship_value) <= 0) {
      warning(
        "Nilai Beasiswa Tidak Valid",
        "Nilai beasiswa harus lebih besar dari 0"
      );
      return false;
    }

    if (parseInt(formData.duration_semesters) <= 0) {
      warning(
        "Durasi Tidak Valid",
        "Durasi pemberian beasiswa harus lebih besar dari 0 semester"
      );
      return false;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate <= startDate) {
      warning(
        "Tanggal Tidak Valid",
        "Tanggal selesai harus lebih besar dari tanggal mulai"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
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
          Data Umum &gt; Schema Beasiswa &gt;{" "}
          <span className="font-semibold">Finalisasi</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
            3
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Finalisasi & Kontak
          </h2>
        </div>
        <hr className="border-gray-300 mb-6" />
      </div>

      {isExternal && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Beasiswa Eksternal</h3>
          <p className="text-sm text-blue-700">
            Untuk beasiswa eksternal, website URL wajib diisi sebagai referensi
            mahasiswa untuk mendaftar.
          </p>
        </div>
      )}

      {initialData.schemas && initialData.schemas.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">
            Ringkasan Schema yang Ditambahkan
          </h3>
          <div className="space-y-2">
            {initialData.schemas.map((schema, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
              >
                <div>
                  <span className="font-medium text-gray-800">
                    {index + 1}. {schema.name}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    IPK Min: {schema.gpa_minimum || "Tidak ada"} | Semester:{" "}
                    {schema.semester_minimum} | Dokumen:{" "}
                    {schema.documents?.length || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Total: <strong>{initialData.schemas.length}</strong> skema
          </p>
        </div>
      )}

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
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Kontak Person (PIC)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contact_person_name}
              onChange={(e) =>
                handleInputChange("contact_person_name", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nama PIC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.contact_person_email}
              onChange={(e) =>
                handleInputChange("contact_person_email", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="pic@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.contact_person_phone}
              onChange={(e) =>
                handleInputChange("contact_person_phone", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="08123456789"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Informasi Keuangan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nilai Beasiswa (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.scholarship_value}
              onChange={(e) =>
                handleInputChange("scholarship_value", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nilai beasiswa"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nilai yang akan diterima per mahasiswa
            </p>
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Jumlah semester"
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Berapa semester beasiswa diberikan
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Website Penyedia
          {isExternal && <span className="text-red-500 ml-1">*</span>}
        </h3>
        <input
          type="url"
          value={formData.website_url}
          onChange={(e) => handleInputChange("website_url", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com"
        />
        {isExternal ? (
          <p className="text-xs text-red-500 mt-1">
            Wajib diisi untuk beasiswa eksternal
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            URL website penyedia beasiswa (opsional untuk beasiswa internal)
          </p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Status Beasiswa</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={formData.is_active === true}
              onChange={() => handleInputChange("is_active", true)}
              className="text-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Aktif</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={formData.is_active === false}
              onChange={() => handleInputChange("is_active", false)}
              className="text-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Nonaktif</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {formData.is_active
            ? "Beasiswa akan langsung aktif dan bisa dilihat mahasiswa"
            : "Beasiswa tidak akan ditampilkan ke mahasiswa"}
        </p>
      </div>

      <div className="flex justify-between">
        <Button
          onClick={onBack}
          disabled={loading}
          className="bg-gray-500 hover:bg-gray-600"
        >
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
