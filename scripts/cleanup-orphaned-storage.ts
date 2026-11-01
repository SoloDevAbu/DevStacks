import "dotenv/config"
import { db, schema } from "@/db"
import {
  getSupabaseAdmin,
  getStorageKeyFromUrl,
  deleteStorageObjects,
} from "@/lib/storage"
import { STORAGE_CONFIG } from "@/constants/storage"

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000 // 24 hours

interface BucketFileItem {
  key: string
  size: number
  updatedAt: number
}

const listAllBucketFiles = async (
  folder: string
): Promise<BucketFileItem[]> => {
  const supabase = getSupabaseAdmin()
  const results: BucketFileItem[] = []

  const walk = async (currentPath: string) => {
    let offset = 0
    const limit = 100

    while (true) {
      const { data, error } = await supabase.storage
        .from(STORAGE_CONFIG.BUCKET_NAME)
        .list(currentPath, { limit, offset })

      if (error) {
        console.error(`Error listing ${currentPath}:`, error.message)
        break
      }

      if (!data || data.length === 0) break

      for (const item of data) {
        const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name

        // In Supabase storage, subdirectories have item.id === null
        if (item.id === null) {
          await walk(itemPath)
        } else {
          results.push({
            key: itemPath,
            size: item.metadata?.size || 0,
            updatedAt: item.updated_at
              ? new Date(item.updated_at).getTime()
              : Date.now(),
          })
        }
      }

      if (data.length < limit) break
      offset += limit
    }
  }

  await walk(folder)
  return results
}

const runCleanup = async () => {
  console.log("Starting orphaned storage cleanup (Supabase Storage)...")

  // 1. Collect all referenced URLs from Database
  const activeKeys = new Set<string>()

  const addKeyIfValid = (url: string | null | undefined) => {
    if (!url) return
    const key = getStorageKeyFromUrl(url)
    if (key) activeKeys.add(key)
  }

  console.log("Querying database records for referenced media...")

  const [allProducts, allTools, allUsers] = await Promise.all([
    db
      .select({
        logoUrl: schema.products.logoUrl,
        images: schema.products.images,
      })
      .from(schema.products),
    db
      .select({
        logoUrl: schema.tools.logoUrl,
        images: schema.tools.images,
      })
      .from(schema.tools),
    db
      .select({
        image: schema.users.image,
        avatarUrl: schema.users.avatarUrl,
      })
      .from(schema.users),
  ])

  for (const p of allProducts) {
    addKeyIfValid(p.logoUrl)
    if (Array.isArray(p.images)) {
      p.images.forEach(addKeyIfValid)
    }
  }

  for (const t of allTools) {
    addKeyIfValid(t.logoUrl)
    if (Array.isArray(t.images)) {
      t.images.forEach(addKeyIfValid)
    }
  }

  for (const u of allUsers) {
    addKeyIfValid(u.image)
    addKeyIfValid(u.avatarUrl)
  }

  console.log(`Found ${activeKeys.size} active referenced keys in database.`)

  // 2. Scan Supabase Storage objects in logos/ and screenshots/
  const folders = ["logos", "screenshots"]
  const allFiles: BucketFileItem[] = []

  for (const folder of folders) {
    const files = await listAllBucketFiles(folder)
    allFiles.push(...files)
  }

  const now = Date.now()
  const orphanedKeys: string[] = []
  let totalBytesFreed = 0

  for (const file of allFiles) {
    if (activeKeys.has(file.key)) continue

    const ageMs = now - file.updatedAt
    if (ageMs > GRACE_PERIOD_MS) {
      orphanedKeys.push(file.key)
      totalBytesFreed += file.size
    }
  }

  console.log(
    `Scanned ${allFiles.length} storage objects. Identified ${orphanedKeys.length} orphaned objects older than 24h.`
  )

  // 3. Delete orphaned objects in chunks of 100
  if (orphanedKeys.length > 0) {
    const chunkSize = 100
    let successfullyDeletedCount = 0

    for (let i = 0; i < orphanedKeys.length; i += chunkSize) {
      const chunk = orphanedKeys.slice(i, i + chunkSize)
      try {
        await deleteStorageObjects(chunk)
        successfullyDeletedCount += chunk.length
        console.log(
          `Batch ${Math.floor(i / chunkSize) + 1}: ${chunk.length} deleted.`
        )
      } catch (batchErr) {
        console.error(
          `Batch ${Math.floor(i / chunkSize) + 1} failed:`,
          batchErr
        )
      }
    }

    const mbFreed = (totalBytesFreed / (1024 * 1024)).toFixed(2)
    console.log(
      `Cleanup complete: Successfully deleted ${successfullyDeletedCount} orphaned files. Freed ${mbFreed} MB.`
    )
  } else {
    console.log("No orphaned files to delete. Storage is completely clean.")
  }

  process.exit(0)
}

runCleanup().catch((err) => {
  console.error("Cleanup error:", err)
  process.exit(1)
})
