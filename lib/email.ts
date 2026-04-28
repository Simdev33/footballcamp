import nodemailer, { type Transporter } from "nodemailer"
import { BANK_DETAILS, formatDeadline } from "@/lib/bank-transfer"
import { formatPrice, type Currency } from "@/lib/pricing"

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const RESEND_API_KEY = process.env.RESEND_API_KEY

export const EMAIL_FROM = process.env.EMAIL_FROM || "KickOff Camps <info@kickoffcamps.hu>"
export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || "info@kickoffcamps.hu"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kickoffcamps.hu"
const LOGO_URL = `${SITE_URL}/kickoff-logo.png`

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

// Brand tokens — aligned with the public site (dark green + gold).
const C = {
  bg: "#0a1f0a",
  bgDeep: "#06140a",
  gold: "#d4a017",
  goldDark: "#b8860b",
  cream: "#faf7f0",
  ink: "#1a1a1a",
  mute: "#6b6b6b",
  line: "#e8e4d9",
  surface: "#ffffff",
  tint: "#faf7f0",
}

type WrapOptions = {
  preheader?: string
  eyebrow?: string
  title: string
}

function wrap(opts: WrapOptions, content: string): string {
  const preheader = opts.preheader ? escapeHtml(opts.preheader) : ""
  return `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.tint};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${C.ink};-webkit-font-smoothing:antialiased;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.tint};padding:32px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.surface};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(10,31,10,0.08);">

        <!-- Hero header with logo -->
        <tr>
          <td style="background:linear-gradient(135deg,${C.bg} 0%,${C.bgDeep} 100%);padding:36px 32px 28px;text-align:center;">
            <img src="${LOGO_URL}" alt="KickOff Camps" width="120" height="120" style="display:inline-block;width:120px;height:120px;object-fit:contain;border:0;outline:none;">
            <div style="height:14px;line-height:14px;font-size:14px;">&nbsp;</div>
            <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:${C.gold};letter-spacing:1px;">KICKOFF CAMPS</div>
            <div style="height:6px;line-height:6px;font-size:6px;">&nbsp;</div>
            <div style="font-size:12px;color:rgba(250,247,240,0.6);letter-spacing:3px;text-transform:uppercase;">Futball. Élmény. Fejlődés.</div>
          </td>
        </tr>

        <!-- Gold accent bar -->
        <tr><td style="height:4px;line-height:4px;background:linear-gradient(90deg,${C.goldDark} 0%,${C.gold} 50%,${C.goldDark} 100%);">&nbsp;</td></tr>

        <!-- Eyebrow + title -->
        <tr>
          <td style="padding:36px 40px 0;">
            ${opts.eyebrow ? `<div style="font-size:11px;color:${C.gold};letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:10px;">${escapeHtml(opts.eyebrow)}</div>` : ""}
            <h1 style="font-family:Georgia,serif;color:${C.bg};margin:0;font-size:28px;line-height:1.25;font-weight:700;">${escapeHtml(opts.title)}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:20px 40px 36px;">${content}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:${C.tint};padding:24px 40px;border-top:1px solid ${C.line};">
            <table role="presentation" width="100%"><tr>
              <td style="font-size:12px;color:${C.mute};line-height:1.6;">
                <strong style="color:${C.bg};">KickOff Camps</strong><br>
                <a href="mailto:info@kickoffcamps.hu" style="color:${C.mute};text-decoration:none;">info@kickoffcamps.hu</a><br>
                <a href="tel:+36307551110" style="color:${C.mute};text-decoration:none;">+36 30 755 1110</a>
              </td>
              <td align="right" style="font-size:12px;color:${C.mute};line-height:1.6;">
                <a href="${SITE_URL}" style="color:${C.gold};text-decoration:none;font-weight:600;">kickoffcamps.hu</a><br>
                <a href="${SITE_URL}/aszf" style="color:${C.mute};text-decoration:none;">ÁSZF</a> &nbsp;·&nbsp;
                <a href="${SITE_URL}/adatvedelem" style="color:${C.mute};text-decoration:none;">Adatvédelem</a>
              </td>
            </tr></table>
          </td>
        </tr>
      </table>

      <div style="color:${C.mute};font-size:11px;padding:16px 8px 0;max-width:600px;">
        Ezt a levelet a KickOff Camps küldte a(z) <strong></strong> címre. Ha nem te jelentkeztél, kérjük jelezd válaszban.
      </div>

    </td></tr>
  </table>
</body></html>`
}

function button(label: string, href: string): string {
  // Bulletproof-ish CTA button (works in Outlook too via padding + line-height trick).
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;"><tr><td style="background:${C.gold};border-radius:8px;box-shadow:0 4px 12px rgba(212,160,23,0.35);">
    <a href="${href}" style="display:inline-block;padding:16px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:${C.bg};text-decoration:none;letter-spacing:0.3px;">
      ${escapeHtml(label)} &rarr;
    </a>
  </td></tr></table>`
}

function linkFallback(url: string): string {
  return `<div style="background:${C.tint};border:1px solid ${C.line};border-radius:8px;padding:14px 16px;margin:16px 0 0;">
    <div style="font-size:11px;color:${C.mute};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Ha a gomb nem működik</div>
    <a href="${url}" style="color:${C.goldDark};word-break:break-all;font-size:12px;text-decoration:none;">${url}</a>
  </div>`
}

function greeting(name: string): string {
  return `<p style="font-size:16px;line-height:1.65;margin:0 0 16px;color:${C.ink};">Kedves <strong>${escapeHtml(name)}</strong>,</p>`
}

function paragraph(html: string): string {
  return `<p style="font-size:15px;line-height:1.7;margin:0 0 14px;color:${C.ink};">${html}</p>`
}

function campCard(city: string, dates: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:${C.bg};border-radius:12px;overflow:hidden;">
    <tr><td style="padding:20px 24px;">
      <div style="font-size:11px;color:${C.gold};letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:6px;">TÁBOR</div>
      <div style="font-family:Georgia,serif;font-size:22px;color:#ffffff;font-weight:700;margin-bottom:4px;">${escapeHtml(city)}</div>
      <div style="font-size:14px;color:rgba(250,247,240,0.75);">${escapeHtml(dates)}</div>
    </td></tr>
  </table>`
}

function amountRow(label: string, value: string, opts?: { bold?: boolean; highlight?: boolean }): string {
  const bg = opts?.highlight ? C.tint : "transparent"
  const weight = opts?.bold ? "700" : "500"
  const color = opts?.highlight ? C.bg : C.ink
  const size = opts?.highlight ? "18px" : "15px"
  return `<tr>
    <td style="padding:12px 16px;border-bottom:1px solid ${C.line};background:${bg};color:${C.mute};font-size:14px;">${escapeHtml(label)}</td>
    <td style="padding:12px 16px;border-bottom:1px solid ${C.line};background:${bg};text-align:right;font-weight:${weight};color:${color};font-size:${size};">${escapeHtml(value)}</td>
  </tr>`
}

function amountTable(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid ${C.line};border-radius:10px;overflow:hidden;">
    ${rows}
  </table>`
}

function infoBox(title: string, body: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:${C.tint};border-left:4px solid ${C.gold};border-radius:6px;">
    <tr><td style="padding:16px 20px;">
      <div style="font-size:13px;font-weight:700;color:${C.bg};margin-bottom:6px;">${escapeHtml(title)}</div>
      <div style="font-size:14px;color:${C.ink};line-height:1.6;">${body}</div>
    </td></tr>
  </table>`
}

function textBodyToHtml(body: string): string {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => paragraph(escapeHtml(block).replace(/\n/g, "<br>")))
    .join("")
}

// ─────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────

export function renderNewsletterEmail(args: {
  subject: string
  previewText?: string
  body: string
  slotLabel: string
  recipientEmail: string
  unsubscribeUrl: string
}): { subject: string; html: string } {
  const html = wrap(
    {
      title: args.subject,
      eyebrow: `${args.slotLabel} hírlevél`,
      preheader: args.previewText || args.subject,
    },
    `
    ${textBodyToHtml(args.body)}
    ${button("Táborok megtekintése", `${SITE_URL}/taborok`)}
    ${infoBox(
      "Leiratkozás",
      `Ezt a hírlevelet azért kaptad, mert feliratkoztál a KickOff Camps oldalán a(z) <strong>${escapeHtml(args.recipientEmail)}</strong> címmel. Ha nem szeretnél több hírlevelet kapni, <a href="${args.unsubscribeUrl}" style="color:${C.goldDark};font-weight:700;">kattints ide a leiratkozáshoz</a>.`,
    )}
    <p style="font-size:15px;line-height:1.7;margin:22px 0 0;color:${C.ink};">Sportbaráti üdvözlettel,<br><strong>KickOff Camps csapata</strong></p>
  `,
  )

  return { subject: args.subject, html }
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
  const html = wrap(
    {
      title: "Hátralévő összeg fizetése",
      eyebrow: "Fizetési emlékeztető",
      preheader: `${args.childName} táborához hátralévő ${args.amount} fizetése`,
    },
    `
    ${greeting(args.parentName)}
    ${paragraph(`Közeledik <strong>${escapeHtml(args.childName)}</strong> tábora. A foglaló rendezve, köszönjük! Most már csak a hátralévő összeg van hátra, amit az alábbi biztonságos Stripe fizetési oldalon tudsz rendezni.`)}
    ${campCard(args.campCity, args.campDates)}
    ${amountTable(amountRow("Fizetendő hátralévő", args.amount, { highlight: true, bold: true }))}
    ${button(`Fizetés: ${args.amount}`, args.paymentUrl)}
    ${linkFallback(args.paymentUrl)}
    ${infoBox("Biztonság", "A fizetés a Stripe-on keresztül történik — bankkártya-adataid nem érkeznek meg hozzánk, végig titkosított csatornán utaznak.")}
    ${paragraph(`Ha már rendezted ezt az összeget, kérjük tekintsd tárgytalannak ezt a levelet.`)}
    ${paragraph(`Kérdés esetén válaszolj erre az emailre — itt vagyunk!`)}
    <p style="font-size:15px;line-height:1.7;margin:22px 0 0;color:${C.ink};">Üdvözlettel,<br><strong>KickOff Camps csapata</strong></p>
  `,
  )
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
  const subject = `Részletfizetés foglalója fogadva – ${args.campCity} tábor`
  const html = wrap(
    {
      title: "Köszönjük, a foglaló beérkezett!",
      eyebrow: "Sikeres fizetés",
      preheader: `${args.childName} helye foglalva a ${args.campCity} táborra részletfizetéssel.`,
    },
    `
    ${greeting(args.parentName)}
    ${paragraph(`Megerősítjük, hogy <strong>${escapeHtml(args.childName)}</strong> részletfizetéses jelentkezésének <strong>foglalóját</strong> megkaptuk. A helyét <strong>lefoglaltuk</strong>!`)}
    ${campCard(args.campCity, args.campDates)}
    ${amountTable(
      amountRow("Befizetett foglaló (részletfizetés)", args.depositAmount, { bold: true }) +
      amountRow("Hátralévő összeg", args.remainderAmount) +
      amountRow("Teljes összeg", args.totalAmount, { highlight: true, bold: true }),
    )}
    ${infoBox("Mi a következő lépés?", `A hátralévő összegről <strong>kb. 2 héttel a tábor előtt</strong> küldünk egy biztonságos fizetési linket erre az email címre. Kérjük, addig is tartsd szem előtt a postaládád.`)}
    ${paragraph(`Kérdés esetén bármikor elérhető vagyunk — csak válaszolj erre a levélre.`)}
    <p style="font-size:15px;line-height:1.7;margin:22px 0 0;color:${C.ink};">Sportbaráti üdvözlettel,<br><strong>KickOff Camps csapata</strong></p>
  `,
  )
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
  const html = wrap(
    {
      title: "Minden rendben, jöhet a tábor!",
      eyebrow: "Fizetés megerősítve",
      preheader: `${args.childName} jelentkezése megerősítve – ${args.totalAmount} befizetve.`,
    },
    `
    ${greeting(args.parentName)}
    ${paragraph(`Megerősítjük, hogy <strong>${escapeHtml(args.childName)}</strong> jelentkezése a(z) <strong>${escapeHtml(args.campCity)}</strong> táborra teljes egészében kifizetve. A helye biztosítva!`)}
    ${campCard(args.campCity, args.campDates)}
    ${amountTable(amountRow("Befizetett összeg (teljes)", args.totalAmount, { highlight: true, bold: true }))}
    ${infoBox("Mire számíthatsz?", `A tábor előtti héten egy részletes tájékoztatót küldünk: pontos helyszín és időpontok, szükséges felszerelés, napirend és minden gyakorlati tudnivaló. Addig is lazíts — a nehezét elvégezted!`)}
    ${paragraph(`Ha bármi változik (pl. betegség, lemondás), azonnal szólj, és segítünk.`)}
    ${paragraph(`Találkozunk a pályán! ⚽`)}
    <p style="font-size:15px;line-height:1.7;margin:22px 0 0;color:${C.ink};">Sportbaráti üdvözlettel,<br><strong>KickOff Camps csapata</strong></p>
  `,
  )
  return { subject, html }
}

// ─────────────────────────────────────────────────────────────
// Bank transfer instructions
// ─────────────────────────────────────────────────────────────

export function renderTransferInstructionsEmail(args: {
  parentName: string
  children: Array<{ name: string; camp: string; amount: number }>
  currency: Currency
  totalAmount: number
  reference: string
  deadline: Date
  isInstallment: boolean
}): { subject: string; html: string } {
  const subject = args.isInstallment
    ? `Jelentkezés rögzítve — foglaló átutalása (${args.reference})`
    : `Jelentkezés rögzítve — átutalási adatok (${args.reference})`

  const deadlineStr = formatDeadline(args.deadline, "hu")
  const amountStr = formatPrice(args.totalAmount, args.currency)
  const amountLabel = args.isInstallment ? "Utalandó foglaló" : "Utalandó összeg"

  const kidsRows = args.children
    .map((c) =>
      amountRow(
        `${c.name} — ${c.camp}`,
        formatPrice(c.amount, args.currency),
      ),
    )
    .join("")

  const bankBlock = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;background:${C.bg};border-radius:12px;overflow:hidden;">
      <tr><td style="padding:22px 24px;">
        <div style="font-size:11px;color:${C.gold};letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:10px;">Utalási adatok</div>
        <div style="color:#ffffff;font-family:Georgia,serif;font-size:18px;font-weight:700;line-height:1.4;">${escapeHtml(BANK_DETAILS.accountHolder)}</div>
        <div style="color:rgba(250,247,240,0.75);font-size:13px;margin-top:2px;">${escapeHtml(BANK_DETAILS.bankName)}</div>

        <div style="margin-top:16px;border-top:1px solid rgba(212,160,23,0.2);padding-top:14px;">
          <div style="font-size:11px;color:rgba(250,247,240,0.6);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Számlaszám</div>
          <div style="font-family:'Menlo','Courier New',monospace;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.5px;">${escapeHtml(BANK_DETAILS.accountNumber)}</div>
        </div>

        <div style="margin-top:14px;">
          <div style="font-size:11px;color:rgba(250,247,240,0.6);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Közlemény (kötelező!)</div>
          <div style="font-family:'Menlo','Courier New',monospace;color:${C.gold};font-size:22px;font-weight:700;letter-spacing:1px;">${escapeHtml(args.reference)}</div>
        </div>

        <div style="margin-top:14px;">
          <div style="font-size:11px;color:rgba(250,247,240,0.6);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">${escapeHtml(amountLabel)}</div>
          <div style="color:#ffffff;font-size:22px;font-weight:700;">${escapeHtml(amountStr)}</div>
        </div>

        <div style="margin-top:14px;">
          <div style="font-size:11px;color:rgba(250,247,240,0.6);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">Határidő</div>
          <div style="color:#ffffff;font-size:15px;font-weight:600;">${escapeHtml(deadlineStr)}</div>
        </div>
      </td></tr>
    </table>
  `

  const html = wrap(
    {
      title: args.isInstallment ? "Köszönjük a jelentkezést, jöhet a foglaló!" : "Köszönjük a jelentkezést!",
      eyebrow: "Átutalás szükséges",
      preheader: `${args.reference} — ${amountStr} átutalása a megadott számlaszámra.`,
    },
    `
    ${greeting(args.parentName)}
    ${paragraph(
      args.isInstallment
        ? `A részletfizetéses jelentkezést rögzítettük. A hely véglegesítéséhez, kérlek, utald át a <strong>foglaló</strong> összegét az alábbi adatokkal. A hátralévő összegről a tábor előtt külön tájékoztatunk.`
        : `A jelentkezést rögzítettük. A hely véglegesítéséhez, kérlek, utald át a teljes összeget az alábbi adatokkal.`,
    )}

    ${bankBlock}

    ${infoBox(
      "Nagyon fontos!",
      `Kérjük, <strong>pontosan másold be a közleményt</strong> (<span style="font-family:'Menlo','Courier New',monospace;color:${C.goldDark};font-weight:700;">${escapeHtml(args.reference)}</span>). Enélkül nem tudjuk az utalást a jelentkezéshez hozzárendelni.`,
    )}

    ${args.children.length > 1 ? `<p style="font-size:13px;color:${C.mute};margin:12px 0 6px;">Részletezés testvérenként:</p>${amountTable(kidsRows + amountRow("Összesen", amountStr, { highlight: true, bold: true }))}` : ""}

    ${paragraph(`Amint az átutalást jóváírták, automatikusan küldünk egy visszaigazoló emailt és az elektronikus számlát is. Ez az ünnepnapoktól és a banki átfutástól függően <strong>1-3 munkanapot</strong> vehet igénybe.`)}

    ${paragraph(`Ha kérdésed van, csak válaszolj erre az emailre, vagy keress minket a <a href="tel:+36307551110" style="color:${C.goldDark};">+36 30 755 1110</a> számon.`)}

    <p style="font-size:15px;line-height:1.7;margin:22px 0 0;color:${C.ink};">Sportbaráti üdvözlettel,<br><strong>KickOff Camps csapata</strong></p>
  `,
  )
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
