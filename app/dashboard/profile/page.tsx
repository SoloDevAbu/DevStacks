import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getCurrentUserProfile } from "@/db/queries/users/get-profile"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { ROUTES } from "@/constants/routes"
import type { MakerProfile } from "@/types/entities"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: `Maker Profile Settings — ${SITE_CONFIG.name}`,
  description:
    "Manage your public maker identity, bio, social links, and maker FAQs.",
  robots: {
    index: false,
    follow: false,
  },
}

const DashboardProfilePage = async () => {
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
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <DashboardNav activeTab="profile" username={profile.username} />
      <ProfileForm initialProfile={initialProfile} />
    </div>
  )
}

export default DashboardProfilePage

