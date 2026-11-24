"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { DomainRatingAttribution } from "@/components/shared/domain-rating-attribution"
import { DOMAIN_RATING_API } from "@/constants/free-tools"
import { useDomainRatingCheck } from "@/hooks/free-tools/use-free-tools"
import {
  buildDomainRatingCsv,
  downloadTextFile,
  formatDomainRating,
  getDomainRatingBand,
  parseDomainList,
  sortByDomainRating,
} from "@/utils/free-tools"
import { freeToolError, mutedText } from "@/utils/styles"

const CSV_FILE_NAME = "domain-ratings.csv"

const CSV_MIME_TYPE = "text/csv;charset=utf-8"

export const BulkDomainRatingChecker = () => {
  const [input, setInput] = useState("")
  const { mutate, data, error, isPending } = useDomainRatingCheck()
  const domains = parseDomainList(input)
  const tooMany = domains.length > DOMAIN_RATING_API.BULK_MAX_DOMAINS
  const results = data ? sortByDomainRating(data.results) : []

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (domains.length > 0 && !tooMany) mutate(domains)
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-3">
        <Field>
          <FieldLabel htmlFor="bulk-dr-domains">Domains</FieldLabel>
          <Textarea
            id="bulk-dr-domains"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={"example.com\nanother-site.io\nhttps://www.third.dev"}
            rows={8}
            required
          />
          <FieldDescription>
            {domains.length} of {DOMAIN_RATING_API.BULK_MAX_DOMAINS} domains.
            One per line or separated by commas.
          </FieldDescription>
        </Field>
        <div>
          <Button type="submit" disabled={isPending || tooMany}>
            {isPending && <Spinner />}
            Check DR
          </Button>
        </div>
      </form>

      {tooMany && (
        <p role="alert" className={freeToolError}>
          Remove {domains.length - DOMAIN_RATING_API.BULK_MAX_DOMAINS} domains
          to stay within {DOMAIN_RATING_API.BULK_MAX_DOMAINS} per check.
        </p>
      )}
      {error && (
        <p role="alert" className={freeToolError}>
          {error.message}
        </p>
      )}

      {results.length > 0 && (
        <div className="flex max-w-2xl flex-col gap-3" aria-live="polite">
          <div className="border border-dashed border-border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Domain Rating</TableHead>
                  <TableHead>Band</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map(({ domain, domainRating, error: rowError }) => (
                  <TableRow key={domain}>
                    <TableCell className="font-medium">{domain}</TableCell>
                    {domainRating === null ? (
                      <TableCell colSpan={2} className={mutedText}>
                        {rowError}
                      </TableCell>
                    ) : (
                      <>
                        <TableCell className="font-bold">
                          {formatDomainRating(domainRating)}
                        </TableCell>
                        <TableCell>
                          {getDomainRatingBand(domainRating)}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <DomainRatingAttribution />
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                downloadTextFile(
                  buildDomainRatingCsv(results),
                  CSV_FILE_NAME,
                  CSV_MIME_TYPE
                )
              }
            >
              Download CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
