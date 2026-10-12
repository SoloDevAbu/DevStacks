import "dotenv/config"
import {
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3"
import { db, schema } from "@/db"
import { getStorageClient, getStorageKeyFromUrl } from "@/lib/storage/s3"
import { STORAGE_CONFIG } from "@/constants/storage"

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000 // 24 hours

const runCleanup = async () => {
  console.log("Starting orphaned storage cleanup...")

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

  // 2. Scan S3 Bucket objects
  const client = getStorageClient()
  let continuationToken: string | undefined = undefined
  let scannedCount = 0
  let orphanedKeys: { Key: string }[] = []
  let totalBytesFreed = 0
  const now = Date.now()

  do {
    const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: STORAGE_CONFIG.BUCKET_NAME,
      ContinuationToken: continuationToken,
    })

    const response = await client.send(listCommand)
    const contents = response.Contents || []
    scannedCount += contents.length

    for (const item of contents) {
      if (!item.Key) continue

      // Only check logos and screenshots folders
      if (!item.Key.startsWith("logos/") && !item.Key.startsWith("screenshots/")) {
        continue
      }

      // Check if active in DB
      if (activeKeys.has(item.Key)) {
        continue
      }

      // Check age (grace period)
      const lastModified = item.LastModified ? item.LastModified.getTime() : now
      const ageMs = now - lastModified

      if (ageMs > GRACE_PERIOD_MS) {
        orphanedKeys.push({ Key: item.Key })
        totalBytesFreed += item.Size || 0
      }
    }

    continuationToken = response.NextContinuationToken
  } while (continuationToken)

  console.log(
    `Scanned ${scannedCount} bucket objects. Identified ${orphanedKeys.length} orphaned objects older than 24h.`
  )

  // 3. Delete orphaned objects in chunks of 500
  if (orphanedKeys.length > 0) {
    const chunkSize = 500
    for (let i = 0; i < orphanedKeys.length; i += chunkSize) {
      const chunk = orphanedKeys.slice(i, i + chunkSize)
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: STORAGE_CONFIG.BUCKET_NAME,
        Delete: {
          Objects: chunk,
          Quiet: true,
        },
      })
      await client.send(deleteCommand)
      console.log(`Deleted batch of ${chunk.length} orphaned objects.`)
    }

    const mbFreed = (totalBytesFreed / (1024 * 1024)).toFixed(2)
    console.log(
      `Cleanup complete: Deleted ${orphanedKeys.length} orphaned files. Freed ${mbFreed} MB.`
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
