"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { freeToolForm } from "@/utils/styles"

interface SiteUrlFormProps {
  id: string
  label: string
  placeholder: string
  submitLabel: string
  isPending: boolean
  onSubmit: (url: string) => void
}

export const SiteUrlForm = ({
  id,
  label,
  placeholder,
  submitLabel,
  isPending,
  onSubmit,
}: SiteUrlFormProps) => {
  const [url, setUrl] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (url.trim()) onSubmit(url.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={freeToolForm}>
      <Field className="flex-1">
        <FieldLabel htmlFor={id} className="sr-only">
          {label}
        </FieldLabel>
        <Input
          id={id}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          inputMode="url"
          required
        />
      </Field>
      <Button type="submit" disabled={isPending} className="sm:w-28">
        {isPending && <Spinner />}
        {submitLabel}
      </Button>
    </form>
  )
}
