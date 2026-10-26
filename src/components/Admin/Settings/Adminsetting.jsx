
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../Admin_sidebar";
import AdminNavbar from "../Admin_navbar";
import { 
  FaShieldAlt, 
  FaLock, 
  FaEnvelope, 
  FaKey, 
  FaMobileAlt,
  FaUserSecret,
  FaBell,
  FaGlobe,
  FaDatabase,
  FaTrashAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaSave,
  FaSync,
  FaUserShield,
  FaFingerprint,
  FaInfoCircle
} from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import settingsBg from "../../../assets/c3.png"; // Add your background image path

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
  const [isMobile, setIsMobile] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAPassword, setTwoFAPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showResetEmailModal, setShowResetEmailModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("security");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Handle responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetch2FAStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        showToast("No authentication token found.", "error");
        return;
      }
      const res = await api.get("/admin/2fa/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const message = res.data.message;
      if (message.includes("enabled")) {
        setIs2FAEnabled(true);
      } else {
        setIs2FAEnabled(false);
      }
    } catch (err) {
      console.error("Error fetching 2FA status:", err);
      showToast("Failed to load 2FA status", "error");
    }
  };

  const submit2FAToggle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.patch(
        "/admin/2fa/toggle",
        { entered_password: twoFAPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(res.data.message, "success");
      setIs2FAEnabled((prev) => !prev);
      setShow2FAModal(false);
      setTwoFAPassword("");
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to toggle 2FA", "error");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!resetEmail) {
      showToast("Please enter your email address", "error");
      return;
    }
    setLoading(true);
    try {
      await api.post(
        "/admin/password-reset/request",
        { email: resetEmail },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );
      showToast("OTP sent to your email successfully!", "success");
      setShowResetEmailModal(false);
      setShowResetConfirmModal(true);
    } catch (err) {
      showToast("Failed to send OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async () => {
    if (!newPassword || !otpCode) {
      showToast("Please enter new password and OTP", "error");
      return;
    }
    setLoading(true);
    try {
      await api.post(
        "/admin/password-reset/confirm",
        { email: resetEmail, new_password: newPassword, otp_code: otpCode },
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );
      showToast("Password reset successful!", "success");
      setShowResetConfirmModal(false);
      setNewPassword("");
      setOtpCode("");
    } catch (err) {
      showToast("Password reset failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) return;
    setLoading(true);
    try {
      await api.delete("/admin/delete", {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      });
      showToast("Account deleted successfully", "success");
      localStorage.removeItem("auth_token");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      showToast("Failed to delete account", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch2FAStatus();
  }, []);

  const tabs = [
    { id: "security", label: "Security", icon: <FaShieldAlt size={14} /> },
    { id: "password", label: "Password", icon: <FaLock size={14} /> },
    { id: "danger", label: "Danger Zone", icon: <FaExclamationTriangle size={14} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-fixed bg-cover bg-center relative" style={{ backgroundImage: `url(${settingsBg})` }}>
      {/* Dark Overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 animate-slideIn ${
          toast.type === "success" ? "bg-gradient-to-r from-emerald-500 to-green-500" : 
          toast.type === "error" ? "bg-gradient-to-r from-red-500 to-rose-500" : 
          "bg-gradient-to-r from-blue-500 to-cyan-500"
        } text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium backdrop-blur-sm`}>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✗" : "ℹ"}
          </div>
          {toast.message}
        </div>
      )}

      <AdminNavbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative z-10">
        <AdminSidebar 
          isVisible={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <main 
          className={`
            flex-1 transition-all duration-500 ease-out w-full min-h-screen
            ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}
            ${isMobile && sidebarOpen ? 'overflow-hidden' : ''}
          `}
        >
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
              
              {/* Breadcrumb */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/60">Dashboard</span>
                  <span className="text-white/40">›</span>
                  <span className="text-purple-300 font-medium">Settings</span>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  Account Settings
                </h1>
                <p className="text-white/60 text-sm md:text-base mt-2">
                  Manage your security preferences and account settings
                </p>
              </div>

              {/* Main Settings Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200 bg-gray-50/50">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                          : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8">
                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      {/* 2FA Section */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="p-6">
                          <div className="flex items-start justify-between flex-wrap gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                                <FaFingerprint className="text-white text-xl" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                  Add an extra layer of security to your account
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className={`w-2 h-2 rounded-full ${is2FAEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  <span className="text-xs text-gray-600">
                                    2FA is <strong className={is2FAEnabled ? "text-green-600" : "text-red-600"}>
                                      {is2FAEnabled ? "enabled" : "disabled"}
                                    </strong>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setShow2FAModal(true)}
                              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-sm ${
                                is2FAEnabled
                                  ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md"
                              }`}
                            >
                              {is2FAEnabled ? (
                                <>
                                  <FaTimesCircle size={14} />
                                  Disable 2FA
                                </>
                              ) : (
                                <>
                                  <FaShieldAlt size={14} />
                                  Enable 2FA
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Security Tips */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FaInfoCircle className="text-blue-600" size={18} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm">Security Tips</h4>
                            <ul className="text-xs text-gray-600 mt-2 space-y-1">
                              <li className="flex items-center gap-2">• Use a strong, unique password for your account</li>
                              <li className="flex items-center gap-2">• Enable 2FA for an extra layer of security</li>
                              <li className="flex items-center gap-2">• Never share your password with anyone</li>
                              <li className="flex items-center gap-2">• Regularly review your account activity</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password Tab */}
                  {activeTab === "password" && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                            <FaKey className="text-white text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Reset Password</h3>
                            <p className="text-gray-500 text-sm mt-1">
                              Make sure your password is strong and unique
                            </p>
                          </div>
                        </div>

                        <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
                          <p className="text-sm text-yellow-800 flex items-center gap-2">
                            <FaExclamationTriangle size={14} />
                            Password requirements: Minimum 8 characters, containing uppercase, lowercase, number and special character
                          </p>
                        </div>

                        <button
                          onClick={() => setShowResetEmailModal(true)}
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                        >
                          <FaKey size={14} />
                          Reset Password
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Danger Zone Tab */}
                  {activeTab === "danger" && (
                    <div className="space-y-6">
                      <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <FaExclamationTriangle className="text-red-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
                            <p className="text-gray-600 text-sm mt-1">
                              Irreversible actions that will permanently affect your account
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                              <h4 className="font-semibold text-red-600">Delete Account</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Once deleted, all your data will be permanently removed
                              </p>
                            </div>
                            <button
                              onClick={handleDeleteAccount}
                              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-md"
                            >
                              <FaTrashAlt size={14} />
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">
                {is2FAEnabled ? "Disable" : "Enable"} Two-Factor Authentication
              </h3>
              <p className="text-purple-100 text-sm mt-1">
                Enter your password to confirm
              </p>
            </div>
            <div className="p-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 pr-12"
                  value={twoFAPassword}
                  onChange={(e) => setTwoFAPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={submit2FAToggle}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" size={16} /> : "Confirm"}
                </button>
                <button
                  onClick={() => {
                    setShow2FAModal(false);
                    setTwoFAPassword("");
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Email Modal */}
      {showResetEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Reset Password</h3>
              <p className="text-blue-100 text-sm mt-1">Enter your email to receive OTP</p>
            </div>
            <div className="p-6">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  className="w-full px-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" size={16} /> : "Send OTP"}
                </button>
                <button
                  onClick={() => setShowResetEmailModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Create New Password</h3>
              <p className="text-green-100 text-sm mt-1">Enter your new password and OTP</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 pr-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              <div className="relative">
                <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  className="w-full px-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter OTP"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={confirmReset}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" size={16} /> : "Reset Password"}
                </button>
                <button
                  onClick={() => {
                    setShowResetConfirmModal(false);
                    setNewPassword("");
                    setOtpCode("");
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Settings;