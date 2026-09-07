"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { AI_PROMPTS } from "@/lib/prompts"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useSubmitBuild } from "@/hooks/builds/use-submit-build"
import { submitBuildSchema } from "@/lib/validation/build"
import { useSession } from "@/lib/auth/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const DEFAULT_BUILD_LOGO_BG = "bg-slate-900 text-white"

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

  const { data: session, isPending } = useSession()
  const router = useRouter()
  const { mutate, isPending: isSubmitting, isError, error } = useSubmitBuild()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/?redirect=/showcase")
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

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: [] }))
  }

  const executeSubmit = (userId: string) => {
    const parsed = submitBuildSchema.safeParse({
      authorId: userId,
      name: form.name,
      description: form.description,
      logoText: form.logoText || form.name.slice(0, 2).toUpperCase(),
      logoBg: DEFAULT_BUILD_LOGO_BG,
      productIds: [],
    })

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>)
      return
    }

    mutate(
      {
        authorId: userId,
        name: form.name,
        description: form.description,
        logoText: form.logoText || form.name.slice(0, 2).toUpperCase(),
        logoBg: DEFAULT_BUILD_LOGO_BG,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSubmit(user.id)
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

      {/* Auth Status Bar */}
      <div className="border-b border-dashed border-border bg-white px-6 py-4 md:px-8">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <Avatar className="size-6 border border-border">
            {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
            <AvatarFallback className="bg-slate-900 text-white text-[10px]">
              {user.name?.slice(0, 2).toUpperCase() || "ME"}
            </AvatarFallback>
          </Avatar>
          <span>
            Showcasing as <span className="font-semibold text-slate-900">{user.name || user.email}</span>
          </span>
        </div>
      </div>


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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Spinner className="size-4" /> Submitting...</>
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
