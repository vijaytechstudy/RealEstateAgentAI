"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (typeof window !== "undefined") {
        localStorage.setItem("rea_jwt", res.data.token);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">
            Login to your RealEstate Agent AI dashboard.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-sm">
            <label className="text-slate-200">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label className="text-slate-200">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-sky-400 hover:text-sky-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

