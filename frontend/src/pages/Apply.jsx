import React, { useState } from "react";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";
import { ShieldPlus, Check } from "lucide-react";

const ROLES = ["EMT", "Nurse", "Doctor", "Intern"];

export default function Apply() {
  const [form, setForm] = useState({
    full_name: "", discord_id: "", age: 18, timezone: "", experience: "",
    why_join: "", desired_role: "EMT", contact_email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/applications", { ...form, age: Number(form.age) });
      setDone(true);
      toast.success("Application submitted. We'll be in touch on Discord.");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center" data-testid="apply-success">
        <div className="w-16 h-16 mx-auto bg-primary/10 text-primary flex items-center justify-center rounded-sm">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="font-display text-4xl font-semibold text-secondary mt-6">Application received.</h1>
        <p className="text-muted-foreground mt-3">Our recruitment desk will review your file within 48 hours and contact you on Discord.</p>
        <a href="/" className="inline-block mt-8 px-6 py-3 bg-secondary text-white rounded-sm" data-testid="apply-back-home">Back to base</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="apply-page">
      <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary">// RECRUITMENT</div>
      <h1 className="font-display text-5xl sm:text-6xl font-semibold mt-2 text-secondary">Join Team Pillbox</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">Tell us who you are. Honest answers move faster than polished ones.</p>

      <form onSubmit={submit} className="mt-10 grid gap-5 bg-white border border-border p-6 sm:p-8 rounded-sm" data-testid="apply-form">
        <Field label="Full Name" required>
          <input data-testid="apply-fullname" required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className={inputCls} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Discord ID" required>
            <input data-testid="apply-discord" required placeholder="user#1234 or @user" value={form.discord_id} onChange={(e) => update("discord_id", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Contact Email">
            <input data-testid="apply-email" type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} className={inputCls} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Age" required>
            <input data-testid="apply-age" type="number" min="13" max="99" required value={form.age} onChange={(e) => update("age", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Timezone" required>
            <input data-testid="apply-timezone" required placeholder="UTC+0" value={form.timezone} onChange={(e) => update("timezone", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Desired Role" required>
            <select data-testid="apply-role" value={form.desired_role} onChange={(e) => update("desired_role", e.target.value)} className={inputCls}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Roleplay / EMS Experience" required>
          <textarea data-testid="apply-experience" required rows={3} value={form.experience} onChange={(e) => update("experience", e.target.value)} className={`${inputCls} resize-y`} />
        </Field>

        <Field label="Why do you want to join Team Pillbox?" required>
          <textarea data-testid="apply-why" required rows={4} value={form.why_join} onChange={(e) => update("why_join", e.target.value)} className={`${inputCls} resize-y`} />
        </Field>

        <button
          type="submit"
          data-testid="apply-submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-sm font-medium hover:bg-[#d62828] disabled:opacity-60 transition-colors"
        >
          <ShieldPlus className="w-4 h-4" /> {submitting ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

const inputCls = "w-full border border-border rounded-sm px-3 py-2.5 bg-white focus:ring-2 focus:ring-primary outline-none text-sm";

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">{label}{required && <span className="text-primary"> *</span>}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
