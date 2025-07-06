import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]
type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"]
type ApplicationUpdate = Database["public"]["Tables"]["applications"]["Update"]

// Demo user ID for development
const DEMO_USER_ID = "demo-user-123"

export class ApplicationsAPI {
  private supabase = createClient()

  private async getCurrentUserId(): Promise<string> {
    // Check if we're in development mode
    const isDev =
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" && window.location.hostname === "localhost")

    if (isDev) {
      const demoUserSession = typeof window !== "undefined" ? localStorage.getItem("demo-user-session") : null
      if (demoUserSession) {
        return DEMO_USER_ID
      }
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) {
      throw new Error("User not authenticated")
    }
    return user.id
  }

  // Convert UI field names to database column names
  private toDb(data: any): any {
    const dbData = { ...data }

    // Map UI field names to database column names
    if (data.job_title !== undefined) {
      dbData.title = data.job_title
      delete dbData.job_title
    }
    if (data.cover_letter_data !== undefined) {
      dbData.cover_letter = data.cover_letter_data
      delete dbData.cover_letter_data
    }
    if (data.resume_data !== undefined) {
      dbData.resume = data.resume_data
      delete dbData.resume_data
    }
    if (data.projects_data !== undefined) {
      dbData.projects = data.projects_data
      delete dbData.projects_data
    }
    if (data.selected_documents !== undefined) {
      dbData.documents = data.selected_documents
      delete dbData.selected_documents
    }
    if (data.target_role !== undefined) {
      dbData.role = data.target_role
      delete dbData.target_role
    }

    return dbData
  }

  // Convert database column names to UI field names
  private fromDb(data: any): any {
    const uiData = { ...data }

    // Map database column names to UI field names
    if (data.title !== undefined) {
      uiData.job_title = data.title
      delete uiData.title
    }
    if (data.cover_letter !== undefined) {
      uiData.cover_letter_data = data.cover_letter
      delete uiData.cover_letter
    }
    if (data.resume !== undefined) {
      uiData.resume_data = data.resume
      delete uiData.resume
    }
    if (data.projects !== undefined) {
      uiData.projects_data = data.projects
      delete uiData.projects
    }
    if (data.documents !== undefined) {
      uiData.selected_documents = data.documents
      delete uiData.documents
    }
    if (data.role !== undefined) {
      uiData.target_role = data.role
      delete uiData.role
    }

    return uiData
  }

  async getApplications() {
    const userId = await this.getCurrentUserId()

    const { data, error } = await this.supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return data?.map((app) => this.fromDb(app)) || []
  }

  async getApplication(id: string) {
    const userId = await this.getCurrentUserId()

    const { data, error } = await this.supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return this.fromDb(data)
  }

  async createApplication(applicationData: Partial<ApplicationInsert>) {
    const userId = await this.getCurrentUserId()

    const dbData = this.toDb({
      ...applicationData,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    const { data, error } = await this.supabase.from("applications").insert(dbData).select().single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return this.fromDb(data)
  }

  async updateApplication(id: string, applicationData: Partial<ApplicationUpdate>) {
    const userId = await this.getCurrentUserId()

    const dbData = this.toDb({
      ...applicationData,
      updated_at: new Date().toISOString(),
    })

    const { data, error } = await this.supabase
      .from("applications")
      .update(dbData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return this.fromDb(data)
  }

  async deleteApplication(id: string) {
    const userId = await this.getCurrentUserId()

    const { error } = await this.supabase.from("applications").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return true
  }

  /* ──────────────────────────────
     Back-compat aliases – remove after all
     callers have migrated to the new names
  ────────────────────────────── */
  /** @deprecated use createApplication(...) */
  create = this.createApplication.bind(this)

  /** @deprecated use updateApplication(...) */
  update = this.updateApplication.bind(this)

  /** @deprecated use deleteApplication(...) */
  delete = this.deleteApplication.bind(this)
}

export const applicationsAPI = new ApplicationsAPI()
