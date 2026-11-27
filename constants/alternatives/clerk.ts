import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const CLERK_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "clerk",
  toolName: "Clerk",
  profile: {
    websiteUrl: "https://clerk.com",
    bestFor:
      "Hosted authentication and user management with drop-in React components, organisations and billing.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Web, iOS, Android",
  },
  intro:
    "Clerk sells hosted auth with prebuilt UI components and is free for the first 50,000 monthly retained users per app. Alternatives either keep auth hosted with different strengths (Auth0 for enterprise identity, WorkOS for B2B SSO, Kinde and Stytch for startups), bundle it with your database (Supabase Auth, Firebase Authentication) or move it into your own code and database (Better Auth, Keycloak).",
  stickWith: [
    "You build with Next.js or React and want sign-in, profile and organisation UI without designing it.",
    "Your app has fewer than 50,000 monthly retained users, so auth costs nothing.",
    "You want B2B organisations, roles and subscription billing from one vendor.",
  ],
  switchWhen: [
    "You want users stored in your own database with no per-user fees (Better Auth, Keycloak).",
    "You already use Supabase or Firebase and want auth in the same project (Supabase Auth, Firebase Authentication).",
    "You sell to enterprises that require SAML SSO and SCIM at scale (WorkOS, Auth0).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "Auth0",
      websiteUrl: "https://auth0.com",
      bestFor:
        "Okta's customer identity platform with universal login, enterprise connections and a free plan up to 25,000 MAU.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, iOS, Android",
      tags: ["Enterprise identity", "Okta"],
    },
    {
      name: "Better Auth",
      websiteUrl: "https://www.better-auth.com",
      bestFor:
        "An MIT-licensed TypeScript auth library that stores users in your own database and now maintains Auth.js.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Web, Node.js, Bun",
      tags: ["Library", "Self-hosted"],
    },
    {
      name: "WorkOS AuthKit",
      websiteUrl: "https://workos.com/authkit",
      bestFor:
        "Hosted auth that is free up to 1 million monthly active users, with paid SAML SSO and directory sync for B2B.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web",
      tags: ["B2B SSO", "SCIM"],
    },
    {
      name: "Supabase Auth",
      websiteUrl: "https://supabase.com/auth",
      toolSlug: "supabase",
      bestFor:
        "Open-source auth built into Supabase, tied to Postgres row-level security.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, iOS, Android",
      tags: ["Postgres", "Row-level security"],
    },
    {
      name: "Firebase Authentication",
      websiteUrl: "https://firebase.google.com/products/auth",
      toolSlug: "firebase",
      bestFor:
        "Google's auth service with social, phone and anonymous sign-in for Firebase and mobile apps.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, iOS, Android",
      tags: ["Mobile", "Google"],
    },
    {
      name: "Kinde",
      websiteUrl: "https://kinde.com",
      bestFor:
        "Auth, feature flags and billing for SaaS, with a free plan up to 10,500 monthly active users.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, iOS, Android",
      tags: ["SaaS", "Feature flags"],
    },
    {
      name: "Stytch",
      websiteUrl: "https://stytch.com",
      bestFor:
        "API-first passwordless auth, B2B organisations and fraud prevention, free up to 10,000 monthly active users.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, iOS, Android",
      tags: ["Passwordless", "Fraud prevention"],
    },
    {
      name: "Keycloak",
      websiteUrl: "https://www.keycloak.org",
      bestFor:
        "A CNCF open-source identity server with SSO, OpenID Connect, SAML and user federation that you host yourself.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted",
      tags: ["Self-hosted", "SAML"],
    },
  ],
}
