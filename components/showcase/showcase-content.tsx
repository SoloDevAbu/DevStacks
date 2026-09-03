"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { AI_PROMPTS } from "@/lib/prompts"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useSubmitBuild } from "@/hooks/builds/use-submit-build"
import { submitBuildSchema } from "@/lib/validation/build"

const DEMO_USER_ID = "demo-user"
const DEMO_LOGO_BG = "bg-slate-900 text-white"

const emptyForm = {
  name: "",
  description: "",
  logoText: "",
  tools: "",
}

export const ShowcaseContent = () => {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  const { mutate, isPending, isError, error } = useSubmitBuild()

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: [] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation with Zod
    const parsed = submitBuildSchema.safeParse({
      authorId: DEMO_USER_ID,
      name: form.name,
      description: form.description,
      logoText: form.logoText || form.name.slice(0, 2).toUpperCase(),
      logoBg: DEMO_LOGO_BG,
      productIds: [],
    })

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>)
      return
    }

    mutate(
      {
        authorId: DEMO_USER_ID,
        name: form.name,
        description: form.description,
        logoText: form.logoText || form.name.slice(0, 2).toUpperCase(),
        logoBg: DEMO_LOGO_BG,
        productIds: [],
      },
      {
        onSuccess: () => {
          setSubmitted(true)
          setForm(emptyForm)
          setErrors({})
        },
      }
    )
  }

  if (submitted) {
    return (
      <div className="relative flex min-h-full flex-col items-center justify-center gap-6 bg-slate-50/50 p-12 text-center">
        <CheckCircle2 className="size-16 text-emerald-500" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Build Showcased!</h2>
          <p className="mt-2 text-slate-500">Your build is now live in the community showcase.</p>
        </div>
        <Button onClick={() => setSubmitted(false)}>Showcase Another</Button>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50 pb-20">
      <PageHeader
        heading="Showcase a Build"
        description="Share what you've built and the tools you used to build it."
        aiPrompt={AI_PROMPTS.home}
      />

      <div className="flex w-full flex-1 flex-col bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Project Information */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Project Information</h2>
              <p className="text-sm text-slate-500">The basic details about your project.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input id="name" value={form.name} onChange={set("name")} placeholder="e.g. Acme Dashboard" />
                {errors.name && <p className="text-xs text-red-500">{errors.name[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logoText">Logo Text (1–4 chars)</Label>
                <Input id="logoText" value={form.logoText} onChange={set("logoText")} placeholder="e.g. AC" maxLength={4} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea id="description" value={form.description} onChange={set("description")} placeholder="What does your project do?" rows={3} />
                {errors.description && <p className="text-xs text-red-500">{errors.description[0]}</p>}
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tech Stack</h2>
              <p className="text-sm text-slate-500">What developer tools and APIs did you use to build this?</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tools">Built With</Label>
                <Input id="tools" value={form.tools} onChange={set("tools")} placeholder="e.g. Next.js, Supabase, Tailwind CSS, Vercel (comma separated)" />
                <p className="text-xs text-slate-400">
                  Note: Product linking from the directory coming soon.
                </p>
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
              <Button variant="outline" type="button" onClick={() => { setForm(emptyForm); setErrors({}) }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="size-4 animate-spin" /> Submitting...</>
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
