import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_KEY
export const EMAIL_FROM = process.env.EMAIL_FROM || "KickOff Camps <noreply@kickoffcamps.hu>"

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export type SendEmailArgs = {
  to: string
  subject: string
  html: string
  replyTo?: string
}

/**
 * Sends an email through Resend if configured. Returns { sent: false } if
 * the API key is missing — callers should treat that as "fall back to showing
 * the link manually in the admin UI".
 */
export async function sendEmail(args: SendEmailArgs): Promise<{ sent: boolean; id?: string; error?: string }> {
  if (!resend) {
    return { sent: false, error: "RESEND_API_KEY not configured" }
  }
  try {
    const res = await resend.emails.send({
      from: EMAIL_FROM,
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo,
    })
    if (res.error) {
      return { sent: false, error: res.error.message }
    }
    return { sent: true, id: res.data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed"
    return { sent: false, error: message }
  }
}

/**
 * Simple HTML template for the remainder payment email.
 */
export function renderRemainderEmail(args: {
  parentName: string
  childName: string
  campCity: string
  campDates: string
  amount: string
  paymentUrl: string
}): { subject: string; html: string } {
  const subject = `Hátralévő összeg fizetése — ${args.campCity} tábor`
  const html = `<!doctype html>
<html lang="hu">
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:24px;">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
    <tr><td style="padding:32px;">
      <h1 style="font-family:Georgia,serif;color:#0a1f0a;margin:0 0 16px;">Kedves ${escapeHtml(args.parentName)}!</h1>
      <p style="color:#333;line-height:1.6;margin:0 0 12px;">
        Közeledik ${escapeHtml(args.childName)} tábora (<strong>${escapeHtml(args.campCity)}</strong>, ${escapeHtml(args.campDates)}).
      </p>
      <p style="color:#333;line-height:1.6;margin:0 0 20px;">
        A foglaló megérkezett, köszönjük! Kérjük, a hátralévő összeget az alábbi biztonságos fizetési linken rendezd:
      </p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${args.paymentUrl}"
           style="display:inline-block;background:#d4a017;color:#0a1f0a;padding:14px 28px;font-weight:bold;text-decoration:none;">
          Hátralévő fizetése: ${escapeHtml(args.amount)}
        </a>
      </p>
      <p style="color:#666;font-size:13px;line-height:1.5;margin:0 0 8px;">
        Ha a gomb nem működik, másold be ezt a linket a böngésződbe:<br>
        <a href="${args.paymentUrl}" style="color:#d4a017;word-break:break-all;">${args.paymentUrl}</a>
      </p>
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">
      <p style="color:#999;font-size:12px;margin:0;">KickOff Camps — kickoffcamps.hu</p>
    </td></tr>
  </table>
</body></html>`
  return { subject, html }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
