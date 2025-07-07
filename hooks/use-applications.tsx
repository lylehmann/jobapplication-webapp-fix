"use client"

import { useEffect, useRef, useState } from "react"
import { useAppStore } from "@/lib/store/app-store"
import { unifiedAPI } from "@/lib/api/unified-api"
import { realtimeManager } from "@/lib/supabase/realtime"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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

  const [showConflictDialog, setShowConflictDialog] = useState(false)
  const [incomingApplications, setIncomingApplications] = useState<any[]>([])
  const localDirtyRef = useRef(false)

  // Track if local changes are unsaved
  const markDirty = () => { localDirtyRef.current = true }
  const markClean = () => { localDirtyRef.current = false }

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

  // Realtime-Sync: subscribe on mount
  useEffect(() => {
    const handleRealtime = async (payload: any) => {
      // Always reload from Supabase on any change
      const latest = await unifiedAPI.getApplications()
      if (localDirtyRef.current) {
        setIncomingApplications(latest)
        setShowConflictDialog(true)
      } else {
        setApplications(latest)
      }
    }
    const sub = realtimeManager.subscribeToApplications(handleRealtime)
    return () => {
      realtimeManager.unsubscribe("applications")
    }
  }, [])

  // Sync-Button handler
  const syncFromSupabase = async () => {
    const latest = await unifiedAPI.getApplications()
    if (localDirtyRef.current) {
      setIncomingApplications(latest)
      setShowConflictDialog(true)
    } else {
      setApplications(latest)
    }
  }

  // Merge-Dialog actions
  const keepLocal = () => {
    setShowConflictDialog(false)
    setIncomingApplications([])
    // Lokale Änderungen behalten, nichts tun
  }
  const acceptRemote = () => {
    setShowConflictDialog(false)
    setApplications(incomingApplications)
    setIncomingApplications([])
    markClean()
  }

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

  // ConflictDialog as a function
  function ConflictDialog() {
    if (!showConflictDialog) return null
    return (
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konflikt bei der Synchronisation</DialogTitle>
            <DialogDescription>
              Es gibt ungespeicherte lokale Änderungen, aber auch neue Daten aus Supabase.<br />
              Möchtest du deine lokalen Änderungen behalten oder die Supabase-Daten übernehmen?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={keepLocal} variant="secondary">Lokale Änderungen behalten</Button>
            <Button onClick={acceptRemote} variant="destructive">Supabase-Daten übernehmen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
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
    refresh: syncFromSupabase,
    processPendingOperations: async () => {},
    error: null,
    markDirty,
    markClean,
    ConflictDialog,
  }
}
