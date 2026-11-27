import { DASHBOARD_LISTING_PARAMS, ROUTES } from "@/constants/routes"
import { EMAIL_FALLBACK } from "@/constants/email"
import { getListingPath, toAbsoluteUrl } from "@/utils/urls"
import { formatWeekLabel } from "@/utils/iso-weeks"
import type { LaunchItemType } from "@/constants/launches"

export interface EmailListing {
  itemType: LaunchItemType
  name: string
  slug: string
  launchYear?: number | null
  launchWeek?: number | null
}

type DashboardListingParam =
  (typeof DASHBOARD_LISTING_PARAMS)[keyof typeof DASHBOARD_LISTING_PARAMS]

export const getPublicListingUrl = ({ itemType, slug }: EmailListing) =>
  toAbsoluteUrl(getListingPath({ itemKind: itemType, slug }))

export const getDashboardListingsUrl = (
  { itemType, slug }: EmailListing,
  param?: DashboardListingParam
) => {
  const path = itemType === "tool" ? ROUTES.DASHBOARD_TOOLS : ROUTES.DASHBOARD_PRODUCTS
  const query = param ? `?${new URLSearchParams({ [param]: slug })}` : ""
  return toAbsoluteUrl(`${path}${query}`)
}

export const getListingEditUrl = ({ itemType, slug }: EmailListing) =>
  toAbsoluteUrl(
    itemType === "tool" ? ROUTES.DASHBOARD_TOOL_EDIT(slug) : ROUTES.DASHBOARD_PRODUCT_EDIT(slug)
  )

export const formatEmailLaunchWeek = ({ launchYear, launchWeek }: EmailListing) =>
  launchYear && launchWeek
    ? `${formatWeekLabel(launchYear, launchWeek)}, ${launchYear}`
    : EMAIL_FALLBACK.LAUNCH_WEEK
