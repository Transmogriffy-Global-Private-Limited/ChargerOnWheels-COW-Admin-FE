// src/components/Admin/Settings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaShieldAlt, FaKey, FaLock, FaCheckCircle, FaExclamationCircle,
  FaSpinner, FaSignOutAlt, FaArrowLeft, FaBolt, FaEnvelope, FaEye, FaEyeSlash,
} from "react-icons/fa";

/* ==================== INLINE API LAYER ==================== */
const BASE_URL    = "https://dev-evcowbbe.transev.site";
const ACCESS_KEY  = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY    = "admin_user";

function getToken() { return localStorage.getItem(ACCESS_KEY); }
function getUser()  {
  try { const r = localStorage.getItem(USER_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (auth) {
    const t = getToken();
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
    const e = new Error("Network / CORS error — cannot reach the API.");
    e.isNetworkError = true;
    throw e;
  } finally { clearTimeout(timer); }

  const ct = res.headers.get("content-type") || "";
  let data = null;
  if (ct.includes("application/json")) { try { data = await res.json(); } catch { data = null; } }
  else { try { data = await res.text(); } catch { data = null; } }

  // Unwrap { data: {...} } only when there is no error key
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
    e.details    = data?.error?.details || data?.details;
    e.requestId  = data?.error?.request_id;
    e.body       = data;
    e.retryAfter = Number(res.headers.get("Retry-After")) || null;
    throw e;
  }

  return data;
}

function extractChallengeId(res) {
  if (!res || typeof res !== "object") return null;
  return (
    res.challenge_id || res.challengeId ||
    res.data?.challenge_id || res.data?.challengeId ||
    null
  );
}

/* ==================== CONFIRM 2FA — { challenge_id, code } ==================== */
async function confirm2FA(mode, challengeId, otpCode) {
  const path =
    mode === "enable"
      ? "/api/v1/admin/auth/2fa/enable/confirm"
      : "/api/v1/admin/auth/2fa/disable/confirm";

  const body = {
    challenge_id: String(challengeId || "").trim(),
    code:         String(otpCode || "").trim(),
  };

  console.log(`%c[2FA:${mode}:confirm] → POST ${path}`, "color:#10b981;font-weight:bold", body);

  const res = await apiRequest(path, { method: "POST", body, auth: true });
  console.log(`%c[2FA:${mode}:confirm] ✅ success`, "color:#10b981;font-weight:bold", res);
  return res;
}

/* ==================== COMPONENT ==================== */
export default function Settings() {
  const navigate = useNavigate();

  const [profile, setProfile]               = useState(getUser());
  const [loadingProfile, setLoadingProfile] = useState(true);

  /* ---------- 2FA state ---------- */
  const [twoFAEnabled, setTwoFAEnabled]         = useState(false);
  const [twoFAMode, setTwoFAMode]               = useState(null);       // 'enable' | 'disable' | null
  const [twoFAStage, setTwoFAStage]             = useState("idle");     // 'idle' | 'password' | 'otp'
  const [twoFAPassword, setTwoFAPassword]       = useState("");
  const [show2FAPwd, setShow2FAPwd]             = useState(false);
  const [twoFAOtp, setTwoFAOtp]                 = useState("");
  const [twoFAChallengeId, setTwoFAChallengeId] = useState(null);
  const [twoFALoading, setTwoFALoading]         = useState(false);
  const [twoFAError, setTwoFAError]             = useState(null);
  const [twoFAInfo, setTwoFAInfo]               = useState(null);
  const [twoFACooldown, setTwoFACooldown]       = useState(0);

  /* ---------- Change password ---------- */
  const [oldPassword, setOldPassword]         = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading]           = useState(false);
  const [pwdError, setPwdError]               = useState(null);
  const [pwdInfo, setPwdInfo]                 = useState(null);

  /* ---------- 2FA cooldown tick ---------- */
  useEffect(() => {
    if (twoFACooldown <= 0) return;
    const t = setTimeout(() => setTwoFACooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [twoFACooldown]);

  /* ---------- Load profile ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/api/v1/admin/me");
        const u   = res?.user || res?.admin || res?.data?.user || res?.data || res;
        if (u && (u.id || u.email)) {
          setProfile(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
          setTwoFAEnabled(Boolean(
            u.two_factor_enabled || u.twoFactorEnabled ||
            u.mfa_enabled || u.mfaEnabled ||
            u.is_2fa_enabled || u.has_2fa
          ));
        }
      } catch (err) {
        if (err.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
        }
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [navigate]);

  /* ---------- Reset 2FA state ---------- */
  const reset2FA = () => {
    setTwoFAMode(null);
    setTwoFAStage("idle");
    setTwoFAPassword("");
    setTwoFAOtp("");
    setTwoFAChallengeId(null);
    setTwoFAError(null);
    setTwoFAInfo(null);
    setShow2FAPwd(false);
    setTwoFACooldown(0);
  };

  /* ---------- STEP 1: click Enable/Disable ---------- */
  const start2FAFlow = (mode) => {
    setTwoFAMode(mode);
    setTwoFAStage("password");
    setTwoFAPassword("");
    setTwoFAOtp("");
    setTwoFAChallengeId(null);
    setTwoFAError(null);
    setTwoFACooldown(0);
    setTwoFAInfo(
      mode === "enable"
        ? "Enter your current password to receive a 2FA setup code by email."
        : "Enter your current password to receive a 2FA disable code by email."
    );
  };

  /* ---------- STEP 2: submit password → begin ---------- */
  const handleBegin2FA = async (e) => {
    e.preventDefault();
    setTwoFAError(null);

    if (!twoFAPassword) return setTwoFAError("Please enter your current password.");

    setTwoFALoading(true);
    try {
      const path =
        twoFAMode === "enable"
          ? "/api/v1/admin/auth/2fa/enable/begin"
          : "/api/v1/admin/auth/2fa/disable/begin";

      const res = await apiRequest(path, {
        method: "POST",
        body: { password: twoFAPassword },   // ✅ Swagger required field
        auth: true,
      });
      console.log(`[2FA:${twoFAMode}:begin] response:`, res);

      const cid = extractChallengeId(res);
      if (!cid) {
        setTwoFAError("Server did not return a challenge_id. Cannot continue.");
        return;
      }

      setTwoFAChallengeId(cid);
      setTwoFAStage("otp");
      setTwoFAInfo(
        res?.message ||
          "A 6-digit verification code has been emailed to you. Enter it below."
      );
      setTwoFAPassword("");
    } catch (err) {
      console.error(`[2FA:${twoFAMode}:begin] error:`, err);
      if (err.status === 401) {
        setTwoFAError("Wrong password or session expired. Please try again.");
      } else if (err.code === "CONFLICT") {
        setTwoFAError(`2FA is already ${twoFAMode === "enable" ? "enabled" : "disabled"}.`);
        setTwoFAEnabled(twoFAMode === "enable");
        setTwoFAStage("idle");
        setTwoFAMode(null);
      } else if (err.code === "PRINCIPAL_PLANE_MISMATCH") {
        setTwoFAError("This action is not allowed for your account type.");
      } else if (err.code === "RATE_LIMITED" && err.retryAfter) {
        setTwoFACooldown(err.retryAfter);
        setTwoFAError(`Too many attempts. Please wait ${err.retryAfter}s.`);
      } else {
        setTwoFAError(err.message);
      }
    } finally {
      setTwoFALoading(false);
    }
  };

  /* ---------- STEP 3: submit OTP → confirm ---------- */
  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    setTwoFAError(null);

    if (!/^\d{6}$/.test(twoFAOtp))
      return setTwoFAError("Please enter a valid 6-digit code.");

    if (!twoFAChallengeId)
      return setTwoFAError("Missing challenge_id. Please restart the flow.");

    setTwoFALoading(true);
    try {
      await confirm2FA(twoFAMode, twoFAChallengeId, twoFAOtp);

      setTwoFAEnabled(twoFAMode === "enable");
      setTwoFAInfo(
        twoFAMode === "enable"
          ? "✅ Two-factor authentication is now ENABLED."
          : "✅ Two-factor authentication is now DISABLED."
      );
      setTwoFAMode(null);
      setTwoFAStage("idle");
      setTwoFAOtp("");
      setTwoFAChallengeId(null);
    } catch (err) {
      console.error(`[2FA:${twoFAMode}:confirm] error:`, err);
      if (err.status === 401) {
        setTwoFAError("Code invalid or expired. Please try again.");
      } else if (err.code === "CONFLICT") {
        setTwoFAError("This 2FA state was already changed. Please refresh.");
        setTwoFAStage("idle");
        setTwoFAMode(null);
      } else if (err.code === "PRINCIPAL_PLANE_MISMATCH") {
        setTwoFAError("Challenge does not belong to your account. Restart the flow.");
      } else if (err.code === "RATE_LIMITED" && err.retryAfter) {
        setTwoFACooldown(err.retryAfter);
        setTwoFAError(`Too many attempts. Please wait ${err.retryAfter}s.`);
      } else {
        setTwoFAError(err.message);
      }
    } finally {
      setTwoFALoading(false);
    }
  };

  /* ==================================================================
   *  CHANGE PASSWORD — Swagger: { current_password, new_password }
   *  Success: ALL sessions revoked → must logout + redirect to /login
   * ================================================================== */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError(null); setPwdInfo(null);

    if (!oldPassword)                    return setPwdError("Please enter your current password.");
    if (newPassword.length < 12)         return setPwdError("New password must be at least 12 characters.");
    if (newPassword.length > 256)        return setPwdError("New password must be under 256 characters.");
    if (newPassword !== confirmPassword) return setPwdError("Passwords do not match.");
    if (newPassword === oldPassword)     return setPwdError("New password must differ from current password.");

    setPwdLoading(true);
    try {
      await apiRequest("/api/v1/admin/auth/password/change", {
        method: "POST",
        body: {
          current_password: oldPassword,     // ✅ Swagger field name
          new_password:     newPassword,
        },
        auth: true,
      });

      setPwdInfo("✅ Password changed. All sessions revoked — please sign in again.");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");

      // Backend revokes ALL sessions (incl. this one) — clear + redirect after 2s
      setTimeout(() => {
        clearSession();
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("[password/change] error:", err);
      if (err.status === 401) {
        setPwdError("Current password is incorrect or session expired.");
      } else if (err.status === 422) {
        setPwdError(err.message || "New password does not meet policy (12-256 chars).");
      } else if (err.status === 403) {
        setPwdError("You are not allowed to change the password for this account.");
      } else if (err.code === "RATE_LIMITED" && err.retryAfter) {
        setPwdError(`Too many attempts. Please wait ${err.retryAfter}s.`);
      } else {
        setPwdError(err.message || "Password change failed. Please try again.");
      }
    } finally {
      setPwdLoading(false);
    }
  };

  /* ==================================================================
   *  LOGOUT — Swagger: POST /logout, {} body, bearer REQUIRED
   *  auth: true so the bearer token is sent → server can revoke session
   * ================================================================== */
  const handleLogout = async () => {
    try {
      await apiRequest("/api/v1/admin/auth/logout", {
        method: "POST",
        body: {},              // server ignores but Content-Type required
        auth: true,            // ✅ MUST send bearer to identify session
      });
      console.log("[logout] ✅ session revoked on backend");
    } catch (err) {
      // If 401 → token already invalid; fine, we're logging out anyway.
      console.warn("[logout] backend error (ignored):", err?.code, err?.message);
    } finally {
      clearSession();
      navigate("/login", { replace: true });
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <FaSpinner className="animate-spin" size={32} />
          <p className="text-sm">Loading settings…</p>
        </div>
      </div>
    );
  }

  /* ==================== RENDER ==================== */
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <FaArrowLeft size={12} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2 text-slate-900">
            <FaBolt className="text-emerald-500" />
            <span className="font-bold text-sm">Charger on Wheels</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-600 text-sm -mt-3">
          Manage your account security and preferences
        </p>

        {/* ---------- Profile ---------- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FaUser className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Profile</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <FaEnvelope size={13} className="text-emerald-500" />
              <span className="text-sm">{profile?.email || "—"}</span>
            </div>
            {profile?.name && (
              <div className="flex items-center gap-2 text-slate-700">
                <FaUser size={13} className="text-emerald-500" />
                <span className="text-sm">{profile.name}</span>
              </div>
            )}
            {profile?.role && (
              <div className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-700 text-[11px] font-semibold uppercase tracking-wider">
                  {profile.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ---------- 2FA ---------- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FaShieldAlt className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Two-Factor Authentication</h2>
                <p className="text-xs text-slate-500">
                  {twoFAEnabled ? "Currently enabled ✅" : "Currently disabled"}
                </p>
              </div>
            </div>
            <span
              className={
                "px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider " +
                (twoFAEnabled
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200")
              }
            >
              {twoFAEnabled ? "ON" : "OFF"}
            </span>
          </div>

          {twoFAError && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
              <FaExclamationCircle className="text-rose-500 shrink-0 mt-0.5" size={13} />
              <span className="text-rose-700 text-xs">{twoFAError}</span>
            </div>
          )}
          {twoFAInfo && (
            <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
              <span className="text-emerald-700 text-xs">{twoFAInfo}</span>
            </div>
          )}

          {twoFAStage === "idle" && (
            <button
              onClick={() => start2FAFlow(twoFAEnabled ? "disable" : "enable")}
              className={
                "w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 " +
                (twoFAEnabled
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-md shadow-emerald-500/30")
              }
            >
              {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
              <FaShieldAlt size={12} />
            </button>
          )}

          {twoFAStage === "password" && (
            <form onSubmit={handleBegin2FA} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FaLock size={14} />
                  </div>
                  <input
                    type={show2FAPwd ? "text" : "password"}
                    value={twoFAPassword}
                    onChange={(e) => setTwoFAPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 text-sm"
                    autoFocus required autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShow2FAPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {show2FAPwd ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={twoFALoading || twoFACooldown > 0}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold disabled:opacity-70 text-sm flex items-center justify-center gap-2"
                >
                  {twoFALoading ? (
                    <><FaSpinner className="animate-spin" size={14} /> Sending code…</>
                  ) : twoFACooldown > 0 ? (
                    <>Retry in {twoFACooldown}s</>
                  ) : (
                    <>Continue</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={reset2FA}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {twoFAStage === "otp" && (
            <form onSubmit={handleConfirm2FA} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  6-digit code from email
                </label>
                <input
                  type="text"
                  value={twoFAOtp}
                  onChange={(e) => setTwoFAOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full px-4 py-3 text-center text-xl font-bold tracking-[0.4em] border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  maxLength={6} autoFocus required
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  No resend option for 2FA setup. If the code expires, restart the flow.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={twoFALoading || twoFACooldown > 0}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold disabled:opacity-70 text-sm flex items-center justify-center gap-2"
                >
                  {twoFALoading ? (
                    <><FaSpinner className="animate-spin" size={14} /> Confirming…</>
                  ) : twoFACooldown > 0 ? (
                    <>Retry in {twoFACooldown}s</>
                  ) : (
                    <>Confirm</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={reset2FA}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ---------- Change Password ---------- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FaLock className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
          </div>

          {pwdError && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
              <FaExclamationCircle className="text-rose-500 shrink-0 mt-0.5" size={13} />
              <span className="text-rose-700 text-xs">{pwdError}</span>
            </div>
          )}
          {pwdInfo && (
            <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
              <span className="text-emerald-700 text-xs">{pwdInfo}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 text-sm"
                required autoComplete="current-password"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 text-sm"
                required
                minLength={12}
                maxLength={256}
                autoComplete="new-password"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Must be 12–256 characters. Avoid common passwords.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 text-sm"
                required
                minLength={12}
                maxLength={256}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 text-sm shadow-md shadow-emerald-500/30"
            >
              {pwdLoading ? (
                <><FaSpinner className="animate-spin" size={14} /> Updating…</>
              ) : (
                <><FaKey size={12} /> Update Password</>
              )}
            </button>
          </form>
        </div>

        {/* ---------- Logout ---------- */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Sign Out</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                You will need to sign in again to access the admin panel
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-md shadow-rose-500/30"
            >
              <FaSignOutAlt size={12} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}