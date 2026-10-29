import { Plus, Star, Phone, MapPin } from "lucide-react";

const drivers = [
  { name: "Karim Sheikh", phone: "+880 1712 111222", area: "Dhanmondi", rating: 4.8, trips: 324, status: "Online" },
  { name: "Nabil Hasan", phone: "+880 1712 333444", area: "Gulshan", rating: 4.6, trips: 210, status: "On Trip" },
  { name: "Rakib Khan", phone: "+880 1712 555666", area: "Mirpur", rating: 4.9, trips: 401, status: "Online" },
  { name: "Fahim Islam", phone: "+880 1712 777888", area: "Uttara", rating: 4.4, trips: 88, status: "Offline" },
];

const badgeClass = (s) => {
  const map = {
    Online: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "On Trip": "bg-indigo-50 text-indigo-700 ring-indigo-200",
    Offline: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return `inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${map[s]}`;
};

export default function Drivers() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Drivers</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your charging van drivers</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Driver
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {drivers.map((d) => (
          <div key={d.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 text-sm font-bold text-white">
                  {d.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{d.name}</div>
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="h-3 w-3" fill="currentColor" /> {d.rating} · {d.trips} trips
                  </div>
                </div>
              </div>
              <span className={badgeClass(d.status)}>{d.status}</span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400" />{d.phone}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-slate-400" />{d.area}</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800">View Profile</button>
              <button className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Assign Job</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}