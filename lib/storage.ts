import { s3, BUCKET } from './s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export interface UploadResult {
  url: string
  key: string
}

/**
 * Sube una imagen a Minio/S3 y retorna la URL
 */
export async function uploadImage(
  file: File, 
  folder: string = 'packages',
  prefix: string = ''
): Promise<UploadResult | null> {
  if (!file || file.size === 0) {
    return null
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const randomString = Math.random().toString(36).substr(2, 9)
    const key = `${folder}/${prefix}${timestamp}-${randomString}.${fileExtension}`
    
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'image/jpeg'
    }))
    
    // Construir URL correctamente
    const endpoint = process.env.MINIO_ENDPOINT?.replace('http://', '').replace('https://', '') || 'localhost:9000'
    const url = `http://${endpoint}/${BUCKET}/${key}`
    
    return { url, key }
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

/**
 * Sube múltiples imágenes a Minio/S3
 */
export async function uploadMultipleImages(
  files: File[], 
  folder: string = 'packages',
  prefix: string = 'gallery-'
): Promise<UploadResult[]> {
  const results: UploadResult[] = []
  
  for (const file of files) {
    const result = await uploadImage(file, folder, prefix)
    if (result) {
      results.push(result)
    }
  }
  
  return results
}

/**
 * Genera la URL de una imagen basada en su key
 */
export function getImageUrl(key: string): string {
  const endpoint = process.env.MINIO_ENDPOINT?.replace('http://', '').replace('https://', '') || 'localhost:9000'
  return `http://${endpoint}/${BUCKET}/${key}`
}
