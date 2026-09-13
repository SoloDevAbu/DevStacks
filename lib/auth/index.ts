import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      ...schema,
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
      users: schema.users,
      sessions: schema.sessions,
      accounts: schema.accounts,
      verifications: schema.verifications,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          let username = (user as Record<string, unknown>).username as
            string | undefined
          if (!username) {
            const base = (
              (user.name as string | undefined) || user.email.split("@")[0]
            )
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
              .slice(0, 18)
            const randomSuffix = Math.random().toString(36).substring(2, 6)
            username = `${base || "maker"}_${randomSuffix}`
          }

          let country = (user as Record<string, unknown>).country as
            string | undefined
          if (!country) {
            try {
              const { headers } = await import("next/headers")
              const reqHeaders = await headers()
              const headerCountry =
                reqHeaders.get("x-vercel-ip-country") ||
                reqHeaders.get("cf-ipcountry")
              if (headerCountry && headerCountry.length === 2) {
                country = headerCountry.toUpperCase()
              }
            } catch {
              // headers() might not be available during non-request execution
            }
          }

          return {
            data: {
              ...user,
              username,
              ...(country ? { country } : {}),
            },
          }
        },
      },
    },
  },
  user: {
    additionalFields: {
      avatarUrl: {
        type: "string",
        required: false,
        fieldName: "avatar_url",
      },
      username: {
        type: "string",
        required: false,
        fieldName: "username",
      },
      bio: {
        type: "string",
        required: false,
        fieldName: "bio",
      },
      description: {
        type: "string",
        required: false,
        fieldName: "description",
      },
      country: {
        type: "string",
        required: false,
        fieldName: "country",
      },
      state: {
        type: "string",
        required: false,
        fieldName: "state",
      },
      websiteUrl: {
        type: "string",
        required: false,
        fieldName: "website_url",
      },
      twitterUrl: {
        type: "string",
        required: false,
        fieldName: "twitter_url",
      },
      githubUrl: {
        type: "string",
        required: false,
        fieldName: "github_url",
      },
      linkedinUrl: {
        type: "string",
        required: false,
        fieldName: "linkedin_url",
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
