import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "sonner";
import {
  LayoutDashboard, Users, Inbox, Image as ImageIcon, Megaphone,
  IdCard, ScrollText, Settings as Cog, Plus, Trash2, Check, X
} from "lucide-react";

const RANKS = ["Executive Management", "HOD", "Doctor", "Nurse", "EMT", "Intern"];
const CATS = ["hospital", "event", "training"];
const ANN_CATS = ["update", "event", "recruitment"];
const CERT_TYPES = ["training", "promotion", "appreciation"];

const TABS = [
  { k: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { k: "staff", label: "Staff", icon: Users },
  { k: "applications", label: "Applications", icon: Inbox },
  { k: "gallery", label: "Gallery", icon: ImageIcon },
  { k: "announcements", label: "Announcements", icon: Megaphone },
  { k: "idcards", label: "ID Cards", icon: IdCard },
  { k: "certificates", label: "Certificates", icon: ScrollText },
  { k: "settings", label: "Settings", icon: Cog },
];

export default function Admin() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("dashboard");

  if (loading) return <div className="p-16 text-center text-muted-foreground">Loading…</div>;
  if (!user || user.role !== "admin") return <Navigate to="/login" state={{ from: "/admin" }} replace />;

  return (
    <div className="grid lg:grid-cols-[260px_1fr] min-h-[calc(100vh-4rem)]" data-testid="admin-page">
      <aside className="bg-secondary text-white p-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/50">Control Room</div>
        <div className="font-display text-2xl mt-1">Admin Panel</div>
        <nav className="mt-8 flex flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.k}
              data-testid={`admin-tab-${t.k}`}
              onClick={() => setTab(t.k)}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-sm transition-colors ${
                tab === t.k ? "bg-primary text-white" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="p-6 sm:p-10 bg-background">
        {tab === "dashboard" && <Dashboard />}
        {tab === "staff" && <StaffAdmin />}
        {tab === "applications" && <ApplicationsAdmin />}
        {tab === "gallery" && <GalleryAdmin />}
        {tab === "announcements" && <AnnouncementsAdmin />}
        {tab === "idcards" && <IDCardAdmin />}
        {tab === "certificates" && <CertificatesAdmin />}
        {tab === "settings" && <SettingsAdmin />}
      </section>
    </div>
  );
}

// ============== DASHBOARD ==============
function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats").then((r) => setStats(r.data)); }, []);

  return (
    <div data-testid="admin-dashboard">
      <h2 className="font-display text-4xl text-secondary font-semibold">Dashboard</h2>
      <p className="text-muted-foreground mt-1">Operational overview.</p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          ["Active Staff", stats?.staff_count],
          ["Applications (pending)", stats?.applications_pending],
          ["Applications (total)", stats?.applications_total],
          ["Gallery Photos", stats?.gallery_count],
          ["Announcements", stats?.announcements_count],
          ["Certificates Issued", stats?.certificates_count],
        ].map(([k, v]) => (
          <div key={k} className="border border-border bg-white p-5 rounded-sm" data-testid={`stat-${k.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">{k}</div>
            <div className="font-display text-3xl mt-1 text-secondary">{v ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== STAFF ==============
function emptyStaff() {
  return { name: "", rank: "EMT", department: "EMS", photo_url: "", bio: "", badge_number: "", active: true };
}
function StaffAdmin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyStaff());

  const refresh = () => api.get("/staff").then((r) => setItems(r.data));
  useEffect(() => { refresh(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/admin/staff/${editing}`, form);
      else await api.post("/admin/staff", form);
      toast.success(editing ? "Staff updated" : "Staff added");
      setEditing(null); setForm(emptyStaff()); refresh();
    } catch (err) { toast.error("Save failed"); }
  };
  const del = async (id) => {
    if (!window.confirm("Remove this staff member?")) return;
    await api.delete(`/admin/staff/${id}`); refresh();
  };
  const edit = (s) => { setEditing(s.id); setForm({ ...s }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div data-testid="admin-staff">
      <h2 className="font-display text-4xl text-secondary font-semibold">Staff</h2>
      <p className="text-muted-foreground mt-1">Add, edit and retire team members.</p>

      <form onSubmit={save} className="mt-6 grid sm:grid-cols-2 gap-4 bg-white p-5 border border-border rounded-sm" data-testid="staff-form">
        <Inp label="Name" v={form.name} on={(v) => setForm({ ...form, name: v })} req testid="staff-form-name" />
        <Sel label="Rank" v={form.rank} on={(v) => setForm({ ...form, rank: v })} opts={RANKS} testid="staff-form-rank" />
        <Inp label="Department" v={form.department} on={(v) => setForm({ ...form, department: v })} testid="staff-form-dept" />
        <Inp label="Badge Number" v={form.badge_number || ""} on={(v) => setForm({ ...form, badge_number: v })} testid="staff-form-badge" />
        <Inp label="Photo URL" v={form.photo_url || ""} on={(v) => setForm({ ...form, photo_url: v })} testid="staff-form-photo" />
        <div className="sm:col-span-2">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Bio</span>
          <textarea data-testid="staff-form-bio" value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
            className="mt-1.5 w-full border border-border rounded-sm px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-2 flex gap-2">
          <button data-testid="staff-form-save" className="bg-primary text-white px-5 py-2.5 rounded-sm font-medium">{editing ? "Update Staff" : "Add Staff"}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm(emptyStaff()); }} className="border border-border px-5 py-2.5 rounded-sm">Cancel</button>}
        </div>
      </form>

      <div className="mt-8 border border-border bg-white rounded-sm divide-y divide-border">
        {items.map((s) => (
          <div key={s.id} className="p-4 flex items-center gap-4" data-testid={`admin-staff-row-${s.id}`}>
            <img src={s.photo_url || "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=200"} className="w-14 h-14 object-cover rounded-sm border border-border" alt="" />
            <div className="flex-1">
              <div className="font-display text-lg text-secondary">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.rank} · {s.department} · {s.employee_id}</div>
            </div>
            <button onClick={() => edit(s)} className="text-sm px-3 py-1.5 border border-border rounded-sm hover:border-primary hover:text-primary" data-testid={`edit-staff-${s.id}`}>Edit</button>
            <button onClick={() => del(s.id)} className="text-sm px-3 py-1.5 border border-border rounded-sm hover:border-primary hover:text-primary" data-testid={`delete-staff-${s.id}`}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== APPLICATIONS ==============
function ApplicationsAdmin() {
  const [items, setItems] = useState([]);
  const refresh = () => api.get("/admin/applications").then((r) => setItems(r.data));
  useEffect(() => { refresh(); }, []);

  const decide = async (id, decision) => {
    await api.post(`/admin/applications/${id}/decision`, { decision });
    toast.success(`Application ${decision}`);
    refresh();
  };

  return (
    <div data-testid="admin-applications">
      <h2 className="font-display text-4xl text-secondary font-semibold">Applications</h2>
      <p className="text-muted-foreground mt-1">Review and decide.</p>

      <div className="mt-8 grid gap-4">
        {items.length === 0 && <div className="text-muted-foreground" data-testid="apps-empty">No applications yet.</div>}
        {items.map((a) => (
          <article key={a.id} className="bg-white border border-border rounded-sm p-5" data-testid={`app-row-${a.id}`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary">{a.desired_role}</div>
                <div className="font-display text-xl text-secondary">{a.full_name} · <span className="font-mono text-sm text-muted-foreground">{a.discord_id}</span></div>
                <div className="text-xs text-muted-foreground">{a.timezone_str || a.timezone} · age {a.age} · {new Date(a.created_at).toLocaleString()}</div>
              </div>
              <StatusPill status={a.status} />
            </div>
            <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Experience</span><p>{a.experience}</p></div>
              <div><span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Why Join</span><p>{a.why_join}</p></div>
            </div>
            {a.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button onClick={() => decide(a.id, "approved")} data-testid={`approve-${a.id}`} className="inline-flex items-center gap-1.5 bg-[#2A9D8F] text-white px-4 py-2 rounded-sm text-sm"><Check className="w-4 h-4" /> Approve</button>
                <button onClick={() => decide(a.id, "rejected")} data-testid={`reject-${a.id}`} className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-sm text-sm"><X className="w-4 h-4" /> Reject</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
function StatusPill({ status }) {
  const map = { pending: "bg-amber-100 text-amber-700", approved: "bg-emerald-100 text-emerald-700", rejected: "bg-red-100 text-red-700" };
  return <span className={`text-[10px] font-mono uppercase tracking-[0.25em] px-2 py-1 rounded-sm ${map[status] || "bg-gray-100"}`} data-testid={`status-${status}`}>{status}</span>;
}

// ============== GALLERY ==============
function GalleryAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", category: "hospital", image_url: "", description: "" });
  const refresh = () => api.get("/gallery").then((r) => setItems(r.data));
  useEffect(() => { refresh(); }, []);
  const save = async (e) => {
    e.preventDefault();
    await api.post("/admin/gallery", form);
    setForm({ title: "", category: "hospital", image_url: "", description: "" });
    toast.success("Photo added"); refresh();
  };
  const del = async (id) => { await api.delete(`/admin/gallery/${id}`); refresh(); };

  return (
    <div data-testid="admin-gallery">
      <h2 className="font-display text-4xl text-secondary font-semibold">Gallery</h2>
      <form onSubmit={save} className="mt-6 grid sm:grid-cols-2 gap-4 bg-white border border-border p-5 rounded-sm">
        <Inp label="Title" v={form.title} on={(v) => setForm({ ...form, title: v })} req testid="gal-title" />
        <Sel label="Category" v={form.category} on={(v) => setForm({ ...form, category: v })} opts={CATS} testid="gal-cat" />
        <div className="sm:col-span-2"><Inp label="Image URL" v={form.image_url} on={(v) => setForm({ ...form, image_url: v })} req testid="gal-url" /></div>
        <div className="sm:col-span-2 flex"><button data-testid="gal-save" className="bg-primary text-white px-5 py-2.5 rounded-sm font-medium"><Plus className="w-4 h-4 inline -mt-0.5" /> Add Photo</button></div>
      </form>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((g) => (
          <div key={g.id} className="border border-border rounded-sm overflow-hidden bg-white">
            <img src={g.image_url} className="w-full aspect-square object-cover" alt="" />
            <div className="p-2 text-xs flex justify-between items-center">
              <span className="truncate">{g.title}</span>
              <button onClick={() => del(g.id)} data-testid={`del-gal-${g.id}`} className="text-primary"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== ANNOUNCEMENTS ==============
function AnnouncementsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", body: "", category: "update" });
  const refresh = () => api.get("/announcements").then((r) => setItems(r.data));
  useEffect(() => { refresh(); }, []);
  const save = async (e) => {
    e.preventDefault();
    await api.post("/admin/announcements", form);
    setForm({ title: "", body: "", category: "update" });
    toast.success("Announcement posted"); refresh();
  };
  const del = async (id) => { await api.delete(`/admin/announcements/${id}`); refresh(); };

  return (
    <div data-testid="admin-announcements">
      <h2 className="font-display text-4xl text-secondary font-semibold">Announcements</h2>
      <form onSubmit={save} className="mt-6 grid gap-4 bg-white border border-border p-5 rounded-sm">
        <div className="grid sm:grid-cols-2 gap-4">
          <Inp label="Title" v={form.title} on={(v) => setForm({ ...form, title: v })} req testid="ann-title" />
          <Sel label="Category" v={form.category} on={(v) => setForm({ ...form, category: v })} opts={ANN_CATS} testid="ann-cat" />
        </div>
        <label className="block">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Body</span>
          <textarea data-testid="ann-body" required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4}
            className="mt-1.5 w-full border border-border rounded-sm px-3 py-2 text-sm" />
        </label>
        <div><button data-testid="ann-save" className="bg-primary text-white px-5 py-2.5 rounded-sm font-medium"><Plus className="w-4 h-4 inline -mt-0.5" /> Post Announcement</button></div>
      </form>
      <div className="mt-6 divide-y divide-border bg-white border border-border rounded-sm">
        {items.map((a) => (
          <div key={a.id} className="p-4 flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">{a.category}</div>
              <div className="font-display text-lg text-secondary">{a.title}</div>
              <div className="text-sm text-muted-foreground line-clamp-2">{a.body}</div>
            </div>
            <button onClick={() => del(a.id)} data-testid={`del-ann-${a.id}`} className="text-primary"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== ID CARDS ==============
function IDCardAdmin() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/staff").then((r) => setItems(r.data)); }, []);
  return (
    <div data-testid="admin-idcards">
      <h2 className="font-display text-4xl text-secondary font-semibold">ID Card Generator</h2>
      <p className="text-muted-foreground mt-1">Pick a staff member to generate their printable ID card.</p>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((s) => (
          <Link key={s.id} to={`/idcard/${s.id}`} className="lift bg-white border border-border p-4 rounded-sm flex items-center gap-3" data-testid={`idcard-pick-${s.id}`}>
            <img src={s.photo_url || "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=200"} className="w-14 h-14 object-cover rounded-sm" alt="" />
            <div>
              <div className="font-display text-lg text-secondary">{s.name}</div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">{s.rank} · {s.employee_id}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============== CERTIFICATES ==============
function CertificatesAdmin() {
  const [form, setForm] = useState({ recipient_name: "", rank: "EMT", cert_type: "training", description: "", issued_by: "Director, Team Pillbox" });
  const [items, setItems] = useState([]);
  const refresh = () => api.get("/admin/certificates").then((r) => setItems(r.data));
  useEffect(() => { refresh(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/admin/certificates", form);
    toast.success("Certificate generated");
    refresh();
    window.open(`/certificate/${data.id}`, "_blank");
  };

  return (
    <div data-testid="admin-certs">
      <h2 className="font-display text-4xl text-secondary font-semibold">Certificate Generator</h2>
      <form onSubmit={save} className="mt-6 grid sm:grid-cols-2 gap-4 bg-white border border-border p-5 rounded-sm">
        <Inp label="Recipient Name" v={form.recipient_name} on={(v) => setForm({ ...form, recipient_name: v })} req testid="cert-name" />
        <Inp label="Rank" v={form.rank} on={(v) => setForm({ ...form, rank: v })} req testid="cert-rank" />
        <Sel label="Type" v={form.cert_type} on={(v) => setForm({ ...form, cert_type: v })} opts={CERT_TYPES} testid="cert-type" />
        <Inp label="Issued By" v={form.issued_by} on={(v) => setForm({ ...form, issued_by: v })} testid="cert-by" />
        <div className="sm:col-span-2">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Description / Citation</span>
          <textarea data-testid="cert-desc" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
            className="mt-1.5 w-full border border-border rounded-sm px-3 py-2 text-sm" />
        </div>
        <div><button data-testid="cert-save" className="bg-primary text-white px-5 py-2.5 rounded-sm font-medium">Generate Certificate</button></div>
      </form>
      <div className="mt-8 divide-y divide-border bg-white border border-border rounded-sm">
        {items.map((c) => (
          <Link to={`/certificate/${c.id}`} target="_blank" key={c.id} className="block p-4 hover:bg-gray-50" data-testid={`cert-row-${c.id}`}>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary">{c.cert_type} · {c.cert_number}</div>
            <div className="font-display text-lg text-secondary">{c.recipient_name}</div>
            <div className="text-xs text-muted-foreground">{c.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============== SETTINGS ==============
function SettingsAdmin() {
  const [s, setS] = useState({ discord_webhook_url: "", server_status_label: "Server Online", server_status_online: true, discord_invite: "" });
  useEffect(() => { api.get("/admin/settings").then((r) => setS((prev) => ({ ...prev, ...r.data }))); }, []);
  const save = async (e) => { e.preventDefault(); await api.put("/admin/settings", s); toast.success("Settings saved"); };

  return (
    <div data-testid="admin-settings">
      <h2 className="font-display text-4xl text-secondary font-semibold">Settings</h2>
      <form onSubmit={save} className="mt-6 grid gap-4 bg-white border border-border p-5 rounded-sm max-w-2xl">
        <Inp label="Discord Webhook URL" v={s.discord_webhook_url || ""} on={(v) => setS({ ...s, discord_webhook_url: v })} testid="settings-webhook" />
        <Inp label="Discord Invite Link" v={s.discord_invite || ""} on={(v) => setS({ ...s, discord_invite: v })} testid="settings-invite" />
        <Inp label="Server Status Label" v={s.server_status_label || ""} on={(v) => setS({ ...s, server_status_label: v })} testid="settings-status-label" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" data-testid="settings-online" checked={!!s.server_status_online} onChange={(e) => setS({ ...s, server_status_online: e.target.checked })} />
          Server Online
        </label>
        <div><button data-testid="settings-save" className="bg-primary text-white px-5 py-2.5 rounded-sm font-medium">Save</button></div>
      </form>
    </div>
  );
}

// ============== shared inputs ==============
function Inp({ label, v, on, req, testid }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
      <input data-testid={testid} required={req} value={v} onChange={(e) => on(e.target.value)}
        className="mt-1.5 w-full border border-border rounded-sm px-3 py-2 text-sm" />
    </label>
  );
}
function Sel({ label, v, on, opts, testid }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
      <select data-testid={testid} value={v} onChange={(e) => on(e.target.value)} className="mt-1.5 w-full border border-border rounded-sm px-3 py-2 text-sm bg-white">
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
