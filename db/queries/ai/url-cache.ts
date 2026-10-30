import { db } from "@/db"
import { urlAiCache, type ExtractedAiData } from "@/db/schema"
import { and, eq, gte, sql } from "drizzle-orm"

export const getCachedUrlAiData = async (
  normalizedUrl: string,
  maxAgeDays = 7
): Promise<ExtractedAiData | null> => {
  const cutoff = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000)

  const rows = await db
    .select({
      extractedData: urlAiCache.extractedData,
    })
    .from(urlAiCache)
    .where(
      and(
        eq(urlAiCache.normalizedUrl, normalizedUrl),
        gte(urlAiCache.updatedAt, cutoff)
      )
    )
    .limit(1)

  if (rows.length === 0) return null
  return rows[0].extractedData
}

export const upsertUrlAiCache = async ({
  normalizedUrl,
  extractedData,
  userId,
}: {
  normalizedUrl: string
  extractedData: ExtractedAiData
  userId?: string
}): Promise<void> => {
  await db
    .insert(urlAiCache)
    .values({
      normalizedUrl,
      extractedData,
      userId: userId || null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: urlAiCache.normalizedUrl,
      set: {
        extractedData,
        userId: userId || sql`${urlAiCache.userId}`,
        updatedAt: new Date(),
      },
    })
}

