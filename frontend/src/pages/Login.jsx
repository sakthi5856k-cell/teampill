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
  <div className="min-h-screen bg-[#070b14] bg-[url('/images/ambulance.jpg')] bg-cover bg-center relative">

    <div className="absolute inset-0 bg-black/70"></div>

    <div className="relative z-10 flex items-center justify-center min-h-screen px-5">

      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">

          <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500 flex items-center justify-center shadow-xl">

            <Cross size={50} className="text-white"/>

          </div>

          <h1 className="mt-6 text-5xl font-extrabold text-white">
            TEAM <span className="text-cyan-400">PILLBOX</span>
          </h1>

          <p className="text-cyan-300 tracking-[5px] uppercase mt-2">
            Emergency Medical Services
          </p>

        </div>

        {/* Login Card */}

        <div className="backdrop-blur-xl bg-[#111827]/80 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl">

          <div className="flex items-center gap-2 text-cyan-400 mb-2">

            <Lock size={18}/>

            <span className="uppercase tracking-[4px] text-xs">
              Secure Access
            </span>

          </div>

          <h2 className="text-4xl font-bold text-white">
            Staff Login
          </h2>

          <p className="text-gray-400 mt-2">
            Authorized personnel only.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">

            <input
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full rounded-xl bg-[#1f2937] border border-gray-700 px-5 py-4 text-white focus:border-cyan-500 outline-none"
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl bg-[#1f2937] border border-gray-700 px-5 py-4 text-white focus:border-cyan-500 outline-none"
            />

            {err && (
              <div className="text-red-400 text-sm">
                {err}
              </div>
            )}

            <button
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-white font-bold text-lg"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <div className="my-6 flex items-center">

            <div className="flex-1 border-t border-gray-700"></div>

            <span className="px-3 text-gray-500 text-sm">
              OR
            </span>

            <div className="flex-1 border-t border-gray-700"></div>

          </div>

          <button
            onClick={() => window.location.href="/auth/discord/login"}
            className="w-full rounded-xl py-4 bg-[#5865F2] hover:bg-[#4752C4] transition text-white font-semibold"
          >
            Login with Discord
          </button>

        </div>

      </div>

    </div>

  </div>
);
