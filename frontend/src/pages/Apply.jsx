import React, { useState } from "react";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";
import { Send, Check, Copy } from "lucide-react";

const ROLES = ["EMT", "Nurse", "Doctor", "Intern"];
const TZ = ["EST", "PST", "CST", "MST", "GMT", "CET", "IST", "JST", "AEST", "Other"];

export default function Apply() {
  const [f, setF] = useState({
    full_name: "", in_game_name: "", age: 18, timezone: "EST",
    discord_handle: "", discord_user_id: "", steam_hex: "",
    experience: "", why_join: "", availability: "", desired_role: "EMT",
    contact_email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const upd = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/applications", { ...f, age: Number(f.age) });
      setResult(data);
      toast.success("Application received. Check Discord for your reference.");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Submission failed");
    } finally { setSubmitting(false); }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center" data-testid="apply-success">
        <div className="w-16 h-16 mx-auto bg-primary/15 text-primary flex items-center justify-center rounded-sm">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="font-display text-4xl font-semibold text-foreground mt-6">Application received.</h1>
        <p className="text-muted-foreground mt-3">Save your reference number. We DM'd it to you on Discord too.</p>
        <div className="mt-6 inline-flex items-center gap-3 border border-border bg-card px-5 py-3 rounded-sm" data-testid="apply-ref">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">Ref</span>
          <span className="font-mono text-lg text-primary">{result.ref_number}</span>
          <button onClick={() => { navigator.clipboard.writeText(result.ref_number); toast.success("Copied"); }}
            className="text-muted-foreground hover:text-primary" data-testid="copy-ref"><Copy className="w-4 h-4" /></button>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <a href="/status" className="px-5 py-2.5 border border-border rounded-sm hover:border-primary hover:text-primary text-sm" data-testid="apply-check-status">Check Status</a>
          <a href="/" className="px-5 py-2.5 bg-primary text-white rounded-sm text-sm">Back to base</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="apply-page">
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.3em] uppercase text-accent">
          <span className="w-2 h-2 bg-accent inline-block" /> Recruitment · Channel Open
        </div>
        <h1 className="font-display text-5xl sm:text-7xl font-bold mt-3 leading-[0.95]">
          JOIN THE <span className="text-accent">DEPARTMENT</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Fill out the form below. Be honest — we read every application. Lying about experience is the fastest way
          to get your name on the do-not-call list.
        </p>

        <form onSubmit={submit} className="mt-12 space-y-6" data-testid="apply-form">
          {/* SECTION 1 - PERSONAL */}
          <Section title="Section 1 · Personal">
            <Grid>
              <Field label="Full Name" req><Inp testid="apply-fullname" req v={f.full_name} on={(v)=>upd("full_name",v)} placeholder="John A. Doe" /></Field>
              <Field label="In-Game Name" req><Inp testid="apply-ingame" req v={f.in_game_name} on={(v)=>upd("in_game_name",v)} placeholder="Doc Reyes" /></Field>
              <Field label="Age" req><Inp testid="apply-age" type="number" req v={f.age} on={(v)=>upd("age",v)} /></Field>
              <Field label="Timezone" req>
                <Sel testid="apply-timezone" v={f.timezone} on={(v)=>upd("timezone",v)} opts={TZ} />
              </Field>
            </Grid>
          </Section>

          {/* SECTION 2 - CONTACT */}
          <Section title="Section 2 · Contact">
            <Grid>
              <Field label="Discord Handle" req><Inp testid="apply-discord" req v={f.discord_handle} on={(v)=>upd("discord_handle",v)} placeholder="username#0000" /></Field>
              <Field label="Steam Hex (Optional)"><Inp testid="apply-steam" v={f.steam_hex} on={(v)=>upd("steam_hex",v)} placeholder="steam:110000..." /></Field>
              <div className="sm:col-span-2">
                <Field label="Discord User ID (Optional — for status DMs)">
                  <Inp testid="apply-discord-id" v={f.discord_user_id} on={(v)=>upd("discord_user_id",v)} placeholder="123456789012345678" />
                </Field>
                <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground mt-2 leading-relaxed">
                  How to get your Discord User ID: Discord → Settings → Advanced → Developer Mode ON, then right-click your name → Copy User ID.
                  We use it to DM you the moment Command updates your application.
                </p>
              </div>
              <Field label="Contact Email (Optional)"><Inp testid="apply-email" type="email" v={f.contact_email} on={(v)=>upd("contact_email",v)} /></Field>
              <Field label="Desired Role" req>
                <Sel testid="apply-role" v={f.desired_role} on={(v)=>upd("desired_role",v)} opts={ROLES} />
              </Field>
            </Grid>
          </Section>

          {/* SECTION 3 - BACKGROUND */}
          <Section title="Section 3 · Background">
            <div className="grid gap-5">
              <Field label="Prior RP / EMS Experience">
                <textarea data-testid="apply-experience" rows={3} value={f.experience} onChange={(e)=>upd("experience",e.target.value)}
                  placeholder="Servers you've played, roles you've held, real-world EMS knowledge..." className={inpCls + " resize-y"} />
              </Field>
              <Field label="Why do you want to join Team Pillbox?">
                <textarea data-testid="apply-why" rows={4} value={f.why_join} onChange={(e)=>upd("why_join",e.target.value)}
                  placeholder="Tell us what makes you a good fit..." className={inpCls + " resize-y"} />
              </Field>
              <Field label="Weekly Availability">
                <Inp testid="apply-availability" v={f.availability} on={(v)=>upd("availability",v)} placeholder="Mon-Fri 7-11pm EST, weekends flexible" />
              </Field>
            </div>
          </Section>

          <div className="flex justify-end">
            <button data-testid="apply-submit" disabled={submitting}
              className="inline-flex items-center gap-2 bg-accent text-white px-7 py-3.5 rounded-sm font-semibold tracking-wider uppercase text-sm hover:bg-accent/85 transition-colors disabled:opacity-60">
              {submitting ? "Submitting…" : "Submit Application"} <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inpCls = "w-full bg-input/80 border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary outline-none";

function Section({ title, children }) {
  return (
    <div className="border border-border bg-card/60 rounded-sm p-6 sm:p-8">
      <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-muted-foreground mb-5">{title}</div>
      {children}
    </div>
  );
}
function Grid({ children }) { return <div className="grid sm:grid-cols-2 gap-5">{children}</div>; }
function Field({ label, req, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-muted-foreground">{label}{req && <span className="text-accent"> *</span>}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
function Inp({ v, on, req, type="text", placeholder, testid }) {
  return <input data-testid={testid} required={req} type={type} value={v} placeholder={placeholder}
    onChange={(e)=>on(e.target.value)} className={inpCls} />;
}
function Sel({ v, on, opts, testid }) {
  return (
    <select data-testid={testid} value={v} onChange={(e)=>on(e.target.value)} className={inpCls + " bg-input"}>
      {opts.map((o)=> <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
