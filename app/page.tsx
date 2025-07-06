"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Printer, FileText, Edit, Eye } from "lucide-react"
import { ApplicationEditor } from "@/components/application-editor"
import { ApplicationPreview } from "@/components/application-preview"
import { ExportImportManager } from "@/components/export-import-manager"
import { useAppStore } from "@/lib/store/app-store"

export default function HomePage() {
  const { applications, addApplication, updateApplication } = useAppStore()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Create a default application if none exists
  const createDefaultApplication = () => {
    const defaultApp = {
      id: `app-${Date.now()}`,
      user_id: "demo-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "draft",
      job_title: "",
      company: "",
      personal_info: {},
      cover_letter_data: {},
      resume_data: {},
      projects_data: [],
      selected_documents: [],
    }
    addApplication(defaultApp)
    setSelectedApplication(defaultApp)
    setActiveTab("editor")
  }

  const handleUpdateApplication = (updates: any) => {
    if (selectedApplication) {
      const updatedApp = { ...selectedApplication, ...updates, updated_at: new Date().toISOString() }
      updateApplication(selectedApplication.id, updatedApp)
      setSelectedApplication(updatedApp)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!selectedApplication && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Willkommen bei Ihrem Bewerbungsmanager</CardTitle>
            <CardDescription>
              Erstellen Sie professionelle Bewerbungsunterlagen für den deutschen Arbeitsmarkt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={createDefaultApplication} className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Neue Bewerbung erstellen
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!selectedApplication && applications.length > 0) {
    setSelectedApplication(applications[0])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bewerbungsmanager</h1>
            <p className="text-sm text-gray-600">
              {selectedApplication?.job_title || "Neue Bewerbung"} bei {selectedApplication?.company || "Unternehmen"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExportImportManager application={selectedApplication} onUpdate={handleUpdateApplication} />
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Drucken
            </Button>
            <Badge variant="outline" className="capitalize">
              {selectedApplication?.status || "draft"}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-80px)]">
        <div className="border-b bg-white">
          <TabsList className="ml-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Bearbeiten
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Vorschau
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="h-full">
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bewerbungsübersicht</CardTitle>
                  <CardDescription>Verwalten Sie Ihre Bewerbungsunterlagen für deutsche Unternehmen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedApplication?.resume_data?.experience?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Berufserfahrungen</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedApplication?.projects_data?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Projekte</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedApplication?.selected_documents?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Dokumente</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={() => setActiveTab("editor")} className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Bearbeiten
                    </Button>
                    <Button onClick={() => setActiveTab("preview")} variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Vorschau
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schnellaktionen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={createDefaultApplication}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Neue Bewerbung erstellen
                  </Button>
                  <ExportImportManager application={selectedApplication} onUpdate={handleUpdateApplication} />
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Bewerbung drucken
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="editor" className="h-full">
          {selectedApplication && (
            <ApplicationEditor application={selectedApplication} onUpdate={handleUpdateApplication} />
          )}
        </TabsContent>

        <TabsContent value="preview" className="h-full">
          {selectedApplication && <ApplicationPreview application={selectedApplication} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
