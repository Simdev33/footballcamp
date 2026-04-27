const HU_MONTHS = [
  "január",
  "február",
  "március",
  "április",
  "május",
  "június",
  "július",
  "augusztus",
  "szeptember",
  "október",
  "november",
  "december",
]

const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function toValidDate(value: Date | string | null | undefined) {
  if (!value) return null
  const date = typeof value === "string" ? new Date(value) : value
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatEarlyBirdLabel({
  earlyBirdUntil,
  fallbackLabel,
  locale,
}: {
  earlyBirdUntil?: Date | string | null
  fallbackLabel: string
  locale: "hu" | "en"
}) {
  const date = toValidDate(earlyBirdUntil)
  if (!date) return fallbackLabel

  const day = date.getDate()
  const monthIndex = date.getMonth()

  if (locale === "en") {
    return `Early bird price until ${EN_MONTHS[monthIndex]} ${day}`
  }

  return `Early bird ár ${HU_MONTHS[monthIndex].toLocaleUpperCase("hu-HU")} ${day}-ig`
}
