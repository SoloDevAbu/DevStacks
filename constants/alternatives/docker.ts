import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const DOCKER_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "docker",
  toolName: "Docker",
  profile: {
    websiteUrl: "https://www.docker.com",
    bestFor:
      "The standard toolchain for building, shipping and running OCI containers, with Docker Engine, Compose and Docker Desktop.",
    license: "Open Source",
    pricing: PRICING.FREEMIUM,
    platforms: "Linux, macOS, Windows",
  },
  intro:
    "Docker bundles an image builder, a daemon, a container runtime and a desktop app, so most alternatives replace one of those layers rather than all of them. Podman is the closest drop-in for the CLI, containerd and CRI-O are the runtimes Kubernetes uses directly, and OrbStack, Colima and Rancher Desktop replace Docker Desktop on a laptop.",
  stickWith: [
    "Your team relies on Docker Desktop extensions, Docker Compose workflows or Docker Hub automation.",
    "Your CI images and docs already assume the Docker daemon and socket.",
    "Your organisation already pays for a Docker subscription that covers Docker Desktop licensing.",
  ],
  switchWhen: [
    "You need rootless, daemonless containers for security or shared Linux hosts (Podman, Buildah).",
    "Docker Desktop licensing or resource use on macOS is a problem (OrbStack, Colima, Rancher Desktop).",
    "You only need the runtime underneath Kubernetes (containerd, CRI-O).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Podman",
      websiteUrl: "https://podman.io",
      bestFor:
        "Daemonless, rootless containers with a Docker-compatible CLI and pod support.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Windows",
      tags: ["Rootless", "Docker CLI compatible"],
    },
    {
      name: "OrbStack",
      websiteUrl: "https://orbstack.dev",
      bestFor:
        "A fast, lightweight Docker Desktop replacement for macOS with Linux machines built in.",
      license: "Commercial",
      pricing: PRICING.FREEMIUM,
      platforms: "macOS",
      tags: ["Docker Desktop alternative", "macOS"],
    },
    {
      name: "Colima",
      websiteUrl: "https://github.com/abiosoft/colima",
      bestFor:
        "Running the Docker or containerd runtime on macOS and Linux from the command line with minimal setup.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "macOS, Linux",
      tags: ["CLI", "Lima VM"],
    },
    {
      name: "Rancher Desktop",
      websiteUrl: "https://rancherdesktop.io",
      bestFor:
        "A free desktop app that bundles a container engine with a local Kubernetes cluster.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "macOS, Windows, Linux",
      tags: ["Kubernetes", "Desktop app"],
    },
    {
      name: "containerd",
      websiteUrl: "https://containerd.io",
      bestFor:
        "The CNCF-graduated container runtime that Kubernetes and Docker itself run on.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, Windows",
      tags: ["Runtime", "CNCF"],
    },
    {
      name: "CRI-O",
      websiteUrl: "https://cri-o.io",
      bestFor:
        "A minimal container runtime built only for the Kubernetes Container Runtime Interface.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux",
      tags: ["Kubernetes", "Runtime"],
    },
    {
      name: "Buildah",
      websiteUrl: "https://buildah.io",
      bestFor:
        "Building OCI images without a daemon, from a Containerfile or a shell script.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux",
      tags: ["Image builds", "OCI"],
    },
    {
      name: "LXC",
      websiteUrl: "https://linuxcontainers.org",
      bestFor:
        "System containers that behave like lightweight virtual machines rather than single processes.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux",
      tags: ["System containers"],
    },
  ],
}
