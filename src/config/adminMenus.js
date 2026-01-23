import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdAssignment,
  MdBarChart,
  MdWeb,
  MdMenuBook,
  MdMoreHoriz,
  MdInfo,
  MdOutlineLocationCity,
} from "react-icons/md";

export const ADMIN_MENUS = [
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: MdDashboard,
  },

  {
    key: "scholarship",
    label: "Beasiswa",
    to: "/admin/scholarship",
    icon: MdSchool,
  },

  {
    key: "registration",
    label: "Pendaftaran",
    to: "/admin/registration",
    icon: MdAssignment,
  },

  { key: "report", label: "Pelaporan", to: "/admin/report", icon: MdBarChart },

  {
    key: "government",
    label: "Beasiswa APBN",
    to: "/admin/government-scholarship",
    icon: MdOutlineLocationCity,
  },

  {
    key: "infoScholarship",
    label: "Informasi Beasiswa",
    to: "/admin/informasi-beasiswa",
    icon: MdInfo,
  },

  {
    key: "accounts",
    label: "Kelola Akun",
    to: "/admin/accounts",
    icon: MdPeople,
    submenu: [
      { label: "Pimpinan Dir.", to: "/admin/accounts/pimpinan-dir" },
      { label: "Pimpinan Fak.", to: "/admin/accounts/pimpinan-fak" },
      { label: "Validator", to: "/admin/accounts/validator" },
      { label: "Verifikator", to: "/admin/accounts/verifikator" },
      { label: "Mahasiswa", to: "/admin/accounts/mahasiswa" },
    ],
  },

  {
    key: "website",
    label: "Website",
    to: "/admin/website",
    icon: MdWeb,
    submenu: [
      { label: "Berita", to: "/admin/website/berita" },
      { label: "Artikel", to: "/admin/website/artikel" },
    ],
  },

  {
    key: "reference",
    label: "Referensi",
    to: "/admin/reference",
    icon: MdMenuBook,
    submenu: [
      { label: "Fakultas", to: "/admin/reference/fakultas" },
      { label: "Departemen", to: "/admin/reference/departemen" },
      { label: "Program Studi", to: "/admin/reference/program-studi" },
    ],
  },

  {
    key: "extra",
    label: "Tambahan",
    to: "/admin/extra",
    icon: MdMoreHoriz,
    submenu: [
      { label: "Backup Data", to: "/admin/extra/backup-data" },
      { label: "Log Aktivitas", to: "/admin/extra/log-aktivitas" },
      { label: "Komentar", to: "/admin/extra/template-komentar" },
    ],
  },
];
