import LoginForm from "@/components/LoginForm";
import { Sparkles, Terminal, ShieldCheck, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/25">
            S
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-white block">
              Sentra Security Demo
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1">
              Next.js + Tailwind CSS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Prototype
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto my-auto py-8 flex flex-col items-center">
        {/* Intro Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Demonstrasi Alur Antarmuka Pengguna &amp; Analitik Lembar Kerja</span>
        </div>

        {/* LoginForm Container */}
        <LoginForm />

        {/* Informative Highlights */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl text-center">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex flex-col items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-400" />
            <p className="text-xs font-medium text-slate-200">Pencatatan Realtime</p>
            <p className="text-[11px] text-slate-500">Mencatat event klik ke Google Sheets</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex flex-col items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <p className="text-xs font-medium text-slate-200">Privasi Terjaga</p>
            <p className="text-[11px] text-slate-500">Kredensial tidak pernah disimpan</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex flex-col items-center gap-1.5">
            <Terminal className="w-4 h-4 text-blue-400" />
            <p className="text-xs font-medium text-slate-200">Siap Deploy</p>
            <p className="text-[11px] text-slate-500">Kompatibel penuh dengan Vercel</p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="w-full max-w-5xl mx-auto py-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>© 2026 Sentra Project Demo. Dibuat untuk keperluan evaluasi & demonstrasi alur interaksi.</p>
        <p className="text-[11px]">Next.js App Router • TypeScript • Tailwind CSS</p>
      </footer>
    </main>
  );
}
