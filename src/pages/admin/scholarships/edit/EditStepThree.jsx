import { useState, useEffect } from "react";
import Button from "../../../../components/Button";
import { useNavigate } from "react-router-dom";
import { getFaculties } from "../../../../services/facultyService";
import { getDepartments } from "../../../../services/departmentService";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";

const EditStepThree = ({
  onBack,
  onSubmit,
  initialData = {},
  loading = false,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contact_person_name: initialData.contact_person_name || "",
    contact_person_email: initialData.contact_person_email || "",
    contact_person_phone: initialData.contact_person_phone || "",
    is_active: initialData.is_active || true,
    scholarship_value: initialData.scholarship_value || "",
    duration_semesters: initialData.duration_semesters || "",
    website_url: initialData.website_url || "",
  });

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const { error, warning, alerts, removeAlert } = useAlert();

  useEffect(() => {
    // Set form data
    setFormData({
      contact_person_name: initialData.contact_person_name || "",
      contact_person_email: initialData.contact_person_email || "",
      contact_person_phone: initialData.contact_person_phone || "",
      is_active: initialData.is_active || true,
      scholarship_value: initialData.scholarship_value || "",
      duration_semesters: initialData.duration_semesters || "",
      website_url: initialData.website_url || "",
    });

    // Set selected faculties and departments
    setSelectedFaculties(initialData.faculties || []);
    setSelectedDepartments(initialData.departments || []);

    fetchFaculties();
    fetchDepartments();
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchFaculties = async () => {
    try {
      const data = await getFaculties();
      setFaculties(data);
    } catch (err) {
      console.error("Error fetching faculties:", err);
      error("Gagal!", err.message || "Gagal memuat data fakultas");
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      error("Gagal!", err.message || "Gagal memuat data departemen");
    }
  };

  const splitIntoColumns = (data, columns) => {
    const columnData = Array.from({ length: columns }, () => []);
    data.forEach((item, index) => {
      columnData[index % columns].push(item);
    });
    return columnData;
  };

  const facultyColumns = splitIntoColumns(faculties, 3);
  const departmentColumns = splitIntoColumns(departments, 3);

  const selectAllFaculties = () => {
    if (selectedFaculties.length === faculties.length) {
      setSelectedFaculties([]);
    } else {
      setSelectedFaculties(faculties.map((faculty) => faculty.id));
    }
  };

  const selectAllDepartments = () => {
    if (selectedDepartments.length === departments.length) {
      setSelectedDepartments([]);
    } else {
      setSelectedDepartments(departments.map((department) => department.id));
    }
  };

  const handleSubmit = () => {
    if (
      !formData.contact_person_name ||
      !formData.contact_person_email ||
      !formData.contact_person_phone ||
      !formData.scholarship_value ||
      !formData.duration_semesters
    ) {
      warning("Peringatan!", "Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_person_email)) {
      warning("Peringatan!", "Format email tidak valid!");
      return;
    }

    const stepData = {
      ...formData,
      faculties: selectedFaculties,
      departments: selectedDepartments,
    };

    onSubmit(stepData);
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
          Data Utama &gt; Data Teknis Pendaftaran &gt;{" "}
          <span className="font-semibold">Data Administrasi</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
            3
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Data Administrasi
          </h2>
        </div>
        <hr className="border-gray-300 mb-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama PIC/Contact Person <span className="text-red-500">*</span>
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
            placeholder="Masukkan email PIC"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            placeholder="Masukkan nomor telepon PIC"
          />
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

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Fakultas yang Bisa Ikut
          </label>
          <button
            type="button"
            onClick={selectAllFaculties}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {selectedFaculties.length === faculties.length
              ? "Batalkan Pilihan"
              : "Pilih Semua"}
          </button>
        </div>
        <div className="border border-gray-300 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {facultyColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-2">
                {column.map((faculty) => (
                  <div key={faculty.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFaculties.includes(faculty.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFaculties([
                            ...selectedFaculties,
                            faculty.id,
                          ]);
                        } else {
                          setSelectedFaculties(
                            selectedFaculties.filter((id) => id !== faculty.id)
                          );
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700">
                      {faculty.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Departemen yang Bisa Ikut
          </label>
          <button
            type="button"
            onClick={selectAllDepartments}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {selectedDepartments.length === departments.length
              ? "Batalkan Pilihan"
              : "Pilih Semua"}
          </button>
        </div>
        <div className="border border-gray-300 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departmentColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-2">
                {column.map((department) => (
                  <div key={department.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDepartments.includes(department.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDepartments([
                            ...selectedDepartments,
                            department.id,
                          ]);
                        } else {
                          setSelectedDepartments(
                            selectedDepartments.filter(
                              (id) => id !== department.id
                            )
                          );
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700">
                      {department.name} ({department.degree})
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nilai Beasiswa per Penerima <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.scholarship_value}
            onChange={(e) =>
              handleInputChange("scholarship_value", e.target.value)
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            placeholder="Masukkan nilai beasiswa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durasi Pemberian (Semester) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.duration_semesters}
            onChange={(e) =>
              handleInputChange("duration_semesters", e.target.value)
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            placeholder="Masukkan durasi pemberian"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website Penyedia
        </label>
        <input
          type="url"
          value={formData.website_url}
          onChange={(e) => handleInputChange("website_url", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
          placeholder="Masukkan URL website penyedia"
        />
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} disabled={loading}>
          Kembali
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
};

export default EditStepThree;
