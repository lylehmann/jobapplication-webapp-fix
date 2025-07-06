"use client"

import { useState } from "react"
import { Plus, FileText, Briefcase, Download, Upload, Settings, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ApplicationEditor } from "@/components/application-editor"
import { ApplicationPreview } from "@/components/application-preview"
import { TemplateManager } from "@/components/template-manager"

interface Application {
  id: string
  jobTitle: string
  company: string
  status: "draft" | "in-progress" | "submitted" | "archived"
  lastModified: string
  template?: string
  coverLetter: string
  resume: any
  projectOverview: string
  documents: any[]
}

export default function JobApplicationManager() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      status: "in-progress",
      lastModified: "2024-01-15",
      coverLetter: "",
      resume: {},
      projectOverview: "",
      documents: [],
    },
    {
      id: "2",
      jobTitle: "Full Stack Engineer",
      company: "StartupXYZ",
      status: "draft",
      lastModified: "2024-01-10",
      coverLetter: "",
      resume: {},
      projectOverview: "",
      documents: [],
    },
  ])

  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [activeView, setActiveView] = useState<"dashboard" | "editor" | "preview" | "templates">("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredApplications = applications.filter(
    (app) =>
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "submitted":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const createNewApplication = () => {
    const newApp: Application = {
      id: Date.now().toString(),
      jobTitle: "New Application",
      company: "Company Name",
      status: "draft",
      lastModified: new Date().toISOString().split("T")[0],
      coverLetter: "",
      resume: {},
      projectOverview: "",
      documents: [],
    }
    setApplications([...applications, newApp])
    setSelectedApp(newApp)
    setActiveView("editor")
  }

  const updateApplication = (updatedApp: Application) => {
    setApplications((apps) =>
      apps.map((app) =>
        app.id === updatedApp.id ? { ...updatedApp, lastModified: new Date().toISOString().split("T")[0] } : app,
      ),
    )
    setSelectedApp(updatedApp)
  }

  if (activeView === "editor" && selectedApp) {
    return (
      <ApplicationEditor
        application={selectedApp}
        onUpdate={updateApplication}
        onBack={() => setActiveView("dashboard")}
        onPreview={() => setActiveView("preview")}
      />
    )
  }

  if (activeView === "preview" && selectedApp) {
    return (
      <ApplicationPreview
        application={selectedApp}
        onBack={() => setActiveView("editor")}
        onEdit={() => setActiveView("editor")}
      />
    )
  }

  if (activeView === "templates") {
    return (
      <TemplateManager
        onBack={() => setActiveView("dashboard")}
        onSelectTemplate={(template) => {
          // Handle template selection
          setActiveView("dashboard")
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Application Manager</h1>
            <p className="text-gray-600 mt-1">Manage and organize your job applications efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setActiveView("templates")}>
              <Settings className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button onClick={createNewApplication}>
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter((app) => app.status === "in-progress").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {applications.filter((app) => app.status === "submitted").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {applications.filter((app) => app.status === "draft").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{app.jobTitle}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">{app.company}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Last modified: {app.lastModified}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedApp(app)
                      setActiveView("editor")
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedApp(app)
                      setActiveView("preview")
                    }}
                  >
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first job application"}
            </p>
            {!searchQuery && (
              <Button onClick={createNewApplication}>
                <Plus className="w-4 h-4 mr-2" />
                Create Application
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
