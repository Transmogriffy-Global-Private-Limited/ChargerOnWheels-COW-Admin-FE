import { Search, Plus, MoreVertical } from "lucide-react";

const users = [
  { id: 1, name: "Rahim Uddin", email: "rahim@mail.com", phone: "+880 1712 345678", bookings: 12, spent: "৳5,400", status: "Active" },
  { id: 2, name: "Sadia Akter", email: "sadia@mail.com", phone: "+880 1812 987654", bookings: 8, spent: "৳3,200", status: "Active" },
  { id: 3, name: "Tanvir Ahmed", email: "tanvir@mail.com", phone: "+880 1911 223344", bookings: 3, spent: "৳1,100", status: "Blocked" },
  { id: 4, name: "Mitu Rahman", email: "mitu@mail.com", phone: "+880 1611 556677", bookings: 21, spent: "৳9,800", status: "Active" },
  { id: 5, name: "Arif Hossain", email: "arif@mail.com", phone: "+880 1511 445566", bookings: 5, spent: "৳2,050", status: "Active" },
];

const badgeClass = (s) =>
  s === "Active"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1"
    : "bg-rose-50 text-rose-700 ring-rose-200 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1";

export default function Users() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all your app users</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search by name or email..."
              className="w-72 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
            <option>All Status</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Bookings</th>
                <th className="px-6 py-3">Total Spent</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 text-xs font-bold text-white">
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{u.phone}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{u.bookings}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{u.spent}</td>
                  <td className="px-6 py-4"><span className={badgeClass(u.status)}>{u.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}