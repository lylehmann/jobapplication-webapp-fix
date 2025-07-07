"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FileText from "lucide-react/dist/esm/icons/file-text"
import Eye from "lucide-react/dist/esm/icons/eye"
import Calendar from "lucide-react/dist/esm/icons/calendar"
import Building2 from "lucide-react/dist/esm/icons/building-2"
import User from "lucide-react/dist/esm/icons/user"
import Mail from "lucide-react/dist/esm/icons/mail"
import Phone from "lucide-react/dist/esm/icons/phone"
import MapPin from "lucide-react/dist/esm/icons/map-pin"
import Globe from "lucide-react/dist/esm/icons/globe"
import Github from "lucide-react/dist/esm/icons/github"
import Linkedin from "lucide-react/dist/esm/icons/linkedin"
import Printer from "lucide-react/dist/esm/icons/printer"
import Save from "lucide-react/dist/esm/icons/save"
import Home from "lucide-react/dist/esm/icons/home"
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left"
import CheckCircle from "lucide-react/dist/esm/icons/check-circle"
import Cloud from "lucide-react/dist/esm/icons/cloud"
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw"
import XCircle from "lucide-react/dist/esm/icons/x-circle"
import { ApplicationEditor } from "./application-editor"
import { ApplicationPreview } from "./application-preview"
import { ExportImportManager } from "./export-import-manager"
import type { Database } from "@/lib/database.types"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { ApplicationsAPI } from "@/lib/api/applications"
import { useAppStore } from "@/lib/store/app-store"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface ApplicationManagerProps {
  application: Application
  onUpdate: (updates: Partial<Application>) => Promise<void> | void
  onBackToOverview?: () => void
}

export function ApplicationManager({ application, onUpdate, onBackToOverview }: ApplicationManagerProps) {
  const [activeTab, setActiveTab] = useState("editor")
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const prevAppRef = useRef(application)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [syncMessage, setSyncMessage] = useState<string>("")

  // Mark as dirty if application changes
  useEffect(() => {
    if (prevAppRef.current?.id !== application?.id) {
      setIsDirty(true)
      prevAppRef.current = application
    }
  }, [application?.id]) // Only depend on ID to avoid infinite loops

  if (!application) {
    return (
      <div className="flex justify-center items-center bg-background min-h-screen">
        <div className="space-y-4 text-center">
          <h2 className="font-bold text-gray-900 text-2xl">Keine Bewerbung ausgewählt</h2>
          <p className="text-gray-600">Bitte erstelle oder wähle eine Bewerbung aus.</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "submitted":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSave = async () => {
    if (!application?.id) {
      console.error('Cannot save: no application or missing ID')
      return
    }
    
    setIsSaving(true)
    try {
      await onUpdate(application)
      setIsDirty(false)
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSync = async () => {
    // Validate application before sync
    console.log('handleSync called with application:', application)
    console.log('Application type:', typeof application)
    console.log('Application keys:', application ? Object.keys(application) : 'null/undefined')
    
    if (!application || !application.id) {
      console.error('Cannot sync: Application or Application ID is missing', application)
      setSyncStatus('error')
      setSyncMessage('Sync fehlgeschlagen: Ungültige Bewerbung')
      setTimeout(() => setSyncStatus('idle'), 2500)
      return
    }

    // Check if we're in demo mode
    const isDev = process.env.NODE_ENV === "development" || 
                  (typeof window !== "undefined" && window.location.hostname === "localhost")
    
    if (isDev && typeof window !== "undefined" && localStorage.getItem("demo-user-session")) {
      // In demo mode, push local changes to Supabase instead of pulling
      setSyncStatus('syncing')
      setSyncMessage('Speichere zu Supabase...')
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const api = new ApplicationsAPI()
        
        // Get all local applications from store
        const { applications } = useAppStore.getState()
        
        console.log('Demo mode: Pushing local applications to Supabase...', applications.length)
        
        let successCount = 0
        let errorCount = 0
        
        for (const localApp of applications) {
          try {
            // Skip demo applications - they are for local testing only
            if (localApp.id === 'demo-app-1' || localApp.id?.startsWith('demo-') || 
                localApp.user_id === 'demo-user' || localApp.user_id === '00000000-0000-0000-0000-000000000001') {
              console.log('Demo mode: Skipping demo application:', localApp.id)
              continue
            }
            
            // Filter out fields that don't exist in the database schema before syncing
            const cleanedApp = { ...localApp }
            const fieldsToRemove = ['deadline', 'priority', 'location', 'cover_letter']
            fieldsToRemove.forEach(field => delete cleanedApp[field])
            
            // Only sync real applications with valid UUIDs
            if (localApp.id && localApp.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
              // For real applications with real UUIDs, try to update
              console.log('Demo mode: Updating application in Supabase:', localApp.id)
              await api.updateApplication(localApp.id, cleanedApp)
              successCount++
            } else if (!localApp.id || localApp.id === 'new' || localApp.id.startsWith('temp-')) {
              // For new applications without IDs, create new ones in Supabase
              console.log('Demo mode: Creating new application in Supabase for:', localApp.job_title || localApp.title)
              const { id, user_id, ...appData } = cleanedApp
              const newApp = await api.createApplication(appData)
              
              // Update the local store with the new Supabase ID
              const { updateApplication } = useAppStore.getState()
              updateApplication(localApp.id || 'new', { ...newApp })
              
              console.log('Demo mode: Created new application with ID:', newApp.id)
              successCount++
            } else {
              console.log('Demo mode: Skipping application with invalid ID format:', localApp.id)
            }
          } catch (appError) {
            console.error('Failed to sync application:', localApp.id, appError)
            errorCount++
          }
        }
        
        if (errorCount === 0) {
          console.log('Demo mode: Successfully pushed all applications to Supabase')
          setSyncStatus('success')
          setSyncMessage(`${successCount} Bewerbung(en) zu Supabase gespeichert`)
        } else {
          console.log('Demo mode: Some applications failed to sync')
          setSyncStatus('success')
          setSyncMessage(`${successCount} gespeichert, ${errorCount} fehlgeschlagen`)
        }
        
        // Trigger storage event to notify other tabs about the sync
        const storeData = localStorage.getItem('job-application-store')
        if (storeData) {
          const parsed = JSON.parse(storeData)
          parsed.lastSyncToSupabase = Date.now()
          localStorage.setItem('job-application-store', JSON.stringify(parsed))
        }
        
        setTimeout(() => setSyncStatus('idle'), 2000)
        return
      } catch (e: any) {
        console.error('Demo sync to Supabase failed:', e)
        setSyncStatus('error')
        setSyncMessage(`Speichern fehlgeschlagen: ${e.message}`)
        setTimeout(() => setSyncStatus('idle'), 2500)
        return
      }
    }

    setSyncStatus('syncing')
    setSyncMessage('Synchronisiere...')
    try {
      console.log('Starting sync for application:', application.id)
      const api = new ApplicationsAPI()
      
      // First, try to update the application
      console.log('Updating application with current data...')
      const updatedApp = await api.updateApplication(application.id, application)
      console.log('Update successful, fetching fresh data...')
      
      // Then fetch fresh data to ensure consistency
      const freshApp = await api.getApplication(application.id)
      console.log('Fresh data retrieved successfully')
      
      onUpdate(freshApp)
      setSyncStatus('success')
      setSyncMessage('Synchronisiert')
      setTimeout(() => setSyncStatus('idle'), 1500)
    } catch (e: any) {
      console.error('Sync failed:', e)
      setSyncStatus('error')
      setSyncMessage(`Sync fehlgeschlagen: ${e.message || 'Unbekannter Fehler'}`)
      setTimeout(() => setSyncStatus('idle'), 2500)
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-2 text-2xl">{application.job_title}</CardTitle>
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span>{application.company}</span>
              </div>
              <Badge className={getStatusColor(application.status)}>
                {typeof application.status === 'string' && application.status.length > 0
                  ? application.status.charAt(0).toUpperCase() + application.status.slice(1)
                  : 'Unbekannt'}
              </Badge>
            </div>
            <div className="text-muted-foreground text-sm text-right">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Erstellt: {new Date(application.created_at).toLocaleDateString("de-DE")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Aktualisiert: {new Date(application.updated_at).toLocaleDateString("de-DE")}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Info Card */}
      {application.personal_info && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Persönliche Daten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              {application.personal_info.fullName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{application.personal_info.fullName}</span>
                </div>
              )}
              {application.personal_info.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{application.personal_info.email}</span>
                </div>
              )}
              {application.personal_info.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{application.personal_info.phone}</span>
                </div>
              )}
              {application.personal_info.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{application.personal_info.location}</span>
                </div>
              )}
              {application.personal_info.portfolio && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span>{application.personal_info.portfolio}</span>
                </div>
              )}
              {application.personal_info.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-muted-foreground" />
                  <span>{application.personal_info.github}</span>
                </div>
              )}
              {application.personal_info.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-muted-foreground" />
                  <span>{application.personal_info.linkedin}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="font-bold text-blue-600 text-2xl">{application.resume_data?.experience?.length || 0}</div>
            <div className="text-muted-foreground text-sm">Berufserfahrungen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="font-bold text-green-600 text-2xl">{application.projects_data?.length || 0}</div>
            <div className="text-muted-foreground text-sm">Projekte</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="font-bold text-purple-600 text-2xl">
              {application.resume_data?.skills ? Object.values(application.resume_data.skills).flat().length : 0}
            </div>
            <div className="text-muted-foreground text-sm">Fähigkeiten</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Editor action buttons for the toolbar
  const editorNavbar = (
    <div className="flex items-center justify-between bg-white px-4 py-2 border-b sticky top-14 z-40">
      {/* Links: Bewerbungsname */}
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-gray-900 text-lg truncate max-w-[300px]">
          {application.job_title || "Unbenannte Bewerbung"} 
          {application.company && <span className="text-gray-600"> bei {application.company}</span>}
        </h2>
      </div>
      
      {/* Mitte: Tab Navigation */}
      <div className="flex items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="editor">Bearbeiten</TabsTrigger>
            <TabsTrigger value="preview">Vorschau</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Rechts: Action Buttons */}
      <div className="flex items-center gap-2">
        <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-2">
          <Printer className="w-4 h-4" /> Drucken
        </Button>
        <ExportImportManager application={application} onUpdate={onUpdate} />
        <Tooltip content="Mit Supabase synchronisieren">
          <Button variant="ghost" size="icon" onClick={handleSync} aria-label="Sync">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </Tooltip>
        <Tooltip content="Speichern">
          <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4" />
          </Button>
        </Tooltip>
        {onBackToOverview && (
          <Button onClick={onBackToOverview} variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Zurück
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <TooltipProvider>
      <div className="bg-background min-h-screen pt-14">
        {editorNavbar}
        <div className="mx-auto p-6 max-w-7xl">
          <div className="space-y-6">
            {activeTab === "overview" && (
              <div className="print:hidden space-y-6">
                {renderOverview()}
              </div>
            )}
            {activeTab === "editor" && (
              <div className="print:hidden space-y-6">
                <ApplicationEditor application={application} onUpdate={onUpdate} />
              </div>
            )}
            {activeTab === "preview" && (
              <div className="space-y-6">
                <ApplicationPreview application={application} />
              </div>
            )}
          </div>
        </div>
        {/* Statusbar bleibt erhalten */}
        <div className="bottom-0 left-0 z-50 fixed flex justify-center w-full pointer-events-none">
          <div className="flex items-center gap-2 bg-white shadow px-4 py-2 border rounded-t-lg font-medium text-sm animate-fade-in-up pointer-events-auto">
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                {syncMessage}
              </>
            ) : syncStatus === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                {syncMessage}
              </>
            ) : syncStatus === 'error' ? (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                {syncMessage}
              </>
            ) : isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                Speichern...
              </>
            ) : isDirty ? (
              <>
                <Cloud className="w-4 h-4 text-yellow-500" />
                Nicht gespeichert
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                Gespeichert
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
