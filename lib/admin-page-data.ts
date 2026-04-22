import {
  SITE_IMAGE_LABELS,
  SITE_IMAGE_DEFAULTS,
  type SiteImageKey,
  type SiteImageGroupId,
  type SiteImageOverrides,
} from "./site-images"

/**
 * Maps admin content pages (from ContentEditor) to the image group(s) they should show.
 * Pages not listed here have no images.
 */
const PAGE_TO_IMAGE_GROUPS: Record<string, SiteImageGroupId[]> = {
  home: ["home", "jelentkezes"],
  helyszinek: ["taborok", "jelentkezes"],
  klubok: ["klubok"],
  partner: ["partnerprogram"],
}

export function getImagesForAdminPage(
  pageId: string,
  overrides: SiteImageOverrides,
) {
  const groups = PAGE_TO_IMAGE_GROUPS[pageId] || []
  const allKeys = Object.keys(SITE_IMAGE_DEFAULTS) as SiteImageKey[]
  return allKeys
    .filter((key) => groups.includes(SITE_IMAGE_LABELS[key].group))
    .map((key) => ({
      key,
      title: SITE_IMAGE_LABELS[key].title,
      where: SITE_IMAGE_LABELS[key].where,
      defaultUrl: SITE_IMAGE_DEFAULTS[key],
      currentUrl: overrides[key] || "",
    }))
}
