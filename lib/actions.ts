"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { hash } from "bcryptjs"

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

export async function createCamp(formData: FormData) {
  const city = formData.get("city") as string
  await db.camp.create({
    data: {
      slug: slugify(city) + "-" + Date.now().toString(36),
      city,
      venue: formData.get("venue") as string,
      dates: formData.get("dates") as string,
      price: formData.get("price") as string,
      earlyBirdPrice: formData.get("earlyBirdPrice") as string,
      totalSpots: Number(formData.get("totalSpots")),
      remainingSpots: Number(formData.get("totalSpots")),
      active: formData.get("active") === "on",
      description: (formData.get("description") as string) || "",
      imageUrl: (formData.get("imageUrl") as string) || null,
      clubName: (formData.get("clubName") as string) || "SL Benfica",
      ageRange: (formData.get("ageRange") as string) || "6-15",
      includes: parseStringArray(formData, "includes"),
      gallery: parseStringArray(formData, "gallery"),
      videoUrl: (formData.get("videoUrl") as string) || null,
      mapEmbedUrl: (formData.get("mapEmbedUrl") as string) || null,
      schedule: parseJson(formData, "schedule"),
      coaches: parseJson(formData, "coaches"),
      faq: parseJson(formData, "faq"),
    },
  })
  revalidatePath("/admin/taborok")
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
      price: formData.get("price") as string,
      earlyBirdPrice: formData.get("earlyBirdPrice") as string,
      totalSpots: Number(formData.get("totalSpots")),
      remainingSpots: Number(formData.get("remainingSpots")),
      active: formData.get("active") === "on",
      description: (formData.get("description") as string) || "",
      imageUrl: (formData.get("imageUrl") as string) || null,
      clubName: (formData.get("clubName") as string) || "SL Benfica",
      ageRange: (formData.get("ageRange") as string) || "6-15",
      includes: parseStringArray(formData, "includes"),
      gallery: parseStringArray(formData, "gallery"),
      videoUrl: (formData.get("videoUrl") as string) || null,
      mapEmbedUrl: (formData.get("mapEmbedUrl") as string) || null,
      schedule: parseJson(formData, "schedule"),
      coaches: parseJson(formData, "coaches"),
      faq: parseJson(formData, "faq"),
    },
  })
  revalidatePath("/admin/taborok")
  revalidatePath("/taborok")
  revalidatePath(`/taborok/${camp.slug}`)
  redirect("/admin/taborok")
}

export async function deleteCamp(id: string) {
  await db.camp.delete({ where: { id } })
  revalidatePath("/admin/taborok")
  revalidatePath("/taborok")
}

// ─── Applications ───

export async function createApplication(formData: FormData) {
  const campId = formData.get("campId") as string

  await db.application.create({
    data: {
      parentName: formData.get("parentName") as string,
      parentEmail: formData.get("parentEmail") as string,
      parentPhone: formData.get("parentPhone") as string,
      childName: formData.get("childName") as string,
      childAge: Number(formData.get("childAge")),
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
