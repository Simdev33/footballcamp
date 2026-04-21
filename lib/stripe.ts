import Stripe from "stripe"

const key = process.env.STRIPE_SECRET_KEY

if (!key) {
  // Don't throw at import time; allow non-Stripe pages/builds to keep
  // working. The error will surface only when an actual Stripe call runs.
  console.warn("[stripe] STRIPE_SECRET_KEY is not set — Stripe endpoints will fail until configured.")
}

export const stripe = new Stripe(key || "sk_test_missing", {
  typescript: true,
  appInfo: {
    name: "KickOff Camps",
    url: "https://kickoffcamps.hu",
  },
})

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ""
