import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaKey,
  FaUserShield,
  FaArrowLeft
} from "react-icons/fa";
import loginImage from "../../assets/new3.jpg";

const BASE_URL = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otpData, setOtpData] = useState({ otp_code: "" });
  const [error, setError] = useState(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const decodeAndStoreUser = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("🔐 Decoded Token:", decoded);
      
      if (decoded?.user_id) {
        localStorage.setItem("user_id", decoded.user_id);
        console.log("Decoded user ID:", decoded.user_id);
      }
      
      // ⭐⭐⭐ Extract role from token ⭐⭐⭐
      let userRole = 'admin'; // Default for admin login
      
      // Check role from token if available
      if (decoded?.role === 'admin' || decoded?.role === 'Admin' || decoded?.role === 'ADMIN') {
        userRole = 'admin';
      } else if (decoded?.user_type === 'admin') {
        userRole = 'admin';
      } else if (decoded?.is_admin === true) {
        userRole = 'admin';
      }
      
      // ⭐⭐⭐ CRITICAL: Store role in localStorage ⭐⭐⭐
      localStorage.setItem("user_role", userRole);
      console.log("✅ Stored user_role in localStorage:", userRole);
      
      // Store login timestamp
      localStorage.setItem("login_timestamp", Date.now().toString());
      
    } catch (err) {
      console.error("Error decoding token:", err);
      // Fallback: set role as admin
      localStorage.setItem("user_role", "admin");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp_code") {
      setOtpData({ ...otpData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log("🟢 Attempting admin login...");
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": API_KEY,
        },
        body: JSON.stringify(formData),
      });

      const authorizationHeader = response.headers.get("Authorization");

      if (authorizationHeader?.startsWith("Bearer ")) {
        const token = authorizationHeader.substring(7);
        localStorage.setItem("auth_token", token);
        setAuthToken(token);
        decodeAndStoreUser(token);
      }

      if (response.status === 308) {
        console.log("🟢 2FA required");
        setUserEmail(formData.email);
        setShowOtpForm(true);
      } else if (response.ok) {
        console.log("✅ Admin login successful!");
        
        // Ensure role is set even if not from token
        if (!localStorage.getItem("user_role")) {
          localStorage.setItem("user_role", "admin");
        }
        
        setShowSuccessPopup(true);
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("auth_token");

      console.log("🟢 Verifying OTP...");
      const response = await fetch(`${BASE_URL}/admin/2fa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "API-Key": API_KEY,
        },
        body: JSON.stringify({
          email: userEmail,
          otp_code: otpData.otp_code,
        }),
      });

      const authorizationHeader = response.headers.get("Authorization");

      if (authorizationHeader?.startsWith("Bearer ")) {
        const newToken = authorizationHeader.substring(7);
        localStorage.setItem("auth_token", newToken);
        setAuthToken(newToken);
        decodeAndStoreUser(newToken);
      }

      if (response.ok) {
        console.log("✅ OTP verified successfully!");
        
        // Ensure role is set
        if (!localStorage.getItem("user_role")) {
          localStorage.setItem("user_role", "admin");
        }
        
        setShowSuccessPopup(true);
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || "OTP verification failed.");
      }
    } catch (err) {
      console.error("OTP error:", err);
      setError("An error occurred during OTP verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      {/* Dark Overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md mx-4 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
        
        {/* Card Header with Gradient */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-6 py-8 text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-4 shadow-lg">
              {!showOtpForm ? (
                <FaUserShield className="text-white text-3xl" />
              ) : (
                <FaKey className="text-white text-3xl" />
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {!showOtpForm ? "Welcome Back!" : "Two-Factor Authentication"}
            </h2>
            <p className="text-white/80 text-sm">
              {!showOtpForm 
                ? "Sign in to your admin account" 
                : "Enter the verification code sent to your email"}
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8">
          {/* Success Popup */}
          {showSuccessPopup && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-slideDown">
              <FaCheckCircle className="text-green-600" size={20} />
              <div>
                <p className="text-green-700 font-medium">Login Successful!</p>
                <p className="text-green-600 text-sm">Redirecting to admin dashboard...</p>
              </div>
            </div>
          )}

          {!showOtpForm ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                    <FaEnvelope size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                    <FaLock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/admin/forgot-password" className="text-sm text-purple-600 hover:underline transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-shake">
                  <FaExclamationCircle className="text-red-500" size={16} />
                  <span className="text-red-600 text-sm">{error}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" size={18} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <FaArrowRight size={14} />
                  </>
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/admin/signup" className="text-purple-600 font-medium hover:underline transition-colors">
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              {/* OTP Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  name="otp_code"
                  value={otpData.otp_code}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Didn't receive the code? Check your email or spam folder
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-shake">
                  <FaExclamationCircle className="text-red-500" size={16} />
                  <span className="text-red-600 text-sm">{error}</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" size={18} />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Sign In
                    <FaArrowRight size={14} />
                  </>
                )}
              </button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={() => {
                  setShowOtpForm(false);
                  setError(null);
                  setOtpData({ otp_code: "" });
                }}
                className="w-full py-2.5 text-gray-500 hover:text-purple-600 transition-colors text-sm flex items-center justify-center gap-1 group"
              >
                <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                Back to login
              </button>
            </form>
          )}
        </div>

        {/* Card Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <FaShieldAlt size={10} />
              <span>Secure</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1">
              <FaCheckCircle size={10} />
              <span>Encrypted</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1">
              <FaUserShield size={10} />
              <span>Protected</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;