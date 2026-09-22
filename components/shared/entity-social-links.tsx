import Image from "next/image"
import { SOCIAL_LINK_CONFIGS } from "@/constants/socials"
import { getOutboundUrl, getLinkRel } from "@/utils/urls"
import { socialIconButton, socialIconImage } from "@/utils/styles"
import { cn } from "@/lib/utils"

export interface EntitySocialLinksProps {
  websiteUrl?: string | null
  githubUrl?: string | null
  twitterUrl?: string | null
  linkedinUrl?: string | null
  discordUrl?: string | null
  appStoreUrl?: string | null
  playStoreUrl?: string | null
  chromeExtensionUrl?: string | null
  tier?: string | null
  className?: string
}

export const EntitySocialLinks = ({
  websiteUrl,
  githubUrl,
  twitterUrl,
  linkedinUrl,
  discordUrl,
  appStoreUrl,
  playStoreUrl,
  chromeExtensionUrl,
  tier,
  className,
}: EntitySocialLinksProps) => {
  const urlMap: Record<string, string | null | undefined> = {
    websiteUrl,
    githubUrl,
    twitterUrl,
    linkedinUrl,
    discordUrl,
    appStoreUrl,
    playStoreUrl,
    chromeExtensionUrl,
  }

  const activeLinks = SOCIAL_LINK_CONFIGS.filter(
    (config) => typeof urlMap[config.key] === "string" && Boolean(urlMap[config.key]?.trim())
  )

  if (activeLinks.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {activeLinks.map((config) => {
        const rawUrl = urlMap[config.key]!.trim()
        const isWebsite = config.key === "websiteUrl"
        const href = isWebsite ? getOutboundUrl(rawUrl, "launchnests") : rawUrl
        const rel = isWebsite ? getLinkRel(tier) : "noopener noreferrer nofollow"

        return (
          <a
            key={config.key}
            href={href}
            target="_blank"
            rel={rel}
            className={socialIconButton}
            title={config.title}
            aria-label={config.label}
          >
            <Image
              src={config.logo}
              alt={config.label}
              width={16}
              height={16}
              className={socialIconImage}
            />
          </a>
        )
      })}
    </div>
  )
}
