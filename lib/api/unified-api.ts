import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/lib/store/app-store"
import type { Database } from "@/lib/database.types"

/* ---------- Helpers & constants ----------------------------------------- */

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"
const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)

type Application = Database["public"]["Tables"]["applications"]["Row"]
type Template = Database["public"]["Tables"]["templates"]["Row"]

/* ---------- Field mapping (single source of truth) ---------------------- */
const FIELD_MAPPINGS = {
  applications: {
    toDb: {
      job_title: "title",
      cover_letter_data: "cover_letter",
      resume_data: "resume",
      projects_data: "projects",
      selected_documents: "documents",
      target_role: "role",
    },
    fromDb: {
      title: "job_title",
      cover_letter: "cover_letter_data",
      resume: "resume_data",
      projects: "projects_data",
      documents: "selected_documents",
      role: "target_role",
    },
  },
}

/* ---------- Class ------------------------------------------------------- */

class UnifiedAPI {
  private supabase = createClient()

  /* ----- Utils --------------------------------------------------------- */
  private mapFields(obj: any, mapping: Record<string, string>) {
    const res = { ...obj }
    Object.entries(mapping).forEach(([from, to]) => {
      if (res[from] !== undefined) {
        res[to] = res[from]
        delete res[from]
      }
    })
    return res
  }

  private async getCurrentUser() {
    const { user } = useAppStore.getState()
    if (user?.isDemoUser) return user
    const { data, error } = await this.supabase.auth.getUser()
    if (error || !data.user) throw new Error("Authentication required")
    return data.user
  }

  /* ---------- Applications --------------------------------------------- */

  async getApplications() {
    const user = await this.getCurrentUser()
    if ("isDemoUser" in user) {
      return useAppStore.getState().applications
    }

    const { data, error } = await this.supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    const mapped = (data ?? []).map((row) => this.mapFields(row, FIELD_MAPPINGS.applications.fromDb))
    useAppStore.getState().setApplications(mapped)
    return mapped
  }

  async createApplication(payload: Partial<Application>) {
    const user = await this.getCurrentUser()
    if ("isDemoUser" in user) {
      const newRow = {
        ...(payload as Application),
        id: generateId(),
        user_id: DEMO_USER_ID,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      useAppStore.getState().addApplication(newRow)
      return newRow
    }

    const dbPayload = this.mapFields(
      {
        ...payload,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      FIELD_MAPPINGS.applications.toDb,
    )

    const { data, error } = await this.supabase.from("applications").insert(dbPayload).select().single()
    if (error) throw error
    const mapped = this.mapFields(data, FIELD_MAPPINGS.applications.fromDb)
    useAppStore.getState().addApplication(mapped)
    return mapped
  }

  async updateApplication(id: string, updates: Partial<Application>) {
    const user = await this.getCurrentUser()
    if ("isDemoUser" in user) {
      useAppStore.getState().updateApplication(id, updates as Application)
      return useAppStore.getState().applications.find((a) => a.id === id)!
    }

    const dbUpdates = this.mapFields(
      { ...updates, updated_at: new Date().toISOString() },
      FIELD_MAPPINGS.applications.toDb,
    )

    const { data, error } = await this.supabase
      .from("applications")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error
    const mapped = this.mapFields(data, FIELD_MAPPINGS.applications.fromDb)
    useAppStore.getState().updateApplication(id, mapped)
    return mapped
  }

  async deleteApplication(id: string) {
    const user = await this.getCurrentUser()
    if ("isDemoUser" in user) {
      useAppStore.getState().removeApplication(id)
      return
    }
    const { error } = await this.supabase.from("applications").delete().eq("id", id).eq("user_id", user.id)
    if (error) throw error
    useAppStore.getState().removeApplication(id)
  }

  /* ---------- Templates ------------------------------------------------- */

  async getTemplates(): Promise<Template[]> {
    const { data, error } = await this.supabase.from("templates").select("*").order("created_at", { ascending: false })
    if (error) throw error
    useAppStore.getState().setTemplates(data ?? [])
    return data ?? []
  }

  async createTemplate(payload: Partial<Template>) {
    const { data, error } = await this.supabase
      .from("templates")
      .insert({
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    useAppStore.getState().addTemplate(data)
    return data
  }

  async incrementTemplateUsage(id: string) {
    const state = useAppStore.getState()
    const tpl = state.templates.find((t) => t.id === id)
    const newCount = (tpl?.usage_count || 0) + 1
    useAppStore.getState().updateTemplate(id, { usage_count: newCount })

    // Only persist to Supabase if we have a real backend
    const { user } = state
    if (!user || "isDemoUser" in user) return

    const { error } = await this.supabase
      .from("templates")
      .update({ usage_count: newCount, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) console.error("Failed to increment template usage:", error)
  }
}

/* ---------- Exports ----------------------------------------------------- */

export const unifiedAPI = new UnifiedAPI()
export default unifiedAPI // optional default export for convenience

export const applicationsAPI = {
  getAll: () => unifiedAPI.getApplications(),
  create: (d: any) => unifiedAPI.createApplication(d),
  update: (id: string, d: any) => unifiedAPI.updateApplication(id, d),
  delete: (id: string) => unifiedAPI.deleteApplication(id),
}

export const templatesAPI = {
  getAll: () => unifiedAPI.getTemplates(),
  create: (d: any) => unifiedAPI.createTemplate(d),
  incrementUsage: (id: string) => unifiedAPI.incrementTemplateUsage(id),
}
