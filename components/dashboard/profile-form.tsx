"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import {
  User,
  Globe,
  Plus,
  ExternalLink,
  Loader2,
  Sparkles,
  Check,
  X,
} from "lucide-react"
import { useDebounce } from "@/hooks/shared/use-debounce"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { MakerProfileCard } from "@/components/shared/maker-profile-card"
import { FaqBuilder } from "@/components/shared/faq-builder"
import { useUpdateProfile } from "@/hooks/users/use-update-profile"
import { toast } from "@/components/ui/toast"
import { ROUTES } from "@/constants/routes"
import {
  socialInputWrapper,
  socialInputIconContainer,
  socialInputWithIcon,
} from "@/utils/styles"
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

  const activeUsername = username.trim().toLowerCase().replace(/^@/, "")

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col">
      {/* Live Preview Bar */}
      <div className="flex flex-col border-b border-dashed border-border bg-slate-50/50">
        <div className="flex items-center justify-between border-b border-dashed border-border px-6 py-4 md:px-8">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sparkles className="size-4 text-amber-500" />
              Live Preview
            </h2>
            <p className="text-xs text-slate-500">
              How other developers and AI agents see your maker badge across
              directory cards and tools.
            </p>
          </div>
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
        <div className="px-6 py-6 md:px-8">
          <MakerProfileCard
            name={name || "Your Name"}
            username={activeUsername || "username"}
            avatarUrl={initialProfile.avatarUrl ?? initialProfile.image}
            country={initialProfile.country}
            state={initialProfile.state}
            size="md"
          />
        </div>
      </div>

      {/* Section 1: Identity */}
      <div className="flex flex-col border-b border-dashed border-border">
        <div className="flex flex-col gap-1 border-b border-dashed border-border bg-slate-50/40 px-6 py-4 md:px-8">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <User className="size-4 text-slate-500" />
            Maker Identity
          </h2>
          <p className="text-xs text-slate-500">
            Your public handle, display name, and introduction.
          </p>
        </div>
        <div className="bg-white px-6 py-6 md:px-8">
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
        </div>
      </div>

      {/* Section 2: Social & Portfolio Links */}
      <div className="flex flex-col border-b border-dashed border-border">
        <div className="flex flex-col gap-1 border-b border-dashed border-border bg-slate-50/40 px-6 py-4 md:px-8">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Globe className="size-4 text-slate-500" />
            Social & Portfolio Links
          </h2>
          <p className="text-xs text-slate-500">
            Links displayed on your maker profile and indexed in search and AI
            engine results.
          </p>
        </div>
        <div className="bg-white px-6 py-6 md:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel
                htmlFor="websiteUrl"
                className="flex items-center gap-1.5"
              >
                Portfolio / Website
              </FieldLabel>
              <div className={socialInputWrapper}>
                <div className={socialInputIconContainer}>
                  <Image
                    src="/social-logo/world-wide-web.png"
                    alt="Website"
                    width={16}
                    height={16}
                    className="size-4 rounded-xs object-contain"
                  />
                </div>
                <Input
                  id="websiteUrl"
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev or yourportfolio.dev"
                  className={socialInputWithIcon}
                />
              </div>
            </Field>

            <Field>
              <FieldLabel
                htmlFor="githubUrl"
                className="flex items-center gap-1.5"
              >
                GitHub Profile
              </FieldLabel>
              <div className={socialInputWrapper}>
                <div className={socialInputIconContainer}>
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
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/handle or github.com/handle"
                  className={socialInputWithIcon}
                />
              </div>
            </Field>

            <Field>
              <FieldLabel
                htmlFor="twitterUrl"
                className="flex items-center gap-1.5"
              >
                Twitter / X Profile
              </FieldLabel>
              <div className={socialInputWrapper}>
                <div className={socialInputIconContainer}>
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
                  type="text"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/handle or x.com/handle"
                  className={socialInputWithIcon}
                />
              </div>
            </Field>

            <Field>
              <FieldLabel
                htmlFor="linkedinUrl"
                className="flex items-center gap-1.5"
              >
                LinkedIn Profile
              </FieldLabel>
              <div className={socialInputWrapper}>
                <div className={socialInputIconContainer}>
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
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/handle or linkedin.com/in/handle"
                  className={socialInputWithIcon}
                />
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* Section 3: Maker FAQs */}
      <div className="flex flex-col border-b border-dashed border-border">
        <div className="flex items-center justify-between border-b border-dashed border-border bg-slate-50/40 px-6 py-4 md:px-8">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              Maker FAQs
            </h2>
            <p className="text-xs text-slate-500">
              Frequently asked questions about you, your tech stack,
              availability, or roadmap.
            </p>
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
        <div className="bg-white px-6 py-6 md:px-8">
          <FaqBuilder
            faqs={faqs}
            onChange={setFaqs}
            questionPlaceholder="e.g. What tech stacks do you specialize in?"
            answerPlaceholder="e.g. I work primarily with Next.js, TypeScript, PostgreSQL, and Cloudflare workers."
            emptyPrompt="No personal FAQs added yet. Add common questions like your primary tech stacks, freelance availability, or what you are building next."
          />
        </div>
      </div>

      {/* Submit Toolbar */}
      <div className="flex items-center justify-end gap-3 border-b border-dashed border-border bg-slate-50/80 px-6 py-4 md:px-8">
        {activeUsername && (
          <Button variant="outline" size="sm">
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
