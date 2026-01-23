import { useState } from "react";
import Button from "../../../../components/Button";
import SchemaFormModal from "./SchemaFormModal";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const StepSchemas = ({ onNext, onBack, initialData = {} }) => {
  const { warning, success: successAlert, alerts, removeAlert } = useAlert();
  const [schemas, setSchemas] = useState(initialData.schemas || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchema, setEditingSchema] = useState(null);

  const handleAddSchema = () => {
    setEditingSchema(null);
    setIsModalVisible(true);
  };

  const handleEditSchema = (schema, index) => {
    setEditingSchema({ ...schema, index });
    setIsModalVisible(true);
  };

  const handleDeleteSchema = (index) => {
    if (schemas.length === 1) {
      warning(
        "Tidak Dapat Dihapus",
        "Minimal harus ada 1 skema untuk beasiswa ini",
      );
      return;
    }

    const updatedSchemas = schemas.filter((_, i) => i !== index);
    setSchemas(updatedSchemas);
    successAlert("Berhasil!", "Skema berhasil dihapus");
  };

  const handleSaveSchema = (schemaData) => {
    if (editingSchema !== null && editingSchema.index !== undefined) {
      const updatedSchemas = [...schemas];
      updatedSchemas[editingSchema.index] = schemaData;
      setSchemas(updatedSchemas);
      successAlert("Berhasil!", "Skema berhasil diperbarui");
    } else {
      setSchemas([...schemas, schemaData]);
      successAlert("Berhasil!", "Skema berhasil ditambahkan");
    }
  };

  const handleNext = () => {
    if (schemas.length === 0) {
      warning(
        "Skema Belum Ada",
        "Mohon tambahkan minimal 1 skema beasiswa sebelum melanjutkan",
      );
      return;
    }

    const invalidSchema = schemas.find(
      (schema) =>
        !schema.name ||
        !schema.semester_minimum ||
        schema.stages?.length === 0 ||
        schema.documents?.length === 0,
    );

    if (invalidSchema) {
      warning(
        "Skema Tidak Lengkap",
        "Setiap skema harus memiliki nama, semester minimum, tahapan, dan dokumen",
      );
      return;
    }

    onNext({ schemas });
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
          Data Umum &gt; <span className="font-semibold">Skema Beasiswa</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
              2
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              Skema Beasiswa
            </h2>
          </div>
          <Button onClick={handleAddSchema} className="flex items-center gap-2">
            <PlusOutlined />
            Tambah Skema
          </Button>
        </div>
        <hr className="border-gray-300 mb-6" />
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">
          Tentang Skema Beasiswa
        </h3>
        <p className="text-sm text-blue-700 mb-2">
          Skema adalah variasi dari beasiswa yang sama dengan persyaratan
          berbeda.
        </p>
        <p className="text-sm text-blue-700">
          <strong>Contoh:</strong> Beasiswa Prestasi 2025 bisa memiliki 2 skema:
          <br />
          • Skema "Prestasi Akademik" (IPK &gt; 3.5, dokumen transkrip)
          <br />• Skema "Prestasi Non-Akademik" (IPK &gt; 3.0, sertifikat
          prestasi)
        </p>
      </div>

      {schemas.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <PlusOutlined style={{ fontSize: "48px" }} />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Belum Ada Skema
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Tambahkan minimal 1 skema untuk beasiswa ini
          </p>
          <Button onClick={handleAddSchema}>
            <PlusOutlined /> Tambah Skema Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {schemas.map((schema, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {schema.name}
                    </h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <CheckCircleOutlined />
                      Aktif
                    </span>
                  </div>

                  {schema.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {schema.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-gray-500">Kuota</span>
                      <p className="text-sm font-medium text-gray-800">
                        {schema.quota || "Tidak Terbatas"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">IPK Min</span>
                      <p className="text-sm font-medium text-gray-800">
                        {schema.gpa_minimum || "Tidak Ada"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">
                        Semester Min
                      </span>
                      <p className="text-sm font-medium text-gray-800">
                        {schema.semester_minimum}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Dokumen</span>
                      <p className="text-sm font-medium text-gray-800">
                        {schema.documents?.length || 0} dokumen
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs text-gray-500">Tahapan:</span>
                    {schema.stages?.map((stage, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {stage.name || stage.stage_name}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500">Target:</span>
                    <span className="text-xs text-gray-700">
                      {schema.faculties?.length || 0} Fakultas,{" "}
                      {schema.departments?.length || 0} Departemen,{" "}
                      {schema.study_programs?.length || 0} Prodi
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSchema(schema, index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Schema"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    onClick={() => handleDeleteSchema(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Schema"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {schemas.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">
                Total Skema: {schemas.length}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Beasiswa ini memiliki {schemas.length} variasi skema
              </p>
            </div>
            <Button
              onClick={handleAddSchema}
              className="bg-green-500 hover:bg-green-600"
            >
              <PlusOutlined /> Tambah Skema Lagi
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button onClick={onBack}>Kembali</Button>
        <Button onClick={handleNext}>Berikutnya</Button>
      </div>

      <SchemaFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveSchema}
        initialData={editingSchema}
        isExternal={initialData.is_external}
      />
    </div>
  );
};

export default StepSchemas;
