"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error ?? "Неверный пароль");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1e293b" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "#3b82f6" }}>
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">RunPsy Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Введите пароль для входа</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: "#3b82f6" }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Войти
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
