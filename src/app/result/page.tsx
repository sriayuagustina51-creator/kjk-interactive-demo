"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLastInteraction, InteractionPayload } from "@/lib/tracking";
import {
  CheckCircle2,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Hash,
  Database,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";

export default function ResultPage() {
  const router = useRouter();
  const [interaction, setInteraction] = useState<InteractionPayload | null>(null);
  const [copied, setCopied] = useState(false);
  const [formattedTime, setFormattedTime] = useState<string>("");

  useEffect(() => {
    // Ambil interaksi terakhir dari sessionStorage
    const lastData = getLastInteraction();
    if (lastData) {
      setInteraction(lastData);
      try {
        const d = new Date(lastData.timestamp);
        setFormattedTime(
          d.toLocaleString("id-ID", {
            dateStyle: "full",
            timeStyle: "medium",
          })
        );
      } catch {
        setFormattedTime(lastData.timestamp);
      }
    } else {
      // Fallback jika pengguna langsung membuka URL /result tanpa submit
      const now = new Date();
      setFormattedTime(
        now.toLocaleString("id-ID", {
          dateStyle: "full",
          timeStyle: "medium",
        })
      );
    }
  }, []);

  const handleCopySession = () => {
    if (interaction?.sessionId) {
      navigator.clipboard.writeText(interaction.sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("kjk_last_interaction");
    }
    router.push("/");
  };

  return (
    <main className="min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/25">
            S
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              Sentra Security Demo
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1">
              Hasil Demonstrasi
            </span>
          </div>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Interaksi Terverifikasi
        </span>
      </header>

      {/* Main Content Card */}
      <div className="w-full max-w-xl mx-auto my-auto py-8">
        <div className="relative backdrop-blur-xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-950/50">
          {/* Success Indicator Icon */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-2">
                <CheckCircle2 className="w-10 h-10 animate-bounce" style={{ animationIterationCount: 2 }} />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-3">
              Interaksi Berhasil Dilakukan
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Tombol demonstrasi telah berhasil ditekan dan data interaksi telah dicatat sesuai protokol pengujian.
            </p>
          </div>

          {/* Data Interaksi Box */}
          <div className="space-y-3 mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Ringkasan Data Interaksi (Non-Sensitif)
            </h2>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl divide-y divide-slate-800/60 text-xs">
              {/* ID Sesi */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Hash className="w-4 h-4 text-indigo-400" />
                  <span>ID Sesi Acak</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-indigo-300 font-mono bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-800/40">
                    {interaction?.sessionId || "sess_demo_live"}
                  </code>
                  <button
                    onClick={handleCopySession}
                    title="Salin ID Sesi"
                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Waktu Interaksi */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Waktu Interaksi</span>
                </div>
                <span className="text-slate-200 font-medium text-right">
                  {formattedTime || "Baru saja"}
                </span>
              </div>

              {/* Jenis Aksi */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Jenis Event</span>
                </div>
                <span className="font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 text-[11px]">
                  {interaction?.interactionType || "LOGIN_BUTTON_CLICKED"}
                </span>
              </div>

              {/* Privasi & Keamanan */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Status Kredensial</span>
                </div>
                <span className="text-emerald-400 font-medium text-right">
                  Aman • Tidak Disimpan
                </span>
              </div>
            </div>
          </div>

          {/* Catatan Privasi & Google Sheets */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/30 text-indigo-200 text-xs mb-8 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-indigo-300">
                Pencatatan Google Sheets Selesai
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Data yang terekam pada spreadsheet hanya mencakup ID sesi anonim, penanda waktu, jenis interaksi tombol, dan status simulasi. Tidak ada data pribadi atau password yang disimpan.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleReset}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Halaman Utama</span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Demo Lagi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="w-full max-w-4xl mx-auto py-4 border-t border-slate-800/60 flex items-center justify-center text-xs text-slate-500">
        <p>© 2026 Sentra Project Demo • Alur demonstrasi interaksi berhasil diselesaikan.</p>
      </footer>
    </main>
  );
}
