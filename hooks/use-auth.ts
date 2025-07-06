"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store/app-store"
import { createClient } from "@/lib/supabase/client"

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser } = useAppStore()
  const supabase = createClient()

  useEffect(() => {
    // Check for demo user session
    const demoSession = localStorage.getItem("demo-user-session")
    if (demoSession) {
      setUser({
        id: "demo-user-123",
        email: "demo@example.com",
        name: "Demo User",
        isDemoUser: true,
      })
      return
    }

    // Check for real auth session
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.email,
          avatar_url: authUser.user_metadata?.avatar_url,
          isDemoUser: false,
        })
      } else {
        setUser(null)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          avatar_url: session.user.user_metadata?.avatar_url,
          isDemoUser: false,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, supabase])

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signInWithEmail = async (email: string, password: string) => {
    // In development, accept any email/password
    if (process.env.NODE_ENV === "development") {
      setUser({
        id: "dev-user-" + Date.now(),
        email,
        name: email.split("@")[0],
        isDemoUser: false,
      })
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signInAsDemo = () => {
    localStorage.setItem("demo-user-session", "true")
    setUser({
      id: "demo-user-123",
      email: "demo@example.com",
      name: "Demo User",
      isDemoUser: true,
    })
  }

  const signOut = async () => {
    localStorage.removeItem("demo-user-session")
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    signInWithGitHub,
    signInWithEmail,
    signInAsDemo,
    signOut,
  }
}
