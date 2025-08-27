import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";

const ChangePasswordFromOtpForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const resetToken = localStorage.getItem("resetToken");
      if (!resetToken) {
        setError("Reset token missing. Please try again.");
        return;
      }

      await axios.post(
        `${BASE_URL}/forgot-password/reset-password`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${resetToken}` },
        }
      );

      setMessage("Password changed successfully. Redirecting to login...");
      setTimeout(() => {
        localStorage.removeItem("resetToken");
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Change Password</h2>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="input input-bordered w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button onClick={handleChangePassword} className="btn btn-primary w-full">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordFromOtpForm;
