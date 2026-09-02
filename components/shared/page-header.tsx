import Image from "next/image"

function HoverOutline() {
  return (
    <div className="pointer-events-none absolute -inset-[6px] z-0 opacity-0 transition-opacity group-hover/btn:opacity-100">
      <div className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-slate-500" />
      <div className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-slate-500" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-slate-500" />
      <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-slate-500" />
    </div>
  )
}

interface PageHeaderProps {
  heading: string
  description: string
  aiPrompt: string
}

export function PageHeader({ heading, description, aiPrompt }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-6 border-b border-dashed border-border bg-white px-6 pt-8 pb-6 md:px-8 lg:flex-row lg:items-start">
      {/* Left: Hero Texts */}
      <div className="flex max-w-2xl flex-col">
        <h1 className="mb-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          {heading}
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
      {/* Right: Controls */}
      <div className="flex w-full max-w-[320px] flex-col gap-3 lg:max-w-100 lg:items-end">
        <p className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
          ASK AI ABOUT US
        </p>
        <div className="flex flex-wrap items-center gap-4 lg:justify-end">
          {[
            {
              id: "chatgpt",
              name: "ChatGPT",
              icon: "/ai-logos/chatgpt.png",
              url: "https://chatgpt.com/?q=",
            },
            {
              id: "claude",
              name: "Claude",
              icon: "/ai-logos/claude-color.png",
              url: "https://claude.ai/new?q=",
            },
            {
              id: "gemini",
              name: "Gemini",
              icon: "/ai-logos/gemini-color.png",
              url: "https://gemini.google.com/app?q=",
            },
            {
              id: "grok",
              name: "Grok",
              icon: "/ai-logos/grok.png",
              url: "https://x.com/i/grok?text=",
            },
            {
              id: "perplexity",
              name: "Perplexity",
              icon: "/ai-logos/perplexity-color.png",
              url: "https://www.perplexity.ai/search?q=",
            },
          ].map((ai) => {
            return (
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
            )
          })}
        </div>
      </div>
    </div>
  )
}
