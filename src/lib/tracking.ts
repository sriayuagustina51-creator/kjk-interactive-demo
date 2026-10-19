// lib/tracking.ts
/**
 * Utility modul untuk pencatatan interaksi demonstrasi ke Google Sheets.
 * CATATAN KEAMANAN:
 * - Modul ini HANYA mencatat metadata interaksi (ID sesi acak, waktu, jenis aksi, status).
 * - Tidak pernah dan dilarang keras mengumpulkan kata sandi, token, atau informasi sensitif.
 */

export interface InteractionPayload {
  sessionId: string;
  timestamp: string;
  interactionType: string;
  status: string;
  deviceInfo?: string;
}

export interface TrackingResult {
  success: boolean;
  message: string;
  simulated?: boolean;
}

const SESSION_STORAGE_KEY = "kjk_demo_session_id";
const LAST_INTERACTION_KEY = "kjk_last_interaction";

/**
 * Menghasilkan atau mengambil ID sesi acak yang konsisten selama sesi browser.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "srv_session_init";
  }

  try {
    let sessionId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      // Buat ID sesi acak aman yang unik (contoh: sess-a1b2c3d4-e5f6)
      const randomPart = Math.random().toString(36).substring(2, 10);
      const timePart = Date.now().toString(36);
      sessionId = `sess_${timePart}_${randomPart}`;
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return `sess_fallback_${Date.now()}`;
  }
}

/**
 * Mengambil ringkasan interaksi terakhir dari sessionStorage.
 */
export function getLastInteraction(): InteractionPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(LAST_INTERACTION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Pencegahan double-submission saat request sedang berjalan
let isTrackingInProgress = false;

/**
 * Mencatat interaksi pengguna ke endpoint server / Google Sheets.
 * Tangani kegagalan dengan anggun (graceful fallback) agar tidak mengganggu alur navigasi.
 */
export async function recordInteraction(
  interactionType: string,
  status: "SUCCESS" | "FAILED" | "SIMULATED" = "SUCCESS"
): Promise<TrackingResult> {
  // Hindari pengiriman ganda jika masih dalam proses
  if (isTrackingInProgress) {
    return {
      success: true,
      message: "Pencatatan interaksi sedang berlangsung, duplikasi diabaikan.",
      simulated: true,
    };
  }

  isTrackingInProgress = true;
  const sessionId = getOrCreateSessionId();
  const timestamp = new Date().toISOString();

  // Ambil informasi perangkat secara umum tanpa data pribadi
  const deviceInfo =
    typeof window !== "undefined"
      ? `${window.navigator.platform || "Web"} | ${window.innerWidth}x${window.innerHeight}`
      : "Server";

  const payload: InteractionPayload = {
    sessionId,
    timestamp,
    interactionType,
    status,
    deviceInfo,
  };

  // Simpan ke sessionStorage lokal untuk referensi di halaman hasil
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(LAST_INTERACTION_KEY, JSON.stringify(payload));
    } catch {
      // Abaikan jika storage penuh atau dinonaktifkan
    }
  }

  try {
    // Timeout 3.5 detik untuk menjamin navigasi pengguna tidak pernah terhambat
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Tracking] Endpoint respons dengan status: ${response.status}`);
      return {
        success: false,
        message: `HTTP Error ${response.status}`,
        simulated: true,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Interaksi berhasil dicatat",
      simulated: data.simulated || false,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Network error";
    console.warn("[Tracking] Pengiriman data tidak berhasil (tetap melanjutkan alur):", errorMsg);
    return {
      success: false,
      message: errorMsg,
      simulated: true,
    };
  } finally {
    isTrackingInProgress = false;
  }
}
