"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { hash } from "bcryptjs"
import { formatPrice, type Currency } from "@/lib/pricing"
import { revalidatePublicCamps } from "@/lib/public-camps"
import { parseCampTranslation, saveCampTranslation } from "@/lib/camp-translations"
import { INVOICE_GENERATION_ENABLED } from "@/lib/invoice-toggle"

// ─── Camps ───

function parseStringArray(formData: FormData, key: string): string[] {
  const raw = formData.get(key) as string
  if (!raw) return []
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseJson(formData: FormData, key: string) {
  const raw = formData.get(key) as string
  if (!raw) return undefined
  try { return JSON.parse(raw) } catch { return undefined }
}

function parseIntField(formData: FormData, key: string, fallback = 0): number {
  const raw = formData.get(key)
  if (raw == null || raw === "") return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? Math.round(n) : fallback
}

function parseDateField(formData: FormData, key: string): Date | null {
  const raw = formData.get(key) as string
  if (!raw) return null
  const d = new Date(raw)
  return isNaN(d.getTime()) ? null : d
}

function buildCampPriceData(formData: FormData) {
  const priceHuf = parseIntField(formData, "priceHuf")
  const priceEur = parseIntField(formData, "priceEur")
  const earlyBirdPriceHuf = parseIntField(formData, "earlyBirdPriceHuf")
  const earlyBirdPriceEur = parseIntField(formData, "earlyBirdPriceEur")
  const earlyBirdUntil = parseDateField(formData, "earlyBirdUntil")
  // Legacy DB field name: the admin now stores a fixed first-instalment amount
  // in forints here.
  const depositPercent = parseIntField(formData, "depositPercent")

  // Keep legacy string columns in sync so the public site (which still reads
  // `price` / `earlyBirdPrice`) stays on the same values.
  return {
    priceHuf,
    priceEur,
    earlyBirdPriceHuf,
    earlyBirdPriceEur,
    earlyBirdUntil,
    depositPercent,
    price: formatPrice(priceHuf, "HUF"),
    earlyBirdPrice: formatPrice(earlyBirdPriceHuf, "HUF"),
  }
}

export async function createCamp(formData: FormData) {
  const city = formData.get("city") as string
  const camp = await db.camp.create({
    data: {
      slug: slugify(city) + "-" + Date.now().toString(36),
      city,
      venue: formData.get("venue") as string,
      dates: formData.get("dates") as string,
      ...buildCampPriceData(formData),
      totalSpots: Number(formData.get("totalSpots")),
      remainingSpots: Number(formData.get("totalSpots")),
      active: formData.get("active") === "on",
      description: (formData.get("description") as string) || "",
      imageUrl: (formData.get("imageUrl") as string) || null,
      clubName: (formData.get("clubName") as string) || "SL Benfica",
      ageRange: (formData.get("ageRange") as string) || "7-15",
      includes: parseStringArray(formData, "includes"),
      gallery: parseStringArray(formData, "gallery"),
      videoUrl: (formData.get("videoUrl") as string) || null,
      mapEmbedUrl: (formData.get("mapEmbedUrl") as string) || null,
      schedule: parseJson(formData, "schedule"),
      coaches: parseJson(formData, "coaches"),
      faq: parseJson(formData, "faq"),
    },
  })
  await saveCampTranslation(camp.id, "en", parseCampTranslation(formData))
  revalidatePublicCamps()
  revalidatePath("/admin/taborok")
  revalidatePath("/")
  revalidatePath("/taborok")
  redirect("/admin/taborok")
}

export async function updateCamp(id: string, formData: FormData) {
  const camp = await db.camp.update({
    where: { id },
    data: {
      city: formData.get("city") as string,
      venue: formData.get("venue") as string,
      dates: formData.get("dates") as string,
      ...buildCampPriceData(formData),
      totalSpots: Number(formData.get("totalSpots")),
      remainingSpots: Number(formData.get("remainingSpots")),
      active: formData.get("active") === "on",
      description: (formData.get("description") as string) || "",
      imageUrl: (formData.get("imageUrl") as string) || null,
      clubName: (formData.get("clubName") as string) || "SL Benfica",
      ageRange: (formData.get("ageRange") as string) || "7-15",
      includes: parseStringArray(formData, "includes"),
      gallery: parseStringArray(formData, "gallery"),
      videoUrl: (formData.get("videoUrl") as string) || null,
      mapEmbedUrl: (formData.get("mapEmbedUrl") as string) || null,
      schedule: parseJson(formData, "schedule"),
      coaches: parseJson(formData, "coaches"),
      faq: parseJson(formData, "faq"),
    },
  })
  await saveCampTranslation(camp.id, "en", parseCampTranslation(formData))
  revalidatePublicCamps()
  revalidatePath("/admin/taborok")
  revalidatePath("/")
  revalidatePath("/taborok")
  revalidatePath(`/taborok/${camp.slug}`)
  redirect("/admin/taborok")
}

export async function deleteCamp(id: string) {
  await db.camp.delete({ where: { id } })
  revalidatePublicCamps()
  revalidatePath("/admin/taborok")
  revalidatePath("/")
  revalidatePath("/taborok")
}

// ─── Applications ───

export async function createApplication(formData: FormData) {
  const campId = formData.get("campId") as string
  const rawBirthDate = formData.get("childBirthDate") as string | null
  const rawChildAge = Number(formData.get("childAge"))
  const childBirthDate = rawBirthDate
    ? new Date(rawBirthDate)
    : new Date(new Date().getFullYear() - (Number.isFinite(rawChildAge) ? rawChildAge : 10), 0, 1)

  await db.application.create({
    data: {
      parentName: formData.get("parentName") as string,
      parentEmail: formData.get("parentEmail") as string,
      parentPhone: formData.get("parentPhone") as string,
      childName: formData.get("childName") as string,
      childBirthDate,
      campId,
    },
  })

  await db.camp.update({
    where: { id: campId },
    data: { remainingSpots: { decrement: 1 } },
  })

  revalidatePath("/jelentkezes")
  redirect("/jelentkezes?success=true")
}

export async function updateApplicationStatus(id: string, status: string) {
  await db.application.update({ where: { id }, data: { status } })
  revalidatePath("/admin/jelentkezesek")
}

export async function updateApplicationNotes(id: string, notes: string) {
  await db.application.update({ where: { id }, data: { notes } })
  revalidatePath("/admin/jelentkezesek")
}

export async function resendPaymentConfirmationEmail(id: string) {
  const { sendEmail, renderDepositPaidEmail, renderFullyPaidEmail } = await import("@/lib/email")

  const app = await db.application.findUnique({ where: { id }, include: { camp: true } })
  if (!app) return { ok: false, error: "Jelentkezés nem található." }
  if (app.paymentStatus !== "DEPOSIT_PAID" && app.paymentStatus !== "FULLY_PAID") {
    return { ok: false, error: "Ehhez a jelentkezéshez még nincs sikeres fizetés." }
  }

  const currency = (app.currency as Currency) || "HUF"
  const email =
    app.paymentStatus === "DEPOSIT_PAID"
      ? renderDepositPaidEmail({
          parentName: app.parentName,
          childName: app.childName,
          campCity: app.camp.city,
          campDates: app.camp.dates,
          depositAmount: formatPrice(app.depositPaidAmount || app.depositAmount, currency),
          remainderAmount: formatPrice(Math.max(0, app.totalAmount - (app.depositPaidAmount || app.depositAmount)), currency),
          totalAmount: formatPrice(app.totalAmount, currency),
        })
      : renderFullyPaidEmail({
          parentName: app.parentName,
          childName: app.childName,
          campCity: app.camp.city,
          campDates: app.camp.dates,
          totalAmount: formatPrice(app.depositPaidAmount + app.remainderPaidAmount || app.totalAmount, currency),
        })

  const result = await sendEmail({
    to: app.parentEmail,
    subject: email.subject,
    html: email.html,
    replyTo: "info@kickoffcamps.hu",
  })

  if (!result.sent) {
    return { ok: false, error: result.error || "Az email küldése sikertelen." }
  }

  await db.paymentEvent.create({
    data: {
      applicationId: app.id,
      type: "confirmation_email_resent",
      amount: 0,
      currency,
      note: `Fizetési visszaigazoló email újraküldve: ${app.parentEmail}`,
    },
  })

  revalidatePath(`/admin/jelentkezesek/${id}`)
  revalidatePath("/admin/jelentkezesek")
  return { ok: true, email: app.parentEmail }
}

/**
 * Marks a bank transfer as received for an application and propagates all
 * the downstream effects: payment status update, PaymentEvent timeline,
 * Számlázz.hu invoice generation and the matching confirmation email.
 *
 * `kind` selects which portion of the total is being settled. When the
 * application has siblings sharing the same transferReference, all of
 * them are updated in one go (they belong to the same submission).
 */
export async function markTransferPaid(
  id: string,
  kind: "deposit" | "full" | "remainder",
) {
  const { db } = await import("@/lib/db")
  const { sendEmail, renderDepositPaidEmail, renderFullyPaidEmail } = await import("@/lib/email")
  const { extractBillingName } = await import("@/lib/billing-name")
  const { formatPrice } = await import("@/lib/pricing")
  const invoiceApi = INVOICE_GENERATION_ENABLED
    ? await import("@/lib/szamlazz")
    : null

  const anchor = await db.application.findUnique({ where: { id } })
  if (!anchor) return { ok: false, error: "Jelentkezés nem található." }
  if (anchor.paymentMethod !== "TRANSFER") {
    return { ok: false, error: "Nem átutalásos jelentkezés." }
  }
  if (!anchor.transferReference) {
    return { ok: false, error: "Nincs közleménykód — régi jelentkezés?" }
  }

  // All siblings from the same submission share one reference.
  const group = await db.application.findMany({
    where: { transferReference: anchor.transferReference },
    include: { camp: true },
  })

  const currency = (anchor.currency as "HUF" | "EUR") || "HUF"
  const newlyDepositPaid: typeof group = []
  const newlyFullyPaid: typeof group = []
  const invoiceTargets: Array<{
    app: typeof group[number]
    paymentEventId: string
    amount: number
    kind: "deposit" | "full" | "remainder"
  }> = []

  await db.$transaction(async (tx) => {
    for (const app of group) {
      const remainderExpected = Math.max(0, app.totalAmount - app.depositAmount)
      const perAppExpected =
        kind === "deposit" ? app.depositAmount
        : kind === "remainder" ? remainderExpected
        : app.totalAmount
      const already =
        kind === "deposit" ? app.depositPaidAmount
        : kind === "remainder" ? app.remainderPaidAmount
        : app.depositPaidAmount + app.remainderPaidAmount
      if (already >= perAppExpected && perAppExpected > 0) continue

      const now = new Date()
      const data: Parameters<typeof tx.application.update>[0]["data"] = {}

      if (kind === "full" || !app.isInstallment) {
        data.paymentStatus = "FULLY_PAID"
        data.depositPaidAmount = app.depositAmount || perAppExpected
        data.remainderPaidAmount = Math.max(0, (app.totalAmount || perAppExpected) - (app.depositAmount || 0))
        data.depositPaidAt = app.depositPaidAt ?? now
        data.fullyPaidAt = now
        newlyFullyPaid.push(app)
      } else if (kind === "remainder") {
        data.paymentStatus = "FULLY_PAID"
        data.remainderPaidAmount = perAppExpected
        data.fullyPaidAt = now
        newlyFullyPaid.push(app)
      } else {
        data.paymentStatus = "DEPOSIT_PAID"
        data.depositPaidAmount = perAppExpected
        data.depositPaidAt = now
        newlyDepositPaid.push(app)
      }

      await tx.application.update({ where: { id: app.id }, data })

      const event = await tx.paymentEvent.create({
        data: {
          applicationId: app.id,
          type:
            kind === "deposit" ? "deposit_paid"
            : kind === "remainder" ? "remainder_paid"
            : "full_paid",
          amount: perAppExpected,
          currency,
          note: `Átutalás kézzel megerősítve (közl: ${app.transferReference})`,
        },
        select: { id: true },
      })

      invoiceTargets.push({ app, paymentEventId: event.id, amount: perAppExpected, kind })
    }
  })

  // Side effects outside the DB transaction.
  const campDates = (c: typeof group[number]["camp"]): string => {
    const raw = c.dates
    if (typeof raw === "string" && raw.length > 0) return raw
    if (raw && typeof raw === "object" && "hu" in raw && typeof (raw as { hu?: unknown }).hu === "string") {
      return (raw as { hu: string }).hu
    }
    return ""
  }

  await Promise.all([
    ...newlyDepositPaid.map(async (app) => {
      try {
        const { subject, html } = renderDepositPaidEmail({
          parentName: app.parentName,
          childName: app.childName,
          campCity: app.camp.city,
          campDates: campDates(app.camp),
          depositAmount: formatPrice(app.depositAmount, currency),
          remainderAmount: formatPrice(Math.max(0, app.totalAmount - app.depositAmount), currency),
          totalAmount: formatPrice(app.totalAmount, currency),
        })
        await sendEmail({ to: app.parentEmail, subject, html, replyTo: "info@kickoffcamps.hu" })
      } catch (err) {
        console.error("[markTransferPaid] deposit email failed", err)
      }
    }),
    ...newlyFullyPaid.map(async (app) => {
      try {
        const { subject, html } = renderFullyPaidEmail({
          parentName: app.parentName,
          childName: app.childName,
          campCity: app.camp.city,
          campDates: campDates(app.camp),
          totalAmount: formatPrice(app.totalAmount, currency),
        })
        await sendEmail({ to: app.parentEmail, subject, html, replyTo: "info@kickoffcamps.hu" })
      } catch (err) {
        console.error("[markTransferPaid] paid email failed", err)
      }
    }),
    ...invoiceTargets.map(async (t) => {
      if (!INVOICE_GENERATION_ENABLED || !invoiceApi) {
        console.info("[markTransferPaid] Invoice generation temporarily disabled; skipping Szamlazz.hu invoice.")
        return
      }

      try {
        const result = await invoiceApi.createInvoiceForApplicationPayment({
          kind: t.kind,
          amount: t.amount,
          currency,
          parent: {
            name: extractBillingName(t.app.notes, t.app.parentName),
            email: t.app.parentEmail,
            postalCode: t.app.parentPostalCode,
            city: t.app.parentCity,
            address: t.app.parentAddress,
            taxNumber: t.app.parentTaxNumber,
          },
          child: { name: t.app.childName },
          camp: {
            city: t.app.camp.city,
            venue: t.app.camp.venue,
            dates: campDates(t.app.camp),
          },
        })
        if (result) {
          await db.paymentEvent.update({
            where: { id: t.paymentEventId },
            data: { invoiceNumber: result.invoiceNumber, invoiceUrl: result.downloadUrl },
          })
        }
      } catch (err) {
        console.error("[markTransferPaid] invoice failed", err)
      }
    }),
  ])

  revalidatePath(`/admin/jelentkezesek/${id}`)
  revalidatePath("/admin/jelentkezesek")
  return { ok: true, updated: newlyDepositPaid.length + newlyFullyPaid.length }
}

export async function sendRemainderLink(id: string, opts: { send: boolean }) {
  const { stripe } = await import("@/lib/stripe")
  const { toStripeUnitAmount, formatPrice: fp } = await import("@/lib/pricing")
  const { sendEmail, renderRemainderEmail } = await import("@/lib/email")

  const app = await db.application.findUnique({ where: { id }, include: { camp: true } })
  if (!app) return { ok: false, error: "Jelentkezés nem található." }
  if (!app.isInstallment) return { ok: false, error: "Nem részletfizetéses." }
  if (app.paymentStatus === "FULLY_PAID") return { ok: false, error: "Már ki van fizetve." }

  const currency = (app.currency as "HUF" | "EUR") || "HUF"
  const remainder = Math.max(0, app.totalAmount - app.depositPaidAmount)
  if (remainder <= 0) return { ok: false, error: "Nincs hátralévő összeg." }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://kickoffcamps.hu"

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: currency === "EUR" ? ["card", "sepa_debit"] : ["card"],
    customer_email: app.parentEmail,
    locale: "hu",
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Hátralévő összeg - ${app.camp.city} - ${app.childName}`,
            description: `${app.camp.venue} • ${app.camp.dates}`,
          },
          unit_amount: toStripeUnitAmount(remainder, currency),
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/jelentkezes/sikeres?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
    metadata: { applicationIds: app.id, paymentMode: "remainder", currency },
    payment_intent_data: {
      metadata: { applicationIds: app.id, paymentMode: "remainder", currency },
    },
  })

  await db.application.update({
    where: { id: app.id },
    data: {
      stripeRemainderPaymentLinkId: session.id,
      stripeRemainderPaymentLinkUrl: session.url,
    },
  })

  await db.paymentEvent.create({
    data: {
      applicationId: app.id,
      type: "link_sent",
      amount: remainder,
      currency,
      stripeId: session.id,
      note: "Hátralévő link (admin)",
    },
  })

  let emailed = false
  let emailError: string | undefined
  if (opts.send && session.url) {
    const { subject, html } = renderRemainderEmail({
      parentName: app.parentName,
      childName: app.childName,
      campCity: app.camp.city,
      campDates: app.camp.dates,
      amount: fp(remainder, currency),
      paymentUrl: session.url,
    })
    const r = await sendEmail({ to: app.parentEmail, subject, html, replyTo: "info@kickoffcamps.hu" })
    emailed = r.sent
    emailError = r.error
    if (emailed) {
      await db.application.update({
        where: { id: app.id },
        data: { remainderReminderSentAt: new Date() },
      })
    }
  }

  revalidatePath(`/admin/jelentkezesek/${id}`)
  return { ok: true, url: session.url, emailed, emailError, amount: remainder, currency }
}

// ─── News ───

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function createNews(formData: FormData) {
  const title = formData.get("title") as string
  await db.news.create({
    data: {
      title,
      slug: slugify(title) + "-" + Date.now().toString(36),
      content: formData.get("content") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
      published: formData.get("published") === "on",
      authorId: formData.get("authorId") as string,
    },
  })
  revalidatePath("/admin/hirek")
  redirect("/admin/hirek")
}

export async function updateNews(id: string, formData: FormData) {
  await db.news.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
      published: formData.get("published") === "on",
    },
  })
  revalidatePath("/admin/hirek")
  redirect("/admin/hirek")
}

export async function deleteNews(id: string) {
  await db.news.delete({ where: { id } })
  revalidatePath("/admin/hirek")
}

// ─── Blog ───

export async function createBlogPost(formData: FormData) {
  const title = formData.get("title") as string
  await db.blogPost.create({
    data: {
      title,
      slug: slugify(title) + "-" + Date.now().toString(36),
      excerpt: (formData.get("excerpt") as string) || "",
      content: formData.get("content") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
      category: (formData.get("category") as string) || "általános",
      published: formData.get("published") === "on",
      authorId: formData.get("authorId") as string,
    },
  })
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  redirect("/admin/blog")
}

export async function updateBlogPost(id: string, formData: FormData) {
  await db.blogPost.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      excerpt: (formData.get("excerpt") as string) || "",
      content: formData.get("content") as string,
      imageUrl: (formData.get("imageUrl") as string) || null,
      category: (formData.get("category") as string) || "általános",
      published: formData.get("published") === "on",
    },
  })
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  redirect("/admin/blog")
}

export async function deleteBlogPost(id: string) {
  await db.blogPost.delete({ where: { id } })
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
}

// ─── Gallery ───

export async function addGalleryImage(formData: FormData) {
  await db.galleryImage.create({
    data: {
      url: formData.get("url") as string,
      alt: formData.get("alt") as string || "",
      category: formData.get("category") as string || "general",
    },
  })
  revalidatePath("/admin/galeria")
  revalidatePath("/galeria")
}

export async function deleteGalleryImage(id: string) {
  await db.galleryImage.delete({ where: { id } })
  revalidatePath("/admin/galeria")
  revalidatePath("/galeria")
}

// ─── Users ───

export async function createUser(formData: FormData) {
  const password = formData.get("password") as string
  await db.user.create({
    data: {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: await hash(password, 12),
      role: formData.get("role") as string,
    },
  })
  revalidatePath("/admin/felhasznalok")
  redirect("/admin/felhasznalok")
}

export async function updateUserRole(id: string, role: string) {
  await db.user.update({ where: { id }, data: { role } })
  revalidatePath("/admin/felhasznalok")
}

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } })
  revalidatePath("/admin/felhasznalok")
}

// ─── Site Content ───

export async function updateSiteContent(
  section: string,
  locale: string,
  content: Record<string, unknown>,
) {
  const json = content as unknown as import("@prisma/client").Prisma.InputJsonValue
  await db.siteContent.upsert({
    where: { section_locale: { section, locale } },
    create: { section, locale, content: json },
    update: { content: json },
  })
  revalidatePath("/", "layout")
  revalidatePath("/admin/tartalom")
}

export async function resetSiteContent(section: string, locale: string) {
  await db.siteContent.deleteMany({ where: { section, locale } })
  revalidatePath("/", "layout")
  revalidatePath("/admin/tartalom")
}

