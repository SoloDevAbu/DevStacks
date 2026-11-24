"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { DomainRatingAttribution } from "@/components/shared/domain-rating-attribution"
import { useDomainRatingCheck } from "@/hooks/free-tools/use-free-tools"
import { formatDomainRating, getDomainRatingBand } from "@/utils/free-tools"
import {
  freeToolError,
  freeToolForm,
  mutedText,
  freeToolResult,
  freeToolScore,
} from "@/utils/styles"

export const DomainRatingChecker = () => {
  const [domain, setDomain] = useState("")
  const { mutate, data, error, isPending } = useDomainRatingCheck()
  const result = data?.results[0]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (domain.trim()) mutate([domain.trim()])
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className={freeToolForm}>
        <Field className="flex-1">
          <FieldLabel htmlFor="dr-domain" className="sr-only">
            Domain
          </FieldLabel>
          <Input
            id="dr-domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            placeholder="example.com"
            autoComplete="off"
            inputMode="url"
            required
          />
        </Field>
        <Button type="submit" disabled={isPending} className="sm:w-28">
          {isPending && <Spinner />}
          Check DR
        </Button>
      </form>

      {error && (
        <p role="alert" className={freeToolError}>
          {error.message}
        </p>
      )}

      {result && (
        <div className={freeToolResult} aria-live="polite">
          <CornerBrackets />
          <p className={mutedText}>{result.domain}</p>
          {result.domainRating === null ? (
            <p className={freeToolError}>{result.error}</p>
          ) : (
            <>
              <p className={freeToolScore}>
                DR {formatDomainRating(result.domainRating)}
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {getDomainRatingBand(result.domainRating)}
              </p>
            </>
          )}
          <DomainRatingAttribution />
        </div>
      )}
    </div>
  )
}
