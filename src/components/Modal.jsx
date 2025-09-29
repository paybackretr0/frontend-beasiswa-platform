import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const UniversalModal = ({
  visible,
  onCancel,
  onSubmit,
  title,
  fields,
  loading,
  initialValues = {}, // Tambahkan prop initialValues
}) => {
  const [form] = Form.useForm();

  // Set initial values saat modal dibuka atau initialValues berubah
  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  // Reset form saat modal ditutup
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues} // Set initialValues di Form level
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
          >
            {field.type === "select" ? (
              <Select placeholder={`Pilih ${field.label}`}>
                {field.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <Input
                type={field.type || "text"}
                placeholder={field.placeholder || `Masukkan ${field.label}`}
              />
            )}
          </Form.Item>
        ))}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Simpan
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UniversalModal;
