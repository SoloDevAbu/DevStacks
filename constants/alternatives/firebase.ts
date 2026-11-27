import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const FIREBASE_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "firebase",
  toolName: "Firebase",
  profile: {
    websiteUrl: "https://firebase.google.com",
    bestFor:
      "Google's app platform with Firestore, auth, hosting, cloud functions, push messaging and analytics.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Web, iOS, Android, Flutter, Unity",
  },
  intro:
    "Firebase gives mobile and web apps a NoSQL database, auth, hosting and messaging on Google Cloud, with a free Spark plan and pay-as-you-go Blaze plan. Alternatives either swap Firestore for Postgres (Supabase, Nhost), offer an open-source backend you can self-host (Appwrite, PocketBase, Parse), make the backend reactive TypeScript functions (Convex) or stay with a big cloud (AWS Amplify).",
  stickWith: [
    "You build mobile apps that need offline sync, push notifications and crash reporting.",
    "Your data fits a document model and you are already on Google Cloud.",
    "You want a generous free tier with no servers to manage.",
  ],
  switchWhen: [
    "You need SQL, joins and relational data (Supabase, Nhost).",
    "You want to self-host or avoid lock-in to Google Cloud (Appwrite, PocketBase, Parse).",
    "You want end-to-end TypeScript with reactive queries (Convex).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "Supabase",
      websiteUrl: "https://supabase.com",
      toolSlug: "supabase",
      bestFor:
        "The open-source Postgres backend with auth, storage, realtime, edge functions and auto-generated APIs.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["Postgres", "Open source"],
    },
    {
      name: "Appwrite",
      websiteUrl: "https://appwrite.io",
      bestFor:
        "A BSD-licensed backend with databases, auth, storage, functions, messaging and site hosting.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["Self-hosted", "All-in-one"],
    },
    {
      name: "Convex",
      websiteUrl: "https://www.convex.dev",
      bestFor:
        "A reactive backend where queries and mutations are TypeScript functions and clients update in realtime.",
      license: "Source Available",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["TypeScript", "Realtime"],
    },
    {
      name: "PocketBase",
      websiteUrl: "https://pocketbase.io",
      bestFor:
        "A single Go binary with an embedded SQLite database, auth, file storage and an admin UI.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Windows",
      tags: ["Single binary", "SQLite"],
    },
    {
      name: "AWS Amplify",
      websiteUrl: "https://aws.amazon.com/amplify",
      bestFor:
        "AWS's framework and hosting for full-stack web and mobile apps backed by Cognito, AppSync and DynamoDB.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Web, iOS, Android, Flutter",
      tags: ["AWS", "Full-stack"],
    },
    {
      name: "Nhost",
      websiteUrl: "https://nhost.io",
      bestFor:
        "An open-source backend with Postgres, Hasura GraphQL, auth and storage.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["Postgres", "GraphQL"],
    },
    {
      name: "Parse Platform",
      websiteUrl: "https://parseplatform.org",
      bestFor:
        "The open-source Parse Server backend, originally from Facebook, with SDKs for most platforms.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted, Node.js",
      tags: ["Self-hosted", "Node.js"],
    },
  ],
}
