import { Award } from "lucide-react"
import { FEATURED_BADGES } from "@/constants/featured-badges"
import {
  featuredOnSection,
  featuredOnLabel,
  featuredOnMarqueeWrapper,
  featuredOnMarqueeTrack,
  featuredOnMarqueeFadeLeft,
  featuredOnMarqueeFadeRight,
  featuredOnBadgeLink,
  featuredOnBadgeImage,
} from "@/utils/styles"

type Badge = (typeof FEATURED_BADGES)[number]

const BadgeImage = ({ badge }: { badge: Badge }) => (
  <img
    src={badge.src}
    alt={badge.alt}
    width={badge.width}
    height={badge.height}
    loading="lazy"
    decoding="async"
    className={featuredOnBadgeImage}
  />
)

// Reciprocal "featured on" badges live on the homepage only (where those directories verify them).
// The marquee's second copy exists only for the seamless loop, so it carries images, not links,
// keeping each outbound link on the page once.
export const FeaturedOnStrip = () => (
  <section aria-labelledby="featured-on-heading" className={featuredOnSection}>
    <div className="flex shrink-0 items-center gap-2">
      <Award className="size-3.5 text-amber-600" />
      <h2 id="featured-on-heading" className={featuredOnLabel}>
        Featured on
      </h2>
    </div>

    <div className={featuredOnMarqueeWrapper}>
      <div className={featuredOnMarqueeFadeLeft} />
      <div className={featuredOnMarqueeFadeRight} />

      <div className={featuredOnMarqueeTrack}>
        {FEATURED_BADGES.map((badge) => (
          <a
            key={badge.id}
            href={badge.href}
            target={badge.target}
            rel={badge.rel}
            title={badge.title}
            className={featuredOnBadgeLink}
          >
            <BadgeImage badge={badge} />
          </a>
        ))}
      </div>

      <div aria-hidden="true" className={featuredOnMarqueeTrack}>
        {FEATURED_BADGES.map((badge) => (
          <span key={badge.id} className={featuredOnBadgeLink}>
            <BadgeImage badge={badge} />
          </span>
        ))}
      </div>
    </div>
  </section>
)
