import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]
type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"]
type ApplicationUpdate = Database["public"]["Tables"]["applications"]["Update"]

// Demo user ID for development (valid UUID format)
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"

export class ApplicationsAPI {
  private supabase = createClient()

  private async getCurrentUserId(): Promise<string> {
    // Check if we're in development mode
    const isDev =
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" && window.location.hostname === "localhost")

    if (isDev) {
      // Auto-activate demo session in development
      if (typeof window !== "undefined") {
        const demoUserSession = localStorage.getItem("demo-user-session")
        if (!demoUserSession) {
          localStorage.setItem("demo-user-session", "true")
          console.log("Demo session activated automatically")
        }
        // Generate a valid UUID for demo user to avoid Supabase UUID validation errors
        return "00000000-0000-0000-0000-000000000001" // Fixed demo UUID
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

    // Map UI field names to database column names based on actual schema
    if (data.job_title !== undefined) {
      dbData.title = data.job_title
      delete dbData.job_title
    }
    
    // Use the _data versions that exist in the schema
    if (data.cover_letter_data !== undefined) {
      dbData.cover_letter_data = data.cover_letter_data
    }
    if (data.resume_data !== undefined) {
      dbData.resume_data = data.resume_data
    }
    if (data.projects_data !== undefined) {
      // projects_data is stored as string in schema but used as array in UI
      dbData.projects_data = Array.isArray(data.projects_data) 
        ? JSON.stringify(data.projects_data) 
        : data.projects_data
    }
    if (data.selected_documents !== undefined) {
      dbData.selected_documents = data.selected_documents
    }
    if (data.target_role !== undefined) {
      dbData.target_role = data.target_role
    }

    // Remove fields that don't exist in the database schema
    const allowedFields = [
      'id', 'user_id', 'title', 'company', 'status', 'notes', 'position',
      'cover_letter', 'cover_letter_data', 'resume', 'resume_data', 
      'projects', 'projects_data', 'selected_documents', 'personal_info',
      'education', 'experience', 'skills', 'target_role', 'template_id',
      'created_at', 'updated_at'
    ]
    
    // Filter out any fields not in the schema
    Object.keys(dbData).forEach(key => {
      if (!allowedFields.includes(key)) {
        console.log(`Removing unknown field from database payload: ${key}`)
        delete dbData[key]
      }
    })

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
    
    // Convert projects_data from string back to array for UI
    if (data.projects_data !== undefined && typeof data.projects_data === 'string') {
      try {
        uiData.projects_data = JSON.parse(data.projects_data)
      } catch (e) {
        console.warn('Failed to parse projects_data, using empty array:', e)
        uiData.projects_data = []
      }
    }
    
    // The other _data fields should already match our UI expectations
    if (data.target_role !== undefined) {
      uiData.target_role = data.target_role
    }

    return uiData
  }

  async getApplications() {
    const userId = await this.getCurrentUserId()

    // In demo mode, try to fetch real data from Supabase first
    if (userId === "00000000-0000-0000-0000-000000000001") {
      try {
        console.log("Demo mode: Attempting to fetch real data from Supabase...")
        
        // Try to get real applications from Supabase (without user filter for demo)
        const { data, error } = await this.supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10) // Limit to prevent too much data
        
        if (!error && data && data.length > 0) {
          console.log("Demo mode: Successfully loaded real applications from Supabase:", data.length)
          return data.map((app) => this.fromDb(app))
        } else {
          console.log("Demo mode: No real data found or error:", error?.message)
        }
      } catch (e) {
        console.log("Demo mode: Failed to fetch real data, using fallback:", e)
      }
      
      // Fallback to mock data if real data not available
      console.log("Demo mode: Using fallback demo data")
      return [
        {
          id: "demo-app-1",
          user_id: "00000000-0000-0000-0000-000000000001", // Use valid UUID
          job_title: "Frontend Entwickler",
          company: "Demo Company GmbH",
          status: "applied",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          personal_info: {
            fullName: "Max Mustermann",
            email: "max@example.com",
            phone: "+49 30 12345678",
            location: "Berlin, Deutschland"
          },
          cover_letter_data: {
            subject: "Bewerbung als Frontend Entwickler",
            salutation: "Sehr geehrte Damen und Herren,"
          },
          resume_data: {
            summary: "Erfahrener Frontend-Entwickler mit Fokus auf React und TypeScript.",
            experience: [],
            education: [],
            skills: {}
          },
          projects_data: [],
          selected_documents: []
        }
      ]
    }

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
    if (!id || id === 'undefined') {
      throw new Error('Invalid application ID provided')
    }

    const userId = await this.getCurrentUserId()

    // Check if we're in demo mode
    const isDev = process.env.NODE_ENV === "development" || 
                  (typeof window !== "undefined" && window.location.hostname === "localhost")
    
    if (isDev && typeof window !== "undefined" && localStorage.getItem("demo-user-session")) {
      console.log("Demo mode: Attempting to get application for ID:", id)
      
      // First try to get from localStorage (user's local changes)
      try {
        const storeData = localStorage.getItem('job-application-store')
        if (storeData) {
          const parsed = JSON.parse(storeData)
          const applications = parsed.state?.applications || []
          const found = applications.find((app: any) => app.id === id)
          if (found) {
            console.log("Found application in localStorage:", found.id)
            return found
          }
        }
      } catch (e) {
        console.log("Could not get from localStorage:", e)
      }
      
      // Try to get real data from Supabase
      try {
        console.log("Demo mode: Trying to fetch real data from Supabase for ID:", id)
        const { data, error } = await this.supabase
          .from("applications")
          .select("*")
          .eq("id", id)
          .single()

        if (!error && data) {
          console.log("Demo mode: Successfully loaded real application from Supabase:", data.id)
          return this.fromDb(data)
        } else {
          console.log("Demo mode: No real data found or error:", error?.message)
        }
      } catch (e) {
        console.log("Demo mode: Failed to fetch real data from Supabase:", e)
      }
      
      // Fallback: return demo data if the ID matches our demo application
      if (id === "demo-app-1") {
        console.log("Returning hardcoded demo application")
        return {
          id: "demo-app-1",
          user_id: "00000000-0000-0000-0000-000000000001", // Use valid UUID
          job_title: "Frontend Entwickler",
          company: "Demo Company GmbH",
          status: "applied",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          personal_info: {
            fullName: "Max Mustermann",
            email: "max@example.com",
            phone: "+49 30 12345678",
            location: "Berlin, Deutschland"
          },
          cover_letter_data: {
            subject: "Bewerbung als Frontend Entwickler",
            salutation: "Sehr geehrte Damen und Herren,"
          },
          resume_data: {
            summary: "Erfahrener Frontend-Entwickler mit Fokus auf React und TypeScript.",
            experience: [],
            education: [],
            skills: {}
          },
          projects_data: [],
          selected_documents: []
        }
      }
      
      // If not found, throw an error
      throw new Error(`Application with ID ${id} not found in demo mode. Available demo ID: demo-app-1`)
    }

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

    // Check if we're in demo mode
    const isDev = process.env.NODE_ENV === "development" || 
                  (typeof window !== "undefined" && window.location.hostname === "localhost")
    
    if (isDev && typeof window !== "undefined" && localStorage.getItem("demo-user-session")) {
      console.log("Demo mode: Attempting to save application to Supabase:", id)
      
      // In demo mode, try to save to real Supabase first
      try {
        const dbData = this.toDb({
          ...applicationData,
          updated_at: new Date().toISOString(),
        })

        // Try to update in real Supabase database
        const { data, error } = await this.supabase
          .from("applications")
          .update(dbData)
          .eq("id", id)
          .select()
          .single()

        if (!error && data) {
          console.log("Demo mode: Successfully saved to Supabase:", data.id)
          
          // Also update localStorage to keep local state in sync
          try {
            const storeData = localStorage.getItem('job-application-store')
            if (storeData) {
              const parsed = JSON.parse(storeData)
              const applications = parsed.state?.applications || []
              const index = applications.findIndex((app: any) => app.id === id)
              
              if (index !== -1) {
                const updatedApp = this.fromDb(data)
                applications[index] = updatedApp
                parsed.state.applications = applications
                localStorage.setItem('job-application-store', JSON.stringify(parsed))
                console.log("Demo mode: Updated localStorage with Supabase data")
              }
            }
          } catch (e) {
            console.log("Could not update localStorage:", e)
          }
          
          return this.fromDb(data)
        } else {
          console.log("Demo mode: Supabase update failed, using localStorage fallback:", error?.message)
        }
      } catch (e) {
        console.log("Demo mode: Failed to save to Supabase, using localStorage fallback:", e)
      }
      
      // Fallback: Update in localStorage only
      try {
        const storeData = localStorage.getItem('job-application-store')
        if (storeData) {
          const parsed = JSON.parse(storeData)
          const applications = parsed.state?.applications || []
          const index = applications.findIndex((app: any) => app.id === id)
          
          if (index !== -1) {
            // Update existing application with merge
            const updatedApp = {
              ...applications[index],
              ...applicationData,
              updated_at: new Date().toISOString(),
            }
            applications[index] = updatedApp
            parsed.state.applications = applications
            localStorage.setItem('job-application-store', JSON.stringify(parsed))
            console.log("Demo mode: Updated application in localStorage (fallback)")
            
            // Return the merged application
            return updatedApp as Application
          }
        }
      } catch (e) {
        console.log("Could not update localStorage:", e)
      }
      
      // Fallback: try to get the current application and merge
      try {
        const currentApp = await this.getApplication(id)
        const mergedApp = {
          ...currentApp,
          ...applicationData,
          updated_at: new Date().toISOString(),
        }
        return mergedApp as Application
      } catch (e) {
        console.log("Could not get current application for merge:", e)
      }
      
      // Last resort: return partial data (this should not happen in normal operation)
      return {
        ...applicationData,
        id,
        user_id: userId,
        updated_at: new Date().toISOString(),
      } as Application
    }

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
