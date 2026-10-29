// // src/components/Admin/Vehicles.jsx
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaTruck, FaPlus, FaSearch, FaSyncAlt, FaCheckCircle, FaExclamationCircle,
//   FaSpinner, FaTimes, FaEye, FaEdit, FaHistory, FaCalendarCheck,
//   FaPowerOff, FaPlayCircle, FaWrench, FaInfoCircle, FaClock, FaCar,
//   FaClipboard, FaTag, FaSignInAlt, FaLock, FaCommentDots,
// } from "react-icons/fa";

// /* ==================== INLINE API LAYER ==================== */
// const BASE_URL    = "https://dev-evcowbbe.transev.site";
// const ACCESS_KEY  = "access_token";
// const REFRESH_KEY = "refresh_token";
// const USER_KEY    = "admin_user";

// function getAccessToken()  { return localStorage.getItem(ACCESS_KEY); }
// function getRefreshToken() { return localStorage.getItem(REFRESH_KEY); }
// function clearSession() {
//   localStorage.removeItem(ACCESS_KEY);
//   localStorage.removeItem(REFRESH_KEY);
//   localStorage.removeItem(USER_KEY);
// }

// function uuid() {
//   if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

// /* If-Match from version integer → '"3"' */
// function ifMatchHeader(version) {
//   if (version === null || version === undefined || version === "") return null;
//   return `"${String(version)}"`;
// }

// const AUTH_BYPASS = ["/auth/login", "/auth/verify-otp", "/auth/refresh", "/auth/2fa/resend", "/auth/password/change"];
// function isAuthEndpoint(path) { return AUTH_BYPASS.some((p) => path.includes(p)); }

// class SessionExpiredError extends Error {
//   constructor() {
//     super("Session expired. Please sign in again.");
//     this.code = "SESSION_EXPIRED";
//     this.isSessionExpired = true;
//   }
// }

// let refreshInFlight = null;
// async function tryRefreshToken() {
//   if (refreshInFlight) return refreshInFlight;
//   refreshInFlight = (async () => {
//     const refreshTok = getRefreshToken();
//     if (!refreshTok) return false;
//     try {
//       const res = await fetch(`${BASE_URL}/api/v1/admin/auth/refresh`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Accept: "application/json" },
//         body: JSON.stringify({ refresh_token: refreshTok }),
//       });
//       if (!res.ok) return false;
//       const ct = res.headers.get("content-type") || "";
//       let data = null;
//       if (ct.includes("application/json")) { try { data = await res.json(); } catch { data = null; } }
//       const payload = data?.data || data || {};
//       const newAccess  = payload.access_token  || payload.accessToken;
//       const newRefresh = payload.refresh_token || payload.refreshToken;
//       if (!newAccess) return false;
//       localStorage.setItem(ACCESS_KEY, newAccess);
//       if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);
//       console.log("%c[auth] ✅ access token refreshed", "color:#10b981;font-weight:bold");
//       return true;
//     } catch { return false; }
//     finally { refreshInFlight = null; }
//   })();
//   return refreshInFlight;
// }

// async function apiRequest(path, { method = "GET", body, auth = true, extraHeaders = {}, returnResponse = false } = {}) {
//   const attempt = async () => {
//     const headers = { "Content-Type": "application/json", Accept: "application/json", ...extraHeaders };
//     if (auth) {
//       const t = getAccessToken();
//       if (t) headers.Authorization = `Bearer ${t}`;
//     }
//     console.log(
//       "%c[VEHICLES →] " + method + " " + path,
//       "color:#0ea5e9;font-weight:bold",
//       "\n  headers:", extraHeaders,
//       "\n  body:", body !== undefined ? JSON.stringify(body) : "(none)"
//     );
//     const controller = new AbortController();
//     const timer = setTimeout(() => controller.abort(), 30000);
//     let res;
//     try {
//       res = await fetch(`${BASE_URL}${path}`, {
//         method, headers,
//         body: body !== undefined ? JSON.stringify(body) : undefined,
//         signal: controller.signal,
//       });
//     } catch {
//       clearTimeout(timer);
//       const e = new Error("Network error — cannot reach Vehicles API.");
//       e.isNetworkError = true;
//       throw e;
//     } finally { clearTimeout(timer); }

//     const ct = res.headers.get("content-type") || "";
//     let data = null;
//     if (ct.includes("application/json")) { try { data = await res.json(); } catch { data = null; } }
//     else { try { data = await res.text(); } catch { data = null; } }
//     if (
//       data && typeof data === "object" && !Array.isArray(data) &&
//       "data" in data && !("error" in data) &&
//       Object.keys(data).length <= 2
//     ) data = data.data;
//     return { res, data };
//   };

//   let { res, data } = await attempt();

//   if (res.status === 401 && auth && !isAuthEndpoint(path)) {
//     const refreshed = await tryRefreshToken();
//     if (refreshed) {
//       ({ res, data } = await attempt());
//       if (res.ok) return returnResponse ? { data, headers: res.headers, status: res.status } : data;
//       if (res.status === 401) { clearSession(); throw new SessionExpiredError(); }
//     } else { clearSession(); throw new SessionExpiredError(); }
//   }

//   if (!res.ok) {
//     const msg =
//       (data && (data.message || data.error?.message ||
//         (typeof data.error === "string" ? data.error : null) || data.detail)) ||
//       `Request failed (${res.status})`;
//     const e = new Error(msg);
//     e.status  = res.status;
//     e.code    = data?.error?.code || data?.code;
//     e.details = data?.error?.details;
//     e.body    = data;
//     e.headers = res.headers;
//     throw e;
//   }
//   return returnResponse ? { data, headers: res.headers, status: res.status } : data;
// }

// /* ==================== HELPERS ==================== */
// function toArray(v) { return Array.isArray(v) ? v : v ? [v] : []; }

// function extractVehicles(res) {
//   if (!res) return [];
//   if (Array.isArray(res)) return res;
//   return toArray(res.vehicles || res.items || res.data?.vehicles || res.data?.items || res.data || []);
// }
// function extractHistory(res) {
//   if (!res) return [];
//   if (Array.isArray(res)) return res;
//   return toArray(res.history || res.events || res.items || res.data?.history || res.data?.events || res.data || []);
// }
// function extractAvailability(res) {
//   if (!res) return null;
//   return res.availability || res.data?.availability || res.data || res;
// }
// function extractVersion(res) {
//   if (!res) return null;
//   return res.version ?? res.data?.version ?? null;
// }

// function vehicleStatus(v) {
//   if (!v) return "unknown";
//   const s = (v.status || v.state || v.lifecycle_status || "").toLowerCase();
//   if (s) return s;
//   if (v.is_active === false || v.deactivated) return "inactive";
//   if (v.in_maintenance || v.maintenance)      return "maintenance";
//   return "active";
// }
// function statusStyle(status) {
//   const s = (status || "").toLowerCase();
//   if (s.includes("mainten"))
//     return { bg: "from-amber-400 to-orange-500", chip: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500", label: "In Maintenance" };
//   if (s.includes("deactiv") || s.includes("inactive") || s.includes("offline"))
//     return { bg: "from-slate-400 to-slate-600", chip: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-500", label: "Inactive" };
//   return { bg: "from-emerald-400 to-teal-500", chip: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500", label: "Active" };
// }
// function fmtDate(d) {
//   if (!d) return "—";
//   try { const dt = new Date(d); if (isNaN(dt.getTime())) return String(d);
//     return dt.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
//   } catch { return String(d); }
// }
// function fmtDateOnly(d) {
//   if (!d) return "—";
//   try { const dt = new Date(d); if (isNaN(dt.getTime())) return String(d);
//     return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
//   } catch { return String(d); }
// }
// function toIsoUtc(localValue) {
//   if (!localValue) return localValue;
//   try { const d = new Date(localValue); if (isNaN(d.getTime())) return localValue; return d.toISOString(); }
//   catch { return localValue; }
// }
// function toLocalIso(localValue) {
//   if (!localValue) return localValue;
//   if (/T\d{2}:\d{2}$/.test(localValue)) return localValue + ":00";
//   return localValue;
// }
// function dateOnly(d) {
//   if (!d) return undefined;
//   try {
//     const dt = new Date(d);
//     if (isNaN(dt.getTime())) return String(d).slice(0, 10);
//     return dt.toISOString().slice(0, 10);
//   } catch { return undefined; }
// }

// /* ==================== BODY BUILDERS ==================== */
// function buildVehicleBody(fields, { includeEmpty = false } = {}) {
//   const body = {};
//   const trim = (v) => (typeof v === "string" ? v.trim() : v);
//   const setIf = (k, val) => {
//     const v = trim(val);
//     if (includeEmpty) { body[k] = v ?? ""; return; }
//     if (v !== undefined && v !== null && v !== "") body[k] = v;
//   };
//   setIf("asset_tag", fields.asset_tag);
//   setIf("registration_number", fields.registration_number);
//   setIf("make", fields.make);
//   setIf("model", fields.model);
//   setIf("variant", fields.variant);
//   setIf("vehicle_type", fields.vehicle_type);
//   setIf("ownership_type", fields.ownership_type);
//   setIf("registration_valid_until", dateOnly(fields.registration_valid_until));
//   setIf("insurance_valid_until", dateOnly(fields.insurance_valid_until));
//   setIf("inspection_status", fields.inspection_status);
//   setIf("notes", fields.notes);
//   return body;
// }

// /* Full 11-field body from a vehicle object (used for "send all" PATCH shape) */
// function buildFullBodyFromVehicle(v) {
//   return {
//     asset_tag: v.asset_tag || undefined,
//     registration_number: v.registration_number || undefined,
//     make: v.make || undefined,
//     model: v.model || undefined,
//     variant: v.variant || undefined,
//     vehicle_type: v.vehicle_type || undefined,
//     ownership_type: v.ownership_type || undefined,
//     registration_valid_until: dateOnly(v.registration_valid_until),
//     insurance_valid_until: dateOnly(v.insurance_valid_until),
//     inspection_status: (v.inspection_status || "UNKNOWN").toUpperCase(),
//     notes: v.notes || undefined,
//   };
// }

// /* ==================== FETCH ETAG + VERSION ==================== */
// async function fetchVehicleMeta(vehicleId) {
//   try {
//     const { data, headers } = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}`, {
//       returnResponse: true,
//     });
//     const etagHeader = headers.get("ETag") || headers.get("etag");
//     const version    = extractVersion(data);
//     console.log(
//       "%c[fetch-vehicle] version:", "color:#8b5cf6;font-weight:bold",
//       version, "| ETag header:", etagHeader || "(none)"
//     );
//     return { data, etag: etagHeader, version };
//   } catch (err) {
//     console.warn("[fetch-vehicle] failed:", err?.message);
//     return { data: null, etag: null, version: null };
//   }
// }

// function pickIfMatch({ version, etag }) {
//   if (version !== null && version !== undefined) return ifMatchHeader(version);
//   if (etag) return etag;
//   return null;
// }

// /* ==================================================================
//  *  GENERIC MUTATION WRAPPER — fetch version → send with If-Match
//  * ================================================================== */
// async function mutationWithIfMatch(vehicleId, { method, path, body, maxRetries = 1 }) {
//   let { version, etag } = await fetchVehicleMeta(vehicleId);
//   let ifMatch = pickIfMatch({ version, etag });

//   const buildHeaders = () => {
//     const h = { "Idempotency-Key": uuid() };
//     if (ifMatch) h["If-Match"] = ifMatch;
//     return h;
//   };

//   const send = () => apiRequest(path, { method, body, extraHeaders: buildHeaders() });

//   try {
//     return await send();
//   } catch (err) {
//     const retryable = err.status === 412 || err.status === 428 || err.status === 409;
//     if (!retryable || maxRetries <= 0) throw err;

//     console.warn(`[mutation] ${err.status} — re-fetching version + retrying (${maxRetries} left)…`);
//     const fresh = await fetchVehicleMeta(vehicleId);
//     ifMatch = pickIfMatch(fresh);
//     return await send();
//   }
// }

// /* ==================== CREATE — multi-shape ==================== */
// async function createVehicleMultiShape(fields) {
//   const base = buildVehicleBody(fields);
//   const withUnknown = { ...base, inspection_status: "UNKNOWN" };
//   const withLowerEnums = {
//     ...withUnknown,
//     vehicle_type: withUnknown.vehicle_type ? String(withUnknown.vehicle_type).toLowerCase() : undefined,
//     ownership_type: withUnknown.ownership_type ? String(withUnknown.ownership_type).toLowerCase() : undefined,
//   };
//   const noVariant = { ...withUnknown };
//   delete noVariant.variant;
//   const minimalUnknown = {
//     asset_tag: base.asset_tag, registration_number: base.registration_number, inspection_status: "UNKNOWN",
//   };
//   const minimal = { asset_tag: base.asset_tag, registration_number: base.registration_number };
//   const chargingUnit = { ...withUnknown, vehicle_type: "CHARGING_UNIT" };

//   const attempts = [
//     { label: "as-entered",                    body: base },
//     { label: "inspection=UNKNOWN",            body: withUnknown },
//     { label: "UNKNOWN + lowercase enums",     body: withLowerEnums },
//     { label: "UNKNOWN + no variant",          body: noVariant },
//     { label: "minimal + UNKNOWN",             body: minimalUnknown },
//     { label: "minimal (2 fields)",            body: minimal },
//     { label: "UNKNOWN + type=CHARGING_UNIT",  body: chargingUnit },
//   ];

//   const failures = [];
//   for (const a of attempts) {
//     Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);
//     try {
//       console.log(`%c[create-vehicle] try: ${a.label}`, "color:#f59e0b;font-weight:bold", "\n  body:", JSON.stringify(a.body));
//       const res = await apiRequest("/api/v1/admin/vehicles", {
//         method: "POST", body: a.body,
//         extraHeaders: { "Idempotency-Key": uuid() },
//       });
//       console.log(`%c[create-vehicle] ✅ ACCEPTED: ${a.label}`, "color:#10b981;font-weight:bold;font-size:14px");
//       return { res, usedLabel: a.label };
//     } catch (err) {
//       if (err.code !== "VALIDATION_FAILED") throw err;
//       console.warn(`[create-vehicle] ✗ ${a.label}:`, err.code, err.message);
//       failures.push({ label: a.label, code: err.code, message: err.message });
//     }
//   }
//   const e = new Error(
//     `Server rejected all ${attempts.length} payload variations with VALIDATION_FAILED. ` +
//     "Open DevTools → Network → click POST /vehicles → copy Request Payload + Response."
//   );
//   e.code = "VALIDATION_FAILED";
//   e.failures = failures;
//   throw e;
// }

// /* ==================================================================
//  *  PATCH — multi-shape retry (matches Swagger exactly)
//  *  Every attempt: Idempotency-Key + If-Match: "<version>"
//  *  Only VALIDATION_FAILED (400/422) triggers retry.
//  * ================================================================== */
// async function updateVehicleMultiShape(vehicleId, changedFields, currentVehicle) {
//   // 1) Fetch fresh version + ETag first
//   const meta = await fetchVehicleMeta(vehicleId);
//   const version = meta.version ?? extractVersion(currentVehicle);
//   const etag    = meta.etag;
//   const ifMatch = pickIfMatch({ version, etag });

//   if (!ifMatch) {
//     throw new Error("Cannot update — backend did not return a version or ETag.");
//   }

//   // 2) Build payload variants
//   const changedBody = buildVehicleBody(changedFields);
//   const fullBody    = buildFullBodyFromVehicle(currentVehicle || {});
//   // apply changed fields on top of full body
//   Object.assign(fullBody, changedBody);
//   // fill any blanks that might still exist
//   if (!fullBody.inspection_status) fullBody.inspection_status = "UNKNOWN";
//   fullBody.inspection_status = String(fullBody.inspection_status).toUpperCase();

//   const withVersionNum = (obj) => ({ ...obj, version: Number(version) });
//   const withVersionStr = (obj) => ({ ...obj, version: String(version) });

//   const attempts = [
//     // 1) Only changed fields + version in body
//     { label: "changed + version(num)",        body: withVersionNum(changedBody) },
//     // 2) All 11 fields + version in body
//     { label: "all fields + version(num)",     body: withVersionNum(fullBody) },
//     // 3) Only changed fields, no version in body
//     { label: "changed only (header version)", body: { ...changedBody } },
//     // 4) All fields, no version in body
//     { label: "all fields (header version)",   body: { ...fullBody } },
//     // 5) Changed + version as string
//     { label: "changed + version(str)",        body: withVersionStr(changedBody) },
//     // 6) All fields + version as string
//     { label: "all fields + version(str)",     body: withVersionStr(fullBody) },
//   ];

//   const failures = [];
//   for (const a of attempts) {
//     // strip undefined
//     Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);

//     const headers = {
//       "Idempotency-Key": uuid(),
//       "If-Match": ifMatch,
//     };

//     try {
//       console.log(
//         `%c[update-vehicle] try: ${a.label}`,
//         "color:#f59e0b;font-weight:bold",
//         "\n  If-Match:", ifMatch,
//         "\n  body:", JSON.stringify(a.body)
//       );
//       const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}`, {
//         method: "PATCH",
//         body: a.body,
//         extraHeaders: headers,
//       });
//       console.log(
//         `%c[update-vehicle] ✅ ACCEPTED: ${a.label}`,
//         "color:#10b981;font-weight:bold;font-size:14px",
//         "\n  response:", res
//       );
//       return { res, usedLabel: a.label };
//     } catch (err) {
//       console.warn(`[update-vehicle] ✗ ${a.label}:`, err.status, err.code, err.message);
//       failures.push({ label: a.label, status: err.status, code: err.code, message: err.message });

//       // Retry only on schema validation failures
//       const retryable = err.code === "VALIDATION_FAILED" || err.status === 400 || err.status === 422;
//       if (!retryable) throw err;
//     }
//   }

//   // If If-Match became stale mid-flight, one final retry with fresh meta
//   try {
//     console.warn("[update-vehicle] all shapes failed — trying once more with fresh ETag…");
//     const fresh = await fetchVehicleMeta(vehicleId);
//     const retryIfMatch = pickIfMatch(fresh);
//     if (!retryIfMatch) throw new Error("No fresh ETag/version from server.");
//     const headers = { "Idempotency-Key": uuid(), "If-Match": retryIfMatch };
//     const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}`, {
//       method: "PATCH", body: withVersionNum(changedBody), extraHeaders: headers,
//     });
//     return { res, usedLabel: "changed + version(num) + fresh ETag" };
//   } catch (finalErr) {
//     const e = new Error(
//       `PATCH failed after ${attempts.length} shapes. ` +
//       (finalErr?.message || "Open DevTools → Network → click the PATCH → copy Request Payload + Response.")
//     );
//     e.code = finalErr?.code || "VALIDATION_FAILED";
//     e.status = finalErr?.status;
//     e.failures = failures;
//     throw e;
//   }
// }

// /* ==================== MAINTENANCE — multi-shape ==================== */
// async function recordMaintenanceMultiShape(vehicleId, data) {
//   const startIso = toIsoUtc(data.start_at);
//   const endIso   = toIsoUtc(data.end_at);
//   const startLocalIso = toLocalIso(data.start_at);
//   const endLocalIso   = toLocalIso(data.end_at);
//   const reason = data.reason?.trim() || undefined;

//   const attempts = [
//     { label: "{ start_at, end_at, reason }",              body: { start_at: startIso, end_at: endIso, reason } },
//     { label: "{ starts_at, ends_at, reason }",            body: { starts_at: startIso, ends_at: endIso, reason } },
//     { label: "{ start_time, end_time, reason }",          body: { start_time: startIso, end_time: endIso, reason } },
//     { label: "{ from, to, reason }",                      body: { from: startIso, to: endIso, reason } },
//     { label: "{ start, end, reason }",                    body: { start: startIso, end: endIso, reason } },
//     { label: "{ window_start, window_end, reason }",      body: { window_start: startIso, window_end: endIso, reason } },
//     { label: "{ scheduled_start, scheduled_end, reason }",body: { scheduled_start: startIso, scheduled_end: endIso, reason } },
//     { label: "{ start_at, end_at } (no reason)",          body: { start_at: startIso, end_at: endIso } },
//     { label: "{ start_at, end_at, notes }",               body: { start_at: startIso, end_at: endIso, notes: reason } },
//     { label: "{ window: { start, end }, reason }",        body: { window: { start: startIso, end: endIso }, reason } },
//     { label: "{ start_at, end_at, reason } (local)",      body: { start_at: startLocalIso, end_at: endLocalIso, reason } },
//     { label: "{ starts_at, ends_at, reason } (local)",    body: { starts_at: startLocalIso, ends_at: endLocalIso, reason } },
//   ];

//   const failures = [];
//   for (const a of attempts) {
//     Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);
//     try {
//       console.log(`%c[maintenance] try: ${a.label}`, "color:#f59e0b;font-weight:bold", "\n  body:", JSON.stringify(a.body));
//       const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}/maintenance`, {
//         method: "POST",
//         body: a.body,
//         extraHeaders: { "Idempotency-Key": uuid() },
//       });
//       console.log(`%c[maintenance] ✅ ACCEPTED: ${a.label}`, "color:#10b981;font-weight:bold;font-size:14px");
//       return { res, usedLabel: a.label };
//     } catch (err) {
//       if (err.code !== "VALIDATION_FAILED") throw err;
//       console.warn(`[maintenance] ✗ ${a.label}:`, err.code, err.message);
//       failures.push({ label: a.label, code: err.code, message: err.message });
//     }
//   }
//   const e = new Error(
//     `Server rejected all ${attempts.length} maintenance payload shapes. ` +
//     "Open DevTools → Network → click POST /maintenance → copy Request Payload + Response."
//   );
//   e.code = "VALIDATION_FAILED";
//   e.failures = failures;
//   throw e;
// }

// /* ==================== DEACTIVATE / REACTIVATE ==================== */
// async function deactivateVehicle(vehicleId, reason) {
//   const trimmed = (reason || "").trim();
//   if (!trimmed) throw new Error("A reason is required to deactivate a vehicle.");
//   return mutationWithIfMatch(vehicleId, {
//     method: "POST",
//     path: `/api/v1/admin/vehicles/${vehicleId}/deactivate`,
//     body: { reason: trimmed },
//   });
// }
// async function reactivateVehicle(vehicleId, reason) {
//   const trimmed = (reason || "").trim();
//   if (!trimmed) throw new Error("A reason is required to reactivate a vehicle.");
//   return mutationWithIfMatch(vehicleId, {
//     method: "POST",
//     path: `/api/v1/admin/vehicles/${vehicleId}/reactivate`,
//     body: { reason: trimmed },
//   });
// }

// /* ==================== SMALL UI ==================== */
// function StatusBadge({ status }) {
//   const s = statusStyle(status);
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${s.chip}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
//       {s.label}
//     </span>
//   );
// }
// function Spinner({ label = "Loading…" }) {
//   return (
//     <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
//       <FaSpinner className="animate-spin" size={26} />
//       <p className="text-xs">{label}</p>
//     </div>
//   );
// }
// function ErrorBox({ message }) {
//   return (
//     <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
//       <FaExclamationCircle className="text-rose-500 shrink-0 mt-0.5" size={14} />
//       <span className="text-rose-700 text-xs">{message}</span>
//     </div>
//   );
// }
// function StatCard({ icon: Icon, label, value, gradient }) {
//   return (
//     <div className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-lg ${gradient}`}>
//       <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/15 rounded-full blur-2xl" />
//       <div className="relative">
//         <Icon className="opacity-80" size={16} />
//         <div className="text-2xl font-black mt-1.5 leading-none">{value}</div>
//         <div className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">{label}</div>
//       </div>
//     </div>
//   );
// }

// const VEHICLE_TYPES    = ["VAN", "TRUCK", "CAR", "BIKE", "CHARGING_UNIT", "OTHER"];
// const OWNERSHIP_TYPES  = ["OWNED", "LEASED", "RENTED", "THIRD_PARTY"];
// const INSPECTION_STATES = ["UNKNOWN", "PENDING", "PASSED", "FAILED", "EXPIRED"];

// function Field({ label, required, hint, children }) {
//   return (
//     <div>
//       <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
//         {label} {required && <span className="text-rose-500">*</span>}
//       </label>
//       {children}
//       {hint && <p className="text-[10px] text-slate-500 mt-1 leading-snug">{hint}</p>}
//     </div>
//   );
// }
// const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200";

// /* ==================== CREATE MODAL ==================== */
// function CreateVehicleModal({ open, onClose, onSuccess }) {
//   const emptyForm = {
//     asset_tag: "", registration_number: "",
//     make: "", model: "", variant: "",
//     vehicle_type: "VAN", ownership_type: "OWNED",
//     registration_valid_until: "", insurance_valid_until: "",
//     inspection_status: "UNKNOWN", notes: "",
//   };
//   const [form, setForm] = useState(emptyForm);
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState(null);
//   const [successLabel, setSuccessLabel] = useState(null);
//   const firstRef = useRef(null);

//   useEffect(() => {
//     if (open) {
//       setForm(emptyForm);
//       setError(null); setBusy(false); setSuccessLabel(null);
//       setTimeout(() => firstRef.current?.focus(), 120);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   useEffect(() => {
//     const onKey = (e) => { if (e.key === "Escape" && !busy) onClose(); };
//     if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
//     return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
//   }, [open, busy, onClose]);

//   if (!open) return null;
//   const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!form.asset_tag.trim())           return setError("Asset tag is required.");
//     if (!form.registration_number.trim()) return setError("Registration number is required.");
//     setBusy(true); setError(null); setSuccessLabel(null);
//     try {
//       const { usedLabel } = await createVehicleMultiShape(form);
//       setSuccessLabel(usedLabel);
//       onSuccess?.(usedLabel);
//       setTimeout(() => { setBusy(false); onClose(); }, 1400);
//     } catch (err) {
//       console.error("[create-vehicle] final error:", err);
//       if (err.isSessionExpired) setError(err.message);
//       else if (err.code === "VALIDATION_FAILED") setError(err.message);
//       else if (err.status === 409) setError("A vehicle with this asset tag or registration already exists.");
//       else if (err.status === 403) setError("You need the fleet.manage capability to create vehicles.");
//       else setError(err.message || "Failed to create vehicle.");
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => !busy && onClose()} />
//       <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-white shadow-2xl shadow-sky-900/20 animate-[scaleIn_0.2s_ease-out]">
//         <div className="relative bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500 p-6 pb-8 text-white">
//           <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
//           <button onClick={() => !busy && onClose()}
//             className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
//             <FaTimes size={12} />
//           </button>
//           <div className="relative flex items-center gap-3">
//             <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30">
//               <FaTruck size={18} />
//             </div>
//             <div>
//               <h3 className="text-lg font-black tracking-tight">Register Service Vehicle</h3>
//               <p className="text-[11px] text-sky-50/90">Requires fleet.manage capability</p>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={submit} className="p-6 space-y-4 -mt-4 relative max-h-[75vh] overflow-y-auto">
//           {successLabel && (
//             <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
//               <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
//               <div>
//                 <p className="text-emerald-800 text-xs font-bold">✅ Vehicle created successfully!</p>
//                 <p className="text-emerald-700 text-[10px] mt-0.5">
//                   Accepted payload shape: <code className="font-mono bg-emerald-100 px-1 rounded">{successLabel}</code>
//                 </p>
//               </div>
//             </div>
//           )}
//           {error && <ErrorBox message={error} />}

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <Field label="Asset Tag" required>
//               <input ref={firstRef} value={form.asset_tag} onChange={onChange("asset_tag")} placeholder="e.g. FLT-0007" className={inputCls + " font-mono"} disabled={busy} />
//             </Field>
//             <Field label="Registration Number" required>
//               <input value={form.registration_number} onChange={onChange("registration_number")} placeholder="e.g. DHK-GA-1234" className={inputCls + " font-mono"} disabled={busy} />
//             </Field>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//             <Field label="Make"><input value={form.make} onChange={onChange("make")} placeholder="Tesla" className={inputCls} disabled={busy} /></Field>
//             <Field label="Model"><input value={form.model} onChange={onChange("model")} placeholder="Model 3" className={inputCls} disabled={busy} /></Field>
//             <Field label="Variant"><input value={form.variant} onChange={onChange("variant")} placeholder="Long Range" className={inputCls} disabled={busy} /></Field>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <Field label="Vehicle Type">
//               <select value={form.vehicle_type} onChange={onChange("vehicle_type")} className={inputCls} disabled={busy}>
//                 {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//             </Field>
//             <Field label="Ownership Type">
//               <select value={form.ownership_type} onChange={onChange("ownership_type")} className={inputCls} disabled={busy}>
//                 {OWNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//             </Field>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <Field label="Registration Valid Until"><input type="date" value={form.registration_valid_until} onChange={onChange("registration_valid_until")} className={inputCls} disabled={busy} /></Field>
//             <Field label="Insurance Valid Until"><input type="date" value={form.insurance_valid_until} onChange={onChange("insurance_valid_until")} className={inputCls} disabled={busy} /></Field>
//           </div>
//           <Field label="Inspection Status" hint="New vehicles typically start as UNKNOWN. Use Edit later to mark PASSED.">
//             <select value={form.inspection_status} onChange={onChange("inspection_status")} className={inputCls} disabled={busy}>
//               {INSPECTION_STATES.map((t) => <option key={t} value={t}>{t}</option>)}
//             </select>
//           </Field>
//           <Field label="Notes">
//             <textarea value={form.notes} onChange={onChange("notes")} rows={2} placeholder="Optional notes…" className={inputCls + " resize-none"} disabled={busy} />
//           </Field>

//           <div className="flex items-center gap-2 pt-2">
//             <button type="button" onClick={() => !busy && onClose()} disabled={busy}
//               className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition">
//               Cancel
//             </button>
//             <button type="submit" disabled={busy}
//               className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-400 hover:via-blue-400 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
//               {busy ? (<><FaSpinner className="animate-spin" size={13} /> Creating…</>) : (<><FaPlus size={12} /> Create Vehicle</>)}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ==================== DETAIL DRAWER ==================== */
// function DetailDrawer({ vehicle, onClose, onRefresh }) {
//   const [tab, setTab] = useState("overview");
//   const [history, setHistory]   = useState(null);
//   const [avail, setAvail]       = useState(null);
//   const [loadingH, setLoadingH] = useState(false);
//   const [loadingA, setLoadingA] = useState(false);
//   const [errorH, setErrorH]     = useState(null);
//   const [errorA, setErrorA]     = useState(null);

//   const [fresh, setFresh]               = useState(vehicle);
//   const [freshVersion, setFreshVersion] = useState(null);
//   const [freshEtag, setFreshEtag]       = useState(null);
//   const [refreshing, setRefreshing]     = useState(false);

//   const [edit, setEdit]               = useState(null);
//   const [editBusy, setEditBusy]       = useState(false);
//   const [editErr, setEditErr]         = useState(null);
//   const [editLabel, setEditLabel]     = useState(null);   // accepted PATCH shape

//   const [maint, setMaint]           = useState({ start_at: "", end_at: "", reason: "" });
//   const [maintBusy, setMaintBusy]   = useState(false);
//   const [maintErr, setMaintErr]     = useState(null);
//   const [maintOk, setMaintOk]       = useState(null);
//   const [maintLabel, setMaintLabel] = useState(null);

//   const [actionReason, setActionReason] = useState("");
//   const [actionBusy, setActionBusy]     = useState(false);
//   const [actionErr, setActionErr]       = useState(null);

//   const vehicleId = vehicle?.id || vehicle?.vehicle_id || vehicle?.uuid;
//   const shown     = fresh || vehicle;

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (!vehicleId) return;
//       setRefreshing(true);
//       const meta = await fetchVehicleMeta(vehicleId);
//       if (cancelled) return;
//       if (meta.data) setFresh(meta.data);
//       setFreshVersion(meta.version);
//       setFreshEtag(meta.etag);
//       setRefreshing(false);
//     })();
//     return () => { cancelled = true; };
//   }, [vehicleId]);

//   useEffect(() => {
//     setTab("overview");
//     setHistory(null); setAvail(null);
//     setErrorH(null); setErrorA(null);
//     setEditErr(null); setEditLabel(null);
//     setMaintErr(null); setMaintOk(null); setMaintLabel(null);
//     setActionErr(null); setActionReason("");

//     const v = shown || {};
//     setEdit({
//       asset_tag: v.asset_tag || "",
//       registration_number: v.registration_number || "",
//       make: v.make || "",
//       model: v.model || "",
//       variant: v.variant || "",
//       vehicle_type: v.vehicle_type || "VAN",
//       ownership_type: v.ownership_type || "OWNED",
//       registration_valid_until: v.registration_valid_until ? String(v.registration_valid_until).slice(0, 10) : "",
//       insurance_valid_until:    v.insurance_valid_until    ? String(v.insurance_valid_until).slice(0, 10)    : "",
//       inspection_status: v.inspection_status || "UNKNOWN",
//       notes: v.notes || "",
//     });
//     setMaint({ start_at: "", end_at: "", reason: "" });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [shown]);

//   const loadHistory = useCallback(async () => {
//     if (!vehicleId) return;
//     setLoadingH(true); setErrorH(null);
//     try {
//       const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}/history`);
//       setHistory(extractHistory(res));
//     } catch (err) { setErrorH(err.message); }
//     finally { setLoadingH(false); }
//   }, [vehicleId]);

//   const loadAvailability = useCallback(async () => {
//     if (!vehicleId) return;
//     setLoadingA(true); setErrorA(null);
//     try {
//       const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}/availability`);
//       setAvail(extractAvailability(res));
//     } catch (err) { setErrorA(err.message); }
//     finally { setLoadingA(false); }
//   }, [vehicleId]);

//   useEffect(() => {
//     if (tab === "history" && history === null) loadHistory();
//     if (tab === "availability" && avail === null) loadAvailability();
//   }, [tab, history, avail, loadHistory, loadAvailability]);

//   const handleSaveEdit = async (e) => {
//     e.preventDefault();
//     if (!vehicleId) return;
//     setEditBusy(true); setEditErr(null); setEditLabel(null);
//     try {
//       const v = shown || {};
//       const changed = {};
//       const trim = (s) => (typeof s === "string" ? s.trim() : s);
//       const diff = (newVal, oldVal) => trim(newVal) !== trim(oldVal ?? "");

//       if (diff(edit.asset_tag, v.asset_tag))                     changed.asset_tag = edit.asset_tag.trim();
//       if (diff(edit.registration_number, v.registration_number)) changed.registration_number = edit.registration_number.trim();
//       if (diff(edit.make, v.make))                               changed.make = edit.make.trim();
//       if (diff(edit.model, v.model))                             changed.model = edit.model.trim();
//       if (diff(edit.variant, v.variant))                         changed.variant = edit.variant.trim();
//       if (diff(edit.vehicle_type, v.vehicle_type))               changed.vehicle_type = edit.vehicle_type;
//       if (diff(edit.ownership_type, v.ownership_type))           changed.ownership_type = edit.ownership_type;
//       if (diff(edit.registration_valid_until, v.registration_valid_until ? String(v.registration_valid_until).slice(0, 10) : ""))
//         changed.registration_valid_until = edit.registration_valid_until;
//       if (diff(edit.insurance_valid_until, v.insurance_valid_until ? String(v.insurance_valid_until).slice(0, 10) : ""))
//         changed.insurance_valid_until = edit.insurance_valid_until;
//       if (diff(edit.inspection_status, v.inspection_status))     changed.inspection_status = String(edit.inspection_status).toUpperCase();
//       if (diff(edit.notes, v.notes))                             changed.notes = edit.notes.trim();

//       if (Object.keys(changed).length === 0) {
//         setEditErr("No changes to save.");
//         setEditBusy(false);
//         return;
//       }

//       const { usedLabel } = await updateVehicleMultiShape(vehicleId, changed, v);
//       setEditLabel(usedLabel);
//       onRefresh?.();
//       // small delay so user can see the shape badge
//       setTimeout(() => { setEditBusy(false); onClose(); }, 1200);
//     } catch (err) {
//       console.error("[edit] error:", err);
//       if (err.isSessionExpired) setEditErr(err.message);
//       else if (err.status === 428) setEditErr("Server requires If-Match header — please retry.");
//       else if (err.status === 412) setEditErr("Version conflict — someone else updated this vehicle. Refresh and retry.");
//       else if (err.status === 409) setEditErr("Version conflict — refresh and try again.");
//       else if (err.code === "VALIDATION_FAILED") setEditErr(err.message);
//       else setEditErr(err.message || "Failed to update vehicle.");
//       setEditBusy(false);
//     }
//   };

//   const handleDeactivate = async () => {
//     if (!vehicleId) return;
//     const r = actionReason.trim();
//     if (!r) { setActionErr("Please enter a reason for deactivation."); return; }
//     if (!window.confirm(`Deactivate this vehicle?\n\nReason: ${r}`)) return;
//     setActionBusy(true); setActionErr(null);
//     try {
//       await deactivateVehicle(vehicleId, r);
//       onRefresh?.();
//       onClose();
//     } catch (err) {
//       console.error("[deactivate] error:", err);
//       if (err.status === 428) setActionErr("Server requires If-Match — please retry.");
//       else if (err.status === 412) setActionErr("Version conflict — refresh and retry.");
//       else setActionErr(err.message || "Failed to deactivate.");
//     } finally { setActionBusy(false); }
//   };

//   const handleReactivate = async () => {
//     if (!vehicleId) return;
//     const r = actionReason.trim();
//     if (!r) { setActionErr("Please enter a reason for reactivation."); return; }
//     if (!window.confirm(`Reactivate this vehicle?\n\nReason: ${r}`)) return;
//     setActionBusy(true); setActionErr(null);
//     try {
//       await reactivateVehicle(vehicleId, r);
//       onRefresh?.();
//       onClose();
//     } catch (err) {
//       console.error("[reactivate] error:", err);
//       if (err.status === 428) setActionErr("Server requires If-Match — please retry.");
//       else if (err.status === 412) setActionErr("Version conflict — refresh and retry.");
//       else setActionErr(err.message || "Failed to reactivate.");
//     } finally { setActionBusy(false); }
//   };

//   const handleMaintenance = async (e) => {
//     e.preventDefault();
//     if (!vehicleId) return;
//     if (!maint.start_at || !maint.end_at) return setMaintErr("Start and end time are required.");
//     if (new Date(maint.end_at) <= new Date(maint.start_at))
//       return setMaintErr("End time must be after start time.");

//     setMaintBusy(true); setMaintErr(null); setMaintOk(null); setMaintLabel(null);
//     try {
//       const { usedLabel } = await recordMaintenanceMultiShape(vehicleId, maint);
//       setMaintLabel(usedLabel);
//       setMaintOk("✅ Maintenance window recorded.");
//       setMaint({ start_at: "", end_at: "", reason: "" });
//       onRefresh?.();
//     } catch (err) {
//       console.error("[maintenance] final error:", err);
//       if (err.code === "VALIDATION_FAILED") setMaintErr(err.message);
//       else if (err.status === 409) setMaintErr("Overlaps with an existing maintenance window.");
//       else setMaintErr(err.message || "Failed to record maintenance.");
//     } finally { setMaintBusy(false); }
//   };

//   if (!shown) return null;

//   const status = vehicleStatus(shown);
//   const style  = statusStyle(status);
//   const displayTitle = shown.asset_tag || shown.registration_number || shown.name || "Vehicle";
//   const displaySub   = shown.registration_number || shown.asset_tag || vehicleId;
//   const isInactive   = status.includes("inactive") || status.includes("deactiv");
//   const shownVersion = freshVersion ?? shown.version;

//   const tabs = [
//     { id: "overview",     label: "Overview",     icon: FaInfoCircle },
//     { id: "history",      label: "History",      icon: FaHistory },
//     { id: "availability", label: "Availability", icon: FaCalendarCheck },
//     { id: "maintenance",  label: "Maintenance",  icon: FaWrench },
//     { id: "edit",         label: "Edit",         icon: FaEdit },
//   ];

//   return (
//     <div className="fixed inset-0 z-[90] flex justify-end">
//       <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-[slideIn_0.25s_ease-out]">
//         <div className={`relative bg-gradient-to-br ${style.bg} p-5 text-white shrink-0`}>
//           <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
//           <button onClick={onClose}
//             className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
//             <FaTimes size={12} />
//           </button>
//           <div className="relative flex items-start gap-3">
//             <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
//               <FaTruck size={22} />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h2 className="text-xl font-black tracking-tight truncate">{displayTitle}</h2>
//               <p className="text-[11px] font-mono text-white/90 truncate mt-0.5">{displaySub}</p>
//               <div className="flex flex-wrap gap-1.5 mt-2">
//                 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/30">
//                   <span className="w-1.5 h-1.5 rounded-full bg-white" />
//                   {style.label}
//                 </span>
//                 {shown.vehicle_type && (
//                   <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/30">
//                     {shown.vehicle_type}
//                   </span>
//                 )}
//                 {refreshing && (
//                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/30">
//                     <FaSpinner className="animate-spin" size={9} /> Syncing
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="shrink-0 border-b border-slate-200 bg-white px-2 overflow-x-auto">
//           <div className="flex items-center gap-1">
//             {tabs.map(({ id, label, icon: Icon }) => (
//               <button key={id} onClick={() => setTab(id)}
//                 className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
//                   tab === id ? "border-sky-500 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-800"
//                 }`}>
//                 <Icon size={11} /> {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-5 space-y-4">
//           {actionErr && <ErrorBox message={actionErr} />}

//           {tab === "overview" && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-2">
//                 <DetailRow icon={FaTag}         label="Asset Tag"      value={shown.asset_tag} />
//                 <DetailRow icon={FaClipboard}   label="Registration"   value={shown.registration_number} />
//                 <DetailRow icon={FaCar}         label="Make"           value={shown.make} />
//                 <DetailRow icon={FaCar}         label="Model"          value={shown.model} />
//                 <DetailRow icon={FaCar}         label="Variant"        value={shown.variant} />
//                 <DetailRow icon={FaTruck}       label="Type"           value={shown.vehicle_type} />
//                 <DetailRow icon={FaInfoCircle}  label="Ownership"      value={shown.ownership_type} />
//                 <DetailRow icon={FaCheckCircle} label="Inspection"     value={shown.inspection_status} />
//                 <DetailRow icon={FaCalendarCheck} label="Reg. Valid Until" value={fmtDateOnly(shown.registration_valid_until)} />
//                 <DetailRow icon={FaCalendarCheck} label="Insurance Until"  value={fmtDateOnly(shown.insurance_valid_until)} />
//                 <DetailRow icon={FaLock}        label="Version"        value={shownVersion} />
//                 <DetailRow icon={FaClock}       label="Created"        value={fmtDate(shown.created_at)} />
//               </div>

//               {shownVersion !== null && shownVersion !== undefined && (
//                 <div className="p-2 rounded-lg bg-violet-50 border border-violet-200">
//                   <div className="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-0.5">If-Match header on next mutation</div>
//                   <code className="text-[10px] font-mono text-violet-800 break-all">{ifMatchHeader(shownVersion)}</code>
//                 </div>
//               )}

//               {shown.notes && (
//                 <div>
//                   <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Notes</h4>
//                   <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 whitespace-pre-wrap">
//                     {shown.notes}
//                   </p>
//                 </div>
//               )}

//               <div className="pt-2 border-t border-slate-100">
//                 <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Actions</h4>

//                 <div className="mb-2">
//                   <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
//                     Reason <span className="text-rose-500">*</span>
//                   </label>
//                   <textarea
//                     value={actionReason}
//                     onChange={(e) => setActionReason(e.target.value)}
//                     rows={2}
//                     placeholder={isInactive ? "e.g. Repairs complete — back in service" : "e.g. Routine inspection required"}
//                     className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 resize-none"
//                     disabled={actionBusy}
//                   />
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   {isInactive ? (
//                     <button onClick={handleReactivate} disabled={actionBusy || !actionReason.trim()}
//                       className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
//                       {actionBusy ? <FaSpinner className="animate-spin" size={11} /> : <FaPlayCircle size={11} />}
//                       Reactivate
//                     </button>
//                   ) : (
//                     <button onClick={handleDeactivate} disabled={actionBusy || !actionReason.trim()}
//                       className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
//                       {actionBusy ? <FaSpinner className="animate-spin" size={11} /> : <FaPowerOff size={11} />}
//                       Deactivate
//                     </button>
//                   )}
//                   <button onClick={() => setTab("maintenance")}
//                     className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition">
//                     <FaWrench size={11} /> Schedule Maintenance
//                   </button>
//                 </div>

//                 {!actionReason.trim() && (
//                   <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
//                     <FaCommentDots size={9} /> Enter a reason above to enable Deactivate / Reactivate.
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {tab === "history" && (
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Append-only history</h4>
//                 <button onClick={loadHistory} className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1">
//                   <FaSyncAlt size={9} /> Refresh
//                 </button>
//               </div>
//               {loadingH && <Spinner label="Loading history…" />}
//               {errorH   && <ErrorBox message={errorH} />}
//               {!loadingH && !errorH && (!history || history.length === 0) && (
//                 <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">No history events yet.</p>
//               )}
//               {!loadingH && !errorH && history && history.length > 0 && (
//                 <ol className="relative border-l-2 border-slate-200 ml-2 space-y-3">
//                   {history.map((h, i) => (
//                     <li key={i} className="ml-4">
//                       <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-100" />
//                       <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
//                         <div className="flex items-center justify-between gap-2">
//                           <span className="text-xs font-bold text-slate-900">{h.event_type || h.type || h.action || "Event"}</span>
//                           <span className="text-[10px] text-slate-500">{fmtDate(h.created_at || h.timestamp || h.at)}</span>
//                         </div>
//                         {h.actor && <p className="text-[10px] text-slate-600 mt-0.5">By: {h.actor}</p>}
//                         {h.message && <p className="text-[11px] text-slate-700 mt-1">{h.message}</p>}
//                       </div>
//                     </li>
//                   ))}
//                 </ol>
//               )}
//             </div>
//           )}

//           {tab === "availability" && (
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inventory availability evidence</h4>
//                 <button onClick={loadAvailability} className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1">
//                   <FaSyncAlt size={9} /> Refresh
//                 </button>
//               </div>
//               {loadingA && <Spinner label="Loading availability…" />}
//               {errorA   && <ErrorBox message={errorA} />}
//               {!loadingA && !errorA && avail && (
//                 <pre className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-x-auto font-mono whitespace-pre-wrap">
//                   {JSON.stringify(avail, null, 2)}
//                 </pre>
//               )}
//               {!loadingA && !errorA && !avail && (
//                 <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">No availability data.</p>
//               )}
//             </div>
//           )}

//           {tab === "maintenance" && (
//             <form onSubmit={handleMaintenance} className="space-y-3">
//               <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
//                 <FaInfoCircle className="text-amber-600 shrink-0 mt-0.5" size={13} />
//                 <span className="text-amber-800 text-[11px]">Windows must not overlap with existing maintenance slots.</span>
//               </div>

//               {maintErr && <ErrorBox message={maintErr} />}
//               {maintOk && (
//                 <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
//                   <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
//                   <div>
//                     <p className="text-emerald-700 text-xs">{maintOk}</p>
//                     {maintLabel && (
//                       <p className="text-emerald-600 text-[10px] mt-0.5">
//                         Accepted shape: <code className="font-mono bg-emerald-100 px-1 rounded">{maintLabel}</code>
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <Field label="Start" required>
//                 <input type="datetime-local" value={maint.start_at}
//                   onChange={(e) => setMaint({ ...maint, start_at: e.target.value })}
//                   className={inputCls} disabled={maintBusy} />
//               </Field>
//               <Field label="End" required>
//                 <input type="datetime-local" value={maint.end_at}
//                   onChange={(e) => setMaint({ ...maint, end_at: e.target.value })}
//                   className={inputCls} disabled={maintBusy} />
//               </Field>
//               <Field label="Reason">
//                 <textarea value={maint.reason}
//                   onChange={(e) => setMaint({ ...maint, reason: e.target.value })}
//                   rows={2} placeholder="e.g. Routine inspection"
//                   className={inputCls + " resize-none"} disabled={maintBusy} />
//               </Field>
//               <button type="submit" disabled={maintBusy}
//                 className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/30 disabled:opacity-60">
//                 {maintBusy ? (<><FaSpinner className="animate-spin" size={13} /> Recording…</>) : (<><FaWrench size={12} /> Record Maintenance</>)}
//               </button>
//               <p className="text-[10px] text-slate-500 text-center">
//                 Dates are auto-converted to ISO-8601 UTC before sending.
//               </p>
//             </form>
//           )}

//           {tab === "edit" && edit && (
//             <form onSubmit={handleSaveEdit} className="space-y-3">
//               {editErr && <ErrorBox message={editErr} />}
//               {editLabel && (
//                 <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
//                   <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
//                   <div>
//                     <p className="text-emerald-800 text-xs font-bold">✅ Vehicle updated!</p>
//                     <p className="text-emerald-700 text-[10px] mt-0.5">
//                       Accepted PATCH shape: <code className="font-mono bg-emerald-100 px-1 rounded">{editLabel}</code>
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <Field label="Asset Tag"><input value={edit.asset_tag} onChange={(e) => setEdit({ ...edit, asset_tag: e.target.value })} className={inputCls + " font-mono"} disabled={editBusy} /></Field>
//                 <Field label="Registration Number"><input value={edit.registration_number} onChange={(e) => setEdit({ ...edit, registration_number: e.target.value })} className={inputCls + " font-mono"} disabled={editBusy} /></Field>
//                 <Field label="Make"><input value={edit.make} onChange={(e) => setEdit({ ...edit, make: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <Field label="Model"><input value={edit.model} onChange={(e) => setEdit({ ...edit, model: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <Field label="Variant"><input value={edit.variant} onChange={(e) => setEdit({ ...edit, variant: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <Field label="Vehicle Type">
//                   <select value={edit.vehicle_type} onChange={(e) => setEdit({ ...edit, vehicle_type: e.target.value })} className={inputCls} disabled={editBusy}>
//                     {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//                   </select>
//                 </Field>
//                 <Field label="Ownership Type">
//                   <select value={edit.ownership_type} onChange={(e) => setEdit({ ...edit, ownership_type: e.target.value })} className={inputCls} disabled={editBusy}>
//                     {OWNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//                   </select>
//                 </Field>
//                 <Field label="Inspection Status">
//                   <select value={edit.inspection_status} onChange={(e) => setEdit({ ...edit, inspection_status: e.target.value })} className={inputCls} disabled={editBusy}>
//                     {INSPECTION_STATES.map((t) => <option key={t} value={t}>{t}</option>)}
//                   </select>
//                 </Field>
//                 <Field label="Reg. Valid Until"><input type="date" value={edit.registration_valid_until} onChange={(e) => setEdit({ ...edit, registration_valid_until: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <Field label="Insurance Valid Until"><input type="date" value={edit.insurance_valid_until} onChange={(e) => setEdit({ ...edit, insurance_valid_until: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <div className="sm:col-span-2">
//                   <Field label="Notes">
//                     <textarea value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} rows={3} className={inputCls + " resize-none"} disabled={editBusy} />
//                   </Field>
//                 </div>
//               </div>

//               <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-2">
//                 <FaLock className="text-sky-600 shrink-0 mt-0.5" size={12} />
//                 <div className="text-[10px] text-sky-800 leading-snug">
//                   On save: fetches fresh version → sends{" "}
//                   <code className="font-mono bg-sky-100 px-1 rounded">If-Match: "{String(shownVersion ?? "")}"</code>{" "}
//                   + Idempotency-Key. Tries 6 payload shapes, stops on first success. Retries on 412/428.
//                 </div>
//               </div>

//               {shownVersion !== null && shownVersion !== undefined && (
//                 <p className="text-[10px] text-slate-500">Current version: {String(shownVersion)}</p>
//               )}

//               <button type="submit" disabled={editBusy}
//                 className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/30 disabled:opacity-60">
//                 {editBusy ? (<><FaSpinner className="animate-spin" size={13} /> Saving…</>) : (<><FaCheckCircle size={12} /> Save Changes</>)}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//       <style>{`
//         @keyframes slideIn {
//           from { transform: translateX(30px); opacity: 0; }
//           to   { transform: translateX(0); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }

// function DetailRow({ icon: Icon, label, value }) {
//   return (
//     <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
//       <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
//         <Icon size={9} /> {label}
//       </div>
//       <div className="text-xs font-semibold text-slate-900 truncate">
//         {value === null || value === undefined || value === "" ? "—" : String(value)}
//       </div>
//     </div>
//   );
// }

// /* ==================== MAIN PAGE ==================== */
// export default function Vehicles() {
//   const navigate = useNavigate();
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState(null);
//   const [sessionExpired, setSessionExpired] = useState(false);
//   const [search, setSearch]     = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [createOpen, setCreateOpen] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [toast, setToast]       = useState(null);

//   useEffect(() => {
//     const id = "vehicles-google-fonts";
//     if (document.getElementById(id)) return;
//     const link = document.createElement("link");
//     link.id = id;
//     link.rel = "stylesheet";
//     link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";
//     document.head.appendChild(link);
//   }, []);

//   const showToast = (msg, tone = "emerald") => {
//     setToast({ msg, tone });
//     setTimeout(() => setToast(null), 6000);
//   };

//   const load = useCallback(async () => {
//     if (!localStorage.getItem("access_token") && !localStorage.getItem("refresh_token")) {
//       setSessionExpired(true); setLoading(false); return;
//     }
//     setLoading(true); setError(null); setSessionExpired(false);
//     try {
//       const res = await apiRequest("/api/v1/admin/vehicles");
//       setVehicles(extractVehicles(res));
//     } catch (err) {
//       if (err.isSessionExpired) { setSessionExpired(true); setVehicles([]); }
//       else { setError(err.message); setVehicles([]); }
//     } finally { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const filtered = vehicles.filter((v) => {
//     const q = search.toLowerCase().trim();
//     const hay = [v.asset_tag, v.registration_number, v.make, v.model, v.variant, v.vehicle_type, v.ownership_type]
//       .filter(Boolean).join(" ").toLowerCase();
//     const matchesSearch = !q || hay.includes(q);
//     const s = vehicleStatus(v);
//     const matchesStatus =
//       statusFilter === "all" ||
//       (statusFilter === "active"      && s.includes("active")) ||
//       (statusFilter === "maintenance" && s.includes("mainten")) ||
//       (statusFilter === "inactive"    && (s.includes("inactive") || s.includes("deactiv")));
//     return matchesSearch && matchesStatus;
//   });

//   const stats = vehicles.reduce((acc, v) => {
//     acc.total++;
//     const s = vehicleStatus(v);
//     if (s.includes("mainten")) acc.maintenance++;
//     else if (s.includes("inactive") || s.includes("deactiv")) acc.inactive++;
//     else acc.active++;
//     return acc;
//   }, { total: 0, active: 0, maintenance: 0, inactive: 0 });

//   if (sessionExpired) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-sky-50/40 px-4 py-16 flex items-center justify-center vehicles-page">
//         <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-8 text-center">
//           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
//             <FaExclamationCircle className="text-white" size={24} />
//           </div>
//           <h2 className="text-xl font-black text-slate-900">Session expired</h2>
//           <p className="text-sm text-slate-600 mt-2">
//             Your access token has expired and couldn't be refreshed. Please sign in again to continue.
//           </p>
//           <button
//             onClick={() => { clearSession(); navigate("/login", { replace: true }); }}
//             className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/30">
//             <FaSignInAlt size={12} /> Sign in again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-sky-50/40 px-4 py-8 vehicles-page">
//       <style>{`
//         .vehicles-page {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           -webkit-font-smoothing: antialiased;
//           -moz-osx-font-smoothing: grayscale;
//         }
//         .vehicles-page h1,
//         .vehicles-page h2,
//         .vehicles-page h3 {
//           font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
//           letter-spacing: -0.025em;
//         }
//         .vehicles-page input,
//         .vehicles-page textarea,
//         .vehicles-page select {
//           font-family: 'Inter', sans-serif;
//         }
//         .vehicles-page .font-mono,
//         .vehicles-page code {
//           font-family: 'JetBrains Mono', 'SF Mono', Menlo, Monaco, 'Courier New', monospace;
//         }
//       `}</style>

//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* HERO */}
//         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500 p-7 sm:p-8 shadow-xl shadow-sky-500/20">
//           <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/15 rounded-full blur-3xl" />
//           <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
//           <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
//                 <FaTruck size={9} /> Fleet Management
//               </div>
//               <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
//                 <FaTruck size={26} /> Service Vehicles
//               </h1>
//               <p className="text-sky-50/90 text-sm mt-1.5 max-w-xl">
//                 Manage your mobile charging fleet — track status, schedule maintenance, and inspect availability.
//               </p>
//             </div>
//             <div className="flex items-center gap-2 shrink-0">
//               <button onClick={load}
//                 className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 transition"
//                 title="Refresh">
//                 <FaSyncAlt size={13} />
//               </button>
//               <button onClick={() => setCreateOpen(true)}
//                 className="px-5 py-2.5 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
//                 <FaPlus size={13} /> Add Vehicle
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           <StatCard icon={FaTruck}        label="Total"       value={stats.total}       gradient="bg-gradient-to-br from-sky-500 to-blue-600" />
//           <StatCard icon={FaCheckCircle}  label="Active"      value={stats.active}      gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
//           <StatCard icon={FaWrench}       label="Maintenance" value={stats.maintenance} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
//           <StatCard icon={FaPowerOff}     label="Inactive"    value={stats.inactive}    gradient="bg-gradient-to-br from-slate-500 to-slate-700" />
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="flex flex-col sm:flex-row gap-2">
//             <div className="relative flex-1">
//               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
//               <input value={search} onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by asset tag, registration, make, model…"
//                 className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200" />
//             </div>
//             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200">
//               <option value="all">All statuses</option>
//               <option value="active">Active</option>
//               <option value="maintenance">In maintenance</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </div>

//         {error && <ErrorBox message={error} />}
//         {toast && (
//           <div className={`p-3 rounded-xl border flex items-start gap-2 animate-[fadeIn_0.15s_ease-out] ${
//             toast.tone === "rose" ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"
//           }`}>
//             <FaCheckCircle className={toast.tone === "rose" ? "text-rose-500" : "text-emerald-500"} size={13} />
//             <span className={`text-xs ${toast.tone === "rose" ? "text-rose-700" : "text-emerald-700"}`}>{toast.msg}</span>
//           </div>
//         )}

//         {loading ? (
//           <Spinner label="Loading vehicles…" />
//         ) : filtered.length === 0 ? (
//           <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
//             <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-3">
//               <FaTruck className="text-sky-400" size={22} />
//             </div>
//             <h3 className="text-sm font-bold text-slate-900">
//               {vehicles.length === 0 ? "No vehicles yet" : "No matches"}
//             </h3>
//             <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
//               {vehicles.length === 0
//                 ? "Register your first service vehicle to start managing your fleet."
//                 : "Try adjusting your search or status filter."}
//             </p>
//             {vehicles.length === 0 && (
//               <button onClick={() => setCreateOpen(true)}
//                 className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-sky-500/30">
//                 <FaPlus size={11} /> Add your first vehicle
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {filtered.map((v) => {
//               const id = v.id || v.vehicle_id || v.uuid;
//               const status = vehicleStatus(v);
//               const style  = statusStyle(status);
//               const title  = v.asset_tag || v.registration_number || v.name || "Unnamed";
//               const sub    = v.registration_number || v.asset_tag || id;

//               return (
//                 <div key={id} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
//                   <div className={`h-1.5 bg-gradient-to-r ${style.bg}`} />
//                   <div className="p-4">
//                     <div className="flex items-start justify-between gap-2 mb-2">
//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-center gap-2">
//                           <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center shadow-sm shrink-0`}>
//                             <FaTruck className="text-white" size={14} />
//                           </div>
//                           <div className="min-w-0">
//                             <h3 className="text-sm font-black text-slate-900 truncate">{title}</h3>
//                             <p className="text-[11px] font-mono text-slate-500 truncate">{sub}</p>
//                           </div>
//                         </div>
//                       </div>
//                       <StatusBadge status={status} />
//                     </div>

//                     <div className="flex flex-wrap gap-1.5 mb-3">
//                       {(v.make || v.model) && (
//                         <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
//                           {[v.make, v.model, v.variant].filter(Boolean).join(" ")}
//                         </span>
//                       )}
//                       {v.vehicle_type && (
//                         <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider border border-sky-200">
//                           {v.vehicle_type}
//                         </span>
//                       )}
//                       {v.ownership_type && (
//                         <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider border border-violet-200">
//                           {v.ownership_type}
//                         </span>
//                       )}
//                       {v.inspection_status && (
//                         <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
//                           String(v.inspection_status).toUpperCase() === "PASSED"
//                             ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                             : String(v.inspection_status).toUpperCase() === "FAILED"
//                             ? "bg-rose-50 text-rose-700 border-rose-200"
//                             : "bg-slate-50 text-slate-700 border-slate-200"
//                         }`}>
//                           {v.inspection_status}
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
//                       <button onClick={() => setSelected(v)}
//                         className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition">
//                         <FaEye size={10} /> Details
//                       </button>
//                       <button onClick={() => setSelected(v)}
//                         className="flex-1 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center gap-1.5 transition">
//                         <FaHistory size={10} /> History
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <CreateVehicleModal
//         open={createOpen}
//         onClose={() => setCreateOpen(false)}
//         onSuccess={(usedLabel) => {
//           load();
//           if (usedLabel && usedLabel !== "as-entered") {
//             showToast(`Vehicle created using fallback shape: ${usedLabel}.`, "emerald");
//           } else {
//             showToast("Vehicle created successfully.", "emerald");
//           }
//         }}
//       />

//       {selected && (
//         <DetailDrawer vehicle={selected} onClose={() => setSelected(null)} onRefresh={load} />
//       )}

//       <style>{`
//         @keyframes scaleIn {
//           from { opacity: 0; transform: scale(0.95) translateY(10px); }
//           to   { opacity: 1; transform: scale(1) translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-4px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }


// src/components/Admin/Vehicles.jsx
// src/components/Admin/Vehicles.jsx
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaTruck, FaPlus, FaSearch, FaSyncAlt, FaCheckCircle, FaExclamationCircle,
//   FaSpinner, FaTimes, FaEye, FaEdit, FaHistory, FaCalendarCheck,
//   FaPowerOff, FaPlayCircle, FaWrench, FaInfoCircle, FaClock, FaCar,
//   FaClipboard, FaTag, FaSignInAlt, FaLock, FaCommentDots, FaCopy,
// } from "react-icons/fa";

// /* ==================== INLINE API LAYER ==================== */
// const BASE_URL    = "https://dev-evcowbbe.transev.site";
// const ACCESS_KEY  = "access_token";
// const REFRESH_KEY = "refresh_token";
// const USER_KEY    = "admin_user";

// function getAccessToken()  { return localStorage.getItem(ACCESS_KEY); }
// function getRefreshToken() { return localStorage.getItem(REFRESH_KEY); }
// function clearSession() {
//   localStorage.removeItem(ACCESS_KEY);
//   localStorage.removeItem(REFRESH_KEY);
//   localStorage.removeItem(USER_KEY);
// }

// function uuid() {
//   if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

// function ifMatchHeader(version) {
//   if (version === null || version === undefined || version === "") return null;
//   return `"${String(version)}"`;
// }

// /* ✅ Backend enum only: UNKNOWN, VALID, FAILED, EXPIRED */
// const INSPECTION_STATES = ["UNKNOWN", "VALID", "FAILED", "EXPIRED"];

// function sanitizeInspection(val) {
//   const s = String(val ?? "").trim().toUpperCase();
//   return INSPECTION_STATES.includes(s) ? s : undefined;
// }

// const AUTH_BYPASS = ["/auth/login", "/auth/verify-otp", "/auth/refresh", "/auth/2fa/resend", "/auth/password/change"];
// function isAuthEndpoint(path) { return AUTH_BYPASS.some((p) => path.includes(p)); }

// class SessionExpiredError extends Error {
//   constructor() {
//     super("Session expired. Please sign in again.");
//     this.code = "SESSION_EXPIRED";
//     this.isSessionExpired = true;
//   }
// }

// let refreshInFlight = null;
// async function tryRefreshToken() {
//   if (refreshInFlight) return refreshInFlight;
//   refreshInFlight = (async () => {
//     const refreshTok = getRefreshToken();
//     if (!refreshTok) return false;
//     try {
//       const res = await fetch(`${BASE_URL}/api/v1/admin/auth/refresh`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Accept: "application/json" },
//         body: JSON.stringify({ refresh_token: refreshTok }),
//       });
//       if (!res.ok) return false;
//       const ct = res.headers.get("content-type") || "";
//       let data = null;
//       if (ct.includes("application/json")) { try { data = await res.json(); } catch { data = null; } }
//       const payload = data?.data || data || {};
//       const newAccess  = payload.access_token  || payload.accessToken;
//       const newRefresh = payload.refresh_token || payload.refreshToken;
//       if (!newAccess) return false;
//       localStorage.setItem(ACCESS_KEY, newAccess);
//       if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);
//       console.log("%c[auth] ✅ access token refreshed", "color:#10b981;font-weight:bold");
//       return true;
//     } catch { return false; }
//     finally { refreshInFlight = null; }
//   })();
//   return refreshInFlight;
// }

// async function apiRequest(path, { method = "GET", body, auth = true, extraHeaders = {}, returnResponse = false } = {}) {
//   const attempt = async () => {
//     const headers = { "Content-Type": "application/json", Accept: "application/json", ...extraHeaders };
//     if (auth) {
//       const t = getAccessToken();
//       if (t) headers.Authorization = `Bearer ${t}`;
//     }
//     console.log(
//       "%c[VEHICLES →] " + method + " " + path,
//       "color:#0ea5e9;font-weight:bold",
//       "\n  headers:", extraHeaders,
//       "\n  body:", body !== undefined ? JSON.stringify(body) : "(none)"
//     );
//     const controller = new AbortController();
//     const timer = setTimeout(() => controller.abort(), 30000);
//     let res;
//     try {
//       res = await fetch(`${BASE_URL}${path}`, {
//         method, headers,
//         body: body !== undefined ? JSON.stringify(body) : undefined,
//         signal: controller.signal,
//       });
//     } catch {
//       clearTimeout(timer);
//       const e = new Error("Network error — cannot reach Vehicles API.");
//       e.isNetworkError = true;
//       throw e;
//     } finally { clearTimeout(timer); }

//     const ct = res.headers.get("content-type") || "";
//     let data = null;
//     if (ct.includes("application/json")) { try { data = await res.json(); } catch { data = null; } }
//     else { try { data = await res.text(); } catch { data = null; } }
//     if (
//       data && typeof data === "object" && !Array.isArray(data) &&
//       "data" in data && !("error" in data) &&
//       Object.keys(data).length <= 2
//     ) data = data.data;
//     return { res, data };
//   };

//   let { res, data } = await attempt();

//   if (res.status === 401 && auth && !isAuthEndpoint(path)) {
//     const refreshed = await tryRefreshToken();
//     if (refreshed) {
//       ({ res, data } = await attempt());
//       if (res.ok) return returnResponse ? { data, headers: res.headers, status: res.status } : data;
//       if (res.status === 401) { clearSession(); throw new SessionExpiredError(); }
//     } else { clearSession(); throw new SessionExpiredError(); }
//   }

//   if (!res.ok) {
//     const msg =
//       (data && (data.message || data.error?.message ||
//         (typeof data.error === "string" ? data.error : null) || data.detail)) ||
//       `Request failed (${res.status})`;
//     const e = new Error(msg);
//     e.status  = res.status;
//     e.code    = data?.error?.code || data?.code;
//     e.details = data?.error?.details;
//     e.body    = data;
//     e.headers = res.headers;
//     throw e;
//   }
//   return returnResponse ? { data, headers: res.headers, status: res.status } : data;
// }

// /* ==================== HELPERS ==================== */
// function toArray(v) { return Array.isArray(v) ? v : v ? [v] : []; }

// function extractVehicles(res) {
//   if (!res) return [];
//   if (Array.isArray(res)) return res;
//   return toArray(res.vehicles || res.items || res.data?.vehicles || res.data?.items || res.data || []);
// }
// function extractHistory(res) {
//   if (!res) return [];
//   if (Array.isArray(res)) return res;
//   return toArray(res.history || res.events || res.items || res.data?.history || res.data?.events || res.data || []);
// }
// function extractAvailability(res) {
//   if (!res) return null;
//   return res.availability || res.data?.availability || res.data || res;
// }
// function extractVersion(res) {
//   if (!res) return null;
//   return res.version ?? res.data?.version ?? null;
// }

// function vehicleStatus(v) {
//   if (!v) return "unknown";
//   const s = (v.status || v.state || v.lifecycle_status || "").toLowerCase();
//   if (s) return s;
//   if (v.is_active === false || v.deactivated) return "inactive";
//   if (v.in_maintenance || v.maintenance)      return "maintenance";
//   return "active";
// }
// function statusStyle(status) {
//   const s = (status || "").toLowerCase();
//   if (s.includes("mainten"))
//     return { bg: "from-amber-400 to-orange-500", chip: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-500", label: "In Maintenance" };
//   if (s.includes("deactiv") || s.includes("inactive") || s.includes("offline"))
//     return { bg: "from-slate-400 to-slate-600", chip: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-500", label: "Inactive" };
//   return { bg: "from-emerald-400 to-teal-500", chip: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500", label: "Active" };
// }
// function fmtDate(d) {
//   if (!d) return "—";
//   try { const dt = new Date(d); if (isNaN(dt.getTime())) return String(d);
//     return dt.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
//   } catch { return String(d); }
// }
// function fmtDateOnly(d) {
//   if (!d) return "—";
//   try { const dt = new Date(d); if (isNaN(dt.getTime())) return String(d);
//     return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
//   } catch { return String(d); }
// }
// function toIsoUtc(localValue) {
//   if (!localValue) return localValue;
//   try { const d = new Date(localValue); if (isNaN(d.getTime())) return localValue; return d.toISOString(); }
//   catch { return localValue; }
// }
// function toLocalIso(localValue) {
//   if (!localValue) return localValue;
//   if (/T\d{2}:\d{2}$/.test(localValue)) return localValue + ":00";
//   return localValue;
// }
// function dateOnly(d) {
//   if (!d) return undefined;
//   try {
//     const dt = new Date(d);
//     if (isNaN(dt.getTime())) return String(d).slice(0, 10);
//     return dt.toISOString().slice(0, 10);
//   } catch { return undefined; }
// }

// /* ==================== BODY BUILDERS ==================== */
// function buildVehicleBody(fields, { includeEmpty = false } = {}) {
//   const body = {};
//   const trim = (v) => (typeof v === "string" ? v.trim() : v);
//   const setIf = (k, val) => {
//     const v = trim(val);
//     if (includeEmpty) { body[k] = v ?? ""; return; }
//     if (v !== undefined && v !== null && v !== "") body[k] = v;
//   };
//   setIf("asset_tag", fields.asset_tag);
//   setIf("registration_number", fields.registration_number);
//   setIf("make", fields.make);
//   setIf("model", fields.model);
//   setIf("variant", fields.variant);
//   setIf("vehicle_type", fields.vehicle_type);
//   setIf("ownership_type", fields.ownership_type);
//   setIf("registration_valid_until", dateOnly(fields.registration_valid_until));
//   setIf("insurance_valid_until", dateOnly(fields.insurance_valid_until));
//   // ✅ Sanitize inspection_status — only include if backend-valid
//   const sanitizedInspection = sanitizeInspection(fields.inspection_status);
//   if (sanitizedInspection) body.inspection_status = sanitizedInspection;
//   setIf("notes", fields.notes);
//   return body;
// }

// function buildFullBodyFromVehicle(v) {
//   const sanitizedInspection = sanitizeInspection(v.inspection_status);
//   return {
//     asset_tag: v.asset_tag || undefined,
//     registration_number: v.registration_number || undefined,
//     make: v.make || undefined,
//     model: v.model || undefined,
//     variant: v.variant || undefined,
//     vehicle_type: v.vehicle_type || undefined,
//     ownership_type: v.ownership_type || undefined,
//     registration_valid_until: dateOnly(v.registration_valid_until),
//     insurance_valid_until: dateOnly(v.insurance_valid_until),
//     // ✅ Only include if valid — omit legacy PASSED/PENDING
//     ...(sanitizedInspection ? { inspection_status: sanitizedInspection } : {}),
//     notes: v.notes || undefined,
//   };
// }

// /* ==================== FETCH ETAG + VERSION ==================== */
// async function fetchVehicleMeta(vehicleId) {
//   try {
//     const { data, headers } = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}`, {
//       returnResponse: true,
//     });
//     const etagHeader = headers.get("ETag") || headers.get("etag");
//     const version    = extractVersion(data);
//     console.log(
//       "%c[fetch-vehicle] version:", "color:#8b5cf6;font-weight:bold",
//       version, "| ETag header:", etagHeader || "(none)"
//     );
//     return { data, etag: etagHeader, version };
//   } catch (err) {
//     console.warn("[fetch-vehicle] failed:", err?.message);
//     return { data: null, etag: null, version: null };
//   }
// }

// function pickIfMatch({ version, etag }) {
//   if (version !== null && version !== undefined) return ifMatchHeader(version);
//   if (etag) return etag;
//   return null;
// }

// /* ==================================================================
//  *  GENERIC WRAPPER for deactivate/reactivate — fetch → If-Match → send
//  * ================================================================== */
// async function mutationWithIfMatch(vehicleId, { method, path, body, maxRetries = 1 }) {
//   let { version, etag } = await fetchVehicleMeta(vehicleId);
//   let ifMatch = pickIfMatch({ version, etag });

//   const buildHeaders = () => {
//     const h = { "Idempotency-Key": uuid() };
//     if (ifMatch) h["If-Match"] = ifMatch;
//     return h;
//   };

//   const send = () => apiRequest(path, { method, body, extraHeaders: buildHeaders() });

//   try {
//     return await send();
//   } catch (err) {
//     const retryable = err.status === 412 || err.status === 428 || err.status === 409;
//     if (!retryable || maxRetries <= 0) throw err;

//     console.warn(`[mutation] ${err.status} — re-fetching version + retrying (${maxRetries} left)…`);
//     const fresh = await fetchVehicleMeta(vehicleId);
//     ifMatch = pickIfMatch(fresh);
//     return await send();
//   }
// }

// /* ==================== CREATE ==================== */
// async function createVehicleMultiShape(fields) {
//   const base = buildVehicleBody(fields);
//   const withUnknown = { ...base, inspection_status: "UNKNOWN" };
//   const withLowerEnums = {
//     ...withUnknown,
//     vehicle_type: withUnknown.vehicle_type ? String(withUnknown.vehicle_type).toLowerCase() : undefined,
//     ownership_type: withUnknown.ownership_type ? String(withUnknown.ownership_type).toLowerCase() : undefined,
//   };
//   const noVariant = { ...withUnknown };
//   delete noVariant.variant;
//   const minimalUnknown = {
//     asset_tag: base.asset_tag, registration_number: base.registration_number, inspection_status: "UNKNOWN",
//   };
//   const minimal = { asset_tag: base.asset_tag, registration_number: base.registration_number };
//   const chargingUnit = { ...withUnknown, vehicle_type: "CHARGING_UNIT" };

//   const attempts = [
//     { label: "as-entered",                    body: base },
//     { label: "inspection=UNKNOWN",            body: withUnknown },
//     { label: "UNKNOWN + lowercase enums",     body: withLowerEnums },
//     { label: "UNKNOWN + no variant",          body: noVariant },
//     { label: "minimal + UNKNOWN",             body: minimalUnknown },
//     { label: "minimal (2 fields)",            body: minimal },
//     { label: "UNKNOWN + type=CHARGING_UNIT",  body: chargingUnit },
//   ];

//   const failures = [];
//   for (const a of attempts) {
//     Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);
//     try {
//       console.log(`%c[create-vehicle] try: ${a.label}`, "color:#f59e0b;font-weight:bold", "\n  body:", JSON.stringify(a.body));
//       const res = await apiRequest("/api/v1/admin/vehicles", {
//         method: "POST", body: a.body,
//         extraHeaders: { "Idempotency-Key": uuid() },
//       });
//       console.log(`%c[create-vehicle] ✅ ACCEPTED: ${a.label}`, "color:#10b981;font-weight:bold;font-size:14px");
//       return { res, usedLabel: a.label };
//     } catch (err) {
//       if (err.code !== "VALIDATION_FAILED") throw err;
//       console.warn(`[create-vehicle] ✗ ${a.label}:`, err.code, err.message);
//       failures.push({ label: a.label, code: err.code, message: err.message });
//     }
//   }
//   const e = new Error(
//     `Server rejected all ${attempts.length} payload variations with VALIDATION_FAILED. ` +
//     "Open DevTools → Network → click POST /vehicles → copy Request Payload + Response."
//   );
//   e.code = "VALIDATION_FAILED";
//   e.failures = failures;
//   throw e;
// }

// /* ==================== PATCH VEHICLE ==================== */
// async function updateVehicleMultiShape(vehicleId, changedFields, currentVehicle) {
//   const meta = await fetchVehicleMeta(vehicleId);
//   const version = meta.version ?? extractVersion(currentVehicle);
//   let ifMatch = pickIfMatch({ version, etag: meta.etag });
//   if (!ifMatch) {
//     throw new Error("Cannot update — backend returned no version or ETag.");
//   }

//   const changedBody = buildVehicleBody(changedFields);
//   const fullBody = buildFullBodyFromVehicle(currentVehicle || {});
//   Object.assign(fullBody, changedBody);
//   // ✅ No forced "UNKNOWN" — builders already sanitized.

//   const bodyShapes = [
//     { label: "all vehicle fields", body: fullBody },
//     { label: "changed fields only", body: changedBody },
//   ];

//   const failures = [];

//   for (const [index, bodyShape] of bodyShapes.entries()) {
//     const body = Object.fromEntries(
//       Object.entries(bodyShape.body).filter(([, value]) => value !== undefined)
//     );
//     let refreshedVersion = false;

//     while (true) {
//       try {
//         const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}`, {
//           method: "PATCH",
//           body,
//           extraHeaders: {
//             "Idempotency-Key": uuid(),
//             "If-Match": ifMatch,
//           },
//         });
//         return { res, usedLabel: bodyShape.label };
//       } catch (err) {
//         failures.push({
//           attempt: failures.length + 1,
//           body: bodyShape.label,
//           ifMatch,
//           status: err.status,
//           code: err.code,
//           message: err.message,
//         });

//         if ((err.status === 412 || err.status === 428) && !refreshedVersion) {
//           const fresh = await fetchVehicleMeta(vehicleId);
//           const freshIfMatch = pickIfMatch(fresh);
//           if (!freshIfMatch) {
//             err.failures = failures;
//             throw err;
//           }
//           ifMatch = freshIfMatch;
//           refreshedVersion = true;
//           continue;
//         }

//         const validationFailed =
//           err.code === "VALIDATION_FAILED" || err.status === 400 || err.status === 422;
//         if (validationFailed && index < bodyShapes.length - 1) break;

//         err.failures = failures;
//         throw err;
//       }
//     }
//   }

//   const lastFailure = failures[failures.length - 1];
//   const error = new Error(lastFailure?.message || "The server rejected the vehicle update.");
//   error.code = lastFailure?.code || "VALIDATION_FAILED";
//   error.status = lastFailure?.status;
//   error.failures = failures;
//   throw error;
// }

// /* ==================== MAINTENANCE ==================== */
// async function recordMaintenanceMultiShape(vehicleId, data) {
//   const startIso = toIsoUtc(data.start_at);
//   const endIso   = toIsoUtc(data.end_at);
//   const startLocalIso = toLocalIso(data.start_at);
//   const endLocalIso   = toLocalIso(data.end_at);
//   const reason = data.reason?.trim() || undefined;

//   const attempts = [
//     { label: "{ start_at, end_at, reason }",              body: { start_at: startIso, end_at: endIso, reason } },
//     { label: "{ starts_at, ends_at, reason }",            body: { starts_at: startIso, ends_at: endIso, reason } },
//     { label: "{ start_time, end_time, reason }",          body: { start_time: startIso, end_time: endIso, reason } },
//     { label: "{ from, to, reason }",                      body: { from: startIso, to: endIso, reason } },
//     { label: "{ start, end, reason }",                    body: { start: startIso, end: endIso, reason } },
//     { label: "{ window_start, window_end, reason }",      body: { window_start: startIso, window_end: endIso, reason } },
//     { label: "{ scheduled_start, scheduled_end, reason }",body: { scheduled_start: startIso, scheduled_end: endIso, reason } },
//     { label: "{ start_at, end_at } (no reason)",          body: { start_at: startIso, end_at: endIso } },
//     { label: "{ start_at, end_at, notes }",               body: { start_at: startIso, end_at: endIso, notes: reason } },
//     { label: "{ window: { start, end }, reason }",        body: { window: { start: startIso, end: endIso }, reason } },
//     { label: "{ start_at, end_at, reason } (local)",      body: { start_at: startLocalIso, end_at: endLocalIso, reason } },
//     { label: "{ starts_at, ends_at, reason } (local)",    body: { starts_at: startLocalIso, ends_at: endLocalIso, reason } },
//   ];

//   const failures = [];
//   for (const a of attempts) {
//     Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);
//     try {
//       console.log(`%c[maintenance] try: ${a.label}`, "color:#f59e0b;font-weight:bold", "\n  body:", JSON.stringify(a.body));
//       const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}/maintenance`, {
//         method: "POST",
//         body: a.body,
//         extraHeaders: { "Idempotency-Key": uuid() },
//       });
//       console.log(`%c[maintenance] ✅ ACCEPTED: ${a.label}`, "color:#10b981;font-weight:bold;font-size:14px");
//       return { res, usedLabel: a.label };
//     } catch (err) {
//       if (err.code !== "VALIDATION_FAILED") throw err;
//       console.warn(`[maintenance] ✗ ${a.label}:`, err.code, err.message);
//       failures.push({ label: a.label, code: err.code, message: err.message });
//     }
//   }
//   const e = new Error(
//     `Server rejected all ${attempts.length} maintenance payload shapes. ` +
//     "Open DevTools → Network → click POST /maintenance → copy Request Payload + Response."
//   );
//   e.code = "VALIDATION_FAILED";
//   e.failures = failures;
//   throw e;
// }

// /* ==================== DEACTIVATE / REACTIVATE ==================== */
// async function deactivateVehicle(vehicleId, reason) {
//   const trimmed = (reason || "").trim();
//   if (!trimmed) throw new Error("A reason is required to deactivate a vehicle.");
//   return mutationWithIfMatch(vehicleId, {
//     method: "POST",
//     path: `/api/v1/admin/vehicles/${vehicleId}/deactivate`,
//     body: { reason: trimmed },
//   });
// }
// async function reactivateVehicle(vehicleId, reason) {
//   const trimmed = (reason || "").trim();
//   if (!trimmed) throw new Error("A reason is required to reactivate a vehicle.");
//   return mutationWithIfMatch(vehicleId, {
//     method: "POST",
//     path: `/api/v1/admin/vehicles/${vehicleId}/reactivate`,
//     body: { reason: trimmed },
//   });
// }

// /* ==================== SMALL UI ==================== */
// function StatusBadge({ status }) {
//   const s = statusStyle(status);
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${s.chip}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
//       {s.label}
//     </span>
//   );
// }
// function Spinner({ label = "Loading…" }) {
//   return (
//     <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
//       <FaSpinner className="animate-spin" size={26} />
//       <p className="text-xs">{label}</p>
//     </div>
//   );
// }
// function ErrorBox({ message }) {
//   return (
//     <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
//       <FaExclamationCircle className="text-rose-500 shrink-0 mt-0.5" size={14} />
//       <span className="text-rose-700 text-xs">{message}</span>
//     </div>
//   );
// }
// function StatCard({ icon: Icon, label, value, gradient }) {
//   return (
//     <div className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-lg ${gradient}`}>
//       <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/15 rounded-full blur-2xl" />
//       <div className="relative">
//         <Icon className="opacity-80" size={16} />
//         <div className="text-2xl font-black mt-1.5 leading-none">{value}</div>
//         <div className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">{label}</div>
//       </div>
//     </div>
//   );
// }

// const VEHICLE_TYPES    = ["VAN", "TRUCK", "CAR", "BIKE", "CHARGING_UNIT", "OTHER"];
// const OWNERSHIP_TYPES  = ["OWNED", "LEASED", "RENTED", "THIRD_PARTY"];

// function Field({ label, required, hint, children }) {
//   return (
//     <div>
//       <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
//         {label} {required && <span className="text-rose-500">*</span>}
//       </label>
//       {children}
//       {hint && <p className="text-[10px] text-slate-500 mt-1 leading-snug">{hint}</p>}
//     </div>
//   );
// }
// const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200";

// /* ==================== CREATE MODAL ==================== */
// function CreateVehicleModal({ open, onClose, onSuccess }) {
//   const emptyForm = {
//     asset_tag: "", registration_number: "",
//     make: "", model: "", variant: "",
//     vehicle_type: "VAN", ownership_type: "OWNED",
//     registration_valid_until: "", insurance_valid_until: "",
//     inspection_status: "UNKNOWN", notes: "",
//   };
//   const [form, setForm] = useState(emptyForm);
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState(null);
//   const [successLabel, setSuccessLabel] = useState(null);
//   const firstRef = useRef(null);

//   useEffect(() => {
//     if (open) {
//       setForm(emptyForm);
//       setError(null); setBusy(false); setSuccessLabel(null);
//       setTimeout(() => firstRef.current?.focus(), 120);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   useEffect(() => {
//     const onKey = (e) => { if (e.key === "Escape" && !busy) onClose(); };
//     if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
//     return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
//   }, [open, busy, onClose]);

//   if (!open) return null;
//   const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!form.asset_tag.trim())           return setError("Asset tag is required.");
//     if (!form.registration_number.trim()) return setError("Registration number is required.");
//     setBusy(true); setError(null); setSuccessLabel(null);
//     try {
//       const { usedLabel } = await createVehicleMultiShape(form);
//       setSuccessLabel(usedLabel);
//       onSuccess?.(usedLabel);
//       setTimeout(() => { setBusy(false); onClose(); }, 1400);
//     } catch (err) {
//       console.error("[create-vehicle] final error:", err);
//       if (err.isSessionExpired) setError(err.message);
//       else if (err.code === "VALIDATION_FAILED") setError(err.message);
//       else if (err.status === 409) setError("A vehicle with this asset tag or registration already exists.");
//       else if (err.status === 403) setError("You need the fleet.manage capability to create vehicles.");
//       else setError(err.message || "Failed to create vehicle.");
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => !busy && onClose()} />
//       <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-white shadow-2xl shadow-sky-900/20 animate-[scaleIn_0.2s_ease-out]">
//         <div className="relative bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500 p-6 pb-8 text-white">
//           <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
//           <button onClick={() => !busy && onClose()}
//             className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
//             <FaTimes size={12} />
//           </button>
//           <div className="relative flex items-center gap-3">
//             <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30">
//               <FaTruck size={18} />
//             </div>
//             <div>
//               <h3 className="text-lg font-black tracking-tight">Register Service Vehicle</h3>
//               <p className="text-[11px] text-sky-50/90">Requires fleet.manage capability</p>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={submit} className="p-6 space-y-4 -mt-4 relative max-h-[75vh] overflow-y-auto">
//           {successLabel && (
//             <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
//               <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
//               <div>
//                 <p className="text-emerald-800 text-xs font-bold">✅ Vehicle created successfully!</p>
//                 <p className="text-emerald-700 text-[10px] mt-0.5">
//                   Accepted payload shape: <code className="font-mono bg-emerald-100 px-1 rounded">{successLabel}</code>
//                 </p>
//               </div>
//             </div>
//           )}
//           {error && <ErrorBox message={error} />}

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <Field label="Asset Tag" required>
//               <input ref={firstRef} value={form.asset_tag} onChange={onChange("asset_tag")} placeholder="e.g. FLT-0007" className={inputCls + " font-mono"} disabled={busy} />
//             </Field>
//             <Field label="Registration Number" required>
//               <input value={form.registration_number} onChange={onChange("registration_number")} placeholder="e.g. DHK-GA-1234" className={inputCls + " font-mono"} disabled={busy} />
//             </Field>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//             <Field label="Make"><input value={form.make} onChange={onChange("make")} placeholder="Tesla" className={inputCls} disabled={busy} /></Field>
//             <Field label="Model"><input value={form.model} onChange={onChange("model")} placeholder="Model 3" className={inputCls} disabled={busy} /></Field>
//             <Field label="Variant"><input value={form.variant} onChange={onChange("variant")} placeholder="Long Range" className={inputCls} disabled={busy} /></Field>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <Field label="Vehicle Type">
//               <select value={form.vehicle_type} onChange={onChange("vehicle_type")} className={inputCls} disabled={busy}>
//                 {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//             </Field>
//             <Field label="Ownership Type">
//               <select value={form.ownership_type} onChange={onChange("ownership_type")} className={inputCls} disabled={busy}>
//                 {OWNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//               </select>
//             </Field>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <Field label="Registration Valid Until"><input type="date" value={form.registration_valid_until} onChange={onChange("registration_valid_until")} className={inputCls} disabled={busy} /></Field>
//             <Field label="Insurance Valid Until"><input type="date" value={form.insurance_valid_until} onChange={onChange("insurance_valid_until")} className={inputCls} disabled={busy} /></Field>
//           </div>
//           <Field label="Inspection Status" hint="New vehicles start as UNKNOWN. Use Edit later to mark VALID.">
//             <select value={form.inspection_status} onChange={onChange("inspection_status")} className={inputCls} disabled={busy}>
//               {INSPECTION_STATES.map((t) => <option key={t} value={t}>{t}</option>)}
//             </select>
//           </Field>
//           <Field label="Notes">
//             <textarea value={form.notes} onChange={onChange("notes")} rows={2} placeholder="Optional notes…" className={inputCls + " resize-none"} disabled={busy} />
//           </Field>

//           <div className="flex items-center gap-2 pt-2">
//             <button type="button" onClick={() => !busy && onClose()} disabled={busy}
//               className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition">
//               Cancel
//             </button>
//             <button type="submit" disabled={busy}
//               className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-400 hover:via-blue-400 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
//               {busy ? (<><FaSpinner className="animate-spin" size={13} /> Creating…</>) : (<><FaPlus size={12} /> Create Vehicle</>)}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ==================== DETAIL DRAWER ==================== */
// function DetailDrawer({ vehicle, onClose, onRefresh }) {
//   const [tab, setTab] = useState("overview");
//   const [history, setHistory]   = useState(null);
//   const [avail, setAvail]       = useState(null);
//   const [loadingH, setLoadingH] = useState(false);
//   const [loadingA, setLoadingA] = useState(false);
//   const [errorH, setErrorH]     = useState(null);
//   const [errorA, setErrorA]     = useState(null);

//   const [fresh, setFresh]               = useState(vehicle);
//   const [freshVersion, setFreshVersion] = useState(null);
//   const [freshEtag, setFreshEtag]       = useState(null);
//   const [refreshing, setRefreshing]     = useState(false);

//   const [edit, setEdit]               = useState(null);
//   const [editBusy, setEditBusy]       = useState(false);
//   const [editErr, setEditErr]         = useState(null);
//   const [editLabel, setEditLabel]     = useState(null);
//   const [editFailures, setEditFailures] = useState(null);

//   const [maint, setMaint]           = useState({ start_at: "", end_at: "", reason: "" });
//   const [maintBusy, setMaintBusy]   = useState(false);
//   const [maintErr, setMaintErr]     = useState(null);
//   const [maintOk, setMaintOk]       = useState(null);
//   const [maintLabel, setMaintLabel] = useState(null);

//   const [actionReason, setActionReason] = useState("");
//   const [actionBusy, setActionBusy]     = useState(false);
//   const [actionErr, setActionErr]       = useState(null);

//   const [copied, setCopied] = useState(false);

//   const vehicleId = vehicle?.id || vehicle?.vehicle_id || vehicle?.uuid;
//   const shown     = fresh || vehicle;

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (!vehicleId) return;
//       setRefreshing(true);
//       const meta = await fetchVehicleMeta(vehicleId);
//       if (cancelled) return;
//       if (meta.data) setFresh(meta.data);
//       setFreshVersion(meta.version);
//       setFreshEtag(meta.etag);
//       setRefreshing(false);
//     })();
//     return () => { cancelled = true; };
//   }, [vehicleId]);

//   useEffect(() => {
//     setTab("overview");
//     setHistory(null); setAvail(null);
//     setErrorH(null); setErrorA(null);
//     setEditErr(null); setEditLabel(null); setEditFailures(null);
//     setMaintErr(null); setMaintOk(null); setMaintLabel(null);
//     setActionErr(null); setActionReason("");

//     const v = shown || {};
//     setEdit({
//       asset_tag: v.asset_tag || "",
//       registration_number: v.registration_number || "",
//       make: v.make || "",
//       model: v.model || "",
//       variant: v.variant || "",
//       vehicle_type: v.vehicle_type || "VAN",
//       ownership_type: v.ownership_type || "OWNED",
//       registration_valid_until: v.registration_valid_until ? String(v.registration_valid_until).slice(0, 10) : "",
//       insurance_valid_until:    v.insurance_valid_until    ? String(v.insurance_valid_until).slice(0, 10)    : "",
//       // ✅ Sanitize — blank if legacy value like PASSED/PENDING
//       inspection_status: sanitizeInspection(v.inspection_status) || "",
//       notes: v.notes || "",
//     });
//     setMaint({ start_at: "", end_at: "", reason: "" });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [shown]);

//   const loadHistory = useCallback(async () => {
//     if (!vehicleId) return;
//     setLoadingH(true); setErrorH(null);
//     try {
//       const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}/history`);
//       setHistory(extractHistory(res));
//     } catch (err) { setErrorH(err.message); }
//     finally { setLoadingH(false); }
//   }, [vehicleId]);

//   const loadAvailability = useCallback(async () => {
//     if (!vehicleId) return;
//     setLoadingA(true); setErrorA(null);
//     try {
//       const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}/availability`);
//       setAvail(extractAvailability(res));
//     } catch (err) { setErrorA(err.message); }
//     finally { setLoadingA(false); }
//   }, [vehicleId]);

//   useEffect(() => {
//     if (tab === "history" && history === null) loadHistory();
//     if (tab === "availability" && avail === null) loadAvailability();
//   }, [tab, history, avail, loadHistory, loadAvailability]);

//   const handleSaveEdit = async (e) => {
//     e.preventDefault();
//     if (!vehicleId) return;
//     setEditBusy(true); setEditErr(null); setEditLabel(null); setEditFailures(null);
//     try {
//       const v = shown || {};
//       const changed = {};
//       const trim = (s) => (typeof s === "string" ? s.trim() : s);
//       const diff = (newVal, oldVal) => trim(newVal) !== trim(oldVal ?? "");

//       if (diff(edit.asset_tag, v.asset_tag))                     changed.asset_tag = edit.asset_tag.trim();
//       if (diff(edit.registration_number, v.registration_number)) changed.registration_number = edit.registration_number.trim();
//       if (diff(edit.make, v.make))                               changed.make = edit.make.trim();
//       if (diff(edit.model, v.model))                             changed.model = edit.model.trim();
//       if (diff(edit.variant, v.variant))                         changed.variant = edit.variant.trim();
//       if (diff(edit.vehicle_type, v.vehicle_type))               changed.vehicle_type = edit.vehicle_type;
//       if (diff(edit.ownership_type, v.ownership_type))           changed.ownership_type = edit.ownership_type;
//       if (diff(edit.registration_valid_until, v.registration_valid_until ? String(v.registration_valid_until).slice(0, 10) : ""))
//         changed.registration_valid_until = edit.registration_valid_until;
//       if (diff(edit.insurance_valid_until, v.insurance_valid_until ? String(v.insurance_valid_until).slice(0, 10) : ""))
//         changed.insurance_valid_until = edit.insurance_valid_until;
//       // ✅ Only send inspection_status if user picked a valid value and it differs
//       if (edit.inspection_status) {
//         const sanitized = sanitizeInspection(edit.inspection_status);
//         const currentSanitized = sanitizeInspection(v.inspection_status);
//         if (sanitized && sanitized !== currentSanitized) {
//           changed.inspection_status = sanitized;
//         }
//       }
//       if (diff(edit.notes, v.notes))                             changed.notes = edit.notes.trim();

//       if (Object.keys(changed).length === 0) {
//         setEditErr("No changes to save.");
//         setEditBusy(false);
//         return;
//       }

//       const { usedLabel } = await updateVehicleMultiShape(vehicleId, changed, v);
//       setEditLabel(usedLabel);
//       onRefresh?.();
//       setTimeout(() => { setEditBusy(false); onClose(); }, 1200);
//     } catch (err) {
//       console.error("[edit] error:", err);
//       if (err.failures) setEditFailures(err.failures);
//       if (err.isSessionExpired) setEditErr(err.message);
//       else if (err.status === 428) setEditErr("The vehicle version changed. Refresh the vehicle and try again.");
//       else if (err.status === 412) setEditErr("Version conflict — someone else updated this vehicle. See details below.");
//       else if (err.status === 409) setEditErr("Version conflict — see details below.");
//       else if (err.code === "VALIDATION_FAILED") setEditErr(err.message);
//       else setEditErr(err.message || "Failed to update vehicle.");
//       setEditBusy(false);
//     }
//   };

//   const handleDeactivate = async () => {
//     if (!vehicleId) return;
//     const r = actionReason.trim();
//     if (!r) { setActionErr("Please enter a reason for deactivation."); return; }
//     if (!window.confirm(`Deactivate this vehicle?\n\nReason: ${r}`)) return;
//     setActionBusy(true); setActionErr(null);
//     try {
//       await deactivateVehicle(vehicleId, r);
//       onRefresh?.();
//       onClose();
//     } catch (err) {
//       console.error("[deactivate] error:", err);
//       if (err.status === 428) setActionErr("Server requires If-Match — please retry.");
//       else if (err.status === 412) setActionErr("Version conflict — refresh and retry.");
//       else setActionErr(err.message || "Failed to deactivate.");
//     } finally { setActionBusy(false); }
//   };

//   const handleReactivate = async () => {
//     if (!vehicleId) return;
//     const r = actionReason.trim();
//     if (!r) { setActionErr("Please enter a reason for reactivation."); return; }
//     if (!window.confirm(`Reactivate this vehicle?\n\nReason: ${r}`)) return;
//     setActionBusy(true); setActionErr(null);
//     try {
//       await reactivateVehicle(vehicleId, r);
//       onRefresh?.();
//       onClose();
//     } catch (err) {
//       console.error("[reactivate] error:", err);
//       if (err.status === 428) setActionErr("Server requires If-Match — please retry.");
//       else if (err.status === 412) setActionErr("Version conflict — refresh and retry.");
//       else setActionErr(err.message || "Failed to reactivate.");
//     } finally { setActionBusy(false); }
//   };

//   const handleMaintenance = async (e) => {
//     e.preventDefault();
//     if (!vehicleId) return;
//     if (!maint.start_at || !maint.end_at) return setMaintErr("Start and end time are required.");
//     if (new Date(maint.end_at) <= new Date(maint.start_at))
//       return setMaintErr("End time must be after start time.");

//     setMaintBusy(true); setMaintErr(null); setMaintOk(null); setMaintLabel(null);
//     try {
//       const { usedLabel } = await recordMaintenanceMultiShape(vehicleId, maint);
//       setMaintLabel(usedLabel);
//       setMaintOk("✅ Maintenance window recorded.");
//       setMaint({ start_at: "", end_at: "", reason: "" });
//       onRefresh?.();
//     } catch (err) {
//       console.error("[maintenance] final error:", err);
//       if (err.code === "VALIDATION_FAILED") setMaintErr(err.message);
//       else if (err.status === 409) setMaintErr("Overlaps with an existing maintenance window.");
//       else setMaintErr(err.message || "Failed to record maintenance.");
//     } finally { setMaintBusy(false); }
//   };

//   const copyFailures = async () => {
//     if (!editFailures) return;
//     try {
//       await navigator.clipboard.writeText(JSON.stringify(editFailures, null, 2));
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1500);
//     } catch { /* ignore */ }
//   };

//   if (!shown) return null;

//   const status = vehicleStatus(shown);
//   const style  = statusStyle(status);
//   const displayTitle = shown.asset_tag || shown.registration_number || shown.name || "Vehicle";
//   const displaySub   = shown.registration_number || shown.asset_tag || vehicleId;
//   const isInactive   = status.includes("inactive") || status.includes("deactiv");
//   const shownVersion = freshVersion ?? shown.version;

//   const tabs = [
//     { id: "overview",     label: "Overview",     icon: FaInfoCircle },
//     { id: "history",      label: "History",      icon: FaHistory },
//     { id: "availability", label: "Availability", icon: FaCalendarCheck },
//     { id: "maintenance",  label: "Maintenance",  icon: FaWrench },
//     { id: "edit",         label: "Edit",         icon: FaEdit },
//   ];

//   return (
//     <div className="fixed inset-0 z-[90] flex justify-end">
//       <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-[slideIn_0.25s_ease-out]">
//         <div className={`relative bg-gradient-to-br ${style.bg} p-5 text-white shrink-0`}>
//           <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
//           <button onClick={onClose}
//             className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
//             <FaTimes size={12} />
//           </button>
//           <div className="relative flex items-start gap-3">
//             <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
//               <FaTruck size={22} />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h2 className="text-xl font-black tracking-tight truncate">{displayTitle}</h2>
//               <p className="text-[11px] font-mono text-white/90 truncate mt-0.5">{displaySub}</p>
//               <div className="flex flex-wrap gap-1.5 mt-2">
//                 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/30">
//                   <span className="w-1.5 h-1.5 rounded-full bg-white" />
//                   {style.label}
//                 </span>
//                 {shown.vehicle_type && (
//                   <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/30">
//                     {shown.vehicle_type}
//                   </span>
//                 )}
//                 {refreshing && (
//                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/30">
//                     <FaSpinner className="animate-spin" size={9} /> Syncing
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="shrink-0 border-b border-slate-200 bg-white px-2 overflow-x-auto">
//           <div className="flex items-center gap-1">
//             {tabs.map(({ id, label, icon: Icon }) => (
//               <button key={id} onClick={() => setTab(id)}
//                 className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
//                   tab === id ? "border-sky-500 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-800"
//                 }`}>
//                 <Icon size={11} /> {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-5 space-y-4">
//           {actionErr && <ErrorBox message={actionErr} />}

//           {tab === "overview" && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-2">
//                 <DetailRow icon={FaTag}         label="Asset Tag"      value={shown.asset_tag} />
//                 <DetailRow icon={FaClipboard}   label="Registration"   value={shown.registration_number} />
//                 <DetailRow icon={FaCar}         label="Make"           value={shown.make} />
//                 <DetailRow icon={FaCar}         label="Model"          value={shown.model} />
//                 <DetailRow icon={FaCar}         label="Variant"        value={shown.variant} />
//                 <DetailRow icon={FaTruck}       label="Type"           value={shown.vehicle_type} />
//                 <DetailRow icon={FaInfoCircle}  label="Ownership"      value={shown.ownership_type} />
//                 <DetailRow icon={FaCheckCircle} label="Inspection"     value={shown.inspection_status} />
//                 <DetailRow icon={FaCalendarCheck} label="Reg. Valid Until" value={fmtDateOnly(shown.registration_valid_until)} />
//                 <DetailRow icon={FaCalendarCheck} label="Insurance Until"  value={fmtDateOnly(shown.insurance_valid_until)} />
//                 <DetailRow icon={FaLock}        label="Version"        value={shownVersion} />
//                 <DetailRow icon={FaClock}       label="Created"        value={fmtDate(shown.created_at)} />
//               </div>

//               {shownVersion !== null && shownVersion !== undefined && (
//                 <div className="p-2 rounded-lg bg-violet-50 border border-violet-200">
//                   <div className="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-0.5">If-Match header on next mutation</div>
//                   <code className="text-[10px] font-mono text-violet-800 break-all">{ifMatchHeader(shownVersion)}</code>
//                 </div>
//               )}

//               {shown.notes && (
//                 <div>
//                   <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Notes</h4>
//                   <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 whitespace-pre-wrap">
//                     {shown.notes}
//                   </p>
//                 </div>
//               )}

//               <div className="pt-2 border-t border-slate-100">
//                 <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Actions</h4>

//                 <div className="mb-2">
//                   <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
//                     Reason <span className="text-rose-500">*</span>
//                   </label>
//                   <textarea
//                     value={actionReason}
//                     onChange={(e) => setActionReason(e.target.value)}
//                     rows={2}
//                     placeholder={isInactive ? "e.g. Repairs complete — back in service" : "e.g. Routine inspection required"}
//                     className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 resize-none"
//                     disabled={actionBusy}
//                   />
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   {isInactive ? (
//                     <button onClick={handleReactivate} disabled={actionBusy || !actionReason.trim()}
//                       className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
//                       {actionBusy ? <FaSpinner className="animate-spin" size={11} /> : <FaPlayCircle size={11} />}
//                       Reactivate
//                     </button>
//                   ) : (
//                     <button onClick={handleDeactivate} disabled={actionBusy || !actionReason.trim()}
//                       className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
//                       {actionBusy ? <FaSpinner className="animate-spin" size={11} /> : <FaPowerOff size={11} />}
//                       Deactivate
//                     </button>
//                   )}
//                   <button onClick={() => setTab("maintenance")}
//                     className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition">
//                     <FaWrench size={11} /> Schedule Maintenance
//                   </button>
//                 </div>

//                 {!actionReason.trim() && (
//                   <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
//                     <FaCommentDots size={9} /> Enter a reason above to enable Deactivate / Reactivate.
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {tab === "history" && (
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Append-only history</h4>
//                 <button onClick={loadHistory} className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1">
//                   <FaSyncAlt size={9} /> Refresh
//                 </button>
//               </div>
//               {loadingH && <Spinner label="Loading history…" />}
//               {errorH   && <ErrorBox message={errorH} />}
//               {!loadingH && !errorH && (!history || history.length === 0) && (
//                 <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">No history events yet.</p>
//               )}
//               {!loadingH && !errorH && history && history.length > 0 && (
//                 <ol className="relative border-l-2 border-slate-200 ml-2 space-y-3">
//                   {history.map((h, i) => (
//                     <li key={i} className="ml-4">
//                       <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-100" />
//                       <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
//                         <div className="flex items-center justify-between gap-2">
//                           <span className="text-xs font-bold text-slate-900">{h.event_type || h.type || h.action || "Event"}</span>
//                           <span className="text-[10px] text-slate-500">{fmtDate(h.created_at || h.timestamp || h.at)}</span>
//                         </div>
//                         {h.actor && <p className="text-[10px] text-slate-600 mt-0.5">By: {h.actor}</p>}
//                         {h.message && <p className="text-[11px] text-slate-700 mt-1">{h.message}</p>}
//                       </div>
//                     </li>
//                   ))}
//                 </ol>
//               )}
//             </div>
//           )}

//           {tab === "availability" && (
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inventory availability evidence</h4>
//                 <button onClick={loadAvailability} className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1">
//                   <FaSyncAlt size={9} /> Refresh
//                 </button>
//               </div>
//               {loadingA && <Spinner label="Loading availability…" />}
//               {errorA   && <ErrorBox message={errorA} />}
//               {!loadingA && !errorA && avail && (
//                 <pre className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-x-auto font-mono whitespace-pre-wrap">
//                   {JSON.stringify(avail, null, 2)}
//                 </pre>
//               )}
//               {!loadingA && !errorA && !avail && (
//                 <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">No availability data.</p>
//               )}
//             </div>
//           )}

//           {tab === "maintenance" && (
//             <form onSubmit={handleMaintenance} className="space-y-3">
//               <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
//                 <FaInfoCircle className="text-amber-600 shrink-0 mt-0.5" size={13} />
//                 <span className="text-amber-800 text-[11px]">Windows must not overlap with existing maintenance slots.</span>
//               </div>

//               {maintErr && <ErrorBox message={maintErr} />}
//               {maintOk && (
//                 <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
//                   <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
//                   <div>
//                     <p className="text-emerald-700 text-xs">{maintOk}</p>
//                     {maintLabel && (
//                       <p className="text-emerald-600 text-[10px] mt-0.5">
//                         Accepted shape: <code className="font-mono bg-emerald-100 px-1 rounded">{maintLabel}</code>
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <Field label="Start" required>
//                 <input type="datetime-local" value={maint.start_at}
//                   onChange={(e) => setMaint({ ...maint, start_at: e.target.value })}
//                   className={inputCls} disabled={maintBusy} />
//               </Field>
//               <Field label="End" required>
//                 <input type="datetime-local" value={maint.end_at}
//                   onChange={(e) => setMaint({ ...maint, end_at: e.target.value })}
//                   className={inputCls} disabled={maintBusy} />
//               </Field>
//               <Field label="Reason">
//                 <textarea value={maint.reason}
//                   onChange={(e) => setMaint({ ...maint, reason: e.target.value })}
//                   rows={2} placeholder="e.g. Routine inspection"
//                   className={inputCls + " resize-none"} disabled={maintBusy} />
//               </Field>
//               <button type="submit" disabled={maintBusy}
//                 className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/30 disabled:opacity-60">
//                 {maintBusy ? (<><FaSpinner className="animate-spin" size={13} /> Recording…</>) : (<><FaWrench size={12} /> Record Maintenance</>)}
//               </button>
//               <p className="text-[10px] text-slate-500 text-center">
//                 Dates are auto-converted to ISO-8601 UTC before sending.
//               </p>
//             </form>
//           )}

//           {tab === "edit" && edit && (
//             <form onSubmit={handleSaveEdit} className="space-y-3">
//               {editErr && <ErrorBox message={editErr} />}
//               {editLabel && (
//                 <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
//                   <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
//                   <div>
//                     <p className="text-emerald-800 text-xs font-bold">✅ Vehicle updated!</p>
//                     <p className="text-emerald-700 text-[10px] mt-0.5">
//                       Accepted PATCH shape: <code className="font-mono bg-emerald-100 px-1 rounded">{editLabel}</code>
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <Field label="Asset Tag"><input value={edit.asset_tag} onChange={(e) => setEdit({ ...edit, asset_tag: e.target.value })} className={inputCls + " font-mono"} disabled={editBusy} /></Field>
//                 <Field label="Registration Number"><input value={edit.registration_number} onChange={(e) => setEdit({ ...edit, registration_number: e.target.value })} className={inputCls + " font-mono"} disabled={editBusy} /></Field>
//                 <Field label="Make"><input value={edit.make} onChange={(e) => setEdit({ ...edit, make: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <Field label="Model"><input value={edit.model} onChange={(e) => setEdit({ ...edit, model: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <Field label="Variant"><input value={edit.variant} onChange={(e) => setEdit({ ...edit, variant: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <Field label="Vehicle Type">
//                   <select value={edit.vehicle_type} onChange={(e) => setEdit({ ...edit, vehicle_type: e.target.value })} className={inputCls} disabled={editBusy}>
//                     {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//                   </select>
//                 </Field>
//                 <Field label="Ownership Type">
//                   <select value={edit.ownership_type} onChange={(e) => setEdit({ ...edit, ownership_type: e.target.value })} className={inputCls} disabled={editBusy}>
//                     {OWNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
//                   </select>
//                 </Field>
//                 <Field label="Inspection Status" hint="Only UNKNOWN / VALID / FAILED / EXPIRED accepted by backend.">
//                   <select value={edit.inspection_status} onChange={(e) => setEdit({ ...edit, inspection_status: e.target.value })} className={inputCls} disabled={editBusy}>
//                     <option value="">— Leave unchanged —</option>
//                     {INSPECTION_STATES.map((t) => <option key={t} value={t}>{t}</option>)}
//                   </select>
//                 </Field>
//                 <Field label="Reg. Valid Until"><input type="date" value={edit.registration_valid_until} onChange={(e) => setEdit({ ...edit, registration_valid_until: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <Field label="Insurance Valid Until"><input type="date" value={edit.insurance_valid_until} onChange={(e) => setEdit({ ...edit, insurance_valid_until: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
//                 <div className="sm:col-span-2">
//                   <Field label="Notes">
//                     <textarea value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} rows={3} className={inputCls + " resize-none"} disabled={editBusy} />
//                   </Field>
//                 </div>
//               </div>

//               {/* ═══════════════════ BEAUTIFUL HINT BOX ═══════════════════ */}
//               <div className="relative overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-3.5">
//                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-300/30 rounded-full blur-3xl" />
//                 <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-indigo-300/25 rounded-full blur-3xl" />
//                 <div className="relative flex items-start gap-3">
//                   <div className="relative shrink-0">
//                     <div className="absolute inset-0 rounded-xl bg-sky-400/40 blur-md" />
//                     <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/40">
//                       <FaLock className="text-white" size={12} />
//                     </div>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-1.5 mb-1">
//                       <span className="relative flex h-2 w-2">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
//                         <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
//                       </span>
//                       <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">
//                         Optimistic Update
//                       </span>
//                     </div>
//                     <p className="text-[10.5px] text-sky-800 leading-relaxed">
//                       Fetches fresh version → sends{" "}
//                       <code className="font-mono bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded-md border border-sky-200 text-[10px]">
//                         If-Match: "{String(shownVersion ?? "")}"
//                       </code>{" "}
//                       + <code className="font-mono bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded-md border border-sky-200 text-[10px]">Idempotency-Key</code>.
//                       <strong> Version lives only in the header — never in the body.</strong>{" "}
//                       <code className="font-mono bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded-md border border-sky-200 text-[10px]">inspection_status</code>{" "}
//                       only accepts <strong>UNKNOWN / VALID / FAILED / EXPIRED</strong>.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* ═══════════════════ DEBUG PANEL ═══════════════════ */}
//               {editFailures && editFailures.length > 0 && (
//                 <details className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 overflow-hidden" open>
//                   <summary className="flex items-center justify-between gap-2 px-3.5 py-2.5 cursor-pointer hover:bg-rose-100/50 transition">
//                     <div className="flex items-center gap-2">
//                       <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-sm">
//                         <FaExclamationCircle className="text-white" size={10} />
//                       </div>
//                       <span className="text-[11px] font-black uppercase tracking-wider text-rose-900">
//                         {editFailures.length} attempt{editFailures.length > 1 ? "s" : ""} failed — click to inspect
//                       </span>
//                     </div>
//                     <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
//                       DEBUG
//                     </span>
//                   </summary>
//                   <div className="px-3.5 pb-3 space-y-1.5 max-h-56 overflow-y-auto">
//                     {editFailures.map((f, i) => (
//                       <div key={i} className="rounded-lg bg-white border border-rose-200 p-2 text-[10px] font-mono">
//                         <div className="flex items-center justify-between gap-2 mb-0.5">
//                           <span className="font-black text-rose-700">#{f.attempt}</span>
//                           <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${
//                             f.status === 412 || f.status === 428
//                               ? "bg-amber-100 text-amber-800 border border-amber-200"
//                               : f.status === 400 || f.status === 422
//                               ? "bg-violet-100 text-violet-800 border border-violet-200"
//                               : "bg-rose-100 text-rose-800 border border-rose-200"
//                           }`}>
//                             {f.status || "??"} {f.code}
//                           </span>
//                         </div>
//                         <div className="text-rose-800">
//                           <span className="text-rose-500">body:</span> {f.body}
//                         </div>
//                         <div className="text-rose-800">
//                           <span className="text-rose-500">ifMatch:</span> <code className="break-all">{f.ifMatch}</code>
//                         </div>
//                         {f.message && (
//                           <div className="text-rose-600 mt-0.5 break-words">{f.message}</div>
//                         )}
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       onClick={copyFailures}
//                       className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5"
//                     >
//                       {copied ? <><FaCheckCircle size={9} /> Copied!</> : <><FaCopy size={9} /> Copy all failures</>}
//                     </button>
//                   </div>
//                 </details>
//               )}

//               {shownVersion !== null && shownVersion !== undefined && (
//                 <p className="text-[10px] text-slate-500">Current version: {String(shownVersion)}</p>
//               )}

//               <button type="submit" disabled={editBusy}
//                 className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/30 disabled:opacity-60">
//                 {editBusy ? (<><FaSpinner className="animate-spin" size={13} /> Saving…</>) : (<><FaCheckCircle size={12} /> Save Changes</>)}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//       <style>{`
//         @keyframes slideIn {
//           from { transform: translateX(30px); opacity: 0; }
//           to   { transform: translateX(0); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }

// function DetailRow({ icon: Icon, label, value }) {
//   return (
//     <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
//       <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
//         <Icon size={9} /> {label}
//       </div>
//       <div className="text-xs font-semibold text-slate-900 truncate">
//         {value === null || value === undefined || value === "" ? "—" : String(value)}
//       </div>
//     </div>
//   );
// }

// /* ==================== MAIN PAGE ==================== */
// export default function Vehicles() {
//   const navigate = useNavigate();
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState(null);
//   const [sessionExpired, setSessionExpired] = useState(false);
//   const [search, setSearch]     = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [createOpen, setCreateOpen] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [toast, setToast]       = useState(null);

//   useEffect(() => {
//     const id = "vehicles-google-fonts";
//     if (document.getElementById(id)) return;
//     const link = document.createElement("link");
//     link.id = id;
//     link.rel = "stylesheet";
//     link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap";
//     document.head.appendChild(link);
//   }, []);

//   const showToast = (msg, tone = "emerald") => {
//     setToast({ msg, tone });
//     setTimeout(() => setToast(null), 6000);
//   };

//   const load = useCallback(async () => {
//     if (!localStorage.getItem("access_token") && !localStorage.getItem("refresh_token")) {
//       setSessionExpired(true); setLoading(false); return;
//     }
//     setLoading(true); setError(null); setSessionExpired(false);
//     try {
//       const res = await apiRequest("/api/v1/admin/vehicles");
//       setVehicles(extractVehicles(res));
//     } catch (err) {
//       if (err.isSessionExpired) { setSessionExpired(true); setVehicles([]); }
//       else { setError(err.message); setVehicles([]); }
//     } finally { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const filtered = vehicles.filter((v) => {
//     const q = search.toLowerCase().trim();
//     const hay = [v.asset_tag, v.registration_number, v.make, v.model, v.variant, v.vehicle_type, v.ownership_type]
//       .filter(Boolean).join(" ").toLowerCase();
//     const matchesSearch = !q || hay.includes(q);
//     const s = vehicleStatus(v);
//     const matchesStatus =
//       statusFilter === "all" ||
//       (statusFilter === "active"      && s.includes("active")) ||
//       (statusFilter === "maintenance" && s.includes("mainten")) ||
//       (statusFilter === "inactive"    && (s.includes("inactive") || s.includes("deactiv")));
//     return matchesSearch && matchesStatus;
//   });

//   const stats = vehicles.reduce((acc, v) => {
//     acc.total++;
//     const s = vehicleStatus(v);
//     if (s.includes("mainten")) acc.maintenance++;
//     else if (s.includes("inactive") || s.includes("deactiv")) acc.inactive++;
//     else acc.active++;
//     return acc;
//   }, { total: 0, active: 0, maintenance: 0, inactive: 0 });

//   if (sessionExpired) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-sky-50/40 px-4 py-16 flex items-center justify-center vehicles-page">
//         <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-8 text-center">
//           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
//             <FaExclamationCircle className="text-white" size={24} />
//           </div>
//           <h2 className="text-xl font-black text-slate-900">Session expired</h2>
//           <p className="text-sm text-slate-600 mt-2">
//             Your access token has expired and couldn't be refreshed. Please sign in again to continue.
//           </p>
//           <button
//             onClick={() => { clearSession(); navigate("/login", { replace: true }); }}
//             className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/30">
//             <FaSignInAlt size={12} /> Sign in again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-sky-50/40 px-4 py-8 vehicles-page">
//       <style>{`
//         .vehicles-page {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           -webkit-font-smoothing: antialiased;
//           -moz-osx-font-smoothing: grayscale;
//         }
//         .vehicles-page h1,
//         .vehicles-page h2,
//         .vehicles-page h3 {
//           font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
//           letter-spacing: -0.025em;
//         }
//         .vehicles-page input,
//         .vehicles-page textarea,
//         .vehicles-page select {
//           font-family: 'Inter', sans-serif;
//         }
//         .vehicles-page .font-mono,
//         .vehicles-page code {
//           font-family: 'JetBrains Mono', 'SF Mono', Menlo, Monaco, 'Courier New', monospace;
//         }
//       `}</style>

//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* HERO */}
//         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500 p-7 sm:p-8 shadow-xl shadow-sky-500/20">
//           <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/15 rounded-full blur-3xl" />
//           <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
//           <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
//                 <FaTruck size={9} /> Fleet Management
//               </div>
//               <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
//                 <FaTruck size={26} /> Service Vehicles
//               </h1>
//               <p className="text-sky-50/90 text-sm mt-1.5 max-w-xl">
//                 Manage your mobile charging fleet — track status, schedule maintenance, and inspect availability.
//               </p>
//             </div>
//             <div className="flex items-center gap-2 shrink-0">
//               <button onClick={load}
//                 className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 transition"
//                 title="Refresh">
//                 <FaSyncAlt size={13} />
//               </button>
//               <button onClick={() => setCreateOpen(true)}
//                 className="px-5 py-2.5 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
//                 <FaPlus size={13} /> Add Vehicle
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           <StatCard icon={FaTruck}        label="Total"       value={stats.total}       gradient="bg-gradient-to-br from-sky-500 to-blue-600" />
//           <StatCard icon={FaCheckCircle}  label="Active"      value={stats.active}      gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
//           <StatCard icon={FaWrench}       label="Maintenance" value={stats.maintenance} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
//           <StatCard icon={FaPowerOff}     label="Inactive"    value={stats.inactive}    gradient="bg-gradient-to-br from-slate-500 to-slate-700" />
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           <div className="flex flex-col sm:flex-row gap-2">
//             <div className="relative flex-1">
//               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
//               <input value={search} onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by asset tag, registration, make, model…"
//                 className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200" />
//             </div>
//             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200">
//               <option value="all">All statuses</option>
//               <option value="active">Active</option>
//               <option value="maintenance">In maintenance</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </div>

//         {error && <ErrorBox message={error} />}
//         {toast && (
//           <div className={`p-3 rounded-xl border flex items-start gap-2 animate-[fadeIn_0.15s_ease-out] ${
//             toast.tone === "rose" ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"
//           }`}>
//             <FaCheckCircle className={toast.tone === "rose" ? "text-rose-500" : "text-emerald-500"} size={13} />
//             <span className={`text-xs ${toast.tone === "rose" ? "text-rose-700" : "text-emerald-700"}`}>{toast.msg}</span>
//           </div>
//         )}

//         {loading ? (
//           <Spinner label="Loading vehicles…" />
//         ) : filtered.length === 0 ? (
//           <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
//             <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-3">
//               <FaTruck className="text-sky-400" size={22} />
//             </div>
//             <h3 className="text-sm font-bold text-slate-900">
//               {vehicles.length === 0 ? "No vehicles yet" : "No matches"}
//             </h3>
//             <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
//               {vehicles.length === 0
//                 ? "Register your first service vehicle to start managing your fleet."
//                 : "Try adjusting your search or status filter."}
//             </p>
//             {vehicles.length === 0 && (
//               <button onClick={() => setCreateOpen(true)}
//                 className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-sky-500/30">
//                 <FaPlus size={11} /> Add your first vehicle
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {filtered.map((v) => {
//               const id = v.id || v.vehicle_id || v.uuid;
//               const status = vehicleStatus(v);
//               const style  = statusStyle(status);
//               const title  = v.asset_tag || v.registration_number || v.name || "Unnamed";
//               const sub    = v.registration_number || v.asset_tag || id;

//               return (
//                 <div key={id} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
//                   <div className={`h-1.5 bg-gradient-to-r ${style.bg}`} />
//                   <div className="p-4">
//                     <div className="flex items-start justify-between gap-2 mb-2">
//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-center gap-2">
//                           <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center shadow-sm shrink-0`}>
//                             <FaTruck className="text-white" size={14} />
//                           </div>
//                           <div className="min-w-0">
//                             <h3 className="text-sm font-black text-slate-900 truncate">{title}</h3>
//                             <p className="text-[11px] font-mono text-slate-500 truncate">{sub}</p>
//                           </div>
//                         </div>
//                       </div>
//                       <StatusBadge status={status} />
//                     </div>

//                     <div className="flex flex-wrap gap-1.5 mb-3">
//                       {(v.make || v.model) && (
//                         <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
//                           {[v.make, v.model, v.variant].filter(Boolean).join(" ")}
//                         </span>
//                       )}
//                       {v.vehicle_type && (
//                         <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider border border-sky-200">
//                           {v.vehicle_type}
//                         </span>
//                       )}
//                       {v.ownership_type && (
//                         <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider border border-violet-200">
//                           {v.ownership_type}
//                         </span>
//                       )}
//                       {v.inspection_status && (() => {
//                         const ins = String(v.inspection_status).toUpperCase();
//                         const cls =
//                           ins === "VALID"
//                             ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                             : ins === "FAILED" || ins === "EXPIRED"
//                             ? "bg-rose-50 text-rose-700 border-rose-200"
//                             : "bg-slate-50 text-slate-700 border-slate-200";
//                         return (
//                           <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
//                             {v.inspection_status}
//                           </span>
//                         );
//                       })()}
//                     </div>

//                     <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
//                       <button onClick={() => setSelected(v)}
//                         className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition">
//                         <FaEye size={10} /> Details
//                       </button>
//                       <button onClick={() => setSelected(v)}
//                         className="flex-1 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center gap-1.5 transition">
//                         <FaHistory size={10} /> History
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <CreateVehicleModal
//         open={createOpen}
//         onClose={() => setCreateOpen(false)}
//         onSuccess={(usedLabel) => {
//           load();
//           if (usedLabel && usedLabel !== "as-entered") {
//             showToast(`Vehicle created using fallback shape: ${usedLabel}.`, "emerald");
//           } else {
//             showToast("Vehicle created successfully.", "emerald");
//           }
//         }}
//       />

//       {selected && (
//         <DetailDrawer vehicle={selected} onClose={() => setSelected(null)} onRefresh={load} />
//       )}

//       <style>{`
//         @keyframes scaleIn {
//           from { opacity: 0; transform: scale(0.95) translateY(10px); }
//           to   { opacity: 1; transform: scale(1) translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-4px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }

// src/components/Admin/Vehicles.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTruck, FaPlus, FaSearch, FaSyncAlt, FaCheckCircle, FaExclamationCircle,
  FaSpinner, FaTimes, FaEye, FaEdit, FaHistory, FaCalendarCheck,
  FaPowerOff, FaPlayCircle, FaWrench, FaInfoCircle, FaClock, FaCar,
  FaClipboard, FaTag, FaSignInAlt, FaLock, FaCommentDots, FaCopy,
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

/* ✅ Backend enum only: UNKNOWN, VALID, FAILED, EXPIRED */
const INSPECTION_STATES = ["UNKNOWN", "VALID", "FAILED", "EXPIRED"];

function sanitizeInspection(val) {
  const s = String(val ?? "").trim().toUpperCase();
  return INSPECTION_STATES.includes(s) ? s : undefined;
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
      "%c[VEHICLES →] " + method + " " + path,
      "color:#0ea5e9;font-weight:bold",
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
      const e = new Error("Network error — cannot reach Vehicles API.");
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

function extractVehicles(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  return toArray(res.vehicles || res.items || res.data?.vehicles || res.data?.items || res.data || []);
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

/* ==================================================================
 *  ✅ FIXED STATUS — returns one of: "active" | "inactive" | "maintenance" | "unknown"
 *  Explicit whitelist so "inactive" / "reactivated" never match "active" filter.
 * ================================================================== */
function normalizeStatus(v) {
  if (!v) return "unknown";

  // Explicit flags take priority
  if (v.is_active === false || v.deactivated === true) return "inactive";
  if (v.in_maintenance === true || v.maintenance === true) return "maintenance";

  const raw = String(v.status || v.state || v.lifecycle_status || "").trim().toLowerCase();

  if (!raw) return "active";

  // Exact matches
  if (raw === "active" || raw === "enabled" || raw === "running" ||
      raw === "operational" || raw === "available" || raw === "reactivated") return "active";
  if (raw === "inactive" || raw === "deactivated" || raw === "disabled" ||
      raw === "offline" || raw === "suspended" || raw === "blocked") return "inactive";
  if (raw === "maintenance" || raw === "in_maintenance" || raw === "under_maintenance" ||
      raw === "servicing") return "maintenance";

  // Prefix/contains fallbacks — order matters, most specific first
  if (raw.includes("mainten")) return "maintenance";
  if (raw.startsWith("deact") || raw.startsWith("inactiv") ||
      raw.startsWith("disabl") || raw.startsWith("offlin") || raw.startsWith("suspend")) return "inactive";
  if (raw.startsWith("reactiv") || raw.startsWith("activ") ||
      raw.startsWith("enabl") || raw.startsWith("run")) return "active";

  return "active"; // safe default
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
function toLocalIso(localValue) {
  if (!localValue) return localValue;
  if (/T\d{2}:\d{2}$/.test(localValue)) return localValue + ":00";
  return localValue;
}
function dateOnly(d) {
  if (!d) return undefined;
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d).slice(0, 10);
    return dt.toISOString().slice(0, 10);
  } catch { return undefined; }
}

/* ==================== REASON VALIDATION ==================== */
function validateReason(reason, action) {
  const trimmed = String(reason || "").trim();
  if (!trimmed) {
    throw new Error(`A reason is required to ${action} a vehicle.`);
  }
  if (trimmed.length < REASON_MIN_LENGTH) {
    throw new Error(
      `Reason must be at least ${REASON_MIN_LENGTH} characters (you entered ${trimmed.length}).`
    );
  }
  return trimmed;
}

/* ==================== BODY BUILDERS ==================== */
function buildVehicleBody(fields, { includeEmpty = false } = {}) {
  const body = {};
  const trim = (v) => (typeof v === "string" ? v.trim() : v);
  const setIf = (k, val) => {
    const v = trim(val);
    if (includeEmpty) { body[k] = v ?? ""; return; }
    if (v !== undefined && v !== null && v !== "") body[k] = v;
  };
  setIf("asset_tag", fields.asset_tag);
  setIf("registration_number", fields.registration_number);
  setIf("make", fields.make);
  setIf("model", fields.model);
  setIf("variant", fields.variant);
  setIf("vehicle_type", fields.vehicle_type);
  setIf("ownership_type", fields.ownership_type);
  setIf("registration_valid_until", dateOnly(fields.registration_valid_until));
  setIf("insurance_valid_until", dateOnly(fields.insurance_valid_until));
  const sanitizedInspection = sanitizeInspection(fields.inspection_status);
  if (sanitizedInspection) body.inspection_status = sanitizedInspection;
  setIf("notes", fields.notes);
  return body;
}

function buildFullBodyFromVehicle(v) {
  const sanitizedInspection = sanitizeInspection(v.inspection_status);
  return {
    asset_tag: v.asset_tag || undefined,
    registration_number: v.registration_number || undefined,
    make: v.make || undefined,
    model: v.model || undefined,
    variant: v.variant || undefined,
    vehicle_type: v.vehicle_type || undefined,
    ownership_type: v.ownership_type || undefined,
    registration_valid_until: dateOnly(v.registration_valid_until),
    insurance_valid_until: dateOnly(v.insurance_valid_until),
    ...(sanitizedInspection ? { inspection_status: sanitizedInspection } : {}),
    notes: v.notes || undefined,
  };
}

/* ==================== FETCH ETAG + VERSION ==================== */
async function fetchVehicleMeta(vehicleId) {
  try {
    const { data, headers } = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}`, {
      returnResponse: true,
    });
    const etagHeader = headers.get("ETag") || headers.get("etag");
    const version    = extractVersion(data);
    console.log(
      "%c[fetch-vehicle] version:", "color:#8b5cf6;font-weight:bold",
      version, "| ETag header:", etagHeader || "(none)"
    );
    return { data, etag: etagHeader, version };
  } catch (err) {
    console.warn("[fetch-vehicle] failed:", err?.message);
    return { data: null, etag: null, version: null };
  }
}

function pickIfMatch({ version, etag }) {
  if (version !== null && version !== undefined) return ifMatchHeader(version);
  if (etag) return etag;
  return null;
}

/* ==================================================================
 *  GENERIC WRAPPER for deactivate/reactivate — fetch → If-Match → send
 * ================================================================== */
async function mutationWithIfMatch(vehicleId, { method, path, body, maxRetries = 1 }) {
  let { version, etag } = await fetchVehicleMeta(vehicleId);
  let ifMatch = pickIfMatch({ version, etag });

  const buildHeaders = () => {
    const h = { "Idempotency-Key": uuid() };
    if (ifMatch) h["If-Match"] = ifMatch;
    return h;
  };

  const send = () => apiRequest(path, { method, body, extraHeaders: buildHeaders() });

  try {
    return await send();
  } catch (err) {
    const retryable = err.status === 412 || err.status === 428 || err.status === 409;
    if (!retryable || maxRetries <= 0) throw err;

    console.warn(`[mutation] ${err.status} — re-fetching version + retrying (${maxRetries} left)…`);
    const fresh = await fetchVehicleMeta(vehicleId);
    ifMatch = pickIfMatch(fresh);
    return await send();
  }
}

/* ==================== CREATE ==================== */
async function createVehicleMultiShape(fields) {
  const base = buildVehicleBody(fields);
  const withUnknown = { ...base, inspection_status: "UNKNOWN" };
  const withLowerEnums = {
    ...withUnknown,
    vehicle_type: withUnknown.vehicle_type ? String(withUnknown.vehicle_type).toLowerCase() : undefined,
    ownership_type: withUnknown.ownership_type ? String(withUnknown.ownership_type).toLowerCase() : undefined,
  };
  const noVariant = { ...withUnknown };
  delete noVariant.variant;
  const minimalUnknown = {
    asset_tag: base.asset_tag, registration_number: base.registration_number, inspection_status: "UNKNOWN",
  };
  const minimal = { asset_tag: base.asset_tag, registration_number: base.registration_number };
  const chargingUnit = { ...withUnknown, vehicle_type: "CHARGING_UNIT" };

  const attempts = [
    { label: "as-entered",                    body: base },
    { label: "inspection=UNKNOWN",            body: withUnknown },
    { label: "UNKNOWN + lowercase enums",     body: withLowerEnums },
    { label: "UNKNOWN + no variant",          body: noVariant },
    { label: "minimal + UNKNOWN",             body: minimalUnknown },
    { label: "minimal (2 fields)",            body: minimal },
    { label: "UNKNOWN + type=CHARGING_UNIT",  body: chargingUnit },
  ];

  const failures = [];
  for (const a of attempts) {
    Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);
    try {
      console.log(`%c[create-vehicle] try: ${a.label}`, "color:#f59e0b;font-weight:bold", "\n  body:", JSON.stringify(a.body));
      const res = await apiRequest("/api/v1/admin/vehicles", {
        method: "POST", body: a.body,
        extraHeaders: { "Idempotency-Key": uuid() },
      });
      console.log(`%c[create-vehicle] ✅ ACCEPTED: ${a.label}`, "color:#10b981;font-weight:bold;font-size:14px");
      return { res, usedLabel: a.label };
    } catch (err) {
      if (err.code !== "VALIDATION_FAILED") throw err;
      console.warn(`[create-vehicle] ✗ ${a.label}:`, err.code, err.message);
      failures.push({ label: a.label, code: err.code, message: err.message });
    }
  }
  const e = new Error(
    `Server rejected all ${attempts.length} payload variations with VALIDATION_FAILED. ` +
    "Open DevTools → Network → click POST /vehicles → copy Request Payload + Response."
  );
  e.code = "VALIDATION_FAILED";
  e.failures = failures;
  throw e;
}

/* ==================== PATCH VEHICLE ==================== */
async function updateVehicleMultiShape(vehicleId, changedFields, currentVehicle) {
  const meta = await fetchVehicleMeta(vehicleId);
  const version = meta.version ?? extractVersion(currentVehicle);
  let ifMatch = pickIfMatch({ version, etag: meta.etag });
  if (!ifMatch) {
    throw new Error("Cannot update — backend returned no version or ETag.");
  }

  const changedBody = buildVehicleBody(changedFields);
  const fullBody = buildFullBodyFromVehicle(currentVehicle || {});
  Object.assign(fullBody, changedBody);

  const bodyShapes = [
    { label: "all vehicle fields", body: fullBody },
    { label: "changed fields only", body: changedBody },
  ];

  const failures = [];

  for (const [index, bodyShape] of bodyShapes.entries()) {
    const body = Object.fromEntries(
      Object.entries(bodyShape.body).filter(([, value]) => value !== undefined)
    );
    let refreshedVersion = false;

    while (true) {
      try {
        const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}`, {
          method: "PATCH",
          body,
          extraHeaders: {
            "Idempotency-Key": uuid(),
            "If-Match": ifMatch,
          },
        });
        return { res, usedLabel: bodyShape.label };
      } catch (err) {
        failures.push({
          attempt: failures.length + 1,
          body: bodyShape.label,
          ifMatch,
          status: err.status,
          code: err.code,
          message: err.message,
        });

        if ((err.status === 412 || err.status === 428) && !refreshedVersion) {
          const fresh = await fetchVehicleMeta(vehicleId);
          const freshIfMatch = pickIfMatch(fresh);
          if (!freshIfMatch) {
            err.failures = failures;
            throw err;
          }
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
  const error = new Error(lastFailure?.message || "The server rejected the vehicle update.");
  error.code = lastFailure?.code || "VALIDATION_FAILED";
  error.status = lastFailure?.status;
  error.failures = failures;
  throw error;
}

/* ==================== MAINTENANCE ==================== */
async function recordMaintenanceMultiShape(vehicleId, data) {
  const startIso = toIsoUtc(data.start_at);
  const endIso   = toIsoUtc(data.end_at);
  const startLocalIso = toLocalIso(data.start_at);
  const endLocalIso   = toLocalIso(data.end_at);
  const reason = data.reason?.trim() || undefined;

  const attempts = [
    { label: "{ start_at, end_at, reason }",              body: { start_at: startIso, end_at: endIso, reason } },
    { label: "{ starts_at, ends_at, reason }",            body: { starts_at: startIso, ends_at: endIso, reason } },
    { label: "{ start_time, end_time, reason }",          body: { start_time: startIso, end_time: endIso, reason } },
    { label: "{ from, to, reason }",                      body: { from: startIso, to: endIso, reason } },
    { label: "{ start, end, reason }",                    body: { start: startIso, end: endIso, reason } },
    { label: "{ window_start, window_end, reason }",      body: { window_start: startIso, window_end: endIso, reason } },
    { label: "{ scheduled_start, scheduled_end, reason }",body: { scheduled_start: startIso, scheduled_end: endIso, reason } },
    { label: "{ start_at, end_at } (no reason)",          body: { start_at: startIso, end_at: endIso } },
    { label: "{ start_at, end_at, notes }",               body: { start_at: startIso, end_at: endIso, notes: reason } },
    { label: "{ window: { start, end }, reason }",        body: { window: { start: startIso, end: endIso }, reason } },
    { label: "{ start_at, end_at, reason } (local)",      body: { start_at: startLocalIso, end_at: endLocalIso, reason } },
    { label: "{ starts_at, ends_at, reason } (local)",    body: { starts_at: startLocalIso, ends_at: endLocalIso, reason } },
  ];

  const failures = [];
  for (const a of attempts) {
    Object.keys(a.body).forEach((k) => a.body[k] === undefined && delete a.body[k]);
    try {
      console.log(`%c[maintenance] try: ${a.label}`, "color:#f59e0b;font-weight:bold", "\n  body:", JSON.stringify(a.body));
      const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}/maintenance`, {
        method: "POST",
        body: a.body,
        extraHeaders: { "Idempotency-Key": uuid() },
      });
      console.log(`%c[maintenance] ✅ ACCEPTED: ${a.label}`, "color:#10b981;font-weight:bold;font-size:14px");
      return { res, usedLabel: a.label };
    } catch (err) {
      if (err.code !== "VALIDATION_FAILED") throw err;
      console.warn(`[maintenance] ✗ ${a.label}:`, err.code, err.message);
      failures.push({ label: a.label, code: err.code, message: err.message });
    }
  }
  const e = new Error(
    `Server rejected all ${attempts.length} maintenance payload shapes. ` +
    "Open DevTools → Network → click POST /maintenance → copy Request Payload + Response."
  );
  e.code = "VALIDATION_FAILED";
  e.failures = failures;
  throw e;
}

/* ==================== DEACTIVATE / REACTIVATE ==================== */
async function deactivateVehicle(vehicleId, reason) {
  const trimmed = validateReason(reason, "deactivate");
  return mutationWithIfMatch(vehicleId, {
    method: "POST",
    path: `/api/v1/admin/vehicles/${vehicleId}/deactivate`,
    body: { reason: trimmed },
  });
}
async function reactivateVehicle(vehicleId, reason) {
  const trimmed = validateReason(reason, "reactivate");
  return mutationWithIfMatch(vehicleId, {
    method: "POST",
    path: `/api/v1/admin/vehicles/${vehicleId}/reactivate`,
    body: { reason: trimmed },
  });
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

const VEHICLE_TYPES    = ["VAN", "TRUCK", "CAR", "BIKE", "CHARGING_UNIT", "OTHER"];
const OWNERSHIP_TYPES  = ["OWNED", "LEASED", "RENTED", "THIRD_PARTY"];

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
const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200";

/* ==================== CREATE MODAL ==================== */
function CreateVehicleModal({ open, onClose, onSuccess }) {
  const emptyForm = {
    asset_tag: "", registration_number: "",
    make: "", model: "", variant: "",
    vehicle_type: "VAN", ownership_type: "OWNED",
    registration_valid_until: "", insurance_valid_until: "",
    inspection_status: "UNKNOWN", notes: "",
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
    if (!form.asset_tag.trim())           return setError("Asset tag is required.");
    if (!form.registration_number.trim()) return setError("Registration number is required.");
    setBusy(true); setError(null); setSuccessLabel(null);
    try {
      const { usedLabel } = await createVehicleMultiShape(form);
      setSuccessLabel(usedLabel);
      onSuccess?.(usedLabel);
      setTimeout(() => { setBusy(false); onClose(); }, 1400);
    } catch (err) {
      console.error("[create-vehicle] final error:", err);
      if (err.isSessionExpired) setError(err.message);
      else if (err.code === "VALIDATION_FAILED") setError(err.message);
      else if (err.status === 409) setError("A vehicle with this asset tag or registration already exists.");
      else if (err.status === 403) setError("You need the fleet.manage capability to create vehicles.");
      else setError(err.message || "Failed to create vehicle.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => !busy && onClose()} />
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-white shadow-2xl shadow-sky-900/20 animate-[scaleIn_0.2s_ease-out]">
        <div className="relative bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500 p-6 pb-8 text-white">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
          <button onClick={() => !busy && onClose()}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
            <FaTimes size={12} />
          </button>
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <FaTruck size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Register Service Vehicle</h3>
              <p className="text-[11px] text-sky-50/90">Requires fleet.manage capability</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4 -mt-4 relative max-h-[75vh] overflow-y-auto">
          {successLabel && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
              <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
              <div>
                <p className="text-emerald-800 text-xs font-bold">✅ Vehicle created successfully!</p>
                <p className="text-emerald-700 text-[10px] mt-0.5">
                  Accepted payload shape: <code className="font-mono bg-emerald-100 px-1 rounded">{successLabel}</code>
                </p>
              </div>
            </div>
          )}
          {error && <ErrorBox message={error} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Asset Tag" required>
              <input ref={firstRef} value={form.asset_tag} onChange={onChange("asset_tag")} placeholder="e.g. FLT-0007" className={inputCls + " font-mono"} disabled={busy} />
            </Field>
            <Field label="Registration Number" required>
              <input value={form.registration_number} onChange={onChange("registration_number")} placeholder="e.g. DHK-GA-1234" className={inputCls + " font-mono"} disabled={busy} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Make"><input value={form.make} onChange={onChange("make")} placeholder="Tesla" className={inputCls} disabled={busy} /></Field>
            <Field label="Model"><input value={form.model} onChange={onChange("model")} placeholder="Model 3" className={inputCls} disabled={busy} /></Field>
            <Field label="Variant"><input value={form.variant} onChange={onChange("variant")} placeholder="Long Range" className={inputCls} disabled={busy} /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Vehicle Type">
              <select value={form.vehicle_type} onChange={onChange("vehicle_type")} className={inputCls} disabled={busy}>
                {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Ownership Type">
              <select value={form.ownership_type} onChange={onChange("ownership_type")} className={inputCls} disabled={busy}>
                {OWNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Registration Valid Until"><input type="date" value={form.registration_valid_until} onChange={onChange("registration_valid_until")} className={inputCls} disabled={busy} /></Field>
            <Field label="Insurance Valid Until"><input type="date" value={form.insurance_valid_until} onChange={onChange("insurance_valid_until")} className={inputCls} disabled={busy} /></Field>
          </div>
          <Field label="Inspection Status" hint="New vehicles start as UNKNOWN. Use Edit later to mark VALID.">
            <select value={form.inspection_status} onChange={onChange("inspection_status")} className={inputCls} disabled={busy}>
              {INSPECTION_STATES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
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
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-400 hover:via-blue-400 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
              {busy ? (<><FaSpinner className="animate-spin" size={13} /> Creating…</>) : (<><FaPlus size={12} /> Create Vehicle</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==================== DETAIL DRAWER ==================== */
function DetailDrawer({ vehicle, onClose, onRefresh }) {
  const [tab, setTab] = useState("overview");
  const [history, setHistory]   = useState(null);
  const [avail, setAvail]       = useState(null);
  const [loadingH, setLoadingH] = useState(false);
  const [loadingA, setLoadingA] = useState(false);
  const [errorH, setErrorH]     = useState(null);
  const [errorA, setErrorA]     = useState(null);

  const [fresh, setFresh]               = useState(vehicle);
  const [freshVersion, setFreshVersion] = useState(null);
  const [freshEtag, setFreshEtag]       = useState(null);
  const [refreshing, setRefreshing]     = useState(false);

  const [edit, setEdit]               = useState(null);
  const [editBusy, setEditBusy]       = useState(false);
  const [editErr, setEditErr]         = useState(null);
  const [editLabel, setEditLabel]     = useState(null);
  const [editFailures, setEditFailures] = useState(null);

  const [maint, setMaint]           = useState({ start_at: "", end_at: "", reason: "" });
  const [maintBusy, setMaintBusy]   = useState(false);
  const [maintErr, setMaintErr]     = useState(null);
  const [maintOk, setMaintOk]       = useState(null);
  const [maintLabel, setMaintLabel] = useState(null);

  const [actionReason, setActionReason] = useState("");
  const [actionBusy, setActionBusy]     = useState(false);
  const [actionErr, setActionErr]       = useState(null);

  const [copied, setCopied] = useState(false);

  const vehicleId = vehicle?.id || vehicle?.vehicle_id || vehicle?.uuid;
  const shown     = fresh || vehicle;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!vehicleId) return;
      setRefreshing(true);
      const meta = await fetchVehicleMeta(vehicleId);
      if (cancelled) return;
      if (meta.data) setFresh(meta.data);
      setFreshVersion(meta.version);
      setFreshEtag(meta.etag);
      setRefreshing(false);
    })();
    return () => { cancelled = true; };
  }, [vehicleId]);

  useEffect(() => {
    setTab("overview");
    setHistory(null); setAvail(null);
    setErrorH(null); setErrorA(null);
    setEditErr(null); setEditLabel(null); setEditFailures(null);
    setMaintErr(null); setMaintOk(null); setMaintLabel(null);
    setActionErr(null); setActionReason("");

    const v = shown || {};
    setEdit({
      asset_tag: v.asset_tag || "",
      registration_number: v.registration_number || "",
      make: v.make || "",
      model: v.model || "",
      variant: v.variant || "",
      vehicle_type: v.vehicle_type || "VAN",
      ownership_type: v.ownership_type || "OWNED",
      registration_valid_until: v.registration_valid_until ? String(v.registration_valid_until).slice(0, 10) : "",
      insurance_valid_until:    v.insurance_valid_until    ? String(v.insurance_valid_until).slice(0, 10)    : "",
      inspection_status: sanitizeInspection(v.inspection_status) || "",
      notes: v.notes || "",
    });
    setMaint({ start_at: "", end_at: "", reason: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  const loadHistory = useCallback(async () => {
    if (!vehicleId) return;
    setLoadingH(true); setErrorH(null);
    try {
      const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}/history`);
      setHistory(extractHistory(res));
    } catch (err) { setErrorH(err.message); }
    finally { setLoadingH(false); }
  }, [vehicleId]);

  const loadAvailability = useCallback(async () => {
    if (!vehicleId) return;
    setLoadingA(true); setErrorA(null);
    try {
      const res = await apiRequest(`/api/v1/admin/vehicles/${vehicleId}/availability`);
      setAvail(extractAvailability(res));
    } catch (err) { setErrorA(err.message); }
    finally { setLoadingA(false); }
  }, [vehicleId]);

  useEffect(() => {
    if (tab === "history" && history === null) loadHistory();
    if (tab === "availability" && avail === null) loadAvailability();
  }, [tab, history, avail, loadHistory, loadAvailability]);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!vehicleId) return;
    setEditBusy(true); setEditErr(null); setEditLabel(null); setEditFailures(null);
    try {
      const v = shown || {};
      const changed = {};
      const trim = (s) => (typeof s === "string" ? s.trim() : s);
      const diff = (newVal, oldVal) => trim(newVal) !== trim(oldVal ?? "");

      if (diff(edit.asset_tag, v.asset_tag))                     changed.asset_tag = edit.asset_tag.trim();
      if (diff(edit.registration_number, v.registration_number)) changed.registration_number = edit.registration_number.trim();
      if (diff(edit.make, v.make))                               changed.make = edit.make.trim();
      if (diff(edit.model, v.model))                             changed.model = edit.model.trim();
      if (diff(edit.variant, v.variant))                         changed.variant = edit.variant.trim();
      if (diff(edit.vehicle_type, v.vehicle_type))               changed.vehicle_type = edit.vehicle_type;
      if (diff(edit.ownership_type, v.ownership_type))           changed.ownership_type = edit.ownership_type;
      if (diff(edit.registration_valid_until, v.registration_valid_until ? String(v.registration_valid_until).slice(0, 10) : ""))
        changed.registration_valid_until = edit.registration_valid_until;
      if (diff(edit.insurance_valid_until, v.insurance_valid_until ? String(v.insurance_valid_until).slice(0, 10) : ""))
        changed.insurance_valid_until = edit.insurance_valid_until;
      if (edit.inspection_status) {
        const sanitized = sanitizeInspection(edit.inspection_status);
        const currentSanitized = sanitizeInspection(v.inspection_status);
        if (sanitized && sanitized !== currentSanitized) {
          changed.inspection_status = sanitized;
        }
      }
      if (diff(edit.notes, v.notes))                             changed.notes = edit.notes.trim();

      if (Object.keys(changed).length === 0) {
        setEditErr("No changes to save.");
        setEditBusy(false);
        return;
      }

      const { usedLabel } = await updateVehicleMultiShape(vehicleId, changed, v);
      setEditLabel(usedLabel);
      onRefresh?.();
      setTimeout(() => { setEditBusy(false); onClose(); }, 1200);
    } catch (err) {
      console.error("[edit] error:", err);
      if (err.failures) setEditFailures(err.failures);
      if (err.isSessionExpired) setEditErr(err.message);
      else if (err.status === 428) setEditErr("The vehicle version changed. Refresh the vehicle and try again.");
      else if (err.status === 412) setEditErr("Version conflict — someone else updated this vehicle. See details below.");
      else if (err.status === 409) setEditErr("Version conflict — see details below.");
      else if (err.code === "VALIDATION_FAILED") setEditErr(err.message);
      else setEditErr(err.message || "Failed to update vehicle.");
      setEditBusy(false);
    }
  };

  const handleDeactivate = async () => {
    if (!vehicleId) return;
    setActionBusy(true); setActionErr(null);
    try {
      const trimmed = validateReason(actionReason, "deactivate");
      if (!window.confirm(`Deactivate this vehicle?\n\nReason: ${trimmed}`)) {
        setActionBusy(false);
        return;
      }
      await deactivateVehicle(vehicleId, trimmed);
      onRefresh?.();
      onClose();
    } catch (err) {
      console.error("[deactivate] error:", err);
      if (err.status === 428) setActionErr("Server requires If-Match — please retry.");
      else if (err.status === 412) setActionErr("Version conflict — refresh and retry.");
      else if (err.status === 422) setActionErr(err.message || "Validation failed — check the reason (min 8 chars).");
      else setActionErr(err.message || "Failed to deactivate.");
    } finally { setActionBusy(false); }
  };

  const handleReactivate = async () => {
    if (!vehicleId) return;
    setActionBusy(true); setActionErr(null);
    try {
      const trimmed = validateReason(actionReason, "reactivate");
      if (!window.confirm(`Reactivate this vehicle?\n\nReason: ${trimmed}`)) {
        setActionBusy(false);
        return;
      }
      await reactivateVehicle(vehicleId, trimmed);
      onRefresh?.();
      onClose();
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
    if (!vehicleId) return;
    if (!maint.start_at || !maint.end_at) return setMaintErr("Start and end time are required.");
    if (new Date(maint.end_at) <= new Date(maint.start_at))
      return setMaintErr("End time must be after start time.");

    setMaintBusy(true); setMaintErr(null); setMaintOk(null); setMaintLabel(null);
    try {
      const { usedLabel } = await recordMaintenanceMultiShape(vehicleId, maint);
      setMaintLabel(usedLabel);
      setMaintOk("✅ Maintenance window recorded.");
      setMaint({ start_at: "", end_at: "", reason: "" });
      onRefresh?.();
    } catch (err) {
      console.error("[maintenance] final error:", err);
      if (err.code === "VALIDATION_FAILED") setMaintErr(err.message);
      else if (err.status === 409) setMaintErr("Overlaps with an existing maintenance window.");
      else setMaintErr(err.message || "Failed to record maintenance.");
    } finally { setMaintBusy(false); }
  };

  const copyFailures = async () => {
    if (!editFailures) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(editFailures, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  if (!shown) return null;

  const normStatus = normalizeStatus(shown);
  const style      = statusStyle(normStatus);
  const displayTitle = shown.asset_tag || shown.registration_number || shown.name || "Vehicle";
  const displaySub   = shown.registration_number || shown.asset_tag || vehicleId;
  const isInactive   = normStatus === "inactive";
  const shownVersion = freshVersion ?? shown.version;

  const reasonTrimmed = actionReason.trim();
  const reasonValid   = reasonTrimmed.length >= REASON_MIN_LENGTH;
  const reasonRemaining = Math.max(0, REASON_MIN_LENGTH - reasonTrimmed.length);

  const tabs = [
    { id: "overview",     label: "Overview",     icon: FaInfoCircle },
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
              <FaTruck size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black tracking-tight truncate">{displayTitle}</h2>
              <p className="text-[11px] font-mono text-white/90 truncate mt-0.5">{displaySub}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/25 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  {style.label}
                </span>
                {shown.vehicle_type && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider border border-white/30">
                    {shown.vehicle_type}
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

        <div className="shrink-0 border-b border-slate-200 bg-white px-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                  tab === id ? "border-sky-500 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}>
                <Icon size={11} /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {actionErr && <ErrorBox message={actionErr} />}

          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <DetailRow icon={FaTag}         label="Asset Tag"      value={shown.asset_tag} />
                <DetailRow icon={FaClipboard}   label="Registration"   value={shown.registration_number} />
                <DetailRow icon={FaCar}         label="Make"           value={shown.make} />
                <DetailRow icon={FaCar}         label="Model"          value={shown.model} />
                <DetailRow icon={FaCar}         label="Variant"        value={shown.variant} />
                <DetailRow icon={FaTruck}       label="Type"           value={shown.vehicle_type} />
                <DetailRow icon={FaInfoCircle}  label="Ownership"      value={shown.ownership_type} />
                <DetailRow icon={FaCheckCircle} label="Inspection"     value={shown.inspection_status} />
                <DetailRow icon={FaCalendarCheck} label="Reg. Valid Until" value={fmtDateOnly(shown.registration_valid_until)} />
                <DetailRow icon={FaCalendarCheck} label="Insurance Until"  value={fmtDateOnly(shown.insurance_valid_until)} />
                <DetailRow icon={FaLock}        label="Version"        value={shownVersion} />
                <DetailRow icon={FaClock}       label="Created"        value={fmtDate(shown.created_at)} />
              </div>

              {shownVersion !== null && shownVersion !== undefined && (
                <div className="p-2 rounded-lg bg-violet-50 border border-violet-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-0.5">If-Match header on next mutation</div>
                  <code className="text-[10px] font-mono text-violet-800 break-all">{ifMatchHeader(shownVersion)}</code>
                </div>
              )}

              {shown.notes && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Notes</h4>
                  <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 whitespace-pre-wrap">
                    {shown.notes}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Actions</h4>

                <div className="mb-2">
                  <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    <span>Reason <span className="text-rose-500">*</span></span>
                    <span className={`font-mono text-[9px] normal-case tracking-normal ${
                      reasonValid ? "text-emerald-600" : reasonTrimmed.length ? "text-rose-500" : "text-slate-400"
                    }`}>
                      {reasonTrimmed.length}/{REASON_MIN_LENGTH}
                    </span>
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    rows={2}
                    placeholder={isInactive ? "e.g. Repairs complete — back in service" : "e.g. Routine inspection required"}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 resize-none"
                    disabled={actionBusy}
                    minLength={REASON_MIN_LENGTH}
                  />
                  {reasonTrimmed.length > 0 && !reasonValid && (
                    <p className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                      <FaExclamationCircle size={9} /> Add {reasonRemaining} more character{reasonRemaining !== 1 ? "s" : ""} (min {REASON_MIN_LENGTH} required).
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {isInactive ? (
                    <button onClick={handleReactivate} disabled={actionBusy || !reasonValid}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                      {actionBusy ? <FaSpinner className="animate-spin" size={11} /> : <FaPlayCircle size={11} />}
                      Reactivate
                    </button>
                  ) : (
                    <button onClick={handleDeactivate} disabled={actionBusy || !reasonValid}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                      {actionBusy ? <FaSpinner className="animate-spin" size={11} /> : <FaPowerOff size={11} />}
                      Deactivate
                    </button>
                  )}
                  <button onClick={() => setTab("maintenance")}
                    className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition">
                    <FaWrench size={11} /> Schedule Maintenance
                  </button>
                </div>

                {!reasonValid && (
                  <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                    <FaCommentDots size={9} /> Enter a valid reason (min {REASON_MIN_LENGTH} chars) to enable Deactivate / Reactivate.
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === "history" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Append-only history</h4>
                <button onClick={loadHistory} className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1">
                  <FaSyncAlt size={9} /> Refresh
                </button>
              </div>
              {loadingH && <Spinner label="Loading history…" />}
              {errorH   && <ErrorBox message={errorH} />}
              {!loadingH && !errorH && (!history || history.length === 0) && (
                <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">No history events yet.</p>
              )}
              {!loadingH && !errorH && history && history.length > 0 && (
                <ol className="relative border-l-2 border-slate-200 ml-2 space-y-3">
                  {history.map((h, i) => (
                    <li key={i} className="ml-4">
                      <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-100" />
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
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inventory availability evidence</h4>
                <button onClick={loadAvailability} className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1">
                  <FaSyncAlt size={9} /> Refresh
                </button>
              </div>
              {loadingA && <Spinner label="Loading availability…" />}
              {errorA   && <ErrorBox message={errorA} />}
              {!loadingA && !errorA && avail && (
                <pre className="text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-x-auto font-mono whitespace-pre-wrap">
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
                <span className="text-amber-800 text-[11px]">Windows must not overlap with existing maintenance slots.</span>
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
              <Field label="Reason">
                <textarea value={maint.reason}
                  onChange={(e) => setMaint({ ...maint, reason: e.target.value })}
                  rows={2} placeholder="e.g. Routine inspection"
                  className={inputCls + " resize-none"} disabled={maintBusy} />
              </Field>
              <button type="submit" disabled={maintBusy}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/30 disabled:opacity-60">
                {maintBusy ? (<><FaSpinner className="animate-spin" size={13} /> Recording…</>) : (<><FaWrench size={12} /> Record Maintenance</>)}
              </button>
              <p className="text-[10px] text-slate-500 text-center">
                Dates are auto-converted to ISO-8601 UTC before sending.
              </p>
            </form>
          )}

          {tab === "edit" && edit && (
            <form onSubmit={handleSaveEdit} className="space-y-3">
              {editErr && <ErrorBox message={editErr} />}
              {editLabel && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                  <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={13} />
                  <div>
                    <p className="text-emerald-800 text-xs font-bold">✅ Vehicle updated!</p>
                    <p className="text-emerald-700 text-[10px] mt-0.5">
                      Accepted PATCH shape: <code className="font-mono bg-emerald-100 px-1 rounded">{editLabel}</code>
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Asset Tag"><input value={edit.asset_tag} onChange={(e) => setEdit({ ...edit, asset_tag: e.target.value })} className={inputCls + " font-mono"} disabled={editBusy} /></Field>
                <Field label="Registration Number"><input value={edit.registration_number} onChange={(e) => setEdit({ ...edit, registration_number: e.target.value })} className={inputCls + " font-mono"} disabled={editBusy} /></Field>
                <Field label="Make"><input value={edit.make} onChange={(e) => setEdit({ ...edit, make: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
                <Field label="Model"><input value={edit.model} onChange={(e) => setEdit({ ...edit, model: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
                <Field label="Variant"><input value={edit.variant} onChange={(e) => setEdit({ ...edit, variant: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
                <Field label="Vehicle Type">
                  <select value={edit.vehicle_type} onChange={(e) => setEdit({ ...edit, vehicle_type: e.target.value })} className={inputCls} disabled={editBusy}>
                    {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Ownership Type">
                  <select value={edit.ownership_type} onChange={(e) => setEdit({ ...edit, ownership_type: e.target.value })} className={inputCls} disabled={editBusy}>
                    {OWNERSHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Inspection Status" hint="Only UNKNOWN / VALID / FAILED / EXPIRED accepted by backend.">
                  <select value={edit.inspection_status} onChange={(e) => setEdit({ ...edit, inspection_status: e.target.value })} className={inputCls} disabled={editBusy}>
                    <option value="">— Leave unchanged —</option>
                    {INSPECTION_STATES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Reg. Valid Until"><input type="date" value={edit.registration_valid_until} onChange={(e) => setEdit({ ...edit, registration_valid_until: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
                <Field label="Insurance Valid Until"><input type="date" value={edit.insurance_valid_until} onChange={(e) => setEdit({ ...edit, insurance_valid_until: e.target.value })} className={inputCls} disabled={editBusy} /></Field>
                <div className="sm:col-span-2">
                  <Field label="Notes">
                    <textarea value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} rows={3} className={inputCls + " resize-none"} disabled={editBusy} />
                  </Field>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-3.5">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-300/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-indigo-300/25 rounded-full blur-3xl" />
                <div className="relative flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-xl bg-sky-400/40 blur-md" />
                    <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/40">
                      <FaLock className="text-white" size={12} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-sky-900">
                        Optimistic Update
                      </span>
                    </div>
                    <p className="text-[10.5px] text-sky-800 leading-relaxed">
                      Fetches fresh version → sends{" "}
                      <code className="font-mono bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded-md border border-sky-200 text-[10px]">
                        If-Match: "{String(shownVersion ?? "")}"
                      </code>{" "}
                      + <code className="font-mono bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded-md border border-sky-200 text-[10px]">Idempotency-Key</code>.
                      <strong> Version lives only in the header — never in the body.</strong>{" "}
                      <code className="font-mono bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded-md border border-sky-200 text-[10px]">inspection_status</code>{" "}
                      only accepts <strong>UNKNOWN / VALID / FAILED / EXPIRED</strong>.
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
                        {editFailures.length} attempt{editFailures.length > 1 ? "s" : ""} failed — click to inspect
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                      DEBUG
                    </span>
                  </summary>
                  <div className="px-3.5 pb-3 space-y-1.5 max-h-56 overflow-y-auto">
                    {editFailures.map((f, i) => (
                      <div key={i} className="rounded-lg bg-white border border-rose-200 p-2 text-[10px] font-mono">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-black text-rose-700">#{f.attempt}</span>
                          <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${
                            f.status === 412 || f.status === 428
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : f.status === 400 || f.status === 422
                              ? "bg-violet-100 text-violet-800 border border-violet-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}>
                            {f.status || "??"} {f.code}
                          </span>
                        </div>
                        <div className="text-rose-800">
                          <span className="text-rose-500">body:</span> {f.body}
                        </div>
                        <div className="text-rose-800">
                          <span className="text-rose-500">ifMatch:</span> <code className="break-all">{f.ifMatch}</code>
                        </div>
                        {f.message && (
                          <div className="text-rose-600 mt-0.5 break-words">{f.message}</div>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={copyFailures}
                      className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                    >
                      {copied ? <><FaCheckCircle size={9} /> Copied!</> : <><FaCopy size={9} /> Copy all failures</>}
                    </button>
                  </div>
                </details>
              )}

              {shownVersion !== null && shownVersion !== undefined && (
                <p className="text-[10px] text-slate-500">Current version: {String(shownVersion)}</p>
              )}

              <button type="submit" disabled={editBusy}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/30 disabled:opacity-60">
                {editBusy ? (<><FaSpinner className="animate-spin" size={13} /> Saving…</>) : (<><FaCheckCircle size={12} /> Save Changes</>)}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(30px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
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
export default function Vehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState(null);

  useEffect(() => {
    const id = "vehicles-google-fonts";
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
      const res = await apiRequest("/api/v1/admin/vehicles");
      setVehicles(extractVehicles(res));
    } catch (err) {
      if (err.isSessionExpired) { setSessionExpired(true); setVehicles([]); }
      else { setError(err.message); setVehicles([]); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ✅ Filter uses normalized status — no more "inactive" appearing under "active"
  const filtered = vehicles.filter((v) => {
    const q = search.toLowerCase().trim();
    const hay = [v.asset_tag, v.registration_number, v.make, v.model, v.variant, v.vehicle_type, v.ownership_type]
      .filter(Boolean).join(" ").toLowerCase();
    const matchesSearch = !q || hay.includes(q);
    const norm = normalizeStatus(v);
    const matchesStatus = statusFilter === "all" || norm === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ✅ Stats use normalized status
  const stats = vehicles.reduce((acc, v) => {
    acc.total++;
    const norm = normalizeStatus(v);
    if (norm === "maintenance") acc.maintenance++;
    else if (norm === "inactive") acc.inactive++;
    else acc.active++;
    return acc;
  }, { total: 0, active: 0, maintenance: 0, inactive: 0 });

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-sky-50/40 px-4 py-16 flex items-center justify-center vehicles-page">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <FaExclamationCircle className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Session expired</h2>
          <p className="text-sm text-slate-600 mt-2">
            Your access token has expired and couldn't be refreshed. Please sign in again to continue.
          </p>
          <button
            onClick={() => { clearSession(); navigate("/login", { replace: true }); }}
            className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/30">
            <FaSignInAlt size={12} /> Sign in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-sky-50/40 px-4 py-8 vehicles-page">
      <style>{`
        .vehicles-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .vehicles-page h1,
        .vehicles-page h2,
        .vehicles-page h3 {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          letter-spacing: -0.025em;
        }
        .vehicles-page input,
        .vehicles-page textarea,
        .vehicles-page select {
          font-family: 'Inter', sans-serif;
        }
        .vehicles-page .font-mono,
        .vehicles-page code {
          font-family: 'JetBrains Mono', 'SF Mono', Menlo, Monaco, 'Courier New', monospace;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500 p-7 sm:p-8 shadow-xl shadow-sky-500/20">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                <FaTruck size={9} /> Fleet Management
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <FaTruck size={26} /> Service Vehicles
              </h1>
              <p className="text-sky-50/90 text-sm mt-1.5 max-w-xl">
                Manage your mobile charging fleet — track status, schedule maintenance, and inspect availability.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={load}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 transition"
                title="Refresh">
                <FaSyncAlt size={13} />
              </button>
              <button onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <FaPlus size={13} /> Add Vehicle
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={FaTruck}        label="Total"       value={stats.total}       gradient="bg-gradient-to-br from-sky-500 to-blue-600" />
          <StatCard icon={FaCheckCircle}  label="Active"      value={stats.active}      gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
          <StatCard icon={FaWrench}       label="Maintenance" value={stats.maintenance} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
          <StatCard icon={FaPowerOff}     label="Inactive"    value={stats.inactive}    gradient="bg-gradient-to-br from-slate-500 to-slate-700" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by asset tag, registration, make, model…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200">
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
          <Spinner label="Loading vehicles…" />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-3">
              <FaTruck className="text-sky-400" size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {vehicles.length === 0 ? "No vehicles yet" : "No matches"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {vehicles.length === 0
                ? "Register your first service vehicle to start managing your fleet."
                : "Try adjusting your search or status filter."}
            </p>
            {vehicles.length === 0 && (
              <button onClick={() => setCreateOpen(true)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-sky-500/30">
                <FaPlus size={11} /> Add your first vehicle
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((v) => {
              const id = v.id || v.vehicle_id || v.uuid;
              const norm = normalizeStatus(v);
              const style = statusStyle(norm);
              const title = v.asset_tag || v.registration_number || v.name || "Unnamed";
              const sub   = v.registration_number || v.asset_tag || id;

              return (
                <div key={id} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className={`h-1.5 bg-gradient-to-r ${style.bg}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center shadow-sm shrink-0`}>
                            <FaTruck className="text-white" size={14} />
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
                      {(v.make || v.model) && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                          {[v.make, v.model, v.variant].filter(Boolean).join(" ")}
                        </span>
                      )}
                      {v.vehicle_type && (
                        <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider border border-sky-200">
                          {v.vehicle_type}
                        </span>
                      )}
                      {v.ownership_type && (
                        <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider border border-violet-200">
                          {v.ownership_type}
                        </span>
                      )}
                      {v.inspection_status && (() => {
                        const ins = String(v.inspection_status).toUpperCase();
                        const cls =
                          ins === "VALID"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ins === "FAILED" || ins === "EXPIRED"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-50 text-slate-700 border-slate-200";
                        return (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
                            {v.inspection_status}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                      <button onClick={() => setSelected(v)}
                        className="flex-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                        <FaEye size={10} /> Details
                      </button>
                      <button onClick={() => setSelected(v)}
                        className="flex-1 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                        <FaHistory size={10} /> History
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateVehicleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(usedLabel) => {
          load();
          if (usedLabel && usedLabel !== "as-entered") {
            showToast(`Vehicle created using fallback shape: ${usedLabel}.`, "emerald");
          } else {
            showToast("Vehicle created successfully.", "emerald");
          }
        }}
      />

      {selected && (
        <DetailDrawer vehicle={selected} onClose={() => setSelected(null)} onRefresh={load} />
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