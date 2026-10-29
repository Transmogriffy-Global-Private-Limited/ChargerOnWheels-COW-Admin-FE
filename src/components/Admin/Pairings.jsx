// src/components/Admin/Pairings.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLink, FaUnlink, FaPlus, FaSearch, FaSyncAlt, FaCheckCircle,
  FaExclamationCircle, FaSpinner, FaTimes, FaClock, FaSignInAlt,
  FaLock, FaCommentDots, FaBolt, FaTruck, FaArrowRight,
  FaPlay, FaStop, FaInfoCircle,
} from "react-icons/fa";

/* ==================== INLINE API LAYER ==================== */
const BASE_URL    = "https://dev-evcowbbe.transev.site";
const ACCESS_KEY  = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY    = "admin_user";
const REASON_MIN_LENGTH = 8;

function getAccessToken()  { return localStorage.getItem(ACCESS_KEY); }
function getRefreshToken() { return localStorage.getItem(REFRESH_KEY); }
function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}
function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const AUTH_BYPASS = ["/auth/login", "/auth/verify-otp", "/auth/refresh", "/auth/2fa/resend", "/auth/password/change"];
function isAuthEndpoint(path) { return AUTH_BYPASS.some((p) => path.includes(p)); }

class SessionExpiredError extends Error {
  constructor() {
    super("Session expired. Please sign in again.");
    this.code = "SESSION_EXPIRED";
    this.isSessionExpired = true;
  }
}

let refreshInFlight = null;
async function tryRefreshToken() {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const refreshTok = getRefreshToken();
    if (!refreshTok) return false;
    try {
      const res = await fetch(`${BASE_URL}/api/v1/admin/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ refresh_token: refreshTok }),
      });
      if (!res.ok) return false;
      const ct = res.headers.get("content-type") || "";
      let data = null;
      if (ct.includes("application/json")) { try { data = await res.json(); } catch { data = null; } }
      const payload = data?.data || data || {};
      const newAccess  = payload.access_token  || payload.accessToken;
      const newRefresh = payload.refresh_token || payload.refreshToken;
      if (!newAccess) return false;
      localStorage.setItem(ACCESS_KEY, newAccess);
      if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);
      console.log("%c[auth] ✅ access token refreshed", "color:#10b981;font-weight:bold");
      return true;
    } catch { return false; }
    finally { refreshInFlight = null; }
  })();
  return refreshInFlight;
}

async function apiRequest(path, { method = "GET", body, auth = true, extraHeaders = {} } = {}) {
  const attempt = async () => {
    const headers = { "Content-Type": "application/json", Accept: "application/json", ...extraHeaders };
    if (auth) {
      const t = getAccessToken();
      if (t) headers.Authorization = `Bearer ${t}`;
    }
    console.log(
      "%c[PAIRINGS →] " + method + " " + path,
      "color:#8b5cf6;font-weight:bold",
      "\n  headers:", extraHeaders,
      "\n  body:", body !== undefined ? JSON.stringify(body) : "(none)"
    );
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    let res;
    try {
      res = await fetch(`${BASE_URL}${path}`, {
        method, headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch {
      clearTimeout(timer);
      const e = new Error("Network error — cannot reach Pairings API.");
      e.isNetworkError = true;
      throw e;
    } finally { clearTimeout(timer); }

    const ct = res.headers.get("content-type") || "";
    let data = null;
    if (ct.includes("application/json")) { try { data = await res.json(); } catch { data = null; } }
    else { try { data = await res.text(); } catch { data = null; } }
    if (
      data && typeof data === "object" && !Array.isArray(data) &&
      "data" in data && !("error" in data) &&
      Object.keys(data).length <= 2
    ) data = data.data;
    return { res, data };
  };

  let { res, data } = await attempt();

  if (res.status === 401 && auth && !isAuthEndpoint(path)) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      ({ res, data } = await attempt());
      if (res.ok) return data;
      if (res.status === 401) { clearSession(); throw new SessionExpiredError(); }
    } else { clearSession(); throw new SessionExpiredError(); }
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error?.message ||
        (typeof data.error === "string" ? data.error : null) || data.detail)) ||
      `Request failed (${res.status})`;
    const e = new Error(msg);
    e.status  = res.status;
    e.code    = data?.error?.code || data?.code;
    e.details = data?.error?.details;
    e.body    = data;
    e.headers = res.headers;
    throw e;
  }
  return data;
}

/* ==================== HELPERS ==================== */
function toArray(v) { return Array.isArray(v) ? v : v ? [v] : []; }

function extractPairings(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  return toArray(
    res.pairings || res.items || res.data?.pairings || res.data?.items || res.data || []
  );
}

function pairingStatus(p) {
  if (!p) return "unknown";
  if (p.ended_at || p.end_time || p.endedAt || p.closed_at) return "ended";
  const raw = String(p.status || p.state || "").toLowerCase();
  if (raw === "ended" || raw === "closed" || raw === "inactive" || raw === "terminated") return "ended";
  if (raw === "active" || raw === "ongoing" || raw === "open" || raw === "paired") return "active";
  if (p.is_active === false) return "ended";
  if (p.is_active === true) return "active";
  return "active";
}

function statusStyle(norm) {
  if (norm === "ended")
    return { bg: "from-slate-400 to-slate-600", chip: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-500", label: "Ended" };
  return { bg: "from-violet-400 to-purple-500", chip: "bg-violet-100 text-violet-800 border-violet-200", dot: "bg-violet-500", label: "Active" };
}

function shortId(id) {
  if (!id) return "—";
  const s = String(id);
  return s.length > 12 ? s.slice(0, 8) + "…" : s;
}
function fmtDate(d) {
  if (!d) return "—";
  try { const dt = new Date(d); if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return String(d); }
}
function relativeTime(d) {
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    const diff = Date.now() - dt.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return fmtDate(d);
  } catch { return ""; }
}

/* ==================================================================
 *  ✅ CREATE PAIRING — exact Swagger shape:
 *  { charger_id, vehicle_id, reason }   (reason required, min 8 chars)
 * ================================================================== */
async function createPairing({ charger_id, vehicle_id, reason }) {
  const trimmedCharger = String(charger_id || "").trim();
  const trimmedVehicle = String(vehicle_id || "").trim();
  const trimmedReason  = String(reason || "").trim();

  if (!trimmedCharger) throw new Error("Charger ID is required.");
  if (!trimmedVehicle) throw new Error("Vehicle ID is required.");
  if (!trimmedReason)  throw new Error("Reason is required.");
  if (trimmedReason.length < REASON_MIN_LENGTH)
    throw new Error(`Reason must be at least ${REASON_MIN_LENGTH} characters (you entered ${trimmedReason.length}).`);

  // Exact Swagger shape
  const body = {
    vehicle_id: trimmedVehicle,   // Swagger lists vehicle_id first
    charger_id: trimmedCharger,
    reason:     trimmedReason,
  };

  console.log("%c[create-pairing] → POST /pairings", "color:#8b5cf6;font-weight:bold", body);

  try {
    const res = await apiRequest("/api/v1/admin/pairings", {
      method: "POST", body,
      extraHeaders: { "Idempotency-Key": uuid() },
    });
    console.log("%c[create-pairing] ✅ ACCEPTED", "color:#10b981;font-weight:bold;font-size:14px", res);
    return { res, usedLabel: "{ vehicle_id, charger_id, reason }" };
  } catch (err) {
    console.warn("[create-pairing] ✗", err.status, err.code, err.message);
    throw err;
  }
}

/* ==================================================================
 *  ✅ END PAIRING — exact Swagger shape: { reason }
 *  reason required, min 8 chars
 * ================================================================== */
async function endPairing(pairingId, reason) {
  const trimmed = String(reason || "").trim();
  if (!trimmed) throw new Error("A reason is required to end a pairing.");
  if (trimmed.length < REASON_MIN_LENGTH)
    throw new Error(`Reason must be at least ${REASON_MIN_LENGTH} characters (you entered ${trimmed.length}).`);

  const body = { reason: trimmed };

  console.log("%c[end-pairing] → POST /pairings/" + pairingId + "/end", "color:#8b5cf6;font-weight:bold", body);

  const res = await apiRequest(`/api/v1/admin/pairings/${pairingId}/end`, {
    method: "POST", body,
    extraHeaders: { "Idempotency-Key": uuid() },
  });
  console.log("%c[end-pairing] ✅ ACCEPTED", "color:#10b981;font-weight:bold;font-size:14px", res);
  return { res, usedLabel: "{ reason }" };
}

/* ==================== SMALL UI ==================== */
function StatusBadge({ status }) {
  const s = statusStyle(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${s.chip}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
function Spinner({ label = "Loading…" }) {
  return (
    <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
      <FaSpinner className="animate-spin" size={26} />
      <p className="text-xs">{label}</p>
    </div>
  );
}
function ErrorBox({ message }) {
  return (
    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
      <FaExclamationCircle className="text-rose-500 shrink-0 mt-0.5" size={14} />
      <span className="text-rose-700 text-xs">{message}</span>
    </div>
  );
}
function StatCard({ icon: Icon, label, value, gradient }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-lg ${gradient}`}>
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/15 rounded-full blur-2xl" />
      <div className="relative">
        <Icon className="opacity-80" size={16} />
        <div className="text-2xl font-black mt-1.5 leading-none">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">{label}</div>
      </div>
    </div>
  );
}
function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-500 mt-1 leading-snug">{hint}</p>}
    </div>
  );
}
const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-200";

/* ==================== UNIVERSAL CLOSE BUTTON ==================== */
function CloseButton({ onClose, tone = "light" }) {
  const base = tone === "light"
    ? "bg-white/20 hover:bg-white/30 text-white"
    : "bg-slate-100 hover:bg-slate-200 text-slate-600";
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
      className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${base}`}
      aria-label="Close"
      title="Close"
    >
      <FaTimes size={12} />
    </button>
  );
}

/* ==================== CREATE PAIRING MODAL ==================== */
function CreatePairingModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ charger_id: "", vehicle_id: "", reason: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({ charger_id: "", vehicle_id: "", reason: "" });
      setError(null); setBusy(false); setSuccess(false);
      setTimeout(() => firstRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;
  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const reasonTrimmed = form.reason.trim();
  const reasonValid = reasonTrimmed.length >= REASON_MIN_LENGTH;
  const reasonRemaining = Math.max(0, REASON_MIN_LENGTH - reasonTrimmed.length);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.charger_id.trim()) return setError("Charger ID is required.");
    if (!form.vehicle_id.trim()) return setError("Vehicle ID is required.");
    if (!reasonValid)            return setError(`Reason must be at least ${REASON_MIN_LENGTH} characters.`);

    setBusy(true); setError(null); setSuccess(false);
    try {
      await createPairing(form);
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => { setBusy(false); onClose(); }, 900);
    } catch (err) {
      console.error("[create-pairing] final error:", err);
      if (err.isSessionExpired) setError(err.message);
      else if (err.code === "VALIDATION_FAILED") {
        setError(
          err.message ||
          "Validation failed. Check charger & vehicle IDs are valid UUIDs and reason is at least 8 characters."
        );
      } else if (err.status === 409) {
        setError("This charger or vehicle is already paired. End the existing pairing first.");
      } else if (err.status === 403) {
        setError("You need the fleet.manage capability to create pairings.");
      } else if (err.status === 404) {
        setError("Charger or vehicle not found. Double-check the IDs.");
      } else if (err.status === 422) {
        setError(err.message || "Invalid fleet request — check the fields.");
      } else {
        setError(err.message || "Failed to create pairing.");
      }
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop — always closes */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-white shadow-2xl shadow-violet-900/20 animate-[scaleIn_0.2s_ease-out]">
        <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-6 pb-8 text-white">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          {/* ✅ Close always works */}
          <CloseButton onClose={onClose} />
          <div className="relative flex items-center gap-3 pr-10">
            <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <FaLink size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Create Pairing</h3>
              <p className="text-[11px] text-violet-50/90">Exclusively link a charger to a vehicle</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4 -mt-4 relative max-h-[75vh] overflow-y-auto thin-scroll">
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
              <div>
                <p className="text-emerald-800 text-xs font-bold">✅ Pairing created!</p>
                <p className="text-emerald-700 text-[10px] mt-0.5">Closing…</p>
              </div>
            </div>
          )}
          {error && <ErrorBox message={error} />}

          <Field label="Charger ID" required hint="UUID of the charger to pair">
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-500">
                <FaBolt size={13} />
              </div>
              <input
                ref={firstRef}
                value={form.charger_id}
                onChange={onChange("charger_id")}
                placeholder="e.g. ef492385-ab91-4225-9464-4af0e11140be"
                className={inputCls + " pl-9 font-mono"}
                disabled={busy}
                required
              />
            </div>
          </Field>

          <div className="flex justify-center -my-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <FaArrowRight className="text-white" size={11} />
            </div>
          </div>

          <Field label="Vehicle ID" required hint="UUID of the service vehicle">
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-500">
                <FaTruck size={13} />
              </div>
              <input
                value={form.vehicle_id}
                onChange={onChange("vehicle_id")}
                placeholder="e.g. 8bd64d44-04b7-4743-85a0-f3926ee2f852"
                className={inputCls + " pl-9 font-mono"}
                disabled={busy}
                required
              />
            </div>
          </Field>

          <Field label="Reason" required hint={`Minimum ${REASON_MIN_LENGTH} characters`}>
            <textarea
              value={form.reason}
              onChange={onChange("reason")}
              rows={3}
              placeholder="e.g. Assigning charger to vehicle for morning shift"
              className={inputCls + " resize-none"}
              disabled={busy}
              required
              minLength={REASON_MIN_LENGTH}
            />
            <div className="flex justify-between mt-1">
              {reasonTrimmed.length > 0 && !reasonValid && (
                <span className="text-[10px] text-rose-600 flex items-center gap-1">
                  <FaExclamationCircle size={9} /> Add {reasonRemaining} more character{reasonRemaining !== 1 ? "s" : ""}
                </span>
              )}
              <span className={`ml-auto text-[10px] font-mono ${reasonValid ? "text-emerald-600" : "text-rose-500"}`}>
                {reasonTrimmed.length}/{REASON_MIN_LENGTH}
              </span>
            </div>
          </Field>

          <div className="flex items-center gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={busy}
              className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition disabled:opacity-60">
              Cancel
            </button>
            <button type="submit" disabled={busy || !reasonValid}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold text-sm shadow-lg shadow-violet-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {busy ? (<><FaSpinner className="animate-spin" size={13} /> Creating…</>) : (<><FaLink size={12} /> Create Pairing</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==================== END PAIRING MODAL ==================== */
function EndPairingModal({ open, pairing, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (open) {
      setReason(""); setError(null); setBusy(false); setSuccess(false);
      setTimeout(() => textRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open || !pairing) return null;

  const pairingId = pairing.id || pairing.pairing_id || pairing.uuid;
  const reasonTrimmed = reason.trim();
  const reasonValid = reasonTrimmed.length >= REASON_MIN_LENGTH;
  const remaining = Math.max(0, REASON_MIN_LENGTH - reasonTrimmed.length);

  const submit = async (e) => {
    e.preventDefault();
    if (!reasonValid) {
      setError(`Reason must be at least ${REASON_MIN_LENGTH} characters.`);
      return;
    }
    setBusy(true); setError(null); setSuccess(false);
    try {
      await endPairing(pairingId, reasonTrimmed);
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => { setBusy(false); onClose(); }, 900);
    } catch (err) {
      console.error("[end-pairing] final error:", err);
      if (err.isSessionExpired) setError(err.message);
      else if (err.code === "VALIDATION_FAILED") setError(err.message);
      else if (err.status === 409) setError("Pairing is already closed or in a conflicting state.");
      else if (err.status === 404) setError("Pairing not found — it may have been ended already.");
      else if (err.status === 422) setError(err.message || "Validation failed — check the reason (min 8 chars).");
      else setError(err.message || "Failed to end pairing.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-rose-500 to-red-600 p-5 text-white">
          <CloseButton onClose={onClose} />
          <div className="flex items-center gap-2.5 pr-10">
            <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center border border-white/30">
              <FaStop size={15} />
            </div>
            <div>
              <h3 className="text-base font-black">End Pairing</h3>
              <p className="text-[10px] text-rose-50/90">Close without rewriting history</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-5 space-y-3">
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
              <div>
                <p className="text-emerald-800 text-xs font-bold">✅ Pairing ended!</p>
                <p className="text-emerald-700 text-[10px] mt-0.5">Closing…</p>
              </div>
            </div>
          )}
          {error && <ErrorBox message={error} />}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600">
              <FaBolt size={10} className="text-violet-500" />
              <span className="font-mono truncate">{shortId(pairing.charger_id || pairing.charger_uuid || pairing.charger)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <FaTruck size={10} className="text-violet-500" />
              <span className="font-mono truncate">{shortId(pairing.vehicle_id || pairing.vehicle_uuid || pairing.vehicle)}</span>
            </div>
          </div>

          <Field label="Reason" required hint={`Minimum ${REASON_MIN_LENGTH} characters`}>
            <textarea
              ref={textRef}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Vehicle returned to depot — shift ended"
              className={inputCls + " resize-none"}
              disabled={busy}
              required
              minLength={REASON_MIN_LENGTH}
            />
            <div className="flex justify-between mt-1">
              {reasonTrimmed.length > 0 && !reasonValid && (
                <span className="text-[10px] text-rose-600 flex items-center gap-1">
                  <FaExclamationCircle size={9} /> Add {remaining} more character{remaining !== 1 ? "s" : ""}
                </span>
              )}
              <span className={`ml-auto text-[10px] font-mono ${reasonValid ? "text-emerald-600" : "text-rose-500"}`}>
                {reasonTrimmed.length}/{REASON_MIN_LENGTH}
              </span>
            </div>
          </Field>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={busy}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm disabled:opacity-60">
              Cancel
            </button>
            <button type="submit" disabled={busy || !reasonValid}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {busy ? (<><FaSpinner className="animate-spin" size={12} /> Ending…</>) : (<><FaUnlink size={11} /> End Pairing</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==================== MAIN PAGE ==================== */
export default function Pairings() {
  const navigate = useNavigate();
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [endingPairing, setEndingPairing] = useState(null);
  const [toast, setToast]         = useState(null);

  useEffect(() => {
    const id = "pairings-google-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";
    document.head.appendChild(link);
  }, []);

  const showToast = (msg, tone = "emerald") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 6000);
  };

  const load = useCallback(async () => {
    if (!localStorage.getItem("access_token") && !localStorage.getItem("refresh_token")) {
      setSessionExpired(true); setLoading(false); return;
    }
    setLoading(true); setError(null); setSessionExpired(false);
    try {
      const res = await apiRequest("/api/v1/admin/pairings");
      setPairings(extractPairings(res));
    } catch (err) {
      if (err.isSessionExpired) { setSessionExpired(true); setPairings([]); }
      else { setError(err.message); setPairings([]); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = pairings.filter((p) => {
    const q = search.toLowerCase().trim();
    const hay = [
      p.id, p.pairing_id,
      p.charger_id, p.charger_uuid, p.charger,
      p.vehicle_id, p.vehicle_uuid, p.vehicle,
      p.reason, p.notes,
    ].filter(Boolean).join(" ").toLowerCase();
    const matchesSearch = !q || hay.includes(q);
    const norm = pairingStatus(p);
    const matchesStatus = statusFilter === "all" || norm === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = pairings.reduce((acc, p) => {
    acc.total++;
    const norm = pairingStatus(p);
    if (norm === "active") acc.active++;
    else acc.ended++;
    return acc;
  }, { total: 0, active: 0, ended: 0 });

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-violet-50/40 px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <FaExclamationCircle className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Session expired</h2>
          <p className="text-sm text-slate-600 mt-2">Please sign in again to continue.</p>
          <button onClick={() => { clearSession(); navigate("/login", { replace: true }); }}
            className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-violet-500/30">
            <FaSignInAlt size={12} /> Sign in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-violet-50/40 px-4 py-8 pairings-page">
      <style>{`
        .pairings-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .pairings-page h1, .pairings-page h2, .pairings-page h3 {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          letter-spacing: -0.025em;
        }
        .pairings-page .font-mono, .pairings-page code {
          font-family: 'JetBrains Mono', 'SF Mono', Menlo, Monaco, 'Courier New', monospace;
        }
        .thin-scroll::-webkit-scrollbar { width: 2px; height: 2px; }
        .thin-scroll::-webkit-scrollbar-track { background: transparent; }
        .thin-scroll::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.25); border-radius: 2px; }
        .thin-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.45); }
        .thin-scroll { scrollbar-width: thin; scrollbar-color: rgba(100,116,139,0.25) transparent; }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-7 sm:p-8 shadow-xl shadow-violet-500/20">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                <FaLink size={9} /> Exclusive Pairings
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <FaLink size={26} /> Pairings
              </h1>
              <p className="text-violet-50/90 text-sm mt-1.5 max-w-xl">
                Pair chargers with vehicles, track active links, and end pairings without losing history.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={load}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 transition"
                title="Refresh">
                <FaSyncAlt size={13} />
              </button>
              <button onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white text-violet-700 hover:bg-violet-50 font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <FaPlus size={13} /> Create Pairing
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={FaLink}  label="Total"  value={stats.total}  gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
          <StatCard icon={FaPlay}  label="Active" value={stats.active} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
          <StatCard icon={FaStop}  label="Ended"  value={stats.ended}  gradient="bg-gradient-to-br from-slate-500 to-slate-700" />
        </div>

        {/* TOOLBAR */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by charger, vehicle, ID…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-200" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200">
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="ended">Ended only</option>
            </select>
          </div>
        </div>

        {error && <ErrorBox message={error} />}
        {toast && (
          <div className={`p-3 rounded-xl border flex items-start gap-2 animate-[fadeIn_0.15s_ease-out] ${
            toast.tone === "rose" ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"
          }`}>
            <FaCheckCircle className={toast.tone === "rose" ? "text-rose-500" : "text-emerald-500"} size={13} />
            <span className={`text-xs ${toast.tone === "rose" ? "text-rose-700" : "text-emerald-700"}`}>{toast.msg}</span>
          </div>
        )}

        {/* LIST */}
        {loading ? (
          <Spinner label="Loading pairings…" />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
              <FaLink className="text-violet-400" size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {pairings.length === 0 ? "No pairings yet" : "No matches"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {pairings.length === 0
                ? "Create your first charger-vehicle pairing to start tracking."
                : "Try adjusting your search or status filter."}
            </p>
            {pairings.length === 0 && (
              <button onClick={() => setCreateOpen(true)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-violet-500/30">
                <FaPlus size={11} /> Create your first pairing
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((p, i) => {
              const pid = p.id || p.pairing_id || p.uuid || i;
              const norm = pairingStatus(p);
              const style = statusStyle(norm);
              const chargerRef = p.charger_id || p.charger_uuid || p.charger;
              const vehicleRef = p.vehicle_id || p.vehicle_uuid || p.vehicle;
              const startedAt = p.started_at || p.starts_at || p.created_at || p.paired_at;
              const endedAt = p.ended_at || p.ends_at || p.closed_at || p.end_time;
              const reason = p.reason || p.end_reason;
              const active = norm === "active";

              return (
                <div key={pid} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className={`h-1.5 bg-gradient-to-r ${style.bg}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center shadow-sm`}>
                          <FaLink className="text-white" size={13} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <span>Pairing</span>
                            <code className="font-mono text-[10px] text-slate-500">{shortId(pid)}</code>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {startedAt ? `Started ${relativeTime(startedAt)}` : "—"}
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={norm} />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 p-2 rounded-lg bg-violet-50 border border-violet-200 min-w-0">
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-violet-500 mb-0.5">
                          <FaBolt size={8} /> Charger
                        </div>
                        <code className="text-[10px] font-mono text-violet-800 truncate block" title={chargerRef}>
                          {shortId(chargerRef)}
                        </code>
                      </div>
                      <FaArrowRight className="text-violet-400 shrink-0" size={10} />
                      <div className="flex-1 p-2 rounded-lg bg-pink-50 border border-pink-200 min-w-0">
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-pink-500 mb-0.5">
                          <FaTruck size={8} /> Vehicle
                        </div>
                        <code className="text-[10px] font-mono text-pink-800 truncate block" title={vehicleRef}>
                          {shortId(vehicleRef)}
                        </code>
                      </div>
                    </div>

                    {!active && endedAt && (
                      <div className="mb-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                          <FaClock size={8} /> Ended {relativeTime(endedAt)}
                        </div>
                        {reason && (
                          <p className="text-[10px] text-slate-600 italic line-clamp-2">{reason}</p>
                        )}
                      </div>
                    )}

                    {active ? (
                      <button onClick={() => setEndingPairing(p)}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-rose-500/20 transition hover:-translate-y-0.5">
                        <FaUnlink size={10} /> End Pairing
                      </button>
                    ) : (
                      <div className="text-center text-[10px] text-slate-400 italic py-2 flex items-center justify-center gap-1">
                        <FaCheckCircle size={9} /> Pairing closed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreatePairingModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          load();
          showToast("Pairing created successfully.", "emerald");
        }}
      />

      <EndPairingModal
        open={Boolean(endingPairing)}
        pairing={endingPairing}
        onClose={() => setEndingPairing(null)}
        onSuccess={() => {
          load();
          showToast("Pairing ended successfully.", "emerald");
        }}
      />

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}