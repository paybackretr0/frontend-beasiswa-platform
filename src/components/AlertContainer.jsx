import React from "react";
import CustomAlert from "./CustomAlert";

const AlertContainer = ({ alerts, onRemove, position = "top-right" }) => {
  const positionStyles = {
    "top-right": {
      position: "fixed",
      top: "24px",
      right: "24px",
      zIndex: 1000,
      maxWidth: "400px",
    },
    "top-left": {
      position: "fixed",
      top: "24px",
      left: "24px",
      zIndex: 1000,
      maxWidth: "400px",
    },
    "bottom-right": {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 1000,
      maxWidth: "400px",
    },
    inline: {
      position: "relative",
      width: "100%",
    },
  };

  if (!alerts || alerts.length === 0) return null;

  return (
    <div style={positionStyles[position]}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {alerts.map((alert) => (
          <CustomAlert
            key={alert.id}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            duration={0}
            onClose={() => onRemove(alert.id)}
            style={alert.style}
          />
        ))}
      </div>
    </div>
  );
};

export default AlertContainer;
