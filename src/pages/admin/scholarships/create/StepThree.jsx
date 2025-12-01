import { useState, useEffect } from "react";
import Button from "../../../../components/Button";
import { getFaculties } from "../../../../services/facultyService";
import { getDepartments } from "../../../../services/departmentService";
import { getStudyPrograms } from "../../../../services/studyProgramService";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";

const StepThree = ({ onBack, onSubmit, initialData = {}, loading = false }) => {
  const { warning, error, alerts, removeAlert } = useAlert();
  const isExternal = initialData.is_external || false;

  const [formData, setFormData] = useState({
    contact_person_name: initialData.contact_person_name || "",
    contact_person_email: initialData.contact_person_email || "",
    contact_person_phone: initialData.contact_person_phone || "",
    is_active:
      initialData.is_active !== undefined ? initialData.is_active : true,
    scholarship_value: initialData.scholarship_value || "",
    duration_semesters: initialData.duration_semesters || "",
    website_url: initialData.website_url || "",
  });

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState(
    initialData.faculties || []
  );
  const [selectedDepartments, setSelectedDepartments] = useState(
    initialData.departments || []
  );
  const [selectedStudyPrograms, setSelectedStudyPrograms] = useState(
    initialData.study_programs || []
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchFaculties();
    fetchDepartments();
    fetchStudyPrograms();
  }, []);

  const fetchFaculties = async () => {
    try {
      const data = await getFaculties();
      setFaculties(data);
    } catch (err) {
      console.error("Error fetching faculties:", err);
      error("Gagal!", "Gagal memuat data fakultas");
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      error("Gagal!", "Gagal memuat data departemen");
    }
  };

  const fetchStudyPrograms = async () => {
    try {
      const data = await getStudyPrograms();
      setStudyPrograms(data);
    } catch (err) {
      console.error("Error fetching study programs:", err);
      error("Gagal!", "Gagal memuat data program studi");
    }
  };

  const splitIntoColumns = (data, columns) => {
    const columnData = Array.from({ length: columns }, () => []);
    data.forEach((item, index) => {
      columnData[index % columns].push(item);
    });
    return columnData;
  };

  const handleFacultyToggle = (facultyId, isChecked) => {
    if (isChecked) {
      setSelectedFaculties([...selectedFaculties, facultyId]);

      const facultyDepartments = departments
        .filter((dept) => dept.faculty_id === facultyId)
        .map((dept) => dept.id);

      const newSelectedDepartments = [
        ...new Set([...selectedDepartments, ...facultyDepartments]),
      ];
      setSelectedDepartments(newSelectedDepartments);

      const departmentPrograms = studyPrograms
        .filter((prog) => facultyDepartments.includes(prog.department_id))
        .map((prog) => prog.id);

      const newSelectedPrograms = [
        ...new Set([...selectedStudyPrograms, ...departmentPrograms]),
      ];
      setSelectedStudyPrograms(newSelectedPrograms);
    } else {
      setSelectedFaculties(selectedFaculties.filter((id) => id !== facultyId));

      const facultyDepartments = departments
        .filter((dept) => dept.faculty_id === facultyId)
        .map((dept) => dept.id);

      const newSelectedDepartments = selectedDepartments.filter(
        (id) => !facultyDepartments.includes(id)
      );
      setSelectedDepartments(newSelectedDepartments);

      const departmentPrograms = studyPrograms
        .filter((prog) => facultyDepartments.includes(prog.department_id))
        .map((prog) => prog.id);

      const newSelectedPrograms = selectedStudyPrograms.filter(
        (id) => !departmentPrograms.includes(id)
      );
      setSelectedStudyPrograms(newSelectedPrograms);
    }
  };

  const handleDepartmentToggle = (departmentId, isChecked) => {
    const department = departments.find((d) => d.id === departmentId);
    const isFacultySelected = selectedFaculties.includes(department.faculty_id);

    if (isFacultySelected && !isChecked) {
      warning(
        "Tidak Diizinkan",
        "Tidak dapat membatalkan pilihan departemen selama fakultasnya masih terpilih"
      );
      return;
    }

    if (isChecked) {
      setSelectedDepartments([...selectedDepartments, departmentId]);

      const departmentPrograms = studyPrograms
        .filter((prog) => prog.department_id === departmentId)
        .map((prog) => prog.id);

      const newSelectedPrograms = [
        ...new Set([...selectedStudyPrograms, ...departmentPrograms]),
      ];
      setSelectedStudyPrograms(newSelectedPrograms);
    } else {
      setSelectedDepartments(
        selectedDepartments.filter((id) => id !== departmentId)
      );

      const departmentPrograms = studyPrograms
        .filter((prog) => prog.department_id === departmentId)
        .map((prog) => prog.id);

      const newSelectedPrograms = selectedStudyPrograms.filter(
        (id) => !departmentPrograms.includes(id)
      );
      setSelectedStudyPrograms(newSelectedPrograms);
    }
  };

  const handleStudyProgramToggle = (programId, isChecked) => {
    const program = studyPrograms.find((p) => p.id === programId);
    const isDepartmentSelected = selectedDepartments.includes(
      program.department_id
    );

    if (isDepartmentSelected && !isChecked) {
      warning(
        "Tidak Diizinkan",
        "Tidak dapat membatalkan pilihan program studi selama departemennya masih terpilih"
      );
      return;
    }

    if (isChecked) {
      setSelectedStudyPrograms([...selectedStudyPrograms, programId]);
    } else {
      setSelectedStudyPrograms(
        selectedStudyPrograms.filter((id) => id !== programId)
      );
    }
  };

  const selectAllFaculties = () => {
    if (selectedFaculties.length === faculties.length) {
      setSelectedFaculties([]);
      setSelectedDepartments([]);
      setSelectedStudyPrograms([]);
    } else {
      const allFacultyIds = faculties.map((f) => f.id);
      const allDepartmentIds = departments.map((d) => d.id);
      const allProgramIds = studyPrograms.map((p) => p.id);

      setSelectedFaculties(allFacultyIds);
      setSelectedDepartments(allDepartmentIds);
      setSelectedStudyPrograms(allProgramIds);
    }
  };

  const selectAllDepartments = () => {
    if (selectedDepartments.length === departments.length) {
      const departmentsFromSelectedFaculties = departments
        .filter((dept) => selectedFaculties.includes(dept.faculty_id))
        .map((dept) => dept.id);

      setSelectedDepartments(departmentsFromSelectedFaculties);

      const programsFromSelectedFaculties = studyPrograms
        .filter((prog) =>
          departmentsFromSelectedFaculties.includes(prog.department_id)
        )
        .map((prog) => prog.id);

      setSelectedStudyPrograms(programsFromSelectedFaculties);
    } else {
      const allDepartmentIds = departments.map((d) => d.id);
      const allProgramIds = studyPrograms.map((p) => p.id);

      setSelectedDepartments(allDepartmentIds);
      setSelectedStudyPrograms(allProgramIds);
    }
  };

  const selectAllStudyPrograms = () => {
    if (selectedStudyPrograms.length === studyPrograms.length) {
      const programsFromSelectedDepartments = studyPrograms
        .filter((prog) => selectedDepartments.includes(prog.department_id))
        .map((prog) => prog.id);

      setSelectedStudyPrograms(programsFromSelectedDepartments);
    } else {
      const allProgramIds = studyPrograms.map((p) => p.id);
      setSelectedStudyPrograms(allProgramIds);
    }
  };

  const canUnselectDepartment = (departmentId) => {
    const department = departments.find((d) => d.id === departmentId);
    return !selectedFaculties.includes(department.faculty_id);
  };

  const canUnselectStudyProgram = (programId) => {
    const program = studyPrograms.find((p) => p.id === programId);
    return !selectedDepartments.includes(program.department_id);
  };

  const facultyColumns = splitIntoColumns(faculties, 3);
  const departmentColumns = splitIntoColumns(departments, 3);
  const studyProgramColumns = splitIntoColumns(studyPrograms, 3);

  const handleSubmit = () => {
    if (isExternal && !formData.website_url) {
      warning(
        "Data Belum Lengkap",
        "Website URL wajib diisi untuk beasiswa eksternal"
      );
      return;
    }

    if (
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
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_person_email)) {
      warning(
        "Format Email Tidak Valid",
        "Mohon masukkan alamat email yang valid untuk contact person"
      );
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

    if (parseFloat(formData.scholarship_value) <= 0) {
      warning(
        "Nilai Beasiswa Tidak Valid",
        "Nilai beasiswa harus lebih besar dari 0"
      );
      return;
    }

    if (parseInt(formData.duration_semesters) <= 0) {
      warning(
        "Durasi Tidak Valid",
        "Durasi pemberian beasiswa harus lebih besar dari 0 semester"
      );
      return;
    }

    const stepData = {
      ...formData,
      faculties: selectedFaculties,
      departments: selectedDepartments,
      study_programs: selectedStudyPrograms,
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
            Data Administrasi {isExternal && "(Beasiswa Eksternal)"}
          </h2>
        </div>
        <hr className="border-gray-300 mb-6" />
      </div>

      {isExternal && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Beasiswa Eksternal</h3>
          <p className="text-sm text-blue-700">
            Untuk beasiswa eksternal, website URL wajib diisi.
          </p>
        </div>
      )}

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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website Penyedia{" "}
          {isExternal && <span className="text-red-500">*</span>}
        </label>
        <input
          type="url"
          value={formData.website_url}
          onChange={(e) => handleInputChange("website_url", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
          placeholder="Masukkan URL website penyedia"
        />
        {isExternal && (
          <p className="text-xs text-gray-500 mt-1">
            Website URL wajib diisi untuk beasiswa eksternal
          </p>
        )}
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
        <div className="text-xs text-gray-600 mb-2">
          Memilih fakultas akan otomatis memilih semua departemen dan program
          studi di dalamnya
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
                      onChange={(e) =>
                        handleFacultyToggle(faculty.id, e.target.checked)
                      }
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
        <div className="text-xs text-gray-600 mb-2">
          Departemen yang terpilih otomatis dari fakultas tidak dapat
          dibatalkan. Memilih departemen akan otomatis memilih semua program
          studi di dalamnya.
        </div>
        <div className="border border-gray-300 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departmentColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-2">
                {column.map((department) => {
                  const canUnselect = canUnselectDepartment(department.id);
                  return (
                    <div
                      key={department.id}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(department.id)}
                        onChange={(e) =>
                          handleDepartmentToggle(
                            department.id,
                            e.target.checked
                          )
                        }
                        disabled={
                          !canUnselect &&
                          selectedDepartments.includes(department.id)
                        }
                      />
                      <span
                        className={`text-sm ${
                          !canUnselect &&
                          selectedDepartments.includes(department.id)
                            ? "text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {department.name}
                      </span>
                      {!canUnselect &&
                        selectedDepartments.includes(department.id) && (
                          <span className="text-xs text-blue-500">
                            (dari fakultas)
                          </span>
                        )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Program Studi yang Bisa Ikut
          </label>
          <button
            type="button"
            onClick={selectAllStudyPrograms}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {selectedStudyPrograms.length === studyPrograms.length
              ? "Batalkan Pilihan"
              : "Pilih Semua"}
          </button>
        </div>
        <div className="text-xs text-gray-600 mb-2">
          Program studi yang terpilih otomatis dari departemen tidak dapat
          dibatalkan.
        </div>
        <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyProgramColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-2">
                {column.map((studyProgram) => {
                  const canUnselect = canUnselectStudyProgram(studyProgram.id);
                  return (
                    <div
                      key={studyProgram.id}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudyPrograms.includes(
                          studyProgram.id
                        )}
                        onChange={(e) =>
                          handleStudyProgramToggle(
                            studyProgram.id,
                            e.target.checked
                          )
                        }
                        disabled={
                          !canUnselect &&
                          selectedStudyPrograms.includes(studyProgram.id)
                        }
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium leading-tight ${
                            !canUnselect &&
                            selectedStudyPrograms.includes(studyProgram.id)
                              ? "text-gray-400"
                              : "text-gray-700"
                          }`}
                        >
                          {studyProgram.degree} {studyProgram.department?.name}
                        </div>
                        <div className="text-xs text-gray-400 leading-tight">
                          {!canUnselect &&
                            selectedStudyPrograms.includes(studyProgram.id) && (
                              <span className="text-blue-500 ml-1">
                                (otomatis)
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Terpilih: {selectedStudyPrograms.length} program studi dari{" "}
          {selectedDepartments.length} departemen
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

      <div className="flex justify-between">
        <Button onClick={onBack} disabled={loading}>
          Kembali
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
};

export default StepThree;
