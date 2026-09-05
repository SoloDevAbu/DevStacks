import { AI_PROMPTS } from "@/lib/prompts"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BuiltWithList } from "./built-with-list"

export const BuiltWithContent = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Built With"
        description="Explore real products and developer projects built with modern tools, APIs, and infrastructure"
        aiPrompt={AI_PROMPTS.builtWith}
      />

      <div className="flex w-full flex-1 flex-col">
        <Tabs defaultValue="all" className="flex w-full flex-col">
          <div className="border-b border-dashed border-border bg-white px-6 md:px-8">
            <TabsList
              variant="line"
              className="w-full justify-start gap-6 border-b-0 pb-0"
            >
              <TabsTrigger value="all" className="px-1 pb-3 text-sm">
                Latest Builds
              </TabsTrigger>
              <TabsTrigger value="trending" className="px-1 pb-3 text-sm">
                Most Liked
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <BuiltWithList sortBy="recent" />
          </TabsContent>

          <TabsContent value="trending" className="mt-0">
            <BuiltWithList sortBy="likes" showMedals={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
