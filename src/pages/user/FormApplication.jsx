import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Input,
  Select,
  DatePicker,
  Upload,
  Spin,
  Alert,
  Button,
  Modal,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  NumberOutlined,
  CalendarOutlined,
  FileOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Card from "../../components/Card";
import GuestLayout from "../../layouts/GuestLayout";
import {
  getScholarshipForm,
  submitApplication,
  saveDraft,
} from "../../services/pendaftaranService";
import AlertContainer from "../../components/AlertContainer";
import useAlert from "../../hooks/useAlert";
import RequireEmailVerification from "../../components/RequireEmailVerification";

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
};

const getCleanFileName = (filePath) => {
  if (!filePath) return "Unknown file";

  const fullFileName = filePath.split("\\").pop();

  const match = fullFileName.match(/^\d+-(.+)$/);
  return match ? match[1] : fullFileName;
};

const FormApplication = () => {
  const { id: scholarshipId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scholarship, setScholarship] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [answers, setAnswers] = useState({});
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingStatus, setExistingStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const { alerts, success, warning, error, removeAlert } = useAlert();

  const typeIcons = {
    TEXT: <FileTextOutlined className="text-blue-500" />,
    NUMBER: <NumberOutlined className="text-green-500" />,
    DATE: <CalendarOutlined className="text-purple-500" />,
    TEXTAREA: <AlignLeftOutlined className="text-orange-500" />,
    FILE: <FileOutlined className="text-red-500" />,
    SELECT: <UnorderedListOutlined className="text-indigo-500" />,
  };

  useEffect(() => {
    loadForm();
  }, [scholarshipId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await getScholarshipForm(scholarshipId);

      setScholarship(data.scholarship);
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
          } else {
            initialAnswers[field.id] = existingAnswer.answer_text || "";
          }
        } else {
          initialAnswers[field.id] = field.type === "FILE" ? null : "";
        }
      });

      setAnswers(initialAnswers);
      document.title = `Daftar ${data.scholarship.name} - UNAND`;
    } catch (err) {
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
      } else {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field.id] = `${field.label} wajib diisi`;
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      warning("Peringatan!", "Mohon lengkapi semua field yang wajib diisi");
      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    try {
      setSubmitting(true);
      await saveDraft(scholarshipId, answers);
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
      await submitApplication(scholarshipId, answers, false);
      success("Berhasil!", "Aplikasi berhasil disubmit!");
      setTimeout(() => {
        navigate("/history");
      }, 1200);
    } catch (err) {
      error("Gagal!", err.message || "Gagal mengirim aplikasi.");
    } finally {
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
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );

      case "FILE":
        return (
          <div>
            <Upload
              beforeUpload={() => false}
              onChange={(info) => {
                if (info.file) {
                  handleAnswerChange(field.id, info.file);
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
          </div>
        );

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
            <li>Setelah submit, aplikasi tidak dapat diubah lagi</li>
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
            mengupload file dan submit aplikasi untuk menghindari kegagalan
            pengiriman.
          </p>
        </div>
      </div>
    </Modal>
  );

  if (loading) {
    return (
      <GuestLayout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex justify-center items-center min-h-96">
            <Spin size="large" tip="Memuat form pendaftaran..." />
          </div>
        </div>
      </GuestLayout>
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
                      <strong>{scholarship?.name}</strong> dengan status:
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
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <GuestLayout>
        <div className="max-w-4xl mx-auto px-6 py-8">
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
              <div className="flex justify-between items-start">
                <div>
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
                      <div className="text-sm text-orange-600 font-medium">
                        Batas Pendaftaran:{" "}
                        {new Date(scholarship.end_date).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
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
                    <span className="mr-2">{typeIcons[field.type]}</span>
                    <span>{field.label}</span>
                    {field.is_required && (
                      <span className="text-red-500 ml-1 text-base">*</span>
                    )}
                  </label>

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

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Field wajib diisi
              </div>

              <div className="space-x-4">
                <Button
                  icon={<SaveOutlined />}
                  onClick={handleSaveDraft}
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? "Menyimpan..." : "Simpan Draft"}
                </Button>

                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? "Mengirim..." : "Submit Aplikasi"}
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
