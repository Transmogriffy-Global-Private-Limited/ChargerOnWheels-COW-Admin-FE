import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt,
  FaCheckCircle, FaExclamationCircle, FaSpinner, FaKey, FaUserShield,
  FaArrowLeft, FaBolt, FaLeaf, FaRedo,
} from "react-icons/fa";
import loginImage from "../../assets/login.png";

/* ==================== INLINE API LAYER ==================== */
const BASE_URL    = "https://dev-evcowbbe.transev.site";
const ACCESS_KEY  = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY    = "admin_user";

async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (auth) {
    const t = localStorage.getItem(ACCESS_KEY);
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);

  console.log(
    "%c[API →] " + method + " " + path,
    "color:#10b981;font-weight:bold",
    "\n  auth:", auth,
    "\n  body:", body !== undefined ? JSON.stringify(body) : "(no body)"
  );

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method, headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
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

  // Unwrap { data: {...} } only when there's no error key
  if (
    data && typeof data === "object" && !Array.isArray(data) &&
    "data" in data && !("error" in data) &&
    Object.keys(data).length <= 2
  ) {
    data = data.data;
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
    e.status     = res.status;
    e.code       = data?.error?.code || data?.code;
    e.requestId  = data?.error?.request_id;
    e.body       = data;
    e.retryAfter = Number(res.headers.get("Retry-After")) || null;
    throw e;
  }

  return data;
}

function saveSession(payload) {
  const find = (obj, keys, depth = 4) => {
    if (!obj || typeof obj !== "object" || depth < 0) return null;
    for (const k of keys) if (typeof obj[k] === "string" && obj[k].trim()) return obj[k];
    for (const v of Object.values(obj)) {
      if (v && typeof v === "object") {
        const f = find(v, keys, depth - 1);
        if (f) return f;
      }
    }
    return null;
  };
  const access = find(payload, [
    "access_token","accessToken","access","token","jwt","id_token","idToken","bearer",
  ]);
  const refresh = find(payload, ["refresh_token","refreshToken","refresh"]);
  const user =
    payload.user ||
    payload.admin ||
    (payload.id && payload.email ? payload : null) ||
    payload.data?.user ||
    payload.data?.admin ||
    (payload.data?.id && payload.data?.email ? payload.data : null);

  if (access)  localStorage.setItem(ACCESS_KEY,  access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  if (user)    localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { access, refresh, user };
}

function extractChallengeId(res) {
  if (!res || typeof res !== "object") return null;
  return (
    res.challenge_id ||
    res.challengeId ||
    res.data?.challenge_id ||
    res.data?.challengeId ||
    null
  );
}

function detectOtp(res) {
  if (!res || typeof res !== "object") return false;
  const keys = [
    "requires_otp","requiresOtp","otp_required","otpRequired",
    "two_factor_required","twoFactorRequired","two_factor",
    "requires_2fa","requires2FA","mfa_required","mfaRequired",
  ];
  for (const k of keys) if (res[k]) return true;
  if (res.challenge === "otp" || res.challenge === "2fa" || res.challenge === "LOGIN_2FA") return true;
  if (res.data && typeof res.data === "object") {
    for (const k of keys) if (res.data[k]) return true;
    if (res.data.challenge === "otp" || res.data.challenge === "2fa" || res.data.challenge === "LOGIN_2FA") return true;
  }
  // Fallback: if a challenge_id is present but no access_token, it's a 2FA challenge
  if (extractChallengeId(res) && !res.access_token && !res.data?.access_token) return true;
  return false;
}

/* Fetch profile after login so the layout shows correct user */
async function fetchAndSaveUser() {
  try {
    const meRes = await apiRequest("/api/v1/admin/me", { auth: true });
    const u = meRes?.user || meRes?.admin || meRes?.data?.user || meRes?.data || meRes;
    if (u && (u.id || u.email)) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      console.log("[me] ✅ user saved:", u);
    }
  } catch (err) {
    console.warn("[me] failed to fetch user (non-fatal):", err?.message);
  }
}

/* ==================== COMPONENT ==================== */
const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData]               = useState({ email: "", password: "" });
  const [otpCode, setOtpCode]                 = useState("");
  const [challengeId, setChallengeId]         = useState(null);   // LOGIN_2FA challenge
  const [error, setError]                     = useState(null);
  const [errorHint, setErrorHint]             = useState(null);
  const [info, setInfo]                       = useState(null);
  const [showOtpForm, setShowOtpForm]         = useState(false);
  const [userEmail, setUserEmail]             = useState("");
  const [isLoading, setIsLoading]             = useState(false);
  const [isResending, setIsResending]         = useState(false);
  const [resendCooldown, setResendCooldown]   = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPassword, setShowPassword]       = useState(false);
  const [rememberMe, setRememberMe]           = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("remember_email");
    if (saved) {
      setFormData((f) => ({ ...f, email: saved }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp_code") setOtpCode(value.replace(/\D/g, "").slice(0, 6));
    else setFormData({ ...formData, [name]: value });
  };

  const surfaceError = (err) => {
    setError(err?.message || "Something went wrong. Please try again.");

    if (err?.isNetworkError) {
      setErrorHint(
        "Network / CORS error — cannot reach the API. " +
          `Ask backend to allow origin ${window.location.origin}.`
      );
    } else if (err?.code === "RATE_LIMITED" && err.retryAfter) {
      setResendCooldown(err.retryAfter);
      setErrorHint(`Too many attempts. Please wait ${err.retryAfter}s.`);
    } else if (err?.status === 401) {
      setErrorHint("Wrong email/password or OTP has expired.");
    } else if (err?.status === 403) {
      setErrorHint("This challenge does not belong to the admin plane.");
    } else {
      setErrorHint(null);
    }
  };

  const goToDashboard = () => {
    setShowSuccessPopup(true);
    setTimeout(() => navigate("/dashboard", { replace: true }), 800);
  };

  /* ---------- LOGIN ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setErrorHint(null); setInfo(null);
    setIsLoading(true);

    try {
      const res = await apiRequest("/api/v1/admin/auth/login", {
        method: "POST",
        body: { email: formData.email, password: formData.password },
        auth: false,
      });
      console.log("[login] response:", res);

      // 2FA challenge?
      if (detectOtp(res)) {
        const cid = extractChallengeId(res);
        setUserEmail(formData.email);
        setChallengeId(cid);
        setShowOtpForm(true);
        setResendCooldown(60);
        setInfo("A verification code has been sent to your email.");
        if (!cid) {
          console.warn(
            "[login] ⚠️ No challenge_id found in login response. " +
            "/verify-otp will fail unless backend returns one."
          );
        }
        return;
      }

      saveSession(res || {});

      const savedToken = localStorage.getItem(ACCESS_KEY);
      if (!savedToken) {
        console.error("[login] No access_token in localStorage. Response:", res);
        setError("Login succeeded but no token was returned.");
        return;
      }

      if (rememberMe) localStorage.setItem("remember_email", formData.email);
      else localStorage.removeItem("remember_email");

      await fetchAndSaveUser();
      goToDashboard();
    } catch (err) {
      surfaceError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- VERIFY OTP — { challenge_id, code } per Swagger ---------- */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null); setErrorHint(null); setInfo(null);

    if (!challengeId) {
      setError("No challenge ID. Please sign in again.");
      setErrorHint("Backend /login must return challenge_id for 2FA.");
      return;
    }
    if (!/^\d{6}$/.test(otpCode)) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest("/api/v1/admin/auth/verify-otp", {
        method: "POST",
        body: {
          challenge_id: challengeId,   // ✅ required per Swagger
          code:         otpCode,       // ✅ field name is "code", not "otp_code"
        },
        auth: false,
      });
      console.log("[verify-otp] response:", res);

      saveSession(res || {});

      const savedToken = localStorage.getItem(ACCESS_KEY);
      if (!savedToken) {
        console.error("[otp] No access_token saved after verify.");
        setError("OTP verified but no session token was returned.");
        return;
      }

      await fetchAndSaveUser();
      goToDashboard();
    } catch (err) {
      surfaceError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- RESEND LOGIN OTP ---------- */
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null); setErrorHint(null); setInfo(null);
    try {
      await apiRequest("/api/v1/admin/auth/2fa/resend", {
        method: "POST",
        body: { email: userEmail },
        auth: false,
      });
      setInfo("A new verification code has been sent.");
      setResendCooldown(60);
    } catch (err) {
      surfaceError(err);
    } finally {
      setIsResending(false);
    }
  };

  const backToLogin = () => {
    setShowOtpForm(false);
    setError(null); setErrorHint(null); setInfo(null);
    setOtpCode("");
    setChallengeId(null);
  };

  const ErrorBox = () =>
    error && (
      <div className="p-3 bg-rose-500/20 border border-rose-300/40 rounded-xl backdrop-blur-md animate-shake">
        <div className="flex items-start gap-2">
          <FaExclamationCircle className="text-rose-200 shrink-0 mt-0.5" size={14} />
          <div className="text-left">
            <p className="text-rose-50 text-sm font-semibold leading-snug">{error}</p>
            {errorHint && (
              <p className="text-rose-100/80 text-[11px] mt-1 leading-snug">{errorHint}</p>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/70 via-emerald-900/30 to-transparent" />

      <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
            <FaBolt className="text-emerald-300 text-lg" />
          </div>
          <div>
            <h1 className="text-white text-base sm:text-lg font-black tracking-tight drop-shadow-lg">
              Charger on Wheels
            </h1>
            <p className="text-emerald-200/90 text-[10px] sm:text-xs font-medium">
              EV Charging, Anytime Anywhere
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <FaLeaf className="text-emerald-300 text-[10px]" />
          <span className="text-white text-[11px] font-semibold">Green. Smart. On-demand.</span>
        </div>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-88px)] flex items-end justify-end px-4 sm:px-8 lg:px-16 pt-8 pb-10">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="relative rounded-3xl overflow-hidden border border-white/25 bg-white/10 backdrop-blur-2xl shadow-2xl shadow-emerald-950/40">
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent pointer-events-none" />
            <div className="relative p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/40 mb-3">
                  {!showOtpForm ? (
                    <FaUserShield className="text-white text-2xl" />
                  ) : (
                    <FaKey className="text-white text-2xl" />
                  )}
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                  {!showOtpForm ? "Welcome Back!" : "2FA Verification"}
                </h2>
                <p className="text-emerald-100/90 text-sm mt-1">
                  {!showOtpForm
                    ? "Sign in to your admin account"
                    : `Code sent to ${userEmail}`}
                </p>
              </div>

              {showSuccessPopup && (
                <div className="mb-5 p-3.5 bg-emerald-500/20 border border-emerald-300/40 rounded-xl flex items-center gap-3 animate-slideDown backdrop-blur-md">
                  <FaCheckCircle className="text-emerald-300 shrink-0" size={18} />
                  <div>
                    <p className="text-white font-semibold text-sm">Login Successful!</p>
                    <p className="text-emerald-100 text-xs">Redirecting…</p>
                  </div>
                </div>
              )}

              {info && !showSuccessPopup && (
                <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-300/30 rounded-xl flex items-center gap-2 backdrop-blur-md">
                  <FaCheckCircle className="text-emerald-300 shrink-0" size={14} />
                  <span className="text-emerald-50 text-xs">{info}</span>
                </div>
              )}

              {!showOtpForm ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-100/90 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200/80 group-focus-within:text-emerald-300 transition-colors">
                        <FaEnvelope size={16} />
                      </div>
                      <input
                        type="email" name="email" value={formData.email}
                        onChange={handleChange}
                        placeholder="admin@chargerwheels.com"
                        className="w-full pl-11 pr-4 py-3 border border-white/25 rounded-xl bg-white/10 text-white placeholder-emerald-100/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/60 focus:border-emerald-300/80 focus:bg-white/15 transition-all text-sm backdrop-blur-md"
                        required autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-100/90 mb-1.5">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-200/80 group-focus-within:text-emerald-300 transition-colors">
                        <FaLock size={16} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password" value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full pl-11 pr-12 py-3 border border-white/25 rounded-xl bg-white/10 text-white placeholder-emerald-100/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/60 focus:border-emerald-300/80 focus:bg-white/15 transition-all text-sm backdrop-blur-md"
                        required autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-200/80 hover:text-emerald-300 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox" checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-emerald-500 border-white/40 rounded bg-white/10 focus:ring-emerald-400"
                      />
                      <span className="text-sm text-emerald-50">Remember me</span>
                    </label>
                    <Link
                      to="/forget-password"
                      className="text-sm text-emerald-300 hover:text-emerald-200 font-medium hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <ErrorBox />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/40 hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm tracking-wide"
                  >
                    {isLoading ? (
                      <><FaSpinner className="animate-spin" size={16} /> Signing in...</>
                    ) : (
                      <>Sign In <FaArrowRight size={12} /></>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-sm text-emerald-100/90">
                      Don't have an account?{" "}
                      <Link to="/admin/signup" className="text-emerald-300 font-semibold hover:underline">
                        Create Account
                      </Link>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-100/90 mb-1.5">
                      Verification Code
                    </label>
                    <input
                      type="text" name="otp_code" value={otpCode}
                      onChange={handleChange}
                      placeholder="• • • • • •"
                      className="w-full px-4 py-4 text-center text-2xl font-bold tracking-[0.4em] border border-white/25 rounded-xl bg-white/10 text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60 focus:border-emerald-300/80 focus:bg-white/15 transition-all backdrop-blur-md"
                      maxLength={6} required autoFocus
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-emerald-100/70">Didn't get the code?</span>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || isResending}
                        className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {isResending ? (
                          <><FaSpinner className="animate-spin" size={10} /> Sending…</>
                        ) : resendCooldown > 0 ? (
                          <>Resend in {resendCooldown}s</>
                        ) : (
                          <><FaRedo size={10} /> Resend OTP</>
                        )}
                      </button>
                    </div>
                  </div>

                  <ErrorBox />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/40 hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm tracking-wide"
                  >
                    {isLoading ? (
                      <><FaSpinner className="animate-spin" size={16} /> Verifying...</>
                    ) : (
                      <>Verify & Sign In <FaArrowRight size={12} /></>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={backToLogin}
                    className="w-full py-2.5 text-emerald-100/80 hover:text-emerald-300 transition-colors text-sm flex items-center justify-center gap-1.5 group font-medium"
                  >
                    <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" />
                    Back to login
                  </button>
                </form>
              )}

              <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-center gap-4 text-[11px] text-emerald-100/70">
                <div className="flex items-center gap-1.5">
                  <FaShieldAlt size={10} className="text-emerald-300" /><span>Secure</span>
                </div>
                <div className="w-1 h-1 bg-emerald-200/40 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <FaCheckCircle size={10} className="text-emerald-300" /><span>Encrypted</span>
                </div>
                <div className="w-1 h-1 bg-emerald-200/40 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <FaBolt size={10} className="text-emerald-300" /><span>EV Powered</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-white/70 drop-shadow-md">
            © {new Date().getFullYear()} Charger on Wheels. All rights reserved.
          </p>
        </div>
      </main>

      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp  { from { opacity: 0; transform: translateY(30px); }  to { opacity: 1; transform: translateY(0); } }
        @keyframes shake     { 0%,100% { transform: translateX(0); } 10%,30%,50%,70%,90% { transform: translateX(-2px); } 20%,40%,60%,80% { transform: translateX(2px); } }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-fadeInUp  { animation: fadeInUp 0.5s ease-out; }
        .animate-shake     { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default LoginPage;