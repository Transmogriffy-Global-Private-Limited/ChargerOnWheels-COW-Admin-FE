import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope, FaArrowLeft, FaArrowRight, FaCheckCircle,
  FaExclamationCircle, FaSpinner, FaLock, FaKey, FaBolt, FaShieldAlt,
} from "react-icons/fa";

/* ==================== INLINE API LAYER ==================== */
const BASE_URL = "https://dev-evcowbbe.transev.site";
const ACCESS_KEY = "access_token";

async function apiRequest(path, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    const e = new Error(
      "Network / CORS error — cannot reach the API. Ask backend to allow origin " +
        window.location.origin + "."
    );
    e.isNetworkError = true;
    throw e;
  } finally {
    clearTimeout(timer);
  }
  const ct = res.headers.get("content-type") || "";
  let data = null;
  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    try { data = await res.text(); } catch { data = null; }
  }
  if (!res.ok) {
    const msg =
      (data &&
        (data.message ||
          data.error?.message ||
          (typeof data.error === "string" ? data.error : null) ||
          data.detail)) ||
      `Request failed with status ${res.status}`;
    const e = new Error(msg);
    e.status = res.status;
    throw e;
  }
  return data;
}

/* ==================== COMPONENT ==================== */
const ForgetPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = request, 2 = reset
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const surfaceError = (err) => {
    setError(err?.message || "Something went wrong. Please try again.");
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError(null); setInfo(null); setLoading(true);
    try {
      await apiRequest("/api/v1/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      setInfo(
        "If an account exists for this email, a reset code has been sent. Check your inbox."
      );
      setStep(2);
    } catch (err) {
      surfaceError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null); setInfo(null);

    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await apiRequest("/api/v1/auth/reset-password", {
        method: "POST",
        body: { token, new_password: newPassword },
      });
      setInfo("Password reset successful! Redirecting to login…");
      setTimeout(() => navigate("/login", { replace: true }), 1800);
    } catch (err) {
      surfaceError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl shadow-emerald-950/40">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/40 mb-3">
                {step === 1 ? <FaKey className="text-white text-2xl" /> : <FaLock className="text-white text-2xl" />}
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {step === 1 ? "Forgot Password?" : "Set New Password"}
              </h2>
              <p className="text-emerald-100/90 text-sm mt-1">
                {step === 1
                  ? "Enter your email — we'll send a reset code"
                  : "Enter the reset code and your new password"}
              </p>
            </div>

            {info && (
              <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-300/30 rounded-xl flex items-center gap-2">
                <FaCheckCircle className="text-emerald-300 shrink-0" size={14} />
                <span className="text-emerald-50 text-xs">{info}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-rose-500/20 border border-rose-300/40 rounded-xl flex items-start gap-2">
                <FaExclamationCircle className="text-rose-200 shrink-0 mt-0.5" size={14} />
                <span className="text-rose-50 text-sm">{error}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-100/90 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200/80">
                      <FaEnvelope size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@chargerwheels.com"
                      className="w-full pl-11 pr-4 py-3 border border-white/25 rounded-xl bg-white/10 text-white placeholder-emerald-100/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/60 text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 text-sm"
                >
                  {loading ? (
                    <><FaSpinner className="animate-spin" size={16} /> Sending…</>
                  ) : (
                    <>Send Reset Code <FaArrowRight size={12} /></>
                  )}
                </button>

                <Link
                  to="/login"
                  className="w-full py-2.5 text-emerald-100/80 hover:text-emerald-300 transition-colors text-sm flex items-center justify-center gap-1.5 group font-medium"
                >
                  <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" />
                  Back to login
                </Link>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-100/90 mb-1.5">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste the code from email"
                    className="w-full px-4 py-3 text-center tracking-wider border border-white/25 rounded-xl bg-white/10 text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-100/90 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 border border-white/25 rounded-xl bg-white/10 text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60 text-sm"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-100/90 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-3 border border-white/25 rounded-xl bg-white/10 text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60 text-sm"
                    required
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 text-sm"
                >
                  {loading ? (
                    <><FaSpinner className="animate-spin" size={16} /> Resetting…</>
                  ) : (
                    <>Reset Password <FaArrowRight size={12} /></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep(1); setError(null); setInfo(null); }}
                  className="w-full py-2.5 text-emerald-100/80 hover:text-emerald-300 text-sm flex items-center justify-center gap-1.5 group font-medium"
                >
                  <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" />
                  Use different email
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-center gap-4 text-[11px] text-emerald-100/70">
              <div className="flex items-center gap-1.5">
                <FaShieldAlt size={10} className="text-emerald-300" /><span>Secure</span>
              </div>
              <div className="w-1 h-1 bg-emerald-200/40 rounded-full" />
              <div className="flex items-center gap-1.5">
                <FaBolt size={10} className="text-emerald-300" /><span>Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;