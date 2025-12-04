import { useState, useEffect } from "react";
import { getBasicProfile } from "../services/authService";

export const useEmailVerification = () => {
  const [isVerified, setIsVerified] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const checkVerificationStatus = async () => {
    try {
      setLoading(true);

      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (localUser.emailVerified === true) {
        setIsVerified(true);
        setUserEmail(localUser.email || "");
        setLoading(false);
        return;
      }

      const response = await getBasicProfile();
      if (response && response.data) {
        const verified = response.data.emailVerified === true;
        setIsVerified(verified);
        setUserEmail(response.data.email || "");

        console.log("Email verification status:", {
          verified,
          email: response.data.email,
        });

        const updatedUser = {
          ...localUser,
          id: response.data.id,
          email: response.data.email,
          full_name: response.data.full_name,
          emailVerified: response.data.emailVerified,
          role: response.data.role,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setIsVerified(false);
        console.log("No response data from basic profile");
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      setIsVerified(false);

      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (localUser.email) {
        setUserEmail(localUser.email);
        console.log("Using email from localStorage:", localUser.email);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshVerificationStatus = () => {
    checkVerificationStatus();
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      checkVerificationStatus();
    } else {
      setLoading(false);
      setIsVerified(false);
    }
  }, []);

  return {
    isVerified,
    userEmail,
    loading,
    refreshVerificationStatus,
  };
};
