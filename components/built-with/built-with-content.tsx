import { AI_PROMPTS } from "@/lib/prompts"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BuiltWithList } from "./built-with-list"

export const BuiltWithContent = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Built With"
        description="Explore the best products built with modern developer tools, APIs, and infrastructure"
        aiPrompt={AI_PROMPTS.discover}
      />

      <div className="flex w-full flex-1 flex-col">
        <Tabs defaultValue="products" className="flex w-full flex-col">
          <div className="px-6 md:px-8">
            <TabsList variant="line" className="w-full justify-start border-b border-slate-200 pb-0 gap-6">
              <TabsTrigger value="products" className="text-sm pb-3 px-1">
                Products
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-sm pb-3 px-1">
                Trending
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="mt-0">
            <BuiltWithList />
          </TabsContent>

          <TabsContent value="trending" className="mt-0">
            <BuiltWithList showMedals={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
