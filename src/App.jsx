// src/App.jsx
// ✅ Inline AuthProvider + useAuth — no separate AuthContext.jsx needed
// ✅ Login / ForgetPassword / Settings pages are fully self-contained
// ✅ Other components can import useAuth from '../../App' if needed
//    (or keep using AuthContext.jsx — both work)

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

// Self-contained pages (no services/context imports)
import LoginPage from "./components/Admin/Login";
import ForgetPassword from "./components/Admin/ForgetPassword";
import Settings from "./components/Admin/Settings";

// Other admin pages
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./components/Admin/Dashboard";
import Users from "./components/Admin/Users";
import Drivers from "./components/Admin/Drivers";
import Vehicles from "./components/Admin/Vehicles";
import Bookings from "./components/Admin/Bookings";
import Pricing from "./components/Admin/Pricing";
import Reports from "./components/Admin/Reports";
import AccessControl from './components/Admin/Rbac';
import Chargers from './components/Admin/Chargers';
import Pairings from './components/Admin/Pairings';
/* ==================== INLINE AUTH LAYER ==================== */
const ACCESS_KEY  = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY    = "admin_user";
const BASE_URL    = "https://dev-evcowbbe.transev.site";

const AuthContext = createContext(null);

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function isAuthenticated() {
  return Boolean(localStorage.getItem(ACCESS_KEY) || readUser());
}

function clearAuth() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  const syncAuth = useCallback(() => {
    const t = localStorage.getItem(ACCESS_KEY);
    const u = readUser();
    setToken(t);
    setUser(u);
    return { token: t, user: u };
  }, []);

  useEffect(() => {
    syncAuth();
    setLoading(false);
  }, [syncAuth]);

  const logout = useCallback(async () => {
    try {
      const t = localStorage.getItem(ACCESS_KEY);
      await fetch(`${BASE_URL}/api/v1/admin/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
        },
        body: JSON.stringify({}),
      });
    } catch { /* ignore */ }
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user || token),
    logout,
    syncAuth,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ==================== ROUTE GUARDS ==================== */
function SplashLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin" />
        <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Loading…</p>
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { loading } = useAuth();
  if (loading) return <SplashLoading />;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function PublicRoute() {
  const { loading } = useAuth();
  if (loading) return <SplashLoading />;
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function RootRedirect() {
  const { loading } = useAuth();
  if (loading) return <SplashLoading />;
  return <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />;
}

/* ==================== APP ==================== */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route element={<PublicRoute />}>
            <Route path="/login"                 element={<LoginPage />} />
            <Route path="/forget-password"       element={<ForgetPassword />} />
            <Route path="/forgot-password"       element={<ForgetPassword />} />
            <Route path="/admin/forget-password" element={<ForgetPassword />} />
            <Route path="/admin/forgot-password" element={<ForgetPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route path="dashboard"         element={<Dashboard />} />
              <Route path="admin/dashboard"   element={<Dashboard />} />
              <Route path="users"             element={<Users />} />
              <Route path="drivers"           element={<Drivers />} />
              <Route path="vehicles"          element={<Vehicles />} />
              <Route path="bookings"          element={<Bookings />} />
              <Route path="pricing"          element={<Pricing />} />
              <Route path="reports"           element={<Reports />} />
              <Route path="settings"          element={<Settings />} />
              <Route path="rbac"              element={<AccessControl />} />
              <Route path="chargers"          element={<Chargers />} />
              <Route path="pairings"          element={<Pairings />} />
            </Route>
          </Route>

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}