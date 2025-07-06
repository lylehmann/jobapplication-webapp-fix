import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type FileRecord = Database["public"]["Tables"]["files"]["Row"]
type FileInsert = Database["public"]["Tables"]["files"]["Insert"]

export interface FilesAPIOptions {
  retries?: number
  timeout?: number
}

export class FilesAPI {
  private supabase = createClient()
  private cache = new Map<string, FileRecord>()
  private lastFetch = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  async getAll(options: FilesAPIOptions = {}): Promise<FileRecord[]> {
    const { retries = 3, timeout = 10000 } = options

    // Check cache first
    const now = Date.now()
    if (now - this.lastFetch < this.CACHE_DURATION && this.cache.size > 0) {
      return Array.from(this.cache.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    }

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { data, error } = await this.supabase
          .from("files")
          .select("*")
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) throw error

        // Update cache
        this.cache.clear()
        data?.forEach((file) => this.cache.set(file.id, file))
        this.lastFetch = now

        return data || []
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }, retries)
  }

  async getByApplicationId(applicationId: string, options: FilesAPIOptions = {}): Promise<FileRecord[]> {
    const { retries = 3, timeout = 5000 } = options

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { data, error } = await this.supabase
          .from("files")
          .select("*")
          .eq("application_id", applicationId)
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) throw error

        // Update cache
        data?.forEach((file) => this.cache.set(file.id, file))

        return data || []
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }, retries)
  }

  async upload(file: File, applicationId?: string, options: FilesAPIOptions = {}): Promise<FileRecord> {
    const { retries = 3, timeout = 30000 } = options

    // Validate file
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`)
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      throw new Error("File type not supported")
    }

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        // Convert file to base64 with progress tracking
        const fileData = await this.fileToBase64WithProgress(file)

        const fileRecord: FileInsert = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: fileData,
          application_id: applicationId || null,
        }

        const { data, error } = await this.supabase
          .from("files")
          .insert(fileRecord)
          .select()
          .single()
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) throw error

        // Update cache
        this.cache.set(data.id, data)

        return data
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }, retries)
  }

  async delete(id: string, options: FilesAPIOptions = {}): Promise<void> {
    const { retries = 3, timeout = 5000 } = options

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { error } = await this.supabase.from("files").delete().eq("id", id).abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) throw error

        // Remove from cache
        this.cache.delete(id)
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }, retries)
  }

  async batchDelete(ids: string[]): Promise<void> {
    // Process in chunks to avoid overwhelming the database
    const chunks = this.chunkArray(ids, 10)

    for (const chunk of chunks) {
      const promises = chunk.map((id) => this.delete(id))
      await Promise.allSettled(promises)
    }
  }

  private async fileToBase64WithProgress(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        resolve(reader.result as string)
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          // You can emit progress events here if needed
          console.log(`Upload progress: ${progress.toFixed(2)}%`)
        }
      }

      reader.readAsDataURL(file)
    })
  }

  base64ToBlob(base64: string): Blob {
    try {
      const [header, data] = base64.split(",")
      const mimeType = header.match(/:(.*?);/)?.[1] || "application/octet-stream"
      const byteCharacters = atob(data)
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      return new Blob([byteArray], { type: mimeType })
    } catch (error) {
      throw new Error("Invalid base64 data")
    }
  }

  private async withRetry<T>(operation: () => Promise<T>, retries: number): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error

        if (attempt === retries) break

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  // Cache management
  invalidateCache() {
    this.cache.clear()
    this.lastFetch = 0
  }

  getCacheSize() {
    return this.cache.size
  }
}

export const filesAPI = new FilesAPI()
