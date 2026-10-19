/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: PENCATATAN INTERAKSI DEMO SENTRA PORTAL
 * =========================================================================
 * 
 * PANDUAN PEMASANGAN:
 * 1. Buka Google Sheets baru di https://sheets.new
 * 2. Beri nama spreadsheet Anda, misalnya: "Sentra Demo - Log Interaksi"
 * 3. Klik menu: Extensions > Apps Script (Ekstensi > Apps Script)
 * 4. Hapus semua kode default di editor, lalu salin dan tempel SELURUH KODE di file ini.
 * 5. Klik ikon Simpan (Save).
 * 6. Klik tombol "Deploy" (Terapkan) di pojok kanan atas > Pilih "New deployment" (Penerapan baru).
 * 7. Pilih tipe: "Web app" (Aplikasi web).
 * 8. Konfigurasi:
 *    - Description: "Sentra Demo Logger v1.0"
 *    - Execute as: "Me" (Email Google Anda)
 *    - Who has access: "Anyone" (Siapa saja - penting agar Vercel dapat mengirim data tanpa login akun Google)
 * 9. Klik "Deploy". Berikan otorisasi izin akses spreadsheet jika diminta (Review Permissions > Akun Anda > Advanced > Go to Untitled/Sentra Logger (unsafe) > Allow).
 * 10. Salin "Web app URL" yang dihasilkan (berawalan https://script.google.com/macros/s/.../exec).
 * 11. Masukkan URL tersebut ke file .env.local dan Environment Variables Vercel sebagai:
 *     GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 * 
 * CATATAN KEAMANAN:
 * Script ini HANYA mencatat:
 * - Waktu interaksi (timestamp)
 * - ID sesi acak (sessionId)
 * - Jenis interaksi (interactionType, misal: LOGIN_BUTTON_CLICKED)
 * - Status interaksi (status)
 * - Info perangkat umum (deviceInfo)
 * SCRIPT INI TIDAK MENERIMA ATAU MENYIMPAN KATA SANDI / DATA AUTENTIKASI.
 */

const SHEET_NAME = "Log Interaksi";

/**
 * Endpoint POST untuk menerima data interaksi dari Next.js
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Kunci eksekusi selama maksimal 10 detik untuk menghindari tabrakan penulisan baris
  lock.tryLock(10000);

  try {
    var rawContents = e.postData ? e.postData.contents : null;
    if (!rawContents) {
      return createJsonResponse({
        status: "error",
        message: "No payload provided"
      }, 400);
    }

    var data = JSON.parse(rawContents);

    // Buka spreadsheet aktif tempat script ini terpasang
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Jika sheet belum ada, buat sheet baru dan inisialisasi header kolom
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      initializeSheetHeaders(sheet);
    } else if (sheet.getLastRow() === 0) {
      initializeSheetHeaders(sheet);
    }

    // Data yang dicatat (HANYA metadata non-sensitif)
    var timestamp = data.timestamp || new Date().toISOString();
    var sessionId = data.sessionId || "anonymous_session";
    var interactionType = data.interactionType || "BUTTON_CLICKED";
    var status = data.status || "SUCCESS";
    var deviceInfo = data.deviceInfo || "Web Browser";
    var serverRecordedAt = new Date();

    // Tambahkan baris data baru ke Google Sheets
    sheet.appendRow([
      serverRecordedAt,
      timestamp,
      sessionId,
      interactionType,
      status,
      deviceInfo
    ]);

    // Format waktu pada kolom pertama
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");

    return createJsonResponse({
      status: "success",
      message: "Interaksi berhasil dicatat ke Google Sheets",
      recordedSessionId: sessionId,
      rowNumber: lastRow
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    }, 500);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Inisialisasi baris judul kolom pada sheet
 */
function initializeSheetHeaders(sheet) {
  var headers = [
    "Waktu Tercatat (Server)",
    "Waktu Klien (ISO)",
    "ID Sesi Acak",
    "Jenis Interaksi",
    "Status Interaksi",
    "Info Perangkat"
  ];

  sheet.appendRow(headers);

  // Format visual header: latar gelap, teks tebal, warna putih
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1e293b");
  headerRange.setFontColor("#f8fafc");
  headerRange.setHorizontalAlignment("center");
  
  // Bekukan baris pertama agar tetap terlihat saat scroll
  sheet.setFrozenRows(1);
  
  // Atur lebar kolom agar rapi
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 220);
}

/**
 * Endpoint GET untuk cek kesehatan service / ping
 */
function doGet(e) {
  return createJsonResponse({
    status: "ok",
    message: "Google Apps Script Sentra Logger Aktif dan Siap Menerima Data POST",
    time: new Date().toISOString()
  });
}

/**
 * Helper untuk membuat respons JSON dengan format yang benar
 */
function createJsonResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
