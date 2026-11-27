import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const DATADOG_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "datadog",
  toolName: "Datadog",
  profile: {
    websiteUrl: "https://www.datadoghq.com",
    bestFor:
      "A full observability platform for infrastructure metrics, APM, logs, real user monitoring and security, billed per host and per GB.",
    license: "Commercial",
    pricing: PRICING.PAID,
    platforms: "Cloud",
  },
  intro:
    "Datadog covers metrics, traces, logs and more in one SaaS product, priced per host, per GB and per feature, which is why bills grow quickly. Alternatives either keep a single SaaS platform with simpler pricing (New Relic, Honeycomb, Dynatrace), run on open-source and OpenTelemetry (Grafana, Prometheus, SigNoz), or focus on one job such as errors (Sentry).",
  stickWith: [
    "You want one vendor for infrastructure, APM, logs, RUM, synthetics and security.",
    "Your team relies on Datadog's 1,000+ integrations, dashboards and monitors.",
    "The cost is predictable for your host count and data volume.",
  ],
  switchWhen: [
    "Per-host and per-GB pricing grows faster than your infrastructure (New Relic, SigNoz, Grafana Cloud).",
    "You want open-source, self-hosted observability built on OpenTelemetry (Grafana, Prometheus, SigNoz).",
    "You mainly need error tracking or high-cardinality tracing (Sentry, Honeycomb).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "Grafana",
      websiteUrl: "https://grafana.com",
      bestFor:
        "AGPL dashboards plus Loki, Tempo and Mimir for logs, traces and metrics, self-hosted or on Grafana Cloud.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["LGTM stack", "OpenTelemetry"],
    },
    {
      name: "New Relic",
      websiteUrl: "https://newrelic.com",
      bestFor:
        "A full-stack observability platform priced by data and users, free for 100 GB a month and one full user.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud",
      tags: ["APM", "Usage pricing"],
    },
    {
      name: "Prometheus",
      websiteUrl: "https://prometheus.io",
      bestFor:
        "The CNCF-graduated metrics database and alerting toolkit that most Kubernetes monitoring is built on.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Windows, Kubernetes",
      tags: ["Metrics", "CNCF"],
    },
    {
      name: "SigNoz",
      websiteUrl: "https://signoz.io",
      bestFor:
        "An OpenTelemetry-native, open-source APM with logs, traces and metrics in one ClickHouse-backed app.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["OpenTelemetry", "Self-hosted"],
    },
    {
      name: "Honeycomb",
      websiteUrl: "https://www.honeycomb.io",
      bestFor:
        "Event-based observability for high-cardinality tracing, free for 20 million events a month.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud",
      tags: ["Tracing", "High cardinality"],
    },
    {
      name: "Dynatrace",
      websiteUrl: "https://www.dynatrace.com",
      bestFor:
        "Enterprise observability with automatic instrumentation and AI-driven root-cause analysis.",
      license: "Commercial",
      pricing: PRICING.PAID,
      platforms: "Cloud, Self-hosted",
      tags: ["Enterprise", "Auto-instrumentation"],
    },
    {
      name: "Elastic Observability",
      websiteUrl: "https://www.elastic.co/observability",
      bestFor:
        "Logs, APM and metrics on Elasticsearch, self-managed or on Elastic Cloud, with an AGPL source option since 2024.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["Logs", "Elasticsearch"],
    },
    {
      name: "Sentry",
      websiteUrl: "https://sentry.io",
      toolSlug: "sentry",
      bestFor:
        "Error tracking, performance monitoring and session replay focused on application code.",
      license: "Source Available",
      pricing: PRICING.FREEMIUM,
      platforms: "Cloud, Self-hosted",
      tags: ["Error tracking", "Session replay"],
    },
  ],
}
