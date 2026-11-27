import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const TERRAFORM_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "terraform",
  toolName: "Terraform",
  profile: {
    websiteUrl: "https://developer.hashicorp.com/terraform",
    bestFor:
      "HashiCorp's infrastructure as code tool that provisions cloud resources from declarative HCL, with HCP Terraform for remote runs.",
    license: "Source Available",
    pricing: PRICING.FREEMIUM,
    platforms: "Linux, macOS, Windows",
  },
  intro:
    "Terraform has been under the Business Source License since August 2023 and HashiCorp has been part of IBM since February 2025, so many teams now compare it with open-source options. OpenTofu is the drop-in fork, Pulumi and AWS CDK write infrastructure in general-purpose languages, CloudFormation and Crossplane are native to AWS and Kubernetes, and Ansible handles configuration as well as provisioning.",
  stickWith: [
    "You depend on the Terraform Registry, HCP Terraform or Terraform Enterprise features.",
    "Your organisation has standardised on HCL modules and Sentinel policies.",
    "The BSL does not affect you because you do not offer a competing hosted product.",
  ],
  switchWhen: [
    "You want an MPL-licensed, community-governed drop-in replacement (OpenTofu).",
    "You prefer TypeScript, Python, Go or C# over HCL (Pulumi, AWS CDK).",
    "You manage infrastructure from Kubernetes or only on AWS (Crossplane, AWS CloudFormation).",
  ],
  factsCheckedOn: "2026-11-24",
  alternatives: [
    {
      name: "OpenTofu",
      websiteUrl: "https://opentofu.org",
      bestFor:
        "The MPL-2.0 fork of Terraform under the Linux Foundation, compatible with existing providers and modules.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Windows",
      tags: ["Terraform fork", "Linux Foundation"],
    },
    {
      name: "Pulumi",
      websiteUrl: "https://www.pulumi.com",
      bestFor:
        "Infrastructure as code in TypeScript, Python, Go, C# or Java, with an Apache-2.0 engine and Pulumi Cloud.",
      license: "Open Source",
      pricing: PRICING.FREEMIUM,
      platforms: "Linux, macOS, Windows",
      tags: ["General-purpose languages", "Testing"],
    },
    {
      name: "AWS CDK",
      websiteUrl: "https://aws.amazon.com/cdk",
      bestFor:
        "AWS's open-source framework for defining CloudFormation stacks in TypeScript, Python, Java, C# or Go.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Windows",
      tags: ["AWS", "Constructs"],
    },
    {
      name: "AWS CloudFormation",
      websiteUrl: "https://aws.amazon.com/cloudformation",
      bestFor:
        "AWS's native infrastructure as code service, with managed state and no charge for AWS resource types.",
      license: "Commercial",
      pricing: PRICING.FREE,
      platforms: "AWS",
      tags: ["AWS native", "Managed state"],
    },
    {
      name: "Crossplane",
      websiteUrl: "https://www.crossplane.io",
      bestFor:
        "A CNCF project that manages cloud infrastructure as Kubernetes custom resources with continuous reconciliation.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Kubernetes",
      tags: ["Kubernetes", "Control plane"],
    },
    {
      name: "Ansible",
      websiteUrl: "https://www.ansible.com",
      bestFor:
        "Red Hat's agentless automation for configuring servers and provisioning infrastructure with YAML playbooks.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS",
      tags: ["Configuration management", "Agentless"],
    },
    {
      name: "Terragrunt",
      websiteUrl: "https://terragrunt.gruntwork.io",
      bestFor:
        "An MIT-licensed wrapper for Terraform and OpenTofu that keeps large multi-environment setups DRY.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Linux, macOS, Windows",
      tags: ["Wrapper", "Multi-environment"],
    },
  ],
}
