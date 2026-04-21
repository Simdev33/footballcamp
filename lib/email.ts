import nodemailer, { type Transporter } from "nodemailer"

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const RESEND_API_KEY = process.env.RESEND_API_KEY

export const EMAIL_FROM = process.env.EMAIL_FROM || "KickOff Camps <info@kickoffcamps.hu>"
export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || "info@kickoffcamps.hu"

let smtpTransporter: Transporter | null = null
function getSmtp(): Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }
  return smtpTransporter
}

export type SendEmailArgs = {
  to: string
  subject: string
  html: string
  replyTo?: string
}

/**
 * Sends an email. Prefers SMTP (Google Workspace) when configured; falls
 * back to Resend if only that is configured. If neither is set, returns
 * { sent: false } and the caller can present the Stripe link manually.
 */
export async function sendEmail(args: SendEmailArgs): Promise<{ sent: boolean; id?: string; error?: string }> {
  const smtp = getSmtp()
  if (smtp) {
    try {
      const info = await smtp.sendMail({
        from: EMAIL_FROM,
        to: args.to,
        subject: args.subject,
        html: args.html,
        replyTo: args.replyTo || EMAIL_REPLY_TO,
      })
      return { sent: true, id: info.messageId }
    } catch (err) {
      const message = err instanceof Error ? err.message : "SMTP send failed"
      return { sent: false, error: message }
    }
  }

  if (RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend")
      const resend = new Resend(RESEND_API_KEY)
      const res = await resend.emails.send({
        from: EMAIL_FROM,
        to: args.to,
        subject: args.subject,
        html: args.html,
        replyTo: args.replyTo || EMAIL_REPLY_TO,
      })
      if (res.error) return { sent: false, error: res.error.message }
      return { sent: true, id: res.data?.id }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Resend send failed"
      return { sent: false, error: message }
    }
  }

  return { sent: false, error: "No email provider configured" }
}

// ─────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────

function wrap(content: string): string {
  return `<!doctype html>
<html lang="hu">
<body style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;margin:0;padding:24px;color:#222;">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
    <tr>
      <td style="background:#0a1f0a;padding:20px;text-align:center;">
        <span style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#d4a017;">KickOff Camps</span>
      </td>
    </tr>
    <tr><td style="padding:32px;">${content}</td></tr>
    <tr>
      <td style="padding:16px 32px;border-top:1px solid #e5e5e5;color:#999;font-size:12px;text-align:center;">
        KickOff Camps · kickoffcamps.hu · +36 30 755 1110<br>
        <a href="https://kickoffcamps.hu" style="color:#d4a017;text-decoration:none;">kickoffcamps.hu</a>
      </td>
    </tr>
  </table>
</body></html>`
}

function button(label: string, href: string): string {
  return `<p style="text-align:center;margin:24px 0;">
    <a href="${href}" style="display:inline-block;background:#d4a017;color:#0a1f0a;padding:14px 28px;font-weight:bold;text-decoration:none;border-radius:4px;">
      ${escapeHtml(label)}
    </a>
  </p>`
}

function linkFallback(url: string): string {
  return `<p style="color:#666;font-size:13px;line-height:1.5;margin:0 0 8px;">
    Ha a gomb nem m&#369;k&ouml;dik, m&aacute;sold be ezt a linket a b&ouml;ng&eacute;sz&odblac;dbe:<br>
    <a href="${url}" style="color:#d4a017;word-break:break-all;">${url}</a>
  </p>`
}

export function renderRemainderEmail(args: {
  parentName: string
  childName: string
  campCity: string
  campDates: string
  amount: string
  paymentUrl: string
}): { subject: string; html: string } {
  const subject = `Hátralévő összeg fizetése – ${args.campCity} tábor`
  const html = wrap(`
    <h1 style="font-family:Georgia,serif;color:#0a1f0a;margin:0 0 16px;font-size:22px;">Kedves ${escapeHtml(args.parentName)}!</h1>
    <p style="line-height:1.6;margin:0 0 12px;">
      Közeledik <strong>${escapeHtml(args.childName)}</strong> tábora (<strong>${escapeHtml(args.campCity)}</strong>, ${escapeHtml(args.campDates)}).
    </p>
    <p style="line-height:1.6;margin:0 0 8px;">
      A foglaló megérkezett, köszönjük! Kérjük, a hátralévő összeget rendezd az alábbi biztonságos Stripe fizetési oldalon:
    </p>
    ${button(`Hátralévő fizetése: ${args.amount}`, args.paymentUrl)}
    ${linkFallback(args.paymentUrl)}
    <p style="color:#666;font-size:13px;line-height:1.5;margin:16px 0 0;">
      Ha már rendezted, kérjük ne vedd figyelembe ezt a levelet.
    </p>
  `)
  return { subject, html }
}

export function renderDepositPaidEmail(args: {
  parentName: string
  childName: string
  campCity: string
  campDates: string
  depositAmount: string
  remainderAmount: string
  totalAmount: string
}): { subject: string; html: string } {
  const subject = `Foglaló fogadva – ${args.campCity} tábor`
  const html = wrap(`
    <h1 style="font-family:Georgia,serif;color:#0a1f0a;margin:0 0 16px;font-size:22px;">Köszönjük a foglalót!</h1>
    <p style="line-height:1.6;margin:0 0 12px;">
      Kedves ${escapeHtml(args.parentName)}, megérkezett <strong>${escapeHtml(args.childName)}</strong> jelentkezésének foglalója a(z)
      <strong>${escapeHtml(args.campCity)}</strong> táborra (${escapeHtml(args.campDates)}).
    </p>
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:20px 0;background:#fafafa;">
      <tr><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#666;">Foglaló</td><td style="padding:10px 14px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">${escapeHtml(args.depositAmount)}</td></tr>
      <tr><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#666;">Hátralévő</td><td style="padding:10px 14px;border-bottom:1px solid #eee;text-align:right;">${escapeHtml(args.remainderAmount)}</td></tr>
      <tr><td style="padding:10px 14px;color:#666;">Teljes összeg</td><td style="padding:10px 14px;text-align:right;">${escapeHtml(args.totalAmount)}</td></tr>
    </table>
    <p style="line-height:1.6;margin:0 0 12px;">
      A hátralévő összegről <strong>körülbelül 2 héttel a tábor előtt</strong> külön fizetési linket küldünk ugyanerre az email címre.
    </p>
    <p style="line-height:1.6;margin:12px 0 0;">Ha bármi kérdésed van, válaszolj erre a levélre.</p>
  `)
  return { subject, html }
}

export function renderFullyPaidEmail(args: {
  parentName: string
  childName: string
  campCity: string
  campDates: string
  totalAmount: string
}): { subject: string; html: string } {
  const subject = `Sikeres fizetés – ${args.campCity} tábor`
  const html = wrap(`
    <h1 style="font-family:Georgia,serif;color:#0a1f0a;margin:0 0 16px;font-size:22px;">Sikeres fizetés!</h1>
    <p style="line-height:1.6;margin:0 0 12px;">
      Kedves ${escapeHtml(args.parentName)}, megerősítjük <strong>${escapeHtml(args.childName)}</strong> jelentkezését a(z)
      <strong>${escapeHtml(args.campCity)}</strong> táborra (${escapeHtml(args.campDates)}).
    </p>
    <p style="line-height:1.6;margin:0 0 12px;">
      Teljesen kifizetett összeg: <strong>${escapeHtml(args.totalAmount)}</strong>.
    </p>
    <p style="line-height:1.6;margin:0 0 12px;">
      A tábor előtti héten küldünk egy részletes tájékoztatót az időpontokról, a kötelező felszerelésről és minden tudnivalóról.
    </p>
    <p style="line-height:1.6;margin:12px 0 0;">Köszönjük a bizalmat! Kérdés esetén válaszolj erre a levélre.</p>
  `)
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
