// src/components/Admin/Pricing.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRupeeSign, FaPlus, FaSearch, FaSyncAlt, FaCheckCircle,
  FaExclamationCircle, FaSpinner, FaTimes, FaEye, FaHistory,
  FaCalendarCheck, FaSignInAlt, FaLock, FaInfoCircle,
  FaPaperPlane, FaUndo, FaFileAlt, FaLayerGroup, FaTrash,
  FaGlobe, FaTag, FaClock, FaChevronDown, FaChevronUp,
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
function randAlnum(n) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
function generatePolicyKey() {
  return `POL_${randAlnum(3)}_${randAlnum(14)}_${randAlnum(14)}`;
}
function generateRuleId() {
  return `${randAlnum(5)}_${randAlnum(20)}_${randAlnum(20)}`;
}

function ifMatchHeader(version) {
  if (version === null || version === undefined || version === "") return null;
  return `"${String(version)}"`;
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
      return true;
    } catch { return false; }
    finally { refreshInFlight = null; }
  })();
  return refreshInFlight;
}

async function apiRequest(path, { method = "GET", body, auth = true, extraHeaders = {}, returnResponse = false } = {}) {
  const attempt = async () => {
    const headers = { "Content-Type": "application/json", Accept: "application/json", ...extraHeaders };
    if (auth) {
      const t = getAccessToken();
      if (t) headers.Authorization = `Bearer ${t}`;
    }
    console.log(
      "%c[PRICING →] " + method + " " + path,
      "color:#6366f1;font-weight:bold",
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
      const e = new Error("Network error — cannot reach Pricing API.");
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
      if (res.ok) return returnResponse ? { data, headers: res.headers, status: res.status } : data;
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
  return returnResponse ? { data, headers: res.headers, status: res.status } : data;
}

/* ==================== HELPERS ==================== */
function toArray(v) { return Array.isArray(v) ? v : v ? [v] : []; }

function extractPolicies(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  return toArray(
    res.policies || res.items || res.data?.policies || res.data?.items || res.data || []
  );
}
function extractHistory(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  return toArray(res.history || res.events || res.items || res.data?.history || res.data?.events || res.data || []);
}
function extractVersion(res) {
  if (!res) return null;
  return res.state_version
      ?? res.data?.state_version
      ?? res.version
      ?? res.data?.version
      ?? null;
}

function policyStatus(p) {
  if (!p) return "unknown";
  const raw = String(p.status || p.state || "").toLowerCase();
  if (raw) {
    if (raw === "draft") return "draft";
    if (raw === "published" || raw === "active" || raw === "live") return "published";
    if (raw === "withdrawn") return "withdrawn";
    if (raw === "scheduled") return "scheduled";
    if (raw === "expired") return "expired";
  }
  if (p.withdrawn_at) return "withdrawn";
  if (p.published_at) return "published";
  return "draft";
}

function statusStyle(norm) {
  switch (norm) {
    case "published":
      return { bg: "from-emerald-400 to-teal-500", chip: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500", label: "Published" };
    case "withdrawn":
      return { bg: "from-slate-400 to-slate-600", chip: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-500", label: "Withdrawn" };
    case "scheduled":
      return { bg: "from-blue-400 to-indigo-500", chip: "bg-blue-100 text-blue-800 border-blue-200", dot: "bg-blue-500", label: "Scheduled" };
    case "expired":
      return { bg: "from-rose-400 to-red-500", chip: "bg-rose-100 text-rose-800 border-rose-200", dot: "bg-rose-500", label: "Expired" };
    case "draft":
    default:
      return { bg: "from-amber-400 to-orange-500", chip: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500", label: "Draft" };
  }
}

function fmtDate(d) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return String(d); }
}
function fmtShortDate(d) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" });
  } catch { return String(d); }
}
function toIsoUtc(localValue) {
  if (!localValue) return localValue;
  try { const d = new Date(localValue); if (isNaN(d.getTime())) return localValue; return d.toISOString(); }
  catch { return localValue; }
}
function toLocalInput(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return ""; }
}
function shortId(id) {
  if (!id) return "—";
  const s = String(id);
  return s.length > 16 ? s.slice(0, 12) + "…" : s;
}

const RATE_RE = /^\d+(\.\d{1,4})?$/;
function isValidRate(r) { return RATE_RE.test(String(r || "").trim()); }

/* ==================== POLICY MUTATIONS ==================== */
async function fetchPolicyMeta(policyId) {
  try {
    const { data, headers } = await apiRequest(`/api/v1/admin/pricing/policies/${policyId}`, { returnResponse: true });
    const etag = headers.get("ETag") || headers.get("etag");
    const version = extractVersion(data);
    return { data, etag, version };
  } catch (err) {
    console.warn("[fetch-policy] failed:", err?.message);
    return { data: null, etag: null, version: null };
  }
}

function pickIfMatch({ version, etag }) {
  if (version !== null && version !== undefined) return ifMatchHeader(version);
  if (etag) return etag;
  return null;
}

async function mutationWithIfMatch(policyId, { path, body, maxRetries = 1 }) {
  let { version, etag } = await fetchPolicyMeta(policyId);
  let ifMatch = pickIfMatch({ version, etag });

  const buildHeaders = () => {
    const h = { "Idempotency-Key": uuid() };
    if (ifMatch) h["If-Match"] = ifMatch;
    return h;
  };

  const send = () => apiRequest(path, { method: "POST", body, extraHeaders: buildHeaders() });

  try { return await send(); }
  catch (err) {
    const retryable = err.status === 412 || err.status === 428 || err.status === 409;
    if (!retryable || maxRetries <= 0) throw err;
    console.warn(`[policy-mutation] ${err.status} — refetching version + retrying…`);
    const fresh = await fetchPolicyMeta(policyId);
    ifMatch = pickIfMatch(fresh);
    return await send();
  }
}

/* ==================== CREATE ==================== */
function buildRulePayload(rule) {
  const out = {
    id: rule.id || generateRuleId(),
    kind: rule.kind || "BASE",
  };
  if (rule.component) out.component = String(rule.component).trim();
  if (rule.basis)     out.basis = String(rule.basis).trim();
  if (rule.rate)      out.rate = String(rule.rate).trim();
  if (rule.target)    out.target = String(rule.target).trim();
  if (rule.tax_class) out.tax_class = String(rule.tax_class).trim();
  if (rule.priority !== undefined && rule.priority !== "") {
    const n = Number(rule.priority);
    if (!isNaN(n)) out.priority = n;
  }
  if (rule.conditions && typeof rule.conditions === "object") {
    const cleaned = {};
    Object.entries(rule.conditions).forEach(([k, v]) => {
      const key = String(k || "").trim();
      const val = String(v ?? "").trim();
      if (key && val) cleaned[key] = val;
    });
    if (Object.keys(cleaned).length > 0) out.conditions = cleaned;
  }
  return out;
}

async function createPolicy(form) {
  const policy_key = String(form.policy_key || "").trim();
  const policy_version = Number(form.policy_version);
  const scope_kind = String(form.scope_kind || "").trim();
  const scope_key = String(form.scope_key || "").trim();
  const starts_at = toIsoUtc(form.starts_at);
  const ends_at = toIsoUtc(form.ends_at);
  const currency = String(form.currency || "INR").trim().toUpperCase();
  const reason = String(form.reason || "").trim();

  if (!policy_key) throw new Error("Policy key is required.");
  if (!Number.isInteger(policy_version) || policy_version < 1) throw new Error("Policy version must be a positive integer.");
  if (!scope_kind) throw new Error("Scope kind is required.");
  if (!scope_key) throw new Error("Scope key is required.");
  if (!starts_at) throw new Error("Start time is required.");
  if (!ends_at) throw new Error("End time is required.");
  if (new Date(ends_at) <= new Date(starts_at)) throw new Error("End time must be after start time.");
  if (!reason) throw new Error("Reason is required.");
  if (reason.length < REASON_MIN_LENGTH) throw new Error(`Reason must be at least ${REASON_MIN_LENGTH} characters.`);

  const rules = (form.rules || []).map(buildRulePayload);
  if (rules.length === 0) throw new Error("At least one rule is required.");
  for (const [i, r] of rules.entries()) {
    if (!r.kind) throw new Error(`Rule #${i + 1}: kind is required.`);
    if (!r.rate) throw new Error(`Rule #${i + 1}: rate is required.`);
    if (!isValidRate(r.rate)) throw new Error(`Rule #${i + 1}: rate must be a decimal string like "16.91" — not a number.`);
  }

  const body = {
    policy_key,
    policy_version,
    scope: { kind: scope_kind, key: scope_key },
    starts_at,
    ends_at,
    currency,
    rules,
    reason,
  };

  console.log("%c[create-policy] → POST /pricing/policies", "color:#6366f1;font-weight:bold", body);

  const res = await apiRequest("/api/v1/admin/pricing/policies", {
    method: "POST", body,
    extraHeaders: { "Idempotency-Key": uuid() },
  });
  console.log("%c[create-policy] ✅ ACCEPTED", "color:#10b981;font-weight:bold;font-size:14px", res);
  return res;
}

/* ==================== PUBLISH / WITHDRAW ==================== */
async function publishPolicy(policyId, reason) {
  const trimmed = String(reason || "").trim();
  if (!trimmed) throw new Error("A reason is required to publish a policy.");
  if (trimmed.length < REASON_MIN_LENGTH)
    throw new Error(`Reason must be at least ${REASON_MIN_LENGTH} characters (you entered ${trimmed.length}).`);

  const body = { reason: trimmed };
  console.log("%c[publish-policy] → POST /pricing/policies/" + policyId + "/publish",
    "color:#6366f1;font-weight:bold", body);

  return mutationWithIfMatch(policyId, {
    path: `/api/v1/admin/pricing/policies/${policyId}/publish`,
    body,
  });
}

async function withdrawPolicy(policyId, reason) {
  const trimmed = String(reason || "").trim();
  if (!trimmed) throw new Error("A reason is required to withdraw a policy.");
  if (trimmed.length < REASON_MIN_LENGTH)
    throw new Error(`Reason must be at least ${REASON_MIN_LENGTH} characters (you entered ${trimmed.length}).`);
  return mutationWithIfMatch(policyId, {
    path: `/api/v1/admin/pricing/policies/${policyId}/withdraw`,
    body: { reason: trimmed },
  });
}

/* ==================== CONSTANTS ==================== */
const SCOPE_KINDS = ["SERVICE_ZONE", "CITY", "REGION", "GLOBAL", "CHARGER", "VEHICLE", "CUSTOMER"];
const RULE_KINDS = ["BASE", "PEAK", "OFF_PEAK", "DISCOUNT", "SURGE", "FIXED", "SURCHARGE", "PENALTY", "PROMO"];
const COMPONENTS = ["ENERGY", "TIME", "SESSION", "IDLE", "PARKING", "RESERVATION", "PLUG", "SERVICE"];
const BASES = ["PER_KWH", "PER_MINUTE", "PER_HOUR", "PER_SESSION", "PER_DAY", "FLAT"];
const TAX_CLASSES = ["GST_0", "GST_5", "GST_12", "GST_18", "GST_28", "EXEMPT"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];
const STATUS_FILTERS = [
  { id: "all", label: "All statuses" },
  { id: "draft", label: "Drafts" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
  { id: "withdrawn", label: "Withdrawn" },
  { id: "expired", label: "Expired" },
];

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

/* ==================== BULLETPROOF CLOSE BUTTON ==================== */
function CloseButton({ onClose }) {
  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose?.();
  };

  return (
    <button
      type="button"
      onClick={handleClose}
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute top-3 right-3 z-50 w-10 h-10 rounded-xl bg-white/25 hover:bg-white/40 active:bg-white/50 active:scale-90 text-white flex items-center justify-center transition-all duration-150 cursor-pointer pointer-events-auto select-none shadow-md"
      aria-label="Close dialog"
      title="Close (Esc)"
    >
      <FaTimes size={14} />
    </button>
  );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200";

/* ==================== RULE BUILDER ==================== */
function RuleCard({ rule, index, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(index === 0);
  const conditions = rule.conditions || {};
  const condEntries = Object.entries(conditions);

  const set = (k, v) => onChange({ ...rule, [k]: v });

  const setCondition = (oldKey, newKey, newVal) => {
    const next = { ...conditions };
    if (oldKey !== newKey) delete next[oldKey];
    if (newKey.trim()) next[newKey] = newVal;
    onChange({ ...rule, conditions: next });
  };
  const removeCondition = (key) => {
    const next = { ...conditions };
    delete next[key];
    onChange({ ...rule, conditions: next });
  };
  const addCondition = () => {
    let n = 1;
    while (conditions[`prop${n}`]) n++;
    onChange({ ...rule, conditions: { ...conditions, [`prop${n}`]: "" } });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-900">
            {rule.kind || "Rule"}
            {rule.component ? ` · ${rule.component}` : ""}
          </div>
          <code className="text-[9px] font-mono text-slate-500 truncate block">{rule.id}</code>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setExpanded((v) => !v)}
            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 transition">
            {expanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
          </button>
          <button type="button" onClick={onRemove}
            className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center border border-rose-200 transition">
            <FaTrash size={9} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Field label="Kind" required>
              <select value={rule.kind} onChange={(e) => set("kind", e.target.value)} className={inputCls}>
                {RULE_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <input type="number" value={rule.priority ?? 100000}
                onChange={(e) => set("priority", e.target.value)}
                className={inputCls} />
            </Field>
            <Field label="Component">
              <input list={`comp-${index}`} value={rule.component || ""}
                onChange={(e) => set("component", e.target.value)}
                placeholder="ENERGY" className={inputCls} />
              <datalist id={`comp-${index}`}>
                {COMPONENTS.map((c) => <option key={c} value={c} />)}
              </datalist>
            </Field>
            <Field label="Basis">
              <input list={`basis-${index}`} value={rule.basis || ""}
                onChange={(e) => set("basis", e.target.value)}
                placeholder="PER_KWH" className={inputCls} />
              <datalist id={`basis-${index}`}>
                {BASES.map((b) => <option key={b} value={b} />)}
              </datalist>
            </Field>
            <Field label="Target">
              <input value={rule.target || ""} onChange={(e) => set("target", e.target.value)}
                placeholder="e.g. vehicle:8bd64d44" className={inputCls} />
            </Field>
            <Field label="Tax class">
              <input list={`tax-${index}`} value={rule.tax_class || ""}
                onChange={(e) => set("tax_class", e.target.value)}
                placeholder="GST_18" className={inputCls} />
              <datalist id={`tax-${index}`}>
                {TAX_CLASSES.map((t) => <option key={t} value={t} />)}
              </datalist>
            </Field>
          </div>

          <Field label="Rate (INR decimal string)" required hint='Must be a string like "16.91" — not a number.'>
            <div className="relative">
              <FaRupeeSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" size={12} />
              <input value={rule.rate || ""} onChange={(e) => set("rate", e.target.value)}
                placeholder="16.91" className={inputCls + " pl-9 font-mono"} />
            </div>
          </Field>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Conditions ({condEntries.length})
              </label>
              <button type="button" onClick={addCondition}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <FaPlus size={8} /> Add
              </button>
            </div>
            {condEntries.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic px-2 py-1.5 rounded-lg bg-slate-50 border border-dashed border-slate-200">
                No conditions — rule applies unconditionally.
              </p>
            ) : (
              <div className="space-y-1.5">
                {condEntries.map(([k, v]) => (
                  <div key={k} className="flex gap-1.5">
                    <input value={k}
                      onChange={(e) => setCondition(k, e.target.value, v)}
                      placeholder="key" className={inputCls + " flex-1 text-xs"} />
                    <input value={v}
                      onChange={(e) => setCondition(k, k, e.target.value)}
                      placeholder="value" className={inputCls + " flex-1 text-xs"} />
                    <button type="button" onClick={() => removeCondition(k)}
                      className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center border border-rose-200 shrink-0">
                      <FaTimes size={9} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== CREATE POLICY MODAL ==================== */
function CreatePolicyModal({ open, onClose, onSuccess }) {
  const makeEmpty = () => ({
    policy_key: generatePolicyKey(),
    policy_version: 1,
    scope_kind: "SERVICE_ZONE",
    scope_key: "ZONE_1",
    starts_at: toLocalInput(new Date().toISOString()),
    ends_at: toLocalInput(new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()),
    currency: "INR",
    reason: "",
    rules: [{
      id: generateRuleId(),
      kind: "BASE",
      component: "ENERGY",
      basis: "PER_KWH",
      rate: "16.91",
      target: "",
      tax_class: "GST_18",
      priority: 100000,
      conditions: {},
    }],
  });

  const [form, setForm] = useState(makeEmpty());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(makeEmpty());
      setError(null); setBusy(false); setSuccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const updateRule = (i, r) => setForm((f) => ({ ...f, rules: f.rules.map((x, idx) => idx === i ? r : x) }));
  const removeRule = (i) => setForm((f) => ({ ...f, rules: f.rules.filter((_, idx) => idx !== i) }));
  const addRule = () => setForm((f) => ({
    ...f,
    rules: [...f.rules, {
      id: generateRuleId(),
      kind: "BASE", component: "", basis: "", rate: "", target: "",
      tax_class: "", priority: 100000, conditions: {},
    }],
  }));

  const reasonTrimmed = form.reason.trim();
  const reasonValid = reasonTrimmed.length >= REASON_MIN_LENGTH;
  const reasonRemaining = Math.max(0, REASON_MIN_LENGTH - reasonTrimmed.length);

  const submit = async (e) => {
    e.preventDefault();
    if (!reasonValid) return setError(`Reason must be at least ${REASON_MIN_LENGTH} characters.`);
    setBusy(true); setError(null); setSuccess(false);
    try {
      await createPolicy(form);
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => { setBusy(false); onClose(); }, 1200);
    } catch (err) {
      console.error("[create-policy] final error:", err);
      if (err.isSessionExpired) setError(err.message);
      else if (err.code === "VALIDATION_FAILED") setError(err.message || "Validation failed — check the fields.");
      else if (err.status === 409) setError("A policy with this key + version already exists. Bump the version.");
      else if (err.status === 403) setError("You need the pricing.manage capability to create policies.");
      else if (err.status === 422) setError(err.message || "Invalid policy request — check the fields and rate strings.");
      else setError(err.message || "Failed to create policy.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-white shadow-2xl shadow-indigo-900/20 animate-[scaleIn_0.2s_ease-out] max-h-[92vh] flex flex-col"
      >
        <div className="relative bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 p-6 pb-8 text-white shrink-0">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <CloseButton onClose={onClose} />
          <div className="relative flex items-center gap-3 pr-14">
            <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <FaFileAlt size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Create Tariff Policy</h3>
              <p className="text-[11px] text-indigo-50/90">Immutable DRAFT revision — publish separately</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4 -mt-4 relative overflow-y-auto thin-scroll">
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
              <div>
                <p className="text-emerald-800 text-xs font-bold">✅ Policy DRAFT created!</p>
                <p className="text-emerald-700 text-[10px] mt-0.5">Publish separately once approved.</p>
              </div>
            </div>
          )}
          {error && <ErrorBox message={error} />}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Field label="Policy Key" required hint="Auto-generated. Editing bumps history.">
                <input value={form.policy_key} onChange={onChange("policy_key")}
                  className={inputCls + " font-mono text-xs"} disabled={busy} />
              </Field>
            </div>
            <Field label="Version" required hint="Bump for new revisions">
              <input type="number" min="1" value={form.policy_version}
                onChange={onChange("policy_version")} className={inputCls} disabled={busy} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Scope Kind" required>
              <select value={form.scope_kind} onChange={onChange("scope_kind")} className={inputCls} disabled={busy}>
                {SCOPE_KINDS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Scope Key" required hint="e.g. ZONE_7, BLR, or a UUID">
                <input value={form.scope_key} onChange={onChange("scope_key")}
                  className={inputCls + " font-mono"} disabled={busy} placeholder="ZONE_7" />
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Starts At" required>
              <input type="datetime-local" value={form.starts_at}
                onChange={onChange("starts_at")} className={inputCls} disabled={busy} />
            </Field>
            <Field label="Ends At" required>
              <input type="datetime-local" value={form.ends_at}
                onChange={onChange("ends_at")} className={inputCls} disabled={busy} />
            </Field>
            <Field label="Currency" required>
              <select value={form.currency} onChange={onChange("currency")} className={inputCls} disabled={busy}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Rules ({form.rules.length})
              </h4>
              <button type="button" onClick={addRule} disabled={busy}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center gap-1 border border-indigo-200 transition disabled:opacity-60">
                <FaPlus size={8} /> Add rule
              </button>
            </div>
            <div className="space-y-2">
              {form.rules.map((r, i) => (
                <RuleCard key={r.id} rule={r} index={i}
                  onChange={(nr) => updateRule(i, nr)}
                  onRemove={() => removeRule(i)} />
              ))}
              {form.rules.length === 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-dashed border-amber-300 text-center">
                  <p className="text-[11px] text-amber-800 font-bold">No rules — add at least one.</p>
                </div>
              )}
            </div>
          </div>

          <Field label="Reason" required hint={`Minimum ${REASON_MIN_LENGTH} characters`}>
            <textarea value={form.reason} onChange={onChange("reason")}
              rows={2} placeholder="e.g. October tariff revision for Zone 7"
              className={inputCls + " resize-none"} disabled={busy} minLength={REASON_MIN_LENGTH} />
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

          <div className="flex items-center gap-2 pt-2 sticky bottom-0 bg-white/95 backdrop-blur-sm -mx-6 px-6 py-3 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition">
              Cancel
            </button>
            <button type="submit" disabled={busy || !reasonValid || form.rules.length === 0}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-400 hover:via-violet-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {busy ? (<><FaSpinner className="animate-spin" size={13} /> Creating…</>) : (<><FaPlus size={12} /> Create Draft</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==================== PUBLISH MODAL ==================== */
function PublishModal({ open, policy, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState(null);
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

  if (!open || !policy) return null;

  const policyId = policy.id || policy.policy_id || policy.uuid;
  const scope    = policy.scope || {};
  const trimmed  = reason.trim();
  const valid    = trimmed.length >= REASON_MIN_LENGTH;
  const remaining = Math.max(0, REASON_MIN_LENGTH - trimmed.length);

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) { setError(`Reason must be at least ${REASON_MIN_LENGTH} characters.`); return; }
    setBusy(true); setError(null); setSuccess(false);
    try {
      await publishPolicy(policyId, trimmed);
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => { setBusy(false); onClose(); }, 1000);
    } catch (err) {
      console.error("[publish] error:", err);
      if (err.isSessionExpired) setError(err.message);
      else if (err.status === 409) {
        setError(
          "Publishing is not allowed — this window overlaps or crosses another active policy in the same scope, " +
          "or a duplicate open-ended root exists. Withdraw the conflicting policy first."
        );
      } else if (err.status === 422) {
        setError(err.message || "Temporal conflict — check the dates against existing policies in this scope.");
      } else if (err.status === 412) {
        setError("Version conflict — the policy changed since you opened it. Refresh and retry.");
      } else if (err.status === 428) {
        setError("Server requires If-Match — please retry.");
      } else if (err.status === 404) {
        setError("Policy not found.");
      } else if (err.status === 403) {
        setError("You need the pricing.manage capability to publish policies.");
      } else {
        setError(err.message || "Failed to publish policy.");
      }
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl"
      >
        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
          <CloseButton onClose={onClose} />
          <div className="flex items-center gap-2.5 pr-14">
            <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center border border-white/30">
              <FaPaperPlane size={15} />
            </div>
            <div>
              <h3 className="text-base font-black">Publish Policy</h3>
              <p className="text-[10px] text-emerald-50/90">Make this tariff active for new selections</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-5 space-y-3">
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
              <div>
                <p className="text-emerald-800 text-xs font-bold">✅ Policy published!</p>
                <p className="text-emerald-700 text-[10px] mt-0.5">Closing…</p>
              </div>
            </div>
          )}
          {error && <ErrorBox message={error} />}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600">
              <FaTag size={9} className="text-indigo-500" />
              <code className="font-mono text-[10px] truncate">{shortId(policy.policy_key || policyId)}</code>
              {policy.policy_version != null && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">v{policy.policy_version}</span>
              )}
            </div>
            {scope.kind && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <FaGlobe size={9} className="text-indigo-500" />
                <span className="font-mono text-[10px]">{scope.kind}:{scope.key || "—"}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-600">
              <FaClock size={9} className="text-indigo-500" />
              <span className="text-[10px]">{fmtShortDate(policy.starts_at)} → {fmtShortDate(policy.ends_at)}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
            <FaInfoCircle className="text-amber-600 shrink-0 mt-0.5" size={11} />
            <p className="text-[10px] text-amber-800 leading-snug">
              Publication is serialized in scope. Overlapping windows, crossing windows, or duplicate open-ended
              roots will be rejected with <code className="font-mono bg-amber-100 px-1 rounded">409</code>.
            </p>
          </div>

          <Field label="Reason" required hint={`Minimum ${REASON_MIN_LENGTH} characters`}>
            <textarea ref={textRef} value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. October tariff approved — replacing v2"
              className={inputCls + " resize-none"}
              disabled={busy}
              required
              minLength={REASON_MIN_LENGTH} />
            <div className="flex justify-between mt-1">
              {trimmed.length > 0 && !valid && (
                <span className="text-[10px] text-rose-600 flex items-center gap-1">
                  <FaExclamationCircle size={9} /> Add {remaining} more character{remaining !== 1 ? "s" : ""}
                </span>
              )}
              <span className={`ml-auto text-[10px] font-mono ${valid ? "text-emerald-600" : "text-rose-500"}`}>
                {trimmed.length}/{REASON_MIN_LENGTH}
              </span>
            </div>
          </Field>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm">
              Cancel
            </button>
            <button type="submit" disabled={busy || !valid}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed">
              {busy ? (<><FaSpinner className="animate-spin" size={12} /> Publishing…</>) : (<><FaPaperPlane size={11} /> Publish</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==================== WITHDRAW MODAL ==================== */
function WithdrawModal({ open, policy, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (open) { setReason(""); setError(null); setBusy(false); setTimeout(() => textRef.current?.focus(), 120); }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open || !policy) return null;

  const policyId = policy.id || policy.policy_id || policy.uuid;
  const trimmed = reason.trim();
  const valid = trimmed.length >= REASON_MIN_LENGTH;
  const remaining = Math.max(0, REASON_MIN_LENGTH - trimmed.length);

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) { setError(`Reason must be at least ${REASON_MIN_LENGTH} characters.`); return; }
    setBusy(true); setError(null);
    try {
      await withdrawPolicy(policyId, trimmed);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("[withdraw] error:", err);
      if (err.isSessionExpired) setError(err.message);
      else if (err.status === 409) setError("Policy is not in a state that allows withdrawal.");
      else if (err.status === 404) setError("Policy not found.");
      else setError(err.message || "Failed to withdraw policy.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl"
      >
        <div className="relative bg-gradient-to-br from-rose-500 to-red-600 p-5 text-white">
          <CloseButton onClose={onClose} />
          <div className="flex items-center gap-2.5 pr-14">
            <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center border border-white/30">
              <FaUndo size={15} />
            </div>
            <div>
              <h3 className="text-base font-black">Withdraw Policy</h3>
              <p className="text-[10px] text-rose-50/90">Close for future selection — history stays intact</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-5 space-y-3">
          {error && <ErrorBox message={error} />}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Policy</div>
            <code className="font-mono text-[10px] text-slate-800 truncate block">{shortId(policy.policy_key || policyId)}</code>
            {policy.policy_version != null && (
              <span className="text-[10px] text-slate-500 mt-0.5 inline-block">v{policy.policy_version}</span>
            )}
          </div>

          <Field label="Reason" required hint={`Minimum ${REASON_MIN_LENGTH} characters`}>
            <textarea ref={textRef} value={reason} onChange={(e) => setReason(e.target.value)}
              rows={3} placeholder="e.g. Replaced by newer zone tariff"
              className={inputCls + " resize-none"} disabled={busy} minLength={REASON_MIN_LENGTH} />
            <div className="flex justify-between mt-1">
              {trimmed.length > 0 && !valid && (
                <span className="text-[10px] text-rose-600 flex items-center gap-1">
                  <FaExclamationCircle size={9} /> Add {remaining} more
                </span>
              )}
              <span className={`ml-auto text-[10px] font-mono ${valid ? "text-emerald-600" : "text-rose-500"}`}>
                {trimmed.length}/{REASON_MIN_LENGTH}
              </span>
            </div>
          </Field>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm">
              Cancel
            </button>
            <button type="submit" disabled={busy || !valid}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {busy ? (<><FaSpinner className="animate-spin" size={12} /> Withdrawing…</>) : (<><FaUndo size={11} /> Withdraw</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==================== DETAIL DRAWER ==================== */
function DetailDrawer({ policy, onClose, onRefresh }) {
  const [tab, setTab] = useState("overview");
  const [history, setHistory] = useState(null);
  const [loadingH, setLoadingH] = useState(false);
  const [errorH, setErrorH] = useState(null);
  const [fresh, setFresh] = useState(policy);
  const [refreshing, setRefreshing] = useState(false);

  const [publishOpen, setPublishOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const policyId = policy?.id || policy?.policy_id || policy?.uuid;
  const shown = fresh || policy;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!policyId) return;
      setRefreshing(true);
      const meta = await fetchPolicyMeta(policyId);
      if (cancelled) return;
      if (meta.data) setFresh(meta.data);
      setRefreshing(false);
    })();
    return () => { cancelled = true; };
  }, [policyId]);

  useEffect(() => {
    setTab("overview");
    setHistory(null); setErrorH(null);
  }, [shown]);

  const loadHistory = useCallback(async () => {
    if (!policyId) return;
    setLoadingH(true); setErrorH(null);
    try {
      const res = await apiRequest(`/api/v1/admin/pricing/policies/${policyId}/history`);
      setHistory(extractHistory(res));
    } catch (err) { setErrorH(err.message); }
    finally { setLoadingH(false); }
  }, [policyId]);

  useEffect(() => {
    if (tab === "history" && history === null) loadHistory();
  }, [tab, history, loadHistory]);

  if (!shown) return null;

  const normStatus = policyStatus(shown);
  const style = statusStyle(normStatus);
  const rules = toArray(shown.rules);
  const scope = shown.scope || {};
  const isDraft = normStatus === "draft" || normStatus === "scheduled";
  const isPublished = normStatus === "published";

  const tabs = [
    { id: "overview", label: "Overview", icon: FaInfoCircle },
    { id: "rules",    label: `Rules (${rules.length})`, icon: FaLayerGroup },
    { id: "history",  label: "History",  icon: FaHistory },
    { id: "actions",  label: "Actions",  icon: FaPaperPlane },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-[slideIn_0.25s_ease-out]">
        <div className={`relative bg-gradient-to-br ${style.bg} p-5 text-white shrink-0`}>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <CloseButton onClose={onClose} />
          <div className="relative flex items-start gap-3 pr-14">
            <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
              <FaRupeeSign size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-black tracking-tight truncate">
                {shown.name || shown.policy_key || "Policy"}
              </h2>
              <p className="text-[10px] font-mono text-white/90 truncate mt-0.5">{shortId(shown.policy_key || policyId)}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {style.label}
                </span>
                {shown.policy_version != null && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/30">
                    v{shown.policy_version}
                  </span>
                )}
                {scope.kind && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/30">
                    {scope.kind}:{scope.key || "—"}
                  </span>
                )}
                {refreshing && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/30">
                    <FaSpinner className="animate-spin" size={9} /> Syncing
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-b border-slate-200 bg-white px-2 overflow-x-auto thin-scroll">
          <div className="flex items-center gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  tab === id ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}>
                <Icon size={11} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 thin-scroll">
          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <DetailRow icon={FaTag} label="Policy Key" value={shown.policy_key} mono />
                <DetailRow icon={FaFileAlt} label="Version" value={shown.policy_version} />
                <DetailRow icon={FaGlobe} label="Scope Kind" value={scope.kind} />
                <DetailRow icon={FaGlobe} label="Scope Key" value={scope.key} mono />
                <DetailRow icon={FaRupeeSign} label="Currency" value={shown.currency} />
                <DetailRow icon={FaClock} label="Starts" value={fmtDate(shown.starts_at)} />
                <DetailRow icon={FaClock} label="Ends" value={fmtDate(shown.ends_at)} />
                <DetailRow icon={FaLock} label="State version" value={shown.state_version ?? shown.version} />
                <DetailRow icon={FaCalendarCheck} label="Published" value={fmtDate(shown.published_at)} />
                <DetailRow icon={FaUndo} label="Withdrawn" value={fmtDate(shown.withdrawn_at)} />
              </div>

              {shown.reason && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Reason</h4>
                  <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 whitespace-pre-wrap">
                    {shown.reason}
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "rules" && (
            <div className="space-y-2">
              {rules.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">No rules defined.</p>
              ) : rules.map((r, i) => {
                const conditions = r.conditions || {};
                const condEntries = Object.entries(conditions);
                return (
                  <div key={r.id || i} className="rounded-xl border border-slate-200 bg-slate-50/40 overflow-hidden">
                    <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black">
                          {i + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{r.kind || "—"}</div>
                          {r.id && <code className="text-[9px] font-mono text-slate-500">{shortId(r.id)}</code>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-indigo-700">
                          ₹ {r.rate || "—"}
                        </div>
                        {r.basis && <div className="text-[9px] text-slate-500 uppercase">{r.basis}</div>}
                      </div>
                    </div>
                    <div className="p-2.5 grid grid-cols-2 gap-1.5 text-[10px]">
                      {r.component && <MiniRow label="Component" value={r.component} />}
                      {r.target && <MiniRow label="Target" value={r.target} mono />}
                      {r.tax_class && <MiniRow label="Tax class" value={r.tax_class} />}
                      {r.priority != null && <MiniRow label="Priority" value={r.priority} />}
                    </div>
                    {condEntries.length > 0 && (
                      <div className="px-2.5 pb-2.5">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Conditions</div>
                        <div className="flex flex-wrap gap-1">
                          {condEntries.map(([k, v]) => (
                            <span key={k} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[9px] font-mono">
                              <span className="text-indigo-600 font-bold">{k}</span>
                              <span className="text-slate-400">=</span>
                              <span className="text-slate-700">{String(v)}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "history" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Immutable audit trail</h4>
                <button onClick={loadHistory} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  <FaSyncAlt size={9} /> Refresh
                </button>
              </div>
              {loadingH && <Spinner label="Loading history…" />}
              {errorH && <ErrorBox message={errorH} />}
              {!loadingH && !errorH && (!history || history.length === 0) && (
                <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">No history records yet.</p>
              )}
              {!loadingH && !errorH && history && history.length > 0 && (
                <ol className="relative border-l-2 border-slate-200 ml-2 space-y-3">
                  {history.map((h, i) => (
                    <li key={i} className="ml-4">
                      <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {h.event_type || h.type || h.action || "Event"}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {fmtDate(h.created_at || h.timestamp || h.at)}
                          </span>
                        </div>
                        {h.actor && <p className="text-[10px] text-slate-600 mt-0.5">By: {h.actor}</p>}
                        {h.message && <p className="text-[11px] text-slate-700 mt-1">{h.message}</p>}
                        {h.reason && <p className="text-[11px] text-slate-700 mt-1 italic">"{h.reason}"</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {tab === "actions" && (
            <div className="space-y-3">
              {isDraft && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                  <div className="flex items-start gap-2 mb-2">
                    <FaPaperPlane className="text-emerald-600 mt-0.5" size={13} />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800">Publish this policy</h4>
                      <p className="text-[10px] text-emerald-700 mt-0.5">
                        Once published, the policy becomes active for new selections and can be withdrawn but not edited.
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setPublishOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/30 transition hover:-translate-y-0.5">
                    <FaPaperPlane size={11} /> Publish
                  </button>
                </div>
              )}

              {isPublished && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50">
                  <div className="flex items-start gap-2 mb-2">
                    <FaUndo className="text-rose-600 mt-0.5" size={13} />
                    <div>
                      <h4 className="text-xs font-bold text-rose-800">Withdraw this policy</h4>
                      <p className="text-[10px] text-rose-700 mt-0.5">
                        Removes the policy from future selection. History is preserved.
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setWithdrawOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-500/30">
                    <FaUndo size={11} /> Withdraw
                  </button>
                </div>
              )}

              {!isDraft && !isPublished && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <FaInfoCircle className="text-slate-400 mx-auto mb-2" size={20} />
                  <p className="text-xs text-slate-600 font-bold">No actions available</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    This policy is {normStatus} — no further transitions are allowed.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PublishModal
        open={publishOpen}
        policy={shown}
        onClose={() => setPublishOpen(false)}
        onSuccess={() => { onRefresh?.(); onClose(); }}
      />

      <WithdrawModal
        open={withdrawOpen}
        policy={shown}
        onClose={() => setWithdrawOpen(false)}
        onSuccess={() => { onRefresh?.(); onClose(); }}
      />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(30px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
        <Icon size={9} /> {label}
      </div>
      <div className={`text-xs font-semibold text-slate-900 truncate ${mono ? "font-mono text-[11px]" : ""}`}>
        {value === null || value === undefined || value === "" ? "—" : String(value)}
      </div>
    </div>
  );
}
function MiniRow({ label, value, mono }) {
  return (
    <div>
      <div className="text-[9px] text-slate-400 uppercase">{label}</div>
      <div className={`text-[10px] text-slate-700 truncate ${mono ? "font-mono" : ""}`}>{String(value)}</div>
    </div>
  );
}

/* ==================== MAIN PAGE ==================== */
export default function Pricing() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected]   = useState(null);
  const [toast, setToast]         = useState(null);

  useEffect(() => {
    const id = "pricing-google-fonts";
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
      const res = await apiRequest("/api/v1/admin/pricing/policies");
      setPolicies(extractPolicies(res));
    } catch (err) {
      if (err.isSessionExpired) { setSessionExpired(true); setPolicies([]); }
      else { setError(err.message); setPolicies([]); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = policies.filter((p) => {
    const q = search.toLowerCase().trim();
    const scope = p.scope || {};
    const hay = [
      p.policy_key, p.name, p.currency, p.reason,
      scope.kind, scope.key,
      ...toArray(p.rules).flatMap((r) => [r.id, r.kind, r.component, r.basis, r.target, r.tax_class]),
    ].filter(Boolean).join(" ").toLowerCase();
    const matchesSearch = !q || hay.includes(q);
    const norm = policyStatus(p);
    const matchesStatus = statusFilter === "all" || norm === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = policies.reduce((acc, p) => {
    acc.total++;
    const norm = policyStatus(p);
    if (norm === "draft") acc.draft++;
    else if (norm === "published") acc.published++;
    else if (norm === "withdrawn") acc.withdrawn++;
    else if (norm === "scheduled") acc.scheduled++;
    return acc;
  }, { total: 0, draft: 0, published: 0, withdrawn: 0, scheduled: 0 });

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/40 px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <FaExclamationCircle className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Session expired</h2>
          <p className="text-sm text-slate-600 mt-2">Please sign in again to continue.</p>
          <button onClick={() => { clearSession(); navigate("/login", { replace: true }); }}
            className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/30">
            <FaSignInAlt size={12} /> Sign in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/40 px-4 py-8 pricing-page">
      <style>{`
        .pricing-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .pricing-page h1, .pricing-page h2, .pricing-page h3 {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          letter-spacing: -0.025em;
        }
        .pricing-page .font-mono, .pricing-page code {
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 p-7 sm:p-8 shadow-xl shadow-indigo-500/20">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                <FaRupeeSign size={9} /> Tariff Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <FaRupeeSign size={26} /> Pricing Policies
              </h1>
              <p className="text-indigo-50/90 text-sm mt-1.5 max-w-xl">
                Immutable tariff revisions. Every change creates a new version — publish only after review.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={load}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 transition"
                title="Refresh">
                <FaSyncAlt size={13} />
              </button>
              <button onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <FaPlus size={13} /> New Policy
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={FaFileAlt}      label="Total"       value={stats.total}       gradient="bg-gradient-to-br from-indigo-500 to-purple-600" />
          <StatCard icon={FaClock}        label="Drafts"      value={stats.draft}       gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
          <StatCard icon={FaCheckCircle}  label="Published"   value={stats.published}   gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
          <StatCard icon={FaUndo}         label="Withdrawn"   value={stats.withdrawn}   gradient="bg-gradient-to-br from-slate-500 to-slate-700" />
        </div>

        {/* TOOLBAR */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by policy key, scope, reason…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200">
              {STATUS_FILTERS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
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
          <Spinner label="Loading policies…" />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
              <FaRupeeSign className="text-indigo-400" size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {policies.length === 0 ? "No policies yet" : "No matches"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {policies.length === 0
                ? "Create your first tariff policy — it will start as a draft."
                : "Try adjusting your search or status filter."}
            </p>
            {policies.length === 0 && (
              <button onClick={() => setCreateOpen(true)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-indigo-500/30">
                <FaPlus size={11} /> Create your first policy
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((p, i) => {
              const pid = p.id || p.policy_id || p.uuid || i;
              const norm = policyStatus(p);
              const style = statusStyle(norm);
              const scope = p.scope || {};
              const rules = toArray(p.rules);
              const key = p.policy_key || p.name || `Policy ${i + 1}`;

              return (
                <div key={pid} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className={`h-1.5 bg-gradient-to-r ${style.bg}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center shadow-sm shrink-0`}>
                            <FaRupeeSign className="text-white" size={14} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-black text-slate-900 truncate">{key}</h3>
                            <p className="text-[10px] font-mono text-slate-500 truncate">
                              {p.policy_version != null ? `v${p.policy_version}` : "v—"} · {shortId(pid)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={norm} />
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {scope.kind && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                          {scope.kind}
                        </span>
                      )}
                      {scope.key && (
                        <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider border border-violet-200 font-mono">
                          {scope.key}
                        </span>
                      )}
                      {p.currency && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                          {p.currency}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                        {rules.length} rule{rules.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3 pb-2 border-b border-slate-100">
                      <span className="flex items-center gap-1">
                        <FaCalendarCheck size={9} /> {fmtShortDate(p.starts_at)}
                      </span>
                      <span>→</span>
                      <span>{fmtShortDate(p.ends_at)}</span>
                    </div>

                    <button onClick={() => setSelected(p)}
                      className="w-full py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                      <FaEye size={10} /> View details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreatePolicyModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          load();
          showToast("Policy draft created successfully.", "emerald");
        }}
      />

      {selected && (
        <DetailDrawer
          policy={selected}
          onClose={() => setSelected(null)}
          onRefresh={load}
        />
      )}

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