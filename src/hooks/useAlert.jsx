import { toast } from "sonner";

// useAlert now wraps Sonner (modern minimal toast library).
// API-nya dipertahankan sama persis dengan versi custom lama,
// jadi semua halaman (30+) yang memanggil success/error/warning/info
// langsung otomatis memakai toast Sonner tanpa diubah satu pun.
//
// Rendering toast dilakukan oleh <Toaster /> yang dipasang di App.jsx.

const typeMap = {
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info,
};

const useAlert = () => {
  const showAlert = (type, title, message, options = {}) => {
    const { duration = 4000, ...rest } = options;

    const render = typeMap[type] || toast;

    // `duration <= 0` berarti tahan sampai ditutup manual
    const id = render(title, {
      description: message || undefined,
      duration: duration > 0 ? duration : Infinity,
      ...rest,
    });

    return id;
  };

  const clearAlerts = () => {
    toast.dismiss();
  };

  /**
   * Toast untuk operasi async: 1 toast berpindah otomatis
   * loading -> success/error mengikuti hasil promise.
   *
   * @param {Promise} promiseFn - promise hasil operasi async
   * @param {{loading?: string|Function, success?: string|Function, error?: string|Function}} [messages]
   */
  const promise = (promiseFn, messages = {}) => {
    const {
      loading = "Memproses...",
      success = "Berhasil!",
      error = "Gagal",
    } = messages;

    return toast.promise(promiseFn, {
      loading,
      success,
      error: (err) =>
        typeof error === "function" ? error(err) : err?.message || error,
    });
  };

  const success = (title, message, options) =>
    showAlert("success", title, message, options);

  const error = (title, message, options) =>
    showAlert("error", title, message, options);

  const warning = (title, message, options) =>
    showAlert("warning", title, message, options);

  const info = (title, message, options) =>
    showAlert("info", title, message, options);

  return {
    showAlert,
    promise,
    clearAlerts,
    success,
    error,
    warning,
    info,
  };
};

export default useAlert;
