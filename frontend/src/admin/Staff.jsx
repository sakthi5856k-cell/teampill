import { useEffect, useState } from "react";
import { Search, UserPlus, Pencil, Trash2, Eye } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");

  const loadStaff = () => {
    api
      .get("/staff")
      .then((res) => setStaff(res.data))
      .catch(() => toast.error("Failed to load staff"));
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const deleteStaff = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;

    try {
      await api.delete(`/admin/staff/${id}`);
      toast.success("Staff deleted");
      loadStaff();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = staff.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Staff Management
          </h1>

          <p className="text-slate-400">
            Manage Team Pillbox EMS Staff
          </p>
        </div>

        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-xl flex items-center gap-2">
          <UserPlus size={18} />
          Add Staff
        </button>

      </div>

      {/* Search */}

      <div className="relative max-w-md">

        <Search
          className="absolute left-3 top-3 text-slate-500"
          size={18}
        />

        <input
          placeholder="Search Staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white"
        />

      </div>

      {/* Table */}

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="text-left p-4 text-slate-300">Staff</th>

              <th className="text-left p-4 text-slate-300">Rank</th>

              <th className="text-left p-4 text-slate-300">Department</th>

              <th className="text-left p-4 text-slate-300">Badge</th>

              <th className="text-left p-4 text-slate-300">Status</th>

              <th className="text-center p-4 text-slate-300">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((item) => (

              <tr
                key={item.id}
                className="border-t border-slate-800 hover:bg-slate-800/40"
              >

                <td className="p-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={
                        item.photo_url ||
                        `https://ui-avatars.com/api/?name=${item.name}`
                      }
                      className="w-12 h-12 rounded-full"
                    />

                    <div>

                      <h3 className="text-white">
                        {item.name}
                      </h3>

                      <p className="text-slate-400 text-sm">
                        {item.employee_id}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="p-4 text-cyan-400">
                  {item.rank}
                </td>

                <td className="p-4 text-slate-300">
                  {item.department}
                </td>

                <td className="p-4 text-slate-300">
                  {item.badge_number || "-"}
                </td>

                <td className="p-4">

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

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button className="p-2 bg-slate-800 rounded-lg hover:bg-cyan-600">
                      <Eye size={18} />
                    </button>

                    <button className="p-2 bg-slate-800 rounded-lg hover:bg-yellow-600">
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteStaff(item.id)}
                      className="p-2 bg-slate-800 rounded-lg hover:bg-red-600"
                    >
                      <Trash2 size={18} />
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
