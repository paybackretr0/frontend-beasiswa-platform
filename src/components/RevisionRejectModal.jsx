import {
  Modal,
  Form,
  Input,
  Checkbox,
  Divider,
  Spin,
  Alert,
  DatePicker,
} from "antd";
import { useState, useEffect } from "react";
import { getActiveTemplatesByType } from "../services/commentService";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const { TextArea } = Input;

const RevisionRejectModal = ({
  visible,
  onCancel,
  onSubmit,
  title,
  loading,
  type,
  zIndex = 1000,
}) => {
  const [form] = Form.useForm();
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  useEffect(() => {
    if (visible && type) {
      fetchTemplates();
    } else {
      form.resetFields();
      setSelectedTemplates([]);
    }
  }, [visible, type]);

  const fetchTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const data = await getActiveTemplatesByType(type);
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const notes = values.notes?.trim() || "";
      const template_ids = values.template_ids || [];
      const revision_deadline = values.revision_deadline
        ? values.revision_deadline.toISOString()
        : null;

      if (type !== "VERIFICATION" && type !== "VALIDATION") {
        if (!notes && template_ids.length === 0) {
          form.setFields([
            {
              name: "notes",
              errors: ["Pilih template atau masukkan catatan kustom"],
            },
          ]);
          return;
        }
      }

      onSubmit({
        notes,
        template_ids,
        ...(type === "REVISION" && { revision_deadline }),
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const getTypeLabel = () => {
    const labels = {
      REVISION: "Revisi",
      REJECTION: "Penolakan",
      VERIFICATION: "Verifikasi",
      VALIDATION: "Validasi",
    };
    return labels[type] || type;
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
      okText="Kirim"
      cancelText="Batal"
      zIndex={zIndex}
    >
      <Form form={form} layout="vertical">
        {type !== "VERIFICATION" && type !== "VALIDATION" && (
          <Form.Item
            name="template_ids"
            label={`Template ${getTypeLabel()}`}
            help={
              templates.length > 0
                ? "Pilih satu atau lebih template yang sesuai"
                : null
            }
          >
            {templatesLoading ? (
              <div className="text-center py-8">
                <Spin tip="Memuat template..." />
              </div>
            ) : templates.length > 0 ? (
              <Checkbox.Group
                className="w-full"
                onChange={(checkedValues) =>
                  setSelectedTemplates(checkedValues)
                }
              >
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-3 transition-all ${
                        selectedTemplates.includes(template.id)
                          ? "bg-blue-50 border-blue-300"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      <Checkbox value={template.id} className="w-full">
                        <div className="ml-2">
                          <div className="font-medium text-sm">
                            {template.template_name}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {template.comment_text}
                          </div>
                        </div>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </Checkbox.Group>
            ) : (
              <Alert
                message="Tidak ada template tersedia"
                description="Anda dapat menggunakan catatan kustom di bawah ini."
                type="info"
                showIcon
              />
            )}
          </Form.Item>
        )}

        {(templates.length > 0 ||
          type === "VERIFICATION" ||
          type === "VALIDATION") && (
          <Divider>
            {type === "VERIFICATION" || type === "VALIDATION"
              ? "Catatan (Opsional)"
              : templates.length > 0
                ? "atau"
                : ""}
          </Divider>
        )}

        <Form.Item
          name="notes"
          label={
            type === "VERIFICATION" || type === "VALIDATION"
              ? `Catatan ${getTypeLabel()} (Opsional)`
              : templates.length > 0
                ? "Catatan Tambahan (Opsional)"
                : `Catatan ${getTypeLabel()}`
          }
          rules={[
            {
              validator: (_, value) => {
                const templateIds = form.getFieldValue("template_ids");

                if (type === "VERIFICATION" || type === "VALIDATION") {
                  return Promise.resolve();
                }

                if (
                  (!value || value.trim() === "") &&
                  (!templateIds || templateIds.length === 0)
                ) {
                  return Promise.reject(
                    "Pilih template atau masukkan catatan kustom",
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder={`Masukkan catatan ${getTypeLabel().toLowerCase()} ${
              type === "VERIFICATION" ||
              type === "VALIDATION" ||
              templates.length > 0
                ? "(opsional)"
                : ""
            }...`}
            maxLength={500}
            showCount
          />
        </Form.Item>

        {type === "REVISION" && (
          <Form.Item
            name="revision_deadline"
            label="Deadline Revisi (WIB)"
            rules={[
              {
                required: true,
                message: "Deadline revisi harus ditentukan",
              },
            ]}
            extra="Waktu akan disimpan dalam zona waktu WIB (UTC+7)"
          >
            <DatePicker
              showTime
              format="DD MMMM YYYY, HH:mm [WIB]"
              placeholder="Pilih tanggal dan waktu deadline (WIB)"
              className="w-full"
              disabledDate={disabledDate}
              showNow={false}
              defaultValue={dayjs().tz("Asia/Jakarta")}
            />
          </Form.Item>
        )}

        {templates.length > 0 && (
          <div className="text-xs text-gray-500 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <strong>Tips:</strong> Anda bisa memilih satu atau lebih template,
            dan/atau menambahkan catatan kustom untuk memberikan feedback yang
            lebih spesifik.
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default RevisionRejectModal;
