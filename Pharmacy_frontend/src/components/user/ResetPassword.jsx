import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword as apiResetPassword } from "../../api/auth";

const STORAGE_KEY = "app_users";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledUsername = location.state?.username || "";

  const [userList, setUserList] = useState([]);
  const [form, setForm] = useState({
    username: prefilledUsername, // email
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  // Load users for dropdown
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setUserList(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load users from localStorage", e);
    }
  }, []);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (!form.username) {
      setErr("Please select a user.");
      return;
    }
    if (!form.newPassword || !form.confirmPassword) {
      setErr("Please fill all password fields.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setErr("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      // backend: email + newPassword + confirmPassword
      await apiResetPassword(
        form.username,
        form.newPassword,
        form.confirmPassword
      );
      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (error) {
      setErr(error.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-2 text-center">
          Reset your password
        </h2>
        <p className="text-xs text-gray-600 mb-4 text-center">
          Select a user and set a new password.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              User (Name / Email)
            </label>
            <select
              name="username"
              value={form.username}
              onChange={onChange}
              className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Select user</option>
              {userList.map((u, idx) => (
                <option key={idx} value={u.email}>
                  {u.fullName ? `${u.fullName} (${u.email})` : u.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={onChange}
              className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2"
            />
          </div>

          {err && <p className="text-xs text-red-600">{err}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-600 text-white py-2.5 text-sm font-medium"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-2 w-full text-xs text-gray-600 hover:underline"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}
