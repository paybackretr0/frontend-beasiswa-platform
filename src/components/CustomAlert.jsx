import React, { useState, useEffect } from "react";
import { Alert } from "antd";

const CustomAlert = ({
  type = "success",
  title,
  message,
  duration = 4000,
  showIcon = true,
  closable = true,
  onClose,
  style = {},
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <Alert
      type={type}
      message={title}
      description={message}
      showIcon={showIcon}
      closable={closable}
      onClose={handleClose}
      style={{
        marginBottom: "16px",
        ...style,
      }}
    />
  );
};

export default CustomAlert;
