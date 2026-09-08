"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { AI_PROMPTS } from "@/lib/prompts"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Globe,
  MessageSquare,
  Code2,
  Hash,
  Briefcase,
  CheckCircle2,
  AlertCircle,
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
import { useSubmitProduct } from "@/hooks/products/use-submit-product"
import { submitProductSchema } from "@/lib/validation/product"
import { useSession } from "@/lib/auth/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
}

export const SubmitContent = () => {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  const { data: session, isPending } = useSession()
  const router = useRouter()
  const { mutate, isPending: isSubmitting, isError, error } = useSubmitProduct()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/?redirect=/submit")
    }
  }, [isPending, session?.user, router])

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

  const executeSubmit = (userId: string) => {
    const parsed = submitProductSchema.safeParse({
      ...form,
      submitterId: userId,
    })
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>)
      return
    }

    mutate(
      { ...form, submitterId: userId },
      {
        onSuccess: () => {
          setSubmitted(true)
          setForm(emptyForm)
          setErrors({})
        },
      }
    )
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
            Product Submitted!
          </h2>
          <p className="mt-2 text-slate-500">
            Your product is pending review. We&apos;ll notify you when it&apos;s
            approved.
          </p>
        </div>
        <Button onClick={() => setSubmitted(false)}>Submit Another</Button>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50 pb-20">
      <PageHeader
        heading="Submit a Product"
        description="List your developer tool, API, or infrastructure product for the community to discover."
        aiPrompt={AI_PROMPTS.home}
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

      <div className="flex w-full flex-1 flex-col bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Section: General Information */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                General Information
              </h2>
              <p className="text-sm text-slate-500">
                The basic details about your product.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Next.js"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name[0]}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={form.tagline}
                  onChange={set("tagline")}
                  placeholder="Brief, catchy description (max 60 chars)"
                  maxLength={60}
                />
                {errors.tagline && (
                  <p className="text-xs text-red-500">{errors.tagline[0]}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={set("description")}
                  placeholder="What does your product do? Why should developers use it?"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Deep Dive */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Deep Dive</h2>
              <p className="text-sm text-slate-500">
                Help developers understand the specific value you provide.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="problem">Problem it Solves</Label>
                <Textarea
                  id="problem"
                  value={form.problemStatement}
                  onChange={set("problemStatement")}
                  placeholder="What pain point does this product eliminate?"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="solution">The Solution</Label>
                <Textarea
                  id="solution"
                  value={form.solution}
                  onChange={set("solution")}
                  placeholder="How does your product solve this problem?"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unique">What makes it unique?</Label>
                <Textarea
                  id="unique"
                  value={form.uniqueValue}
                  onChange={set("uniqueValue")}
                  placeholder="Why should developers choose this over alternatives?"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Section: Platforms */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Platforms & Availability
              </h2>
              <p className="text-sm text-slate-500">
                Where can developers use your product?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PLATFORMS.map((platform) => (
                <div
                  key={platform.id}
                  className="flex flex-row items-start space-y-0 space-x-3 rounded-md border border-slate-200 p-4 shadow-sm"
                >
                  <Checkbox
                    id={`platform-${platform.id}`}
                    checked={form.platforms.includes(platform.label)}
                    onCheckedChange={() => togglePlatform(platform.label)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label
                      htmlFor={`platform-${platform.id}`}
                      className="cursor-pointer font-medium text-slate-700"
                    >
                      {platform.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Links */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Links, Media & Socials
              </h2>
              <p className="text-sm text-slate-500">
                Where can people find your product and community?
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="url">Website URL *</Label>
                  <div className="relative">
                    <Globe className="absolute top-2.5 left-3 size-4 text-slate-400" />
                    <Input
                      id="url"
                      type="url"
                      value={form.websiteUrl}
                      onChange={set("websiteUrl")}
                      placeholder="https://example.com"
                      className="pl-9"
                    />
                  </div>
                  {errors.websiteUrl && (
                    <p className="text-xs text-red-500">
                      {errors.websiteUrl[0]}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    type="url"
                    value={form.logoUrl}
                    onChange={set("logoUrl")}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github">GitHub Repository</Label>
                  <div className="relative">
                    <Code2 className="absolute top-2.5 left-3 size-4 text-slate-400" />
                    <Input
                      id="github"
                      type="url"
                      value={form.githubUrl}
                      onChange={set("githubUrl")}
                      placeholder="https://github.com/your-repo"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="twitter">X (Twitter)</Label>
                  <div className="relative">
                    <Hash className="absolute top-2.5 left-3 size-4 text-slate-400" />
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
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Briefcase className="absolute top-2.5 left-3 size-4 text-slate-400" />
                    <Input
                      id="linkedin"
                      type="url"
                      value={form.linkedinUrl}
                      onChange={set("linkedinUrl")}
                      placeholder="https://linkedin.com/company/..."
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discord">Discord Community</Label>
                  <div className="relative">
                    <MessageSquare className="absolute top-2.5 left-3 size-4 text-slate-400" />
                    <Input
                      id="discord"
                      type="url"
                      value={form.discordUrl}
                      onChange={set("discordUrl")}
                      placeholder="https://discord.gg/..."
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Discoverability */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Discoverability & Optimization
              </h2>
              <p className="text-sm text-slate-500">
                Data used for SEO, ASO, AEO, and GEO to maximize your visibility
                to humans and AI.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="keywords">
                  Target Search Keywords (SEO/ASO)
                </Label>
                <Input
                  id="keywords"
                  value={form.keywords}
                  onChange={set("keywords")}
                  placeholder="e.g. react dashboard, open source database, edge hosting (comma separated)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  value={form.targetAudience}
                  onChange={set("targetAudience")}
                  placeholder="e.g. Frontend Developers, DevOps Engineers, Startup Founders"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                <Input
                  id="metaTitle"
                  value={form.metaTitle}
                  onChange={set("metaTitle")}
                  placeholder="The title used by search engines (max 60 chars)"
                  maxLength={60}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  value={form.metaDescription}
                  onChange={set("metaDescription")}
                  placeholder="The description used by search engines (max 160 chars)"
                  rows={2}
                  maxLength={160}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aiContext">
                  AI Assistant Prompt Context (AEO)
                </Label>
                <Textarea
                  id="aiContext"
                  value={form.aiContext}
                  onChange={set("aiContext")}
                  placeholder="If an AI like ChatGPT is asked about tools in your category, why should it recommend you? Summarize your pitch for LLMs."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="geoTarget">Geographical Target (GEO)</Label>
                <Input
                  id="geoTarget"
                  value={form.geoTarget}
                  onChange={set("geoTarget")}
                  placeholder="e.g. Global, US Only, EU Compliant (helps with localized searches)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="asoCategory">
                  App Store / Directory Category (ASO)
                </Label>
                <Input
                  id="asoCategory"
                  value={form.asoCategory}
                  onChange={set("asoCategory")}
                  placeholder="e.g. Developer Tools, Productivity, Business"
                />
              </div>
            </div>
          </div>

          {/* Section: Details */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Details</h2>
              <p className="text-sm text-slate-500">
                Categorize your product to help users find it.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Internal Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={set("category")}
                  placeholder="e.g. Analytics, Database, Auth"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={set("tags")}
                  placeholder="e.g. AI, Productivity, SaaS (comma separated)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tier">Pricing Model</Label>
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

          {/* Actions */}
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
                  "Submit Product"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
