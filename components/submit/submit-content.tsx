"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { PageHeader } from "@/components/shared/page-header"
import { SITE_CONFIG } from "@/constants/site"
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
  Video,
  Plus,
  Sparkles,
  Package,
  Wrench,
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
import { useSubmitTool } from "@/hooks/tools/use-submit-tool"
import { useSubmitProduct } from "@/hooks/products/use-submit-product"
import { submitToolSchema } from "@/lib/validation/tool"
import { submitProductSchema } from "@/lib/validation/product"
import { useSession } from "@/lib/auth/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  submitSectionHeaderRequired,
  submitSectionHeaderOptional,
  submitSectionHeaderDiscoverability,
} from "@/utils/styles"
import { cn } from "@/lib/utils"
import { LAUNCH_PROMO } from "@/constants/promo"
import { ROUTES } from "@/constants/routes"
import {
  BuiltWithToolsInput,
  type BuiltWithToolItem,
} from "@/components/shared/built-with-tools-input"
import {
  FaqBuilder,
  type FaqBuilderItem,
} from "@/components/shared/faq-builder"
import { toast } from "@/components/ui/toast"
import { getFaviconUrl, getDuckDuckGoFaviconUrl } from "@/utils/urls"
import { LaunchWeekPicker } from "@/components/shared/launch-week-picker"
import type { DbProduct, DbTool } from "@/types/entities"

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
  launchYear: undefined as number | undefined,
  launchWeek: undefined as number | undefined,
}

interface SubmitContentProps {
  initialType?: "product" | "tool"
  initialTool?: BuiltWithToolItem | null
}

const CornerBorders = ({ active }: { active: boolean }) => (
  <div
    className={cn(
      "pointer-events-none absolute -inset-1 z-0 transition-opacity",
      active ? "opacity-100" : "opacity-0 group-hover/tab:opacity-100"
    )}
  >
    <div
      className={cn(
        "absolute top-0 left-0 size-2 border-t-2 border-l-2 transition-colors",
        active ? "border-slate-800" : "border-slate-400"
      )}
    />
    <div
      className={cn(
        "absolute top-0 right-0 size-2 border-t-2 border-r-2 transition-colors",
        active ? "border-slate-800" : "border-slate-400"
      )}
    />
    <div
      className={cn(
        "absolute bottom-0 left-0 size-2 border-b-2 border-l-2 transition-colors",
        active ? "border-slate-800" : "border-slate-400"
      )}
    />
    <div
      className={cn(
        "absolute right-0 bottom-0 size-2 border-r-2 border-b-2 transition-colors",
        active ? "border-slate-800" : "border-slate-400"
      )}
    />
  </div>
)

export const SubmitContent = ({
  initialType = "product",
  initialTool = null,
}: SubmitContentProps) => {
  const [activeType, setActiveType] = useState<"product" | "tool">(initialType)
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    builtWithTools: initialTool ? [initialTool] : [],
  }))
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submittedProduct, setSubmittedProduct] = useState<DbProduct | null>(
    null
  )
  const [submittedTool, setSubmittedTool] = useState<DbTool | null>(null)

  const { data: session, isPending: isSessionPending } = useSession()
  const {
    mutateAsync: submitToolMutation,
    isPending: isToolSubmitting,
    error: toolError,
  } = useSubmitTool()
  const {
    mutateAsync: submitProductMutation,
    isPending: isProductSubmitting,
    error: productError,
  } = useSubmitProduct()

  const isSubmitting = isToolSubmitting || isProductSubmitting
  const submissionError = activeType === "product" ? productError : toolError

  if (isSessionPending || !session?.user) {
    return (
      <div className="relative flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50/50 p-12 text-center">
        <Spinner className="size-8 text-slate-400" />
        <p className="text-sm text-slate-500">Checking authentication...</p>
      </div>
    )
  }

  const user = session.user

  const handleTypeChange = (newType: "product" | "tool") => {
    if (newType === activeType) return
    setActiveType(newType)
    setErrors({})

    if (newType === "tool") {
      setForm((prev) => ({
        ...prev,
        builtWithTools: [],
        tools: "",
      }))
    }

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("type", newType)
      window.history.replaceState(null, "", url.toString())
    }
  }

  const set =
    (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
      setErrors((prev) => ({ ...prev, [key]: [] }))
    }

  const handleWebsiteUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const favicon = getFaviconUrl(val)
    setForm((prev) => ({
      ...prev,
      websiteUrl: val,
      logoUrl: favicon ?? prev.logoUrl,
    }))
    setErrors((prev) => ({ ...prev, websiteUrl: [] }))
  }

  const togglePlatform = (platform: string) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const executeSubmit = async (userId: string) => {
    const nonBlankFaqs = form.faqs
      .map((f) => ({
        id: f.id,
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

    const faviconUrl = getFaviconUrl(form.websiteUrl)
    const resolvedLogoUrl = form.logoUrl?.trim() || faviconUrl || ""

    if (activeType === "product") {
      const payload = {
        ...form,
        logoUrl: resolvedLogoUrl,
        faqs: nonBlankFaqs,
        builtWithTools: form.builtWithTools,
      }

      const parsed = submitProductSchema.safeParse({
        ...payload,
        submitterId: userId,
      })

      if (!parsed.success) {
        setErrors(
          parsed.error.flatten().fieldErrors as Record<string, string[]>
        )
        toast.error(
          "Validation Error",
          "Please review the required fields highlighted in red."
        )
        return
      }

      try {
        const { submitterId: _unused, ...clientPayload } = parsed.data
        const res = await submitProductMutation(clientPayload)
        setSubmittedProduct(res as DbProduct)
        setSubmitted(true)
        setForm(emptyForm)
        setErrors({})
        toast.success(
          "Product Submitted!",
          "Your product has been submitted for review."
        )
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to submit product"
        toast.error("Submission Failed", msg)
      }
    } else {
      const payload = {
        ...form,
        logoUrl: resolvedLogoUrl,
        faqs: nonBlankFaqs,
      }

      const parsed = submitToolSchema.safeParse(payload)

      if (!parsed.success) {
        setErrors(
          parsed.error.flatten().fieldErrors as Record<string, string[]>
        )
        toast.error(
          "Validation Error",
          "Please review the required fields highlighted in red."
        )
        return
      }

      try {
        const res = await submitToolMutation(parsed.data)
        setSubmittedTool(res as DbTool)
        setSubmitted(true)
        setForm(emptyForm)
        setErrors({})
        toast.success(
          "Developer Tool Submitted!",
          "Your developer tool has been submitted for review."
        )
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to submit tool"
        toast.error("Submission Failed", msg)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSubmit(user.id)
  }

  if (submitted) {
    const isProduct = activeType === "product"
    const viewUrl = isProduct
      ? submittedProduct?.slug
        ? ROUTES.PRODUCT(submittedProduct.slug)
        : ROUTES.PRODUCTS
      : submittedTool?.slug
        ? ROUTES.TOOL(submittedTool.slug)
        : ROUTES.TOOLS

    return (
      <div className="relative flex min-h-full flex-col items-center justify-center gap-6 bg-slate-50/50 p-12 text-center">
        <CheckCircle2 className="size-16 text-emerald-500" />
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-slate-900">
            {isProduct
              ? "Product Submitted for Review!"
              : "Developer Tool Submitted for Review!"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Your {isProduct ? "product" : "developer tool"} has been submitted
            for review. As part of our launch celebration, your listing will
            receive a complimentary upgrade to{" "}
            <strong className="text-slate-900">
              Premium for free ({LAUNCH_PROMO.VALUE_GIFTED} value)
            </strong>{" "}
            with a permanent Do-Follow SEO backlink upon approval.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Our moderation team will review your submission for authenticity and
            technical relevance before it goes live. You can monitor its status
            from your Dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => {
              setSubmitted(false)
              setSubmittedProduct(null)
              setSubmittedTool(null)
            }}
          >
            Submit Another Launch
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={ROUTES.DASHBOARD} />}
          >
            Go to Dashboard
          </Button>
          {viewUrl && (
            <Button
              variant="secondary"
              nativeButton={false}
              render={<Link href={viewUrl} />}
            >
              View Listing
            </Button>
          )}
        </div>
      </div>
    )
  }

  const typeLabel = activeType === "product" ? "Product" : "Tool"

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50 pb-20">
      <PageHeader
        heading="New Launch"
        description={`List your ${activeType === "product" ? "product, SaaS, or web app" : "developer tool, library, API, or infrastructure product"} for the developer ecosystem and AI models to discover.`}
        aiPrompt={AI_PROMPTS.submit}
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
            Submitting as{" "}
            <span className="font-semibold text-slate-900">
              {user.name || user.email}
            </span>
          </span>
        </div>
      </div>

      {/* Launch Promo Ribbon - Compact & Sleek */}
      {LAUNCH_PROMO.IS_ACTIVE && (
        <div className="flex items-center justify-between border-b border-dashed border-amber-200/80 bg-linear-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 px-4 py-2.5 text-xs text-amber-950 sm:px-6 md:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700">
              <Sparkles className="size-3" />
            </span>
            <p className="font-medium text-amber-950">
              <strong className="font-semibold text-amber-900">
                Launch Special Active:
              </strong>{" "}
              First {LAUNCH_PROMO.MAX_LAUNCHES} launches receive a{" "}
              <span className="font-semibold text-amber-900">
                FREE Lifetime Premium Listing ({LAUNCH_PROMO.VALUE_GIFTED}{" "}
                value)
              </span>{" "}
              with permanent Do-Follow SEO backlink.
            </p>
          </div>
          <Badge
            variant="outline"
            className="hidden shrink-0 border-amber-300/80 bg-amber-100/60 font-mono text-[10px] font-semibold text-amber-900 sm:inline-flex"
          >
            {LAUNCH_PROMO.BADGE_LABEL}
          </Badge>
        </div>
      )}

      {/* Top Type Selector Tabs - Compact, Full-Width with Corner Outline Style */}
      <div className="w-full border-b border-dashed border-border bg-white px-4 py-3 sm:px-6 md:px-8">
        <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-3">
          <div className="group/tab relative flex-1">
            <button
              type="button"
              onClick={() => handleTypeChange("product")}
              className={cn(
                "relative z-10 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border text-xs font-semibold transition-all sm:text-sm",
                activeType === "product"
                  ? "border-slate-300 bg-slate-100/90 font-bold text-slate-950 shadow-2xs"
                  : "border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Package className="size-3.5 shrink-0 text-indigo-600 sm:size-4" />
              <span>Product / App</span>
              <span className="py-0.2 hidden rounded-xs bg-indigo-50 px-1.5 font-mono text-[9px] font-bold text-indigo-700 sm:inline-block">
                DEFAULT
              </span>
            </button>
            <CornerBorders active={activeType === "product"} />
          </div>

          <div className="group/tab relative flex-1">
            <button
              type="button"
              onClick={() => handleTypeChange("tool")}
              className={cn(
                "relative z-10 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border text-xs font-semibold transition-all sm:text-sm",
                activeType === "tool"
                  ? "border-slate-300 bg-slate-100/90 font-bold text-slate-950 shadow-2xs"
                  : "border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Wrench className="size-3.5 shrink-0 text-emerald-600 sm:size-4" />
              <span>Developer Tool</span>
            </button>
            <CornerBorders active={activeType === "tool"} />
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex flex-col">
        <form onSubmit={handleSubmit} noValidate>
          {/* SECTION: BASIC INFORMATION (REQUIRED) */}
          <div className="flex flex-col border-b border-dashed border-border">
            <div className={submitSectionHeaderRequired}>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900">
                  Required Information
                </h2>
                <Badge
                  variant="destructive"
                  className="rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase"
                >
                  Required
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Launch schedule, core identity, and access links for your{" "}
                {typeLabel.toLowerCase()}.
              </p>
            </div>

            {/* Launch Week Selector - First item in Required Information */}
            <div className="flex flex-col gap-3 border-b border-dashed border-border px-6 py-5 md:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                    Launch Week *
                  </Label>
                  <span className="text-[11px] text-slate-500">
                    Select when your launch goes live in &ldquo;This Week&apos;s
                    Launches&rdquo; on the homepage
                  </span>
                </div>
              </div>

              <LaunchWeekPicker
                selectedYear={form.launchYear}
                selectedWeek={form.launchWeek}
                compact={true}
                onSelectWeek={(year, week) =>
                  setForm((prev) => ({
                    ...prev,
                    launchYear: year,
                    launchWeek: week,
                  }))
                }
              />
              {errors.launchWeek && (
                <p className="text-xs text-red-500">{errors.launchWeek[0]}</p>
              )}
            </div>

            {/* Name, Tagline & Website */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">{typeLabel} Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder={`e.g. ${activeType === "product" ? "CodeFast" : "Prisma ORM"}`}
                    aria-invalid={Boolean(errors.name)}
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
                    placeholder={`Short one-line pitch (10-${activeType === "product" ? "60" : "200"} characters)`}
                    aria-invalid={Boolean(errors.tagline)}
                  />
                  {errors.tagline && (
                    <p className="text-xs text-red-500">{errors.tagline[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="websiteUrl">Website URL *</Label>
                  <div className="relative">
                    <Globe className="absolute top-2.5 left-3 size-4 text-slate-400" />
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={form.websiteUrl}
                      onChange={handleWebsiteUrlChange}
                      placeholder="https://example.com"
                      className="pl-9"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Primary landing page or documentation (must include
                    https://).
                  </span>
                  {getFaviconUrl(form.websiteUrl) && (
                    <div className="mt-1 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      <div className="relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-white">
                        <img
                          src={getFaviconUrl(form.websiteUrl)!}
                          alt="Favicon preview"
                          className="size-3.5 object-contain"
                          onError={(e) => {
                            const ddg = getDuckDuckGoFaviconUrl(form.websiteUrl)
                            if (ddg && e.currentTarget.src !== ddg) {
                              e.currentTarget.src = ddg
                            }
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-600">
                        Brand favicon detected automatically from your URL
                      </span>
                    </div>
                  )}
                  {errors.websiteUrl && (
                    <p className="text-xs text-red-500">
                      {errors.websiteUrl[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Overview & Pricing */}
            <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Overview & Pricing Model
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed summary and developer pricing tier.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={set("description")}
                    placeholder={`What does your ${typeLabel.toLowerCase()} do? Why should engineers use it?`}
                    rows={4}
                  />
                  <span className="text-[11px] text-slate-400">
                    Comprehensive explanation of features, architecture, and
                    benefits (min 20 characters).
                  </span>
                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description[0]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                  <div className="grid gap-2">
                    <Label htmlFor="category">Primary Category</Label>
                    <Input
                      id="category"
                      value={form.category}
                      onChange={set("category")}
                      placeholder={`e.g. ${activeType === "product" ? "AI SaaS, Productivity, Fintech" : "Database, Auth, DevTools, AI"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: DEVELOPER TECH STACK (PRODUCT ONLY) */}
          {activeType === "product" && (
            <div className="flex flex-col border-b border-dashed border-border">
              <div className="flex flex-col gap-1 border-b border-dashed border-border bg-linear-to-r from-blue-100/60 via-indigo-50/50 to-white px-6 py-6 md:px-8">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold text-slate-900">
                    Tech Stack & Built With
                  </h2>
                  <Badge
                    variant="outline"
                    className="rounded-md border-indigo-200 bg-indigo-50/70 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-indigo-700 uppercase"
                  >
                    Cross-Discovery
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Link developer tools, APIs, and databases powering this
                  product. Your product will be cross-promoted on each
                  tool&apos;s dedicated page under &ldquo;Products Built
                  With&rdquo;.
                </p>
              </div>

              <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-8">
                <BuiltWithToolsInput
                  value={form.builtWithTools}
                  onChange={(tools) =>
                    setForm((prev) => ({ ...prev, builtWithTools: tools }))
                  }
                />
              </div>
            </div>
          )}

          {/* SECTION: OPTIONAL SHOWCASE & DEEP DIVE */}
          <div className="flex flex-col border-b border-dashed border-border">
            <div className={submitSectionHeaderOptional}>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900">
                  Showcase & Value Proposition
                </h2>
                <Badge
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-slate-700 uppercase"
                >
                  Optional
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Add richer context on the problem you eliminate, media previews,
                store downloads, and community links.
              </p>
            </div>

            {/* Value Proposition */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Problem & Solution Deep Dive
                </h3>
                <p className="text-xs text-slate-500">
                  Help builders understand your unique technical value and
                  workflows.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="problem">Problem it Solves</Label>
                  <Textarea
                    id="problem"
                    value={form.problemStatement}
                    onChange={set("problemStatement")}
                    placeholder={`What pain point or bottleneck does this ${typeLabel.toLowerCase()} eliminate?`}
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="solution">The Solution</Label>
                  <Textarea
                    id="solution"
                    value={form.solution}
                    onChange={set("solution")}
                    placeholder={`How does your ${typeLabel.toLowerCase()} solve this problem technically?`}
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="unique">What Makes It Unique?</Label>
                  <Textarea
                    id="unique"
                    value={form.uniqueValue}
                    onChange={set("uniqueValue")}
                    placeholder={`Why should builders choose this ${typeLabel.toLowerCase()} over alternatives?`}
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="useCases">Target Use Cases</Label>
                  <Textarea
                    id="useCases"
                    value={form.useCases}
                    onChange={set("useCases")}
                    placeholder={`Describe specific engineering workflows, scenarios, or personas this ${typeLabel.toLowerCase()} is designed for...`}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Platforms & Tags */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Platforms & Tags
                </h3>
                <p className="text-xs text-slate-500">
                  Specify supported environments and search keywords.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={form.tags}
                    onChange={set("tags")}
                    placeholder="e.g. Postgres, Next.js, TypeScript, Cloud (comma separated)"
                  />
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

            {/* Media & Community / Store Links */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Media & Community / Store Links
                </h3>
                <p className="text-xs text-slate-500">
                  Video walkthrough, app stores, source repositories, and
                  community channels.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="video">Demo Video URL</Label>
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* GitHub */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="githubUrl"
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                    >
                      GitHub Repository
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
                        id="githubUrl"
                        type="url"
                        value={form.githubUrl}
                        onChange={set("githubUrl")}
                        placeholder="https://github.com/your-org/your-repo"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Twitter / X */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="twitterUrl"
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
                        id="twitterUrl"
                        type="url"
                        value={form.twitterUrl}
                        onChange={set("twitterUrl")}
                        placeholder="https://x.com/your_handle"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="linkedinUrl"
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
                        id="linkedinUrl"
                        type="url"
                        value={form.linkedinUrl}
                        onChange={set("linkedinUrl")}
                        placeholder="https://linkedin.com/company/your-company"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Discord */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="discordUrl"
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                    >
                      Discord Community
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
                        id="discordUrl"
                        type="url"
                        value={form.discordUrl}
                        onChange={set("discordUrl")}
                        placeholder="https://discord.gg/your-invite"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Apple App Store */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="appStoreUrl"
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
                        id="appStoreUrl"
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

                  {/* Google Play Store */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="playStoreUrl"
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
                        id="playStoreUrl"
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

                  {/* Chrome Web Store */}
                  <div className="grid gap-2 sm:col-span-2">
                    <Label
                      htmlFor="chromeExtensionUrl"
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
                        id="chromeExtensionUrl"
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

            {/* FAQs */}
            <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Frequently Asked Questions ({typeLabel} FAQs)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Address common questions builders might have about your{" "}
                    {typeLabel.toLowerCase()}, integration, or pricing.
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
                questionPlaceholder={`e.g. Is this ${typeLabel.toLowerCase()} self-hostable or open source?`}
                answerPlaceholder="e.g. Yes, you can deploy using Docker or sign up for our managed cloud."
                emptyPrompt={`No FAQs added yet. Help builders evaluate your ${typeLabel.toLowerCase()} faster by adding answers to common questions.`}
                addFirstLabel="Add First Question"
                addAnotherLabel="Add Another Question"
              />
            </div>
          </div>

          {/* SECTION: SEO, GEO & AI DISCOVERABILITY */}
          <div className="flex flex-col border-b border-dashed border-border">
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
                regional routing (GEO), and AI model citation (ChatGPT, Claude,
                Perplexity - AEO). None of this is displayed on your public
                page.
              </p>
            </div>

            {/* Target Audience & GEO */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    value={form.targetAudience}
                    onChange={set("targetAudience")}
                    placeholder="e.g. Frontend Developers, SaaS Founders"
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

            {/* Search Metadata (SEO) */}
            <div className="flex flex-col gap-5 border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="keywords">
                    Target Search Keywords (SEO / ASO)
                  </Label>
                  <Input
                    id="keywords"
                    value={form.keywords}
                    onChange={set("keywords")}
                    placeholder="e.g. react state, open source database, edge hosting (comma separated)"
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

            {/* AI Assistant Context (AEO) */}
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
                  placeholder={`If an AI like ChatGPT, Claude, or Perplexity is asked about solutions in your category, why should it recommend you? Summarize your pitch for LLMs.`}
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
            {submissionError && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="size-4 shrink-0" />
                {submissionError.message ??
                  "Something went wrong. Please try again."}
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
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" /> Submitting...
                  </>
                ) : activeType === "product" ? (
                  "Submit Product Launch"
                ) : (
                  "Submit Developer Tool"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
