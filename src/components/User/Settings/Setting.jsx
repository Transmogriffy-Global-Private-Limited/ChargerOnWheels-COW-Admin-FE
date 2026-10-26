import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSidebar from "../../User/User_sidebar";
import UserNavbar from "../../User/User_Navbar";
import background from "../../../assets/slider.jpg";
import chargerImage from "../../../assets/tf13.png";
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockClosedIcon,
  MailIcon,
  UserIcon,
  BellIcon
} from "@heroicons/react/outline";
import { FaSpinner, FaShieldAlt, FaLock, FaEnvelope, FaTrashAlt, FaCheck, FaTimes, FaUserCircle } from "react-icons/fa";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const api = axios.create({
  baseURL: BASE_URL_AND_PORT,
  headers: {
    "api-key": API_KEY,
    "Content-Type": "application/json",
  },
});

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAPassword, setTwoFAPassword] = useState("");
  const [showResetEmailModal, setShowResetEmailModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetch2FAStatus();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(res.data.user_data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const fetch2FAStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.get("/users/2fa/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const message = res.data.status.message;
      setIs2FAEnabled(message.includes("enabled"));
    } catch (err) {
      console.error("Failed to load 2FA status");
    }
  };

  const submit2FAToggle = async () => {
    if (!twoFAPassword) {
      alert("Please enter your password");
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.patch(
        "/users/2fa/toggle",
        { entered_password: twoFAPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setIs2FAEnabled((prev) => !prev);
      setShow2FAModal(false);
      setTwoFAPassword("");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to toggle 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!resetEmail) {
      alert("Please enter your email");
      return;
    }
    setIsLoading(true);
    try {
      await api.post(
        "/users/password-reset/request",
        { email: resetEmail },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );
      alert("OTP sent to your email.");
      setShowResetEmailModal(false);
      setShowResetConfirmModal(true);
    } catch (err) {
      alert("Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmReset = async () => {
    if (!newPassword || !otpCode) {
      alert("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await api.post(
        "/users/password-reset/confirm",
        { email: resetEmail, new_password: newPassword, otp_code: otpCode },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );
      alert("Password reset successful.");
      setShowResetConfirmModal(false);
      setNewPassword("");
      setOtpCode("");
    } catch (err) {
      alert("Password reset failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    setIsLoading(true);
    try {
      await api.delete("/users/delete", {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      });
      alert("Account deleted successfully.");
      localStorage.removeItem("auth_token");
      window.location.href = "/";
    } catch (err) {
      alert("Failed to delete account.");
    } finally {
      setIsLoading(false);
    }
  };

  const Modal = ({ children, onClose, title }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-slideUp">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white transition">
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserNavbar onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <UserSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} w-full`}>
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Account Settings</h1>
                </div>
                <p className="text-gray-500 ml-2">Manage your security preferences and account settings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Settings Options */}
                <div className="space-y-6">
                  {/* Profile Summary Card */}
                  {userProfile && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {userProfile.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{userProfile.name}</h3>
                          <p className="text-sm text-gray-500">{userProfile.email}</p>
                          <p className="text-xs text-gray-400 mt-1">Member since {new Date().getFullYear()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Section */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-800">Security Settings</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      {/* 2FA Toggle */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FaShieldAlt className="text-blue-500" />
                            <span className="font-semibold text-gray-800">Two-Factor Authentication</span>
                          </div>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                              is2FAEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {is2FAEnabled ? <CheckCircleIcon className="h-3 w-3" /> : <XCircleIcon className="h-3 w-3" />}
                              {is2FAEnabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setShow2FAModal(true)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            is2FAEnabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              is2FAEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Password Reset */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <KeyIcon className="h-5 w-5 text-purple-500" />
                          <span className="font-semibold text-gray-800">Password</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">Make sure your password is strong and unique</p>
                        <button
                          onClick={() => setShowResetEmailModal(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <LockClosedIcon className="h-4 w-4" />
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-white rounded-2xl shadow-lg border border-red-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-white border-b border-red-200">
                      <div className="flex items-center gap-2">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
                        <h3 className="text-lg font-bold text-red-700">Danger Zone</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaTrashAlt className="h-4 w-4" />}
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Charger Image & Tips */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={chargerImage}
                      alt="EV Charger"
                      className="w-full h-64 object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="p-6 text-center">
                      <h3 className="text-white text-xl font-bold mb-2">Secure Your Account</h3>
                      <p className="text-blue-100 text-sm">
                        Enable 2FA and use a strong password to keep your account safe
                      </p>
                    </div>
                  </div>

                  {/* Security Tips */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                      Security Tips
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                        <FaCheck className="text-green-500 mt-0.5" />
                        <span>Use a unique password that you don't use elsewhere</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                        <FaCheck className="text-green-500 mt-0.5" />
                        <span>Enable Two-Factor Authentication for extra security</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                        <FaCheck className="text-green-500 mt-0.5" />
                        <span>Never share your password with anyone</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-gray-600">
                        <FaCheck className="text-green-500 mt-0.5" />
                        <span>Regularly review your account activity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <Modal title="Two-Factor Authentication" onClose={() => setShow2FAModal(false)}>
          <p className="text-gray-600 mb-4">
            Please enter your password to {is2FAEnabled ? "disable" : "enable"} Two-Factor Authentication
          </p>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={twoFAPassword}
              onChange={(e) => setTwoFAPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          <button
            onClick={submit2FAToggle}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <ShieldCheckIcon className="h-5 w-5" />}
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </Modal>
      )}

      {/* Reset Email Modal */}
      {showResetEmailModal && (
        <Modal title="Reset Password" onClose={() => setShowResetEmailModal(false)}>
          <p className="text-gray-600 mb-4">Enter your email address to receive a password reset OTP</p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <button
            onClick={sendOTP}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <MailIcon className="h-5 w-5" />}
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </Modal>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirmModal && (
        <Modal title="Set New Password" onClose={() => setShowResetConfirmModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
            </div>
            <button
              onClick={confirmReset}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <CheckCircleIcon className="h-5 w-5" />}
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Settings;