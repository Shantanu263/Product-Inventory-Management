import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";

const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false); // 👁️ toggle for OTP
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    try {
      await axios.post(`${BASE_URL}/forgot-password/verifyMail/${email}`);
      setMessage("OTP sent to your email.");
      setError("");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Email not found");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/forgot-password/verifyOtp/${otp}/${email}`);
      const resetToken = res.data.resetToken;
      localStorage.setItem("resetToken", resetToken);
      setMessage("OTP verified. Redirecting to change password...");
      setTimeout(() => navigate("/reset-password"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter registered email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={handleSendEmail} className="btn btn-primary w-full">
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showOtp ? "text" : "password"}
                placeholder="Enter OTP"
                className="input input-bordered w-full pr-12"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-500 hover:text-gray-700 z-10"
                onClick={() => setShowOtp(!showOtp)}
              >
                {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button onClick={handleVerifyOtp} className="btn btn-primary w-full">
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
