// src/components/Admin/Payments.jsx
import { useEffect, useMemo, useState } from "react";

/* ----------------------------- Dummy Data ----------------------------- */
const DUMMY_PAYMENTS = [
  { id: "PAY-1001", customer: "Aarav Sharma",  email: "aarav@example.com",  charger: "EV-AC-01", vehicle: "Tata Nexon EV",  amount: 450,  method: "UPI",        status: "Completed", date: "2025-01-14 10:23", duration: "1h 15m" },
  { id: "PAY-1002", customer: "Priya Patel",   email: "priya@example.com",  charger: "EV-DC-02", vehicle: "MG ZS EV",        amount: 890,  method: "Card",       status: "Completed", date: "2025-01-14 12:05", duration: "2h 05m" },
  { id: "PAY-1003", customer: "Rohan Mehta",   email: "rohan@example.com",  charger: "EV-AC-03", vehicle: "Hyundai Kona",    amount: 320,  method: "Wallet",     status: "Pending",   date: "2025-01-14 14:40", duration: "0h 55m" },
  { id: "PAY-1004", customer: "Sneha Iyer",    email: "sneha@example.com",  charger: "EV-DC-01", vehicle: "BYD Atto 3",      amount: 1250, method: "NetBanking", status: "Failed",    date: "2025-01-13 09:12", duration: "—" },
  { id: "PAY-1005", customer: "Vikram Singh",  email: "vikram@example.com", charger: "EV-AC-02", vehicle: "Tata Tiago EV",   amount: 275,  method: "UPI",        status: "Completed", date: "2025-01-13 16:30", duration: "0h 45m" },
  { id: "PAY-1006", customer: "Ananya Rao",    email: "ananya@example.com", charger: "EV-DC-03", vehicle: "Kia EV6",         amount: 1560, method: "Card",       status: "Refunded",  date: "2025-01-12 18:55", duration: "3h 10m" },
  { id: "PAY-1007", customer: "Karan Gupta",   email: "karan@example.com",  charger: "EV-AC-01", vehicle: "Mahindra XUV400", amount: 410,  method: "UPI",        status: "Completed", date: "2025-01-12 08:20", duration: "1h 05m" },
  { id: "PAY-1008", customer: "Meera Joshi",   email: "meera@example.com",  charger: "EV-DC-02", vehicle: "Tata Nexon EV",   amount: 720,  method: "Wallet",     status: "Pending",   date: "2025-01-11 20:10", duration: "1h 40m" },
];

/* ----------------------------- Status Styles (light + dark) ----------------------------- */
const STATUS_STYLES = {
  Completed: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400",
  Pending:   "bg-amber-500/10 text-amber-600 ring-amber-500/30 dark:text-amber-400",
  Failed:    "bg-rose-500/10 text-rose-600 ring-rose-500/30 dark:text-rose-400",
  Refunded:  "bg-sky-500/10 text-sky-600 ring-sky-500/30 dark:text-sky-400",
};

/* ----------------------------- Helpers ----------------------------- */
const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/* ----------------------------- Icons ----------------------------- */
const Icon = ({ d, className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const ICONS = {
  search:  "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z",
  download:"M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11",
  wallet:  "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm16 4h-3a2 2 0 100 4h3",
  check:   "M5 13l4 4L19 7",
  clock:   "M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  alert:   "M12 9v4m0 4h.01M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.4 0z",
  bolt:    "M13 2L3 14h8l-1 8 10-12h-8l1-8z",
  close:   "M6 6l12 12M6 18L18 6",
  sun:     "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
  moon:    "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
};

/* ----------------------------- Stat Card Tones ----------------------------- */
const TONES = {
  emerald: {
    grad: "from-emerald-500/10 to-transparent dark:from-emerald-500/15",
    ring: "ring-emerald-500/20 dark:ring-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
  },
  amber: {
    grad: "from-amber-500/10 to-transparent dark:from-amber-500/15",
    ring: "ring-amber-500/20 dark:ring-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
  },
  rose: {
    grad: "from-rose-500/10 to-transparent dark:from-rose-500/15",
    ring: "ring-rose-500/20 dark:ring-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/15",
  },
  sky: {
    grad: "from-sky-500/10 to-transparent dark:from-sky-500/15",
    ring: "ring-sky-500/20 dark:ring-sky-500/30",
    text: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-500/10 dark:bg-sky-500/15",
  },
};

/* ----------------------------- Stat Card ----------------------------- */
function StatCard({ label, value, sub, icon, tone }) {
  const t = TONES[tone];
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 bg-gradient-to-br ${t.grad} ring-1 ${t.ring} p-5 transition-colors`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{sub}</p>}
        </div>
        <div className={`rounded-xl p-2.5 ring-1 ${t.iconBg} ${t.text} ${t.ring}`}>
          <Icon d={icon} className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Details Drawer ----------------------------- */
function DetailsDrawer({ payment, onClose }) {
  if (!payment) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto transition-colors">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Details</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{payment.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Icon d={ICONS.close} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 dark:from-indigo-500/20 dark:to-purple-500/10 ring-1 ring-indigo-500/20 dark:ring-indigo-500/30 p-5">
            <p className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Amount Paid</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{formatINR(payment.amount)}</p>
            <span className={`inline-block mt-3 rounded-full px-3 py-1 text-xs font-medium ring-1 ${STATUS_STYLES[payment.status]}`}>
              {payment.status}
            </span>
          </div>

          {[
            ["Customer", payment.customer],
            ["Email", payment.email],
            ["Charger", payment.charger],
            ["Vehicle", payment.vehicle],
            ["Method", payment.method],
            ["Duration", payment.duration],
            ["Date", payment.date],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-sm">
              <span className="text-slate-500 dark:text-slate-400">{k}</span>
              <span className="font-medium text-slate-900 dark:text-white">{v}</span>
            </div>
          ))}

          <button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-white font-medium transition">
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Main Component ----------------------------- */
export default function Payments() {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  /* Toggle the `dark` class on <html> so Tailwind's dark: variants activate */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);

  const filtered = useMemo(() => {
    return DUMMY_PAYMENTS.filter((p) => {
      const matchesQuery =
        p.customer.toLowerCase().includes(query.toLowerCase()) ||
        p.id.toLowerCase().includes(query.toLowerCase()) ||
        p.charger.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const stats = useMemo(() => {
    const total = DUMMY_PAYMENTS.reduce((s, p) => s + p.amount, 0);
    const completed = DUMMY_PAYMENTS.filter((p) => p.status === "Completed");
    const pending = DUMMY_PAYMENTS.filter((p) => p.status === "Pending");
    const failed = DUMMY_PAYMENTS.filter((p) => p.status === "Failed");
    return {
      total,
      completedAmt: completed.reduce((s, p) => s + p.amount, 0),
      pendingAmt: pending.reduce((s, p) => s + p.amount, 0),
      failedCount: failed.length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-800 dark:text-slate-200 p-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 dark:ring-indigo-500/30">
              <Icon d={ICONS.wallet} />
            </span>
            Payments
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            Track and manage all charging transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 🌗 Theme toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
            className="rounded-xl p-2.5 ring-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Icon d={dark ? ICONS.sun : ICONS.moon} className="w-4 h-4" />
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition shadow-lg shadow-indigo-500/20">
            <Icon d={ICONS.download} className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={formatINR(stats.total)}        sub="All time"          icon={ICONS.bolt}  tone="emerald" />
        <StatCard label="Completed"     value={formatINR(stats.completedAmt)} sub="Settled payments"   icon={ICONS.check} tone="emerald" />
        <StatCard label="Pending"       value={formatINR(stats.pendingAmt)}   sub="Awaiting clearance" icon={ICONS.clock} tone="amber"   />
        <StatCard label="Failed"        value={stats.failedCount}             sub="Requires attention" icon={ICONS.alert} tone="rose"    />
      </div>

      {/* Filters + Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-950 ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Icon d={ICONS.search} className="w-4 h-4" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer, payment ID, or charger…"
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Completed", "Pending", "Failed", "Refunded"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-xl px-3.5 py-2 text-xs font-medium ring-1 transition ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white ring-indigo-500"
                    : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider">
              <tr>
                {["Payment ID", "Customer", "Charger", "Amount", "Method", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500 dark:text-slate-500">
                    No payments found for the current filters.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-indigo-600 dark:text-indigo-300">{p.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">{p.customer}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">{p.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.charger}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{formatINR(p.amount)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.method}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_STYLES[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{p.date}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(p)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span>Showing {filtered.length} of {DUMMY_PAYMENTS.length} payments</span>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">Prev</button>
            <button className="px-2.5 py-1 rounded-md bg-indigo-600 text-white">1</button>
            <button className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">2</button>
            <button className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">Next</button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <DetailsDrawer payment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}