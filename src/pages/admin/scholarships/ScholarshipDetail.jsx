import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBeasiswaById,
  activateSchema,
  deactivateSchema,
} from "../../../services/scholarshipService";
import { checkScholarshipForm } from "../../../services/formService";
import { Spin, Divider, Tag, Timeline, Collapse, Empty } from "antd";
import {
  EditOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  FileTextOutlined,
  GiftOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  OrderedListOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import AlertContainer from "../../../components/AlertContainer";
import useAlert from "../../../hooks/useAlert";

const { Panel } = Collapse;

const ScholarshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  const { alerts, error, success, removeAlert } = useAlert();

  useEffect(() => {
    document.title = "Detail Beasiswa - Admin";
    fetchScholarshipDetail();
  }, [id]);

  const fetchScholarshipDetail = async () => {
    try {
      setLoading(true);
      const data = await getBeasiswaById(id);
      setScholarship(data);
    } catch (err) {
      console.error("Error fetching scholarship detail:", err);
      error("Gagal memuat detail beasiswa");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return "Belum ditentukan";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleFormNavigation = async (schemaId) => {
    try {
      const { hasForm } = await checkScholarshipForm(schemaId);

      if (hasForm) {
        navigate(`/admin/scholarship/schema/${schemaId}/form/preview`);
      } else {
        navigate(`/admin/scholarship/schema/${schemaId}/form/create`);
      }
    } catch (err) {
      console.error("Error checking form status:", err);
      error(
        "Gagal Memeriksa Status Form",
        err.message || "Gagal memeriksa status form"
      );
    }
  };

  const handleSchemaToggle = async (schemaId, currentStatus, schemaName) => {
    setScholarship((prev) => ({
      ...prev,
      schemas: prev.schemas.map((schema) =>
        schema.id === schemaId
          ? { ...schema, is_active: !currentStatus }
          : schema
      ),
    }));

    try {
      if (currentStatus) {
        await deactivateSchema(schemaId);
        success("Berhasil", `Skema "${schemaName}" telah dinonaktifkan`);
      } else {
        await activateSchema(schemaId);
        success("Berhasil", `Skema "${schemaName}" telah diaktifkan`);
      }

      setTimeout(() => {
        fetchScholarshipDetail();
      }, 2000);
    } catch (err) {
      console.error("Error toggling schema:", err);

      setScholarship((prev) => ({
        ...prev,
        schemas: prev.schemas.map((schema) =>
          schema.id === schemaId
            ? { ...schema, is_active: currentStatus }
            : schema
        ),
      }));

      error(
        "Gagal Mengubah Status",
        err.message || "Gagal mengubah status schema"
      );
    }
  };

  const getImageSource = (logoPath) =>
    logoPath
      ? logoPath.startsWith("http")
        ? logoPath
        : `${import.meta.env.VITE_IMAGE_URL}/${logoPath}`
      : "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          Beasiswa tidak ditemukan
        </div>
        <Button onClick={() => navigate("/admin/scholarship")}>
          Kembali ke Daftar Beasiswa
        </Button>
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="text-gray-600 hover:text-blue-500 cursor-pointer"
              onClick={() => navigate("/admin/scholarship")}
            >
              <ArrowLeftOutlined />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Detail Beasiswa
            </h1>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() =>
                navigate(`/admin/scholarship/edit/${scholarship.id}`, {
                  state: { from: "detail" },
                })
              }
              className="!px-6 !py-2"
            >
              <EditOutlined className="mr-2" />
              Edit Beasiswa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="!p-0">
              <div className="p-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={getImageSource(scholarship.logo_path)}
                    alt={scholarship.name}
                    className="w-24 h-24 object-cover rounded-lg border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {scholarship.name}
                    </h2>
                    <p className="text-gray-600 mb-2">
                      {scholarship.organizer}
                    </p>
                    <div className="flex items-center space-x-4 mb-3">
                      <Tag color="blue">{scholarship.year}</Tag>
                      <Tag color={scholarship.is_active ? "green" : "red"}>
                        {scholarship.is_active ? "Aktif" : "Tidak Aktif"}
                      </Tag>
                      <Tag
                        color={scholarship.is_external ? "orange" : "purple"}
                      >
                        {scholarship.is_external ? "Eksternal" : "Internal"}
                      </Tag>
                      <Tag color="cyan">
                        {scholarship.verification_level === "DITMAWA"
                          ? "Verifikasi dari Ditmawa"
                          : scholarship.verification_level === "FACULTY"
                          ? "Verifikasi dari Fakultas"
                          : scholarship.verification_level}
                      </Tag>
                    </div>
                    <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
                      {scholarship.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOutlined className="mr-2" />
                    <span>
                      Skema Beasiswa ({scholarship.schemas?.length || 0})
                    </span>
                  </div>
                </div>
              }
            >
              {scholarship.schemas && scholarship.schemas.length > 0 ? (
                <Collapse
                  defaultActiveKey={[scholarship.schemas[0]?.id]}
                  className="bg-transparent"
                >
                  {scholarship.schemas.map((schema, index) => (
                    <Panel
                      header={
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-base">
                              {index + 1}. {schema.name}
                            </span>
                            <Tag color={schema.is_active ? "green" : "red"}>
                              {schema.is_active ? "Aktif" : "Nonaktif"}
                            </Tag>
                          </div>
                        </div>
                      }
                      key={schema.id}
                      className="mb-3"
                      extra={
                        <div
                          className="flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!scholarship.is_external && (
                            <Button
                              size="small"
                              onClick={() => handleFormNavigation(schema.id)}
                              className="!bg-green-500 hover:!bg-green-600 !text-white"
                            >
                              <FileTextOutlined className="mr-1" />
                              Kelola Form
                            </Button>
                          )}

                          {!scholarship.is_external &&
                            scholarship.is_active && (
                              <Button
                                size="small"
                                onClick={() =>
                                  handleSchemaToggle(
                                    schema.id,
                                    schema.is_active,
                                    schema.name
                                  )
                                }
                                className={
                                  schema.is_active
                                    ? "!bg-red-500 hover:!bg-red-600 !text-white"
                                    : "!bg-blue-500 hover:!bg-blue-600 !text-white"
                                }
                              >
                                {schema.is_active ? (
                                  <>
                                    <CloseCircleOutlined className="mr-1" />
                                    Nonaktifkan
                                  </>
                                ) : (
                                  <>
                                    <CheckCircleOutlined className="mr-1" />
                                    Aktifkan
                                  </>
                                )}
                              </Button>
                            )}
                        </div>
                      }
                    >
                      <div className="space-y-4 pl-4">
                        {schema.description && (
                          <div>
                            <div className="text-sm text-gray-600 mb-1">
                              Deskripsi:
                            </div>
                            <p className="text-gray-700">
                              {schema.description}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between bg-gray-50 rounded-lg">
                          <InfoBox
                            label="Kuota"
                            value={schema.quota || "Tidak terbatas"}
                          />
                          <InfoBox
                            label="IPK Min"
                            value={schema.gpa_minimum || "-"}
                          />
                          <InfoBox
                            label="Semester Min"
                            value={schema.semester_minimum || "-"}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <FileTextOutlined className="text-blue-500" />
                            <span className="font-semibold text-gray-800">
                              Persyaratan
                            </span>
                          </div>
                          {schema.requirements &&
                          schema.requirements.length > 0 ? (
                            <div className="space-y-2">
                              {schema.requirements.map((req, idx) => (
                                <div
                                  key={idx}
                                  className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded"
                                >
                                  {req.requirement_type === "TEXT" ? (
                                    <p className="text-gray-700 text-sm">
                                      {req.requirement_text}
                                    </p>
                                  ) : (
                                    <a
                                      href={`${
                                        import.meta.env.VITE_IMAGE_URL
                                      }/${req.requirement_file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline flex items-center space-x-2 text-sm"
                                    >
                                      <FileTextOutlined />
                                      <span>Lihat File Persyaratan</span>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Empty
                              description="Belum ada persyaratan"
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <FileTextOutlined className="text-green-500" />
                            <span className="font-semibold text-gray-800">
                              Dokumen yang Diperlukan
                            </span>
                          </div>
                          {schema.documents && schema.documents.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {schema.documents.map((doc, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-2 bg-green-50 rounded p-2 text-sm"
                                >
                                  <span className="text-gray-700">
                                    {doc.document_name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Empty
                              description="Belum ada dokumen"
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <OrderedListOutlined className="text-purple-500" />
                            <span className="font-semibold text-gray-800">
                              Tahapan Seleksi
                            </span>
                          </div>
                          {schema.stages && schema.stages.length > 0 ? (
                            <Timeline>
                              {schema.stages
                                .sort((a, b) => a.order_no - b.order_no)
                                .map((stage) => (
                                  <Timeline.Item key={stage.id}>
                                    <span className="font-medium">
                                      {stage.stage_name}
                                    </span>
                                  </Timeline.Item>
                                ))}
                            </Timeline>
                          ) : (
                            <Empty
                              description="Belum ada tahapan"
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                          )}
                        </div>
                      </div>
                    </Panel>
                  ))}
                </Collapse>
              ) : (
                <Empty description="Belum ada skema beasiswa" />
              )}
            </Card>

            <Card
              title={
                <div className="flex items-center">
                  <GiftOutlined className="mr-2" />
                  <span>Manfaat / Benefit</span>
                </div>
              }
            >
              {scholarship.benefits && scholarship.benefits.length > 0 ? (
                <ul className="space-y-2">
                  {scholarship.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-gray-700">
                        {benefit.benefit_text}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty
                  description="Belum ada manfaat yang ditambahkan"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Informasi Finansial">
              <div className="space-y-3">
                <InfoItem
                  label="Nilai Beasiswa"
                  value={formatCurrency(scholarship.scholarship_value)}
                  valueClass="text-green-600 font-semibold text-lg"
                />
                <Divider className="my-2" />
                <InfoItem
                  label="Durasi Pemberian"
                  value={`${scholarship.duration_semesters} Semester`}
                />
              </div>
            </Card>

            <Card
              title={
                <div className="flex items-center">
                  <span>Periode Pendaftaran</span>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Dibuka:</div>
                  <div className="font-medium">
                    {formatDate(scholarship.start_date)}
                  </div>
                </div>
                <Divider className="my-2" />
                <div>
                  <div className="text-sm text-gray-600 mb-1">Ditutup:</div>
                  <div className="font-medium text-orange-600">
                    {formatDate(scholarship.end_date)}
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title={
                <div className="flex items-center">
                  <span>Kontak Person</span>
                </div>
              }
            >
              <div className="space-y-4">
                <ContactItem
                  icon={<UserOutlined />}
                  label="Nama"
                  value={scholarship.contact_person_name}
                />
                <ContactItem
                  icon={<MailOutlined />}
                  label="Email"
                  value={scholarship.contact_person_email}
                  link={`mailto:${scholarship.contact_person_email}`}
                />
                <ContactItem
                  icon={<PhoneOutlined />}
                  label="Telepon"
                  value={scholarship.contact_person_phone}
                  link={`tel:${scholarship.contact_person_phone}`}
                />
                {scholarship.website_url && (
                  <ContactItem
                    icon={<GlobalOutlined />}
                    label="Website"
                    value="Kunjungi Website"
                    link={scholarship.website_url}
                  />
                )}
              </div>
            </Card>

            {(scholarship.faculties?.length ||
              scholarship.departments?.length ||
              scholarship.studyPrograms?.length) && (
              <Card
                title={
                  <div className="flex items-center">
                    <span>Target Mahasiswa</span>
                  </div>
                }
              >
                {scholarship.faculties?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2 font-medium">
                      Fakultas:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.faculties.map((faculty) => (
                        <Tag key={faculty.id} color="blue">
                          {faculty.name}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {scholarship.studyPrograms?.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2 font-medium">
                      Departemen/Program Studi:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.studyPrograms.map((prodi) => (
                        <Tag key={prodi.id} color="purple">
                          {prodi.degree} {prodi.department.name}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const InfoItem = ({ label, value, valueClass = "font-medium" }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 text-sm">{label}:</span>
    <span className={valueClass}>{value}</span>
  </div>
);

const InfoBox = ({ label, value }) => (
  <div className="text-center">
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="font-semibold text-gray-800">{value}</div>
  </div>
);

const ContactItem = ({ icon, label, value, link }) => (
  <div className="flex items-center space-x-3">
    <div className="text-gray-500 flex-shrink-0">{icon}</div>
    <div className="min-w-0 flex-1">
      <div className="text-sm text-gray-600">{label}:</div>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline break-words"
        >
          {value}
        </a>
      ) : (
        <div className="font-medium break-words">{value}</div>
      )}
    </div>
  </div>
);

export default ScholarshipDetail;
