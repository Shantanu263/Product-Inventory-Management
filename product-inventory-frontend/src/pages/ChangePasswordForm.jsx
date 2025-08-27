import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePasswordForm = () => {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = form;

    if (oldPassword === newPassword) {
      setError("New password must be different from old password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    try {
      await axios.post(
        '/api/auth/change-password',
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      localStorage.removeItem("accessToken");
      setSuccess("Password changed successfully. Logging out...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-base-200 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Change Password</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">Old Password:</label>
            <div className="col-span-2">
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Old Password"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">New Password:</label>
            <div className="col-span-2">
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="New Password"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <label className="text-right font-medium">Confirm Password:</label>
            <div className="col-span-2">
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          <div className="text-center pt-4">
            <button type="submit" className="btn btn-primary w-1/2">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
