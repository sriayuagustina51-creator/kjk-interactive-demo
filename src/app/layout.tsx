import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentra Demo Portal - Interaksi UI Eksperimental",
  description: "Website demonstrasi interaktif antarmuka pengguna Next.js dan Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Subtle Ambient Gradients */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
