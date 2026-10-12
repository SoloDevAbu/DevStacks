import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { STORAGE_CONFIG } from "@/constants/storage"

export const getStorageClient = () => {
  return new S3Client({
    region: process.env.AWS_REGION || "us-east-2",
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  })
}

export const getPublicAssetUrl = (key: string) => {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/+$/, "")
  return `${endpoint}/${STORAGE_CONFIG.BUCKET_NAME}/${key}`
}

export const createPresignedUploadUrl = async ({
  key,
  contentType,
}: {
  key: string
  contentType: string
}) => {
  const client = getStorageClient()
  const command = new PutObjectCommand({
    Bucket: STORAGE_CONFIG.BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  })

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 })
  const publicUrl = getPublicAssetUrl(key)

  return { uploadUrl, publicUrl }
}
