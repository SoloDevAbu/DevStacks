"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { sectionHeaderCtaButton } from "@/utils/styles"
import { cn } from "@/lib/utils"

interface WeeklyLaunchesSectionProps {
  initialItems: FeedItem[]
}

export const WeeklyLaunchesSection = ({
  initialItems,
}: WeeklyLaunchesSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)

  const pageSize = HOMEPAGE_LIMITS.WEEKLY_LAUNCHES_PAGE_SIZE
  const totalPages = Math.max(1, Math.ceil(initialItems.length / pageSize))

  const paginatedItems = initialItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum)
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      id="weekly-launches"
      ref={sectionRef}
      className="flex w-full flex-col"
    >
      <SectionHeader
        title="This Week's Launches"
        subtitle="Top tools and products launched this week, ranked by community votes"
        action={
          <Link
            href={ROUTES.DISCOVER_WEEKLY_LAUNCHES}
            className={sectionHeaderCtaButton}
          >
            <CalendarDays className="size-3.5 text-indigo-500 transition-colors group-hover:text-indigo-600" />
            <span>View other weeks</span>
          </Link>
        }
      />
      <div className="-mt-px flex flex-col">
        {initialItems.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-12 text-center">
            <p className="text-sm font-medium text-slate-400">
              No launches this week yet.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Be the first to launch something!
            </p>
          </div>
        ) : (
          paginatedItems.map((item, index) => (
            <FeedCard
              key={item.id}
              item={item}
              index={(currentPage - 1) * pageSize + index}
              showMedals={true}
              showFreshnessBadge={false}
            />
          ))
        )}
      </div>

      {/* Pagination with auto-scroll */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center border-b border-dashed border-border bg-white px-6 py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#weekly-launches"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1)
                    }
                  }}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-40"
                  )}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#weekly-launches"
                      isActive={currentPage === pageNum}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(pageNum)
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext
                  href="#weekly-launches"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1)
                    }
                  }}
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-40"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  )
}
