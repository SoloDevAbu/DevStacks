"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import {
  User,
  MapPin,
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Sparkles,
  Check,
  X,
} from "lucide-react"
import { useDebounce } from "@/hooks/shared/use-debounce"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { MakerProfileCard } from "@/components/shared/maker-profile-card"
import { FaqBuilder } from "@/components/shared/faq-builder"
import {
  countryCodeToFlag,
  countryCodeToName,
  formatLocation,
} from "@/utils/country"
import { useUpdateProfile } from "@/hooks/users/use-update-profile"
import { toast } from "@/components/ui/toast"
import { ROUTES } from "@/constants/routes"
import type { MakerProfile } from "@/types/entities"

interface ProfileFormProps {
  initialProfile: MakerProfile
}

export const ProfileForm = ({ initialProfile }: ProfileFormProps) => {
  const [name, setName] = useState(initialProfile.name || "")
  const [username, setUsername] = useState(initialProfile.username || "")
  const [bio, setBio] = useState(initialProfile.bio || "")
  const [description, setDescription] = useState(
    initialProfile.description || ""
  )
  const [websiteUrl, setWebsiteUrl] = useState(initialProfile.websiteUrl || "")
  const [twitterUrl, setTwitterUrl] = useState(initialProfile.twitterUrl || "")
  const [githubUrl, setGithubUrl] = useState(initialProfile.githubUrl || "")
  const [linkedinUrl, setLinkedinUrl] = useState(
    initialProfile.linkedinUrl || ""
  )

  const [usernameStatus, setUsernameStatus] = useState<{
    status: "idle" | "checking" | "available" | "taken" | "invalid"
    message?: string
  }>({ status: "idle" })

  const debouncedUsername = useDebounce(username, 300)

  useEffect(() => {
    const clean = debouncedUsername.trim().toLowerCase().replace(/^@/, "")
    if (!clean) {
      setUsernameStatus({ status: "idle" })
      return
    }

    if (clean.length < 2) {
      setUsernameStatus({ status: "invalid", message: "Minimum 2 characters" })
      return
    }

    if (!/^[a-z0-9_-]+$/i.test(clean)) {
      setUsernameStatus({
        status: "invalid",
        message: "Only letters, numbers, hyphens, underscores",
      })
      return
    }

    let isMounted = true
    setUsernameStatus({ status: "checking" })

    axios
      .get(`/api/users/check-username?username=${encodeURIComponent(clean)}`)
      .then((res) => {
        if (!isMounted) return
        if (res.data.available) {
          setUsernameStatus({
            status: "available",
            message: res.data.isCurrent
              ? "Your current handle"
              : `@${clean} is available`,
          })
        } else {
          setUsernameStatus({
            status: "taken",
            message: res.data.message || `@${clean} is already taken`,
          })
        }
      })
      .catch(() => {
        if (isMounted) setUsernameStatus({ status: "idle" })
      })

    return () => {
      isMounted = false
    }
  }, [debouncedUsername])

  const [faqs, setFaqs] = useState<
    Array<{ id?: string; question: string; answer: string }>
  >(
    initialProfile.faqs?.length > 0
      ? initialProfile.faqs.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
        }))
      : []
  )

  const updateMutation = useUpdateProfile()

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanUsername = username.trim().toLowerCase().replace(/^@/, "")
    if (!cleanUsername) {
      toast.error("Username required", "Please enter a unique username handle.")
      return
    }

    if (cleanUsername.length < 2) {
      toast.error("Invalid username", "Username must be at least 2 characters.")
      return
    }

    // Filter FAQs: remove ones where both are blank
    const nonBlankFaqs = faqs
      .map((f) => ({
        id: f.id,
        question: f.question.trim(),
        answer: f.answer.trim(),
      }))
      .filter((f) => f.question || f.answer)

    const incomplete = nonBlankFaqs.find((f) => !f.question || !f.answer)
    if (incomplete) {
      toast.error(
        "Incomplete FAQ",
        "Every added FAQ must have both a question and an answer."
      )
      return
    }

    updateMutation.mutate(
      {
        name: name.trim(),
        username: cleanUsername,
        bio: bio.trim(),
        description: description.trim(),
        websiteUrl: websiteUrl.trim(),
        twitterUrl: twitterUrl.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        faqs: nonBlankFaqs,
      },
      {
        onSuccess: (data) => {
          toast.success(
            "Profile saved successfully",
            "Your maker profile, handle, and FAQs are now live."
          )
          if (data?.username) {
            setUsername(data.username)
          }
        },
        onError: (err: unknown) => {
          interface ApiErrorResponse {
            response?: {
              data?: {
                error?: string
                details?: Record<string, string[]>
              }
            }
            message?: string
          }
          const axiosErr = err as ApiErrorResponse
          const message =
            axiosErr.response?.data?.error ||
            axiosErr.message ||
            "Failed to save profile. Please review the inputs and try again."

          toast.error("Unable to update profile", message)
        },
      }
    )
  }

  const flag = countryCodeToFlag(initialProfile.country)
  const countryName = countryCodeToName(initialProfile.country)
  const formattedLocation = formatLocation(
    initialProfile.country,
    initialProfile.state
  )

  const activeUsername = username.trim().toLowerCase().replace(/^@/, "")

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Live Preview Bar */}
      <Card className="rounded-none border-dashed border-border bg-slate-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sparkles className="size-4 text-amber-500" />
              Live Preview
            </CardTitle>
            {activeUsername && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Link
                  href={ROUTES.MAKER(activeUsername)}
                  target="_blank"
                  className="flex items-center gap-1"
                >
                  <span>View Public Profile</span>
                  <ExternalLink className="size-3" />
                </Link>
              </Button>
            )}
          </div>
          <CardDescription className="text-xs text-slate-500">
            How other developers and AI agents see your maker badge across
            directory cards and tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MakerProfileCard
            name={name || "Your Name"}
            username={activeUsername || "username"}
            avatarUrl={initialProfile.avatarUrl ?? initialProfile.image}
            country={initialProfile.country}
            state={initialProfile.state}
            size="md"
          />
        </CardContent>
      </Card>

      {/* Section 1: Identity */}
      <Card className="rounded-none border-dashed border-border bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <User className="size-4 text-slate-500" />
            Maker Identity
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Your public handle, display name, and introduction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name">Display Name</FieldLabel>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="username">Username (Handle)</FieldLabel>
                <div className="relative">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
                      )
                    }
                    placeholder="e.g. satoshi"
                    className="pr-9"
                    required
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {usernameStatus.status === "checking" && (
                      <Loader2 className="size-4 animate-spin text-slate-400" />
                    )}
                    {usernameStatus.status === "available" && (
                      <Check className="size-4 text-emerald-600" />
                    )}
                    {(usernameStatus.status === "taken" ||
                      usernameStatus.status === "invalid") && (
                      <X className="size-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Public URL: /makers/{activeUsername || "username"}
                  </span>
                  {usernameStatus.message && (
                    <span
                      className={
                        usernameStatus.status === "available"
                          ? "font-medium text-emerald-600"
                          : usernameStatus.status === "checking"
                            ? "text-slate-400"
                            : "font-medium text-red-500"
                      }
                    >
                      {usernameStatus.message}
                    </span>
                  )}
                </div>
              </Field>
            </div>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="bio">One-Liner Bio</FieldLabel>
                <span className="text-[11px] text-slate-400">
                  {bio.length}/160
                </span>
              </div>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                placeholder="e.g. Indie hacker building developer tools and open source software"
              />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="description">
                  About You (Full Description)
                </FieldLabel>
                <span className="text-[11px] text-slate-400">
                  {description.length}/5000
                </span>
              </div>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={5000}
                rows={4}
                placeholder="Share your engineering background, what you love to build, tech stacks you specialize in, and what projects you are actively launching..."
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Section 2: Location (Read-Only) */}
      {/* <Card className="rounded-none border-dashed border-border bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <MapPin className="size-4 text-slate-500" />
            Location & Country
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Location detected during your sign-in to display your country flag
            on submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl select-none">{flag || "🌐"}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {formattedLocation || countryName || "Global / Worldwide"}
                </p>
                <p className="text-xs text-slate-500">
                  {initialProfile.country
                    ? `ISO Code: ${initialProfile.country}`
                    : "No specific region detected"}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-dashed text-xs text-slate-500"
            >
              Auto-verified on Sign-in
            </Badge>
          </div>
        </CardContent>
      </Card> */}

      {/* Section 3: Social & Portfolio Links */}
      <Card className="rounded-none border-dashed border-border bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Globe className="size-4 text-slate-500" />
            Social & Portfolio Links
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Links displayed on your maker profile and indexed in search and AI
            engine results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="websiteUrl">Portfolio / Website</FieldLabel>
              <Input
                id="websiteUrl"
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourportfolio.dev or yourportfolio.dev"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="githubUrl">GitHub Profile</FieldLabel>
              <Input
                id="githubUrl"
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/handle or github.com/handle"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="twitterUrl">Twitter / X Profile</FieldLabel>
              <Input
                id="twitterUrl"
                type="text"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://x.com/handle or x.com/handle"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="linkedinUrl">LinkedIn Profile</FieldLabel>
              <Input
                id="linkedinUrl"
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/handle or linkedin.com/in/handle"
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Maker FAQs */}
      <Card className="rounded-none border-dashed border-border bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                Maker FAQs
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Frequently asked questions about you, your tech stack,
                availability, or roadmap.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFaq}
              className="gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>Add Question</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <FaqBuilder
            faqs={faqs}
            onChange={setFaqs}
            questionPlaceholder="e.g. What tech stacks do you specialize in?"
            answerPlaceholder="e.g. I work primarily with Next.js, TypeScript, PostgreSQL, and Cloudflare workers."
            emptyPrompt="No personal FAQs added yet. Add common questions like your primary tech stacks, freelance availability, or what you are building next."
          />
        </CardContent>
      </Card>

      {/* Submit Toolbar */}
      <div className="flex items-center justify-end gap-3 pt-4">
        {activeUsername && (
          <Button variant="outline">
            <Link href={ROUTES.MAKER(activeUsername)} target="_blank">
              Preview Profile
            </Link>
          </Button>
        )}
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="min-w-32 cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Profile</span>
          )}
        </Button>
      </div>
    </form>
  )
}
