import { useState, useEffect } from "react";
import { Modal } from "antd";
import Button from "../../../../components/Button";
import { getFaculties } from "../../../../services/facultyService";
import { getDepartments } from "../../../../services/departmentService";
import { getStudyPrograms } from "../../../../services/studyProgramService";
import useAlert from "../../../../hooks/useAlert";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import AlertContainer from "../../../../components/AlertContainer";

const SchemaFormModal = ({ visible, onClose, onSave, initialData }) => {
  const { warning, alerts, removeAlert } = useAlert();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quota: "",
    gpa_minimum: "",
    semester_minimum: "",
  });

  const [requirementType, setRequirementType] = useState("TEXT");
  const [requirements, setRequirements] = useState([
    { id: 1, type: "TEXT", text: "", file: null, fileName: "" },
  ]);

  const [documents, setDocuments] = useState([]);
  const [customDocuments, setCustomDocuments] = useState([]);
  const [newCustomDoc, setNewCustomDoc] = useState("");
  const [stages, setStages] = useState([
    { id: 1, name: "ADMINISTRASI", order_no: 1 },
  ]);

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [studyPrograms, setStudyPrograms] = useState([]);

  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedStudyPrograms, setSelectedStudyPrograms] = useState([]);

  const defaultDocuments = [
    "KTP",
    "KTM",
    "Transkrip Nilai",
    "Surat Keterangan Tidak Mampu",
    "CV",
    "Sertifikat Prestasi",
    "Essay",
    "Motivation Letter",
    "Foto 3x4",
    "Kartu Keluarga",
    "Surat Rekomendasi",
  ];

  useEffect(() => {
    if (visible) {
      fetchData();
      if (initialData) {
        loadInitialData(initialData);
      } else {
        resetForm();
      }
    }
  }, [visible, initialData]);

  const fetchData = async () => {
    try {
      const [facultiesData, departmentsData, studyProgramsData] =
        await Promise.all([
          getFaculties(),
          getDepartments(),
          getStudyPrograms(),
        ]);
      setFaculties(facultiesData);
      setDepartments(departmentsData);
      setStudyPrograms(studyProgramsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const loadInitialData = (data) => {
    setFormData({
      name: data.name || "",
      description: data.description || "",
      quota: data.quota || "",
      gpa_minimum: data.gpa_minimum || "",
      semester_minimum: data.semester_minimum || "",
    });

    const initialRequirements = data.requirements || [
      { id: 1, type: "TEXT", text: "", file: null, fileName: "" },
    ];
    setRequirements(initialRequirements);

    const firstType = initialRequirements[0]?.type || "TEXT";
    setRequirementType(firstType);

    const allDocs = data.documents || [];
    const defaultDocs = allDocs.filter((doc) => defaultDocuments.includes(doc));
    const customDocs = allDocs.filter((doc) => !defaultDocuments.includes(doc));

    setDocuments(defaultDocs);
    setCustomDocuments(customDocs);

    const sortedStages = (data.stages || [])
      .sort((a, b) => (a.order_no || 0) - (b.order_no || 0))
      .map((s, i) => ({
        id: s.id || Date.now() + i,
        name: s.name || s.stage_name,
        order_no: s.order_no || i + 1,
      }));

    setStages(
      sortedStages.length > 0
        ? sortedStages
        : [{ id: 1, name: "ADMINISTRASI", order_no: 1 }]
    );

    setSelectedFaculties(data.faculties || []);
    setSelectedDepartments(data.departments || []);
    setSelectedStudyPrograms(data.study_programs || []);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      quota: "",
      gpa_minimum: "",
      semester_minimum: "",
    });
    setRequirementType("TEXT");
    setRequirements([
      { id: 1, type: "TEXT", text: "", file: null, fileName: "" },
    ]);
    setDocuments([]);
    setCustomDocuments([]);
    setNewCustomDoc("");
    setStages([{ id: 1, name: "ADMINISTRASI", order_no: 1 }]);
    setSelectedFaculties([]);
    setSelectedDepartments([]);
    setSelectedStudyPrograms([]);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (type) => {
    setRequirementType(type);
    if (type === "FILE") {
      setRequirements([
        { id: 1, type: "FILE", text: "", file: null, fileName: "" },
      ]);
    } else {
      setRequirements([
        { id: 1, type: "TEXT", text: "", file: null, fileName: "" },
      ]);
    }
  };

  const addRequirement = () => {
    if (requirementType === "TEXT") {
      setRequirements([
        ...requirements,
        {
          id: Date.now(),
          type: "TEXT",
          text: "",
          file: null,
          fileName: "",
        },
      ]);
    }
  };

  const removeRequirement = (id) => {
    if (requirements.length === 1) {
      warning("Minimal Satu Syarat", "Minimal harus ada 1 syarat & ketentuan");
      return;
    }
    setRequirements(requirements.filter((r) => r.id !== id));
  };

  const updateRequirement = (id, field, value) => {
    setRequirements(
      requirements.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleRequirementFileChange = (id, file) => {
    if (file) {
      setRequirements(
        requirements.map((r) =>
          r.id === id ? { ...r, file: file, fileName: file.name } : r
        )
      );
    }
  };

  const removeRequirementFile = (id) => {
    setRequirements(
      requirements.map((r) =>
        r.id === id ? { ...r, file: null, fileName: "" } : r
      )
    );
  };

  const addStage = () => {
    const newOrderNo = stages.length + 1;
    setStages([...stages, { id: Date.now(), name: "", order_no: newOrderNo }]);
  };

  const removeStage = (id) => {
    if (stages.length === 1) {
      warning("Minimal Satu Tahapan", "Minimal harus ada 1 tahapan seleksi");
      return;
    }
    const updatedStages = stages
      .filter((s) => s.id !== id)
      .map((s, index) => ({ ...s, order_no: index + 1 }));
    setStages(updatedStages);
  };

  const updateStage = (id, value) => {
    setStages(stages.map((s) => (s.id === id ? { ...s, name: value } : s)));
  };

  const toggleDocument = (doc) => {
    setDocuments((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const addCustomDocument = () => {
    const trimmedDoc = newCustomDoc.trim();

    if (!trimmedDoc) {
      warning("Dokumen Kosong", "Nama dokumen tidak boleh kosong");
      return;
    }

    if (defaultDocuments.includes(trimmedDoc)) {
      warning("Dokumen Sudah Ada di Daftar", "Silakan centang saja.");
      return;
    }

    if (customDocuments.includes(trimmedDoc)) {
      warning("Dokumen Duplikat", "Dokumen custom ini sudah ditambahkan");
      return;
    }

    setCustomDocuments([...customDocuments, trimmedDoc]);
    setNewCustomDoc("");
  };

  const removeCustomDocument = (doc) => {
    setCustomDocuments(customDocuments.filter((d) => d !== doc));
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

  const handleStudyProgramToggle = (studyProgramId, isChecked) => {
    if (isChecked) {
      setSelectedStudyPrograms([...selectedStudyPrograms, studyProgramId]);
    } else {
      setSelectedStudyPrograms(
        selectedStudyPrograms.filter((id) => id !== studyProgramId)
      );
    }
  };

  const handleSelectAllFaculties = () => {
    const allFacultyIds = faculties.map((f) => f.id);
    setSelectedFaculties(allFacultyIds);
    const allDepartmentIds = departments.map((d) => d.id);
    setSelectedDepartments(allDepartmentIds);
    const allStudyProgramIds = studyPrograms.map((p) => p.id);
    setSelectedStudyPrograms(allStudyProgramIds);
  };

  const handleClearAllFaculties = () => {
    setSelectedFaculties([]);
    setSelectedDepartments([]);
    setSelectedStudyPrograms([]);
  };

  const handleSelectAllDepartments = () => {
    const facultyDepartmentIds = departments
      .filter((dept) => selectedFaculties.includes(dept.faculty_id))
      .map((dept) => dept.id);
    const availableDepartmentIds = departments
      .filter((dept) => !selectedFaculties.includes(dept.faculty_id))
      .map((dept) => dept.id);
    const newSelectedDepartments = [
      ...new Set([...selectedDepartments, ...availableDepartmentIds]),
    ];
    setSelectedDepartments(newSelectedDepartments);
    const newDepartmentPrograms = studyPrograms
      .filter((prog) => availableDepartmentIds.includes(prog.department_id))
      .map((prog) => prog.id);
    const newSelectedPrograms = [
      ...new Set([...selectedStudyPrograms, ...newDepartmentPrograms]),
    ];
    setSelectedStudyPrograms(newSelectedPrograms);
  };

  const handleClearAllDepartments = () => {
    const facultyDepartmentIds = departments
      .filter((dept) => selectedFaculties.includes(dept.faculty_id))
      .map((dept) => dept.id);
    const newSelectedDepartments = selectedDepartments.filter((id) =>
      facultyDepartmentIds.includes(id)
    );
    setSelectedDepartments(newSelectedDepartments);
    const clearedDepartmentIds = selectedDepartments.filter(
      (id) => !facultyDepartmentIds.includes(id)
    );
    const clearedDepartmentPrograms = studyPrograms
      .filter((prog) => clearedDepartmentIds.includes(prog.department_id))
      .map((prog) => prog.id);
    const newSelectedPrograms = selectedStudyPrograms.filter(
      (id) => !clearedDepartmentPrograms.includes(id)
    );
    setSelectedStudyPrograms(newSelectedPrograms);
  };

  const handleSelectAllStudyPrograms = () => {
    const facultyDepartmentIds = departments
      .filter((dept) => selectedFaculties.includes(dept.faculty_id))
      .map((dept) => dept.id);
    const allSelectedDepartmentIds = [
      ...new Set([...selectedDepartments, ...facultyDepartmentIds]),
    ];
    const availableProgramIds = studyPrograms
      .filter(
        (prog) =>
          !selectedFaculties.includes(prog.department?.faculty_id) &&
          !allSelectedDepartmentIds.includes(prog.department_id)
      )
      .map((prog) => prog.id);
    const newSelectedPrograms = [
      ...new Set([...selectedStudyPrograms, ...availableProgramIds]),
    ];
    setSelectedStudyPrograms(newSelectedPrograms);
  };

  const handleClearAllStudyPrograms = () => {
    const facultyDepartmentIds = departments
      .filter((dept) => selectedFaculties.includes(dept.faculty_id))
      .map((dept) => dept.id);
    const allSelectedDepartmentIds = [
      ...new Set([...selectedDepartments, ...facultyDepartmentIds]),
    ];
    const protectedProgramIds = studyPrograms
      .filter(
        (prog) =>
          selectedFaculties.includes(prog.department?.faculty_id) ||
          allSelectedDepartmentIds.includes(prog.department_id)
      )
      .map((prog) => prog.id);
    const newSelectedPrograms = selectedStudyPrograms.filter((id) =>
      protectedProgramIds.includes(id)
    );
    setSelectedStudyPrograms(newSelectedPrograms);
  };

  const isAllFacultiesSelected = () => {
    return (
      faculties.length > 0 && selectedFaculties.length === faculties.length
    );
  };

  const isAllDepartmentsSelected = () => {
    if (departments.length === 0) return false;
    const availableDepartments = departments.filter(
      (dept) => !selectedFaculties.includes(dept.faculty_id)
    );
    if (availableDepartments.length === 0) {
      return selectedDepartments.length === departments.length;
    }
    const availableIds = availableDepartments.map((d) => d.id);
    const allAvailableSelected = availableIds.every((id) =>
      selectedDepartments.includes(id)
    );
    return allAvailableSelected;
  };

  const isAllStudyProgramsSelected = () => {
    if (studyPrograms.length === 0) return false;
    const facultyDepartmentIds = departments
      .filter((dept) => selectedFaculties.includes(dept.faculty_id))
      .map((dept) => dept.id);
    const allSelectedDepartmentIds = [
      ...new Set([...selectedDepartments, ...facultyDepartmentIds]),
    ];
    const availablePrograms = studyPrograms.filter(
      (prog) =>
        !selectedFaculties.includes(prog.department?.faculty_id) &&
        !allSelectedDepartmentIds.includes(prog.department_id)
    );
    if (availablePrograms.length === 0) {
      return selectedStudyPrograms.length === studyPrograms.length;
    }
    const availableIds = availablePrograms.map((p) => p.id);
    const allAvailableSelected = availableIds.every((id) =>
      selectedStudyPrograms.includes(id)
    );
    return allAvailableSelected;
  };

  const handleSave = () => {
    if (!formData.name || !formData.semester_minimum) {
      warning(
        "Data Belum Lengkap",
        "Nama skema dan semester minimum wajib diisi"
      );
      return;
    }

    const validRequirements = requirements.filter((r) => {
      if (r.type === "TEXT") {
        return r.text.trim() !== "";
      } else {
        return r.file !== null;
      }
    });

    if (validRequirements.length === 0) {
      warning("Syarat Tidak Valid", "Minimal harus ada 1 syarat yang diisi");
      return;
    }

    if (stages.some((s) => !s.name.trim())) {
      warning("Tahapan Tidak Valid", "Semua tahapan harus diisi");
      return;
    }

    const allDocuments = [...documents, ...customDocuments];

    if (allDocuments.length === 0) {
      warning(
        "Dokumen Wajib",
        "Pilih minimal 1 dokumen yang wajib diunggah mahasiswa"
      );
      return;
    }

    const schemaData = {
      ...formData,
      requirements: validRequirements.map((r) => ({
        id: r.id,
        type: r.type,
        text: r.type === "TEXT" ? r.text : null,
        file: r.type === "FILE" ? r.file : null,
        fileName: r.type === "FILE" ? r.fileName : null,
      })),
      documents: allDocuments,
      stages: stages.map((s, index) => ({
        name: s.name,
        stage_name: s.name,
        order_no: index + 1,
      })),
      faculties: selectedFaculties,
      departments: selectedDepartments,
      study_programs: selectedStudyPrograms,
    };

    onSave(schemaData);
    onClose();
  };

  return (
    <>
      <div style={{ position: "relative", zIndex: 1050 }}>
        <AlertContainer
          alerts={alerts}
          onRemove={removeAlert}
          position="top-right"
        />
      </div>
      <Modal
        title={initialData ? "Edit Skema" : "Tambah Skema Baru"}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
        destroyOnHidden
      >
        <div className="max-h-[70vh] overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Informasi Skema
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Skema <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Contoh: Prestasi Akademik"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows="2"
                  placeholder="Deskripsi singkat skema"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kuota Penerima
                </label>
                <input
                  type="number"
                  value={formData.quota}
                  onChange={(e) => handleInputChange("quota", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Kosongkan jika tidak terbatas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IPK Minimum
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="4.00"
                  value={formData.gpa_minimum}
                  onChange={(e) =>
                    handleInputChange("gpa_minimum", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Contoh: 3.00"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester Minimum <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.semester_minimum}
                  onChange={(e) =>
                    handleInputChange("semester_minimum", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Contoh: 3"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Syarat & Ketentuan <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Pilih tipe: Teks (bisa banyak) atau File PDF (hanya 1 file)
            </p>

            <div className="mb-4">
              <select
                value={requirementType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-sm"
              >
                <option value="TEXT">Teks</option>
                <option value="FILE">File PDF</option>
              </select>
            </div>

            {requirements.map((req, index) => (
              <div key={req.id} className="mb-3">
                {requirementType === "FILE" ? (
                  <div>
                    {req.fileName ? (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                        <span className="text-sm text-blue-700 flex-1">
                          {req.fileName}
                        </span>
                        <button
                          onClick={() => removeRequirementFile(req.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <UploadOutlined className="text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Klik untuk upload file PDF syarat & ketentuan
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            handleRequirementFileChange(
                              req.id,
                              e.target.files[0]
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={req.text}
                      onChange={(e) =>
                        updateRequirement(req.id, "text", e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder={`Masukkan syarat ${index + 1}`}
                    />
                    {requirements.length > 1 && (
                      <button
                        onClick={() => removeRequirement(req.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {requirementType === "TEXT" && (
              <button
                onClick={addRequirement}
                className="text-blue-500 hover:text-blue-700 text-sm mt-2"
              >
                + Tambah Syarat
              </button>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Tahapan Seleksi <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Urutan tahapan seleksi beasiswa (otomatis terurut)
            </p>
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex gap-2 mb-2 items-center">
                <span className="text-sm font-medium text-gray-600 w-8">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={stage.name}
                  onChange={(e) => updateStage(stage.id, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Contoh: ADMINISTRASI, WAWANCARA, PENGUMUMAN"
                />
                {stages.length > 1 && (
                  <button
                    onClick={() => removeStage(stage.id)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    <DeleteOutlined />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addStage}
              className="text-blue-500 hover:text-blue-700 text-sm mt-2"
            >
              + Tambah Tahapan
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Dokumen Wajib <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Pilih dokumen yang wajib diunggah oleh mahasiswa saat mendaftar
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dokumen Umum (Pilih dari daftar)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border p-3 rounded bg-gray-50">
                {defaultDocuments.map((doc) => (
                  <div key={doc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`doc-${doc}`}
                      checked={documents.includes(doc)}
                      onChange={(e) => toggleDocument(doc)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`doc-${doc}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {doc}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {documents.length} dokumen dipilih
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dokumen Lainnya (Tambah manual)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCustomDoc}
                  onChange={(e) => setNewCustomDoc(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomDocument()}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Contoh: Surat Keterangan Bekerja"
                />
                <Button
                  onClick={addCustomDocument}
                  className="!px-4 !py-2 whitespace-nowrap"
                >
                  +
                </Button>
              </div>
            </div>

            {customDocuments.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dokumen Lainnya Ditambahkan
                </label>
                <div className="border rounded bg-blue-50 p-3 space-y-2">
                  {customDocuments.map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded border border-blue-200"
                    >
                      <span className="text-sm text-gray-700">{doc}</span>
                      <button
                        onClick={() => removeCustomDocument(doc)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  {customDocuments.length} dokumen ditambahkan
                </p>
              </div>
            )}

            <div className="bg-gray-100 p-3 rounded border border-gray-300">
              <p className="text-sm font-medium text-gray-700">
                Total:{" "}
                <span className="text-blue-600">
                  {documents.length + customDocuments.length}
                </span>{" "}
                dokumen wajib
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Target Mahasiswa
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Pilih fakultas/departemen/prodi yang dapat mendaftar skema ini
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Fakultas
                  </label>
                  <div className="flex gap-2">
                    {isAllFacultiesSelected() ? (
                      <button
                        onClick={handleClearAllFaculties}
                        className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Hapus Semua
                      </button>
                    ) : (
                      <button
                        onClick={handleSelectAllFaculties}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Pilih Semua
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                  {faculties.map((faculty) => (
                    <div key={faculty.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`faculty-${faculty.id}`}
                        checked={selectedFaculties.includes(faculty.id)}
                        onChange={(e) =>
                          handleFacultyToggle(faculty.id, e.target.checked)
                        }
                        className="cursor-pointer"
                      />
                      <label
                        htmlFor={`faculty-${faculty.id}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {faculty.name}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedFaculties.length} dari {faculties.length} fakultas
                  dipilih
                  {isAllFacultiesSelected() && (
                    <span className="text-green-600 font-medium ml-2">
                      Semua dipilih
                    </span>
                  )}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Departemen
                  </label>
                  <div className="flex gap-2">
                    {isAllDepartmentsSelected() ? (
                      <button
                        onClick={handleClearAllDepartments}
                        className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Hapus Semua
                      </button>
                    ) : (
                      <button
                        onClick={handleSelectAllDepartments}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Pilih Semua
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                  {departments.map((dept) => {
                    const isDisabled = selectedFaculties.includes(
                      dept.faculty_id
                    );

                    return (
                      <div
                        key={dept.id}
                        className={`flex items-center gap-2 ${
                          isDisabled ? "opacity-50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`dept-${dept.id}`}
                          checked={selectedDepartments.includes(dept.id)}
                          onChange={(e) =>
                            handleDepartmentToggle(dept.id, e.target.checked)
                          }
                          disabled={isDisabled}
                          className="cursor-pointer disabled:cursor-not-allowed"
                        />
                        <label
                          htmlFor={`dept-${dept.id}`}
                          className={`text-sm text-gray-700 ${
                            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                          }`}
                        >
                          {dept.name}
                          {isDisabled && (
                            <span className="text-xs text-blue-600 ml-1">
                              (via fakultas)
                            </span>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedDepartments.length} dari {departments.length}{" "}
                  departemen dipilih
                  {isAllDepartmentsSelected() && (
                    <span className="text-green-600 font-medium ml-2">
                      Semua dipilih
                    </span>
                  )}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Program Studi
                  </label>
                  <div className="flex gap-2">
                    {isAllStudyProgramsSelected() ? (
                      <button
                        onClick={handleClearAllStudyPrograms}
                        className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Hapus Semua
                      </button>
                    ) : (
                      <button
                        onClick={handleSelectAllStudyPrograms}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Pilih Semua
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                  {studyPrograms.map((prog) => {
                    const isDisabledByFaculty = selectedFaculties.includes(
                      prog.department?.faculty_id
                    );
                    const isDisabledByDepartment = selectedDepartments.includes(
                      prog.department_id
                    );
                    const isDisabled =
                      isDisabledByFaculty || isDisabledByDepartment;

                    return (
                      <div
                        key={prog.id}
                        className={`flex items-center gap-2 ${
                          isDisabled ? "opacity-50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`prog-${prog.id}`}
                          checked={selectedStudyPrograms.includes(prog.id)}
                          onChange={(e) =>
                            handleStudyProgramToggle(prog.id, e.target.checked)
                          }
                          disabled={isDisabled}
                          className="cursor-pointer disabled:cursor-not-allowed"
                        />
                        <label
                          htmlFor={`prog-${prog.id}`}
                          className={`text-sm text-gray-700 ${
                            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                          }`}
                        >
                          {prog.degree} {prog.department.name}
                          {isDisabledByFaculty && (
                            <span className="text-xs text-blue-600 ml-1">
                              (via fakultas)
                            </span>
                          )}
                          {isDisabledByDepartment && !isDisabledByFaculty && (
                            <span className="text-xs text-green-600 ml-1">
                              (via departemen)
                            </span>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedStudyPrograms.length} dari {studyPrograms.length}{" "}
                  program studi dipilih
                  {isAllStudyProgramsSelected() && (
                    <span className="text-green-600 font-medium ml-2">
                      Semua dipilih
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
              Batal
            </Button>
            <Button onClick={handleSave}>Simpan Skema</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SchemaFormModal;
