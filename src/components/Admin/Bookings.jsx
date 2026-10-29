import { Search, Filter } from "lucide-react";

const bookings = [
  { id: "#CW-1042", customer: "Rahim Uddin", driver: "Karim Sheikh", unit: "Van-01", date: "27 Oct, 10:24 AM", amount: "৳450", status: "Charging" },
  { id: "#CW-1041", customer: "Sadia Akter", driver: "Nabil Hasan", unit: "Van-03", date: "27 Oct, 09:48 AM", amount: "৳380", status: "On the way" },
  { id: "#CW-1040", customer: "Tanvir Ahmed", driver: "—", unit: "—", date: "27 Oct, 09:12 AM", amount: "৳520", status: "Pending" },
  { id: "#CW-1039", customer: "Mitu Rahman", driver: "Rakib Khan", unit: "Van-02", date: "27 Oct, 08:30 AM", amount: "৳300", status: "Completed" },
  { id: "#CW-1038", customer: "Arif Hossain", driver: "Karim Sheikh", unit: "Van-01", date: "26 Oct, 07:15 PM", amount: "৳610", status: "Completed" },
  { id: "#CW-1037", customer: "Nadia Islam", driver: "—", unit: "—", date: "26 Oct, 05:40 PM", amount: "৳280", status: "Cancelled" },
];

const badgeClass = (s) => {
  const map = {
    Charging: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    "On the way": "bg-amber-50 text-amber-700 ring-amber-200",
    Pending: "bg-slate-100 text-slate-700 ring-slate-200",
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return `inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${map[s]}`;
};

export default function Bookings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">All charging requests & orders</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: "1,248", color: "text-slate-900" },
          { label: "Ongoing", value: "34", color: "text-indigo-600" },
          { label: "Completed", value: "1,180", color: "text-emerald-600" },
          { label: "Cancelled", value: "34", color: "text-rose-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
            <div className={`mt-1 text-2xl font-black ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search by booking ID or customer..."
              className="w-72 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Booking ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Driver</th>
                <th className="px-6 py-3">Unit</th>
                <th className="px-6 py-3">Date</th>
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
                  <td className="px-6 py-4 text-slate-500">{b.date}</td>
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