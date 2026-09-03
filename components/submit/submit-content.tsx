"use client"

import { PageHeader } from "@/components/shared/page-header"
import { AI_PROMPTS } from "@/lib/prompts"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Globe, MessageSquare, Code2, Hash, Briefcase } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PRICING } from "@/constants/tiers"
import { PLATFORMS } from "@/constants/platforms"

export const SubmitContent = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50 pb-20">
      <PageHeader
        heading="Submit a Product"
        description="List your developer tool, API, or infrastructure product for the community to discover."
        aiPrompt={AI_PROMPTS.home}
      />

      <div className="flex w-full flex-1 flex-col bg-white">
        <form className="flex flex-col">
          {/* Section: General Information */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">General Information</h2>
              <p className="text-sm text-slate-500">
                The basic details about your product.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Next.js" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" placeholder="Brief, catchy description (max 60 chars)" maxLength={60} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="What does your product do? Why should developers use it?" 
                  rows={4}
                />
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
                <Textarea id="problem" placeholder="What pain point does this product eliminate?" rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="solution">The Solution</Label>
                <Textarea id="solution" placeholder="How does your product solve this problem?" rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unique">What makes it unique?</Label>
                <Textarea id="unique" placeholder="Why should developers choose this over alternatives?" rows={3} />
              </div>
            </div>
          </div>

          {/* Section: Platforms */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Platforms & Availability</h2>
              <p className="text-sm text-slate-500">
                Where can developers use your product?
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORMS.map((platform) => (
                <div key={platform.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-slate-200 p-4 shadow-sm">
                  <Checkbox id={`platform-${platform.id}`} />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor={`platform-${platform.id}`} className="font-medium text-slate-700 cursor-pointer">
                      {platform.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Links, Media & Socials */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Links, Media & Socials</h2>
              <p className="text-sm text-slate-500">
                Where can people find your product and your community?
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="url">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 size-4 text-slate-400" />
                    <Input id="url" type="url" placeholder="https://example.com" className="pl-9" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input id="logo" type="url" placeholder="https://example.com/logo.png" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github">GitHub Repository</Label>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-2.5 size-4 text-slate-400" />
                    <Input id="github" type="url" placeholder="https://github.com/your-repo" className="pl-9" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="twitter">X (Twitter)</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 size-4 text-slate-400" />
                    <Input id="twitter" type="url" placeholder="https://x.com/your_handle" className="pl-9" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 size-4 text-slate-400" />
                    <Input id="linkedin" type="url" placeholder="https://linkedin.com/company/..." className="pl-9" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discord">Discord Community</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-2.5 size-4 text-slate-400" />
                    <Input id="discord" type="url" placeholder="https://discord.gg/..." className="pl-9" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Discoverability & SEO */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Discoverability & Optimization</h2>
              <p className="text-sm text-slate-500">
                Data used for SEO, ASO, AEO, and GEO to maximize your visibility to humans and AI.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="keywords">Target Search Keywords (SEO/ASO)</Label>
                <Input id="keywords" placeholder="e.g. react dashboard, open source database, edge hosting (comma separated)" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input id="audience" placeholder="e.g. Frontend Developers, DevOps Engineers, Startup Founders" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                <Input id="metaTitle" placeholder="The title used by search engines (max 60 chars)" maxLength={60} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea id="metaDescription" placeholder="The description used by search engines (max 160 chars)" rows={2} maxLength={160} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aiContext">AI Assistant Prompt Context (AEO)</Label>
                <Textarea id="aiContext" placeholder="If an AI like ChatGPT is asked about tools in your category, why should it recommend you? Summarize your pitch for LLMs." rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="geoTarget">Geographical Target (GEO)</Label>
                <Input id="geoTarget" placeholder="e.g. Global, US Only, EU Compliant (helps with localized searches)" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="asoCategory">App Store / Directory Category (ASO)</Label>
                <Input id="asoCategory" placeholder="e.g. Developer Tools, Productivity, Business" />
              </div>
            </div>
          </div>

          {/* Section: Details */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Details</h2>
              <p className="text-sm text-slate-500">
                Categorize your product to help users find it on our platform.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Internal Category</Label>
                <Input id="category" placeholder="e.g. Analytics, Database, Auth" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="e.g. AI, Productivity, SaaS (comma separated)" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tier">Pricing Model</Label>
                <Select>
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

          {/* Section: Actions */}
          <div className="flex items-center justify-end gap-3 bg-slate-50/50 px-6 py-6 md:px-8">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">
              Submit Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
