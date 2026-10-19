"""
Script Pengirim Email Undangan Demo KJK
Menggunakan smtplib bawaan Python (aman, tanpa dependensi eksternal).
Mendukung port 465 (SSL) dan port 587 (TLS) dengan fallback otomatis.
"""

import os
import sys
import json
import ssl
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

DEMO_URL = "https://kjk-interactive-demo.vercel.app/"
CONFIG_FILE = "email_config.json"


def load_config():
    """Membaca konfigurasi dari file email_config.json atau environment variables."""
    config = {
        "smtp_server": os.getenv("SMTP_SERVER", "smtp.gmail.com"),
        "smtp_port": int(os.getenv("SMTP_PORT", 465)),
        "sender_email": os.getenv("SENDER_EMAIL", "ayuikazaki@gmail.com"),
        "sender_password": os.getenv("SENDER_PASSWORD", ""),
        "sender_name": os.getenv("SENDER_NAME", "Sri Ayu Agustina - Proyek KJK"),
        "recipient_email": os.getenv("RECIPIENT_EMAIL", ""),
    }

    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                file_config = json.load(f)
                config.update(file_config)
        except Exception as e:
            print(f"[Peringatan] Gagal membaca {CONFIG_FILE}: {e}")

    # Bersihkan spasi dari App Password jika ada
    if config.get("sender_password"):
        config["sender_password"] = config["sender_password"].replace(" ", "").strip()

    return config


def create_email_message(sender_name, sender_email, recipient_email):
    """Menyusun email multipart (Teks Biasa + HTML yang elegan)."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Undangan Pengujian: Demo Antarmuka Interaktif KJK"
    msg["From"] = f"{sender_name} <{sender_email}>"
    msg["To"] = recipient_email

    plain_text = f"""Halo,

Saya sedang melakukan demonstrasi prototipe antarmuka pengguna interaktif (UI/UX) untuk proyek Keamanan Jaringan dan Komputer (KJK).

Kami mengundang Anda untuk mencoba alur demonstrasi interaktif melalui tautan resmi kami:
{DEMO_URL}

Langkah Pengujian:
1. Buka tautan demo di atas melalui browser laptop atau ponsel.
2. Masukkan nama/email simulasi serta kata sandi simulasi (minimal 6 karakter).
3. Klik tombol "Masuk ke Demo Interaktif".
4. Periksa ringkasan hasil interaksi Anda dan ID sesi acak pada halaman konfirmasi.

Catatan Keamanan & Privasi:
Demonstrasi ini murni untuk pengujian interaksi antarmuka pengguna.
Sesuai standar privasi, kata sandi dan kredensial TIDAK PERNAH dikirim atau disimpan ke sistem mana pun. Sistem hanya mencatat ID sesi anonim dan penanda waktu ke lembar kerja demonstrasi.

Terima kasih atas bantuan dan partisipasi Anda!

Salam hormat,
{sender_name}
"""

    html_text = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Undangan Pengujian Demo KJK</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #1f2937; background: linear-gradient(180deg, rgba(79, 70, 229, 0.15) 0%, rgba(17, 24, 39, 0) 100%);">
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background-color: #4f46e5; color: #ffffff; font-size: 22px; font-weight: bold; margin-bottom: 12px;">
                S
              </div>
              <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                Sentra Security Demo
              </h1>
              <span style="display: inline-block; padding: 3px 12px; background-color: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 999px; font-size: 11px; font-weight: 600; color: #a5b4fc; text-transform: uppercase;">
                Undangan Pengujian Prototipe
              </span>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #e2e8f0;">
                Halo Rekan-rekan,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Dalam rangka demonstrasi proyek <strong>Keamanan Jaringan &amp; Komputer (KJK)</strong>, saya telah membangun aplikasi prototipe interaktif modern dengan Next.js dan Tailwind CSS.
              </p>

              <!-- Langkah Pengujian Box -->
              <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #cbd5e1; letter-spacing: 0.5px;">
                  📌 Langkah Pengujian Demonstrasi:
                </h3>
                <ol style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #94a3b8;">
                  <li>Akses halaman demo melalui tombol di bawah ini.</li>
                  <li>Isi formulir login simulasi (nama pengguna &amp; kata sandi sembarang).</li>
                  <li>Klik <strong>"Masuk ke Demo Interaktif"</strong>.</li>
                  <li>Periksa halaman konfirmasi hasil interaksi Anda.</li>
                </ol>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="{DEMO_URL}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 14px 32px; border-radius: 10px; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.35);">
                  Buka Aplikasi Demo Interaktif &rarr;
                </a>
                <p style="margin: 10px 0 0 0; font-size: 11px; color: #64748b;">
                  Tautan langsung: <a href="{DEMO_URL}" style="color: #818cf8; text-decoration: underline;">{DEMO_URL}</a>
                </p>
              </div>

              <!-- Jaminan Privasi & Keamanan -->
              <div style="background-color: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #6ee7b7;">
                  🛡️ <strong>Jaminan Privasi:</strong> Ini adalah demonstrasi simulasi interaksi. Kata sandi yang dimasukkan <strong>sama sekali tidak disimpan atau dikirimkan</strong>. Sistem hanya mencatat penanda waktu dan ID sesi acak ke Google Sheets.
                </p>
              </div>

              <p style="margin: 20px 0 0 0; font-size: 13px; line-height: 1.5; color: #94a3b8;">
                Terima kasih banyak atas waktu dan bantuannya dalam mencoba prototipe ini!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0f172a; border-top: 1px solid #1f2937; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #94a3b8; font-weight: 600;">
                {sender_name}
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                Proyek Demonstrasi Interaktif KJK • Next.js + Google Sheets Integration
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    part1 = MIMEText(plain_text, "plain", "utf-8")
    part2 = MIMEText(html_text, "html", "utf-8")
    msg.attach(part1)
    msg.attach(part2)
    return msg


def send_email():
    config = load_config()

    sender_email = config.get("sender_email", "").strip()
    sender_password = config.get("sender_password", "").strip()
    recipient_email = config.get("recipient_email", "").strip()
    sender_name = config.get("sender_name", "Sri Ayu Agustina - Proyek KJK").strip()
    smtp_server = config.get("smtp_server", "smtp.gmail.com").strip()

    if not sender_email or not sender_password or not recipient_email:
        print("[ERROR] Konfigurasi belum lengkap di email_config.json")
        return False

    context = ssl.create_default_context()
    msg = create_email_message(sender_name, sender_email, recipient_email)

    # Metode 1: Coba koneksi port 465 (SSL langsung - sangat stabil di semua ISP)
    print(f"[*] Mencoba koneksi SSL via {smtp_server}:465...")
    try:
        with smtplib.SMTP_SSL(smtp_server, 465, context=context, timeout=12) as server:
            print(f"[*] Melakukan autentikasi sebagai {sender_email}...")
            server.login(sender_email, sender_password)
            print(f"[*] Mengirim email ke {recipient_email}...")
            server.sendmail(sender_email, [recipient_email], msg.as_string())
        print(f"[SUCCESS] Email BERHASIL TERKIRIM ke: {recipient_email}")
        return True
    except Exception as e_ssl:
        print(f"[INFO] Percobaan port 465: {e_ssl}")

    # Metode 2: Coba port 587 (STARTTLS)
    print(f"[*] Mencoba koneksi STARTTLS via {smtp_server}:587...")
    try:
        with smtplib.SMTP(smtp_server, 587, timeout=12) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            print(f"[*] Melakukan autentikasi sebagai {sender_email}...")
            server.login(sender_email, sender_password)
            print(f"[*] Mengirim email ke {recipient_email}...")
            server.sendmail(sender_email, [recipient_email], msg.as_string())
        print(f"[SUCCESS] Email BERHASIL TERKIRIM ke: {recipient_email}")
        return True
    except Exception as e_tls:
        print(f"[ERROR] Percobaan port 587 juga gagal: {e_tls}")
        return False


if __name__ == "__main__":
    success = send_email()
    sys.exit(0 if success else 1)
