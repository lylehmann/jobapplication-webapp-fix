"use client"

/**
 * Global application store built with Zustand.
 * - Keeps applications, templates and (demo) user in a single source of truth
 * - Persists to localStorage so demo-mode data survives reloads
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

/* ---------- Types -------------------------------------------------------- */

export interface DemoUser {
  id: string
  email: string
  isDemoUser: true
}

export interface Application {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  /* dynamic keys for mapped fields */
  [key: string]: any
}

export interface Template {
  id: string
  created_at: string
  updated_at: string
  usage_count?: number
  /* dynamic keys for template JSON payload */
  [key: string]: any
}

interface AppStore {
  /* STATE */
  user?: DemoUser
  applications: Application[]
  templates: Template[]

  /* ACTIONS */
  setUser: (user: DemoUser | undefined) => void

  setApplications: (apps: Application[]) => void
  addApplication: (app: Application) => void
  updateApplication: (id: string, updates: Partial<Application>) => void
  removeApplication: (id: string) => void

  setTemplates: (templates: Template[]) => void
  addTemplate: (tpl: Template) => void
  updateTemplate: (id: string, updates: Partial<Template>) => void
}

/* ---------- Implementation ---------------------------------------------- */

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      /* ---------- State ---------- */
      user: undefined,
      applications: [],
      templates: [],

      /* ---------- Actions -------- */
      setUser: (user) => set({ user }),

      setApplications: (apps) => set({ applications: apps }),
      addApplication: (app) => set({ applications: [app, ...get().applications] }),
      updateApplication: (id, updates) =>
        set({
          applications: get().applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }),
      removeApplication: (id) => set({ applications: get().applications.filter((a) => a.id !== id) }),

      setTemplates: (templates) => set({ templates }),
      addTemplate: (tpl) => set({ templates: [tpl, ...get().templates] }),
      updateTemplate: (id, updates) =>
        set({
          templates: get().templates.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }),
    }),
    {
      name: "job-application-store",
      partialize: (state) => ({
        applications: state.applications,
        templates: state.templates,
        user: state.user,
      }),
    },
  ),
)
