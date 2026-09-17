"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PageHeader } from "@/components/shared/page-header"
import { AI_PROMPTS } from "@/lib/prompts"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  Upload,
  Video,
  Plus,
  Trash2,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PRICING } from "@/constants/plans"
import { PLATFORMS } from "@/constants/platforms"
import { useSubmitBuild } from "@/hooks/builds/use-submit-build"
import { submitBuildSchema } from "@/lib/validation/build"
import { useSession } from "@/lib/auth/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  submitSectionHeaderRequired,
  submitSectionHeaderOptional,
  submitSectionHeaderDiscoverability,
} from "@/utils/styles"
import {
  BuiltWithToolsInput,
  type BuiltWithToolItem,
} from "@/components/shared/built-with-tools-input"
import {
  FaqBuilder,
  type FaqBuilderItem,
} from "@/components/shared/faq-builder"
import { toast } from "@/components/ui/toast"

const emptyForm = {
  name: "",
  tagline: "",
  description: "",
  problemStatement: "",
  solution: "",
  uniqueValue: "",
  websiteUrl: "",
  logoUrl: "",
  githubUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
  discordUrl: "",
  appStoreUrl: "",
  playStoreUrl: "",
  chromeExtensionUrl: "",
  images: [] as string[],
  demoVideoUrl: "",
  useCases: "",
  tools: "",
  builtWithTools: [] as BuiltWithToolItem[],
  keywords: "",
  targetAudience: "",
  metaTitle: "",
  metaDescription: "",
  aiContext: "",
  geoTarget: "",
  asoCategory: "",
  category: "",
  tags: "",
  pricing: "Free" as const,
  platforms: [] as string[],
  faqs: [] as FaqBuilderItem[],
}

interface ShowcaseContentProps {
  initialTool?: BuiltWithToolItem | null
}

export const ShowcaseContent = ({ initialTool }: ShowcaseContentProps = {}) => {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    builtWithTools: initialTool ? [initialTool] : [],
  }))
  const [screenshotInput, setScreenshotInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  const { data: session, isPending } = useSession()
  const router = useRouter()
  const { mutate, isPending: isSubmitting, isError, error } = useSubmitBuild()

  useEffect(() => {
    if (!isPending && !session?.user) {
      const currentPath =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/showcase"
      router.replace(`/?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [isPending, session?.user, router])

  useEffect(() => {
    if (initialTool) {
      setForm((prev) => {
        const exists = prev.builtWithTools.some(
          (t) =>
            (initialTool.toolSlug && t.toolSlug === initialTool.toolSlug) ||
            t.name.toLowerCase() === initialTool.name.toLowerCase()
        )
        if (exists) return prev
        return {
          ...prev,
          builtWithTools: [...prev.builtWithTools, initialTool],
        }
      })
    }
  }, [initialTool])

  if (isPending || !session?.user) {
    return (
      <div className="relative flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50/50 p-12 text-center">
        <Spinner className="size-8 text-slate-400" />
        <p className="text-sm text-slate-500">Checking authentication...</p>
      </div>
    )
  }

  const user = session.user

  const set =
    (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
      setErrors((prev) => ({ ...prev, [key]: [] }))
    }

  const togglePlatform = (platform: string) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const addScreenshot = (customUrl?: string) => {
    const url = customUrl || screenshotInput
    if (!url.trim() || form.images.length >= 5) return
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, url.trim()],
    }))
    if (!customUrl) {
      setScreenshotInput("")
    }
  }

  const removeScreenshot = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const executeSubmit = (userId: string) => {
    const nonBlankFaqs = form.faqs
      .map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
      }))
      .filter((f) => f.question || f.answer)

    const incompleteFaq = nonBlankFaqs.find((f) => !f.question || !f.answer)
    if (incompleteFaq) {
      toast.error(
        "Incomplete FAQ",
        "Every added FAQ must have both a question and an answer."
      )
      return
    }

    const payload = {
      ...form,
      faqs: nonBlankFaqs,
      submitterId: userId,
      authorId: userId,
    }

    const parsed = submitBuildSchema.safeParse(payload)

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>)
      return
    }

    mutate(parsed.data, {
      onSuccess: () => {
        setSubmitted(true)
        setForm(emptyForm)
        setErrors({})
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSubmit(user.id)
  }

  if (submitted) {
    return (
      <div className="relative flex min-h-full flex-col items-center justify-center gap-6 bg-slate-50/50 p-12 text-center">
        <CheckCircle2 className="size-16 text-emerald-500" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Build Showcased!
          </h2>
          <p className="mt-2 text-slate-500">
            Your build has been submitted and will be showcased across the
            platform and tool directories.
          </p>
        </div>
        <Button onClick={() => setSubmitted(false)}>Showcase Another</Button>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50 pb-20">
      <PageHeader
        heading="Showcase a Build"
        description="Share what you've built and the developer tech stack powering it."
        aiPrompt={AI_PROMPTS.showcase}
      />

      {/* Auth Status Bar */}
      <div className="border-b border-dashed border-border bg-white px-6 py-4 md:px-8">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <Avatar className="size-6 border border-border">
            {user.image && (
              <AvatarImage src={user.image} alt={user.name || "User"} />
            )}
            <AvatarFallback className="bg-slate-900 text-[10px] text-white">
              {user.name?.slice(0, 2).toUpperCase() || "ME"}
            </AvatarFallback>
          </Avatar>
          <span>
            Showcasing as{" "}
            <span className="font-semibold text-slate-900">
              {user.name || user.email}
            </span>
          </span>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* SECTION: REQUIRED INFORMATION */}
          <div className="flex flex-col border-b border-dashed border-border">
            {/* Section Header */}
            <div className={submitSectionHeaderRequired}>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900">
                  Required Information
                </h2>
                <Badge
                  variant="destructive"
                  className="rounded-md px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase"
                >
                  Required
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Essential details required to showcase your build in the
                community directory.
              </p>
            </div>

            {/* Subsection: Core Identity & Links */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Core Identity & Links
                </h3>
                <p className="text-xs text-slate-500">
                  Basic identifiers and official link for your product or build.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product / Project Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="e.g. Acme Dashboard"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name[0]}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tagline">Tagline *</Label>
                  <Input
                    id="tagline"
                    value={form.tagline}
                    onChange={set("tagline")}
                    placeholder="Brief, catchy pitch (max 60 chars)"
                    maxLength={60}
                  />
                  <span className="text-[11px] text-slate-400">
                    Short summary displayed on cards and search feeds (10-60
                    characters).
                  </span>
                  {errors.tagline && (
                    <p className="text-xs text-red-500">{errors.tagline[0]}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="websiteUrl">Website / Demo URL *</Label>
                  <div className="relative">
                    <Globe className="absolute top-2.5 left-3 size-4 text-slate-400" />
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={form.websiteUrl}
                      onChange={set("websiteUrl")}
                      placeholder="https://example.com"
                      className="pl-9"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Live production link or interactive preview URL (must
                    include https://).
                  </span>
                  {errors.websiteUrl && (
                    <p className="text-xs text-red-500">
                      {errors.websiteUrl[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Subsection: Overview & Pricing Model */}
            <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Overview & Pricing Model
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed summary and primary business model.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={set("description")}
                    placeholder="What does your project do? Describe the core engineering or user value."
                    rows={4}
                  />
                  <span className="text-[11px] text-slate-400">
                    Comprehensive overview of features and architecture (min 20
                    characters).
                  </span>
                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description[0]}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tier">Pricing Model *</Label>
                  <Select
                    value={form.pricing}
                    onValueChange={(v) =>
                      setForm((p) => ({
                        ...p,
                        pricing: v as typeof form.pricing,
                      }))
                    }
                  >
                    <SelectTrigger id="tier">
                      <SelectValue placeholder="Select a pricing model" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PRICING).map((pricing) => (
                        <SelectItem key={pricing} value={pricing}>
                          {pricing}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: PRODUCT SHOWCASE & DEEP DIVE */}
          <div className="flex flex-col border-b border-dashed border-border">
            {/* Section Header */}
            <div className={submitSectionHeaderOptional}>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900">
                  Product Showcase & Deep Dive
                </h2>
                <Badge
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-slate-700 uppercase"
                >
                  Optional
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Architectural insights, built-with tech stack, media previews,
                and community links.
              </p>
            </div>

            {/* Subsection: Value Proposition & Deep Dive */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Value Proposition & Deep Dive
                </h3>
                <p className="text-xs text-slate-500">
                  Help developers understand your technical approach and
                  architectural decisions.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="problem">Problem it Solves</Label>
                  <Textarea
                    id="problem"
                    value={form.problemStatement}
                    onChange={set("problemStatement")}
                    placeholder="What pain point or engineering bottleneck does this product eliminate?"
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="solution">The Solution</Label>
                  <Textarea
                    id="solution"
                    value={form.solution}
                    onChange={set("solution")}
                    placeholder="How does your product solve this problem technically?"
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="unique">What Makes It Unique?</Label>
                  <Textarea
                    id="unique"
                    value={form.uniqueValue}
                    onChange={set("uniqueValue")}
                    placeholder="Why should developers choose this over alternatives?"
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="useCases">Target Use Cases</Label>
                  <Textarea
                    id="useCases"
                    value={form.useCases}
                    onChange={set("useCases")}
                    placeholder="Describe specific engineering workflows, use cases, or developer scenarios..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Subsection: Frequently Asked Questions (Product FAQs) */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Frequently Asked Questions (Product FAQs)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Address common questions developers might have about your
                    product, architecture, pricing, or integration.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      faqs: [...prev.faqs, { question: "", answer: "" }],
                    }))
                  }
                  className="gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Add Question</span>
                </Button>
              </div>

              <FaqBuilder
                faqs={form.faqs}
                onChange={(faqs) => setForm((prev) => ({ ...prev, faqs }))}
                questionPlaceholder="e.g. Is this build open source or is there an API available?"
                answerPlaceholder="e.g. Yes, the core repository is on GitHub and we offer a hosted REST API."
                emptyPrompt="No FAQs added yet. Help developers evaluate your product faster by adding answers to common questions."
                addFirstLabel="Add First Question"
                addAnotherLabel="Add Another Question"
              />
            </div>

            {/* Subsection: Tech Stack & Built With */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Tech Stack & Built With
                </h3>
                <p className="text-xs text-slate-500">
                  Link your build to developer tools in DevStacks, or add custom
                  unlinked tools.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <BuiltWithToolsInput
                  value={form.builtWithTools}
                  onChange={(tools) =>
                    setForm((prev) => ({ ...prev, builtWithTools: tools }))
                  }
                />
              </div>
            </div>

            {/* Subsection: Categories & Platforms */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Categories & Platforms
                </h3>
                <p className="text-xs text-slate-500">
                  Classify your product and specify supported developer
                  environments.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Primary Category</Label>
                    <Input
                      id="category"
                      value={form.category}
                      onChange={set("category")}
                      placeholder="e.g. Analytics, Database, Auth, DevTools"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={form.tags}
                      onChange={set("tags")}
                      placeholder="e.g. AI, Productivity, SaaS, TypeScript (comma separated)"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Label>Supported Platforms & Availability</Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {PLATFORMS.map((platform) => (
                      <div
                        key={platform.id}
                        className="flex flex-row items-center space-x-3 rounded-lg border border-slate-200/80 bg-white p-3 shadow-2xs transition-colors hover:bg-slate-50"
                      >
                        <Checkbox
                          id={`platform-${platform.id}`}
                          checked={form.platforms.includes(platform.id)}
                          onCheckedChange={() => togglePlatform(platform.id)}
                        />
                        <Label
                          htmlFor={`platform-${platform.id}`}
                          className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700"
                        >
                          {"logo" in platform && platform.logo && (
                            <Image
                              src={platform.logo}
                              alt={platform.label}
                              width={16}
                              height={16}
                              className="size-4 rounded-xs object-contain"
                            />
                          )}
                          {platform.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Subsection: Media & Visual Showcase */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Media & Visual Showcase
                </h3>
                <p className="text-xs text-slate-500">
                  Brand logo, screenshot gallery, and demo walkthrough videos.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="logo">Logo URL</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            logoUrl:
                              "https://api.dicebear.com/7.x/shapes/svg?seed=" +
                              (form.name || "build"),
                          }))
                        }
                        className="h-6 gap-1 px-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <Upload className="size-3" />
                        Mock Upload Demo
                      </Button>
                    </div>
                    <Input
                      id="logo"
                      type="url"
                      value={form.logoUrl}
                      onChange={set("logoUrl")}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="video">Product Demo Video URL</Label>
                    <div className="relative">
                      <Video className="absolute top-2.5 left-3 size-4 text-slate-400" />
                      <Input
                        id="video"
                        type="url"
                        value={form.demoVideoUrl}
                        onChange={set("demoVideoUrl")}
                        placeholder="https://youtube.com/watch?v=... or Loom"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="screenshots">
                      Screenshots & Gallery (Max 5)
                    </Label>
                    <span className="text-[11px] text-slate-400">
                      {form.images.length}/5 added
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="screenshots"
                      type="url"
                      value={screenshotInput}
                      onChange={(e) => setScreenshotInput(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      disabled={form.images.length >= 5}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addScreenshot()}
                      disabled={
                        !screenshotInput.trim() || form.images.length >= 5
                      }
                      className="shrink-0 gap-1"
                    >
                      <Plus className="size-3.5" />
                      Add URL
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        addScreenshot(
                          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
                        )
                      }
                      disabled={form.images.length >= 5}
                      className="shrink-0 gap-1 text-xs"
                      title="Simulate image upload"
                    >
                      <Upload className="size-3.5" />
                      Mock Upload
                    </Button>
                  </div>

                  {form.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.images.map((url, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-2xs"
                        >
                          <span className="max-w-50 truncate">{url}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeScreenshot(i)}
                            className="size-5 text-slate-400 hover:bg-transparent hover:text-red-600"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subsection: Community, Store & Social Links */}
            <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Community, Store & Social Links
                </h3>
                <p className="text-xs text-slate-500">
                  Connect developers directly to your repository, team, app
                  stores, browser extensions, and community discussions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label
                    htmlFor="github"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                  >
                    GitHub
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-2.5 left-3 flex size-4 items-center justify-center">
                      <Image
                        src="/social-logo/github.png"
                        alt="GitHub"
                        width={16}
                        height={16}
                        className="size-4 rounded-xs object-contain"
                      />
                    </div>
                    <Input
                      id="github"
                      type="url"
                      value={form.githubUrl}
                      onChange={set("githubUrl")}
                      placeholder="https://github.com/your-org/your-repo"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="twitter"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                  >
                    X (Twitter)
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-2.5 left-3 flex size-4 items-center justify-center">
                      <Image
                        src="/social-logo/twitter.png"
                        alt="X"
                        width={16}
                        height={16}
                        className="size-4 rounded-xs object-contain"
                      />
                    </div>
                    <Input
                      id="twitter"
                      type="url"
                      value={form.twitterUrl}
                      onChange={set("twitterUrl")}
                      placeholder="https://x.com/your_handle"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="linkedin"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                  >
                    LinkedIn
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-2.5 left-3 flex size-4 items-center justify-center">
                      <Image
                        src="/social-logo/linkedin.png"
                        alt="LinkedIn"
                        width={16}
                        height={16}
                        className="size-4 rounded-xs object-contain"
                      />
                    </div>
                    <Input
                      id="linkedin"
                      type="url"
                      value={form.linkedinUrl}
                      onChange={set("linkedinUrl")}
                      placeholder="https://linkedin.com/company/your-company"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="discord"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                  >
                    Discord
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-2.5 left-3 flex size-4 items-center justify-center">
                      <Image
                        src="/social-logo/discord.png"
                        alt="Discord"
                        width={16}
                        height={16}
                        className="size-4 rounded-xs object-contain"
                      />
                    </div>
                    <Input
                      id="discord"
                      type="url"
                      value={form.discordUrl}
                      onChange={set("discordUrl")}
                      placeholder="https://discord.gg/your-invite"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="appStore"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                  >
                    Apple App Store
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-2.5 left-3 flex size-4 items-center justify-center">
                      <Image
                        src="/social-logo/app-store.png"
                        alt="App Store"
                        width={16}
                        height={16}
                        className="size-4 rounded-xs object-contain"
                      />
                    </div>
                    <Input
                      id="appStore"
                      type="url"
                      value={form.appStoreUrl}
                      onChange={set("appStoreUrl")}
                      placeholder="https://apps.apple.com/app/your-app/id..."
                      className="pl-9"
                    />
                  </div>
                  {errors.appStoreUrl && (
                    <p className="text-xs text-red-500">
                      {errors.appStoreUrl[0]}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="playStore"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                  >
                    Google Play Store
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-2.5 left-3 flex size-4 items-center justify-center">
                      <Image
                        src="/social-logo/playstore.png"
                        alt="Google Play Store"
                        width={16}
                        height={16}
                        className="size-4 rounded-xs object-contain"
                      />
                    </div>
                    <Input
                      id="playStore"
                      type="url"
                      value={form.playStoreUrl}
                      onChange={set("playStoreUrl")}
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      className="pl-9"
                    />
                  </div>
                  {errors.playStoreUrl && (
                    <p className="text-xs text-red-500">
                      {errors.playStoreUrl[0]}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="chromeExtension"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                  >
                    Chrome Web Store Extension
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-2.5 left-3 flex size-4 items-center justify-center">
                      <Image
                        src="/social-logo/chrome.png"
                        alt="Chrome Web Store"
                        width={16}
                        height={16}
                        className="size-4 rounded-xs object-contain"
                      />
                    </div>
                    <Input
                      id="chromeExtension"
                      type="url"
                      value={form.chromeExtensionUrl}
                      onChange={set("chromeExtensionUrl")}
                      placeholder="https://chromewebstore.google.com/detail/..."
                      className="pl-9"
                    />
                  </div>
                  {errors.chromeExtensionUrl && (
                    <p className="text-xs text-red-500">
                      {errors.chromeExtensionUrl[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: SEO, GEO & AI DISCOVERABILITY */}
          <div className="flex flex-col border-b border-dashed border-border">
            {/* Section Header */}
            <div className={submitSectionHeaderDiscoverability}>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900">
                  SEO, GEO & AI Discoverability
                </h2>
                <Badge
                  variant="outline"
                  className="rounded-md border-indigo-200 bg-indigo-50/70 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-indigo-700 uppercase"
                >
                  Metadata Only • Hidden from Public Page
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Data configured strictly for search engine indexing (SEO),
                regional query routing (GEO), and AI model citation (ChatGPT,
                Claude, Perplexity - AEO). None of this is displayed on your
                public product page.
              </p>
            </div>

            {/* Subsection: Target Audience & Regional Targeting */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Target Audience & Regional Targeting
                </h3>
                <p className="text-xs text-slate-500">
                  Help AI answer engines recommend your tool to specific
                  developer personas and regional search queries.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    value={form.targetAudience}
                    onChange={set("targetAudience")}
                    placeholder="e.g. Frontend Developers, DevOps Engineers"
                  />
                  <span className="text-[11px] text-slate-400">
                    Primary user persona.
                  </span>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="geoTarget">Geographical Target (GEO)</Label>
                  <Input
                    id="geoTarget"
                    value={form.geoTarget}
                    onChange={set("geoTarget")}
                    placeholder="e.g. Global, US Only, EU Compliant"
                  />
                  <span className="text-[11px] text-slate-400">
                    Localized queries and compliance.
                  </span>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="asoCategory">
                    Directory / App Category (ASO)
                  </Label>
                  <Input
                    id="asoCategory"
                    value={form.asoCategory}
                    onChange={set("asoCategory")}
                    placeholder="e.g. Developer Tools, Productivity"
                  />
                  <span className="text-[11px] text-slate-400">
                    External taxonomy classification.
                  </span>
                </div>
              </div>
            </div>

            {/* Subsection: Organic Search Metadata (SEO) */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Organic Search Metadata (SEO)
                </h3>
                <p className="text-xs text-slate-500">
                  Custom titles, descriptions, and search terms for Google and
                  Bing crawlers.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="keywords">
                    Target Search Keywords (SEO / ASO)
                  </Label>
                  <Input
                    id="keywords"
                    value={form.keywords}
                    onChange={set("keywords")}
                    placeholder="e.g. react dashboard, open source database, edge hosting (comma separated)"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                    <Input
                      id="metaTitle"
                      value={form.metaTitle}
                      onChange={set("metaTitle")}
                      placeholder="Title used by search engines (max 60 chars)"
                      maxLength={60}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="metaDescription">
                      Meta Description (SEO)
                    </Label>
                    <Textarea
                      id="metaDescription"
                      value={form.metaDescription}
                      onChange={set("metaDescription")}
                      placeholder="Description snippet used by search engines (max 160 chars)"
                      rows={2}
                      maxLength={160}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subsection: AI & Answer Engine Optimization (AEO) */}
            <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  AI & Answer Engine Optimization (AEO)
                </h3>
                <p className="text-xs text-slate-500">
                  Prompt citation guidance for ChatGPT, Claude, and Perplexity.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="aiContext">
                  AI Assistant Prompt Context (AEO)
                </Label>
                <Textarea
                  id="aiContext"
                  value={form.aiContext}
                  onChange={set("aiContext")}
                  placeholder="If an AI like ChatGPT, Claude, or Perplexity is asked about tools in your category, why should it recommend you? Summarize your pitch for LLMs."
                  rows={3}
                />
                <span className="text-[11px] text-slate-400">
                  Fed directly into /llms.txt and semantic AI citation feeds.
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col gap-3 bg-slate-50/50 px-6 py-6 md:px-8">
            {isError && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="size-4 shrink-0" />
                {error?.message ?? "Something went wrong. Please try again."}
              </div>
            )}
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setForm(emptyForm)
                  setErrors({})
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" /> Submitting...
                  </>
                ) : (
                  "Submit Showcase"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
