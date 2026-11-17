import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const REDIS_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "redis",
  toolName: "Redis",
  intro:
    "Redis is an in-memory data store used for caching, queues, sessions and pub/sub. Redis moved to source-available licences in 2024 and added an AGPLv3 option with Redis 8, which led many teams to evaluate Valkey, the Linux Foundation fork. Other options trade compatibility for multithreaded performance (Dragonfly, KeyDB, Garnet) or remove servers entirely (Upstash).",
  stickWith: [
    "You use Redis Stack or Redis Cloud features such as search, JSON or time series.",
    "Your licence review already approved Redis for your use.",
    "Your clients depend on behaviour that forks have not matched yet.",
  ],
  switchWhen: [
    "You want a permissively licensed drop-in replacement (Valkey).",
    "One instance is CPU-bound and you need multithreading (Dragonfly, KeyDB, Garnet).",
    "You run on serverless or edge functions and want per-request pricing over HTTP (Upstash).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Valkey",
      websiteUrl: "https://valkey.io",
      bestFor:
        "A BSD-licensed, Linux Foundation fork of Redis that works as a drop-in replacement.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Docker",
      tags: ["Redis fork", "Drop-in"],
    },
    {
      name: "Upstash Redis",
      websiteUrl: "https://upstash.com",
      toolSlug: "upstash",
      bestFor:
        "Serverless, Redis-compatible storage with an HTTP API and per-request pricing.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Serverless, Edge",
      tags: ["Serverless", "HTTP API"],
    },
    {
      name: "Dragonfly",
      websiteUrl: "https://www.dragonflydb.io",
      bestFor:
        "A multithreaded in-memory store compatible with the Redis and Memcached APIs.",
      license: "Source Available",
      pricing: PRICING.FREEMIUM,
      platforms: "Linux, Docker, Cloud",
      tags: ["Multithreaded", "Redis API"],
    },
    {
      name: "KeyDB",
      websiteUrl: "https://docs.keydb.dev",
      bestFor:
        "A multithreaded Redis fork with active replication between replicas.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, Docker",
      tags: ["Redis fork", "Multithreaded"],
    },
    {
      name: "Garnet",
      websiteUrl: "https://microsoft.github.io/garnet",
      bestFor:
        "Microsoft Research's high-throughput cache store that speaks the Redis protocol (RESP).",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, Windows",
      tags: ["RESP", ".NET"],
    },
    {
      name: "Memcached",
      websiteUrl: "https://memcached.org",
      bestFor:
        "Simple, very fast key-value caching when you do not need Redis data structures.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS",
      tags: ["Caching", "Key-value"],
    },
  ],
}
