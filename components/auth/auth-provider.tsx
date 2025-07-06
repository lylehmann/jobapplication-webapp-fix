"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

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
  id: "demo-user-123",
  email: "demo@example.com",
  user_metadata: {
    full_name: "Demo User",
    avatar_url: "https://github.com/github.png",
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

  // Check if we're in development mode
  const isDev =
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost")

  useEffect(() => {
    // In development, check for demo user in localStorage
    if (isDev) {
      const demoUserSession = localStorage.getItem("demo-user-session")
      if (demoUserSession) {
        setUser(DEMO_USER)
        setLoading(false)
        return
      }
    }

    // Try real Supabase auth
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
  }, [supabase.auth, isDev])

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
