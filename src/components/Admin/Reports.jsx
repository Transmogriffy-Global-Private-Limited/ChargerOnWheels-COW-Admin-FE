const topAreas = [
  { area: "Dhanmondi", bookings: 342, percent: 85 },
  { area: "Gulshan", bookings: 287, percent: 72 },
  { area: "Mirpur", bookings: 210, percent: 53 },
  { area: "Uttara", bookings: 168, percent: 42 },
  { area: "Banani", bookings: 134, percent: 34 },
];

const peakBars = [20, 35, 25, 55, 80, 95, 70, 60, 88, 75, 50, 30];

export default function Reports() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Business insights and performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Avg. Trip Value", value: "৳412" },
          { label: "Avg. Charge Time", value: "38 min" },
          { label: "Driver Utilization", value: "76%" },
          { label: "Customer Retention", value: "82%" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
            <div className="mt-2 text-2xl font-black text-slate-900">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">Top Areas by Bookings</h3>
          <div className="mt-5 space-y-4">
            {topAreas.map((a) => (
              <div key={a.area}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{a.area}</span>
                  <span className="text-xs font-bold text-slate-600">{a.bookings}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" style={{ width: `${a.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">Peak Hours</h3>
          <p className="text-xs text-slate-500">Bookings per hour</p>
          <div className="mt-5 flex h-40 items-end gap-2">
            {peakBars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t-md bg-gradient-to-t from-indigo-400 to-emerald-400" style={{ height: `${h}%` }} />
                <span className="text-[9px] text-slate-400">{i + 8}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}