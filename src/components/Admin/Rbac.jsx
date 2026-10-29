// src/components/Admin/Rbac.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  FaShieldAlt, FaUserShield, FaKey, FaUsers, FaSearch, FaCheckCircle,
  FaExclamationCircle, FaSpinner, FaPlus, FaTrash, FaChevronRight,
  FaArrowLeft, FaBolt, FaLock, FaLockOpen, FaSyncAlt, FaTimes,
  FaThLarge, FaListUl, FaUserTag,
} from "react-icons/fa";

/* ==================== INLINE API LAYER ==================== */
const BASE_URL    = "https://dev-evcowbbe.transev.site";
const ACCESS_KEY  = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY    = "admin_user";

function getToken() { return localStorage.getItem(ACCESS_KEY); }
function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);

  console.log(
    "%c[RBAC →] " + method + " " + path,
    "color:#10b981;font-weight:bold",
    "\n  body:", body !== undefined ? JSON.stringify(body) : "(none)"
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
    const e = new Error("Network error — cannot reach RBAC API.");
    e.isNetworkError = true;
    throw e;
  } finally { clearTimeout(timer); }

  const ct = res.headers.get("content-type") || "";
  let data = null;
  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    try { data = await res.text(); } catch { data = null; }
  }

  // Unwrap { data: {...} }
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
      `Request failed (${res.status})`;
    const e = new Error(msg);
    e.status = res.status;
    e.code   = data?.error?.code || data?.code;
    e.details = data?.error?.details;
    throw e;
  }
  return data;
}

/* ==================== HELPERS ==================== */
function toArray(v) { return Array.isArray(v) ? v : v ? [v] : []; }

function extractCapabilities(res) {
  if (!res) return [];
  const arr =
    res.capabilities || res.effective_capabilities ||
    res.data?.capabilities || res.data?.effective_capabilities || [];
  return toArray(arr).map((c) =>
    typeof c === "string" ? { id: c, name: c } : c
  );
}

function extractRoles(res) {
  if (!res) return [];
  const arr =
    res.roles || res.effective_roles || res.role ||
    res.data?.roles || res.data?.effective_roles || [];
  return toArray(arr).map((r) =>
    typeof r === "string" ? { id: r, name: r } : r
  );
}

/* ==================== SMALL UI ==================== */
function Badge({ children, tone = "slate" }) {
  const map = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${map[tone]}`}>
      {children}
    </span>
  );
}

function CapChip({ name, onRemove, effect }) {
  const tone =
    effect === "ALLOW" ? "emerald" : effect === "DENY" ? "rose" : "slate";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium
      ${tone === "emerald" ? "bg-emerald-50 border-emerald-200 text-emerald-800"
        : tone === "rose" ? "bg-rose-50 border-rose-200 text-rose-800"
        : "bg-slate-50 border-slate-200 text-slate-700"}`}>
      {effect === "ALLOW" && <FaLockOpen size={9} className="text-emerald-600" />}
      {effect === "DENY"  && <FaLock     size={9} className="text-rose-600" />}
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-current/60 hover:text-current transition"
          title="Remove"
        >
          <FaTimes size={9} />
        </button>
      )}
    </span>
  );
}

/* ==================== TAB 1: MY ACCESS ==================== */
function MyAccessTab() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/api/v1/admin/rbac/me");
        console.log("[rbac/me]", res);
        setData(res);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} />;

  const caps  = extractCapabilities(data);
  const roles = extractRoles(data);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <FaUserShield className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Effective Access</h2>
            <p className="text-xs text-slate-500">Capabilities resolved from roles + overrides</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge tone="emerald">{caps.length} capabilities</Badge>
          <Badge tone="sky">{roles.length} roles</Badge>
          {data?.account_id && <Badge tone="violet">Account {data.account_id.slice(0, 8)}…</Badge>}
        </div>

        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Roles
        </h3>
        <div className="flex flex-wrap gap-2 mb-5">
          {roles.length === 0
            ? <span className="text-xs text-slate-400 italic">No roles assigned</span>
            : roles.map((r, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
                  <FaUserTag size={10} /> {r.name || r.id}
                </span>
              ))}
        </div>

        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Capabilities ({caps.length})
        </h3>
        {caps.length === 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
            No capabilities granted. Ask another Admin to assign you a role.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {caps.map((c, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <FaCheckCircle className="text-emerald-500 shrink-0" size={12} />
                <span className="text-xs font-mono text-slate-700 truncate">{c.id || c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== TAB 2: CATALOG ==================== */
function CatalogTab() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [filter, setFilter]   = useState("");
  const [view, setView]       = useState("grid"); // grid | list

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/api/v1/admin/rbac/catalog");
        console.log("[rbac/catalog]", res);
        setCatalog(res);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} />;

  const roles = toArray(catalog?.roles || catalog?.default_roles || []);
  const caps  = toArray(catalog?.capabilities || catalog?.capability_catalog || []);

  const filteredRoles = roles.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(filter.toLowerCase())
  );
  const filteredCaps = caps.filter((c) =>
    JSON.stringify(c).toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Roles */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <FaUsers className="text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Default Roles</h2>
              <p className="text-xs text-slate-500">Fixed catalog — {roles.length} roles</p>
            </div>
          </div>
        </div>

        {roles.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No roles in catalog.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRoles.map((r, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition">
                <div className="flex items-center gap-2 mb-2">
                  <FaUserTag className="text-sky-600" size={12} />
                  <span className="font-bold text-sm text-slate-900">
                    {r.name || r.id || `Role ${i + 1}`}
                  </span>
                  {r.is_system && <Badge tone="violet">system</Badge>}
                </div>
                {r.description && (
                  <p className="text-[11px] text-slate-600 leading-snug mb-2">{r.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {toArray(r.capabilities || r.grants || []).slice(0, 6).map((c, j) => (
                    <CapChip key={j} name={typeof c === "string" ? c : c.id || c.name} />
                  ))}
                  {toArray(r.capabilities || r.grants || []).length > 6 && (
                    <span className="text-[10px] text-slate-400">+{toArray(r.capabilities || r.grants || []).length - 6} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Capabilities */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <FaKey className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Capability Catalog</h2>
              <p className="text-xs text-slate-500">{caps.length} fixed capabilities</p>
            </div>
          </div>
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition ${view === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400"}`}
            >
              <FaThLarge size={12} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition ${view === "list" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400"}`}
            >
              <FaListUl size={12} />
            </button>
          </div>
        </div>

        <div className="relative mb-3">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter capabilities…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredCaps.map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-violet-300 transition">
                <p className="text-[11px] font-mono font-semibold text-slate-800 truncate">
                  {c.id || c.name || c}
                </p>
                {c.description && (
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{c.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCaps.map((c, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <FaKey className="text-violet-400 mt-0.5 shrink-0" size={10} />
                <div>
                  <p className="text-xs font-mono text-slate-800">{c.id || c.name || c}</p>
                  {c.description && <p className="text-[10px] text-slate-500">{c.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== TAB 3: ACCOUNTS ==================== */
function AccountsTab({ catalog }) {
  const [accountId, setAccountId]   = useState("");
  const [account, setAccount]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [actionMsg, setActionMsg]   = useState(null);

  // New role input
  const [roleToAssign, setRoleToAssign] = useState("");

  // Override form
  const [ovCap, setOvCap]       = useState("");
  const [ovEffect, setOvEffect] = useState("ALLOW");
  const [ovBusy, setOvBusy]     = useState(false);

  const rolesCatalog = toArray(catalog?.roles || catalog?.default_roles || []);
  const capsCatalog  = toArray(catalog?.capabilities || catalog?.capability_catalog || []);

  const flash = (msg, tone = "emerald") => {
    setActionMsg({ msg, tone });
    setTimeout(() => setActionMsg(null), 3500);
  };

  const loadAccount = useCallback(async (id) => {
    if (!id) return;
    setLoading(true); setError(null); setAccount(null);
    try {
      const res = await apiRequest(`/api/v1/admin/rbac/accounts/${id}`);
      console.log("[rbac/account]", id, res);
      setAccount(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAssignRole = async (e) => {
    e.preventDefault();
    if (!roleToAssign.trim()) return;
    try {
      await apiRequest(`/api/v1/admin/rbac/accounts/${accountId}/roles`, {
        method: "POST",
        body: { role: roleToAssign.trim() },
      });
      flash(`Role "${roleToAssign}" assigned`);
      setRoleToAssign("");
      loadAccount(accountId);
    } catch (err) { flash(err.message, "rose"); }
  };

  const handleRevokeRole = async (role) => {
    if (!window.confirm(`Revoke role "${role}"?`)) return;
    try {
      await apiRequest(`/api/v1/admin/rbac/accounts/${accountId}/roles/${encodeURIComponent(role)}`, {
        method: "DELETE",
      });
      flash(`Role "${role}" revoked`);
      loadAccount(accountId);
    } catch (err) { flash(err.message, "rose"); }
  };

  const handleSetOverride = async (e) => {
    e.preventDefault();
    if (!ovCap.trim()) return;
    setOvBusy(true);
    try {
      await apiRequest(
        `/api/v1/admin/rbac/accounts/${accountId}/overrides/${encodeURIComponent(ovCap.trim())}`,
        { method: "PUT", body: { effect: ovEffect } }
      );
      flash(`Override ${ovEffect} on "${ovCap}"`);
      setOvCap("");
      loadAccount(accountId);
    } catch (err) { flash(err.message, "rose"); }
    finally { setOvBusy(false); }
  };

  const handleRemoveOverride = async (cap) => {
    if (!window.confirm(`Remove override for "${cap}"?`)) return;
    try {
      await apiRequest(
        `/api/v1/admin/rbac/accounts/${accountId}/overrides/${encodeURIComponent(cap)}`,
        { method: "DELETE" }
      );
      flash(`Override removed for "${cap}"`);
      loadAccount(accountId);
    } catch (err) { flash(err.message, "rose"); }
  };

  const assignedRoles = extractRoles(account);
  const overrides =
    account?.overrides && typeof account.overrides === "object"
      ? account.overrides
      : account?.data?.overrides || {};
  const effectiveCaps = extractCapabilities(account);

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={(e) => { e.preventDefault(); loadAccount(accountId.trim()); }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            <input
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="Enter account UUID…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !accountId.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/30 disabled:opacity-60"
          >
            {loading ? <FaSpinner className="animate-spin" size={14} /> : <FaSearch size={12} />}
            Lookup
          </button>
        </form>
      </div>

      {error && <ErrorBox message={error} />}
      {actionMsg && (
        <div className={`p-3 rounded-xl border flex items-start gap-2 ${
          actionMsg.tone === "rose"
            ? "bg-rose-50 border-rose-200"
            : "bg-emerald-50 border-emerald-200"
        }`}>
          {actionMsg.tone === "rose"
            ? <FaExclamationCircle className="text-rose-500 mt-0.5 shrink-0" size={13} />
            : <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={13} />}
          <span className={`text-xs ${actionMsg.tone === "rose" ? "text-rose-700" : "text-emerald-700"}`}>
            {actionMsg.msg}
          </span>
        </div>
      )}

      {loading && <Spinner />}

      {account && (
        <>
          {/* Account summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FaUserShield className="text-emerald-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900 truncate">
                  {account.email || account.name || accountId}
                </h2>
                <p className="text-[11px] text-slate-500 font-mono truncate">{accountId}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="sky">{assignedRoles.length} roles</Badge>
              <Badge tone="violet">{Object.keys(overrides).length} overrides</Badge>
              <Badge tone="emerald">{effectiveCaps.length} effective caps</Badge>
            </div>
          </div>

          {/* Roles management */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FaUsers className="text-sky-600" size={13} /> Assigned Roles
            </h3>

            {assignedRoles.length === 0 ? (
              <p className="text-xs text-slate-400 italic mb-3">No roles assigned.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {assignedRoles.map((r, i) => {
                  const name = r.name || r.id || r;
                  return (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-sky-50 border border-sky-200">
                      <span className="text-sm font-semibold text-sky-900 flex items-center gap-2">
                        <FaUserTag size={11} /> {name}
                      </span>
                      <button
                        onClick={() => handleRevokeRole(name)}
                        className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <FaTrash size={9} /> Revoke
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <form onSubmit={handleAssignRole} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <FaUserTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={11} />
                <input
                  list="rbac-roles"
                  value={roleToAssign}
                  onChange={(e) => setRoleToAssign(e.target.value)}
                  placeholder="Role name (e.g. support_admin)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
                <datalist id="rbac-roles">
                  {rolesCatalog.map((r, i) => (
                    <option key={i} value={r.id || r.name || r} />
                  ))}
                </datalist>
              </div>
              <button
                type="submit"
                disabled={!roleToAssign.trim()}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 disabled:opacity-60"
              >
                <FaPlus size={10} /> Assign
              </button>
            </form>
          </div>

          {/* Overrides management */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FaKey className="text-violet-600" size={13} /> Direct Overrides
            </h3>

            {Object.keys(overrides).length === 0 ? (
              <p className="text-xs text-slate-400 italic mb-3">No overrides set.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {Object.entries(overrides).map(([cap, effect]) => (
                  <div key={cap} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-xs font-mono text-slate-800 truncate mr-2">{cap}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge tone={String(effect).toUpperCase() === "ALLOW" ? "emerald" : "rose"}>
                        {String(effect).toUpperCase()}
                      </Badge>
                      <button
                        onClick={() => handleRemoveOverride(cap)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Remove override"
                      >
                        <FaTimes size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSetOverride} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
              <div className="relative">
                <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={10} />
                <input
                  list="rbac-caps"
                  value={ovCap}
                  onChange={(e) => setOvCap(e.target.value)}
                  placeholder="Capability (e.g. booking:read)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
                <datalist id="rbac-caps">
                  {capsCatalog.map((c, i) => (
                    <option key={i} value={typeof c === "string" ? c : c.id || c.name} />
                  ))}
                </datalist>
              </div>
              <select
                value={ovEffect}
                onChange={(e) => setOvEffect(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold focus:outline-none focus:border-emerald-400"
              >
                <option value="ALLOW">ALLOW</option>
                <option value="DENY">DENY</option>
              </select>
              <button
                type="submit"
                disabled={ovBusy || !ovCap.trim()}
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {ovBusy ? <FaSpinner className="animate-spin" size={11} /> : <FaPlus size={10} />}
                Set
              </button>
            </form>
          </div>

          {/* Effective capabilities */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FaShieldAlt className="text-emerald-600" size={13} /> Effective Capabilities
            </h3>
            {effectiveCaps.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No effective capabilities.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {effectiveCaps.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <FaCheckCircle className="text-emerald-500 shrink-0" size={10} />
                    <span className="text-[11px] font-mono text-emerald-900 truncate">{c.id || c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ==================== SHARED ==================== */
function Spinner() {
  return (
    <div className="p-12 flex flex-col items-center gap-3 text-slate-500">
      <FaSpinner className="animate-spin" size={26} />
      <p className="text-xs">Loading…</p>
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

/* ==================== MAIN PAGE ==================== */
export default function Rbac() {
  const [tab, setTab]           = useState("me");
  const [catalog, setCatalog]   = useState(null);
  const [catalogErr, setCatalogErr] = useState(null);

  // Pre-fetch catalog once (used in Catalog + Accounts tabs)
  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/api/v1/admin/rbac/catalog");
        setCatalog(res);
      } catch (err) { setCatalogErr(err.message); }
    })();
  }, []);

  const tabs = [
    { id: "me",       label: "My Access",  icon: FaUserShield },
    { id: "catalog",  label: "Catalog",    icon: FaListUl },
    { id: "accounts", label: "Accounts",   icon: FaUsers },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FaShieldAlt className="text-emerald-500" size={26} /> Role-Based Access Control
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Inspect capabilities, browse the catalog, and manage admin grants.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-300 transition shadow-sm"
            title="Refresh"
          >
            <FaSyncAlt size={13} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-slate-200 shadow-sm w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
                tab === id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {catalogErr && tab !== "me" && (
          <ErrorBox message={`Catalog could not be loaded: ${catalogErr}`} />
        )}

        {tab === "me"       && <MyAccessTab />}
        {tab === "catalog"  && <CatalogTab />}
        {tab === "accounts" && <AccountsTab catalog={catalog} />}
      </div>
    </div>
  );
}