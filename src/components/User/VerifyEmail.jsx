import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMail, HiKey, HiCheckCircle, HiXCircle, HiRefresh, HiArrowLeft, HiClock, HiShieldCheck } from "react-icons/hi";
import { FiCopy } from "react-icons/fi";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const BASE_URL = "https://api.static.ev.transev.site";
  const API_KEY = "mlzuMoRFjdGhcFulLMaVtfwNAHycbBAf";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [showResendHint, setShowResendHint] = useState(false);

  // Check profile on load
  useEffect(() => {
    const checkProfile = async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "API-KEY": API_KEY,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          navigate("/login");
          return;
        }

        setEmail(data.user_data.email);

        if (data.user_data.email_verified) {
          localStorage.removeItem("auth_token");
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };

    checkProfile();
  }, [navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Send OTP with rate limiting
  const handleSendOtp = async () => {
    if (sendingOtp || resendCountdown > 0) return;

    setError("");
    setMessage("");
    setSendingOtp(true);
    setShowResendHint(false);

    try {
      const token = localStorage.getItem("auth_token");

      const res = await fetch(`${BASE_URL}/users/otp/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "API-KEY": API_KEY,
        },
        body: JSON.stringify({
          email,
          purpose: "Mail Verification",
        }),
      });

      if (res.ok) {
        setMessage("OTP sent successfully to your email!");
        setResendCountdown(60); // 60 seconds cooldown
        setOtpAttempts(0);
        setTimeout(() => setMessage(""), 5000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to send OTP");
        setTimeout(() => setError(""), 5000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle OTP input (allow alphanumeric, preserve exact case as typed)
  const handleOtpChange = (e) => {
    // Allow alphanumeric characters (letters and numbers), preserve case exactly as typed
    let value = e.target.value;
    // Remove any special characters, keep only letters and numbers
    value = value.replace(/[^A-Za-z0-9]/g, "");
    // Limit to 8 characters (can be 6-8 depending on your OTP length)
    value = value.slice(0, 8);
    setOtp(value);
    if (error) setError("");
  };

  // Verify OTP with attempt tracking - sends exactly what user typed
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the verification code");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (verifyingOtp) return;

    if (otpAttempts >= 5) {
      setError("Too many failed attempts. Please request a new OTP.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    setError("");
    setVerifyingOtp(true);

    try {
      const token = localStorage.getItem("auth_token");

      // Send OTP exactly as user typed (preserving case)
      const requestBody = {
        email,
        otp_code: otp, // Sending exactly what user typed - no case conversion
        purpose: "Mail Verification",
      };

      console.log("Sending OTP payload:", requestBody); // For debugging

      const res = await fetch(`${BASE_URL}/users/otp/verify/email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "API-KEY": API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          localStorage.removeItem("auth_token");
          navigate("/login");
        }, 2000);
      } else {
        setOtpAttempts(prev => prev + 1);
        const remainingAttempts = 5 - (otpAttempts + 1);
        if (remainingAttempts > 0) {
          setError(`Invalid OTP. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`);
        } else {
          setError("Invalid OTP. Please request a new code.");
        }
        setTimeout(() => setError(""), 5000);
      }
    } catch {
      setError("Verification failed. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Copy email to clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setShowResendHint(true);
    setTimeout(() => setShowResendHint(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 px-8 pt-8 pb-6 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm animate-bounce">
                <HiMail className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Verify Your Email</h2>
              <p className="text-emerald-100 mt-2 text-sm">Please verify your email to continue</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Email Display */}
            <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HiMail className="text-emerald-300 w-5 h-5" />
                  <div>
                    <p className="text-gray-400 text-xs">Verifying email</p>
                    <p className="text-white font-medium">{email}</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="text-gray-400 hover:text-emerald-300 transition-colors"
                  title="Copy email"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              </div>
              {showResendHint && (
                <p className="text-emerald-300 text-xs mt-2 animate-pulse">Email copied to clipboard!</p>
              )}
            </div>

            {/* Success Message */}
            {message && (
              <div className="mb-4 bg-green-500/20 border border-green-400/50 text-green-200 px-4 py-3 rounded-xl flex items-center space-x-2 animate-slide-down">
                <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl flex items-center space-x-2 animate-shake">
                <HiXCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* OTP Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  <HiKey className="inline mr-2 mb-0.5" /> Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter code (e.g., 4720F6 or 4720f6)"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={8}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest font-mono"
                  autoFocus
                />
                <p className="text-gray-400 text-xs mt-2 flex items-center">
                  <HiClock className="mr-1" />
                  Enter the code exactly as received (case-sensitive)
                </p>
              </div>

              {/* Resend OTP with Timer */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp || resendCountdown > 0}
                  className={`flex items-center space-x-2 text-sm transition-all duration-200 ${
                    resendCountdown > 0 || sendingOtp
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-emerald-300 hover:text-emerald-200"
                  }`}
                >
                  <HiRefresh className={`w-4 h-4 ${sendingOtp ? "animate-spin" : ""}`} />
                  <span>
                    {sendingOtp
                      ? "Sending..."
                      : resendCountdown > 0
                      ? `Resend in ${resendCountdown}s`
                      : "Resend OTP"}
                  </span>
                </button>
                
                <div className="text-gray-500 text-xs flex items-center">
                  <HiShieldCheck className="mr-1" />
                  Secure verification
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                disabled={verifyingOtp || !otp}
                className={`w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4 ${
                  !otp ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {verifyingOtp ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>

              {/* Help Text */}
              <div className="text-center pt-4">
                <p className="text-gray-400 text-xs">
                  Didn't receive the code? Check your spam folder or{" "}
                  <button
                    onClick={handleSendOtp}
                    disabled={resendCountdown > 0}
                    className="text-emerald-300 hover:text-emerald-200 underline"
                  >
                    request a new one
                  </button>
                </p>
              </div>

              {/* Back to Login */}
              <div className="text-center pt-2">
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-400 hover:text-emerald-300 text-sm transition-colors inline-flex items-center space-x-1"
                >
                  <HiArrowLeft className="inline mr-1" />
                  Back to Login
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white/5 px-8 py-4 text-center border-t border-white/10">
            <p className="text-gray-400 text-xs">
              OTP expires in 10 minutes. Please verify within the time limit.
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

export default VerifyEmail;