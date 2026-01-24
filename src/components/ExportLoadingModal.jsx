import React from "react";
import { Modal } from "antd";
import Lottie from "lottie-react";
import exportLoadingAnimation from "../assets/lottie/export-loading.json";

const ExportLoadingModal = ({ visible }) => {
  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      width="100%"
      style={{
        top: 0,
        maxWidth: "100vw",
        padding: 0,
        margin: 0,
      }}
      bodyStyle={{
        padding: 0,
        margin: 0,
        background: "transparent",
      }}
      styles={{
        mask: {
          backdropFilter: "blur(2px)",
        },
      }}
      transitionName=""
      maskTransitionName=""
      modalRender={() => (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-80 h-80 mb-6">
              <Lottie
                animationData={exportLoadingAnimation}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            <h3 className="text-3xl font-bold text-white drop-shadow-lg">
              Mohon Tunggu...
            </h3>
          </div>
        </div>
      )}
    />
  );
};

export default ExportLoadingModal;
