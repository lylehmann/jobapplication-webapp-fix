"use client"

import { useState } from "react"
import { Check, AlertCircle, User, Building2, Target, FileText, Briefcase, GraduationCap } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ROLE_DEFINITIONS, type RoleType } from "@/lib/role-templates"
import {
  createApplicationFromTemplate,
  getTemplatePreview,
  validateTemplateApplication,
} from "@/lib/template-application"
import type { Database } from "@/lib/database.types"

type Template = Database["public"]["Tables"]["templates"]["Row"]

interface TemplateApplicationDialogProps {
  template: Template | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplicationCreate?: (applicationData: any) => Promise<void>
}

export function TemplateApplicationDialog({
  template,
  open,
  onOpenChange,
  onApplicationCreate = async () => {
    console.log("No onApplicationCreate callback provided")
  },
}: TemplateApplicationDialogProps) {
  const [isApplying, setIsApplying] = useState(false)
  const [applicationData, setApplicationData] = useState({
    job_title: "",
    company: "",
  })
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  if (!template) return null

  const roleData = ROLE_DEFINITIONS[template.target_role as RoleType]
  const templatePreview = getTemplatePreview(template)
  const validation = validateTemplateApplication(template)

  const handleApplyTemplate = async () => {
    setIsApplying(true)
    setValidationErrors([])

    try {
      // Validate inputs
      const errors: string[] = []
      if (!applicationData.job_title.trim()) {
        errors.push("Job title is required")
      }
      if (!applicationData.company.trim()) {
        errors.push("Company name is required")
      }

      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }

      // Create application from template
      const result = createApplicationFromTemplate(template, {
        job_title: applicationData.job_title,
        company: applicationData.company,
      })

      if (!result.success || !result.application) {
        throw new Error(result.error || "Failed to create application")
      }

      console.log("Template application result:", result)
      console.log("Calling onApplicationCreate with:", result.application)

      // Call the parent callback to create the application
      if (onApplicationCreate && typeof onApplicationCreate === "function") {
        await onApplicationCreate(result.application)
      } else {
        console.error("onApplicationCreate is not a function:", onApplicationCreate)
        throw new Error("Application creation callback is not available")
      }

      // Reset form and close dialog
      setApplicationData({ job_title: "", company: "" })
      onOpenChange(false)
    } catch (error) {
      console.error("Error applying template:", error)
      setValidationErrors([error instanceof Error ? error.message : "Failed to apply template"])
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{roleData.icon}</span>
            Apply Template: {template.name}
          </DialogTitle>
          <DialogDescription>Create a new job application using this {roleData.label} template</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Template Validation */}
          {!validation.valid && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-2">Template validation failed:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Application Details Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Application Details
              </CardTitle>
              <CardDescription>Provide basic information for your new application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  placeholder={`e.g., Senior ${roleData.label}`}
                  value={applicationData.job_title}
                  onChange={(e) => setApplicationData((prev) => ({ ...prev, job_title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="e.g., Tech Corp"
                  value={applicationData.company}
                  onChange={(e) => setApplicationData((prev) => ({ ...prev, company: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Template Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Template Preview
              </CardTitle>
              <CardDescription>What will be included in your new application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Role Information */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl">{roleData.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{roleData.label}</h4>
                  <p className="text-sm text-muted-foreground">{roleData.description}</p>
                </div>
                <Badge className={roleData.color}>{templatePreview.skillsCount} Skills</Badge>
              </div>

              <Separator />

              {/* Content Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-green-600" />
                    <span>Personal Information</span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span>Professional Summary</span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span>Cover Letter Template</span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-green-600" />
                    <span>Role-Specific Skills</span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-green-600" />
                    <span>Experience Template</span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-green-600" />
                    <span>Education & Certifications</span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-green-600" />
                    <span>Project Examples</span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span>Document Structure</span>
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Skills Preview */}
              <div>
                <h4 className="font-medium mb-2">Key Skills Included:</h4>
                <div className="flex flex-wrap gap-1">
                  {roleData.skills.slice(0, 8).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {roleData.skills.length > 8 && (
                    <Badge variant="secondary" className="text-xs">
                      +{roleData.skills.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isApplying}>
              Cancel
            </Button>
            <Button
              onClick={handleApplyTemplate}
              disabled={isApplying || !validation.valid || !applicationData.job_title || !applicationData.company}
            >
              {isApplying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Application...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Application
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
