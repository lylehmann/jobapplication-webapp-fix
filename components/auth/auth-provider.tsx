"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useAppStore } from "@/lib/store/app-store"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGitHub: () => Promise<void>
  signInAsDemoUser: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user for development
const DEMO_USER: User = {
  id: "00000000-0000-0000-0000-000000000001", // Use valid UUID format
  email: "demo@example.com",
  user_metadata: {
    full_name: "Demo User",
    avatar_url: "/placeholder-user.jpg",
  },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
  role: "authenticated",
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  phone: "",
  confirmation_sent_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  recovery_sent_at: new Date().toISOString(),
  new_email: "",
  invited_at: new Date().toISOString(),
  action_link: "",
  email_change_sent_at: new Date().toISOString(),
  new_phone: "",
  phone_change_sent_at: new Date().toISOString(),
  phone_confirmed_at: new Date().toISOString(),
  email_change_token_current: "",
  email_change_confirm_status: 0,
  banned_until: new Date().toISOString(),
  reauthentication_sent_at: new Date().toISOString(),
  is_sso_user: false,
  deleted_at: new Date().toISOString(),
  is_anonymous: false,
  factors: [],
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  
  // Access app store for demo data initialization
  const { setUser: setStoreUser, setApplications, applications } = useAppStore()

  // Check if we're in development mode
  const isDev =
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost")
    
  // Initialize demo data when needed - only call once
  const initializeDemoData = useCallback(() => {
    console.log("Initializing demo data...")
    
    // Set demo user in store
    setStoreUser({
      id: "00000000-0000-0000-0000-000000000001", // Use valid UUID for demo user
      email: "demo@example.com",
      isDemoUser: true,
    })
    
    // Only initialize demo applications if none exist
    if (applications.length === 0) {
      const demoApp = {
        id: "demo-app-1", // Fixed ID for the demo application
        user_id: "00000000-0000-0000-0000-000000000001", // Use valid UUID
        job_title: "Frontend Entwickler", // Use 'job_title' for UI consistency (will be mapped to 'title' in API)
        company: "Demo Company GmbH",
        status: "applied",
        notes: "Demo-Bewerbung - Dies ist eine Beispielbewerbung für Testzwecke.",
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
        selected_documents: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      console.log("Setting demo applications with app:", demoApp)
      setApplications([demoApp])
    }
  }, [applications.length, setStoreUser, setApplications]) // Only depend on length to avoid object reference issues

  useEffect(() => {
    // In development, always check for demo user first
    if (isDev) {
      const demoUserSession = localStorage.getItem("demo-user-session")
      if (demoUserSession) {
        console.log("Demo user session found, activating demo mode")
        setUser(DEMO_USER)
        initializeDemoData()
        setLoading(false)
        
        // Add localStorage listener for cross-tab synchronization in demo mode
        const handleStorageChange = (e: StorageEvent) => {
          if (e.key === 'job-application-store' && e.newValue) {
            try {
              const newData = JSON.parse(e.newValue)
              const newApplications = newData.state?.applications || []
              console.log("Cross-tab sync: Updating applications from other tab", newApplications)
              setApplications(newApplications)
            } catch (error) {
              console.error("Failed to sync applications from other tab:", error)
            }
          }
        }
        
        window.addEventListener('storage', handleStorageChange)
        
        // Cleanup listener on unmount
        return () => {
          window.removeEventListener('storage', handleStorageChange)
        }
      } else {
        // Auto-activate demo in development if no session exists
        console.log("Auto-activating demo mode in development")
        localStorage.setItem("demo-user-session", "true")
        setUser(DEMO_USER)
        initializeDemoData()
        setLoading(false)
        return
      }
    }

    // Try real Supabase auth only in production
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, isDev]) // Remove applications.length dependency to prevent loops

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      // In development, allow any email/password combo
      if (isDev) {
        localStorage.setItem("demo-user-session", "true")
        setUser(DEMO_USER)
        return
      }
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      // In development, allow any email/password combo
      if (isDev) {
        localStorage.setItem("demo-user-session", "true")
        setUser(DEMO_USER)
        return
      }
      throw error
    }
  }

  const signInWithGitHub = async () => {
    if (isDev) {
      // In development, simulate GitHub sign-in
      localStorage.setItem("demo-user-session", "true")
      setUser(DEMO_USER)
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signInAsDemoUser = async () => {
    localStorage.setItem("demo-user-session", "true")
    setUser(DEMO_USER)
    initializeDemoData()
  }

  const signOut = async () => {
    if (isDev) {
      localStorage.removeItem("demo-user-session")
      setUser(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGitHub,
        signInAsDemoUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
