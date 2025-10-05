import { useState } from "react";
import Button from "../../../components/Button";

const StepTwo = ({ onNext, onBack, initialData = {} }) => {
  const defaultDocuments = [
    "KTP/Identitas",
    "Surat Keterangan Tidak Mampu",
    "CV",
    "Sertifikat Prestasi",
    "Slip Gaji Ortu",
    "Proposal Penelitian",
    "Portofolio Karya",
    "Kartu Tanda Mahasiswa",
    "Transkrip Nilai Terbaru",
    "Essay",
    "Motivation Letter",
    "Surat Rekomendasi",
    "Foto Formal",
  ];

  const [formData, setFormData] = useState({
    start_date: initialData.start_date || "",
    end_date: initialData.end_date || "",
    quota: initialData.quota || "",
    gpa_minimum: initialData.gpa_minimum || "",
    semester_minimum: initialData.semester_minimum || "",
  });

  const [selectedDocuments, setSelectedDocuments] = useState(
    initialData.selectedDocuments || []
  );
  const [additionalDocuments, setAdditionalDocuments] = useState(
    initialData.additionalDocuments || []
  );
  const [additionalBenefits, setAdditionalBenefits] = useState(
    initialData.benefits || [{ id: 1, value: "" }]
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addDocumentField = () => {
    setAdditionalDocuments([...additionalDocuments, ""]);
  };

  const updateDocumentField = (index, value) => {
    const updatedDocuments = [...additionalDocuments];
    updatedDocuments[index] = value;
    setAdditionalDocuments(updatedDocuments);
  };

  const removeDocumentField = (index) => {
    const documentToRemove = additionalDocuments[index];

    const updatedDocuments = [...additionalDocuments];
    updatedDocuments.splice(index, 1);
    setAdditionalDocuments(updatedDocuments);

    if (documentToRemove && selectedDocuments.includes(documentToRemove)) {
      setSelectedDocuments(
        selectedDocuments.filter((selected) => selected !== documentToRemove)
      );
    }
  };

  const handleDefaultDocumentChange = (doc, isChecked) => {
    if (isChecked) {
      setSelectedDocuments([...selectedDocuments, doc]);
    } else {
      setSelectedDocuments(
        selectedDocuments.filter((selected) => selected !== doc)
      );
    }
  };

  const handleAdditionalDocumentChange = (doc, isChecked) => {
    if (doc.trim() === "") return;

    if (isChecked) {
      if (!selectedDocuments.includes(doc)) {
        setSelectedDocuments([...selectedDocuments, doc]);
      }
    } else {
      setSelectedDocuments(
        selectedDocuments.filter((selected) => selected !== doc)
      );
    }
  };

  const addBenefitField = () => {
    setAdditionalBenefits([
      ...additionalBenefits,
      { id: additionalBenefits.length + 1, value: "" },
    ]);
  };

  const updateBenefitField = (id, value) => {
    setAdditionalBenefits(
      additionalBenefits.map((benefit) =>
        benefit.id === id ? { ...benefit, value } : benefit
      )
    );
  };

  const removeBenefitField = (id) => {
    setAdditionalBenefits(
      additionalBenefits.filter((benefit) => benefit.id !== id)
    );
  };

  const handleNext = () => {
    if (
      !formData.start_date ||
      !formData.end_date ||
      !formData.semester_minimum
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    if (selectedDocuments.length === 0) {
      alert("Mohon pilih minimal satu dokumen wajib!");
      return;
    }

    const validBenefits = additionalBenefits
      .filter((benefit) => benefit.value.trim() !== "")
      .map((benefit) => benefit.value);

    const stepData = {
      ...formData,
      documents: selectedDocuments,
      benefits: validBenefits,
      selectedDocuments,
      additionalDocuments,
    };

    onNext(stepData);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Data Utama &gt;{" "}
          <span className="font-semibold">Data Teknis Pendaftaran</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
            2
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Data Teknis Pendaftaran
          </h2>
        </div>
        <hr className="border-gray-300 mb-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Mulai Pendaftaran <span className="text-red-500">*</span>
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
            Tanggal Selesai Pendaftaran <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange("end_date", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kuota/Jumlah Diterima
          </label>
          <input
            type="number"
            value={formData.quota}
            onChange={(e) => handleInputChange("quota", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            placeholder="Masukkan kuota"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IPK Minimum
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.gpa_minimum}
            onChange={(e) => handleInputChange("gpa_minimum", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            placeholder="Masukkan IPK minimum"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semester Minimum <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.semester_minimum}
            onChange={(e) =>
              handleInputChange("semester_minimum", e.target.value)
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            placeholder="Masukkan semester minimum"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Dokumen Wajib diunggah Mahasiswa{" "}
          <span className="text-red-500">*</span>
        </label>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Dokumen Standar:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultDocuments.map((doc, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDocuments.includes(doc)}
                  onChange={(e) =>
                    handleDefaultDocumentChange(doc, e.target.checked)
                  }
                />
                <span className="text-sm text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {additionalDocuments.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Dokumen Tambahan:
            </h4>
            <div className="space-y-2">
              {additionalDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      doc.trim() !== "" && selectedDocuments.includes(doc)
                    }
                    onChange={(e) =>
                      handleAdditionalDocumentChange(doc, e.target.checked)
                    }
                    disabled={doc.trim() === ""}
                  />
                  <input
                    type="text"
                    value={doc}
                    onChange={(e) => updateDocumentField(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
                    placeholder="Masukkan nama dokumen"
                  />
                  <button
                    type="button"
                    onClick={() => removeDocumentField(index)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={addDocumentField}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          + Tambah Dokumen Tambahan
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Benefit yang diterima
        </label>
        {additionalBenefits.map((benefit) => (
          <div key={benefit.id} className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={benefit.value}
              onChange={(e) => updateBenefitField(benefit.id, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="Masukkan Manfaat yang diterima"
            />
            {additionalBenefits.length > 1 && (
              <button
                type="button"
                onClick={() => removeBenefitField(benefit.id)}
                className="text-red-500 hover:text-red-700"
              >
                Hapus
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addBenefitField}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          + Tambah Benefit
        </button>
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack}>Kembali</Button>
        <Button onClick={handleNext}>Berikutnya</Button>
      </div>
    </div>
  );
};

export default StepTwo;
