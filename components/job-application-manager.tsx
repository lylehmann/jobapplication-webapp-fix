"use client"

import { useState } from "react"
import { Plus, Search, MoreVertical, Eye, Edit, Trash2, FileText, Calendar, Building2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ApplicationEditor } from "./application-editor"
import { ApplicationPreview } from "./application-preview"
import { TemplateManager } from "./template-manager"
import { useApplications } from "@/hooks/use-applications"
import { ROLE_DEFINITIONS, type RoleType } from "@/lib/role-templates"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

export function JobApplicationManager() {
  const { toast } = useToast()
  const { applications, createApplication, updateApplication, deleteApplication, refresh, ConflictDialog, markDirty } = useApplications()
  const [currentView, setCurrentView] = useState<"dashboard" | "editor" | "preview" | "templates">("dashboard")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newApplication, setNewApplication] = useState({
    job_title: "",
    company: "",
    target_role: "frontend-engineer" as RoleType,
  })

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesRole = roleFilter === "all" || app.target_role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleCreateApplication = async () => {
    try {
      const application = await createApplication({
        job_title: newApplication.job_title,
        company: newApplication.company,
        target_role: newApplication.target_role,
        status: "draft",
        personal_info: {},
        cover_letter_data: {},
        resume_data: {},
        projects_data: [],
        selected_documents: [],
        template_id: null,
      })

      setIsCreateDialogOpen(false)
      setNewApplication({
        job_title: "",
        company: "",
        target_role: "frontend-engineer",
      })

      toast({
        title: "Application Created",
        description: `${application.job_title} at ${application.company} has been created.`,
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateFromTemplate = async (applicationData: any) => {
    try {
      const application = await createApplication(applicationData)

      // Navigate to the editor with the new application
      setSelectedApplication(application)
      setCurrentView("editor")

      toast({
        title: "Application Created from Template",
        description: `Your application has been created and is ready for customization.`,
      })
    } catch (error) {
      toast({
        title: "Template Application Failed",
        description: "Failed to create application from template. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEditApplication = (application: Application) => {
    setSelectedApplication(application)
    setCurrentView("editor")
  }

  const handlePreviewApplication = (application: Application) => {
    setSelectedApplication(application)
    setCurrentView("preview")
  }

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      await deleteApplication(applicationId)
      toast({
        title: "Application Deleted",
        description: "The application has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateApplication = async (id: string, updates: any) => {
    try {
      await updateApplication(id, updates)
    } catch (error) {
      throw error
    }
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

  const getRoleColor = (role: RoleType) => {
    return ROLE_DEFINITIONS[role]?.color || "bg-gray-100 text-gray-800"
  }

  if (currentView === "editor" && selectedApplication) {
    return (
      <>
        <div className="flex justify-end p-2">
          <Button variant="outline" onClick={refresh} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync mit Supabase
          </Button>
        </div>
        <ApplicationEditor
          application={selectedApplication}
          onUpdate={(updates) => {
            markDirty()
            handleUpdateApplication(selectedApplication.id, updates)
          }}
          onBack={() => setCurrentView("dashboard")}
          onPreview={() => setCurrentView("preview")}
        />
        <ConflictDialog />
      </>
    )
  }

  if (currentView === "preview" && selectedApplication) {
    return (
      <>
        <ApplicationPreview
          application={selectedApplication}
          onBack={() => setCurrentView("dashboard")}
          onEdit={() => setCurrentView("editor")}
        />
        <ConflictDialog />
      </>
    )
  }

  if (currentView === "templates") {
    return <TemplateManager onBack={() => setCurrentView("dashboard")} onApplicationCreate={handleCreateFromTemplate} />
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-bold text-foreground text-3xl">Job Applications</h1>
            <p className="mt-1 text-muted-foreground">Manage your job applications and track your progress</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setCurrentView("templates")}>
              <FileText className="mr-2 w-4 h-4" />
              Templates
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 w-4 h-4" />
                  New Application
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Application</DialogTitle>
                  <DialogDescription>Start a new job application</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input
                      id="job-title"
                      placeholder="e.g., Senior Frontend Engineer"
                      value={newApplication.job_title}
                      onChange={(e) => setNewApplication((prev) => ({ ...prev, job_title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="e.g., Tech Corp"
                      value={newApplication.company}
                      onChange={(e) => setNewApplication((prev) => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Role</Label>
                    <Select
                      value={newApplication.target_role}
                      onValueChange={(value: RoleType) =>
                        setNewApplication((prev) => ({ ...prev, target_role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span>{role.icon}</span>
                              <span>{role.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateApplication}
                      disabled={!newApplication.job_title || !newApplication.company}
                    >
                      Create Application
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
                <SelectItem key={key} value={key}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Applications Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((application) => {
            const roleData = ROLE_DEFINITIONS[application.target_role]
            return (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="mb-1 text-lg">{application.job_title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mb-3">
                        <Building2 className="w-4 h-4" />
                        {application.company}
                      </CardDescription>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                        <Badge className={getRoleColor(application.target_role)}>
                          <span className="mr-1">{roleData?.icon}</span>
                          {roleData?.label}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditApplication(application)}>
                          <Edit className="mr-2 w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePreviewApplication(application)}>
                          <Eye className="mr-2 w-4 h-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this application?")) {
                              handleDeleteApplication(application.id)
                            }
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(application.updated_at).toLocaleDateString()}
                    </span>
                    {application.template_id && (
                      <Badge variant="outline" className="text-xs">
                        Template Applied
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleEditApplication(application)} className="flex-1">
                      <Edit className="mr-2 w-4 h-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handlePreviewApplication(application)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="py-12 text-center">
            <div className="flex justify-center items-center bg-muted mx-auto mb-4 rounded-lg w-12 h-12">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium text-foreground text-lg">No applications found</h3>
            <p className="mb-4 text-muted-foreground">
              {searchQuery || statusFilter !== "all" || roleFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first job application to get started"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 w-4 h-4" />
              Create Application
            </Button>
          </div>
        )}
      </div>
      <ConflictDialog />
    </div>
  )
}
