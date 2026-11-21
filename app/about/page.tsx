import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { ABOUT_PAGE } from "@/constants/about"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  aboutPageSchema,
  breadcrumbSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { toAbsoluteUrl } from "@/utils/urls"
import {
  aboutSectionBlock,
  aboutSectionTitle,
  proseParagraph,
} from "@/utils/styles"

const ABOUT_URL = toAbsoluteUrl(ROUTES.ABOUT)

export const metadata: Metadata = {
  title: ABOUT_PAGE.title,
  description: ABOUT_PAGE.description,
  alternates: { canonical: ABOUT_URL },
  openGraph: {
    title: `${ABOUT_PAGE.title} | ${SITE_CONFIG.name}`,
    description: ABOUT_PAGE.description,
    type: "website",
    url: ABOUT_URL,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImageUrl, width: 1200, height: 630 }],
  },
}

const AboutPage = () => {
  const { founder } = ABOUT_PAGE
  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "About", url: ABOUT_URL },
    ]),
    aboutPageSchema({
      name: ABOUT_PAGE.title,
      url: ABOUT_URL,
      description: ABOUT_PAGE.description,
      founderBio: founder.bio,
    }),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageBreadcrumb
          items={[{ name: "Home", href: ROUTES.HOME }, { name: "About" }]}
        />
        <PageHeader
          heading={ABOUT_PAGE.heading}
          description={ABOUT_PAGE.description}
        />

        {ABOUT_PAGE.sections.map((section) => (
          <section key={section.title} className={aboutSectionBlock}>
            <h2 className={aboutSectionTitle}>{section.title}</h2>
            <p className={proseParagraph}>{section.body}</p>
          </section>
        ))}

        <section className={aboutSectionBlock}>
          <h2 className={aboutSectionTitle}>Who runs {SITE_CONFIG.name}</h2>
          <p className="text-sm font-semibold text-slate-900">
            {founder.name}{" "}
            <span className="font-normal text-slate-500">· {founder.role}</span>
          </p>
          <p className={proseParagraph}>{founder.bio}</p>
          <ul className="flex flex-wrap gap-4 text-xs font-medium">
            {founder.sameAs.map((href) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {new URL(href).hostname.replace(/^www\./, "")}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${SITE_CONFIG.supportEmail}`}
                className="text-indigo-600 hover:underline"
              >
                {ABOUT_PAGE.contactLabel}: {SITE_CONFIG.supportEmail}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}

export default AboutPage
