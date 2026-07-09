import { Pencil, Trash2, Eye, ShieldCheck } from "lucide-react";

export default function StaffTable({ staff = [], onEdit, onDelete }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr className="text-left text-slate-300">

              <th className="px-5 py-4">Staff</th>
              <th className="px-5 py-4">Rank</th>
              <th className="px-5 py-4">Department</th>
              <th className="px-5 py-4">Badge</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {staff.map((item) => (

              <tr
                key={item.id}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >

                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={
                        item.photo_url ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(item.name)
                      }
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>

                      <h3 className="text-white font-medium">
                        {item.name}
                      </h3>

                      <p className="text-slate-400 text-sm">
                        {item.employee_id}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-5 py-4">

                  <span className="bg-cyan-600 text-white text-xs px-3 py-1 rounded-full">
                    {item.rank}
                  </span>

                </td>

                <td className="px-5 py-4 text-slate-300">
                  {item.department}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {item.badge_number || "-"}
                </td>

                <td className="px-5 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.active
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>

                </td>

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-2">

                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-600">
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-yellow-600"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-green-600">
                      <ShieldCheck size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
