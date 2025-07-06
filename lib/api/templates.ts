import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type Template = Database["public"]["Tables"]["templates"]["Row"]
type TemplateInsert = Database["public"]["Tables"]["templates"]["Insert"]
type TemplateUpdate = Database["public"]["Tables"]["templates"]["Update"]

export interface TemplatesAPIOptions {
  retries?: number
  timeout?: number
}

export class TemplatesAPI {
  private supabase = createClient()
  private cache = new Map<string, Template>()
  private lastFetch = 0
  private readonly CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

  async getAll(options: TemplatesAPIOptions = {}): Promise<Template[]> {
    const { retries = 3, timeout = 10000 } = options

    // Check cache first
    const now = Date.now()
    if (now - this.lastFetch < this.CACHE_DURATION && this.cache.size > 0) {
      return Array.from(this.cache.values()).sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
    }

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { data, error } = await this.supabase
          .from("templates")
          .select("*")
          .order("is_default", { ascending: false })
          .order("usage_count", { ascending: false })
          .order("updated_at", { ascending: false })
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) throw error

        // Update cache
        this.cache.clear()
        data?.forEach((template) => this.cache.set(template.id, template))
        this.lastFetch = now

        return data || []
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }, retries)
  }

  async getByRole(targetRole: string, options: TemplatesAPIOptions = {}): Promise<Template[]> {
    const { retries = 3, timeout = 5000 } = options

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { data, error } = await this.supabase
          .from("templates")
          .select("*")
          .eq("target_role", targetRole)
          .order("is_default", { ascending: false })
          .order("usage_count", { ascending: false })
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) throw error
        return data || []
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }, retries)
  }

  async getById(id: string, options: TemplatesAPIOptions = {}): Promise<Template | null> {
    const { retries = 3, timeout = 5000 } = options

    // Check cache first
    const cached = this.cache.get(id)
    if (cached) return cached

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { data, error } = await this.supabase
          .from("templates")
          .select("*")
          .eq("id", id)
          .single()
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) {
          if (error.code === "PGRST116") return null // Not found
          throw error
        }

        // Update cache
        this.cache.set(id, data)
        return data
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }, retries)
  }

  async create(template: TemplateInsert, options: TemplatesAPIOptions = {}): Promise<Template> {
    const { retries = 3, timeout = 10000 } = options

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { data, error } = await this.supabase
          .from("templates")
          .insert(template)
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

  async update(id: string, updates: TemplateUpdate, options: TemplatesAPIOptions = {}): Promise<Template> {
    const { retries = 3, timeout = 10000 } = options

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { data, error } = await this.supabase
          .from("templates")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single()
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) throw error

        // Update cache
        this.cache.set(id, data)
        return data
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    }, retries)
  }

  async delete(id: string, options: TemplatesAPIOptions = {}): Promise<void> {
    const { retries = 3, timeout = 5000 } = options

    return this.withRetry(async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const { error } = await this.supabase.from("templates").delete().eq("id", id).abortSignal(controller.signal)

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

  async incrementUsage(id: string): Promise<void> {
    try {
      await this.supabase.rpc("increment_template_usage", { template_id: id })

      // Update cache if template exists
      const cached = this.cache.get(id)
      if (cached) {
        this.cache.set(id, { ...cached, usage_count: cached.usage_count + 1 })
      }
    } catch (error) {
      console.error("Failed to increment template usage:", error)
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

  // Cache management
  invalidateCache() {
    this.cache.clear()
    this.lastFetch = 0
  }

  getCacheSize() {
    return this.cache.size
  }
}

export const templatesAPI = new TemplatesAPI()
