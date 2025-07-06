"use client"

import { useState } from "react"
import { ArrowLeft, Save, Eye, Upload, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProfilePictureManager } from "./profile-picture-manager"

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

interface ApplicationEditorProps {
  application: Application
  onUpdate: (app: Application) => void
  onBack: () => void
  onPreview: () => void
}

export function ApplicationEditor({ application, onUpdate, onBack, onPreview }: ApplicationEditorProps) {
  const [formData, setFormData] = useState(application)
  const [activeTab, setActiveTab] = useState("basic")

  const handleSave = () => {
    onUpdate(formData)
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{formData.jobTitle}</h1>
              <p className="text-gray-600">{formData.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>Basic information about this job application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => updateField("jobTitle", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => updateField("company", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cover-letter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
                <CardDescription>Create a professional cover letter with proper business formatting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sender Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Your Full Name" />
                    <Input placeholder="Your Email Address" />
                    <Input placeholder="Your Phone Number" />
                    <Input placeholder="Your LinkedIn Profile (optional)" />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Address</Label>
                    <Input placeholder="Street Address" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input placeholder="City" />
                      <Input placeholder="State/Province" />
                      <Input placeholder="ZIP/Postal Code" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Recipient Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recipient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Hiring Manager Name (if known)" />
                    <Input placeholder="Their Title (e.g., HR Manager)" />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Address</Label>
                    <Input
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={(e) => updateField("company", e.target.value)}
                    />
                    <Input placeholder="Department (optional)" />
                    <Input placeholder="Street Address" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input placeholder="City" />
                      <Input placeholder="State/Province" />
                      <Input placeholder="ZIP/Postal Code" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Letter Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Letter Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject Line</Label>
                      <Input placeholder={`Application for ${formData.jobTitle} Position`} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Letter Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Letter Content</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Salutation</Label>
                      <Input placeholder="Dear Hiring Manager," />
                    </div>

                    <div className="space-y-2">
                      <Label>Opening Paragraph</Label>
                      <Textarea
                        placeholder="I am writing to express my strong interest in the [Job Title] position at [Company Name]. With my background in..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Body Paragraphs</Label>
                      <Textarea
                        placeholder="In my previous role as [Previous Position], I successfully... 

My experience with [relevant skills/technologies] makes me well-suited for this position because..."
                        value={formData.coverLetter}
                        onChange={(e) => updateField("coverLetter", e.target.value)}
                        className="min-h-[200px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Closing Paragraph</Label>
                      <Textarea
                        placeholder="I would welcome the opportunity to discuss how my skills and experience can contribute to [Company Name]'s continued success. Thank you for considering my application."
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sign-off</Label>
                      <Input placeholder="Sincerely," />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume Builder</CardTitle>
                <CardDescription>Build and customize your resume for this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Personal Information with Profile Picture */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information & Profile</h3>

                    <div className="flex items-start gap-6">
                      <ProfilePictureManager
                        currentImage=""
                        onImageChange={(image) => {
                          // Handle image change
                          console.log("Profile image updated:", image)
                        }}
                        size="lg"
                      />

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="Full Name" />
                          <Input placeholder="Professional Title" />
                          <Input placeholder="Email Address" />
                          <Input placeholder="Phone Number" />
                          <Input placeholder="Location (City, State)" />
                          <Input placeholder="LinkedIn Profile" />
                          <Input placeholder="Portfolio Website" />
                          <Input placeholder="GitHub Profile" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Professional Summary</h3>
                    <Textarea placeholder="Brief professional summary..." className="min-h-[100px]" />
                  </div>

                  {/* Experience Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Work Experience</h3>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                    <Card className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="Job Title" />
                          <Input placeholder="Company Name" />
                          <Input placeholder="Start Date" />
                          <Input placeholder="End Date" />
                        </div>
                        <Textarea placeholder="Job description and achievements..." className="min-h-[100px]" />
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Full-time</Badge>
                          <Badge variant="outline">Remote</Badge>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Education Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Education</h3>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                    <Card className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="Degree" />
                          <Input placeholder="Institution" />
                          <Input placeholder="Graduation Year" />
                          <Input placeholder="GPA (optional)" />
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge>JavaScript</Badge>
                      <Badge>React</Badge>
                      <Badge>Node.js</Badge>
                      <Badge>Python</Badge>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>Showcase your relevant projects and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your key projects, technologies used, and outcomes achieved..."
                  value={formData.projectOverview}
                  onChange={(e) => updateField("projectOverview", e.target.value)}
                  className="min-h-[300px]"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
                <CardDescription>Upload certificates, references, and other supporting materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                    <Button variant="outline">Choose Files</Button>
                  </div>

                  {/* Document List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">📄</div>
                        <div>
                          <p className="font-medium">Certificate_AWS.pdf</p>
                          <p className="text-sm text-gray-600">2.3 MB</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
