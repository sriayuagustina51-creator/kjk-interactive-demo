// src/app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ExpectedPayload {
  sessionId?: string;
  timestamp?: string;
  interactionType?: string;
  status?: string;
  deviceInfo?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ExpectedPayload = await req.json();

    // Sanitasi ketat: HANYA izinkan kolom yang diizinkan untuk keperluan demonstrasi
    // Dilarang keras memproses password atau data autentikasi
    const sanitizedData = {
      sessionId: typeof body.sessionId === "string" ? body.sessionId.substring(0, 100) : "unknown_sess",
      timestamp: typeof body.timestamp === "string" ? body.timestamp : new Date().toISOString(),
      interactionType: typeof body.interactionType === "string" ? body.interactionType.substring(0, 50) : "BUTTON_CLICK",
      status: typeof body.status === "string" ? body.status.substring(0, 30) : "SUCCESS",
      deviceInfo: typeof body.deviceInfo === "string" ? body.deviceInfo.substring(0, 150) : "Unknown",
    };

    // Ambil URL Google Apps Script dari environment variable
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    // Jika URL Google Apps Script belum dikonfigurasi, beri respons sukses simulasi
    if (!scriptUrl || scriptUrl.trim() === "") {
      console.log("[API /api/track] Google Script URL belum disetel. Interaksi disimulasikan:", sanitizedData);
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Interaksi tercatat dalam mode simulasi lokal (URL Google Sheets belum disetel)",
        data: sanitizedData,
      });
    }

    // Teruskan ke Google Apps Script Web App
    const gasResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedData),
      redirect: "follow",
    });

    if (!gasResponse.ok) {
      console.warn(`[API /api/track] GAS returned status ${gasResponse.status}`);
      return NextResponse.json({
        success: false,
        simulated: true,
        message: `Google Apps Script returned status ${gasResponse.status}`,
      });
    }

    const text = await gasResponse.text();
    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch {
      parsedResult = { raw: text };
    }

    return NextResponse.json({
      success: true,
      simulated: false,
      message: "Interaksi berhasil dicatat ke Google Sheets",
      gasResponse: parsedResult,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[API /api/track] Error logging interaction:", errorMsg);

    // Tetap kembalikan HTTP 200 dengan status fallback agar UX pengguna tidak terganggu
    return NextResponse.json(
      {
        success: false,
        simulated: true,
        message: `Terjadi kendala pencatatan (${errorMsg}), alur demo tetap dilanjutkan.`,
      },
      { status: 200 }
    );
  }
}
