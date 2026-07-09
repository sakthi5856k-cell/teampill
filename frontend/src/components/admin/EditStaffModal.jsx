import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "sonner";

const RANKS = [
  "Executive Management",
  "HOD",
  "Doctor",
  "Nurse",
  "EMT",
  "Intern",
];

export default function EditStaffModal({
  open,
  onClose,
  onSuccess,
  staff,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rank: "EMT",
    department: "EMS",
    badge_number: "",
    photo_url: "",
    bio: "",
    active: true,
  });

  useEffect(() => {
    if (staff) {
      setForm({
        name: staff.name || "",
        rank: staff.rank || "EMT",
        department: staff.department || "EMS",
        badge_number: staff.badge_number || "",
        photo_url: staff.photo_url || "",
        bio: staff.bio || "",
        active: staff.active ?? true,
      });
    }
  }, [staff]);

  if (!open || !staff) return null;

  async function save(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/admin/staff/${staff.id}`, form);

      toast.success("Staff updated");

      onSuccess();

      onClose();

    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <form
        onSubmit={save}
        className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-xl p-6"
      >

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-white">
            Edit Staff
          </h2>

          <button type="button" onClick={onClose}>
            <X className="text-white" />
          </button>

        </div>

        <div className="grid gap-4">

          <input
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            className="bg-slate-800 rounded-xl p-3 text-white"
            placeholder="Name"
          />

          <select
            value={form.rank}
            onChange={(e)=>setForm({...form,rank:e.target.value})}
            className="bg-slate-800 rounded-xl p-3 text-white"
          >
            {RANKS.map(r=>(
              <option key={r}>{r}</option>
            ))}
          </select>

          <input
            value={form.department}
            onChange={(e)=>setForm({...form,department:e.target.value})}
            className="bg-slate-800 rounded-xl p-3 text-white"
            placeholder="Department"
          />

          <input
            value={form.badge_number}
            onChange={(e)=>setForm({...form,badge_number:e.target.value})}
            className="bg-slate-800 rounded-xl p-3 text-white"
            placeholder="Badge Number"
          />

          <input
            value={form.photo_url}
            onChange={(e)=>setForm({...form,photo_url:e.target.value})}
            className="bg-slate-800 rounded-xl p-3 text-white"
            placeholder="Photo URL"
          />

          <textarea
            rows={3}
            value={form.bio}
            onChange={(e)=>setForm({...form,bio:e.target.value})}
            className="bg-slate-800 rounded-xl p-3 text-white"
            placeholder="Bio"
          />

          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e)=>setForm({...form,active:e.target.checked})}
            />
            Active Staff
          </label>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            onClick={onClose}
            className="bg-slate-700 px-5 py-3 rounded-xl text-white"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="bg-cyan-600 px-5 py-3 rounded-xl text-white"
          >
            {loading ? "Saving..." : "Update Staff"}
          </button>

        </div>

      </form>

    </div>
  );
}
