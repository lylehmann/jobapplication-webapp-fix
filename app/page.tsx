"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Printer, FileText, Edit, Eye } from "lucide-react"
import { ApplicationEditor } from "@/components/application-editor"
import { ApplicationPreview } from "@/components/application-preview"
import { ExportImportManager } from "@/components/export-import-manager"
import { useAppStore } from "@/lib/store/app-store"
import { ApplicationManager } from "@/components/application-manager"
import { JobApplicationManager } from "@/components/job-application-manager"
import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default function HomePage() {
  const { user, loading, signOut } = useAuth()
  const { applications, addApplication } = useAppStore()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)

  // Initialize selected application when applications are loaded
  useEffect(() => {
    console.log('Page.tsx useEffect: applications count:', applications.length, 'has selectedApplication:', !!selectedApplication)
    
    if (applications.length > 0 && !selectedApplication) {
      console.log('Setting first application as selected:', applications[0])
      setSelectedApplication(applications[0])
    } else if (applications.length === 0 && selectedApplication) {
      console.log('No applications found, clearing selected application')
      setSelectedApplication(null)
    }
  }, [applications.length, selectedApplication?.id]) // Only depend on length and ID to avoid infinite loops

  if (loading) return null // Optional: Spinner
  if (!user) return <LoginForm />

  // User status bar
  const userLabel = user.email || 'Demo User'

  const handleCreate = () => {
    const newApp = {
      id: generateUUID(),
      job_title: "",
      company: "",
      status: "draft",
      personal_info: {},
      cover_letter_data: {},
      resume_data: {},
      projects_data: [],
      selected_documents: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    addApplication(newApp)
    setSelectedApplication(newApp)
  }

  const handleUpdate = (updates: any) => {
    if (!selectedApplication?.id) {
      console.error('Cannot update application: no selected application or missing ID')
      return
    }
    
    // Ensure we merge the updates with the existing application data
    const mergedApp = {
      ...selectedApplication,
      ...updates,
      id: selectedApplication.id, // Ensure ID is preserved
      updated_at: new Date().toISOString(), // Always update the timestamp
    }
    
    // Update im Store mit der updateApplication Methode
    const { updateApplication } = useAppStore.getState()
    updateApplication(selectedApplication.id, mergedApp)
    setSelectedApplication(mergedApp)
  }

  const handleBackToOverview = () => {
    setSelectedApplication(null)
  }

  if (!selectedApplication) {
    return (
      <div className="flex flex-col justify-center items-center bg-background min-h-screen pt-14">
        <h2 className="mb-4 font-bold text-gray-900 text-2xl">Keine Bewerbung ausgewählt</h2>
        <button
          type="button"
          className="bg-blue-600 px-4 py-2 rounded text-white"
          onClick={handleCreate}
        >
          Neue Bewerbung erstellen
        </button>
        {/* Optional: Liste aller vorhandenen Bewerbungen */}
        {applications.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-2 font-semibold text-lg">Vorhandene Bewerbungen:</h3>
            <ul>
              {applications.map(app => (
                <li key={app.id}>
                  <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={() => setSelectedApplication(app)}
                  >
                    {app.job_title || "Unbenannte Bewerbung"} bei {app.company || "Unbekannt"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return <ApplicationManager application={selectedApplication} onUpdate={handleUpdate} onBackToOverview={handleBackToOverview} />
}
