import React from "react";
import { useEmailVerification } from "../hooks/useEmailVerification";
import EmailVerificationPrompt from "../pages/user/EmailVerificationPrompt";
import { LoadingOutlined } from "@ant-design/icons";

const RequireEmailVerification = ({ children }) => {
  const { isVerified, userEmail, loading, refreshVerificationStatus } =
    useEmailVerification();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingOutlined className="text-4xl text-blue-600 mb-4" spin />
          <p className="text-gray-600">Memeriksa status verifikasi...</p>
        </div>
      </div>
    );
  }

  if (isVerified === false) {
    return (
      <EmailVerificationPrompt
        userEmail={userEmail}
        onVerificationSuccess={refreshVerificationStatus}
      />
    );
  }

  return children;
};

export default RequireEmailVerification;
