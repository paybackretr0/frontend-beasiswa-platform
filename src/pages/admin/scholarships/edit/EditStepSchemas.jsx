import { useState, useEffect } from "react";
import Button from "../../../../components/Button";
import SchemaFormModal from "../create/SchemaFormModal";
import useAlert from "../../../../hooks/useAlert";
import AlertContainer from "../../../../components/AlertContainer";
import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  AimOutlined,
} from "@ant-design/icons";

const EditStepSchemas = ({ onNext, onBack, initialData = {} }) => {
  const { warning, success: successAlert, alerts, removeAlert } = useAlert();
  const [schemas, setSchemas] = useState(initialData.schemas || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchema, setEditingSchema] = useState(null);

  useEffect(() => {
    setSchemas(initialData.schemas || []);
  }, [initialData]);

  const handleAddSchema = () => {
    setEditingSchema(null);
    setIsModalVisible(true);
  };

  const handleEditSchema = (schema) => {
    setEditingSchema(schema);
    setIsModalVisible(true);
  };

  const handleSaveSchema = (schemaData) => {
    if (editingSchema) {
      const updatedSchemas = schemas.map((s) =>
        s.id === editingSchema.id ? { ...editingSchema, ...schemaData } : s
      );
      setSchemas(updatedSchemas);
      successAlert("Berhasil!", "Skema berhasil diperbarui");
    } else {
      const newSchema = {
        id: `new-${Date.now()}`,
        ...schemaData,
      };
      setSchemas([...schemas, newSchema]);
      successAlert("Berhasil!", "Skema berhasil ditambahkan");
    }
    setIsModalVisible(false);
  };

  const handleDeleteSchema = (schemaId) => {
    if (schemas.length === 1) {
      warning("Minimal Satu Skema", "Beasiswa harus memiliki minimal 1 skema");
      return;
    }

    const confirmDelete = window.confirm(
      "Yakin ingin menghapus skema ini? Data skema akan hilang."
    );

    if (confirmDelete) {
      setSchemas(schemas.filter((s) => s.id !== schemaId));
      successAlert("Berhasil!", "Skema berhasil dihapus");
    }
  };

  const handleNext = () => {
    if (schemas.length === 0) {
      warning("Data Belum Lengkap", "Minimal harus ada 1 skema beasiswa");
      return;
    }

    for (const schema of schemas) {
      if (!schema.name || !schema.semester_minimum) {
        warning(
          "Data Skema Tidak Lengkap",
          "Semua skema harus memiliki nama dan semester minimum"
        );
        return;
      }

      if (!schema.requirements || schema.requirements.length === 0) {
        warning(
          "Syarat Tidak Lengkap",
          `Skema "${schema.name}" harus memiliki minimal 1 syarat`
        );
        return;
      }

      if (!schema.documents || schema.documents.length === 0) {
        warning(
          "Dokumen Tidak Lengkap",
          `Skema "${schema.name}" harus memiliki minimal 1 dokumen`
        );
        return;
      }

      if (!schema.stages || schema.stages.length === 0) {
        warning(
          "Tahapan Tidak Lengkap",
          `Skema "${schema.name}" harus memiliki minimal 1 tahapan`
        );
        return;
      }
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
          Data Utama &gt; <span className="font-semibold">Skema Beasiswa</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
            2
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Skema Beasiswa
          </h2>
        </div>
        <hr className="border-gray-300 mb-6" />

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Catatan:</strong> Satu beasiswa dapat memiliki beberapa
            skema dengan persyaratan berbeda. Setiap skema harus memiliki
            minimal 1 syarat, 1 dokumen, dan 1 tahapan seleksi.
          </p>
        </div>

        {schemas.length > 0 ? (
          <div className="space-y-4 mb-6">
            {schemas.map((schema, index) => (
              <div
                key={schema.id}
                className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {index + 1}. {schema.name}
                      </h3>
                      {!schema.is_active && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                          Nonaktif
                        </span>
                      )}
                    </div>

                    {schema.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {schema.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Kuota:</span>
                        <span className="ml-2 font-medium">
                          {schema.quota || "Tidak terbatas"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">IPK Min:</span>
                        <span className="ml-2 font-medium">
                          {schema.gpa_minimum || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Semester Min:</span>
                        <span className="ml-2 font-medium">
                          {schema.semester_minimum}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Syarat:</span>
                        <span className="ml-2 font-medium">
                          {schema.requirements?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileTextOutlined className="text-blue-500" />
                        {schema.documents?.length || 0} Dokumen
                      </span>
                      <span className="flex items-center gap-1">
                        <OrderedListOutlined className="text-green-500" />
                        {schema.stages?.length || 0} Tahapan
                      </span>
                      <span className="flex items-center gap-1">
                        <AimOutlined className="text-orange-500" />
                        {schema.faculties?.length || 0} Fakultas
                      </span>
                      <span className="flex items-center gap-1">
                        <AimOutlined className="text-orange-500" />
                        {schema.departments?.length || 0} Departemen
                      </span>
                      <span className="flex items-center gap-1">
                        <AimOutlined className="text-orange-500" />
                        {schema.study_programs?.length || 0} Program Studi
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditSchema(schema)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                      title="Edit Skema"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      onClick={() => handleDeleteSchema(schema.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="Hapus Skema"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg mb-6">
            <p className="text-gray-500 mb-4">Belum ada skema beasiswa</p>
            <Button onClick={handleAddSchema}>+ Tambah Skema Pertama</Button>
          </div>
        )}

        {schemas.length > 0 && (
          <button
            onClick={handleAddSchema}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
          >
            + Tambah Skema Baru
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack}>Kembali</Button>
        <Button onClick={handleNext}>Berikutnya</Button>
      </div>

      <SchemaFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveSchema}
        initialData={editingSchema}
      />
    </div>
  );
};

export default EditStepSchemas;
