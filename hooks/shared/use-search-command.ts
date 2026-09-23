"use client"

import { createContext, useContext } from "react"

export interface SearchCommandContextValue {
  isOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  setIsOpen: (open: boolean) => void
}

export const SearchCommandContext = createContext<SearchCommandContextValue | null>(null)

export const useSearchCommand = () => {
  const context = useContext(SearchCommandContext)
  if (!context) {
    throw new Error("useSearchCommand must be used within a SearchCommandProvider")
  }
  return context
}
