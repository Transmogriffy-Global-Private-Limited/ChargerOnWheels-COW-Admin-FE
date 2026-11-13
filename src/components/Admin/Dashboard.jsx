import {
  IndianRupee,
  CalendarCheck,
  Users,
  BatteryCharging,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";

const revenueBars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const stats = [
  {
    label: "Revenue (Today)",
    value: "₹48,250",
    change: "+12.5%",
    positive: true,
    icon: IndianRupee,
    gradient: "from-emerald-400 via-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/30",
    chart: "from-emerald-400 to-teal-500",
  },
  {
    label: "Active Bookings",
    value: "34",
    change: "+8.2%",
    positive: true,
    icon: CalendarCheck,
    gradient: "from-indigo-400 via-indigo-500 to-violet-600",
    glow: "shadow-indigo-500/30",
    chart: "from-indigo-400 to-violet-500",
  },
  {
    label: "Drivers Online",
    value: "18/24",
    change: "+3",
    positive: true,
    icon: Users,
    gradient: "from-amber-400 via-orange-500 to-orange-600",
    glow: "shadow-amber-500/30",
    chart: "from-amber-400 to-orange-500",
  },
  {
    label: "Charging Units",
    value: "12 Active",
    change: "-1",
    positive: false,
    icon: BatteryCharging,
    gradient: "from-rose-400 via-rose-500 to-pink-600",
    glow: "shadow-rose-500/30",
    chart: "from-rose-400 to-pink-500",
  },
];

const bookings = [
  { id: "#CW-1042", customer: "Rahim Uddin", driver: "Karim Sheikh", unit: "Van-01", status: "Charging", amount: "₹450" },
  { id: "#CW-1041", customer: "Sadia Akter", driver: "Nabil Hasan", unit: "Van-03", status: "On the way", amount: "₹380" },
  { id: "#CW-1040", customer: "Tanvir Ahmed", driver: "—", unit: "—", status: "Pending", amount: "₹520" },
  { id: "#CW-1039", customer: "Mitu Rahman", driver: "Rakib Khan", unit: "Van-02", status: "Completed", amount: "₹300" },
  { id: "#CW-1038", customer: "Arif Hossain", driver: "Karim Sheikh", unit: "Van-01", status: "Completed", amount: "₹610" },
];

const fleet = [
  { name: "Van-01", area: "Dhanmondi", level: 78 },
  { name: "Van-02", area: "Gulshan", level: 45 },
  { name: "Van-03", area: "Mirpur", level: 92 },
  { name: "Van-04", area: "Uttara", level: 20 },
];

const badgeClass = (s) => {
  const map = {
    Charging: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    "On the way": "bg-amber-50 text-amber-700 ring-amber-200",
    Pending: "bg-slate-100 text-slate-600 ring-slate-200",
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return map[s] || map.Pending;
};

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

export default function Dashboard() {
  return (
    <div className="relative">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live dashboard
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                Admin
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here's what's happening with your fleet today.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm sm:flex">
            <Activity className="h-4 w-4 text-indigo-500" />
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.chart}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {s.label}
                  </p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    {s.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${
                        s.positive
                          ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                          : "bg-rose-50 text-rose-600 ring-rose-100"
                      }`}
                    >
                      {s.positive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {s.change}
                    </span>
                    <span className="text-[11px] text-slate-400">vs last week</span>
                  </div>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-lg ${s.glow} transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}
                >
                  <s.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Fleet */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Revenue chart */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Revenue Overview</h3>
                <p className="text-xs text-slate-500">Monthly earnings · in ₹</p>
              </div>
              <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>

            <div className="flex h-60 items-end gap-1.5 sm:gap-2.5">
              {revenueBars.map((h, i) => (
                <div
                  key={i}
                  className="group/bar flex h-full flex-1 flex-col items-center gap-2"
                >
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className="relative w-full rounded-t-lg bg-gradient-to-t from-indigo-500 via-indigo-400 to-emerald-400 transition-all duration-300 group-hover/bar:from-indigo-600 group-hover/bar:to-emerald-300 group-hover/bar:shadow-lg group-hover/bar:shadow-indigo-400/40"
                      style={{ height: `${h}%` }}
                    >
                      <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover/bar:opacity-100">
                        ₹{(h * 1000).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 transition group-hover/bar:text-slate-700">
                    {months[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fleet status */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Fleet Status</h3>
                <p className="text-xs text-slate-500">Live charging units</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600 ring-1 ring-indigo-100">
                {fleet.length} vans
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {fleet.map((v) => {
                const C = 2 * Math.PI * 16;
                const offset = C * (1 - v.level / 100);
                const stroke =
                  v.level > 60
                    ? "stroke-emerald-500"
                    : v.level > 30
                    ? "stroke-amber-500"
                    : "stroke-rose-500";
                const pill =
                  v.level > 60
                    ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                    : v.level > 30
                    ? "bg-amber-50 text-amber-600 ring-amber-100"
                    : "bg-rose-50 text-rose-600 ring-rose-100";
                const label = v.level > 60 ? "High" : v.level > 30 ? "Medium" : "Low";

                return (
                  <div
                    key={v.name}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:border-slate-200 hover:bg-white hover:shadow-sm"
                  >
                    <div className="relative h-11 w-11 shrink-0">
                      <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          strokeWidth="4"
                          className="stroke-slate-200"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          strokeWidth="4"
                          strokeLinecap="round"
                          className={`${stroke} transition-all duration-700`}
                          strokeDasharray={C}
                          strokeDashoffset={offset}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">
                        {v.level}%
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{v.name}</p>
                      <p className="text-xs text-slate-400">{v.area}</p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${pill}`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h3 className="font-bold text-slate-900">Recent Bookings</h3>
              <p className="text-xs text-slate-500">Latest activity from your fleet</p>
            </div>
            <a
              href="/bookings"
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 ring-1 ring-indigo-100 transition hover:bg-indigo-100"
            >
              View all →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 text-left text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Booking</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Driver</th>
                  <th className="px-6 py-3">Unit</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{b.id}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-[11px] font-bold text-indigo-700">
                          {initials(b.customer)}
                        </span>
                        <span className="font-medium text-slate-700">{b.customer}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {b.driver === "—" ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[11px] font-bold text-slate-600">
                            {initials(b.driver)}
                          </span>
                          <span className="text-slate-600">{b.driver}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {b.unit}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${badgeClass(
                          b.status
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {b.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-900">{b.amount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}