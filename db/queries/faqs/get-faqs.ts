import { db } from "@/db"
import { toolFaqs, productFaqs } from "@/db/schema"
import { eq, asc } from "drizzle-orm"

export interface CustomFaq {
  id: string
  question: string
  answer: string
  sortOrder: number
}

export const getToolFaqs = async (toolId: string): Promise<CustomFaq[]> => {
  return db
    .select({
      id: toolFaqs.id,
      question: toolFaqs.question,
      answer: toolFaqs.answer,
      sortOrder: toolFaqs.sortOrder,
    })
    .from(toolFaqs)
    .where(eq(toolFaqs.toolId, toolId))
    .orderBy(asc(toolFaqs.sortOrder), asc(toolFaqs.createdAt))
}

export const getProductFaqs = async (
  productId: string
): Promise<CustomFaq[]> => {
  return db
    .select({
      id: productFaqs.id,
      question: productFaqs.question,
      answer: productFaqs.answer,
      sortOrder: productFaqs.sortOrder,
    })
    .from(productFaqs)
    .where(eq(productFaqs.productId, productId))
    .orderBy(asc(productFaqs.sortOrder), asc(productFaqs.createdAt))
}
