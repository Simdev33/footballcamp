/**
 * Számlázz.hu (Számla Agent) integration.
 *
 * Creates an invoice in the Számlázz.hu account tied to the configured
 * `SZAMLAZZ_AGENT_KEY`. We call this from the Stripe webhook after a
 * successful payment — one invoice per payment event (deposit /
 * remainder / full).
 *
 * The Számla Agent endpoint accepts multipart/form-data with a single
 * `action-xmlagentxmlfile` field that carries the XML request body.
 * Successful responses include:
 *   - `szlahu_szamlaszam` header: the issued invoice number
 *   - `szlahu_download_url` header: a one-click PDF download link
 *
 * See: https://docs.szamlazz.hu/#xmlszamla-agent
 */

import type { Currency } from "./pricing"

const AGENT_URL = "https://www.szamlazz.hu/szamla/"

export type InvoiceKind = "deposit" | "remainder" | "full"

export interface InvoiceBuyer {
  name: string
  email: string
  postalCode?: string
  city?: string
  address?: string
  taxNumber?: string
}

export interface InvoiceLineItem {
  name: string
  description?: string
  quantity: number
  unitPrice: number
  unit?: string
}

export interface CreateInvoiceArgs {
  kind: InvoiceKind
  currency: Currency
  buyer: InvoiceBuyer
  items: InvoiceLineItem[]
  comment?: string
}

export interface InvoiceResult {
  invoiceNumber: string
  downloadUrl?: string
  gross?: number
  net?: number
  emailed: boolean
}

/** Simple tag-value pair for the Számlázz.hu XML builder. */
type XmlPair = [string, string | number | boolean | undefined | null]

function esc(value: unknown): string {
  const s = value === undefined || value === null ? "" : String(value)
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function tag(name: string, value: string | number | boolean | undefined | null): string {
  if (value === undefined || value === null || value === "") return ""
  const rendered = typeof value === "boolean" ? (value ? "true" : "false") : esc(value)
  return `<${name}>${rendered}</${name}>`
}

function block(name: string, pairs: XmlPair[]): string {
  const inner = pairs.map(([k, v]) => tag(k, v)).join("")
  return `<${name}>${inner}</${name}>`
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Maps a pre-configured tax code to its effective percentage.
 * Non-numeric codes (AAM, TAM, etc.) are returned as-is — Számlázz.hu
 * still expects gross == net for those (VAT value = 0).
 */
function normalizeVat(raw: string | undefined): string {
  const v = (raw || "27").trim()
  if (!v) return "27"
  return v
}

function vatPercent(code: string): number {
  const n = Number(code)
  if (Number.isFinite(n)) return n
  return 0
}

function headerXml(args: { comment?: string; paidDate?: string; paymentMethod?: string; currency: Currency }): string {
  const d = todayIso()
  const paid = args.paidDate || d
  return block("fejlec", [
    ["keltDatum", d],
    ["teljesitesDatum", paid],
    ["fizetesiHataridoDatum", paid],
    ["fizmod", args.paymentMethod || "bankkártya"],
    ["penznem", args.currency],
    ["szamlaNyelve", "hu"],
    ["megjegyzes", args.comment],
    ["fizetve", true],
  ])
}

function sellerXml(): string {
  // Seller data is pulled from the Számlázz.hu account profile; we only
  // override reply-to/email copy so the outgoing e-invoice has the right
  // reply address. The "emailTargy" supports the "{szamlaszam}"
  // placeholder that Számlázz.hu expands server-side.
  const replyTo = process.env.EMAIL_REPLY_TO || "info@kickoffcamps.hu"
  return block("elado", [
    ["emailReplyto", replyTo],
    ["emailTargy", "Számla - {szamlaszam}"],
    [
      "emailSzoveg",
      "Kedves Ügyfelünk!\n\nKöszönjük, hogy minket választott! Csatoltan küldjük az elektronikus számlát a KickOff Camps tábori szolgáltatásáról.\n\nSportbaráti üdvözlettel,\nKickOff Camps",
    ],
  ])
}

function buyerXml(buyer: InvoiceBuyer, sendEmail: boolean): string {
  return block("vevo", [
    ["nev", buyer.name],
    ["irsz", buyer.postalCode],
    ["telepules", buyer.city],
    ["cim", buyer.address],
    ["email", buyer.email],
    ["sendEmail", sendEmail],
    ["adoszam", buyer.taxNumber],
  ])
}

function itemsXml(items: InvoiceLineItem[], currency: Currency, vatCode: string): string {
  const pct = vatPercent(vatCode)
  const xml = items
    .map((it) => {
      const qty = it.quantity
      const net = Math.round(it.unitPrice) // already net for AAM/TAM, or we treat the price as net when VAT > 0
      const netTotal = Math.round(qty * net)
      const vat = Math.round((netTotal * pct) / 100)
      const gross = netTotal + vat
      return block("tetel", [
        ["megnevezes", [it.name, it.description].filter(Boolean).join(" — ")],
        ["mennyiseg", qty],
        ["mennyisegiEgyseg", it.unit || "db"],
        ["nettoEgysegar", net],
        ["afakulcs", vatCode],
        ["nettoErtek", netTotal],
        ["afaErtek", vat],
        ["bruttoErtek", gross],
      ])
    })
    .join("")
  void currency
  return `<tetelek>${xml}</tetelek>`
}

function settingsXml(args: { eInvoice: boolean }): string {
  const key = process.env.SZAMLAZZ_AGENT_KEY || ""
  return block("beallitasok", [
    ["szamlaagentkulcs", key],
    ["eszamla", args.eInvoice],
    ["kulcstartando", args.eInvoice],
    ["szamlaLetoltes", false],
    ["valaszVerzio", 2],
  ])
}

function buildInvoiceXml(args: CreateInvoiceArgs, opts: { sendEmail: boolean; eInvoice: boolean; vatCode: string }): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xmlszamla xmlns="http://www.szamlazz.hu/xmlszamla" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.szamlazz.hu/xmlszamla https://www.szamlazz.hu/szamla/docs/xsds/agent/xmlszamla.xsd">
${settingsXml({ eInvoice: opts.eInvoice })}
${headerXml({ comment: args.comment, currency: args.currency })}
${sellerXml()}
${buyerXml(args.buyer, opts.sendEmail)}
${itemsXml(args.items, args.currency, opts.vatCode)}
</xmlszamla>`
}

/**
 * Creates an invoice via Számla Agent. Never throws — on error returns
 * null and logs. The caller should continue the payment flow regardless
 * (an admin can regenerate the invoice manually).
 */
export async function createInvoice(args: CreateInvoiceArgs): Promise<InvoiceResult | null> {
  const agentKey = process.env.SZAMLAZZ_AGENT_KEY
  if (!agentKey) {
    console.warn("[szamlazz] SZAMLAZZ_AGENT_KEY is not set — skipping invoice generation.")
    return null
  }

  const vatCode = normalizeVat(process.env.SZAMLAZZ_VAT)
  const sendEmail = (process.env.SZAMLAZZ_EMAIL_CUSTOMER || "true").toLowerCase() !== "false"
  const eInvoice = (process.env.SZAMLAZZ_E_INVOICE || "true").toLowerCase() !== "false"

  const xml = buildInvoiceXml(args, { sendEmail, eInvoice, vatCode })

  const form = new FormData()
  const blob = new Blob([xml], { type: "application/xml" })
  form.append("action-xmlagentxmlfile", blob, "request.xml")

  let response: Response
  try {
    response = await fetch(AGENT_URL, { method: "POST", body: form })
  } catch (err) {
    console.error("[szamlazz] Network error contacting Számla Agent:", err)
    return null
  }

  const errorCode = response.headers.get("szlahu_error_code")
  const errorMessage = response.headers.get("szlahu_error")

  if (errorCode && errorCode !== "0") {
    console.error(
      "[szamlazz] Számla Agent returned error",
      errorCode,
      decodeURIComponent(errorMessage || ""),
    )
    return null
  }

  const invoiceNumber = response.headers.get("szlahu_szamlaszam") || ""
  if (!invoiceNumber) {
    // Drain body for logs and bail out.
    const body = await response.text().catch(() => "")
    console.error("[szamlazz] Számla Agent response missing invoice number. Body:", body.slice(0, 500))
    return null
  }

  const downloadUrl = response.headers.get("szlahu_vevoifiokurl") || response.headers.get("szlahu_download_url") || undefined
  const grossHeader = response.headers.get("szlahu_bruttovegosszeg")
  const netHeader = response.headers.get("szlahu_nettovegosszeg")

  return {
    invoiceNumber,
    downloadUrl: downloadUrl || undefined,
    gross: grossHeader ? Number(grossHeader) : undefined,
    net: netHeader ? Number(netHeader) : undefined,
    emailed: sendEmail,
  }
}

// ─────────────────────────────────────────────────────────────
// High-level helper used by the Stripe webhook.
// ─────────────────────────────────────────────────────────────

export interface InvoiceForApplicationInput {
  kind: InvoiceKind
  amount: number
  currency: Currency
  parent: {
    name: string
    email: string
    postalCode: string
    city: string
    address: string
    taxNumber: string
  }
  child: { name: string }
  camp: { city: string; venue: string; dates: string }
}

/**
 * Builds + sends the invoice for a single payment on an application.
 * Returns invoice metadata or null on failure (see `createInvoice`).
 */
export async function createInvoiceForApplicationPayment(
  input: InvoiceForApplicationInput,
): Promise<InvoiceResult | null> {
  const kindLabel =
    input.kind === "deposit" ? "Első részlet" : input.kind === "remainder" ? "Hátralévő összeg" : "Teljes részvételi díj"

  const itemName = `${kindLabel} - ${input.camp.city} tábor - ${input.child.name}`
  const itemDescription = `${input.camp.venue} • ${input.camp.dates}`

  return createInvoice({
    kind: input.kind,
    currency: input.currency,
    comment: `KickOff Camps jelentkezés — ${input.child.name} (${input.camp.city}, ${input.camp.dates})`,
    buyer: {
      name: input.parent.name,
      email: input.parent.email,
      postalCode: input.parent.postalCode,
      city: input.parent.city,
      address: input.parent.address,
      taxNumber: input.parent.taxNumber,
    },
    items: [
      {
        name: itemName,
        description: itemDescription,
        quantity: 1,
        unitPrice: input.amount,
        unit: "db",
      },
    ],
  })
}
