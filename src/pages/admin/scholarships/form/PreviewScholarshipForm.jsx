import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Divider,
  message,
  Row,
  Col,
  Tag,
  Spin,
  Empty,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  FormOutlined,
  FileTextOutlined,
  NumberOutlined,
  CalendarOutlined,
  FileOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { getFormFields } from "../../../../services/formService";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PreviewScholarshipForm = () => {
  const { schemaId } = useParams();
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);

  const typeIcons = {
    TEXT: <FileTextOutlined />,
    NUMBER: <NumberOutlined />,
    DATE: <CalendarOutlined />,
    TEXTAREA: <AlignLeftOutlined />,
    FILE: <FileOutlined />,
    SELECT: <UnorderedListOutlined />,
  };

  const typeLabels = {
    TEXT: "Text Input",
    NUMBER: "Number Input",
    DATE: "Date Input",
    TEXTAREA: "Textarea",
    FILE: "File Upload",
    SELECT: "Dropdown",
  };

  useEffect(() => {
    document.title = "Preview Form Beasiswa - Admin";
    fetchFormFields();
  }, [schemaId]);

  const fetchFormFields = async () => {
    try {
      setLoading(true);
      const fields = await getFormFields(schemaId);
      setFormFields(fields);
    } catch (error) {
      console.error("Error fetching form fields:", error);
      message.error("Gagal memuat form");
    } finally {
      setLoading(false);
    }
  };

  const renderPreviewField = (field) => {
    const commonProps = {
      placeholder: `Input ${field.label.toLowerCase()}`,
      disabled: true,
      size: "large",
    };

    switch (field.type) {
      case "TEXT":
        return <Input {...commonProps} />;
      case "NUMBER":
        return <Input {...commonProps} type="number" />;
      case "DATE":
        return <Input {...commonProps} type="date" />;
      case "TEXTAREA":
        return <TextArea {...commonProps} rows={3} />;
      case "FILE":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 bg-gray-50">
            <FileOutlined className="text-2xl mb-2" />
            <div>Klik untuk upload file atau drag & drop</div>
            <div className="text-sm">Maksimal ukuran file: 5MB</div>
          </div>
        );
      case "SELECT":
        return (
          <Select {...commonProps} className="w-full">
            {field.options_json?.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            )) || <Option value="">Tidak ada opsi</Option>}
          </Select>
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Card className="mb-6 border-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/admin/scholarship`)}
              type="text"
              className="flex items-center"
            ></Button>
            <div>
              <Title level={3} className="!mb-1 flex items-center">
                Preview Form Beasiswa
              </Title>
              <Text type="secondary">
                Lihat bagaimana form akan tampil untuk mahasiswa
              </Text>
            </div>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/admin/scholarship/schema/${schemaId}/form/edit`)
              }
              className="bg-blue-500 hover:bg-blue-600 border-blue-500"
            >
              Edit Form
            </Button>
          </Space>
        </div>
      </Card>

      {formFields.length === 0 ? (
        <Card className="shadow-sm">
          <Empty
            image={<FormOutlined className="text-6xl text-gray-300" />}
            description={
              <div className="space-y-2">
                <div className="text-lg font-semibold text-gray-600">
                  Form Belum Dibuat
                </div>
                <div className="text-gray-400">
                  Silakan buat form terlebih dahulu untuk beasiswa ini
                </div>
              </div>
            }
          >
            <Button
              type="primary"
              icon={<FormOutlined />}
              onClick={() =>
                navigate(`/admin/scholarship/schema/${schemaId}/form/create`)
              }
              size="large"
            >
              Buat Form Sekarang
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FormOutlined className="mr-2" />
                    Form Pendaftaran Beasiswa
                  </div>
                  <Tag color="blue">{formFields.length} Field</Tag>
                </div>
              }
              className="shadow-sm top-6"
            >
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Text className="text-blue-700">
                    <strong>Petunjuk:</strong> Silakan lengkapi semua field yang
                    diperlukan pada formulir pendaftaran beasiswa ini. Field
                    yang bertanda (<span className="text-red-500">*</span>)
                    wajib diisi.
                  </Text>
                </div>

                {formFields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Text strong className="flex items-center text-base">
                        {typeIcons[field.type]}
                        <span className="ml-2">{field.label}</span>
                        {field.is_required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Text>
                      <Tag size="small" color="geekblue">
                        {typeLabels[field.type]}
                      </Tag>
                    </div>
                    {renderPreviewField(field)}
                  </div>
                ))}

                <Divider />

                <div className="flex justify-end space-x-3">
                  <Button size="large" disabled>
                    Batal
                  </Button>
                  <Button type="primary" size="large" disabled>
                    Kirim Pendaftaran
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <div className="flex items-center">
                  <SettingOutlined className="mr-2" />
                  Struktur Form
                </div>
              }
              className="shadow-sm sticky top-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Total Field</Text>
                  <Tag color="blue">{formFields.length}</Tag>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Field Wajib</Text>
                  <Tag color="red">
                    {formFields.filter((f) => f.is_required).length}
                  </Tag>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Field Opsional</Text>
                  <Tag color="orange">
                    {formFields.filter((f) => !f.is_required).length}
                  </Tag>
                </div>

                <Divider />

                <div className="space-y-3">
                  <Text strong className="block">
                    Daftar Field:
                  </Text>
                  {formFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        {typeIcons[field.type]}
                        <div>
                          <div className="text-sm font-medium">
                            {field.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {typeLabels[field.type]}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Tag
                          size="small"
                          color={field.is_required ? "red" : "orange"}
                        >
                          {field.is_required ? "Wajib" : "Opsional"}
                        </Tag>
                        <Text type="secondary" className="text-xs">
                          #{field.order_no}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PreviewScholarshipForm;
