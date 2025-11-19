import { useState } from "react";

const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (type, title, message, options = {}) => {
    const id = Date.now() + Math.random();
    const alert = {
      id,
      type,
      title,
      message,
      duration: options.duration || 4000,
      ...options,
    };

    setAlerts((prev) => [...prev, alert]);

    if (alert.duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, alert.duration);
    }

    return id;
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const clearAlerts = () => {
    setAlerts([]);
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
    alerts,
    showAlert,
    removeAlert,
    clearAlerts,
    success,
    error,
    warning,
    info,
  };
};

export default useAlert;
