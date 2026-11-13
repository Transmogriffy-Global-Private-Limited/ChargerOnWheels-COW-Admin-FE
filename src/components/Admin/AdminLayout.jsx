// src/components/Admin/AdminLayout.jsx
import { createElement, useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Truck, BatteryCharging, CalendarCheck,
  Wallet, BarChart3, Settings, Zap, LogOut, Menu, Bell, Search,
  PanelLeftClose, PanelLeftOpen, ChevronDown, User, ShieldCheck,
  CircleHelp, Sun, Moon, Shield,
  Plug, Link2, DollarSign, Map, Library, UserCheck, X, Command,
} from "lucide-react";
import { useAuth } from "../../App";

/* ==================== Inline getUser ==================== */
const USER_KEY = "admin_user";
function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/* ==================== Nav config ==================== */
const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/bookings", label: "Bookings",         icon: CalendarCheck },
      { to: "/drivers",  label: "Drivers",          icon: Users },
      { to: "/vehicles", label: "Service Vehicles", icon: BatteryCharging },
      { to: "/chargers", label: "Chargers",         icon: Plug },
      { to: "/pairings", label: "Pairings",         icon: Link2 },
      { to: "/zones",    label: "Zones",            icon: Map },
      { to: "/users",    label: "Customers",        icon: Truck },
    ],
  },
  {
    label: "Finance",
    items: [
      { to: "/payments",   label: "Payments",   icon: Wallet },
      { to: "/pricing",    label: "Pricing",    icon: DollarSign },
      { to: "/commercial", label: "Commercial", icon: Library },
      { to: "/reports",    label: "Reports",    icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/settings",     label: "Settings",       icon: Settings },
      { to: "/rbac",         label: "Access Control", icon: Shield },
      { to: "/applications", label: "Recruitment",    icon: UserCheck },
    ],
  },
];

/* ==================== Page meta (breadcrumb) ==================== */
const PAGE_META = {
  "/dashboard":    { title: "Dashboard",        subtitle: "Overview" },
  "/bookings":     { title: "Bookings",         subtitle: "Operations" },
  "/drivers":      { title: "Drivers",          subtitle: "Operations" },
  "/vehicles":     { title: "Service Vehicles", subtitle: "Operations" },
  "/chargers":     { title: "Chargers",         subtitle: "Operations" },
  "/pairings":     { title: "Pairings",         subtitle: "Operations" },
  "/zones":        { title: "Zones",            subtitle: "Operations" },
  "/users":        { title: "Customers",        subtitle: "Operations" },
  "/payments":     { title: "Payments",         subtitle: "Finance" },
  "/pricing":      { title: "Pricing",          subtitle: "Finance" },
  "/commercial":   { title: "Commercial",       subtitle: "Finance" },
  "/reports":      { title: "Reports",          subtitle: "Finance" },
  "/settings":     { title: "Settings",         subtitle: "System" },
  "/rbac":         { title: "Access Control",   subtitle: "System" },
  "/applications": { title: "Recruitment",      subtitle: "System" },
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  /* ---------------- Theme state ---------------- */
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("admin_theme");
    if (saved === "light" || saved === "dark") return saved;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches)
      return "light";
    return "dark";
  });
  const isDark = theme === "dark";
  useEffect(() => { localStorage.setItem("admin_theme", theme); }, [theme]);

  /* ---------------- Other state ---------------- */
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [collapsed, setCollapsed]     = useState(
    () => localStorage.getItem("admin_sidebar_collapsed") === "1"
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);

  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  useEffect(() => {
    localStorage.setItem("admin_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    const onDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const admin        = getUser();
  const displayName  = admin?.name || admin?.full_name || "Admin";
  const displayEmail = admin?.email || "admin@charger.com";
  const initials     = displayName
    .split(" ").map((w) => w[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const meta = PAGE_META[location.pathname.replace(/\/$/, "")] || { title: "Dashboard", subtitle: "Admin" };

  /* ==================== PALETTE (per theme) ==================== */
  const p = isDark
    ? {
        pageBg:        "bg-[#080b12]",
        pageText:      "text-slate-300",
        glow1:         "bg-emerald-500/[0.07]",
        glow2:         "bg-teal-500/[0.06]",

        sidebar:       "bg-gradient-to-b from-[#0d1220] via-[#0a0f18] to-[#070a10]",
        sidebarBorder: "border-white/[0.06]",
        sidebarShadow: "shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)]",

        sectionLabel:  "text-slate-600",
        navIdle:       "text-slate-400 hover:text-white hover:bg-white/[0.05]",
        navActive:     "bg-gradient-to-r from-emerald-500/[0.20] via-teal-500/[0.10] to-transparent text-emerald-300 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.15)]",
        navActiveBar:  "bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",
        navIconIdle:   "group-hover:text-emerald-300/80",
        navIconActive: "text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.55)]",
        logoSub:       "text-emerald-400/90",

        iconBtn:       "text-slate-500 hover:text-emerald-400 hover:bg-white/[0.06]",

        userCard:      "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-emerald-500/25",
        userName:      "text-white",
        userEmail:     "text-slate-500",
        avatarDotBorder: "border-[#0a0f18]",

        logoutBtn:     "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20",

        topbarBg:      "bg-[#080b12]/70",
        topbarBorder:  "border-white/[0.06]",

        searchIcon:    "text-slate-500 group-focus-within:text-emerald-400",
        searchInput:   "border-white/[0.06] bg-white/[0.03] text-white placeholder-slate-500 focus:border-emerald-500/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-emerald-500/15",
        kbd:           "border-white/10 bg-white/[0.04] text-slate-500",

        dropdownBg:    "bg-[#0d1220]/95 border-white/[0.08] shadow-2xl shadow-black/60",
        dropdownHover: "hover:bg-white/[0.05]",
        dropdownDivider: "border-white/[0.06]",
        dropdownName:  "text-white",
        dropdownEmail: "text-slate-500",
        dropdownItem:  "text-slate-300 hover:bg-white/[0.05] hover:text-white",
        dropdownIcon:  "text-slate-500",
        notifTitle:    "text-white",
        notifTime:     "text-slate-500",

        ringDot:       "ring-[#080b12]",
        titleText:     "text-white",
        crumbText:     "text-slate-500",
        crumbAccent:   "text-emerald-400",
        scrollClass:   "admin-scroll-dark",
      }
    : {
        pageBg:        "bg-slate-50",
        pageText:      "text-slate-700",
        glow1:         "bg-emerald-300/25",
        glow2:         "bg-teal-300/20",

        sidebar:       "bg-white",
        sidebarBorder: "border-slate-200",
        sidebarShadow: "shadow-[4px_0_24px_-8px_rgba(15,23,42,0.10)]",

        sectionLabel:  "text-slate-400",
        navIdle:       "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
        navActive:     "bg-gradient-to-r from-emerald-50 to-teal-50/60 text-emerald-700 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.18)]",
        navActiveBar:  "bg-gradient-to-b from-emerald-500 to-teal-600 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
        navIconIdle:   "group-hover:text-emerald-600",
        navIconActive: "text-emerald-600",
        logoSub:       "text-emerald-600",

        iconBtn:       "text-slate-500 hover:text-emerald-600 hover:bg-slate-100",

        userCard:      "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-emerald-300",
        userName:      "text-slate-900",
        userEmail:     "text-slate-500",
        avatarDotBorder: "border-white",

        logoutBtn:     "text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200",

        topbarBg:      "bg-white/70",
        topbarBorder:  "border-slate-200",

        searchIcon:    "text-slate-400 group-focus-within:text-emerald-500",
        searchInput:   "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-200",
        kbd:           "border-slate-200 bg-slate-50 text-slate-400",

        dropdownBg:    "bg-white border-slate-200 shadow-2xl shadow-slate-900/10",
        dropdownHover: "hover:bg-slate-50",
        dropdownDivider: "border-slate-200",
        dropdownName:  "text-slate-900",
        dropdownEmail: "text-slate-500",
        dropdownItem:  "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        dropdownIcon:  "text-slate-400",
        notifTitle:    "text-slate-900",
        notifTime:     "text-slate-500",

        ringDot:       "ring-white",
        titleText:     "text-slate-900",
        crumbText:     "text-slate-400",
        crumbAccent:   "text-emerald-600",
        scrollClass:   "admin-scroll-light",
      };

  /* ==================== RENDER ==================== */
  return (
    <div className={`relative flex min-h-screen ${p.pageBg} ${p.pageText} overflow-hidden transition-colors duration-300`}>
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500">
        <div className={`absolute -top-40 left-1/4 w-[600px] h-[600px] ${p.glow1} rounded-full blur-[140px]`} />
        <div className={`absolute -bottom-40 right-0 w-[500px] h-[500px] ${p.glow2} rounded-full blur-[140px]`} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ==================== SIDEBAR ==================== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col
          ${p.sidebar} border-r ${p.sidebarBorder} ${p.sidebarShadow}
          transform transition-all duration-300 ease-out
          ${collapsed ? "lg:w-[76px]" : "lg:w-[260px]"}
          w-[280px]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 border-b ${p.sidebarBorder} shrink-0 transition-colors duration-300 ${
            collapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className={`absolute inset-0 rounded-xl blur-md ${isDark ? "bg-emerald-400/50" : "bg-emerald-400/40"}`} />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </div>
            </div>
            {!collapsed && (
              <div className="leading-tight min-w-0">
                <div className={`text-sm font-black tracking-tight truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                  Charger
                </div>
                <div className={`text-[10px] font-bold tracking-[0.15em] uppercase ${p.logoSub}`}>
                  on wheels
                </div>
              </div>
            )}
          </div>

          {/* Collapse (desktop) */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${p.iconBtn}`}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          )}

          {/* Close (mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className={`lg:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${p.iconBtn}`}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {collapsed && (
          <div className={`hidden lg:flex justify-center py-3 border-b ${p.sidebarBorder}`}>
            <button
              onClick={() => setCollapsed(false)}
              className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${p.iconBtn}`}
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen size={16} />
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className={`flex-1 overflow-y-auto px-3 py-5 space-y-6 ${p.scrollClass}`}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {!collapsed ? (
                <div className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] ${p.sectionLabel}`}>
                  {section.label}
                </div>
              ) : (
                <div className={`mx-auto mb-2 h-px w-6 ${isDark ? "bg-white/[0.06]" : "bg-slate-200"}`} />
              )}
              <ul className="space-y-1">
                {section.items.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? label : undefined}
                      className={({ isActive }) =>
                        `group relative flex items-center ${
                          collapsed ? "justify-center" : "gap-3"
                        } rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive ? p.navActive : p.navIdle
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full ${p.navActiveBar}`} />
                          )}
                          {createElement(Icon, {
                            className: `h-[18px] w-[18px] shrink-0 transition-all duration-200 ${
                              isActive ? p.navIconActive : p.navIconIdle
                            }`,
                          })}
                          {!collapsed && <span className="truncate">{label}</span>}

                          {/* Collapsed tooltip */}
                          {collapsed && (
                            <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
                              {label}
                              <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User card + logout */}
        <div className={`p-3 border-t ${p.sidebarBorder} space-y-2`}>
          {!collapsed ? (
            <button
              onClick={() => { setProfileOpen(true); navigate("/settings"); }}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 transition-all text-left ${p.userCard}`}
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[11px] font-black text-white shadow-md shadow-emerald-500/30">
                  {initials}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 ${p.avatarDotBorder}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-bold truncate ${p.userName}`}>{displayName}</div>
                <div className={`text-[10px] truncate ${p.userEmail}`}>{displayEmail}</div>
              </div>
              <ChevronDown size={14} className={`shrink-0 ${p.dropdownIcon}`} />
            </button>
          ) : (
            <div className="flex justify-center py-1">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[11px] font-black text-white shadow-md shadow-emerald-500/30">
                  {initials}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 ${p.avatarDotBorder}`} />
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`group flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            } w-full rounded-xl px-3 py-2.5 text-sm font-medium border border-transparent transition-all ${p.logoutBtn}`}
            title="Logout"
          >
            <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ==================== MAIN ==================== */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-[76px]" : "lg:ml-[260px]"
        }`}
      >
        {/* Topbar */}
        <header className={`sticky top-0 z-20 h-16 flex items-center justify-between gap-3 px-4 lg:px-6 border-b backdrop-blur-xl transition-colors duration-300 ${p.topbarBorder} ${p.topbarBg}`}>
          {/* Left: mobile menu + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden rounded-lg p-2 transition-colors ${p.iconBtn}`}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold">
                <span className={p.crumbText}>Admin</span>
                <span className={p.crumbText}>/</span>
                <span className={p.crumbAccent}>{meta.subtitle}</span>
              </div>
              <h1 className={`text-sm sm:text-base font-black tracking-tight truncate ${p.titleText}`}>
                {meta.title}
              </h1>
            </div>
          </div>

          {/* Right: search + actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search */}
            <div className="relative hidden md:block w-56 lg:w-72 group">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${p.searchIcon}`} />
              <input
                placeholder="Search..."
                className={`w-full rounded-xl border py-2 pl-9 pr-14 text-sm outline-none transition-all ${p.searchInput}`}
              />
              <span className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${p.kbd}`}>
                <Command className="h-2.5 w-2.5" />K
              </span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`rounded-xl p-2 transition-colors ${p.iconBtn}`}
              aria-label="Toggle theme"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="relative block h-5 w-5">
                <Sun
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  }`}
                />
                <Moon
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                  }`}
                />
              </span>
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className={`relative rounded-xl p-2 transition-colors ${p.iconBtn}`}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className={`relative inline-flex rounded-full h-2 w-2 bg-rose-500 ring-2 ${p.ringDot}`} />
                </span>
              </button>

              {notifOpen && (
                <div className={`absolute right-0 mt-2 w-[320px] rounded-2xl border backdrop-blur-xl p-2 z-50 animate-[fadeIn_0.15s_ease-out] ${p.dropdownBg}`}>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${p.notifTime}`}>
                      Notifications
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                      4 new
                    </span>
                  </div>
                  {[
                    { title: "New tariff policy published",       time: "2 min ago",   color: "bg-emerald-400" },
                    { title: "Pairing CHG-07 ↔ VH-03 created",   time: "1 hour ago",  color: "bg-indigo-400" },
                    { title: "Driver KYC approved",              time: "3 hours ago", color: "bg-amber-400" },
                    { title: "Charger CHG-07 is offline",        time: "Yesterday",   color: "bg-rose-400" },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${p.dropdownHover}`}
                    >
                      <div className={`w-2 h-2 mt-1.5 rounded-full ${n.color} shadow-[0_0_6px_currentColor] shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm truncate ${p.notifTitle}`}>{n.title}</div>
                        <div className={`text-[11px] ${p.notifTime}`}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div className={`px-3 py-2 border-t mt-1 text-center ${p.dropdownDivider}`}>
                    <button className={`text-xs font-semibold ${isDark ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-700"}`}>
                      View all →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className={`flex items-center gap-2 rounded-xl pl-1 pr-2 py-1 transition-colors ${p.dropdownHover}`}
              >
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[11px] font-black text-white shadow-md shadow-emerald-500/30">
                    {initials}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 ${p.avatarDotBorder}`} />
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <div className={`text-xs font-bold max-w-[120px] truncate ${p.userName}`}>{displayName}</div>
                  <div className={`text-[10px] ${p.userEmail}`}>Admin</div>
                </div>
                <ChevronDown
                  className={`hidden md:block h-3.5 w-3.5 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  } ${p.dropdownIcon}`}
                />
              </button>

              {profileOpen && (
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl border backdrop-blur-xl p-1.5 z-50 animate-[fadeIn_0.15s_ease-out] ${p.dropdownBg}`}>
                  <div className={`px-3 py-2.5 border-b mb-1 ${p.dropdownDivider}`}>
                    <div className={`text-sm font-bold truncate ${p.dropdownName}`}>{displayName}</div>
                    <div className={`text-[11px] truncate ${p.dropdownEmail}`}>{displayEmail}</div>
                  </div>
                  {[
                    { label: "Profile",        icon: User,        to: "/settings" },
                    { label: "Security",       icon: ShieldCheck, to: "/settings" },
                    { label: "Access Control", icon: Shield,      to: "/rbac" },
                    { label: "Help",           icon: CircleHelp,  to: "/settings" },
                  ].map(({ label, icon: Icon, to }) => (
                    <button
                      key={label}
                      onClick={() => { setProfileOpen(false); navigate(to); }}
                      className={`flex items-center gap-2.5 w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${p.dropdownItem}`}
                    >
                      {createElement(Icon, { size: 14, className: p.dropdownIcon })}
                      {label}
                    </button>
                  ))}
                  <div className={`border-t mt-1 pt-1 ${p.dropdownDivider}`}>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-2.5 w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                        isDark ? "text-rose-400 hover:bg-rose-500/10" : "text-rose-600 hover:bg-rose-50"
                      }`}
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .admin-scroll-dark::-webkit-scrollbar { width: 4px; }
        .admin-scroll-dark::-webkit-scrollbar-track { background: transparent; }
        .admin-scroll-dark::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .admin-scroll-dark::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

        .admin-scroll-light::-webkit-scrollbar { width: 4px; }
        .admin-scroll-light::-webkit-scrollbar-track { background: transparent; }
        .admin-scroll-light::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.12); border-radius: 4px; }
        .admin-scroll-light::-webkit-scrollbar-thumb:hover { background: rgba(15,23,42,0.22); }
      `}</style>
    </div>
  );
}