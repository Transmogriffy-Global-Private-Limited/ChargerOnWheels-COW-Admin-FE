import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaEnvelope, 
  FaLock, 
  FaKey, 
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaShieldAlt,
  FaUserShield,
  FaEnvelopeOpenText,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import ForgetPassword from "../../assets/hero.jpg";

const BASE_URL_AND_PORT = "https://api.static.ev.transev.site";
const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/[0-9]/)) strength++;
    if (pass.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    checkPasswordStrength(newPass);
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return "bg-red-500 w-1/4";
      case 2: return "bg-orange-500 w-2/4";
      case 3: return "bg-yellow-500 w-3/4";
      case 4: return "bg-green-500 w-full";
      default: return "bg-gray-200 w-0";
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestBody = { email };

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/admin/password-reset/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": `${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      setLoading(false);

      if (response.ok) {
        setAlertMessage("OTP sent to your email successfully!");
        setAlertType("success");
        setStep(2);
      } else {
        setAlertMessage("Failed to send OTP. Please check your email.");
        setAlertType("error");
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage("An error occurred. Please try again later.");
      setAlertType("error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setAlertMessage("Passwords do not match!");
      setAlertType("error");
      return;
    }

    if (passwordStrength < 3) {
      setAlertMessage("Please use a stronger password!");
      setAlertType("error");
      return;
    }

    setLoading(true);

    const requestBody = {
      email,
      new_password: newPassword,
      otp_code: otpCode,
    };

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/admin/password-reset/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": `${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      setLoading(false);

      if (response.ok) {
        setAlertMessage("Password reset successful! Redirecting to login...");
        setAlertType("success");

        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else {
        setAlertMessage("Invalid OTP or failed to reset password.");
        setAlertType("error");
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage("An error occurred. Please try again later.");
      setAlertType("error");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${ForgetPassword})` }}
    >
      {/* Dark Overlay for better readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
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
              {step === 1 ? (
                <FaEnvelopeOpenText className="text-white text-3xl" />
              ) : (
                <FaKey className="text-white text-3xl" />
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h2>
            <p className="text-white/80 text-sm">
              {step === 1 
                ? "Enter your email to receive a verification code" 
                : "Create a new strong password for your account"}
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8">
          {/* Alert Message */}
          {alertMessage && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-slideDown ${
              alertType === "success" 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {alertType === "success" ? <FaCheckCircle size={18} /> : <FaExclamationCircle size={18} />}
              <span className="text-sm">{alertMessage}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll send a 6-digit verification code to this email
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" size={18} />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <FaArrowRight size={14} />
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center pt-4">
                <Link to="/admin/login" className="text-gray-500 hover:text-purple-600 text-sm flex items-center justify-center gap-1 transition-colors group">
                  <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                    <FaKey size={18} />
                  </div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-center tracking-wider text-lg"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                    <FaLock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
                      <div className={`${getPasswordStrengthColor()} transition-all duration-300`}></div>
                    </div>
                    <p className="text-xs mt-2 text-gray-600">
                      Password strength: <span className={`font-semibold ${
                        passwordStrength === 1 ? 'text-red-500' :
                        passwordStrength === 2 ? 'text-orange-500' :
                        passwordStrength === 3 ? 'text-yellow-500' :
                        passwordStrength === 4 ? 'text-green-500' : 'text-gray-500'
                      }`}>{getPasswordStrengthText()}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                    <FaLock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <FaExclamationCircle size={12} />
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-xs text-gray-600">Min. 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-xs text-gray-600">Uppercase & lowercase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-xs text-gray-600">At least 1 number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${/[^a-zA-Z0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-xs text-gray-600">Special character</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" size={18} />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <FaArrowRight size={14} />
                  </>
                )}
              </button>

              {/* Back to Email Step */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpCode("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setAlertMessage(null);
                  }}
                  className="text-gray-500 hover:text-purple-600 text-sm flex items-center justify-center gap-1 mx-auto transition-colors group"
                >
                  <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                  Back to email step
                </button>
              </div>
            </form>
          )}

          {/* Help Text */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Need assistance? <Link to="/contact" className="text-purple-600 hover:underline">Contact Support</Link>
            </p>
          </div>
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
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;