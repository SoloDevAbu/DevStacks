import type { ToolPairNotes } from "@/types/alternatives"

export const DOCKER_PAIRS: ToolPairNotes = {
  podman: {
    verdict:
      "Podman runs the same OCI images with a near-identical CLI but has no central daemon and runs rootless by default. Docker has the larger ecosystem: Docker Desktop, Compose, Hub and Build Cloud.",
    chooseTool: [
      "Your team uses Docker Desktop, Compose files or Docker Hub automation every day.",
      "CI and documentation assume the Docker socket and daemon.",
    ],
    chooseAlternative: [
      "You want daemonless, rootless containers on shared or locked-down Linux hosts.",
      "You want Kubernetes-style pods locally or systemd integration through Quadlet.",
    ],
  },
  containerd: {
    verdict:
      "containerd is the runtime that sits underneath Docker Engine and most Kubernetes clusters. Docker adds the developer tooling on top: build, Compose, a friendly CLI and Desktop.",
    chooseTool: [
      "Developers build and run containers by hand on laptops and CI runners.",
      "You need image builds, Compose and a full developer workflow.",
    ],
    chooseAlternative: [
      "You only need a container runtime for Kubernetes nodes (CRI).",
      "You want the smallest runtime surface without the Docker daemon.",
    ],
  },
  orbstack: {
    verdict:
      "OrbStack replaces Docker Desktop on macOS and runs the same Docker CLI and images, with lower memory use, fast startup and built-in Linux machines. Docker Desktop runs on macOS, Windows and Linux and ships extensions and Docker's own subscriptions.",
    chooseTool: [
      "Your team works across Windows, Linux and macOS and wants one desktop app.",
      "Your organisation already pays for a Docker subscription.",
    ],
    chooseAlternative: [
      "You develop on a Mac and want faster file sharing and lower battery and RAM use.",
      "You want lightweight Linux VMs next to your containers.",
    ],
  },
  colima: {
    verdict:
      "Colima is a free, open-source command-line VM that provides a Docker (or containerd) runtime on macOS and Linux. Docker Desktop adds a GUI, extensions and vendor support under its subscription terms.",
    chooseTool: [
      "You want a GUI, extensions and vendor support.",
      "Your team is on Windows as well as macOS.",
    ],
    chooseAlternative: [
      "You want a free, scriptable Docker runtime on macOS without Docker Desktop licensing.",
      "You are happy configuring CPU, memory and the runtime from the terminal.",
    ],
  },
}

export const REDIS_PAIRS: ToolPairNotes = {
  valkey: {
    verdict:
      "Valkey is the Linux Foundation fork of Redis 7.2 under the BSD licence, with the same protocol and commands for most workloads. Redis continues with new features such as Redis Stack modules, under its own licences, including AGPLv3 since Redis 8.",
    chooseTool: [
      "You rely on Redis Stack features such as search, JSON or time series, or on Redis Cloud.",
      "Your licence review already approved Redis.",
    ],
    chooseAlternative: [
      "You want a permissively licensed drop-in for caching, sessions and queues.",
      "Your cloud provider offers managed Valkey at a lower price than managed Redis.",
    ],
  },
  memcached: {
    verdict:
      "Memcached is a simple, multithreaded key-value cache. Redis adds rich data structures (lists, sets, sorted sets, streams), persistence, replication and pub/sub.",
    chooseTool: [
      "You need data structures, persistence, pub/sub or queues as well as caching.",
      "You want one in-memory store for sessions, rate limits and leaderboards.",
    ],
    chooseAlternative: [
      "You only need a volatile cache of strings or blobs.",
      "You want very simple multithreaded scaling on large cache nodes.",
    ],
  },
  dragonfly: {
    verdict:
      "Dragonfly is a multithreaded, Redis- and Memcached-compatible store designed to use every core of one large machine. Redis is single-threaded per shard and scales out with clustering, with a far larger ecosystem.",
    chooseTool: [
      "You need the full Redis module ecosystem or a mature cluster mode.",
      "Your workload already scales well across Redis shards.",
    ],
    chooseAlternative: [
      "One Redis instance is CPU-bound and you would rather scale up than shard.",
      "You can accept Dragonfly's source-available BSL licence.",
    ],
  },
  keydb: {
    verdict:
      "KeyDB is a multithreaded fork of Redis with active-active replication between replicas. Redis has a much more active release cadence and ecosystem.",
    chooseTool: [
      "You want ongoing feature releases, Redis Stack and managed offerings.",
      "Compatibility with the latest Redis commands matters.",
    ],
    chooseAlternative: [
      "You need active-active replicas that both accept writes.",
      "You want multithreading in a Redis fork and accept slower upstream development.",
    ],
  },
}

export const CLOUDFLARE_PAIRS: ToolPairNotes = {
  fastly: {
    verdict:
      "Fastly is a programmable CDN known for instant purging, VCL and Compute (WebAssembly) at the edge. Cloudflare bundles CDN, DNS, DDoS protection, Zero Trust and Workers, with a generous free plan.",
    chooseTool: [
      "You want CDN, DNS, security and serverless in one account, starting free.",
      "You build on Workers, R2, D1 or Durable Objects.",
    ],
    chooseAlternative: [
      "You need fine-grained cache control and near-instant purges for media or news sites.",
      "You want WebAssembly-based edge compute with enterprise support contracts.",
    ],
  },
  "amazon-cloudfront": {
    verdict:
      "Amazon CloudFront is AWS's CDN, tightly integrated with S3, ALB, Lambda@Edge and AWS billing. Cloudflare is provider-neutral and adds DNS, security and Workers on a flat-priced plan.",
    chooseTool: [
      "Your origin is spread across providers, or you want flat pricing without per-GB egress charges.",
      "You want DDoS protection, WAF and DNS included.",
    ],
    chooseAlternative: [
      "Your stack already lives in AWS and you want IAM, S3 origins and one bill.",
      "You use Lambda@Edge or CloudFront Functions in existing infrastructure.",
    ],
  },
  akamai: {
    verdict:
      "Akamai is the oldest large CDN and security provider, sold mostly through enterprise contracts. Cloudflare offers self-serve plans from free to enterprise, with a developer platform on top.",
    chooseTool: [
      "You want self-serve onboarding, transparent plans and a developer platform.",
      "You are a startup or mid-size team without an enterprise procurement process.",
    ],
    chooseAlternative: [
      "You are a large enterprise that needs managed services and long-term contracts.",
      "You need Akamai-specific media delivery or security products.",
    ],
  },
  bunnynet: {
    verdict:
      "Bunny.net is a low-cost, pay-as-you-go CDN with storage, video streaming and edge scripting. Cloudflare covers more ground (DNS, Zero Trust, WAF, Workers) and has a free plan with no bandwidth bill.",
    chooseTool: [
      "You need security features and serverless alongside the CDN.",
      "You want unmetered bandwidth on the free or Pro plans.",
    ],
    chooseAlternative: [
      "You want simple per-GB pricing for static assets and video.",
      "You need built-in storage zones and video streaming at a low cost.",
    ],
  },
}

export const VERCEL_PAIRS: ToolPairNotes = {
  netlify: {
    verdict:
      "Netlify pioneered Git-based Jamstack hosting and supports many frameworks with functions, forms and edge functions. Vercel builds Next.js and gives it first-class support, with preview deployments and fluid compute.",
    chooseTool: [
      "You build with Next.js and want features such as ISR and middleware to work on day one.",
      "You want Vercel's preview comments, analytics and v0 integration.",
    ],
    chooseAlternative: [
      "You use Astro, Hugo, Gatsby or other frameworks and want framework-neutral hosting.",
      "You want built-in forms and identity for marketing sites.",
    ],
  },
  cloudflare: {
    verdict:
      "Cloudflare Workers and Pages run code on Cloudflare's edge network with very low cold starts and inexpensive bandwidth. Vercel offers a more managed developer experience centred on Next.js.",
    chooseTool: [
      "You want zero-config Next.js hosting and preview deployments with little setup.",
      "Your team values Vercel's dashboard and integrations over raw cost.",
    ],
    chooseAlternative: [
      "You want low cost at scale and edge execution close to users.",
      "You also use R2, D1, KV or Durable Objects (Next.js runs through OpenNext).",
    ],
  },
  render: {
    verdict:
      "Render hosts long-running web services, background workers, cron jobs and managed Postgres alongside static sites. Vercel focuses on frontend frameworks and serverless functions.",
    chooseTool: [
      "Your app is a frontend or Next.js project that fits serverless functions.",
      "You want edge middleware and per-branch previews out of the box.",
    ],
    chooseAlternative: [
      "You need always-on servers, WebSockets, workers or a managed database next to your app.",
      "You deploy Docker images or non-JavaScript back ends.",
    ],
  },
  railway: {
    verdict:
      "Railway deploys any service, database or Docker image from a visual project canvas, with usage-based pricing. Vercel is specialised for frontend frameworks and serverless.",
    chooseTool: [
      "You mainly ship Next.js or other frontend apps.",
      "You want Vercel's CDN, edge features and preview workflow.",
    ],
    chooseAlternative: [
      "You run back ends, workers, Postgres or Redis together in one project.",
      "You want to deploy long-running containers with simple usage-based billing.",
    ],
  },
}

export const GITHUB_PAIRS: ToolPairNotes = {
  gitlab: {
    verdict:
      "GitLab is a single DevSecOps application with built-in CI/CD, registry, security scanning and planning, available as SaaS or self-managed. GitHub has the largest developer community and open-source ecosystem, with Actions and Copilot.",
    chooseTool: [
      "You want open-source visibility, community contributions and the Actions marketplace.",
      "Your developers already live in GitHub and use Copilot.",
    ],
    chooseAlternative: [
      "You want one self-hosted platform for code, CI/CD, security and planning.",
      "You need a self-managed edition with the free Community Edition as a base.",
    ],
  },
  bitbucket: {
    verdict:
      "Bitbucket is Atlassian's Git hosting with Pipelines and close integration with Jira and Confluence. GitHub has a broader ecosystem and community.",
    chooseTool: [
      "You want the biggest integration marketplace and open-source reach.",
      "You prefer GitHub Actions and Copilot.",
    ],
    chooseAlternative: [
      "Your team plans work in Jira and documents in Confluence.",
      "You want an Atlassian bundle under one admin and billing.",
    ],
  },
  gitea: {
    verdict:
      "Gitea is a lightweight, self-hosted Git service written in Go, with pull requests, issues, packages and Actions-compatible CI. GitHub is a hosted platform with far more features and integrations.",
    chooseTool: [
      "You want a managed service with no servers to maintain.",
      "Community, discovery and integrations matter for your project.",
    ],
    chooseAlternative: [
      "You must self-host code on your own hardware with minimal resources.",
      "You want an MIT-licensed forge you control fully.",
    ],
  },
  "azure-devops": {
    verdict:
      "Azure DevOps bundles Repos, Pipelines, Boards, Test Plans and Artifacts for Microsoft-centric enterprises. GitHub, also owned by Microsoft, is where new developer features such as Copilot land first.",
    chooseTool: [
      "You want modern pull-request workflows, Actions and Copilot.",
      "You collaborate with open-source contributors.",
    ],
    chooseAlternative: [
      "Your organisation already standardised on Azure Boards, Pipelines and Test Plans.",
      "You need tight integration with Azure and Active Directory-based processes.",
    ],
  },
}
