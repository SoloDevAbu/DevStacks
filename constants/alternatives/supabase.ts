import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const SUPABASE_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "supabase",
  toolName: "Supabase",
  intro:
    "Supabase is an open-source backend built on Postgres, with auth, storage, realtime, edge functions and auto-generated APIs. Alternatives either keep Postgres but drop the platform (Neon, Nhost), swap in a document model (Firebase, Appwrite) or shrink the backend to a single binary (PocketBase).",
  stickWith: [
    "You want Postgres with row-level security plus auth and storage in one project.",
    "You value being able to self-host the same stack later.",
    "Your team is comfortable writing SQL and Postgres policies.",
  ],
  switchWhen: [
    "You only need serverless Postgres with branching (Neon).",
    "You prefer a NoSQL, mobile-first backend with offline sync (Firebase).",
    "You want a tiny self-hosted backend for a side project (PocketBase, Appwrite).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Firebase",
      websiteUrl: "https://firebase.google.com",
      bestFor:
        "Google's mobile-first backend with Firestore, auth, hosting and offline sync.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Web, iOS, Android",
      tags: ["NoSQL", "Mobile"],
    },
    {
      name: "Neon",
      websiteUrl: "https://neon.com",
      toolSlug: "neon",
      bestFor:
        "Serverless Postgres with autoscaling, scale to zero and instant database branching.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Serverless",
      tags: ["Postgres", "Branching"],
    },
    {
      name: "Appwrite",
      websiteUrl: "https://appwrite.io",
      bestFor:
        "An open-source backend with auth, databases, storage and functions, cloud or self-hosted.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Cloud, Self-hosted",
      tags: ["BaaS", "Self-hosted"],
    },
    {
      name: "PocketBase",
      websiteUrl: "https://pocketbase.io",
      bestFor:
        "A single-file Go backend with SQLite, auth, files and realtime for small apps.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Self-hosted",
      tags: ["SQLite", "Single binary"],
    },
    {
      name: "Nhost",
      websiteUrl: "https://nhost.io",
      bestFor:
        "Postgres with an instant GraphQL API, auth and storage, open source and hosted.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["GraphQL", "Postgres"],
    },
    {
      name: "AWS Amplify",
      websiteUrl: "https://aws.amazon.com/amplify",
      bestFor:
        "Full-stack backends on AWS services for teams already invested in AWS.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "AWS",
      tags: ["AWS", "Full-stack"],
    },
  ],
}
