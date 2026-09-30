"use client"

import { useState, useEffect } from "react"
import {
  ExternalLink,
  Save,
  Wrench,
  Package,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { NativeSelect } from "@/components/ui/native-select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/toast"
import { formatCommentTime } from "@/utils/date"
import type { AdminSubmissionItem } from "@/db/queries/admin/submissions"
import type { Tier, Pricing } from "@/constants/plans"

export type AdminEditDialogProps = {
  item: AdminSubmissionItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (
    type: "tool" | "product",
    id: string,
    data: Record<string, unknown>
  ) => Promise<unknown>
  isSaving?: boolean
}

export const AdminEditDialog = ({
  item,
  open,
  onOpenChange,
  onSave,
  isSaving = false,
}: AdminEditDialogProps) => {
  const [name, setName] = useState("")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending"
  )
  const [tier, setTier] = useState<Tier>("free")
  const [pricing, setPricing] = useState<Pricing>("Free")
  const [category, setCategory] = useState("")
  const [tagsString, setTagsString] = useState("")
  const [launchYear, setLaunchYear] = useState<number | "">("")
  const [launchWeek, setLaunchWeek] = useState<number | "">("")
  const [problemStatement, setProblemStatement] = useState("")
  const [solution, setSolution] = useState("")
  const [uniqueValue, setUniqueValue] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [twitterUrl, setTwitterUrl] = useState("")
  const [demoVideoUrl, setDemoVideoUrl] = useState("")

  useEffect(() => {
    if (item) {
      setName(item.name || "")
      setTagline(item.tagline || "")
      setDescription(item.description || "")
      setWebsiteUrl(item.websiteUrl || "")
      setLogoUrl(item.logoUrl || "")
      setStatus(item.status || "pending")
      setTier(item.tier || "free")
      setPricing(item.pricing || "Free")
      setCategory(item.category || "")
      setTagsString(Array.isArray(item.tags) ? item.tags.join(", ") : "")
      setLaunchYear(item.launchYear ?? "")
      setLaunchWeek(item.launchWeek ?? "")
      setProblemStatement(item.problemStatement || "")
      setSolution(item.solution || "")
      setUniqueValue(item.uniqueValue || "")
      setGithubUrl(item.githubUrl || "")
      setTwitterUrl(item.twitterUrl || "")
      setDemoVideoUrl(item.demoVideoUrl || "")
    }
  }, [item])

  if (!item) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Name required", "Please enter a valid submission name.")
      return
    }

    const tags = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const payload: Record<string, unknown> = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      websiteUrl: websiteUrl.trim(),
      logoUrl: logoUrl.trim() || null,
      status,
      tier,
      pricing,
      category: category.trim() || null,
      tags,
      problemStatement: problemStatement.trim() || null,
      solution: solution.trim() || null,
      uniqueValue: uniqueValue.trim() || null,
      githubUrl: githubUrl.trim() || null,
      twitterUrl: twitterUrl.trim() || null,
      demoVideoUrl: demoVideoUrl.trim() || null,
      launchYear: typeof launchYear === "number" ? launchYear : null,
      launchWeek: typeof launchWeek === "number" ? launchWeek : null,
    }

    try {
      await onSave(item.itemType, item.id, payload)
      toast.success(
        "Listing Updated",
        `Successfully updated ${item.name} (${item.itemType}).`
      )
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save changes"
      toast.error("Update failed", msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {item.itemType === "tool" ? (
              <Wrench className="size-4 text-sky-600" />
            ) : (
              <Package className="size-4 text-violet-600" />
            )}
            <DialogTitle className="text-lg font-bold text-slate-900">
              Review & Moderate Listing: {item.name}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Edit metadata, approve/reject status, adjust launch scheduling, and
            update categorization for this {item.itemType}.
          </DialogDescription>
        </DialogHeader>

        {/* Submitter Info Card */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="size-7">
                {item.submitterAvatarUrl ? (
                  <AvatarImage
                    src={item.submitterAvatarUrl}
                    alt={item.submitterName || "User"}
                  />
                ) : null}
                <AvatarFallback className="text-xs font-semibold bg-slate-900 text-white">
                  {(item.submitterName?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">
                  {item.submitterName || "Maker"}
                </span>
                <span className="text-[11px] text-slate-500">
                  {item.submitterEmail || "No email available"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              {item.submitterCountry ? (
                <span>Country: {item.submitterCountry}</span>
              ) : null}
              <span>
                Submitted: {formatCommentTime(item.createdAt)}
              </span>
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
              >
                <ExternalLink className="size-3" />
                Visit site
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6 mt-2">
          {/* Status & Tier Settings Section */}
          <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
            <h4 className="font-mono text-[11px] font-bold tracking-wider uppercase text-indigo-900 mb-3 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-indigo-600" />
              Listing Moderation Controls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-status">Moderation Status</FieldLabel>
                  <NativeSelect
                    id="edit-status"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "pending" | "approved" | "rejected"
                      )
                    }
                    className="w-full bg-white"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved (Live)</option>
                    <option value="rejected">Rejected (Hidden)</option>
                  </NativeSelect>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-tier">Subscription Tier</FieldLabel>
                  <NativeSelect
                    id="edit-tier"
                    value={tier}
                    onChange={(e) => setTier(e.target.value as Tier)}
                    className="w-full bg-white"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="premium+">Premium+</option>
                  </NativeSelect>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-pricing">Pricing Model</FieldLabel>
                  <NativeSelect
                    id="edit-pricing"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value as Pricing)}
                    className="w-full bg-white"
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                    <option value="Open Source">Open Source</option>
                  </NativeSelect>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-launch-cohort">
                    Cohort (Week / Year)
                  </FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      id="edit-launch-week"
                      type="number"
                      min={1}
                      max={53}
                      placeholder="Wk"
                      value={launchWeek}
                      onChange={(e) =>
                        setLaunchWeek(
                          e.target.value ? parseInt(e.target.value, 10) : ""
                        )
                      }
                      className="bg-white"
                    />
                    <Input
                      id="edit-launch-year"
                      type="number"
                      min={2024}
                      max={2030}
                      placeholder="Year"
                      value={launchYear}
                      onChange={(e) =>
                        setLaunchYear(
                          e.target.value ? parseInt(e.target.value, 10) : ""
                        )
                      }
                      className="bg-white"
                    />
                  </div>
                </Field>
              </FieldGroup>
            </div>
          </div>

          {/* Primary Metadata */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[11px] font-bold tracking-wider uppercase text-slate-700">
              Primary Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-name">Name</FieldLabel>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="edit-website">Website URL</FieldLabel>
                  <Input
                    id="edit-website"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-tagline">Tagline</FieldLabel>
                <Input
                  id="edit-tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="One sentence summary"
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-description">Description</FieldLabel>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Full project description"
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Categorization & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-category">Category</FieldLabel>
                <Input
                  id="edit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Developer Tools, AI, Analytics"
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-tags">
                  Tags (comma separated)
                </FieldLabel>
                <Input
                  id="edit-tags"
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  placeholder="e.g. nextjs, typescript, tailwind"
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Deep Dive Showcase */}
          <div className="flex flex-col gap-4 border-t border-dashed border-slate-200 pt-4">
            <h4 className="font-mono text-[11px] font-bold tracking-wider uppercase text-slate-700">
              Deep Dive Showcase Fields
            </h4>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-problem">Problem Statement</FieldLabel>
                <Textarea
                  id="edit-problem"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  rows={2}
                  placeholder="What pain point does this solve?"
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-solution">Solution</FieldLabel>
                <Textarea
                  id="edit-solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={2}
                  placeholder="How does this solve the problem?"
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-unique-value">Unique Value</FieldLabel>
                <Textarea
                  id="edit-unique-value"
                  value={uniqueValue}
                  onChange={(e) => setUniqueValue(e.target.value)}
                  rows={2}
                  placeholder="Why choose this over competitors?"
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Links & Media */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-dashed border-slate-200 pt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-logo">Logo URL</FieldLabel>
                <Input
                  id="edit-logo"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-github">GitHub URL</FieldLabel>
                <Input
                  id="edit-github"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-twitter">Twitter / X URL</FieldLabel>
                <Input
                  id="edit-twitter"
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/..."
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Images Gallery Preview */}
          {Array.isArray(item.images) && item.images.length > 0 ? (
            <div className="border-t border-dashed border-slate-200 pt-4">
              <h4 className="font-mono text-[11px] font-bold tracking-wider uppercase text-slate-700 mb-2">
                Attached Screenshots ({item.images.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {item.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-md border border-slate-200 bg-slate-100 aspect-video relative group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Screenshot ${idx + 1}`}
                      className="size-full object-cover"
                    />
                    <a
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold"
                    >
                      <ExternalLink className="size-4 mr-1" />
                      View full
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <DialogFooter className="mt-4">
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
            >
              {isSaving ? (
                <Spinner className="size-3.5 mr-1.5" />
              ) : (
                <Save className="size-3.5 mr-1.5" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
