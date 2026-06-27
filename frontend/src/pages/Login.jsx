import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Cross, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { user, login, loading } = useAuth();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  if (loading) return <div className="p-16 text-center text-muted-foreground">Checking session…</div>;
  if (user && user.role === "admin") return <Navigate to={loc.state?.from || "/admin"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setErr("");
    const res = await login(email, password);
    setSubmitting(false);
    if (!res.ok) { setErr(res.error); toast.error(res.error); }
    else toast.success("Welcome back, Director.");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4" data-testid="login-page">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-sm">
            <Cross className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="font-display text-2xl font-semibold text-secondary">TEAM PILLBOX</div>
        </div>

        <div className="bg-white border border-border rounded-sm p-8">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] uppercase text-primary">
            <Lock className="w-3 h-3" /> Secure Access
          </div>
          <h1 className="font-display text-3xl font-semibold mt-2 text-secondary">Staff Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Authorized personnel only.</p>

          <form onSubmit={submit} className="mt-6 grid gap-4" data-testid="login-form">
            <label className="block">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Email</span>
              <input data-testid="login-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1.5 border border-border rounded-sm px-3 py-2.5 focus:ring-2 focus:ring-primary outline-none text-sm" />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Password</span>
              <input data-testid="login-password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1.5 border border-border rounded-sm px-3 py-2.5 focus:ring-2 focus:ring-primary outline-none text-sm" />
            </label>
            {err && <div className="text-sm text-primary" data-testid="login-error">{err}</div>}
            <button
              data-testid="login-submit"
              disabled={submitting}
              className="bg-primary text-white px-5 py-3 rounded-sm font-medium hover:bg-[#d62828] transition-colors disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
