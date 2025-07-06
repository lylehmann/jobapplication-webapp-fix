"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store/app-store"
import type { Application } from "@/lib/store/app-store"

export function useApplicationsAPI() {
  const { applications, setApplications, addApplication, updateApplication, removeApplication } = useAppStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock API functions for demo mode
  const createApplication = async (data: Partial<Application>): Promise<Application> => {
    setLoading(true)
    try {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        user_id: "demo-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data,
      }
      addApplication(newApp)
      return newApp
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create application")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationById = async (id: string, updates: Partial<Application>): Promise<Application> => {
    setLoading(true)
    try {
      const updatedApp = {
        ...updates,
        updated_at: new Date().toISOString(),
      }
      updateApplication(id, updatedApp)
      const app = applications.find((a) => a.id === id)
      if (!app) throw new Error("Application not found")
      return { ...app, ...updatedApp }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update application")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteApplication = async (id: string): Promise<void> => {
    setLoading(true)
    try {
      removeApplication(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete application")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async (): Promise<Application[]> => {
    setLoading(true)
    try {
      // In demo mode, return applications from store
      return applications
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch applications")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Backward compatibility aliases
  const create = createApplication
  const update = updateApplicationById
  const remove = deleteApplication

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication: updateApplicationById,
    deleteApplication,
    fetchApplications,
    // Backward compatibility
    create,
    update,
    delete: remove,
  }
}

// Export alias for backward compatibility
export const useApplicationsApi = useApplicationsAPI
