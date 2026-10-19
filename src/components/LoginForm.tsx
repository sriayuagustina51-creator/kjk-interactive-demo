"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { recordInteraction } from "@/lib/tracking";
import { Shield, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  // State form
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDemo, setRememberDemo] = useState(false);

  // State validasi & interaksi
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  // Validasi input sederhana
  const validate = () => {
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier = "Silakan masukkan nama pengguna atau email demo";
    } else if (identifier.trim().length < 3) {
      newErrors.identifier = "Identitas minimal terdiri dari 3 karakter";
    }

    if (!password) {
      newErrors.password = "Silakan masukkan kata sandi simulasi";
    } else if (password.length < 6) {
      newErrors.password = "Kata sandi simulasi minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("Mencatat demonstrasi interaksi...");

    try {
      /**
       * PENTING & SESUAI SPESIFIKASI:
       * - Tidak ada kata sandi atau kredensial yang disimpan/dikirimkan.
       * - Hanya mencatat jenis interaksi (LOGIN_BUTTON_CLICKED), waktu, dan ID sesi acak.
       */
      await recordInteraction("LOGIN_BUTTON_CLICKED", "SUCCESS");

      // Berikan umpan balik visual singkat sebelum berpindah halaman
      setSubmitStatus("Berhasil! Mengalihkan ke halaman konfirmasi...");
      setTimeout(() => {
        router.push("/result");
      }, 500);
    } catch (err) {
      console.warn("Gagal mencatat interaksi, navigasi tetap dilanjutkan:", err);
      // Navigasi tetap berjalan meskipun jaringan atau Google Apps Script offline
      router.push("/result");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Kartu Formulir dengan Glassmorphism */}
      <div className="relative backdrop-blur-xl bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40">
        {/* Header Identitas Visual */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-inner shadow-indigo-500/20">
            <Shield className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">Sentra Portal</h1>
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              Demo
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Simulasi Antarmuka Interaktif Pengguna
          </p>
        </div>

        {/* Banner Penjelasan & Keamanan Privasi */}
        <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-300">Mode Demonstrasi:</strong> Halaman ini murni untuk pengujian interaksi pengguna. Kata sandi <em>tidak akan disimpan</em> atau dikirim ke server.
          </p>
        </div>

        {/* Formulir Demo */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Input Pengguna / Email */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              Email / Nama Pengguna Demo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                }}
                placeholder="misal: demo.tamu@perusahaan.id"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-800/80 border transition-all duration-200 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                  errors.identifier
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-slate-600"
                }`}
              />
            </div>
            {errors.identifier && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <span>•</span> {errors.identifier}
              </p>
            )}
          </div>

          {/* Input Kata Sandi Simulasi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-300"
              >
                Kata Sandi Simulasi
              </label>
              <span className="text-[11px] text-slate-500">Min. 6 karakter</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-800/80 border transition-all duration-200 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-slate-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <span>•</span> {errors.password}
              </p>
            )}
          </div>

          {/* Opsi Ingat Preferensi Demo */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={rememberDemo}
                onChange={(e) => setRememberDemo(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-slate-900"
              />
              <span>Ingat preferensi demonstrasi</span>
            </label>
            <span className="text-slate-500 text-[11px]">Demo v1.0</span>
          </div>

          {/* Tombol Utama Demonstrasi */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{submitStatus || "Memproses..."}</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Demo Interaktif</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Card */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Interaksi Anda akan dicatat secara anonim dengan ID sesi acak ke Google Sheets.
          </p>
        </div>
      </div>
    </div>
  );
}
