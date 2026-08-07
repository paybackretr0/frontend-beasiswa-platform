// Field profil yang harus lengkap agar mahasiswa bisa mendaftar beasiswa.
// Ini satu-satunya field yang bisa diedit sendiri oleh mahasiswa di halaman profil.
const PROFILE_REQUIRED_FIELDS = [
  { key: "phone_number", label: "No. Telepon" },
  { key: "gender", label: "Jenis Kelamin" },
  { key: "birth_date", label: "Tanggal Lahir" },
  { key: "birth_place", label: "Tempat Lahir" },
];

const normalizeValue = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

/**
 * Mengecek kelengkapan data profil seorang user (mahasiswa).
 * @param {object} user - Objek user dari localStorage / API (memiliki phone_number, student.gender,
 *   student.birth_date, student.birth_place).
 * @returns {{ complete: boolean, missing: Array<{key: string, label: string}> }}
 */
export const getProfileCompleteness = (user) => {
  if (!user) return { complete: false, missing: PROFILE_REQUIRED_FIELDS };

  const student = user.student || {};

  const values = {
    phone_number: user.phone_number,
    gender: student.gender,
    birth_date: student.birth_date,
    birth_place: student.birth_place,
  };

  const missing = PROFILE_REQUIRED_FIELDS.filter(
    (field) => !normalizeValue(values[field.key]),
  );

  return {
    complete: missing.length === 0,
    missing,
  };
};
