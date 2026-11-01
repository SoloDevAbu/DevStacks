import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { STORAGE_CONFIG } from "@/constants/storage"

let supabaseAdminClient: SupabaseClient | null = null
let bucketChecked = false

export const getSupabaseAdmin = (): SupabaseClient => {
  if (supabaseAdminClient) return supabaseAdminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase credentials: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for storage operations."
    )
  }

  supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return supabaseAdminClient
}

export const ensureBucketExists = async (): Promise<void> => {
  if (bucketChecked) return

  const supabase = getSupabaseAdmin()
  const bucketName = STORAGE_CONFIG.BUCKET_NAME

  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets()
  if (listError) {
    console.warn("Could not verify storage buckets:", listError.message)
    return
  }

  const exists = buckets?.some(
    (b) => b.id === bucketName || b.name === bucketName
  )

  if (!exists) {
    const maxFileSize = Math.max(
      STORAGE_CONFIG.LOGO.MAX_SIZE_BYTES,
      STORAGE_CONFIG.SCREENSHOTS.MAX_SIZE_BYTES
    )
    const allowedMimeTypes = Array.from(
      new Set([
        ...STORAGE_CONFIG.LOGO.ALLOWED_TYPES,
        ...STORAGE_CONFIG.SCREENSHOTS.ALLOWED_TYPES,
      ])
    )

    const { error: createError } = await supabase.storage.createBucket(
      bucketName,
      {
        public: true,
        fileSizeLimit: maxFileSize,
        allowedMimeTypes,
      }
    )

    if (createError && !createError.message.includes("already exists")) {
      console.error(
        `Failed to create storage bucket "${bucketName}":`,
        createError.message
      )
    }
  }

  bucketChecked = true
}

export const getPublicAssetUrl = (key: string): string => {
  const cleanKey = key.replace(/^\/+/, "")
  const baseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(
    /\/+$/,
    ""
  )
  if (baseUrl) {
    return `${baseUrl}/storage/v1/object/public/${STORAGE_CONFIG.BUCKET_NAME}/${cleanKey}`
  }

  const supabase = getSupabaseAdmin()
  const { data } = supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .getPublicUrl(cleanKey)
  return data.publicUrl
}

export const getStorageKeyFromUrl = (url: string): string | null => {
  if (!url) return null
  const bucket = STORAGE_CONFIG.BUCKET_NAME

  // 1. Supabase public URL pattern: .../storage/v1/object/public/<bucket>/<key>
  const publicMarker = `/storage/v1/object/public/${bucket}/`
  const publicIdx = url.indexOf(publicMarker)
  if (publicIdx !== -1) {
    const raw = url.slice(publicIdx + publicMarker.length)
    return raw.split("?")[0].replace(/^\/+/, "")
  }

  // 2. Supabase signed URL pattern: .../storage/v1/object/upload/sign/<bucket>/<key>?...
  const signedMarker = `/storage/v1/object/upload/sign/${bucket}/`
  const signedIdx = url.indexOf(signedMarker)
  if (signedIdx !== -1) {
    const raw = url.slice(signedIdx + signedMarker.length)
    return raw.split("?")[0].replace(/^\/+/, "")
  }

  // 3. Fallback generic bucket marker: /<bucket>/<key>
  const genericMarker = `/${bucket}/`
  const genericIdx = url.indexOf(genericMarker)
  if (genericIdx !== -1) {
    const raw = url.slice(genericIdx + genericMarker.length)
    return raw.split("?")[0].replace(/^\/+/, "")
  }

  // 4. Raw storage key: logos/ or screenshots/
  const clean = url.split("?")[0].replace(/^\/+/, "")
  if (clean.startsWith("logos/") || clean.startsWith("screenshots/")) {
    return clean
  }

  return null
}

export const createPresignedUploadUrl = async ({
  key,
}: {
  key: string
  contentType?: string
  contentLength?: number
}): Promise<{ uploadUrl: string; publicUrl: string; key: string }> => {
  const cleanKey = key.replace(/^\/+/, "")
  await ensureBucketExists()

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .createSignedUploadUrl(cleanKey, {
      upsert: true,
    })

  if (error || !data) {
    throw new Error(
      error?.message || "Failed to create Supabase signed upload URL"
    )
  }

  const publicUrl = getPublicAssetUrl(cleanKey)

  return {
    uploadUrl: data.signedUrl,
    publicUrl,
    key: cleanKey,
  }
}

export const deleteStorageObject = async (key: string) => {
  const cleanKey = key.replace(/^\/+/, "")
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .remove([cleanKey])

  if (error) {
    throw new Error(
      `Failed to delete object from Supabase storage: ${error.message}`
    )
  }

  return data
}

export const deleteStorageObjects = async (keys: string[]) => {
  const cleanKeys = keys.map((k) => k.replace(/^\/+/, ""))
  if (cleanKeys.length === 0) return []

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.storage
    .from(STORAGE_CONFIG.BUCKET_NAME)
    .remove(cleanKeys)

  if (error) {
    throw new Error(
      `Failed to delete objects from Supabase storage: ${error.message}`
    )
  }

  return data
}

