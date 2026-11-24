import { DOMAIN_RATING_API } from "@/constants/free-tools"
import { mutedText, inlineTextLink } from "@/utils/styles"

// Ahrefs' Domain Rating licence requires this credit, with a working link, next to every DR value.
export const DomainRatingAttribution = () => (
  <p className={mutedText}>
    {DOMAIN_RATING_API.ATTRIBUTION_PREFIX}{" "}
    <a
      href={DOMAIN_RATING_API.ATTRIBUTION_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={inlineTextLink}
    >
      {DOMAIN_RATING_API.ATTRIBUTION_NAME}
    </a>
  </p>
)
