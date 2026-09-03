"use client"

import { PageHeader } from "@/components/shared/page-header"
import { AI_PROMPTS } from "@/lib/prompts"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PRICING } from "@/constants/tiers"

export const ShowcaseContent = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50 pb-20">
      <PageHeader
        heading="Showcase a Build"
        description="Share what you've built and the tools you used to build it."
        aiPrompt={AI_PROMPTS.home}
      />

      <div className="flex w-full flex-1 flex-col bg-white">
        <form className="flex flex-col">
          {/* Section: Project Information */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Project Information</h2>
              <p className="text-sm text-slate-500">
                The basic details about your project.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" placeholder="e.g. Acme Dashboard" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" placeholder="Brief, catchy description (max 60 chars)" maxLength={60} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="What does your project do?" 
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Section: Tech Stack */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tech Stack</h2>
              <p className="text-sm text-slate-500">
                What developer tools and APIs did you use to build this?
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tools">Built With</Label>
                <Input id="tools" placeholder="e.g. Next.js, Supabase, Tailwind CSS, Vercel (comma separated)" />
              </div>
            </div>
          </div>

          {/* Section: Links & Media */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Links & Media</h2>
              <p className="text-sm text-slate-500">
                Where can people find your project?
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="url">Website URL</Label>
                <Input id="url" type="url" placeholder="https://example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" type="url" placeholder="https://example.com/logo.png" />
              </div>
            </div>
          </div>

          {/* Section: Details */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Details</h2>
              <p className="text-sm text-slate-500">
                Additional information about your project.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
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
              Submit Showcase
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
