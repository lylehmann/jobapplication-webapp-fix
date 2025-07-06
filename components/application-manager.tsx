"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Eye,
  Calendar,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Printer,
} from "lucide-react"
import { ApplicationEditor } from "./application-editor"
import { ApplicationPreview } from "./application-preview"
import { ExportImportManager } from "./export-import-manager"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface ApplicationManagerProps {
  application: Application
  onUpdate: (updates: Partial<Application>) => Promise<void> | void
}

export function ApplicationManager({ application, onUpdate }: ApplicationManagerProps) {
  const [activeTab, setActiveTab] = useState("editor")

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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{application.job_title}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Building2 className="w-4 h-4" />
                <span>{application.company}</span>
              </div>
              <Badge className={getStatusColor(application.status)}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
            <div className="text-right text-sm text-muted-foreground">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{application.resume_data?.experience?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Berufserfahrungen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{application.projects_data?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Projekte</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {application.resume_data?.skills ? Object.values(application.resume_data.skills).flat().length : 0}
            </div>
            <div className="text-sm text-muted-foreground">Fähigkeiten</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-white print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bewerbungsmanager</h1>
              <p className="text-muted-foreground">
                {application.job_title} bei {application.company}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2 bg-transparent"
              >
                <Printer className="w-4 h-4" />
                Drucken
              </Button>
              <ExportImportManager application={application} onUpdate={onUpdate} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 print:hidden">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bearbeiten
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Vorschau
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 print:hidden">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="editor" className="space-y-6 print:hidden">
            <ApplicationEditor application={application} onUpdate={onUpdate} />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <ApplicationPreview application={application} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
