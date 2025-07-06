"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store/app-store"
import { unifiedAPI } from "@/lib/api/unified-api"

export function useApplications() {
  const {
    applications,
    isLoading,
    isOnline,
    isSyncing,
    setApplications,
    addApplication,
    updateApplication,
    removeApplication,
  } = useAppStore()

  // Load applications on mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        await unifiedAPI.getApplications()
      } catch (error) {
        console.error("Failed to load applications:", error)
      }
    }

    if (applications.length === 0) {
      loadApplications()
    }
  }, [applications.length])

  const createApplication = async (data: any) => {
    try {
      return await unifiedAPI.createApplication(data)
    } catch (error) {
      console.error("Failed to create application:", error)
      throw error
    }
  }

  const updateApplicationById = async (id: string, updates: any) => {
    try {
      return await unifiedAPI.updateApplication(id, updates)
    } catch (error) {
      console.error("Failed to update application:", error)
      throw error
    }
  }

  const deleteApplication = async (id: string) => {
    try {
      await unifiedAPI.deleteApplication(id)
    } catch (error) {
      console.error("Failed to delete application:", error)
      throw error
    }
  }

  return {
    applications,
    isLoading,
    isOnline,
    isSyncing,
    connectionQuality: "good" as const,
    pendingOperationsCount: 0,
    createApplication,
    updateApplication: updateApplicationById,
    deleteApplication,
    refresh: () => unifiedAPI.getApplications(),
    processPendingOperations: async () => {},
    error: null,
  }
}
