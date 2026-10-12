"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface ScreenshotsCarouselProps {
  images: string[]
  title: string
  className?: string
}

export const ScreenshotsCarousel = ({
  images,
  title,
  className,
}: ScreenshotsCarouselProps) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(1)
  const [count, setCount] = React.useState(images.length)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (!images || images.length === 0) return null

  const hasMultiple = images.length > 1

  return (
    <div className={cn("relative w-full select-none", className)}>
      <Carousel
        setApi={setApi}
        opts={{
          loop: hasMultiple,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {images.map((imgUrl, idx) => (
            <CarouselItem key={idx} className="pl-0">
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-slate-950/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`${title} screenshot ${idx + 1}`}
                  className="size-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {hasMultiple && (
          <>
            <CarouselPrevious className="left-3 size-9 cursor-pointer border border-slate-200/80 bg-white/90 text-slate-800 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:text-slate-900 sm:left-4 sm:size-10" />
            <CarouselNext className="right-3 size-9 cursor-pointer border border-slate-200/80 bg-white/90 text-slate-800 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:text-slate-900 sm:right-4 sm:size-10" />
            <div className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-slate-900/70 px-2.5 py-1 font-mono text-xs font-medium text-white backdrop-blur-xs select-none">
              {current} / {count}
            </div>
          </>
        )}
      </Carousel>
    </div>
  )
}
