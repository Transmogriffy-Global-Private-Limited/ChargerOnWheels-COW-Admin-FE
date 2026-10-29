// src/components/Admin/Chargers.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBolt, FaPlus, FaSearch, FaSyncAlt, FaCheckCircle, FaExclamationCircle,
  FaSpinner, FaTimes, FaEye, FaEdit, FaHistory, FaCalendarCheck,
  FaPowerOff, FaPlayCircle, FaWrench, FaInfoCircle, FaClock, FaPlug,
  FaSignInAlt, FaLock, FaCommentDots, FaCopy, FaMicrochip,
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
      console.log("%c[auth] ✅ access token refreshed", "color:#10b981;font-weight:bold");
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
      "%c[CHARGERS →] " + method + " " + path,
      "color:#f59e0b;font-weight:bold",
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
      const e = new Error("Network error — cannot reach Chargers API.");
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

function extractChargers(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  return toArray(res.chargers || res.items || res.data?.chargers || res.data?.items || res.data || []);
}
function extractConnectors(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  return toArray(res.connectors || res.items || res.data?.connectors || res.data?.items || res.data || []);
}
function extractHistory(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  return toArray(res.history || res.events || res.items || res.data?.history || res.data?.events || res.data || []);
}
function extractAvailability(res) {
  if (!res) return null;
  return res.availability || res.data?.availability || res.data || res;
}
function extractVersion(res) {
  if (!res) return null;
  return res.version ?? res.data?.version ?? null;
}

function normalizeStatus(v) {
  if (!v) return "unknown";
  if (v.is_active === false || v.deactivated === true) return "inactive";
  if (v.in_maintenance === true || v.maintenance === true) return "maintenance";
  const raw = String(v.status || v.state || v.lifecycle_status || "").trim().toLowerCase();
  if (!raw) return "active";
  if (raw === "active" || raw === "enabled" || raw === "running" ||
      raw === "operational" || raw === "available" || raw === "reactivated") return "active";
  if (raw === "inactive" || raw === "deactivated" || raw === "disabled" ||
      raw === "offline" || raw === "suspended" || raw === "blocked") return "inactive";
  if (raw === "maintenance" || raw === "in_maintenance" || raw === "under_maintenance" ||
      raw === "servicing") return "maintenance";
  if (raw.includes("mainten")) return "maintenance";
  if (raw.startsWith("deact") || raw.startsWith("inactiv") ||
      raw.startsWith("disabl") || raw.startsWith("offlin") || raw.startsWith("suspend")) return "inactive";
  if (raw.startsWith("reactiv") || raw.startsWith("activ") ||
      raw.startsWith("enabl") || raw.startsWith("run")) return "active";
  return "active";
}
function statusStyle(normStatus) {
  if (normStatus === "maintenance")
    return { bg: "from-amber-400 to-orange-500", chip: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500", label: "In Maintenance" };
  if (normStatus === "inactive")
    return { bg: "from-slate-400 to-slate-600", chip: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-500", label: "Inactive" };
  return { bg: "from-emerald-400 to-teal-500", chip: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500", label: "Active" };
}

function fmtDate(d) {
  if (!d) return "—";
  try { const dt = new Date(d); if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return String(d); }
}
function fmtDateOnly(d) {
  if (!d) return "—";
  try { const dt = new Date(d); if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch { return String(d); }
}
function toIsoUtc(localValue) {
  if (!localValue) return localValue;
  try { const d = new Date(localValue); if (isNaN(d.getTime())) return localValue; return d.toISOString(); }
  catch { return localValue; }
}
function validateReason(reason, action) {
  const trimmed = String(reason || "").trim();
  if (!trimmed) throw new Error(`A reason is required to ${action} a charger.`);
  if (trimmed.length < REASON_MIN_LENGTH)
    throw new Error(`Reason must be at least ${REASON_MIN_LENGTH} characters (you entered ${trimmed.length}).`);
  return trimmed;
}

/* ==================== BODY BUILDERS ==================== */
function buildChargerBody(fields) {
  const body = {};
  const trim = (v) => (typeof v === "string" ? v.trim() : v);
  const setIf = (k, val) => {
    const v = trim(val);
    if (v !== undefined && v !== null && v !== "") body[k] = v;
  };
  setIf("asset_tag", fields.asset_tag);
  setIf("serial_number", fields.serial_number);
  setIf("manufacturer", fields.manufacturer);
  setIf("model", fields.model);
  if (fields.rated_power_w !== undefined && fields.rated_power_w !== "") {
    const n = Number(fields.rated_power_w);
    if (!isNaN(n) && n > 0) body.rated_power_w = n;
  }
  setIf("protocol_family", fields.protocol_family);
  setIf("protocol_version", fields.protocol_version);
  setIf("hal_identity", fields.hal_identity);
  setIf("notes", fields.notes);
  return body;
}

function buildFullChargerBody(c) {
  return {
    asset_tag: c.asset_tag || undefined,
    serial_number: c.serial_number || undefined,
    manufacturer: c.manufacturer || undefined,
    model: c.model || undefined,
    rated_power_w: c.rated_power_w != null ? Number(c.rated_power_w) : undefined,
    protocol_family: c.protocol_family || undefined,
    protocol_version: c.protocol_version || undefined,
    hal_identity: c.hal_identity || undefined,
    notes: c.notes || undefined,
  };
}

/* ==================== FETCH ETAG + VERSION ==================== */
async function fetchChargerMeta(chargerId) {
  try {
    const { data, headers } = await apiRequest(`/api/v1/admin/chargers/${chargerId}`, { returnResponse: true });
    const etagHeader = headers.get("ETag") || headers.get("etag");
    const version = extractVersion(data);
    console.log("%c[fetch-charger] version:", "color:#8b5cf6;font-weight:bold",
      version, "| ETag:", etagHeader || "(none)");
    return { data, etag: etagHeader, version };
  } catch (err) {
    console.warn("[fetch-charger] failed:", err?.message);
    return { data: null, etag: null, version: null };
  }
}

function pickIfMatch({ version, etag }) {
  if (version !== null && version !== undefined) return ifMatchHeader(version);
  if (etag) return etag;
  return null;
}

async function mutationWithIfMatch(chargerId, { method, path, body, maxRetries = 1 }) {
  let { version, etag } = await fetchChargerMeta(chargerId);
  let ifMatch = pickIfMatch({ version, etag });

  const buildHeaders = () => {
    const h = { "Idempotency-Key": uuid() };
    if (ifMatch) h["If-Match"] = ifMatch;
    return h;
  };
  const send = () => apiRequest(path, { method, body, extraHeaders: buildHeaders() });

  try { return await send(); }
  catch (err) {
    const retryable = err.status === 412 || err.status === 428 || err.status === 409;
    if (!retryable || maxRetries <= 0) throw err;
    console.warn(`[charger-mutation] ${err.status} — refetching version + retrying…`);
    const fresh = await fetchChargerMeta(chargerId);
    ifMatch = pickIfMatch(fresh);
    return await send();
  }
}

/* ==================== CREATE CHARGER ==================== */
async function createChargerMultiShape(fields) {
  const base = buildChargerBody(fields);
  const minimal = { asset_tag: base.asset_tag, serial_number: base.serial_number };
  const withProtocol = {
    ...base,
    protocol_family: base.protocol_family || "OCPP",
    protocol_version: base.protocol_version || "1.6J",
  };
  const noHal = { ...base };
  delete noHal.hal_identity;

  const attempts = [
    { label: "as-entered",              body: base },
    { label: "with defaults (OCPP 1.6J)", body: withProtocol },
    { label: "without hal_identity",    body: noHal },
    { label: "minimal (asset+serial)",  body: minimal },
  ];

  const failures = [];
  for (const a of attempts) {
    Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);
    try {
      console.log(`%c[create-charger] try: ${a.label}`, "color:#f59e0b;font-weight:bold", "\n  body:", JSON.stringify(a.body));
      const res = await apiRequest("/api/v1/admin/chargers", {
        method: "POST", body: a.body,
        extraHeaders: { "Idempotency-Key": uuid() },
      });
      console.log(`%c[create-charger] ✅ ACCEPTED: ${a.label}`, "color:#10b981;font-weight:bold;font-size:14px");
      return { res, usedLabel: a.label };
    } catch (err) {
      if (err.code !== "VALIDATION_FAILED") throw err;
      console.warn(`[create-charger] ✗ ${a.label}:`, err.code, err.message);
      failures.push({ label: a.label, code: err.code, message: err.message });
    }
  }
  const e = new Error(
    `Server rejected all ${attempts.length} charger create shapes with VALIDATION_FAILED.`
  );
  e.code = "VALIDATION_FAILED";
  e.failures = failures;
  throw e;
}

/* ==================== PATCH CHARGER ==================== */
async function updateChargerMultiShape(chargerId, changedFields, currentCharger) {
  const meta = await fetchChargerMeta(chargerId);
  const version = meta.version ?? extractVersion(currentCharger);
  let ifMatch = pickIfMatch({ version, etag: meta.etag });
  if (!ifMatch) throw new Error("Cannot update — backend returned no version or ETag.");

  const changedBody = buildChargerBody(changedFields);
  const fullBody = buildFullChargerBody(currentCharger || {});
  Object.assign(fullBody, changedBody);

  const bodyShapes = [
    { label: "changed fields only", body: changedBody },
    { label: "all charger fields",  body: fullBody },
  ];

  const failures = [];
  for (const [index, bodyShape] of bodyShapes.entries()) {
    const body = Object.fromEntries(
      Object.entries(bodyShape.body).filter(([, value]) => value !== undefined)
    );
    let refreshedVersion = false;
    while (true) {
      try {
        const res = await apiRequest(`/api/v1/admin/chargers/${chargerId}`, {
          method: "PATCH", body,
          extraHeaders: { "Idempotency-Key": uuid(), "If-Match": ifMatch },
        });
        return { res, usedLabel: bodyShape.label };
      } catch (err) {
        failures.push({
          attempt: failures.length + 1, body: bodyShape.label, ifMatch,
          status: err.status, code: err.code, message: err.message,
        });
        if ((err.status === 412 || err.status === 428) && !refreshedVersion) {
          const fresh = await fetchChargerMeta(chargerId);
          const freshIfMatch = pickIfMatch(fresh);
          if (!freshIfMatch) { err.failures = failures; throw err; }
          ifMatch = freshIfMatch;
          refreshedVersion = true;
          continue;
        }
        const validationFailed =
          err.code === "VALIDATION_FAILED" || err.status === 400 || err.status === 422;
        if (validationFailed && index < bodyShapes.length - 1) break;
        err.failures = failures;
        throw err;
      }
    }
  }
  const lastFailure = failures[failures.length - 1];
  const error = new Error(lastFailure?.message || "The server rejected the charger update.");
  error.code = lastFailure?.code || "VALIDATION_FAILED";
  error.status = lastFailure?.status;
  error.failures = failures;
  throw error;
}

/* ==================== DEACTIVATE / REACTIVATE ==================== */
async function deactivateCharger(chargerId, reason) {
  const trimmed = validateReason(reason, "deactivate");
  return mutationWithIfMatch(chargerId, {
    method: "POST",
    path: `/api/v1/admin/chargers/${chargerId}/deactivate`,
    body: { reason: trimmed },
  });
}
async function reactivateCharger(chargerId, reason) {
  const trimmed = validateReason(reason, "reactivate");
  return mutationWithIfMatch(chargerId, {
    method: "POST",
    path: `/api/v1/admin/chargers/${chargerId}/reactivate`,
    body: { reason: trimmed },
  });
}

/* ==================================================================
 *  ✅ MAINTENANCE — Swagger schema: { starts_at, ends_at, reason }
 *  reason min 8 chars per Swagger example "stringst"
 * ================================================================== */
async function recordMaintenanceMultiShape(chargerId, data) {
  const startsIso = toIsoUtc(data.start_at);
  const endsIso   = toIsoUtc(data.end_at);
  const reason    = String(data.reason || "").trim();

  if (reason.length < REASON_MIN_LENGTH) {
    throw new Error(
      `Reason must be at least ${REASON_MIN_LENGTH} characters (you entered ${reason.length}).`
    );
  }

  // Primary shape per Swagger: starts_at / ends_at / reason
  const attempts = [
    { label: "{ starts_at, ends_at, reason }",       body: { starts_at: startsIso, ends_at: endsIso, reason } },
    { label: "{ starts_at, ends_at } (no reason)",   body: { starts_at: startsIso, ends_at: endsIso } },
    // Fallback shapes (in case backend is inconsistent)
    { label: "{ start_at, end_at, reason }",         body: { start_at: startsIso, end_at: endsIso, reason } },
    { label: "{ from, to, reason }",                 body: { from: startsIso, to: endsIso, reason } },
    { label: "{ window_start, window_end, reason }", body: { window_start: startsIso, window_end: endsIso, reason } },
  ];

  const failures = [];
  for (const a of attempts) {
    Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);
    try {
      console.log(`%c[maintenance] try: ${a.label}`, "color:#f59e0b;font-weight:bold", a.body);
      const res = await apiRequest(`/api/v1/admin/chargers/${chargerId}/maintenance`, {
        method: "POST", body: a.body,
        extraHeaders: { "Idempotency-Key": uuid() },
      });
      console.log(`%c[maintenance] ✅ ACCEPTED: ${a.label}`, "color:#10b981;font-weight:bold;font-size:14px");
      return { res, usedLabel: a.label };
    } catch (err) {
      if (err.code !== "VALIDATION_FAILED") throw err;
      failures.push({ label: a.label, code: err.code, message: err.message });
    }
  }
  const e = new Error("Server rejected all maintenance payload shapes for charger.");
  e.code = "VALIDATION_FAILED";
  e.failures = failures;
  throw e;
}

/* ==================================================================
 *  ✅ CONNECTORS — Swagger schema:
 *  {
 *    connector_number: int,
 *    connector_type: string,
 *    max_power_w: int,
 *    supports_ac: bool,
 *    supports_dc: bool,
 *    is_active: bool
 *  }
 * ================================================================== */
const CONNECTOR_TYPES = ["CCS1", "CCS2", "CHADEMO", "TYPE1", "TYPE2", "GBT", "TESLA", "NACS", "OTHER"];

function buildConnectorBody(fields) {
  const body = {};

  // connector_number (required, integer)
  if (fields.connector_number !== undefined && fields.connector_number !== "" && fields.connector_number !== null) {
    const n = Number(fields.connector_number);
    if (!isNaN(n) && n >= 1) body.connector_number = Math.floor(n);
  }

  // connector_type (string)
  if (fields.connector_type) {
    const t = String(fields.connector_type).trim();
    if (t) body.connector_type = t;
  }

  // max_power_w (integer)
  if (fields.max_power_w !== undefined && fields.max_power_w !== "" && fields.max_power_w !== null) {
    const n = Number(fields.max_power_w);
    if (!isNaN(n) && n > 0) body.max_power_w = Math.floor(n);
  }

  // booleans
  if (typeof fields.supports_ac === "boolean") body.supports_ac = fields.supports_ac;
  if (typeof fields.supports_dc === "boolean") body.supports_dc = fields.supports_dc;
  if (typeof fields.is_active === "boolean")   body.is_active   = fields.is_active;

  // notes (optional)
  if (fields.notes && String(fields.notes).trim()) {
    body.notes = String(fields.notes).trim();
  }

  return body;
}

/**
 * ✅ Create connector — uses exact Swagger schema, no multi-shape guessing.
 * Falls back only when server rejects a known-optional field.
 */
async function createConnector(chargerId, fields) {
  const body = buildConnectorBody(fields);

  // Ensure required fields present
  if (body.connector_number === undefined) {
    throw new Error("Connector number is required.");
  }
  if (!body.connector_type) {
    throw new Error("Connector type is required.");
  }

  // Fill defaults for booleans (backend expects all three)
  if (body.supports_ac === undefined) body.supports_ac = true;
  if (body.supports_dc === undefined) body.supports_dc = false;
  if (body.is_active   === undefined) body.is_active   = true;

  console.log("%c[create-connector] → body", "color:#8b5cf6;font-weight:bold", body);

  const attempts = [
    { label: "full (with notes)",        body: { ...body } },
    { label: "without notes",            body: (() => { const c = { ...body }; delete c.notes; return c; })() },
    { label: "without notes & defaults", body: {
        connector_number: body.connector_number,
        connector_type: body.connector_type,
        ...(body.max_power_w != null ? { max_power_w: body.max_power_w } : {}),
      } },
  ];

  const failures = [];
  for (const a of attempts) {
    Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);
    try {
      console.log(`%c[create-connector] try: ${a.label}`, "color:#f59e0b;font-weight:bold", a.body);
      const res = await apiRequest(`/api/v1/admin/chargers/${chargerId}/connectors`, {
        method: "POST", body: a.body,
        extraHeaders: { "Idempotency-Key": uuid() },
      });
      console.log(`%c[create-connector] ✅ ACCEPTED: ${a.label}`, "color:#10b981;font-weight:bold;font-size:14px");
      return { res, usedLabel: a.label };
    } catch (err) {
      if (err.code !== "VALIDATION_FAILED") throw err;
      console.warn(`[create-connector] ✗ ${a.label}:`, err.code, err.message);
      failures.push({ label: a.label, code: err.code, message: err.message });
    }
  }
  const e = new Error("Server rejected all connector create shapes.");
  e.code = "VALIDATION_FAILED";
  e.failures = failures;
  throw e;
}

/**
 * ✅ Update connector — same body schema + If-Match header.
 * Fetches fresh version from list before PATCH; retries once on 412/428.
 */
async function updateConnector(chargerId, connectorId, fields, currentConnector) {
  const body = buildConnectorBody(fields);

  // Get fresh version by listing connectors
  let ifMatch = null;
  try {
    const { data } = await apiRequest(`/api/v1/admin/chargers/${chargerId}/connectors`, { returnResponse: true });
    const list = extractConnectors(data);
    const found = list.find((c) => (c.id || c.connector_id) === connectorId);
    if (found?.version != null) {
      ifMatch = ifMatchHeader(found.version);
    } else if (currentConnector?.version != null) {
      ifMatch = ifMatchHeader(currentConnector.version);
    }
  } catch {
    if (currentConnector?.version != null) {
      ifMatch = ifMatchHeader(currentConnector.version);
    }
  }

  const headers = { "Idempotency-Key": uuid() };
  if (ifMatch) headers["If-Match"] = ifMatch;

  console.log("%c[update-connector] → body", "color:#8b5cf6;font-weight:bold", body, "\n  ifMatch:", ifMatch);

  const send = () => apiRequest(`/api/v1/admin/chargers/${chargerId}/connectors/${connectorId}`, {
    method: "PATCH", body, extraHeaders: headers,
  });

  try {
    return await send();
  } catch (err) {
    if ((err.status === 412 || err.status === 428) && currentConnector) {
      // Refresh version and retry
      try {
        const { data } = await apiRequest(`/api/v1/admin/chargers/${chargerId}/connectors`, { returnResponse: true });
        const list = extractConnectors(data);
        const found = list.find((c) => (c.id || c.connector_id) === connectorId);
        if (found?.version != null) {
          headers["If-Match"] = ifMatchHeader(found.version);
          headers["Idempotency-Key"] = uuid();
          return await send();
        }
      } catch { /* fall through */ }
    }
    throw err;
  }
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

const PROTOCOL_FAMILIES = ["OCPP", "OCPI", "MODBUS", "MQTT", "OTHER"];
const PROTOCOL_VERSIONS = ["1.6", "1.6J", "2.0", "2.0.1", "2.1", "3.0"];

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
const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-200";

/* ==================== CREATE CHARGER MODAL ==================== */
function CreateChargerModal({ open, onClose, onSuccess }) {
  const emptyForm = {
    asset_tag: "", serial_number: "",
    manufacturer: "", model: "", rated_power_w: "",
    protocol_family: "OCPP", protocol_version: "1.6J",
    hal_identity: "", notes: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [successLabel, setSuccessLabel] = useState(null);
  const firstRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setError(null); setBusy(false); setSuccessLabel(null);
      setTimeout(() => firstRef.current?.focus(), 120);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && !busy) onClose(); };
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, busy, onClose]);

  if (!open) return null;
  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.asset_tag.trim())     return setError("Asset tag is required.");
    if (!form.serial_number.trim()) return setError("Serial number is required.");
    setBusy(true); setError(null); setSuccessLabel(null);
    try {
      const { usedLabel } = await createChargerMultiShape(form);
      setSuccessLabel(usedLabel);
      onSuccess?.(usedLabel);
      setTimeout(() => { setBusy(false); onClose(); }, 1400);
    } catch (err) {
      console.error("[create-charger] final error:", err);
      if (err.isSessionExpired) setError(err.message);
      else if (err.code === "VALIDATION_FAILED") setError(err.message);
      else if (err.status === 409) setError("A charger with this asset tag or serial already exists.");
      else if (err.status === 403) setError("You need the fleet.manage capability to register chargers.");
      else setError(err.message || "Failed to register charger.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => !busy && onClose()} />
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-white shadow-2xl shadow-amber-900/20 animate-[scaleIn_0.2s_ease-out]">
        <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 p-6 pb-8 text-white">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
          <button onClick={() => !busy && onClose()}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
            <FaTimes size={12} />
          </button>
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <FaBolt size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Register Charger</h3>
              <p className="text-[11px] text-amber-50/90">Requires fleet.manage capability</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4 -mt-4 relative max-h-[75vh] overflow-y-auto thin-scroll">
          {successLabel && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
              <div>
                <p className="text-emerald-800 text-xs font-bold">✅ Charger registered!</p>
                <p className="text-emerald-700 text-[10px] mt-0.5">
                  Accepted shape: <code className="font-mono bg-emerald-100 px-1 rounded">{successLabel}</code>
                </p>
              </div>
            </div>
          )}
          {error && <ErrorBox message={error} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Asset Tag" required>
              <input ref={firstRef} value={form.asset_tag} onChange={onChange("asset_tag")} placeholder="e.g. CHG-0012" className={inputCls + " font-mono"} disabled={busy} />
            </Field>
            <Field label="Serial Number" required>
              <input value={form.serial_number} onChange={onChange("serial_number")} placeholder="e.g. SN-AB-2026-0042" className={inputCls + " font-mono"} disabled={busy} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Manufacturer"><input value={form.manufacturer} onChange={onChange("manufacturer")} placeholder="e.g. ABB" className={inputCls} disabled={busy} /></Field>
            <Field label="Model"><input value={form.model} onChange={onChange("model")} placeholder="e.g. Terra AC" className={inputCls} disabled={busy} /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Rated Power (W)">
              <input type="number" min="1" value={form.rated_power_w} onChange={onChange("rated_power_w")} placeholder="e.g. 22000" className={inputCls} disabled={busy} />
            </Field>
            <Field label="Protocol Family">
              <select value={form.protocol_family} onChange={onChange("protocol_family")} className={inputCls} disabled={busy}>
                {PROTOCOL_FAMILIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Protocol Version">
              <input list="protocol-versions" value={form.protocol_version} onChange={onChange("protocol_version")} placeholder="1.6J" className={inputCls} disabled={busy} />
              <datalist id="protocol-versions">
                {PROTOCOL_VERSIONS.map((v) => <option key={v} value={v} />)}
              </datalist>
            </Field>
          </div>
          <Field label="HAL Identity" hint="Leave blank if the charger hasn't been paired yet.">
            <input value={form.hal_identity} onChange={onChange("hal_identity")} placeholder="e.g. HAL-NODE-A12" className={inputCls + " font-mono"} disabled={busy} />
          </Field>
          <Field label="Notes">
            <textarea value={form.notes} onChange={onChange("notes")} rows={2} placeholder="Optional notes…" className={inputCls + " resize-none"} disabled={busy} />
          </Field>

          <div className="flex items-center gap-2 pt-2">
            <button type="button" onClick={() => !busy && onClose()} disabled={busy}
              className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition">
              Cancel
            </button>
            <button type="submit" disabled={busy}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:via-orange-400 hover:to-yellow-400 text-white font-bold text-sm shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
              {busy ? (<><FaSpinner className="animate-spin" size={13} /> Registering…</>) : (<><FaPlus size={12} /> Register Charger</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==================== CONNECTOR MODAL (fixed schema) ==================== */
function ConnectorModal({ open, chargerId, connector, onClose, onSuccess }) {
  const isEdit = Boolean(connector);
  const [form, setForm] = useState({
    connector_number: 1,
    connector_type: "CCS2",
    max_power_w: "",
    supports_ac: true,
    supports_dc: true,
    is_active: true,
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [successLabel, setSuccessLabel] = useState(null);

  useEffect(() => {
    if (open) {
      setErr(null); setBusy(false); setSuccessLabel(null);
      if (connector) {
        setForm({
          connector_number: connector.connector_number ?? 1,
          connector_type: connector.connector_type ?? "CCS2",
          max_power_w: connector.max_power_w != null ? String(connector.max_power_w) : "",
          supports_ac: connector.supports_ac !== false,
          supports_dc: connector.supports_dc !== false,
          is_active: connector.is_active !== false,
          notes: connector.notes || "",
        });
      } else {
        setForm({
          connector_number: 1,
          connector_type: "CCS2",
          max_power_w: "",
          supports_ac: true,
          supports_dc: true,
          is_active: true,
          notes: "",
        });
      }
    }
  }, [open, connector]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && !busy) onClose(); };
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, busy, onClose]);

  if (!open) return null;
  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onToggle = (k) => () => setForm((f) => ({ ...f, [k]: !f[k] }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.connector_number || Number(form.connector_number) < 1)
      return setErr("Connector number must be 1 or greater.");
    if (!form.connector_type)
      return setErr("Connector type is required.");

    setBusy(true); setErr(null); setSuccessLabel(null);
    try {
      const payload = {
        ...form,
        connector_number: Number(form.connector_number),
        max_power_w: form.max_power_w === "" ? undefined : Number(form.max_power_w),
      };

      if (isEdit) {
        const connectorId = connector.id || connector.connector_id;
        await updateConnector(chargerId, connectorId, payload, connector);
        onSuccess?.();
        onClose();
      } else {
        const { usedLabel } = await createConnector(chargerId, payload);
        setSuccessLabel(usedLabel);
        setTimeout(() => { onSuccess?.(); onClose(); }, 900);
      }
    } catch (err) {
      console.error("[connector] error:", err);
      if (err.code === "VALIDATION_FAILED") setErr(err.message);
      else if (err.status === 409) setErr("A connector with this number already exists.");
      else if (err.status === 422) setErr(err.message || "Validation failed — check the connector fields.");
      else setErr(err.message || "Failed to save connector.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => !busy && onClose()} />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 p-5 text-white shrink-0">
          <button onClick={() => !busy && onClose()}
            className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center">
            <FaTimes size={11} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center border border-white/30">
              <FaPlug size={15} />
            </div>
            <div>
              <h3 className="text-base font-black">{isEdit ? "Edit Connector" : "Add Connector"}</h3>
              <p className="text-[10px] text-violet-50/90">Charger connector metadata</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-5 space-y-3 overflow-y-auto thin-scroll">
          {successLabel && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={12} />
              <div>
                <p className="text-emerald-800 text-[11px] font-bold">✅ Connector created!</p>
                <p className="text-emerald-700 text-[10px] mt-0.5">
                  Shape: <code className="font-mono bg-emerald-100 px-1 rounded">{successLabel}</code>
                </p>
              </div>
            </div>
          )}
          {err && <ErrorBox message={err} />}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Number" required>
              <input type="number" min="1" value={form.connector_number}
                onChange={onChange("connector_number")} className={inputCls} disabled={busy} />
            </Field>
            <Field label="Type" required>
              <select value={form.connector_type} onChange={onChange("connector_type")} className={inputCls} disabled={busy}>
                {CONNECTOR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Max Power (W)">
            <input type="number" min="1" value={form.max_power_w}
              onChange={onChange("max_power_w")} placeholder="e.g. 22000"
              className={inputCls} disabled={busy} />
          </Field>

          {/* Toggles */}
          <div className="space-y-2 pt-1">
            <ToggleRow label="Supports AC" checked={form.supports_ac} onToggle={onToggle("supports_ac")} disabled={busy} />
            <ToggleRow label="Supports DC" checked={form.supports_dc} onToggle={onToggle("supports_dc")} disabled={busy} />
            <ToggleRow label="Active" checked={form.is_active} onToggle={onToggle("is_active")} disabled={busy} />
          </div>

          <Field label="Notes">
            <textarea value={form.notes} onChange={onChange("notes")} rows={2}
              className={inputCls + " resize-none"} disabled={busy} />
          </Field>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => !busy && onClose()} disabled={busy}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm">
              Cancel
            </button>
            <button type="submit" disabled={busy}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {busy
                ? <><FaSpinner className="animate-spin" size={12} /> Saving…</>
                : isEdit
                  ? <><FaCheckCircle size={11} /> Save</>
                  : <><FaPlus size={11} /> Add</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onToggle, disabled }) {
  return (
    <button type="button" onClick={onToggle} disabled={disabled}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition ${
        checked
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-slate-50 border-slate-200 text-slate-600"
      } ${disabled ? "opacity-60" : "hover:border-slate-300"}`}>
      <span className="text-xs font-bold">{label}</span>
      <span className={`relative w-9 h-5 rounded-full transition ${checked ? "bg-emerald-500" : "bg-slate-300"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
          checked ? "left-4.5 translate-x-0.5" : "left-0.5"
        }`} />
      </span>
    </button>
  );
}

/* ==================== DETAIL DRAWER ==================== */
function DetailDrawer({ charger, onClose, onRefresh }) {
  const [tab, setTab] = useState("overview");
  const [history, setHistory]   = useState(null);
  const [avail, setAvail]       = useState(null);
  const [connectors, setConnectors] = useState(null);
  const [loadingH, setLoadingH] = useState(false);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingC, setLoadingC] = useState(false);
  const [errorH, setErrorH] = useState(null);
  const [errorA, setErrorA] = useState(null);
  const [errorC, setErrorC] = useState(null);

  const [fresh, setFresh] = useState(charger);
  const [freshVersion, setFreshVersion] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [edit, setEdit] = useState(null);
  const [editBusy, setEditBusy] = useState(false);
  const [editErr, setEditErr] = useState(null);
  const [editLabel, setEditLabel] = useState(null);
  const [editFailures, setEditFailures] = useState(null);

  const [maint, setMaint] = useState({ start_at: "", end_at: "", reason: "" });
  const [maintBusy, setMaintBusy] = useState(false);
  const [maintErr, setMaintErr] = useState(null);
  const [maintOk, setMaintOk] = useState(null);
  const [maintLabel, setMaintLabel] = useState(null);

  const [actionReason, setActionReason] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [actionErr, setActionErr] = useState(null);

  const [connModalOpen, setConnModalOpen] = useState(false);
  const [connEditing, setConnEditing] = useState(null);
  const [copied, setCopied] = useState(false);

  const chargerId = charger?.id || charger?.charger_id || charger?.uuid;
  const shown = fresh || charger;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!chargerId) return;
      setRefreshing(true);
      const meta = await fetchChargerMeta(chargerId);
      if (cancelled) return;
      if (meta.data) setFresh(meta.data);
      setFreshVersion(meta.version);
      setRefreshing(false);
    })();
    return () => { cancelled = true; };
  }, [chargerId]);

  useEffect(() => {
    setTab("overview");
    setHistory(null); setAvail(null); setConnectors(null);
    setErrorH(null); setErrorA(null); setErrorC(null);
    setEditErr(null); setEditLabel(null); setEditFailures(null);
    setMaintErr(null); setMaintOk(null); setMaintLabel(null);
    setActionErr(null); setActionReason("");

    const c = shown || {};
    setEdit({
      asset_tag: c.asset_tag || "",
      serial_number: c.serial_number || "",
      manufacturer: c.manufacturer || "",
      model: c.model || "",
      rated_power_w: c.rated_power_w != null ? String(c.rated_power_w) : "",
      protocol_family: c.protocol_family || "OCPP",
      protocol_version: c.protocol_version || "1.6J",
      hal_identity: c.hal_identity || "",
      notes: c.notes || "",
    });
    setMaint({ start_at: "", end_at: "", reason: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  const loadHistory = useCallback(async () => {
    if (!chargerId) return;
    setLoadingH(true); setErrorH(null);
    try {
      const res = await apiRequest(`/api/v1/admin/chargers/${chargerId}/history`);
      setHistory(extractHistory(res));
    } catch (err) { setErrorH(err.message); }
    finally { setLoadingH(false); }
  }, [chargerId]);

  const loadAvailability = useCallback(async () => {
    if (!chargerId) return;
    setLoadingA(true); setErrorA(null);
    try {
      const res = await apiRequest(`/api/v1/admin/chargers/${chargerId}/availability`);
      setAvail(extractAvailability(res));
    } catch (err) { setErrorA(err.message); }
    finally { setLoadingA(false); }
  }, [chargerId]);

  const loadConnectors = useCallback(async () => {
    if (!chargerId) return;
    setLoadingC(true); setErrorC(null);
    try {
      const res = await apiRequest(`/api/v1/admin/chargers/${chargerId}/connectors`);
      setConnectors(extractConnectors(res));
    } catch (err) { setErrorC(err.message); }
    finally { setLoadingC(false); }
  }, [chargerId]);

  useEffect(() => {
    if (tab === "history" && history === null) loadHistory();
    if (tab === "availability" && avail === null) loadAvailability();
    if (tab === "connectors" && connectors === null) loadConnectors();
  }, [tab, history, avail, connectors, loadHistory, loadAvailability, loadConnectors]);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!chargerId) return;
    setEditBusy(true); setEditErr(null); setEditLabel(null); setEditFailures(null);
    try {
      const c = shown || {};
      const changed = {};
      const trim = (s) => (typeof s === "string" ? s.trim() : s);
      const diff = (n, o) => trim(n) !== trim(o ?? "");

      if (diff(edit.asset_tag, c.asset_tag))             changed.asset_tag = edit.asset_tag.trim();
      if (diff(edit.serial_number, c.serial_number))     changed.serial_number = edit.serial_number.trim();
      if (diff(edit.manufacturer, c.manufacturer))       changed.manufacturer = edit.manufacturer.trim();
      if (diff(edit.model, c.model))                     changed.model = edit.model.trim();
      if (diff(edit.rated_power_w, c.rated_power_w))     changed.rated_power_w = edit.rated_power_w;
      if (diff(edit.protocol_family, c.protocol_family)) changed.protocol_family = edit.protocol_family;
      if (diff(edit.protocol_version, c.protocol_version)) changed.protocol_version = edit.protocol_version;
      if (diff(edit.hal_identity, c.hal_identity))       changed.hal_identity = edit.hal_identity.trim();
      if (diff(edit.notes, c.notes))                     changed.notes = edit.notes.trim();

      if (Object.keys(changed).length === 0) {
        setEditErr("No changes to save.");
        setEditBusy(false);
        return;
      }

      const { usedLabel } = await updateChargerMultiShape(chargerId, changed, c);
      setEditLabel(usedLabel);
      onRefresh?.();
      setTimeout(() => { setEditBusy(false); onClose(); }, 1200);
    } catch (err) {
      console.error("[edit-charger] error:", err);
      if (err.failures) setEditFailures(err.failures);
      if (err.isSessionExpired) setEditErr(err.message);
      else if (err.status === 428) setEditErr("Version changed — refresh and retry.");
      else if (err.status === 412) setEditErr("Version conflict — see details.");
      else if (err.status === 409) setEditErr("Version conflict — see details.");
      else if (err.code === "VALIDATION_FAILED") setEditErr(err.message);
      else setEditErr(err.message || "Failed to update charger.");
      setEditBusy(false);
    }
  };

  const handleDeactivate = async () => {
    if (!chargerId) return;
    setActionBusy(true); setActionErr(null);
    try {
      const trimmed = validateReason(actionReason, "deactivate");
      if (!window.confirm(`Deactivate this charger?\n\nReason: ${trimmed}`)) { setActionBusy(false); return; }
      await deactivateCharger(chargerId, trimmed);
      onRefresh?.(); onClose();
    } catch (err) {
      console.error("[deactivate] error:", err);
      if (err.status === 428) setActionErr("Server requires If-Match — please retry.");
      else if (err.status === 412) setActionErr("Version conflict — refresh and retry.");
      else if (err.status === 422) setActionErr(err.message || "Validation failed — check the reason (min 8 chars).");
      else setActionErr(err.message || "Failed to deactivate.");
    } finally { setActionBusy(false); }
  };

  const handleReactivate = async () => {
    if (!chargerId) return;
    setActionBusy(true); setActionErr(null);
    try {
      const trimmed = validateReason(actionReason, "reactivate");
      if (!window.confirm(`Reactivate this charger?\n\nReason: ${trimmed}`)) { setActionBusy(false); return; }
      await reactivateCharger(chargerId, trimmed);
      onRefresh?.(); onClose();
    } catch (err) {
      console.error("[reactivate] error:", err);
      if (err.status === 428) setActionErr("Server requires If-Match — please retry.");
      else if (err.status === 412) setActionErr("Version conflict — refresh and retry.");
      else if (err.status === 422) setActionErr(err.message || "Validation failed — check the reason (min 8 chars).");
      else setActionErr(err.message || "Failed to reactivate.");
    } finally { setActionBusy(false); }
  };

  const handleMaintenance = async (e) => {
    e.preventDefault();
    if (!chargerId) return;
    if (!maint.start_at || !maint.end_at) return setMaintErr("Start and end time are required.");
    if (new Date(maint.end_at) <= new Date(maint.start_at))
      return setMaintErr("End time must be after start time.");
    if (String(maint.reason || "").trim().length < REASON_MIN_LENGTH)
      return setMaintErr(`Reason must be at least ${REASON_MIN_LENGTH} characters.`);

    setMaintBusy(true); setMaintErr(null); setMaintOk(null); setMaintLabel(null);
    try {
      const { usedLabel } = await recordMaintenanceMultiShape(chargerId, maint);
      setMaintLabel(usedLabel);
      setMaintOk("✅ Maintenance window recorded.");
      setMaint({ start_at: "", end_at: "", reason: "" });
      onRefresh?.();
    } catch (err) {
      console.error("[maintenance] error:", err);
      if (err.code === "VALIDATION_FAILED") setMaintErr(err.message);
      else if (err.status === 409) setMaintErr("Overlaps with an existing maintenance window.");
      else if (err.status === 422) setMaintErr(err.message || "Validation failed.");
      else setMaintErr(err.message || "Failed to record maintenance.");
    } finally { setMaintBusy(false); }
  };

  const copyFailures = async () => {
    if (!editFailures) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(editFailures, null, 2));
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (!shown) return null;

  const normStatus = normalizeStatus(shown);
  const style = statusStyle(normStatus);
  const displayTitle = shown.asset_tag || shown.serial_number || shown.name || "Charger";
  const displaySub   = shown.serial_number || shown.asset_tag || chargerId;
  const isInactive   = normStatus === "inactive";
  const shownVersion = freshVersion ?? shown.version;
  const reasonTrimmed = actionReason.trim();
  const reasonValid = reasonTrimmed.length >= REASON_MIN_LENGTH;
  const reasonRemaining = Math.max(0, REASON_MIN_LENGTH - reasonTrimmed.length);

  const maintReasonTrimmed = String(maint.reason || "").trim();
  const maintReasonValid = maintReasonTrimmed.length >= REASON_MIN_LENGTH;

  const tabs = [
    { id: "overview",     label: "Overview",     icon: FaInfoCircle },
    { id: "connectors",   label: "Connectors",   icon: FaPlug },
    { id: "history",      label: "History",      icon: FaHistory },
    { id: "availability", label: "Availability", icon: FaCalendarCheck },
    { id: "maintenance",  label: "Maintenance",  icon: FaWrench },
    { id: "edit",         label: "Edit",         icon: FaEdit },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-[slideIn_0.25s_ease-out]">
        <div className={`relative bg-gradient-to-br ${style.bg} p-5 text-white shrink-0`}>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
            <FaTimes size={12} />
          </button>
          <div className="relative flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
              <FaBolt size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black tracking-tight truncate">{displayTitle}</h2>
              <p className="text-[11px] font-mono text-white/90 truncate mt-0.5">{displaySub}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {style.label}
                </span>
                {shown.protocol_family && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/30">
                    {shown.protocol_family}{shown.protocol_version ? ` ${shown.protocol_version}` : ""}
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
                  tab === id ? "border-amber-500 text-amber-600" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}>
                <Icon size={11} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 thin-scroll">
          {actionErr && <ErrorBox message={actionErr} />}

          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <DetailRow icon={FaMicrochip} label="Asset Tag"     value={shown.asset_tag} />
                <DetailRow icon={FaBolt}      label="Serial"        value={shown.serial_number} />
                <DetailRow icon={FaInfoCircle} label="Manufacturer" value={shown.manufacturer} />
                <DetailRow icon={FaInfoCircle} label="Model"        value={shown.model} />
                <DetailRow icon={FaBolt}      label="Rated Power"   value={shown.rated_power_w ? `${shown.rated_power_w} W` : null} />
                <DetailRow icon={FaInfoCircle} label="Protocol"     value={[shown.protocol_family, shown.protocol_version].filter(Boolean).join(" ") || null} />
                <DetailRow icon={FaMicrochip} label="HAL Identity"  value={shown.hal_identity} />
                <DetailRow icon={FaLock}      label="Version"       value={shownVersion} />
                <DetailRow icon={FaClock}     label="Created"       value={fmtDate(shown.created_at)} />
              </div>

              {shownVersion !== null && shownVersion !== undefined && (
                <div className="p-2 rounded-lg bg-violet-50 border border-violet-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-0.5">If-Match on next mutation</div>
                  <code className="text-[10px] font-mono text-violet-800 break-all">{ifMatchHeader(shownVersion)}</code>
                </div>
              )}

              {shown.notes && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Notes</h4>
                  <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 whitespace-pre-wrap">{shown.notes}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Actions</h4>
                <div className="mb-2">
                  <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    <span>Reason <span className="text-rose-500">*</span></span>
                    <span className={`font-mono text-[9px] normal-case tracking-normal ${
                      reasonValid ? "text-emerald-600" : reasonTrimmed.length ? "text-rose-500" : "text-slate-400"
                    }`}>{reasonTrimmed.length}/{REASON_MIN_LENGTH}</span>
                  </label>
                  <textarea value={actionReason} onChange={(e) => setActionReason(e.target.value)}
                    rows={2}
                    placeholder={isInactive ? "e.g. Repairs complete — back online" : "e.g. Routine safety inspection"}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-200 resize-none"
                    disabled={actionBusy} minLength={REASON_MIN_LENGTH} />
                  {reasonTrimmed.length > 0 && !reasonValid && (
                    <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                      <FaExclamationCircle size={9} /> Add {reasonRemaining} more character{reasonRemaining !== 1 ? "s" : ""} (min {REASON_MIN_LENGTH}).
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {isInactive ? (
                    <button onClick={handleReactivate} disabled={actionBusy || !reasonValid}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/30 disabled:opacity-50">
                      {actionBusy ? <FaSpinner className="animate-spin" size={11} /> : <FaPlayCircle size={11} />} Reactivate
                    </button>
                  ) : (
                    <button onClick={handleDeactivate} disabled={actionBusy || !reasonValid}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/30 disabled:opacity-50">
                      {actionBusy ? <FaSpinner className="animate-spin" size={11} /> : <FaPowerOff size={11} />} Deactivate
                    </button>
                  )}
                  <button onClick={() => setTab("maintenance")}
                    className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition">
                    <FaWrench size={11} /> Maintenance
                  </button>
                </div>
                {!reasonValid && (
                  <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                    <FaCommentDots size={9} /> Enter a valid reason (min {REASON_MIN_LENGTH} chars) to enable.
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === "connectors" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Charger Connectors</h4>
                <div className="flex items-center gap-2">
                  <button onClick={loadConnectors} className="text-[10px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1">
                    <FaSyncAlt size={9} /> Refresh
                  </button>
                  <button onClick={() => { setConnEditing(null); setConnModalOpen(true); }}
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
                    <FaPlus size={8} /> Add
                  </button>
                </div>
              </div>
              {loadingC && <Spinner label="Loading connectors…" />}
              {errorC && <ErrorBox message={errorC} />}
              {!loadingC && !errorC && (!connectors || connectors.length === 0) && (
                <div className="p-6 rounded-xl bg-violet-50 border border-dashed border-violet-300 text-center">
                  <FaPlug className="text-violet-400 mx-auto mb-2" size={20} />
                  <p className="text-xs text-violet-700 font-bold">No connectors yet</p>
                  <p className="text-[10px] text-violet-600 mt-1">Add the first connector to expose this charger's ports.</p>
                  <button onClick={() => { setConnEditing(null); setConnModalOpen(true); }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold flex items-center gap-1 mx-auto">
                    <FaPlus size={9} /> Add connector
                  </button>
                </div>
              )}
              {!loadingC && !errorC && connectors && connectors.length > 0 && (
                <div className="space-y-2">
                  {connectors.map((cn, i) => {
                    const cid = cn.id || cn.connector_id || i;
                    return (
                      <div key={cid} className="group flex items-center justify-between gap-2 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 hover:border-violet-300 hover:shadow-sm transition">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                            <FaPlug className="text-white" size={13} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-violet-900 truncate">
                              #{cn.connector_number ?? i + 1} · {cn.connector_type || "Connector"}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {cn.max_power_w != null && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 border border-violet-200">
                                  {cn.max_power_w} W
                                </span>
                              )}
                              {cn.supports_ac && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">AC</span>
                              )}
                              {cn.supports_dc && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 border border-sky-200">DC</span>
                              )}
                              {cn.is_active === false && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">Inactive</span>
                              )}
                              {cn.version != null && (
                                <span className="text-[9px] font-mono text-violet-500">v{cn.version}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => { setConnEditing(cn); setConnModalOpen(true); }}
                          className="text-[10px] font-bold uppercase tracking-wider text-violet-600 hover:text-violet-800 flex items-center gap-1">
                          <FaEdit size={9} /> Edit
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "history" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Append-only history</h4>
                <button onClick={loadHistory} className="text-[10px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1">
                  <FaSyncAlt size={9} /> Refresh
                </button>
              </div>
              {loadingH && <Spinner label="Loading history…" />}
              {errorH && <ErrorBox message={errorH} />}
              {!loadingH && !errorH && (!history || history.length === 0) && (
                <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">No history yet.</p>
              )}
              {!loadingH && !errorH && history && history.length > 0 && (
                <ol className="relative border-l-2 border-slate-200 ml-2 space-y-3">
                  {history.map((h, i) => (
                    <li key={i} className="ml-4">
                      <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">{h.event_type || h.type || h.action || "Event"}</span>
                          <span className="text-[10px] text-slate-500">{fmtDate(h.created_at || h.timestamp || h.at)}</span>
                        </div>
                        {h.actor && <p className="text-[10px] text-slate-600 mt-0.5">By: {h.actor}</p>}
                        {h.message && <p className="text-[11px] text-slate-700 mt-1">{h.message}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {tab === "availability" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inventory availability</h4>
                <button onClick={loadAvailability} className="text-[10px] font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1">
                  <FaSyncAlt size={9} /> Refresh
                </button>
              </div>
              {loadingA && <Spinner label="Loading availability…" />}
              {errorA && <ErrorBox message={errorA} />}
              {!loadingA && !errorA && avail && (
                <pre className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-x-auto font-mono whitespace-pre-wrap thin-scroll">
                  {JSON.stringify(avail, null, 2)}
                </pre>
              )}
              {!loadingA && !errorA && !avail && (
                <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">No availability data.</p>
              )}
            </div>
          )}

          {tab === "maintenance" && (
            <form onSubmit={handleMaintenance} className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                <FaInfoCircle className="text-amber-600 shrink-0 mt-0.5" size={13} />
                <span className="text-amber-800 text-[11px]">
                  Body: <code className="font-mono bg-amber-100 px-1 rounded text-[10px]">starts_at / ends_at / reason</code>.
                  Reason must be at least {REASON_MIN_LENGTH} characters.
                </span>
              </div>
              {maintErr && <ErrorBox message={maintErr} />}
              {maintOk && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                  <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
                  <div>
                    <p className="text-emerald-700 text-xs">{maintOk}</p>
                    {maintLabel && (
                      <p className="text-emerald-600 text-[10px] mt-0.5">
                        Accepted shape: <code className="font-mono bg-emerald-100 px-1 rounded">{maintLabel}</code>
                      </p>
                    )}
                  </div>
                </div>
              )}
              <Field label="Start" required>
                <input type="datetime-local" value={maint.start_at}
                  onChange={(e) => setMaint({ ...maint, start_at: e.target.value })}
                  className={inputCls} disabled={maintBusy} />
              </Field>
              <Field label="End" required>
                <input type="datetime-local" value={maint.end_at}
                  onChange={(e) => setMaint({ ...maint, end_at: e.target.value })}
                  className={inputCls} disabled={maintBusy} />
              </Field>
              <Field label="Reason" required hint={`Minimum ${REASON_MIN_LENGTH} characters`}>
                <textarea value={maint.reason}
                  onChange={(e) => setMaint({ ...maint, reason: e.target.value })}
                  rows={2} placeholder="e.g. Firmware update and reboot"
                  className={inputCls + " resize-none"} disabled={maintBusy} />
                <div className="flex justify-end mt-1">
                  <span className={`text-[10px] font-mono ${maintReasonValid ? "text-emerald-600" : "text-rose-500"}`}>
                    {maintReasonTrimmed.length}/{REASON_MIN_LENGTH}
                  </span>
                </div>
              </Field>
              <button type="submit" disabled={maintBusy || !maintReasonValid}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/30 disabled:opacity-60">
                {maintBusy ? <><FaSpinner className="animate-spin" size={13} /> Recording…</> : <><FaWrench size={12} /> Record Maintenance</>}
              </button>
            </form>
          )}

          {tab === "edit" && edit && (
            <form onSubmit={handleSaveEdit} className="space-y-3">
              {editErr && <ErrorBox message={editErr} />}
              {editLabel && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                  <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
                  <div>
                    <p className="text-emerald-800 text-xs font-bold">✅ Charger updated!</p>
                    <p className="text-emerald-700 text-[10px] mt-0.5">
                      Accepted PATCH shape: <code className="font-mono bg-emerald-100 px-1 rounded">{editLabel}</code>
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Asset Tag"><input value={edit.asset_tag} onChange={(e) => setEdit({ ...edit, asset_tag: e.target.value })} className={inputCls + " font-mono"} disabled={editBusy} /></Field>
                <Field label="Serial Number"><input value={edit.serial_number} onChange={(e) => setEdit({ ...edit, serial_number: e.target.value })} className={inputCls + " font-mono"} disabled={editBusy} /></Field>
                <Field label="Manufacturer"><input value={edit.manufacturer} onChange={(e) => setEdit({ ...edit, manufacturer: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
                <Field label="Model"><input value={edit.model} onChange={(e) => setEdit({ ...edit, model: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
                <Field label="Rated Power (W)"><input type="number" min="1" value={edit.rated_power_w} onChange={(e) => setEdit({ ...edit, rated_power_w: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
                <Field label="Protocol Family">
                  <select value={edit.protocol_family} onChange={(e) => setEdit({ ...edit, protocol_family: e.target.value })} className={inputCls} disabled={editBusy}>
                    {PROTOCOL_FAMILIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Protocol Version">
                  <input list="protocol-versions-edit" value={edit.protocol_version} onChange={(e) => setEdit({ ...edit, protocol_version: e.target.value })} className={inputCls} disabled={editBusy} />
                  <datalist id="protocol-versions-edit">
                    {PROTOCOL_VERSIONS.map((v) => <option key={v} value={v} />)}
                  </datalist>
                </Field>
                <Field label="HAL Identity"><input value={edit.hal_identity} onChange={(e) => setEdit({ ...edit, hal_identity: e.target.value })} className={inputCls + " font-mono"} disabled={editBusy} /></Field>
                <div className="sm:col-span-2">
                  <Field label="Notes">
                    <textarea value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} rows={3} className={inputCls + " resize-none"} disabled={editBusy} />
                  </Field>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-3.5">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-300/30 rounded-full blur-3xl" />
                <div className="relative flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-xl bg-amber-400/40 blur-md" />
                    <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/40">
                      <FaLock className="text-white" size={12} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                        Optimistic Update
                      </span>
                    </div>
                    <p className="text-[10.5px] text-amber-800 leading-relaxed">
                      Sends <code className="font-mono bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md border border-amber-200 text-[10px]">If-Match: "{String(shownVersion ?? "")}"</code>{" "}
                      + <code className="font-mono bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md border border-amber-200 text-[10px]">Idempotency-Key</code>.
                      Version lives in the header only.
                    </p>
                  </div>
                </div>
              </div>

              {editFailures && editFailures.length > 0 && (
                <details className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 overflow-hidden" open>
                  <summary className="flex items-center justify-between gap-2 px-3.5 py-2.5 cursor-pointer hover:bg-rose-100/50 transition">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-sm">
                        <FaExclamationCircle className="text-white" size={10} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-rose-900">
                        {editFailures.length} attempt{editFailures.length > 1 ? "s" : ""} failed
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">DEBUG</span>
                  </summary>
                  <div className="px-3.5 pb-3 space-y-1.5 max-h-56 overflow-y-auto thin-scroll">
                    {editFailures.map((f, i) => (
                      <div key={i} className="rounded-lg bg-white border border-rose-200 p-2 text-[10px] font-mono">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-black text-rose-700">#{f.attempt}</span>
                          <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${
                            f.status === 412 || f.status === 428
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}>{f.status || "??"} {f.code}</span>
                        </div>
                        <div className="text-rose-800"><span className="text-rose-500">body:</span> {f.body}</div>
                        <div className="text-rose-800"><span className="text-rose-500">ifMatch:</span> <code className="break-all">{f.ifMatch}</code></div>
                        {f.message && <div className="text-rose-600 mt-0.5 break-words">{f.message}</div>}
                      </div>
                    ))}
                    <button type="button" onClick={copyFailures}
                      className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                      {copied ? <><FaCheckCircle size={9} /> Copied!</> : <><FaCopy size={9} /> Copy all failures</>}
                    </button>
                  </div>
                </details>
              )}

              {shownVersion !== null && shownVersion !== undefined && (
                <p className="text-[10px] text-slate-500">Current version: {String(shownVersion)}</p>
              )}

              <button type="submit" disabled={editBusy}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/30 disabled:opacity-60">
                {editBusy ? <><FaSpinner className="animate-spin" size={13} /> Saving…</> : <><FaCheckCircle size={12} /> Save Changes</>}
              </button>
            </form>
          )}
        </div>
      </div>

      <ConnectorModal
        open={connModalOpen}
        chargerId={chargerId}
        connector={connEditing}
        onClose={() => { setConnModalOpen(false); setConnEditing(null); }}
        onSuccess={() => { setConnectors(null); loadConnectors(); }}
      />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(30px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        /* ✅ Ultra-thin scrollbars */
        .thin-scroll::-webkit-scrollbar { width: 2px; height: 2px; }
        .thin-scroll::-webkit-scrollbar-track { background: transparent; }
        .thin-scroll::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.25); border-radius: 2px; }
        .thin-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.45); }
        .thin-scroll { scrollbar-width: thin; scrollbar-color: rgba(100,116,139,0.25) transparent; }
      `}</style>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
        <Icon size={9} /> {label}
      </div>
      <div className="text-xs font-semibold text-slate-900 truncate">
        {value === null || value === undefined || value === "" ? "—" : String(value)}
      </div>
    </div>
  );
}

/* ==================== MAIN PAGE ==================== */
export default function Chargers() {
  const navigate = useNavigate();
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    const id = "chargers-google-fonts";
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
      const res = await apiRequest("/api/v1/admin/chargers");
      setChargers(extractChargers(res));
    } catch (err) {
      if (err.isSessionExpired) { setSessionExpired(true); setChargers([]); }
      else { setError(err.message); setChargers([]); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = chargers.filter((c) => {
    const q = search.toLowerCase().trim();
    const hay = [c.asset_tag, c.serial_number, c.manufacturer, c.model,
                 c.protocol_family, c.protocol_version, c.hal_identity]
      .filter(Boolean).join(" ").toLowerCase();
    const matchesSearch = !q || hay.includes(q);
    const norm = normalizeStatus(c);
    const matchesStatus = statusFilter === "all" || norm === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = chargers.reduce((acc, c) => {
    acc.total++;
    const norm = normalizeStatus(c);
    if (norm === "maintenance") acc.maintenance++;
    else if (norm === "inactive") acc.inactive++;
    else acc.active++;
    return acc;
  }, { total: 0, active: 0, maintenance: 0, inactive: 0 });

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50/40 px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <FaExclamationCircle className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Session expired</h2>
          <p className="text-sm text-slate-600 mt-2">Please sign in again to continue.</p>
          <button onClick={() => { clearSession(); navigate("/login", { replace: true }); }}
            className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/30">
            <FaSignInAlt size={12} /> Sign in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50/40 px-4 py-8 chargers-page">
      <style>{`
        .chargers-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .chargers-page h1, .chargers-page h2, .chargers-page h3 {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          letter-spacing: -0.025em;
        }
        .chargers-page .font-mono, .chargers-page code {
          font-family: 'JetBrains Mono', 'SF Mono', Menlo, Monaco, 'Courier New', monospace;
        }
        .thin-scroll::-webkit-scrollbar { width: 2px; height: 2px; }
        .thin-scroll::-webkit-scrollbar-track { background: transparent; }
        .thin-scroll::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.25); border-radius: 2px; }
        .thin-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.45); }
        .thin-scroll { scrollbar-width: thin; scrollbar-color: rgba(100,116,139,0.25) transparent; }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 p-7 sm:p-8 shadow-xl shadow-amber-500/20">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                <FaBolt size={9} /> Charging Network
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <FaBolt size={26} /> Chargers
              </h1>
              <p className="text-amber-50/90 text-sm mt-1.5 max-w-xl">
                Register chargers, manage connectors, and monitor availability across your network.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={load}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 transition"
                title="Refresh">
                <FaSyncAlt size={13} />
              </button>
              <button onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white text-amber-700 hover:bg-amber-50 font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <FaPlus size={13} /> Add Charger
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={FaBolt}         label="Total"       value={stats.total}       gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
          <StatCard icon={FaCheckCircle}  label="Active"      value={stats.active}      gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
          <StatCard icon={FaWrench}       label="Maintenance" value={stats.maintenance} gradient="bg-gradient-to-br from-amber-600 to-orange-700" />
          <StatCard icon={FaPowerOff}     label="Inactive"    value={stats.inactive}    gradient="bg-gradient-to-br from-slate-500 to-slate-700" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by asset tag, serial, manufacturer, model…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-200" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="maintenance">In maintenance</option>
              <option value="inactive">Inactive</option>
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

        {loading ? (
          <Spinner label="Loading chargers…" />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
              <FaBolt className="text-amber-400" size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {chargers.length === 0 ? "No chargers yet" : "No matches"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {chargers.length === 0
                ? "Register your first charger to start managing your network."
                : "Try adjusting your search or status filter."}
            </p>
            {chargers.length === 0 && (
              <button onClick={() => setCreateOpen(true)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-amber-500/30">
                <FaPlus size={11} /> Add your first charger
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((c) => {
              const id = c.id || c.charger_id || c.uuid;
              const norm = normalizeStatus(c);
              const style = statusStyle(norm);
              const title = c.asset_tag || c.serial_number || c.name || "Unnamed charger";
              const sub = c.serial_number || c.asset_tag || id;

              return (
                <div key={id} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className={`h-1.5 bg-gradient-to-r ${style.bg}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center shadow-sm shrink-0`}>
                            <FaBolt className="text-white" size={14} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-black text-slate-900 truncate">{title}</h3>
                            <p className="text-[11px] font-mono text-slate-500 truncate">{sub}</p>
                          </div>
                        </div>
                      </div>
                      <StatusBadge status={norm} />
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(c.manufacturer || c.model) && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                          {[c.manufacturer, c.model].filter(Boolean).join(" ")}
                        </span>
                      )}
                      {c.protocol_family && (
                        <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider border border-sky-200">
                          {c.protocol_family}{c.protocol_version ? ` ${c.protocol_version}` : ""}
                        </span>
                      )}
                      {c.rated_power_w && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                          {c.rated_power_w} W
                        </span>
                      )}
                      {c.hal_identity && (
                        <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider border border-violet-200 font-mono">
                          {c.hal_identity}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                      <button onClick={() => setSelected(c)}
                        className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                        <FaEye size={10} /> Details
                      </button>
                      <button onClick={() => setSelected(c)}
                        className="flex-1 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                        <FaPlug size={10} /> Connectors
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateChargerModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(usedLabel) => {
          load();
          if (usedLabel && usedLabel !== "as-entered") {
            showToast(`Charger created using fallback shape: ${usedLabel}.`, "emerald");
          } else {
            showToast("Charger registered successfully.", "emerald");
          }
        }}
      />

      {selected && (
        <DetailDrawer charger={selected} onClose={() => setSelected(null)} onRefresh={load} />
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