import Link from "next/link"
import { HOME_ABOUT } from "@/constants/about"
import { ROUTES } from "@/constants/routes"
import { SectionHeader } from "@/components/shared/section-header"
import { homeAboutSection, proseParagraph } from "@/utils/styles"

export const HomeAboutSection = () => (
  <section className="flex w-full flex-col">
    <SectionHeader title={HOME_ABOUT.title} />
    <div className={homeAboutSection}>
      {HOME_ABOUT.paragraphs.map((paragraph) => (
        <p key={paragraph} className={proseParagraph}>
          {paragraph}
        </p>
      ))}
      <Link
        href={ROUTES.ABOUT}
        className="text-xs font-semibold text-indigo-600 hover:underline"
      >
        {HOME_ABOUT.linkLabel} →
      </Link>
    </div>
  </section>
)
