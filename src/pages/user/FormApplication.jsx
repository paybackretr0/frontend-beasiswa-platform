import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Input,
  Select,
  DatePicker,
  Upload,
  Alert,
  Button,
  Modal,
  Checkbox,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Card from "../../components/Card";
import GuestLayout from "../../layouts/GuestLayout";
import {
  getScholarshipForm,
  submitApplication,
  saveDraft,
  submitRevision,
  getPreviousFiles,
} from "../../services/pendaftaranService";
import { getApplicationDetailUser } from "../../services/applicationService";

import useAlert from "../../hooks/useAlert";
import RequireEmailVerification from "../../components/RequireEmailVerification";
import { SkeletonFormApplication } from "../../components/common/skeleton";

const { TextArea } = Input;
const { Option } = Select;

const FormApplicationWithVerification = () => {
  return (
    <RequireEmailVerification>
      <FormApplication />
    </RequireEmailVerification>
  );
};

const statusApplications = {
  DRAFT: "DRAFT",
  MENUNGGU_VERIFIKASI: "MENUNGGU VERIFIKASI",
  VERIFIED: "TERVERIFIKASI - MENUNGGU VALIDASI",
  REJECTED: "DITOLAK",
  VALIDATED: "DISETUJUI",
  REVISION_NEEDED: "PERLU REVISI",
};

const getCleanFileName = (filePath) => {
  if (!filePath) return "Unknown file";
  const fullFileName = filePath.split("\\").pop();
  const match = fullFileName.match(/^\d+-(.+)$/);
  return match ? match[1] : fullFileName;
};

const normalizeLabel = (label) =>
  String(label || "")
    .trim()
    .toLowerCase();

const parseNumberAnswer = (value) => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim().replace(",", ".");
  if (normalized === "") return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const getOptionValue = (option) =>
  typeof option === "object" && option !== null ? option.id : option;

const getOptionLabel = (option) =>
  typeof option === "object" && option !== null ? option.value : option;

const FormApplication = () => {
  const { id: scholarshipId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const schemaIdFromUrl = searchParams.get("schema");
  const revisionIdFromUrl = searchParams.get("revision");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scholarship, setScholarship] = useState(null);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [availableSchemas, setAvailableSchemas] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [answers, setAnswers] = useState({});
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingStatus, setExistingStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [revisionApplicationId, setRevisionApplicationId] = useState(null);
  const [previousFiles, setPreviousFiles] = useState([]);
  const [usePreviousFile, setUsePreviousFile] = useState({});

  const { success, warning, error } = useAlert();

  useEffect(() => {
    loadForm();
  }, [scholarshipId, schemaIdFromUrl, revisionIdFromUrl]);

  const loadForm = async () => {
    try {
      setLoading(true);

      if (revisionIdFromUrl) {
        setIsRevisionMode(true);
        setRevisionApplicationId(revisionIdFromUrl);

        const revisionData = await getApplicationDetailUser(revisionIdFromUrl);

        const scholarshipId = revisionData.scholarship_id;
        const schemaId = revisionData.schema_id;

        if (!scholarshipId || !schemaId) {
          throw new Error("Data beasiswa tidak lengkap");
        }

        const formData = await getScholarshipForm(scholarshipId, schemaId);

        setScholarship(formData.scholarship);
        setSelectedSchema(formData.selected_schema);
        setAvailableSchemas(formData.available_schemas);
        setFormFields(formData.form_fields);

        const existingAnswers = {};
        formData.form_fields.forEach((field) => {
          const existingAnswer = formData.existing_answers?.[field.id];

          if (existingAnswer) {
            if (field.type === "FILE") {
              existingAnswers[field.id] = existingAnswer.file_path
                ? {
                    name: getCleanFileName(existingAnswer.file_path),
                    path: existingAnswer.file_path,
                    mime_type: existingAnswer.mime_type,
                  }
                : null;
            } else if (field.type === "MULTI_SELECT") {
              existingAnswers[field.id] =
                existingAnswer.selected_option_ids || [];
            } else if (field.type === "SELECT") {
              existingAnswers[field.id] =
                existingAnswer.selected_option_ids?.[0] ||
                existingAnswer.answer_text ||
                "";
            } else {
              existingAnswers[field.id] = existingAnswer.answer_text || "";
            }
          } else {
            existingAnswers[field.id] =
              field.type === "FILE"
                ? null
                : field.type === "MULTI_SELECT"
                  ? []
                  : "";
          }
        });

        setAnswers(existingAnswers);

        document.title = `Revisi Pendaftaran ${formData.scholarship.name}`;
      } else {
        const data = await getScholarshipForm(scholarshipId, schemaIdFromUrl);

        setScholarship(data.scholarship);
        setSelectedSchema(data.selected_schema);
        setAvailableSchemas(data.available_schemas);
        setFormFields(data.form_fields);
        setHasExistingApplication(data.has_existing_application);
        setExistingStatus(data.existing_application_status);

        const initialAnswers = {};
        data.form_fields.forEach((field) => {
          const existingAnswer = data.existing_answers?.[field.id];

          if (existingAnswer) {
            if (field.type === "FILE") {
              initialAnswers[field.id] = existingAnswer.file_path
                ? {
                    name: getCleanFileName(existingAnswer.file_path),
                    path: existingAnswer.file_path,
                  }
                : null;
            } else if (field.type === "MULTI_SELECT") {
              initialAnswers[field.id] =
                existingAnswer.selected_option_ids || [];
            } else if (field.type === "SELECT") {
              initialAnswers[field.id] =
                existingAnswer.selected_option_ids?.[0] ||
                existingAnswer.answer_text ||
                "";
            } else {
              initialAnswers[field.id] = existingAnswer.answer_text || "";
            }
          } else {
            initialAnswers[field.id] =
              field.type === "FILE"
                ? null
                : field.type === "MULTI_SELECT"
                  ? []
                  : "";
          }
        });

        setAnswers(initialAnswers);
        document.title = `Daftar ${data.scholarship.name} - ${data.selected_schema.name}`;
      }

      const prevFiles = await getPreviousFiles();
      setPreviousFiles(prevFiles || []);
    } catch (err) {
      console.error("Error loading form:", err);
      error("Gagal!", err.message || "Gagal memuat form pendaftaran.");
      setTimeout(() => {
        navigate("/scholarship");
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (fieldId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = formFields.filter((field) => field.is_required);

    for (const field of requiredFields) {
      const value = answers[field.id];

      if (field.type === "FILE") {
        if (field.is_required && !value) {
          newErrors[field.id] = `${field.label} wajib diunggah`;
        } else if (value instanceof File && value.size > 5 * 1024 * 1024) {
          newErrors[field.id] = `${field.label} tidak boleh lebih dari 5MB`;
        }
      } else if (field.type === "MULTI_SELECT") {
        if (!Array.isArray(value) || value.length === 0) {
          newErrors[field.id] = `${field.label} wajib dipilih`;
        }
      } else {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field.id] = `${field.label} wajib diisi`;
        }
      }
    }

    const gpaMinimum =
      selectedSchema?.gpa_minimum !== undefined &&
      selectedSchema?.gpa_minimum !== null
        ? Number(selectedSchema.gpa_minimum)
        : null;
    if (Number.isFinite(gpaMinimum)) {
      const gpaField = formFields.find(
        (field) =>
          field.type === "NUMBER" &&
          normalizeLabel(field.label).includes("ipk"),
      );

      if (gpaField) {
        const gpaValue = parseNumberAnswer(answers[gpaField.id]);
        if (gpaValue === null) {
          newErrors[gpaField.id] = "IPK harus berupa angka";
        } else if (gpaValue < gpaMinimum) {
          newErrors[gpaField.id] =
            `IPK tidak memenuhi syarat minimum (min: ${gpaMinimum})`;
        }
      }
    }

    const semesterMinimum =
      selectedSchema?.semester_minimum !== undefined &&
      selectedSchema?.semester_minimum !== null
        ? Number(selectedSchema.semester_minimum)
        : null;
    if (Number.isFinite(semesterMinimum)) {
      const semesterField = formFields.find(
        (field) =>
          field.type === "NUMBER" &&
          normalizeLabel(field.label).includes("semester"),
      );

      if (semesterField) {
        const semesterValue = parseNumberAnswer(answers[semesterField.id]);
        if (semesterValue === null) {
          newErrors[semesterField.id] = "Semester harus berupa angka";
        } else if (!Number.isInteger(semesterValue)) {
          newErrors[semesterField.id] = "Semester harus berupa bilangan bulat";
        } else if (semesterValue < semesterMinimum) {
          newErrors[semesterField.id] =
            `Semester tidak memenuhi syarat minimum (min: ${semesterMinimum})`;
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const hasEligibilityError = formFields.some((field) => {
        const label = normalizeLabel(field.label);
        return (
          newErrors[field.id] &&
          (label.includes("ipk") || label.includes("semester"))
        );
      });

      warning(
        "Peringatan!",
        hasEligibilityError
          ? "IPK/Semester tidak memenuhi syarat minimum"
          : "Mohon lengkapi semua field yang wajib diisi",
      );
      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    try {
      setSubmitting(true);
      await saveDraft(scholarshipId, selectedSchema.id, answers);
      success("Berhasil!", "Draft berhasil disimpan");
    } catch (err) {
      error("Gagal!", err.message || "Gagal menyimpan draft.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      if (isRevisionMode) {
        await submitRevision(revisionApplicationId, answers);
        success("Berhasil!", "Revisi berhasil disubmit!");
        setTimeout(() => {
          navigate("/history");
        }, 1200);
      } else {
        await submitApplication(
          scholarshipId,
          selectedSchema.id,
          answers,
          false,
        );
        success("Berhasil!", "Pendaftaran berhasil disubmit!");
        setTimeout(() => {
          navigate("/history");
        }, 1200);
      }
    } catch (err) {
      error("Gagal!", err.message || "Gagal mengirim pendaftaran.");
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const value = answers[field.id] || "";
    const hasError = errors[field.id];

    const commonProps = {
      size: "large",
      status: hasError ? "error" : "",
    };

    switch (field.type) {
      case "TEXT":
        return (
          <Input
            {...commonProps}
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleAnswerChange(field.id, e.target.value)}
          />
        );

      case "NUMBER":
        return (
          <Input
            {...commonProps}
            type="number"
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleAnswerChange(field.id, e.target.value)}
          />
        );

      case "DATE":
        return (
          <DatePicker
            {...commonProps}
            placeholder={`Pilih ${field.label.toLowerCase()}`}
            value={value ? moment(value) : null}
            onChange={(date, dateString) =>
              handleAnswerChange(field.id, dateString)
            }
            className="w-full"
            format="YYYY-MM-DD"
          />
        );

      case "TEXTAREA":
        return (
          <TextArea
            {...commonProps}
            rows={4}
            placeholder={`Masukkan ${field.label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleAnswerChange(field.id, e.target.value)}
            showCount
            maxLength={1000}
          />
        );

      case "SELECT":
        return (
          <Select
            {...commonProps}
            placeholder={`Pilih ${field.label.toLowerCase()}`}
            value={value || undefined}
            onChange={(val) => handleAnswerChange(field.id, val)}
            className="w-full"
            showSearch
            optionFilterProp="children"
          >
            {field.options.map((option, index) => (
              <Option
                key={getOptionValue(option) || index}
                value={getOptionValue(option)}
              >
                {getOptionLabel(option)}
              </Option>
            ))}
          </Select>
        );

      case "MULTI_SELECT":
        return (
          <Checkbox.Group
            value={Array.isArray(value) ? value : []}
            onChange={(checkedValues) =>
              handleAnswerChange(field.id, checkedValues)
            }
            className="w-full"
          >
            <div className="space-y-2">
              {field.options.map((option, index) => (
                <div
                  key={getOptionValue(option) || index}
                  className="flex items-center rounded-lg border border-gray-200 px-3 py-2"
                >
                  <Checkbox value={getOptionValue(option)}>
                    {getOptionLabel(option)}
                  </Checkbox>
                </div>
              ))}
            </div>
          </Checkbox.Group>
        );

      case "FILE": {
        const normalizedLabel = field.label.trim().toLowerCase();
        const matchingGroup = previousFiles.find((g) => {
          const gl = (g.field_label || "").trim().toLowerCase();
          return gl === normalizedLabel || gl.includes(normalizedLabel) || normalizedLabel.includes(gl);
        });
        const fieldPrevFiles = matchingGroup?.files?.slice(0, 5) || [];
        const selectedPrevId = usePreviousFile[field.id];

        return (
          <div>
            <Upload
              beforeUpload={() => false}
              onChange={(info) => {
                if (info.file) {
                  handleAnswerChange(field.id, info.file);
                  setUsePreviousFile((prev) => ({
                    ...prev,
                    [field.id]: null,
                  }));
                }
              }}
              onRemove={() => {
                handleAnswerChange(field.id, null);
              }}
              maxCount={1}
              accept=".pdf"
              fileList={
                value
                  ? [
                      {
                        uid: "-1",
                        name: value.name || getCleanFileName(value.path),
                        status: "done",
                      },
                    ]
                  : []
              }
            >
              <Button
                icon={<UploadOutlined />}
                size="large"
                className={hasError ? "border-red-500" : ""}
              >
                {value ? "Ganti File" : `Upload ${field.label}`}
              </Button>
            </Upload>
            {value && (
              <div className="mt-2 text-sm text-gray-600">
                File terpilih: {value.name || getCleanFileName(value.path)}{" "}
                {value.size && ` (${(value.size / 1024 / 1024).toFixed(2)} MB)`}
              </div>
            )}

            {fieldPrevFiles.length > 0 && !value && !selectedPrevId && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  ── Atau gunakan dari pendaftaran sebelumnya ──
                </p>
                <div className="space-y-1.5">
                  {fieldPrevFiles.map((file) => (
                    <label
                      key={file.id}
                      className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${
                        selectedPrevId === file.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`prev_file_${field.id}`}
                        checked={selectedPrevId === file.id}
                        onChange={() => {
                          setUsePreviousFile((prev) => ({
                            ...prev,
                            [field.id]: file.id,
                          }));
                          handleAnswerChange(field.id, {
                            id: file.id,
                            name: file.original_filename,
                            path: file.file_path,
                            mime_type: file.mime_type,
                            isPrevious: true,
                          });
                        }}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {file.original_filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.scholarship_name}
                          {file.schema_name ? ` - ${file.schema_name}` : ""}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {fieldPrevFiles.length === 0 && !value && !selectedPrevId && previousFiles.length > 0 && (
              <div className="mt-2 text-xs text-gray-400 italic">
                Tidak ada file "{field.label}" dari pendaftaran sebelumnya
              </div>
            )}
          </div>
        );
      }

      default:
        return (
          <div className="text-red-500 text-sm">
            Tipe field "{field.type}" tidak dikenal
          </div>
        );
    }
  };

  const HelpModal = () => (
    <Modal
      title={
        <div className="flex items-center">
          <InfoCircleOutlined className="mr-2 text-blue-500" />
          Petunjuk Pengisian Form
        </div>
      }
      open={helpModalVisible}
      onCancel={() => setHelpModalVisible(false)}
      footer={[
        <Button
          key="close"
          type="primary"
          onClick={() => setHelpModalVisible(false)}
        >
          Tutup
        </Button>,
      ]}
      width={600}
    >
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Petunjuk Umum:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Pastikan semua informasi yang diisi sudah benar dan sesuai</li>
            <li>
              Field yang bertanda <span className="text-red-500">*</span> wajib
              diisi
            </li>
            <li>
              Anda dapat menyimpan draft terlebih dahulu sebelum submit final
            </li>
            <li>Setelah submit, pendaftaran tidak dapat diubah lagi</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">
            Petunjuk Upload File:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Format yang didukung: PDF</li>
            <li>Ukuran maksimal file: 5MB</li>
            <li>File yang diunggah harus jelas dan dapat dibaca</li>
            <li>Pastikan file tidak corrupt atau rusak</li>
            <li>
              Gunakan nama file yang deskriptif (contoh: "KTP_NamaAnda.pdf")
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Tips:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Siapkan semua dokumen yang diperlukan sebelum mengisi form</li>
            <li>Periksa kembali semua data sebelum submit</li>
            <li>Simpan salinan digital dari semua dokumen yang diupload</li>
            <li>Jika ada kendala, hubungi penyelenggara beasiswa</li>
          </ul>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Penting:</strong> Pastikan koneksi internet stabil saat
            mengupload file dan submit pendaftaran untuk menghindari kegagalan
            pengiriman.
          </p>
        </div>
      </div>
    </Modal>
  );

  if (loading) {
    return (
      <>

        <GuestLayout>
          <SkeletonFormApplication fieldCount={5} />
        </GuestLayout>
      </>
    );
  }

  if (hasExistingApplication && existingStatus !== "DRAFT") {
    return (
      <GuestLayout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card>
            <div className="text-center py-8">
              <Alert
                message="Pendaftaran Sudah Dilakukan"
                description={
                  <div>
                    <p className="mb-4">
                      Anda sudah mendaftar beasiswa{" "}
                      <strong>{scholarship?.name}</strong>
                      {selectedSchema && (
                        <>
                          {" "}
                          dengan skema <strong>{selectedSchema.name}</strong>
                        </>
                      )}{" "}
                      dengan status:
                    </p>
                    <div className="text-lg font-bold text-blue-600 mb-4">
                      {statusApplications[existingStatus] || existingStatus}
                    </div>
                  </div>
                }
                type="info"
                showIcon
                className="mb-6"
              />
              <div className="space-x-4 pt-4">
                <Button type="primary" onClick={() => navigate("/history")}>
                  Lihat Riwayat
                </Button>
                <Button onClick={() => navigate("/scholarship")}>
                  Kembali ke Daftar Beasiswa
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </GuestLayout>
    );
  }

  return (
    <>

      <GuestLayout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          {isRevisionMode && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-300 rounded-lg">
              <div className="flex items-center">
                <InfoCircleOutlined className="text-orange-600 mr-2 text-xl" />
                <div>
                  <h4 className="font-semibold text-orange-800 mb-1">
                    Revisi Pendaftaran
                  </h4>
                  <p className="text-orange-700 text-sm">
                    Anda sedang merevisi pendaftaran beasiswa. Pastikan semua
                    data yang diminta sudah diperbaiki sesuai catatan revisi.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mb-6">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/scholarship/${scholarshipId}`)}
              className="mb-4"
            >
              Kembali ke Detail Beasiswa
            </Button>
          </div>

          <Card>
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Formulir Pendaftaran Beasiswa
                  </h1>
                  <div className="text-gray-700">
                    <div className="font-semibold text-lg text-blue-700 mb-1">
                      {scholarship?.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Penyelenggara: {scholarship?.organizer}
                    </div>
                    {scholarship?.end_date && (
                      <div className="text-sm text-orange-600 font-medium mb-3">
                        Batas Pendaftaran:{" "}
                        {new Date(scholarship.end_date).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </div>
                    )}

                    {selectedSchema && (
                      <div className="bg-white border border-blue-300 rounded-lg p-4 mt-3">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-blue-900 flex items-center">
                            Skema yang Dipilih
                          </h3>
                        </div>
                        <div className="text-blue-800 font-medium mb-2">
                          {selectedSchema.name}
                        </div>
                        {selectedSchema.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {selectedSchema.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  icon={<InfoCircleOutlined />}
                  onClick={() => setHelpModalVisible(true)}
                  type="dashed"
                >
                  Petunjuk
                </Button>
              </div>
            </div>

            <form className="space-y-6">
              {formFields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <span>{field.label}</span>
                    {field.is_required && (
                      <span className="text-red-500 ml-1 text-base">*</span>
                    )}
                  </label>

                  {field.type === "MULTI_SELECT" && (
                    <div className="text-xs font-medium text-blue-600">
                      Anda dapat memilih lebih dari satu opsi
                    </div>
                  )}

                  {renderField(field)}

                  {errors[field.id] && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors[field.id]}
                    </div>
                  )}

                  {field.type === "FILE" && (
                    <div className="text-xs text-gray-500">
                      Format: PDF (Max: 5MB)
                    </div>
                  )}
                </div>
              ))}
            </form>

            <div className="flex items-center mt-8 pt-6 border-t border-gray-200 gap-4">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Field wajib diisi
              </div>

              <div className="space-x-4 ml-auto">
                {!isRevisionMode && (
                  <Button
                    icon={<SaveOutlined />}
                    onClick={handleSaveDraft}
                    loading={submitting}
                    disabled={submitting}
                  >
                    {submitting ? "Menyimpan..." : "Simpan Draft"}
                  </Button>
                )}

                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting
                    ? "Mengirim..."
                    : isRevisionMode
                      ? "Submit Revisi"
                      : "Submit Pendaftaran"}
                </Button>
              </div>
            </div>
          </Card>

          <HelpModal />
        </div>
      </GuestLayout>
    </>
  );
};

export default FormApplicationWithVerification;
