import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const CLOUDFLARE_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "cloudflare",
  toolName: "Cloudflare",
  profile: {
    websiteUrl: "https://www.cloudflare.com",
    bestFor:
      "A global edge network for CDN, DNS, DDoS protection, Zero Trust access and Workers serverless compute.",
    license: "Commercial",
    pricing: PRICING.FREEMIUM,
    platforms: "Global edge network",
  },
  intro:
    "Cloudflare combines a CDN, DDoS protection, DNS, Zero Trust access and the Workers edge platform behind one account, with a generous free plan. Most alternatives cover one of those jobs: CDN and edge compute (Fastly, Akamai, CloudFront, Bunny.net), frontend hosting (Vercel, Netlify, Deno Deploy) or private networking (Tailscale).",
  stickWith: [
    "You use several Cloudflare products together (DNS, CDN, WAF, Workers, R2).",
    "The free plan's unmetered DDoS protection and CDN cover your traffic.",
    "Your app already runs on Workers, Durable Objects or R2.",
  ],
  switchWhen: [
    "You need enterprise CDN contracts or edge compute in another language model (Fastly, Akamai).",
    "Your stack already lives on AWS and you want one bill (CloudFront).",
    "You want git-based frontend hosting with framework-aware builds (Vercel, Netlify) or simple private networking (Tailscale).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Fastly",
      websiteUrl: "https://www.fastly.com",
      bestFor:
        "A programmable CDN with instant purging and WebAssembly-based edge compute.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Edge, CDN",
      tags: ["CDN", "Edge compute"],
    },
    {
      name: "Amazon CloudFront",
      websiteUrl: "https://aws.amazon.com/cloudfront",
      bestFor:
        "AWS-native CDN with Lambda@Edge and CloudFront Functions, billed with the rest of AWS.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "AWS, CDN",
      tags: ["CDN", "AWS"],
    },
    {
      name: "Akamai",
      websiteUrl: "https://www.akamai.com",
      bestFor:
        "Enterprise CDN, security and cloud computing with one of the largest edge networks.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Edge, CDN, Cloud",
      tags: ["Enterprise", "Security"],
    },
    {
      name: "Bunny.net",
      websiteUrl: "https://bunny.net",
      bestFor:
        "Low-cost, pay-as-you-go CDN, storage and video delivery for smaller teams.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "CDN, Storage",
      tags: ["CDN", "Pay as you go"],
    },
    {
      name: "Vercel",
      websiteUrl: "https://vercel.com",
      toolSlug: "vercel",
      bestFor:
        "Frontend and Next.js hosting with preview deployments and an edge network.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Edge, Serverless",
      tags: ["Hosting", "Next.js"],
    },
    {
      name: "Netlify",
      websiteUrl: "https://www.netlify.com",
      bestFor:
        "Git-based hosting for static sites and frontend frameworks with serverless functions.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Edge, Serverless",
      tags: ["Hosting", "Jamstack"],
    },
    {
      name: "Deno Deploy",
      websiteUrl: "https://deno.com/deploy",
      bestFor:
        "Running TypeScript and JavaScript at the edge on the Deno runtime.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Edge",
      tags: ["Edge functions", "TypeScript"],
    },
    {
      name: "Tailscale",
      websiteUrl: "https://tailscale.com",
      bestFor:
        "Zero-trust private networking between devices and servers, built on WireGuard.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Linux, macOS, Windows, iOS, Android",
      tags: ["Zero Trust", "VPN"],
    },
  ],
}
