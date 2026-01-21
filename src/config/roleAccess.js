export const ROLE_ACCESS = {
  SUPERADMIN: {
    dashboard: true,
    accounts: true,
    scholarship: true,
    registration: true,
    report: true,
    government: true,
    website: true,
    reference: true,
    extra: true,
    infoScholarship: false,
  },

  VERIFIKATOR_FAKULTAS: {
    dashboard: true,
    registration: true,
  },

  VERIFIKATOR_DITMAWA: {
    dashboard: true,
    registration: true,
    government: true,
  },

  VALIDATOR_DITMAWA: {
    dashboard: true,
    registration: true,
    government: true,
  },

  PIMPINAN_FAKULTAS: {
    dashboard: true,
    report: true,
    infoScholarship: true,
  },

  PIMPINAN_DITMAWA: {
    dashboard: true,
    report: true,
    government: true,
    infoScholarship: true,
  },
};
