import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Input,
  Select,
  Checkbox,
  Button,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Tag,
  Spin,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  FormOutlined,
  SettingOutlined,
  MinusCircleOutlined,
  FileTextOutlined,
  NumberOutlined,
  CalendarOutlined,
  FileOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  DragOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  getFormFields,
  updateFormField,
} from "../../../../services/formService";
import AlertContainer from "../../../../components/AlertContainer";
import useAlert from "../../../../hooks/useAlert";

const { Title, Text } = Typography;
const { Option } = Select;

function SortableEditFieldItem({
  field,
  index,
  onFieldChange,
  onRemoveField,
  onAddOption,
  onOptionChange,
  onRemoveOption,
  typeIcons,
  formFieldsLength,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id || `field-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      size="small"
      className="bg-gray-50 border-dashed"
      bodyStyle={{ padding: "16px" }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
            >
              <DragOutlined className="text-gray-400" />
            </div>
            <Title level={5} className="!mb-0 flex items-center space-x-2">
              {typeIcons[field.type]}
              <span className="ml-2">Field {index + 1}</span>
              {field.is_required && (
                <Tag color="red" className="ml-2">
                  Wajib
                </Tag>
              )}
              {field.id && (
                <Tag color="green" className="ml-2">
                  Tersimpan
                </Tag>
              )}
            </Title>
          </div>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onRemoveField(index)}
            disabled={formFieldsLength === 1}
          >
            Hapus
          </Button>
        </div>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div className="space-y-2">
              <Text strong>Label Field</Text>
              <Input
                placeholder="Masukkan label field"
                value={field.label}
                onChange={(e) => onFieldChange(index, "label", e.target.value)}
                size="large"
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="space-y-2">
              <Text strong>Tipe Field</Text>
              <Select
                value={field.type}
                onChange={(value) => onFieldChange(index, "type", value)}
                size="large"
                className="w-full"
              >
                <Option value="TEXT">
                  <FileTextOutlined /> Text
                </Option>
                <Option value="NUMBER">
                  <NumberOutlined /> Number
                </Option>
                <Option value="DATE">
                  <CalendarOutlined /> Date
                </Option>
                <Option value="TEXTAREA">
                  <AlignLeftOutlined /> Textarea
                </Option>
                <Option value="FILE">
                  <FileOutlined /> File
                </Option>
                <Option value="SELECT">
                  <UnorderedListOutlined /> Dropdown
                </Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={4}>
            <div className="space-y-2">
              <Text strong>Wajib</Text>
              <div className="pt-2">
                <Checkbox
                  checked={field.is_required}
                  onChange={(e) =>
                    onFieldChange(index, "is_required", e.target.checked)
                  }
                >
                  Wajib diisi
                </Checkbox>
              </div>
            </div>
          </Col>
        </Row>

        {field.type === "SELECT" && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <Text strong className="flex items-center">
                <UnorderedListOutlined className="mr-2" />
                Opsi Dropdown
              </Text>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => onAddOption(index)}
                size="small"
              >
                Tambah Opsi
              </Button>
            </div>

            <Space direction="vertical" className="w-full">
              {field.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Opsi ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      onOptionChange(index, optionIndex, e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => onRemoveOption(index, optionIndex)}
                    disabled={field.options.length === 1}
                  />
                </div>
              ))}
            </Space>
          </div>
        )}
      </div>
    </Card>
  );
}

const EditScholarshipForm = () => {
  const { schemaId } = useParams();
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { alerts, success, warning, info, error, removeAlert } = useAlert();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const typeIcons = {
    TEXT: <FileTextOutlined />,
    NUMBER: <NumberOutlined />,
    DATE: <CalendarOutlined />,
    TEXTAREA: <AlignLeftOutlined />,
    FILE: <FileOutlined />,
    SELECT: <UnorderedListOutlined />,
  };

  useEffect(() => {
    document.title = "Edit Form Beasiswa - Admin";
    fetchFormFields();
  }, [schemaId]);

  const fetchFormFields = async () => {
    try {
      setInitialLoading(true);
      const fields = await getFormFields(schemaId);

      const transformedFields = fields.map((field, index) => ({
        id: field.id || `field-${index}-${Date.now()}`,
        label: field.label,
        type: field.type,
        is_required: field.is_required,
        options: field.options_json || [],
        order_no: field.order_no,
        originalId: field.id,
      }));

      setFormFields(
        transformedFields.length > 0
          ? transformedFields
          : [
              {
                id: `field-${Date.now()}`,
                label: "",
                type: "TEXT",
                is_required: true,
                options: [],
              },
            ]
      );
    } catch (err) {
      console.error("Error fetching form fields:", err);
      error("Gagal!", "Gagal memuat form yang sudah ada");
      setFormFields([
        {
          id: `field-${Date.now()}`,
          label: "",
          type: "TEXT",
          is_required: true,
          options: [],
        },
      ]);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAddField = () => {
    const newField = {
      id: `field-${Date.now()}`,
      label: "",
      type: "TEXT",
      is_required: false,
      options: [],
    };
    setFormFields([...formFields, newField]);
  };

  const handleRemoveField = (index) => {
    if (formFields.length === 1) {
      warning("Peringatan!", "Minimal harus ada satu field");
      return;
    }
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = value;

    if (field === "type" && updatedFields[index].type !== "SELECT") {
      updatedFields[index].options = [];
    }

    if (
      field === "type" &&
      value === "SELECT" &&
      updatedFields[index].options.length === 0
    ) {
      updatedFields[index].options = [""];
    }

    setFormFields(updatedFields);
  };

  const handleAddOption = (fieldIndex) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex].options.push("");
    setFormFields(updatedFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFormFields(updatedFields);
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...formFields];
    if (updatedFields[fieldIndex].options.length === 1) {
      warning("Peringatan!", "Minimal harus ada satu opsi untuk dropdown");
      return;
    }
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setFormFields(updatedFields);
  };

  const validateForm = () => {
    for (let i = 0; i < formFields.length; i++) {
      const field = formFields[i];
      if (!field.label.trim()) {
        warning("Peringatan!", `Label field ${i + 1} tidak boleh kosong`);
        return false;
      }
      if (field.type === "SELECT" && field.options.length === 0) {
        warning(
          "Peringatan!",
          `Field dropdown "${field.label}" harus memiliki minimal satu opsi`
        );
        return false;
      }
      if (field.type === "SELECT") {
        for (let j = 0; j < field.options.length; j++) {
          if (!field.options[j].trim()) {
            warning(
              "Peringatan!",
              `Opsi ${j + 1} pada field "${field.label}" tidak boleh kosong`
            );
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const fieldsToSend = formFields.map((field) => ({
        label: field.label,
        type: field.type,
        is_required: field.is_required,
        options: field.options,
      }));

      await updateFormField(schemaId, fieldsToSend);
      success("Berhasil!", "Form berhasil diupdate!");
      setTimeout(() => {
        navigate(`/admin/scholarship/schema/${schemaId}/form/preview`);
      }, 2000);
    } catch (error) {
      console.error("Error updating form:", error);
      error("Gagal!", "Gagal mengupdate form");
    } finally {
      setLoading(false);
    }
  };

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFormFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-right"
      />
      <div className="p-6 bg-gray-50 min-h-screen">
        <Card className="mb-6 border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                type="text"
                className="flex items-center"
              />
              <div>
                <Title level={3} className="!mb-1 flex items-center">
                  Edit Form Beasiswa
                </Title>
                <Text type="secondary">
                  Ubah formulir pendaftaran untuk beasiswa ini
                </Text>
              </div>
            </div>
            <Space>
              <Button
                onClick={() =>
                  navigate(`/admin/scholarship/schema/${schemaId}/form/preview`)
                }
              >
                Lihat Preview
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={handleSubmit}
                size="large"
                className="bg-green-500 hover:bg-green-600 border-green-500"
              >
                Update Form
              </Button>
            </Space>
          </div>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SettingOutlined className="mr-2" />
                    Form Builder
                  </div>
                  <Tag color="blue">{formFields.length} Field</Tag>
                </div>
              }
              className="shadow-sm top-6"
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formFields.map((field) => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Space direction="vertical" size="large" className="w-full">
                    {formFields.map((field, index) => (
                      <SortableEditFieldItem
                        key={field.id}
                        field={field}
                        index={index}
                        onFieldChange={handleFieldChange}
                        onRemoveField={handleRemoveField}
                        onAddOption={handleAddOption}
                        onOptionChange={handleOptionChange}
                        onRemoveOption={handleRemoveOption}
                        typeIcons={typeIcons}
                        formFieldsLength={formFields.length}
                      />
                    ))}
                  </Space>
                </SortableContext>
              </DndContext>

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddField}
                block
                size="large"
                className="h-16 text-lg mt-6"
              >
                Tambah Field Baru
              </Button>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <div className="flex items-center">
                  <FormOutlined className="mr-2" />
                  Preview Form
                </div>
              }
              className="shadow-sm sticky top-6"
            >
              <div className="space-y-4">
                <Text type="secondary" className="block">
                  Preview bagaimana form akan terlihat untuk mahasiswa:
                </Text>

                <Divider />

                {formFields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <Text strong className="flex items-center">
                      {field.label || `Field ${index + 1}`}
                      {field.is_required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Text>

                    {field.type === "TEXT" && (
                      <Input placeholder="Input text" disabled />
                    )}
                    {field.type === "NUMBER" && (
                      <Input
                        type="number"
                        placeholder="Input number"
                        disabled
                      />
                    )}
                    {field.type === "DATE" && <Input type="date" disabled />}
                    {field.type === "TEXTAREA" && (
                      <Input.TextArea
                        rows={3}
                        placeholder="Input textarea"
                        disabled
                      />
                    )}
                    {field.type === "FILE" && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-400">
                        Klik untuk upload file
                      </div>
                    )}
                    {field.type === "SELECT" && (
                      <Select
                        placeholder="Pilih opsi"
                        disabled
                        className="w-full"
                      >
                        {field.options.map((option, optionIndex) => (
                          <Option key={optionIndex} value={option}>
                            {option || `Opsi ${optionIndex + 1}`}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </div>
                ))}

                {formFields.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <FormOutlined className="text-4xl mb-4" />
                    <div>Form masih kosong</div>
                    <div>Tambahkan field untuk melihat preview</div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EditScholarshipForm;
