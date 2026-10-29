import { DollarSign, CalendarCheck, Users, BatteryCharging } from "lucide-react";

const revenueBars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const stats = [
  { label: "Revenue (Today)", value: "৳48,250", change: "+12.5%", icon: DollarSign, from: "from-emerald-500", to: "to-teal-500", shadow: "shadow-emerald-500/30" },
  { label: "Active Bookings", value: "34", change: "+8.2%", icon: CalendarCheck, from: "from-indigo-500", to: "to-violet-500", shadow: "shadow-indigo-500/30" },
  { label: "Drivers Online", value: "18/24", change: "+3", icon: Users, from: "from-amber-500", to: "to-orange-500", shadow: "shadow-amber-500/30" },
  { label: "Charging Units", value: "12 Active", change: "-1", icon: BatteryCharging, from: "from-rose-500", to: "to-pink-500", shadow: "shadow-rose-500/30" },
];

const bookings = [
  { id: "#CW-1042", customer: "Rahim Uddin", driver: "Karim Sheikh", unit: "Van-01", status: "Charging", amount: "৳450" },
  { id: "#CW-1041", customer: "Sadia Akter", driver: "Nabil Hasan", unit: "Van-03", status: "On the way", amount: "৳380" },
  { id: "#CW-1040", customer: "Tanvir Ahmed", driver: "—", unit: "—", status: "Pending", amount: "৳520" },
  { id: "#CW-1039", customer: "Mitu Rahman", driver: "Rakib Khan", unit: "Van-02", status: "Completed", amount: "৳300" },
  { id: "#CW-1038", customer: "Arif Hossain", driver: "Karim Sheikh", unit: "Van-01", status: "Completed", amount: "৳610" },
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
    Pending: "bg-slate-100 text-slate-700 ring-slate-200",
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return `inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${map[s] || map.Pending}`;
};

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back, Admin. Here's your overview today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{s.value}</p>
                <p className={`mt-1 text-xs font-semibold ${s.change.startsWith("-") ? "text-rose-500" : "text-emerald-500"}`}>
                  {s.change} vs last week
                </p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.from} ${s.to} shadow-lg ${s.shadow}`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Revenue Overview</h3>
              <p className="text-xs text-slate-500">Monthly earnings</p>
            </div>
            <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex h-52 items-end gap-2">
            {revenueBars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-emerald-400 transition hover:opacity-80" style={{ height: `${h}%` }} title={`৳${h * 1000}`} />
                <span className="text-[10px] text-slate-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">Fleet Status</h3>
          <p className="text-xs text-slate-500">Live charging units</p>
          <div className="mt-5 space-y-4">
            {fleet.map((v) => (
              <div key={v.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">
                    {v.name} <span className="text-xs font-normal text-slate-400">· {v.area}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-600">{v.level}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${v.level > 60 ? "bg-emerald-500" : v.level > 30 ? "bg-amber-500" : "bg-rose-500"}`}
                    style={{ width: `${v.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Recent Bookings</h3>
          <a href="/bookings" className="text-xs font-semibold text-indigo-600 hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
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
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-800">{b.id}</td>
                  <td className="px-6 py-4 text-slate-700">{b.customer}</td>
                  <td className="px-6 py-4 text-slate-600">{b.driver}</td>
                  <td className="px-6 py-4 text-slate-600">{b.unit}</td>
                  <td className="px-6 py-4"><span className={badgeClass(b.status)}>{b.status}</span></td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">{b.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}