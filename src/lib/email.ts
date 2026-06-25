import { Resend } from "resend";

/**
 * Cus.site — Email wrapper.
 *
 * Provider: Resend (default). Bisa swap ke Postmark/SES/SMTP lain
 * dengan ganti implementasi di file ini — kontrak publik (sendLoginLink,
 * sendWelcomeEmail) stabil.
 *
 * Dev mode: kalau RESEND_API_KEY belum di-set dan NODE_ENV !== 'production',
 * magic link di-log ke terminal (lihat console output) supaya lo bisa test
 * flow login tanpa harus setup provider email dulu.
 *
 * Production: wajib set RESEND_API_KEY. Kalau gak ada, function throw
 * dan caller handle gracefully.
 */

let _resend: Resend | null = null;
let _checked = false;

function getClient(): Resend | null {
  if (_checked) return _resend;
  _checked = true;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[email] RESEND_API_KEY belum di-set. Email tidak akan terkirim. " +
          "Tambahkan ke environment variables di Vercel.",
      );
    }
    return null; // dev/fallback mode: log to console
  }

  _resend = new Resend(apiKey);
  return _resend;
}

const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL || "Cus.site <noreply@cus.site>";

// === Public API ===

export type SendLoginLinkParams = {
  to: string;
  loginUrl: string;
  /** Tampil di greeting, misal "Hai, Kopi Srawung!" — opsional */
  businessName?: string;
};

/**
 * Kirim magic link untuk login.
 * Expiry 15 menit (di-handle caller via DB).
 */
export async function sendLoginLink({
  to,
  loginUrl,
  businessName,
}: SendLoginLinkParams): Promise<{ ok: true; dev: boolean }> {
  const client = getClient();

  if (!client) {
    // Dev fallback
    console.log("\n📧 [DEV MODE] Magic link login");
    console.log("   To:     ", to);
    console.log("   URL:    ", loginUrl);
    if (businessName) console.log("   Bisnis: ", businessName);
    console.log(
      "   (Set RESEND_API_KEY di .env untuk kirim email sungguhan)\n",
    );
    return { ok: true, dev: true };
  }

  const subject = businessName
    ? `Login Cus.site — ${businessName}`
    : "Login link Cus.site kamu";

  const { error } = await client.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html: buildLoginLinkEmail({ loginUrl, businessName }),
  });

  if (error) {
    throw new Error(`Gagal kirim email: ${error.message}`);
  }

  return { ok: true, dev: false };
}

export type SendWelcomeParams = {
  to: string;
  businessName: string;
  subdomain: string;
  /** URL claim link — one-time use, akan rotate token setelah dipakai */
  claimUrl: string;
  /** URL permanen (ownerToken baru setelah rotate) untuk disimpan di dashboard */
  permanentAccessUrl: string;
};

/**
 * Kirim welcome email setelah onboarding selesai.
 * - claimUrl: untuk login pertama kali (one-time)
 * - permanentAccessUrl: bookmark-able link kalau user kehilangan magic link
 */
export async function sendWelcomeEmail({
  to,
  businessName,
  subdomain,
  claimUrl,
  permanentAccessUrl,
}: SendWelcomeParams): Promise<{ ok: true; dev: boolean }> {
  const client = getClient();

  if (!client) {
    console.log("\n📧 [DEV MODE] Welcome email");
    console.log("   To:                ", to);
    console.log("   Bisnis:            ", businessName);
    console.log("   Subdomain:         ", subdomain);
    console.log("   Claim URL:         ", claimUrl);
    console.log("   Permanent access:  ", permanentAccessUrl);
    console.log("");
    return { ok: true, dev: true };
  }

  const subject = `🎉 Website ${businessName} sudah jadi!`;

  const { error } = await client.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html: buildWelcomeEmail({
      businessName,
      subdomain,
      claimUrl,
      permanentAccessUrl,
    }),
  });

  if (error) {
    throw new Error(`Gagal kirim welcome email: ${error.message}`);
  }

  return { ok: true, dev: false };
}

// === HTML templates ===

function buildLoginLinkEmail({
  loginUrl,
  businessName,
}: {
  loginUrl: string;
  businessName?: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login Cus.site</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;padding:40px;">
          <tr>
            <td>
              <h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:#0f172a;">
                ${businessName ? `Halo owner ${businessName}!` : "Halo!"}
              </h1>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#475569;">
                Klik tombol di bawah untuk login ke dashboard Cus.site. Link ini berlaku 15 menit dan hanya bisa dipakai sekali.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display:inline-block;background-color:#0f172a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:9999px;">
                      Login ke Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0 0;font-size:13px;line-height:1.5;color:#94a3b8;">
                Atau copy link ini ke browser:<br />
                <a href="${loginUrl}" style="color:#f59e0b;word-break:break-all;">${loginUrl}</a>
              </p>

              <hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0;" />

              <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;">
                Kalau kamu gak request login ini, abaikan saja. Akun kamu aman.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:24px 0 0 0;font-size:11px;color:#94a3b8;">
          Dikirim oleh Cus.site
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildWelcomeEmail({
  businessName,
  subdomain,
  claimUrl,
  permanentAccessUrl,
}: {
  businessName: string;
  subdomain: string;
  claimUrl: string;
  permanentAccessUrl: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Website ${businessName} sudah jadi</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;padding:40px;">
          <tr>
            <td>
              <div style="font-size:36px;margin-bottom:16px;">🎉</div>
              <h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:#0f172a;">
                Website ${businessName} sudah jadi!
              </h1>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#475569;">
                AI udah nulis copywriting-nya. Tinggal klik tombol di bawah untuk lihat & edit website kamu.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px 0;background-color:#f1f5f9;border-radius:12px;padding:16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px 0;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">
                      Website kamu
                    </p>
                    <a href="https://${subdomain}.cus.site" style="font-size:18px;font-weight:600;color:#0f172a;text-decoration:none;font-family:monospace;">
                      ${subdomain}.cus.site
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px 0;">
                <tr>
                  <td align="center">
                    <a href="${claimUrl}" style="display:inline-block;background-color:#0f172a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:9999px;">
                      ✏️ Masuk Dashboard & Edit
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0;font-size:13px;line-height:1.5;color:#94a3b8;text-align:center;">
                Link ini hanya bisa dipakai <strong>sekali</strong> (sekali klik = langsung login & rotate token).
              </p>

              <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;" />

              <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#0f172a;">
                💡 Simpan link ini juga
              </p>
              <p style="margin:0 0 12px 0;font-size:13px;line-height:1.5;color:#475569;">
                Kalo cookie hilang / ganti device, pake link permanen ini untuk balik ke dashboard. Bisa di-bookmark.
              </p>
              <p style="margin:0 0 24px 0;font-size:12px;background-color:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px;word-break:break-all;font-family:monospace;color:#78350f;">
                ${permanentAccessUrl}
              </p>

              <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;" />

              <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;">
                Butuh bantuan? Balas email ini, kami bantu.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:24px 0 0 0;font-size:11px;color:#94a3b8;">
          Dikirim oleh Cus.site
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
