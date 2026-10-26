
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiMail, HiKey, HiLockClosed, HiArrowLeft, HiCheckCircle, HiXCircle, HiRefresh, HiShieldCheck, HiEye, HiEyeOff } from "react-icons/hi";
import ForgetPassword from "../../assets/hotels.jpg";

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
  const [resendCountdown, setResendCountdown] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const navigate = useNavigate();

  // Countdown timer for resend
  React.useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Handle the first step (request OTP)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setAlertMessage("Please enter your email address");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    setLoading(true);
    setAlertMessage(null);

    const requestBody = { email };

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/password-reset/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": `${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      setLoading(false);

      if (response.ok) {
        setAlertMessage("OTP sent successfully to your email!");
        setAlertType("success");
        setResendCountdown(60);
        setStep(2);
        setTimeout(() => setAlertMessage(null), 5000);
      } else {
        const data = await response.json();
        setAlertMessage(data.message || "Failed to send OTP. Please check your email.");
        setAlertType("error");
        setTimeout(() => setAlertMessage(null), 5000);
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage("An error occurred. Please try again later.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/password-reset/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": `${API_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setAlertMessage("OTP resent successfully!");
        setAlertType("success");
        setResendCountdown(60);
        setTimeout(() => setAlertMessage(null), 3000);
      } else {
        setAlertMessage("Failed to resend OTP");
        setAlertType("error");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    } catch (error) {
      setAlertMessage("An error occurred");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input (alphanumeric, preserve case)
  const handleOtpChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^A-Za-z0-9]/g, "");
    value = value.slice(0, 8);
    setOtpCode(value);
    if (alertMessage) setAlertMessage(null);
  };

  // Handle the second step (confirm OTP and reset password)
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otpCode) {
      setAlertMessage("Please enter the OTP code");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    if (!newPassword) {
      setAlertMessage("Please enter a new password");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    if (newPassword.length < 8) {
      setAlertMessage("Password must be at least 8 characters long");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertMessage("Passwords do not match");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    if (otpAttempts >= 5) {
      setAlertMessage("Too many failed attempts. Please request a new OTP.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    setLoading(true);
    setAlertMessage(null);

    const requestBody = {
      email,
      new_password: newPassword,
      otp_code: otpCode,
    };

    try {
      const response = await fetch(`${BASE_URL_AND_PORT}/users/password-reset/confirm`, {
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
          navigate("/login");
        }, 2000);
      } else {
        setOtpAttempts(prev => prev + 1);
        const remainingAttempts = 5 - (otpAttempts + 1);
        setAlertMessage(remainingAttempts > 0 
          ? `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.` 
          : "Invalid OTP. Please request a new code.");
        setAlertType("error");
        setTimeout(() => setAlertMessage(null), 5000);
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage("An error occurred. Please try again later.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${ForgetPassword})` }}>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 px-8 pt-8 pb-6 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm animate-bounce">
                <HiShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Forgot Password?</h2>
              <p className="text-emerald-100 mt-2 text-sm">
                {step === 1 ? "Don't worry! We'll help you reset it" : "Enter the verification code and new password"}
              </p>
            </div>
          </div>

          {/* Alert Message */}
          {alertMessage && (
            <div className={`mx-6 mt-4 px-4 py-3 rounded-xl ${
              alertType === "success" 
                ? "bg-green-500/20 border border-green-400/50 text-green-200" 
                : "bg-red-500/20 border border-red-400/50 text-red-200"
            }`}>
              <div className="flex items-center space-x-2">
                {alertType === "success" ? (
                  <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <HiXCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{alertMessage}</span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    <HiMail className="inline mr-2 mb-0.5" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    required
                    autoFocus
                  />
                  <p className="text-gray-400 text-xs mt-2">
                    We'll send a verification code to this email
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    <HiMail className="inline mr-2 mb-0.5" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 cursor-not-allowed opacity-70"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    <HiKey className="inline mr-2 mb-0.5" /> Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter OTP (e.g., 4720F6)"
                    value={otpCode}
                    onChange={handleOtpChange}
                    maxLength={8}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 text-center text-xl tracking-widest font-mono"
                    required
                    autoFocus
                  />
                  <p className="text-gray-400 text-xs mt-2 flex items-center">
                    Enter the code exactly as received (case-sensitive)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    <HiLockClosed className="inline mr-2 mb-0.5" /> New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-300 transition-colors"
                    >
                      {passwordVisible ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Password must be at least 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    <HiLockClosed className="inline mr-2 mb-0.5" /> Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-300 transition-colors"
                    >
                      {confirmPasswordVisible ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Resend OTP Button */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCountdown > 0}
                    className={`flex items-center space-x-2 text-sm transition-all duration-200 ${
                      resendCountdown > 0
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-emerald-300 hover:text-emerald-200"
                    }`}
                  >
                    <HiRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    <span>
                      {resendCountdown > 0
                        ? `Resend in ${resendCountdown}s`
                        : "Resend OTP"}
                    </span>
                  </button>
                  
                  <div className="text-gray-500 text-xs flex items-center">
                    <HiShieldCheck className="mr-1" />
                    Secure reset
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Resetting Password...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}

            {/* Back to Login */}
            <div className="text-center mt-6">
              <Link to="/login" className="text-gray-400 hover:text-emerald-300 text-sm transition-colors inline-flex items-center space-x-1">
                <HiArrowLeft className="inline mr-1" />
                Back to Login
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white/5 px-8 py-4 text-center border-t border-white/10">
            <p className="text-gray-400 text-xs">
              This link will expire in 10 minutes for security reasons
            </p>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-emerald-300 text-lg font-bold">10 min</div>
            <div className="text-gray-400 text-xs">OTP Validity</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-emerald-300 text-lg font-bold">5</div>
            <div className="text-gray-400 text-xs">Max Attempts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;