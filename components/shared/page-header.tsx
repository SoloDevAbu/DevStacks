import Image from "next/image"
import { HoverOutline } from "@/components/shared/hover-outline"
import { AI_PROVIDERS } from "@/constants/ai-providers"

interface PageHeaderProps {
  heading: string
  description: string
  aiPrompt?: string
}

export const PageHeader = ({
  heading,
  description,
  aiPrompt = "",
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col justify-between gap-6 border-b border-dashed border-border bg-white px-6 pt-8 pb-6 md:px-8 lg:flex-row lg:items-start">
      <div className="flex max-w-2xl flex-col">
        <h1 className="mb-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          {heading}
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
      <div className="flex w-full max-w-[320px] flex-col gap-3 lg:max-w-100 lg:items-end">
        <p className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
          ASK AI ABOUT US
        </p>
        <div className="flex flex-wrap items-center gap-4 lg:justify-end">
          {AI_PROVIDERS.map((ai) => (
            <div key={ai.id} className="group/btn relative inline-flex">
              <a
                href={`${ai.url}${encodeURIComponent(aiPrompt)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center justify-center gap-1.5 transition-colors"
                title={`Ask ${ai.name}`}
              >
                <Image
                  src={ai.icon}
                  alt={ai.name}
                  width={14}
                  height={14}
                  className="object-contain mix-blend-multiply"
                />
                <span className="text-xs font-medium text-slate-600 transition-colors group-hover/btn:text-slate-900">
                  {ai.name}
                </span>
              </a>
              <HoverOutline />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
