import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { TextArea } = Input;

const UniversalModal = ({
  visible,
  onCancel,
  onSubmit,
  title,
  fields,
  loading,
  initialValues = {},
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  const renderField = (field) => {
    if (field.render) {
      return field.render;
    }

    switch (field.type) {
      case "select":
        return (
          <Select
            placeholder={field.placeholder || `Pilih ${field.label}`}
            allowClear
            onChange={field.onChange}
          >
            {field.options?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );

      case "textarea":
        return (
          <TextArea
            placeholder={field.placeholder || `Masukkan ${field.label}`}
            rows={field.rows || 4}
            showCount
            maxLength={field.maxLength || 1000}
          />
        );

      default:
        return (
          <Input
            type={field.type || "text"}
            placeholder={field.placeholder || `Masukkan ${field.label}`}
            maxLength={field.maxLength}
          />
        );
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
            extra={field.extra}
          >
            {renderField(field)}
          </Form.Item>
        ))}

        <Form.Item style={{ marginTop: 24 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={onCancel}>Batal</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Simpan
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UniversalModal;
