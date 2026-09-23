"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/constants/routes"
import { useUpdateTool } from "@/hooks/tools/use-update-tool"
import {
  dashboardPageContainer,
  dashboardFormSection,
  dashboardFormSectionTitle,
  dashboardFormSectionSubtitle,
} from "@/utils/dashboard/styles"
import type { DbTool } from "@/types/entities"

interface ToolEditFormProps {
  tool: DbTool & {
    categoryName?: string
    faqs?: Array<{ id?: string; question: string; answer: string }>
  }
}

export const ToolEditForm = ({ tool }: ToolEditFormProps) => {
  const router = useRouter()
  const updateMutation = useUpdateTool(tool.slug)

  const [name, setName] = useState<string>(tool.name || "")
  const [tagline, setTagline] = useState<string>(tool.tagline || "")
  const [description, setDescription] = useState<string>(tool.description || "")
  const [websiteUrl, setWebsiteUrl] = useState<string>(tool.websiteUrl || "")
  const [logoUrl, setLogoUrl] = useState(tool.logoUrl || "")
  const [category, setCategory] = useState(tool.category || "")
  const [tags, setTags] = useState(tool.tags?.join(", ") || "")
  const [pricing, setPricing] = useState(tool.pricing || "Free")

  // Deep dive
  const [problemStatement, setProblemStatement] = useState(
    tool.problemStatement || ""
  )
  const [solution, setSolution] = useState(tool.solution || "")
  const [uniqueValue, setUniqueValue] = useState(tool.uniqueValue || "")
  const [useCases, setUseCases] = useState(tool.useCases || "")

  // Social & Store Links
  const [githubUrl, setGithubUrl] = useState(tool.githubUrl || "")
  const [twitterUrl, setTwitterUrl] = useState(tool.twitterUrl || "")
  const [linkedinUrl, setLinkedinUrl] = useState(tool.linkedinUrl || "")
  const [discordUrl, setDiscordUrl] = useState(tool.discordUrl || "")
  const [demoVideoUrl, setDemoVideoUrl] = useState(tool.demoVideoUrl || "")
  const [appStoreUrl, setAppStoreUrl] = useState(tool.appStoreUrl || "")
  const [playStoreUrl, setPlayStoreUrl] = useState(tool.playStoreUrl || "")
  const [chromeExtensionUrl, setChromeExtensionUrl] = useState(
    tool.chromeExtensionUrl || ""
  )

  // FAQs
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    tool.faqs?.map((f) => ({ question: f.question, answer: f.answer })) || []
  )

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }])
  }

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index))
  }

  const updateFaq = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaqs((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSuccess(false)

    if (!name.trim() || !tagline.trim() || !description.trim() || !websiteUrl.trim()) {
      setErrorMessage("Please fill in all required fields (Name, Tagline, Description, Website URL).")
      return
    }

    const payload = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      websiteUrl: websiteUrl.trim(),
      logoUrl: logoUrl.trim() || undefined,
      category: category.trim() || undefined,
      pricing,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      problemStatement: problemStatement.trim() || undefined,
      solution: solution.trim() || undefined,
      uniqueValue: uniqueValue.trim() || undefined,
      useCases: useCases.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      twitterUrl: twitterUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      discordUrl: discordUrl.trim() || undefined,
      demoVideoUrl: demoVideoUrl.trim() || undefined,
      appStoreUrl: appStoreUrl.trim() || undefined,
      playStoreUrl: playStoreUrl.trim() || undefined,
      chromeExtensionUrl: chromeExtensionUrl.trim() || undefined,
      faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setIsSuccess(true)
        setTimeout(() => {
          router.push(ROUTES.DASHBOARD_TOOLS)
        }, 1200)
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update developer tool."
        setErrorMessage(msg)
      },
    })
  }

  return (
    <div className={dashboardPageContainer}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-dashed border-border bg-white px-6 py-6 md:px-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1 border-slate-200 text-xs text-slate-700"
              render={<Link href={ROUTES.DASHBOARD_TOOLS} />}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-widest text-[#a06138] uppercase">
                  Developer Tool Editor
                </span>
                <Badge variant="outline" className="border-dashed text-[10px]">
                  {tool.tier}
                </Badge>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                Edit {tool.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              render={<Link href={ROUTES.TOOL(tool.slug)} target="_blank" />}
            >
              <span>Preview Live</span>
              <ExternalLink className="ml-1 size-3 text-slate-400" />
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={updateMutation.isPending}
              className="h-8 gap-1.5 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {errorMessage && (
          <div className="border-b border-rose-200 bg-rose-50 px-6 py-3 text-xs font-semibold text-rose-800 md:px-8">
            {errorMessage}
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center gap-2 border-b border-emerald-200 bg-emerald-50 px-6 py-3 text-xs font-semibold text-emerald-800 md:px-8">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Developer tool updated successfully! Redirecting...</span>
          </div>
        )}

        {/* Section 1: General Info */}
        <div className={dashboardFormSection}>
          <div>
            <h2 className={dashboardFormSectionTitle}>General Information</h2>
            <p className={dashboardFormSectionSubtitle}>
              Core identity, API descriptions, and categories.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">
                Tool / API Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tool name"
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tagline" className="text-xs font-semibold">
                Tagline <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Developer-focused tagline"
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Full Documentation & Overview <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed explanation of your developer tool..."
              className="min-h-24 text-xs leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category" className="text-xs font-semibold">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Database, Auth, Devops"
                className="h-9 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tags" className="text-xs font-semibold">
                Tags (comma separated)
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. api, sdk, drizzle"
                className="h-9 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pricing" className="text-xs font-semibold">
                Pricing Model
              </Label>
              <select
                id="pricing"
                value={pricing}
                onChange={(e) => setPricing(e.target.value as any)}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800"
              >
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Links */}
        <div className={dashboardFormSection}>
          <div>
            <h2 className={dashboardFormSectionTitle}>Official Links</h2>
            <p className={dashboardFormSectionSubtitle}>
              Documentation, website, and repository links.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="websiteUrl" className="text-xs font-semibold">
                Website / Docs URL <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://tool.dev"
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="logoUrl" className="text-xs font-semibold">
                Logo URL (leave blank for auto-favicon)
              </Label>
              <Input
                id="logoUrl"
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://tool.dev/logo.png"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="githubUrl" className="text-xs font-semibold">
                GitHub Repository
              </Label>
              <Input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="h-9 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="twitterUrl" className="text-xs font-semibold">
                Twitter / X
              </Label>
              <Input
                id="twitterUrl"
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://x.com/..."
                className="h-9 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="discordUrl" className="text-xs font-semibold">
                Discord Community
              </Label>
              <Input
                id="discordUrl"
                type="url"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                placeholder="https://discord.gg/..."
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Deep Dive */}
        <div className={dashboardFormSection}>
          <div>
            <h2 className={dashboardFormSectionTitle}>Deep Dive & Problem Solving</h2>
            <p className={dashboardFormSectionSubtitle}>
              Technical deep dive into the architecture and capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="problem" className="text-xs font-semibold">
                Problem Solved
              </Label>
              <Textarea
                id="problem"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="What engineering bottleneck does this solve?"
                className="min-h-20 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="solution" className="text-xs font-semibold">
                Solution & Architecture
              </Label>
              <Textarea
                id="solution"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Architecture, protocols, or benchmarks..."
                className="min-h-20 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="uniqueValue" className="text-xs font-semibold">
              Unique Value Proposition
            </Label>
            <Input
              id="uniqueValue"
              value={uniqueValue}
              onChange={(e) => setUniqueValue(e.target.value)}
              placeholder="Why developers choose this over alternatives..."
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Section 4: FAQs */}
        <div className={dashboardFormSection}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={dashboardFormSectionTitle}>Developer FAQs</h2>
              <p className={dashboardFormSectionSubtitle}>
                Common questions on pricing, rate limits, self-hosting, and integrations.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addFaq}
              className="h-8 gap-1 text-xs"
            >
              <Plus className="size-3.5" />
              <span>Add FAQ</span>
            </Button>
          </div>

          {faqs.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No FAQs added yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFaq(idx, "question", e.target.value)}
                      placeholder="Question"
                      className="h-8 text-xs font-semibold bg-white"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFaq(idx)}
                      className="h-8 size-8 p-0 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                    placeholder="Answer..."
                    className="min-h-16 text-xs bg-white"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 border-b border-dashed border-border bg-white px-6 py-4 md:px-8">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs"
            render={<Link href={ROUTES.DASHBOARD_TOOLS} />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={updateMutation.isPending}
            className="gap-1.5 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
