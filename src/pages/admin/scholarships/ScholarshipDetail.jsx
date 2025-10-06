import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBeasiswaById } from "../../../services/scholarshipService";
import { message, Spin, Divider, Tag, Badge } from "antd";
import {
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  FileTextOutlined,
  GiftOutlined,
  BankOutlined,
  BookOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Button from "../../../components/Button";
import Card from "../../../components/Card";

const ScholarshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Detail Beasiswa - Admin";
    fetchScholarshipDetail();
  }, [id]);

  const fetchScholarshipDetail = async () => {
    try {
      setLoading(true);
      const data = await getBeasiswaById(id);
      setScholarship(data);
    } catch (error) {
      console.error("Error fetching scholarship detail:", error);
      message.error("Gagal memuat detail beasiswa");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="text-gray-600 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate("/admin/scholarship")}
          >
            <ArrowLeftOutlined />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Detail Beasiswa</h1>
        </div>

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
                  <p className="text-gray-600 mb-2">{scholarship.organizer}</p>
                  <div className="flex items-center space-x-4 mb-3">
                    <Tag color="blue">{scholarship.year}</Tag>
                    <Badge
                      status={
                        scholarship.scholarship_status === "AKTIF"
                          ? "success"
                          : "error"
                      }
                      text={scholarship.scholarship_status}
                    />
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
              <div className="flex items-center">
                <FileTextOutlined className="mr-2" />
                <span>Persyaratan</span>
              </div>
            }
          >
            {scholarship.requirements?.length ? (
              <div className="space-y-3">
                {scholarship.requirements.map((req, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="mb-2">
                      <Tag
                        color={
                          req.requirement_type === "FILE" ? "orange" : "blue"
                        }
                      >
                        {req.requirement_type}
                      </Tag>
                    </div>
                    {req.requirement_type === "TEXT" ? (
                      <p className="text-gray-700">{req.requirement_text}</p>
                    ) : (
                      <a
                        href={`${import.meta.env.VITE_IMAGE_URL}/${
                          req.requirement_file
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center space-x-2"
                      >
                        <FileTextOutlined />
                        <span>Lihat File Persyaratan</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Belum ada persyaratan yang ditambahkan.
              </p>
            )}
          </Card>

          <Card
            title={
              <div className="flex items-center">
                <BookOutlined className="mr-2" />
                <span>Dokumen yang Diperlukan</span>
              </div>
            }
          >
            {scholarship.scholarshipDocuments?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {scholarship.scholarshipDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-50 rounded p-2"
                  >
                    <FileTextOutlined className="text-blue-500" />
                    <span className="text-gray-700">{doc.document_name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Belum ada dokumen yang ditentukan.
              </p>
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
            {scholarship.benefits?.length ? (
              <ul className="space-y-2">
                {scholarship.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700">
                      {benefit.benefit_text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                Belum ada manfaat yang ditambahkan.
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Informasi Utama">
            <div className="space-y-3">
              <InfoItem
                label="Nilai Beasiswa"
                value={formatCurrency(scholarship.scholarship_value)}
                valueClass="text-green-600 font-semibold"
              />
              <Divider className="my-2" />

              <InfoItem
                label="Durasi"
                value={`${scholarship.duration_semesters} Semester`}
              />
              <Divider className="my-2" />

              {scholarship.quota && (
                <>
                  <InfoItem
                    label="Kuota"
                    value={`${scholarship.quota} Orang`}
                  />
                  <Divider className="my-2" />
                </>
              )}

              {scholarship.gpa_minimum && (
                <>
                  <InfoItem
                    label="IPK Minimum"
                    value={scholarship.gpa_minimum}
                  />
                  <Divider className="my-2" />
                </>
              )}

              <InfoItem
                label="Semester Minimum"
                value={scholarship.semester_minimum}
              />
            </div>
          </Card>

          <Card
            title={
              <div className="flex items-center">
                <CalendarOutlined className="mr-2" />
                <span>Timeline</span>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Pendaftaran Dibuka:
                </div>
                <div className="font-medium">
                  {formatDate(scholarship.start_date)}
                </div>
              </div>
              <Divider className="my-2" />
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Pendaftaran Ditutup:
                </div>
                <div className="font-medium text-orange-600">
                  {formatDate(scholarship.end_date)}
                </div>
              </div>
            </div>
          </Card>

          <Card
            title={
              <div className="flex items-center">
                <UserOutlined className="mr-2" />
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
            scholarship.departments?.length) && (
            <Card
              title={
                <div className="flex items-center">
                  <BankOutlined className="mr-2" />
                  <span>Eligibilitas</span>
                </div>
              }
            >
              {scholarship.faculties?.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Fakultas:</div>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.faculties.map((faculty) => (
                      <Tag key={faculty.id} color="blue">
                        {faculty.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {scholarship.departments?.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Departemen:</div>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.departments.map((dept) => (
                      <Tag key={dept.id} color="green">
                        {dept.name} ({dept.degree})
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
  );
};

const InfoItem = ({ label, value, valueClass = "font-medium" }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 text-sm">{label}:</span>
    <span className={valueClass}>{value}</span>
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
