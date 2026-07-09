import { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";
import AddStaffModal from "../components/admin/AddStaffModal";
import EditStaffModal from "../components/admin/EditStaffModal";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  async function loadStaff() {
    try {
      setLoading(true);

      const { data } = await api.get("/staff");

      setStaff(data);
    } catch (err) {
      toast.error("Unable to load staff");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  async function deleteStaff(id) {
    if (!window.confirm("Delete this staff member?")) return;

    try {
      await api.delete(`/admin/staff/${id}`);

      toast.success("Staff deleted");

      loadStaff();
    } catch {
      toast.error("Delete failed");
    }
  }

  const filtered = (staff || []).filter((item) => {
    const q = search.toLowerCase();

    return (
      item.name?.toLowerCase().includes(q) ||
      item.rank?.toLowerCase().includes(q) ||
      item.department?.toLowerCase().includes(q) ||
      item.employee_id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Staff Management
          </h1>

          <p className="text-slate-400 mt-1">
            Manage Team Pillbox EMS Staff Members
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={loadStaff}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            onClick={() => setOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <UserPlus size={18} />
            Add Staff
          </button>

        </div>

      </div>

      {/* Search */}

      <div className="relative max-w-md">

        <Search
          className="absolute left-3 top-3 text-slate-500"
          size={18}
        />

        <input
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white"
        />

      </div>

      {loading ? (

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-10 text-center text-slate-400">
          Loading staff...
        </div>

      ) : (

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
                            {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-slate-400"
                  >
                    No staff members found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
<img
  src={
    item.photo_url?.trim()
      ? item.photo_url
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}`
  }
  alt={item.name}
  onError={(e) => {
    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}`;
  }}
  className="w-12 h-12 rounded-full object-cover"
/>
                        <div>
                          <h3 className="text-white font-medium">
                            {item.name}
                          </h3>

                          <p className="text-slate-400 text-sm">
                            {item.employee_id || "No Employee ID"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-xs">
                        {item.rank}
                      </span>
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
                        <button
                          className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-600 transition"
                          title="View Profile"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          className="p-2 rounded-lg bg-slate-800 hover:bg-yellow-600 transition"
                          title="Edit Staff"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => deleteStaff(item.id)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 transition"
                          title="Delete Staff"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddStaffModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={loadStaff}
      />
    </div>
  );
}
