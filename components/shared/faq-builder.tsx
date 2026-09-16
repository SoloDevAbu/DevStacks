"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export interface FaqBuilderItem {
  id?: string
  question: string
  answer: string
}

interface FaqBuilderProps {
  faqs: FaqBuilderItem[]
  onChange: (faqs: FaqBuilderItem[]) => void
  questionPlaceholder?: string
  answerPlaceholder?: string
  emptyPrompt?: string
  addFirstLabel?: string
  addAnotherLabel?: string
}

export const FaqBuilder = ({
  faqs,
  onChange,
  questionPlaceholder = "e.g. Is this tool open source or self-hostable?",
  answerPlaceholder = "e.g. Yes, you can deploy using Docker or sign up for our managed cloud.",
  emptyPrompt = "No FAQs added yet. Help developers evaluate your tool faster by answering common questions.",
  addFirstLabel = "Add First Question",
  addAnotherLabel = "Add Another Question",
}: FaqBuilderProps) => {
  const handleAdd = () => {
    onChange([...faqs, { question: "", answer: "" }])
  }

  const handleUpdate = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...faqs]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleRemove = (index: number) => {
    onChange(faqs.filter((_, i) => i !== index))
  }

  if (faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/40 py-8 text-center">
        <p className="max-w-md text-xs text-slate-500">{emptyPrompt}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="mt-3 gap-1.5"
        >
          <Plus className="size-3.5" />
          <span>{addFirstLabel}</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="relative flex flex-col gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50/70"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-400">
              FAQ #{idx + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(idx)}
              className="h-7 px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
              aria-label={`Remove FAQ ${idx + 1}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`faq-question-${idx}`} className="text-xs font-semibold text-slate-700">
              Question
            </Label>
            <Input
              id={`faq-question-${idx}`}
              value={faq.question}
              onChange={(e) => handleUpdate(idx, "question", e.target.value)}
              placeholder={questionPlaceholder}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`faq-answer-${idx}`} className="text-xs font-semibold text-slate-700">
              Answer
            </Label>
            <Textarea
              id={`faq-answer-${idx}`}
              value={faq.answer}
              onChange={(e) => handleUpdate(idx, "answer", e.target.value)}
              rows={2}
              placeholder={answerPlaceholder}
            />
          </div>
        </div>
      ))}

      <div className="pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="w-full gap-1.5 border-dashed"
        >
          <Plus className="size-3.5" />
          <span>{addAnotherLabel}</span>
        </Button>
      </div>
    </div>
  )
}
