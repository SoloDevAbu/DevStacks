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
import { TIER } from "@/constants/tiers"

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
                <Input id="tagline" placeholder="Brief, catchy description (max 60 chars)" />
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

          {/* Section: Links & Media */}
          <div className="flex flex-col gap-6 border-b border-dashed border-border px-6 py-8 md:px-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Links & Media</h2>
              <p className="text-sm text-slate-500">
                Where can people find your product?
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
                Categorize your product to help users find it.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="e.g. AI, Productivity, SaaS (comma separated)" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tier">Pricing Tier</Label>
                <Select>
                  <SelectTrigger id="tier">
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TIER).map((tier) => (
                      <SelectItem key={tier} value={tier}>
                        {tier}
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
