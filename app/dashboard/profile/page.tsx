import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getCurrentUserProfile } from "@/db/queries/users/get-profile"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { ROUTES } from "@/constants/routes"
import type { MakerProfile } from "@/types/entities"

export const metadata: Metadata = {
  title: "Maker Profile Settings — DevStacks",
  description:
    "Manage your public maker identity, bio, social links, and maker FAQs.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardProfilePage() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session?.user?.id) {
    redirect(ROUTES.HOME)
  }

  const profile = await getCurrentUserProfile(session.user.id)

  if (!profile) {
    redirect(ROUTES.HOME)
  }

  const initialProfile: MakerProfile = {
    id: profile.id,
    name: profile.name,
    username: profile.username ?? "",
    email: profile.email,
    avatarUrl: profile.avatarUrl ?? profile.image,
    image: profile.image,
    bio: profile.bio,
    description: profile.description,
    country: profile.country,
    state: profile.state,
    websiteUrl: profile.websiteUrl,
    twitterUrl: profile.twitterUrl,
    githubUrl: profile.githubUrl,
    linkedinUrl: profile.linkedinUrl,
    createdAt: profile.createdAt,
    faqs: profile.faqs ?? [],
    tools: [],
    products: [],
    toolsCount: 0,
    productsCount: 0,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-dashed border-border bg-linear-to-b from-slate-50/80 via-white to-white px-6 py-8 md:px-8 md:py-10">
        <div className="max-w-4xl">
          <p className="font-mono text-xs font-bold tracking-widest text-[#a06138] uppercase">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            Maker Profile Settings
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 md:text-sm">
            Configure your public profile, developer identity, personal FAQs,
            and social links.
          </p>
        </div>
      </div>

      <div className="px-6 py-8 md:px-8 md:py-10">
        <div className="max-w-4xl">
          <ProfileForm initialProfile={initialProfile} />
        </div>
      </div>
    </div>
  )
}
