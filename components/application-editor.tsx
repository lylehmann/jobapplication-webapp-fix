"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Mail,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Plus,
  Trash2,
  Star,
  Languages,
  Save,
  Upload,
  File,
  X,
  Paperclip,
  Building2,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  AlertCircle,
  Copy,
  Loader,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Database } from "@/lib/database.types"
import { ProfilePictureManager } from "./profile-picture-manager"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface ApplicationEditorProps {
  application: Application
  onUpdate: (updates: Partial<Application>) => Promise<void> | void
}

// Employment types with enhanced categorization
const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Vollzeit", color: "bg-green-100 text-green-800", category: "employment" },
  { value: "part-time", label: "Teilzeit", color: "bg-blue-100 text-blue-800", category: "employment" },
  { value: "student-job", label: "Studentenjob", color: "bg-purple-100 text-purple-800", category: "employment" },
  { value: "internship", label: "Praktikum", color: "bg-indigo-100 text-indigo-800", category: "employment" },
  { value: "freelance", label: "Freiberuflich", color: "bg-teal-100 text-teal-800", category: "employment" },
  { value: "volunteer", label: "Freiwilligenarbeit", color: "bg-pink-100 text-pink-800", category: "gap-year" },
  { value: "travel", label: "Reisen", color: "bg-orange-100 text-orange-800", category: "gap-year" },
  { value: "course", label: "Weiterbildung", color: "bg-yellow-100 text-yellow-800", category: "gap-year" },
  { value: "project", label: "Persönliches Projekt", color: "bg-cyan-100 text-cyan-800", category: "gap-year" },
  { value: "other", label: "Sonstiges", color: "bg-gray-100 text-gray-800", category: "other" },
]

// Supported file types
const SUPPORTED_FILE_TYPES = {
  "application/pdf": { label: "PDF", icon: "📄" },
  "application/msword": { label: "Word", icon: "📝" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { label: "Word", icon: "📝" },
  "image/jpeg": { label: "JPEG", icon: "🖼️" },
  "image/png": { label: "PNG", icon: "🖼️" },
  "image/gif": { label: "GIF", icon: "🖼️" },
  "text/plain": { label: "Text", icon: "📄" },
  "application/vnd.ms-excel": { label: "Excel", icon: "📊" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { label: "Excel", icon: "📊" },
}

// German/EU skill rating system (1-5 scale)
const SKILL_LEVELS = [
  { value: 'basic', label: 'Grundkenntnisse' },
  { value: 'good', label: 'Gute Kenntnisse' },
  { value: 'very-good', label: 'Sehr gute Kenntnisse' },
  { value: 'expert', label: 'Experte' },
]

// CEFR Language levels (European standard)
const LANGUAGE_LEVELS = [
  { value: "A1", label: "A1 - Anfänger", description: "Beginner" },
  { value: "A2", label: "A2 - Grundlagen", description: "Elementary" },
  { value: "B1", label: "B1 - Mittelstufe", description: "Intermediate" },
  { value: "B2", label: "B2 - Gute Mittelstufe", description: "Upper intermediate" },
  { value: "C1", label: "C1 - Fortgeschritten", description: "Advanced" },
  { value: "C2", label: "C2 - Muttersprachlich", description: "Native/Mastery" },
]

// Add slugify helper
function slugify(str: string) {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\d]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

// Move uploadFileLocally outside the component
async function uploadFileLocally(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // Check if we're in demo mode
    const isDemoMode = typeof window !== "undefined" && localStorage.getItem("demo-user-session") === "true"
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'x-demo-mode': isDemoMode ? 'true' : 'false'
      }
    })
    
    if (!res.ok) {
      throw new Error('Upload fehlgeschlagen')
    }
    
    const data = await res.json()
    
    // Log upload details
    console.log('Upload successful:', {
      mode: isDemoMode ? 'demo' : 'production',
      primaryUrl: data.url,
      localUrl: data.localUrl,
      supabaseUrl: data.supabaseUrl
    })
    
    return data.url
  } catch (error) {
    console.error('Upload error:', error)
    throw new Error('Upload fehlgeschlagen')
  }
}

export function ApplicationEditor({ application, onUpdate }: ApplicationEditorProps) {
  const [activeSection, setActiveSection] = useState("personal")
  const [isSaving, setIsSaving] = useState(false)
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set())
  const [dragActive, setDragActive] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<any>(null)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const sections = [
    { id: "personal", label: "Persönliche Daten", icon: User },
    { id: "cover-letter", label: "Anschreiben", icon: Mail },
    { id: "summary", label: "Profil", icon: FileText },
    { id: "experience", label: "Berufserfahrung", icon: Briefcase },
    { id: "education", label: "Bildung", icon: GraduationCap },
    { id: "skills", label: "Fähigkeiten", icon: Code },
    { id: "languages", label: "Sprachen", icon: Languages },
    { id: "projects", label: "Projekte", icon: Globe },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdate(application)
      toast({
        title: "Gespeichert",
        description: "Ihre Änderungen wurden erfolgreich gespeichert.",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Speichern ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Memoize validateFile so it is stable for use as a dependency
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: "Datei ist zu groß (max. 10MB)" }
    }
    // Check file type
    if (!SUPPORTED_FILE_TYPES[file.type as keyof typeof SUPPORTED_FILE_TYPES]) {
      return { valid: false, error: "Dateityp wird nicht unterstützt" }
    }
    return { valid: true }
  }, [])

  // Add uploadFileLocally to handleFileUpload's dependency array
  const handleFileUpload = useCallback(
    async (files: FileList, section: string, itemId?: string) => {
      setUploading(true)
      const fileArray = Array.from(files)
      const validFiles: any[] = []
      const errors: string[] = []
      for (const file of fileArray) {
        const validation = validateFile(file)
        if (validation.valid) {
          try {
            let uploadFile = file
            // If experience, rename file
            if (section === 'experience' && itemId) {
              const exp = (application.resume_data?.experience || []).find((e: any) => e.id === itemId)
              if (exp) {
                const ext = file.name.split('.').pop() || ''
                const base = file.name.replace(/\.[^/.]+$/, '')
                const company = slugify(exp.company || 'unternehmen')
                const title = slugify(exp.title || 'position')
                const newName = `${company}_${title}_${slugify(base)}${ext ? '.' + ext : ''}`
                uploadFile = new File([file], newName, { type: file.type })
              }
            }
            const url = await uploadFileLocally(uploadFile)
            validFiles.push({
              id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: uploadFile.name,
              size: uploadFile.size,
              type: uploadFile.type,
              uploadDate: new Date().toISOString(),
              section,
              itemId,
              url,
              description: "",
            })
          } catch (err: any) {
            let msg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err))
            errors.push(`${file.name}: ${msg}`)
          }
        } else {
          errors.push(`${file.name}: ${validation.error}`)
        }
      }
      if (validFiles.length > 0) {
        const currentDocs = application.selected_documents || []
        const updatedDocs = [...currentDocs, ...validFiles]
        onUpdate({ ...application, selected_documents: updatedDocs })
        toast({
          title: "Dateien hochgeladen",
          description: `${validFiles.length} Datei(en) erfolgreich lokal gespeichert.`,
        })
      }
      if (errors.length > 0) {
        toast({
          title: "Einige Dateien konnten nicht hochgeladen werden",
          description: errors.join(", "),
          variant: "destructive",
        })
      }
      setUploading(false)
    },
    [application, onUpdate, toast, validateFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent, dropZoneId: string) => {
    e.preventDefault()
    setDragActive(dropZoneId)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, section: string, itemId?: string) => {
      e.preventDefault()
      setDragActive(null)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileUpload(files, section, itemId)
      }
    },
    [handleFileUpload],
  )

  const removeFile = (fileId: string) => {
    const currentDocs = application.selected_documents || []
    const updatedDocs = currentDocs.filter((doc: any) => doc.id !== fileId)
    onUpdate({ ...application, selected_documents: updatedDocs })

    toast({
      title: "Datei entfernt",
      description: "Die Datei wurde erfolgreich entfernt.",
    })
  }

  const updateFileDescription = (fileId: string, description: string) => {
    const currentDocs = application.selected_documents || []
    const updatedDocs = currentDocs.map((doc: any) => (doc.id === fileId ? { ...doc, description } : doc))
    onUpdate({ ...application, selected_documents: updatedDocs })
  }

  const downloadFile = (file: any) => {
    if (file.url) {
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const previewFile = (file: any) => {
    setFilePreview(file)
  }

  const updatePersonalInfo = (field: string, value: string) => {
    onUpdate({
      ...application,
      personal_info: {
        ...application.personal_info,
        [field]: value,
      },
    })
  }

  const updateCoverLetter = (field: string, value: string) => {
    onUpdate({
      ...application,
      cover_letter_data: {
        ...application.cover_letter_data,
        [field]: value,
      },
    })
  }

  const updateResume = (field: string, value: any) => {
    onUpdate({
      ...application,
      resume_data: {
        ...application.resume_data,
        [field]: Array.isArray(value) && Array.isArray(application.resume_data?.[field])
          ? [...application.resume_data[field], ...value.filter(v => !application.resume_data[field].some((e: any) => e.id === v.id))]
          : value,
      },
    })
  }

  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      employmentType: "full-time",
      description: "",
      achievements: [],
      technologies: [],
      skills: [],
      attachments: [],
    }
    updateResume("experience", [...(application.resume_data?.experience || []), newExp])
  }

  const updateExperience = (id: string, field: string, value: any) => {
    const experiences = application.resume_data?.experience || []
    const updated = experiences.map((exp: any) => (exp.id === id ? { ...exp, [field]: value } : exp))
    updateResume("experience", updated)
  }

  const removeExperience = (id: string) => {
    const experiences = application.resume_data?.experience || []
    const filtered = experiences.filter((exp: any) => exp.id !== id)
    updateResume("experience", filtered)
  }

  const duplicateExperience = (experience: any) => {
    const newExp = {
      ...experience,
      id: `exp-${Date.now()}`,
      title: `${experience.title} (Kopie)`,
      current: false,
      endDate: "",
    }
    updateResume("experience", [...(application.resume_data?.experience || []), newExp])

    toast({
      title: "Position dupliziert",
      description: "Die Position wurde erfolgreich kopiert. Sie können sie nun bearbeiten.",
    })
  }

  const addPositionToCompany = (company: string) => {
    const experiences = application.resume_data?.experience || []
    const companyExperiences = experiences.filter((exp: any) => exp.company === company)

    if (companyExperiences.length > 0) {
      const latestExp = companyExperiences[0]
      const newExp = {
        ...latestExp,
        id: `exp-${Date.now()}`,
        title: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        achievements: [],
        technologies: [],
        skills: [],
      }
      updateResume("experience", [...experiences, newExp])
    }
  }

  const addSkillCategory = () => {
    const skills = application.resume_data?.skills || {}
    const newCategoryName = `category-${Date.now()}`
    updateResume("skills", {
      ...skills,
      [newCategoryName]: [],
    })
  }

  const updateSkillCategory = (oldName: string, newName: string) => {
    const skills = application.resume_data?.skills || {}
    const { [oldName]: categorySkills, ...otherSkills } = skills
    updateResume("skills", {
      ...otherSkills,
      [newName]: categorySkills,
    })
  }

  const addSkillToCategory = (categoryName: string) => {
    const skills = application.resume_data?.skills || {}
    const categorySkills = skills[categoryName] || []
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: "",
      level: "basic",
    }
    updateResume("skills", {
      ...skills,
      [categoryName]: [...categorySkills, newSkill],
    })
  }

  const updateSkill = (categoryName: string, skillId: string, field: string, value: any) => {
    const skills = application.resume_data?.skills || {}
    const categorySkills = skills[categoryName] || []
    const updatedSkills = categorySkills.map((skill: any) =>
      skill.id === skillId ? { ...skill, [field]: value } : skill,
    )
    updateResume("skills", {
      ...skills,
      [categoryName]: updatedSkills,
    })
  }

  const removeSkill = (categoryName: string, skillId: string) => {
    const skills = application.resume_data?.skills || {}
    const categorySkills = skills[categoryName] || []
    const filteredSkills = categorySkills.filter((skill: any) => skill.id !== skillId)
    updateResume("skills", {
      ...skills,
      [categoryName]: filteredSkills,
    })
  }

  const addLanguage = () => {
    const languages = application.resume_data?.languages || []
    const newLanguage = {
      id: `lang-${Date.now()}`,
      name: "",
      level: "B1",
      flag: "",
      description: "",
    }
    updateResume("languages", [...languages, newLanguage])
  }

  const updateLanguage = (id: string, field: string, value: any) => {
    const languages = application.resume_data?.languages || []
    const updated = languages.map((lang: any) => (lang.id === id ? { ...lang, [field]: value } : lang))
    updateResume("languages", updated)
  }

  const removeLanguage = (id: string) => {
    const languages = application.resume_data?.languages || []
    const filtered = languages.filter((lang: any) => lang.id !== id)
    updateResume("languages", filtered)
  }

  const addProject = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      status: "completed",
      url: "",
      github: "",
      achievements: [],
      role: "",
      teamSize: "",
      impact: "",
    }
    const projects = application.projects_data || []
    onUpdate({ ...application, projects_data: [...projects, newProject] })
  }

  const updateProject = (id: string, field: string, value: any) => {
    const projects = application.projects_data || []
    const updated = projects.map((project: any) => (project.id === id ? { ...project, [field]: value } : project))
    onUpdate({ ...application, projects_data: updated })
  }

  const removeProject = (id: string) => {
    const projects = application.projects_data || []
    const filtered = projects.filter((project: any) => project.id !== id)
    onUpdate({ ...application, projects_data: filtered })
  }

  const toggleCompanyExpansion = (company: string) => {
    const newExpanded = new Set(expandedCompanies)
    if (newExpanded.has(company)) {
      newExpanded.delete(company)
    } else {
      newExpanded.add(company)
    }
    setExpandedCompanies(newExpanded)
  }

  const renderFileUpload = (section: string, itemId?: string) => {
    const dropZoneId = `${section}-${itemId || "general"}`
    const isDragActive = dragActive === dropZoneId

    return (
      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={(e) => handleDragOver(e, dropZoneId)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, section, itemId)}
        >
          {/* Visually hidden label for accessibility */}
          <label htmlFor={`file-upload-${section}-${itemId || 'general'}`} className="sr-only">
            Datei-Upload
          </label>
          <input
            ref={fileInputRef}
            id={`file-upload-${section}-${itemId || 'general'}`}
            type="file"
            multiple
            accept={Object.keys(SUPPORTED_FILE_TYPES).join(",")}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files, section, itemId)
              }
            }}
          />
          <div className="text-center">
            <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? "text-blue-500" : "text-gray-400"}`} />
            <p className={`text-sm mb-2 ${isDragActive ? "text-blue-700" : "text-gray-600"}`}>
              {isDragActive ? "Dateien hier ablegen..." : "Dateien hier ablegen oder klicken zum Auswählen"}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label="Dateien auswählen"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader className="mr-2 w-4 h-4 animate-spin" /> : <Paperclip className="mr-2 w-4 h-4" />}
              Dateien auswählen
            </Button>
            <p className="mt-2 text-gray-500 text-xs">Unterstützte Formate: PDF, Word, Excel, Bilder (max. 10MB)</p>
          </div>
        </div>
      </div>
    )
  }

  const renderAttachedFiles = (section: string, itemId?: string) => {
    const files = (application.selected_documents || []).filter(
      (doc: any) => doc.section === section && (!itemId || doc.itemId === itemId),
    )

    if (files.length === 0) return null

    return (
      <div className="space-y-3">
        <Label className="font-medium text-sm">Angehängte Dateien ({files.length})</Label>
        <div className="space-y-3">
          {files.map((file: any) => {
            const fileType = SUPPORTED_FILE_TYPES[file.type as keyof typeof SUPPORTED_FILE_TYPES]
            return (
              <Card key={file.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{fileType?.icon || "📄"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{file.name}</span>
                      <Badge variant="outline" className="text-xs">{fileType?.label || "Unknown"}</Badge>
                      <Badge variant="outline" className="text-xs">{(file.size / 1024).toFixed(1)} KB</Badge>
                    </div>
                    <div className="mb-2 text-gray-500 text-xs">Hochgeladen: {new Date(file.uploadDate).toLocaleDateString("de-DE")}</div>
                    <Input placeholder="Beschreibung hinzufügen..." value={file.description || ""} onChange={(e) => updateFileDescription(file.id, e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setFilePreview(file)} title="Vorschau">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => window.open(file.url, '_blank')} title="Herunterladen">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)} title="Entfernen">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
        <Dialog open={!!filePreview} onOpenChange={() => setFilePreview(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <File className="w-5 h-5" />
                {filePreview?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {filePreview?.type.startsWith("image/") ? (
                <img src={filePreview.url} alt={filePreview.name} className="max-w-full h-auto" />
              ) : filePreview?.type === "application/pdf" ? (
                <iframe src={filePreview.url} className="w-full h-96" title={filePreview.name} />
              ) : (
                <div className="py-8 text-center">
                  <File className="mx-auto mb-2 w-8 h-8 text-gray-400" />
                  <p className="text-gray-600">Vorschau für diesen Dateityp nicht verfügbar</p>
                  <Button onClick={() => window.open(filePreview.url, '_blank')} className="mt-4">
                    <Download className="mr-2 w-4 h-4" />
                    Datei herunterladen
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center md:items-start">
          <ProfilePictureManager
            currentImage={application.personal_info?.profilePicture || ""}
            onImageChange={img => updatePersonalInfo("profilePicture", img)}
            size="md"
          />
        </div>
        <div className="gap-4 grid">
          <Label htmlFor="fullName">Vollständiger Name *</Label>
          <Input
            id="fullName"
            value={application.personal_info?.fullName || ""}
            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
            placeholder="Max Mustermann"
          />
          <Label htmlFor="email">E-Mail-Adresse *</Label>
          <Input
            id="email"
            type="email"
            value={application.personal_info?.email || ""}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            placeholder="max.mustermann@email.de"
          />
          <Label htmlFor="phone">Telefonnummer *</Label>
          <Input
            id="phone"
            value={application.personal_info?.phone || ""}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            placeholder="+49 30 12345678"
          />
          <Label htmlFor="location">Wohnort *</Label>
          <Input
            id="location"
            value={application.personal_info?.location || ""}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
            placeholder="Berlin, Deutschland"
          />
          <Label htmlFor="linkedin">LinkedIn Profil</Label>
          <Input
            id="linkedin"
            value={application.personal_info?.linkedin || ""}
            onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
            placeholder="linkedin.com/in/maxmustermann"
          />
          <Label htmlFor="portfolio">Portfolio Website</Label>
          <Input
            id="portfolio"
            value={application.personal_info?.portfolio || ""}
            onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
            placeholder="maxmustermann.dev"
          />
          <Label htmlFor="github">GitHub Profil</Label>
          <Input
            id="github"
            value={application.personal_info?.github || ""}
            onChange={(e) => updatePersonalInfo("github", e.target.value)}
            placeholder="github.com/maxmustermann"
          />
        </div>
      </div>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <div>
          <Label htmlFor="addressStreet">Straße und Hausnummer</Label>
          <Input
            id="addressStreet"
            value={application.personal_info?.address?.street || ''}
            onChange={e => updatePersonalInfo('address', {
              ...application.personal_info?.address,
              street: e.target.value,
              postalCode: application.personal_info?.address?.postalCode || '',
              city: application.personal_info?.address?.city || '',
            })}
            placeholder="Musterstraße 1"
          />
        </div>
        <div>
          <Label htmlFor="addressPostalCode">PLZ</Label>
          <Input
            id="addressPostalCode"
            value={application.personal_info?.address?.postalCode || ''}
            onChange={e => updatePersonalInfo('address', {
              ...application.personal_info?.address,
              street: application.personal_info?.address?.street || '',
              postalCode: e.target.value,
              city: application.personal_info?.address?.city || '',
            })}
            placeholder="12345"
          />
        </div>
        <div>
          <Label htmlFor="addressCity">Stadt</Label>
          <Input
            id="addressCity"
            value={application.personal_info?.address?.city || ''}
            onChange={e => updatePersonalInfo('address', {
              ...application.personal_info?.address,
              street: application.personal_info?.address?.street || '',
              postalCode: application.personal_info?.address?.postalCode || '',
              city: e.target.value,
            })}
            placeholder="Berlin"
          />
        </div>
      </div>
      <Separator />
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <Label htmlFor="jobTitle">Gewünschte Position *</Label>
          <Input
            id="jobTitle"
            value={application.job_title || ""}
            onChange={(e) => onUpdate({ job_title: e.target.value })}
            placeholder="Senior Frontend Developer"
          />
        </div>
        <div>
          <Label htmlFor="company">Zielunternehmen</Label>
          <Input
            id="company"
            value={application.company || ""}
            onChange={(e) => onUpdate({ company: e.target.value })}
            placeholder="TechCorp GmbH"
          />
        </div>
      </div>
    </div>
  )

  const renderCoverLetter = () => (
    <div className="space-y-6">
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <Label htmlFor="recipientName">Ansprechpartner</Label>
          <Input
            id="recipientName"
            value={application.cover_letter_data?.recipientName || ""}
            onChange={(e) => updateCoverLetter("recipientName", e.target.value)}
            placeholder="Frau Schmidt"
          />
        </div>
        <div>
          <Label htmlFor="recipientTitle">Position des Ansprechpartners</Label>
          <Input
            id="recipientTitle"
            value={application.cover_letter_data?.recipientTitle || ""}
            onChange={(e) => updateCoverLetter("recipientTitle", e.target.value)}
            placeholder="Personalmanagerin"
          />
        </div>
        <div>
          <Label htmlFor="date">Datum</Label>
          <Input
            id="date"
            type="date"
            value={application.cover_letter_data?.date || ""}
            onChange={(e) => updateCoverLetter("date", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="coverCompany">Unternehmen</Label>
          <Input
            id="coverCompany"
            value={application.cover_letter_data?.company || application.company || ""}
            onChange={(e) => updateCoverLetter("company", e.target.value)}
            placeholder="TechCorp GmbH"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Unternehmensadresse</Label>
        <Textarea
          id="address"
          value={application.cover_letter_data?.address || ""}
          onChange={(e) => updateCoverLetter("address", e.target.value)}
          placeholder="Unter den Linden 1&#10;10117 Berlin"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="subject">Betreff</Label>
        <Input
          id="subject"
          value={application.cover_letter_data?.subject || ""}
          onChange={(e) => updateCoverLetter("subject", e.target.value)}
          placeholder="Bewerbung als Senior Frontend Developer"
        />
      </div>

      <div>
        <Label htmlFor="salutation">Anrede</Label>
        <Input
          id="salutation"
          value={application.cover_letter_data?.salutation || ""}
          onChange={(e) => updateCoverLetter("salutation", e.target.value)}
          placeholder="Sehr geehrte Frau Schmidt,"
        />
      </div>

      <div>
        <Label htmlFor="openingParagraph">Einleitungsabsatz</Label>
        <Textarea
          id="openingParagraph"
          value={application.cover_letter_data?.openingParagraph || ""}
          onChange={(e) => updateCoverLetter("openingParagraph", e.target.value)}
          placeholder="mit großem Interesse habe ich Ihre Stellenausschreibung..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="bodyParagraphs">Hauptteil</Label>
        <Textarea
          id="bodyParagraphs"
          value={application.cover_letter_data?.bodyParagraphs || ""}
          onChange={(e) => updateCoverLetter("bodyParagraphs", e.target.value)}
          placeholder="In meiner aktuellen Position..."
          rows={8}
        />
      </div>

      <div>
        <Label htmlFor="closingParagraph">Schlussabsatz</Label>
        <Textarea
          id="closingParagraph"
          value={application.cover_letter_data?.closingParagraph || ""}
          onChange={(e) => updateCoverLetter("closingParagraph", e.target.value)}
          placeholder="Über eine Einladung zu einem persönlichen Gespräch..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="signOff">Grußformel</Label>
        <Input
          id="signOff"
          value={application.cover_letter_data?.signOff || ""}
          onChange={(e) => updateCoverLetter("signOff", e.target.value)}
          placeholder="Mit freundlichen Grüßen"
        />
      </div>
    </div>
  )

  const renderSummary = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="summary">Berufliches Profil / Zusammenfassung</Label>
        <Textarea
          id="summary"
          rows={6}
          value={application.resume_data?.summary || ""}
          onChange={(e) => updateResume("summary", e.target.value)}
          placeholder="Erfahrener Senior Frontend Developer mit 5+ Jahren Expertise..."
        />
        <p className="mt-1 text-gray-500 text-sm">
          Beschreiben Sie Ihre wichtigsten Qualifikationen und Erfahrungen in 3-4 Sätzen.
        </p>
      </div>
    </div>
  )

  const renderExperience = () => {
    const experiences = application.resume_data?.experience || []

    // Group experiences by company
    const groupedExperiences = experiences.reduce((acc: any, exp: any) => {
      const company = exp.company || "Unbekanntes Unternehmen"
      if (!acc[company]) {
        acc[company] = []
      }
      acc[company].push(exp)
      return acc
    }, {})

    // Sort experiences within each company by start date (newest first)
    Object.keys(groupedExperiences).forEach((company) => {
      groupedExperiences[company].sort((a: any, b: any) => {
        const dateA = new Date(a.startDate || "1900-01")
        const dateB = new Date(b.startDate || "1900-01")
        return dateB.getTime() - dateA.getTime()
      })
    })

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg">Berufserfahrung</h3>
            <p className="mt-1 text-gray-600 text-sm">
              Fügen Sie alle beruflichen Erfahrungen, Praktika, Gap Year Aktivitäten und Studentenjobs hinzu.
            </p>
          </div>
          <Button onClick={addExperience} size="sm">
            <Plus className="mr-1 w-4 h-4" />
            Erfahrung hinzufügen
          </Button>
        </div>

        <div className="gap-2 grid grid-cols-1 md:grid-cols-3 mb-6">
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="font-medium text-green-800 text-sm">Vollzeit/Teilzeit</div>
            <div className="text-green-600 text-xs">Reguläre Anstellungen</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="font-medium text-purple-800 text-sm">Praktika/Studentenjobs</div>
            <div className="text-purple-600 text-xs">Während des Studiums</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="font-medium text-orange-800 text-sm">Gap Year Aktivitäten</div>
            <div className="text-orange-600 text-xs">Reisen, Freiwilligenarbeit, etc.</div>
          </div>
        </div>

        {Object.keys(groupedExperiences).length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col justify-center items-center py-12">
              <Briefcase className="mb-4 w-12 h-12 text-gray-400" />
              <h3 className="mb-2 font-medium text-gray-900 text-lg">Noch keine Erfahrungen hinzugefügt</h3>
              <p className="mb-4 text-gray-600 text-center">
                Fügen Sie Ihre beruflichen Erfahrungen, Praktika oder Gap Year Aktivitäten hinzu.
              </p>
              <Button onClick={addExperience}>
                <Plus className="mr-2 w-4 h-4" />
                Erste Erfahrung hinzufügen
              </Button>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedExperiences).map(([company, companyExperiences]: [string, any]) => (
            <Card key={company} className="overflow-visible">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <div>
                      <CardTitle className="text-lg">{company}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-600 text-sm">
                          {companyExperiences.length} Position{companyExperiences.length !== 1 ? "en" : ""}
                        </span>
                        <div className="flex gap-1">
                          {companyExperiences.map((exp: any) => {
                            const employmentType = EMPLOYMENT_TYPES.find((t) => t.value === exp.employmentType)
                            return (
                              <Badge
                                key={exp.id}
                                className={employmentType?.color || "bg-gray-100 text-gray-800"}
                                variant="secondary"
                              >
                                {employmentType?.label || exp.employmentType}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addPositionToCompany(company)}
                  >
                    <Plus className="mr-1 w-4 h-4" />
                    Position hinzufügen
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-0">
                {companyExperiences.map((exp: any, index: number) => (
                  <div key={exp.id} className={`${index > 0 ? "border-t pt-8" : ""}`}>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            EMPLOYMENT_TYPES.find((t) => t.value === exp.employmentType)?.color ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {EMPLOYMENT_TYPES.find((t) => t.value === exp.employmentType)?.label ||
                            exp.employmentType}
                        </Badge>
                        <span className="text-gray-600 text-sm">Position #{index + 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => duplicateExperience(exp)}>
                          <Copy className="mr-1 w-4 h-4" />
                          Duplizieren
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => removeExperience(exp.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-6">
                      <div>
                        <Label>Jobtitel / Aktivität *</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                          placeholder="Senior Frontend Developer"
                        />
                      </div>
                      <div>
                        <Label>Unternehmen / Organisation *</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          placeholder="Digital Solutions AG"
                        />
                      </div>
                      <div>
                        <Label>Ort</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                          placeholder="Berlin, Deutschland"
                        />
                      </div>
                      <div>
                        <Label>Art der Tätigkeit</Label>
                        <Select
                          value={exp.employmentType}
                          onValueChange={(value) => updateExperience(exp.id, "employmentType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Anstellungen" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="px-2 py-1 font-medium text-gray-500 text-xs uppercase tracking-wide">
                              Anstellungen
                            </div>
                            {EMPLOYMENT_TYPES.filter((t) => t.category === "employment").map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${type.color.split(" ")[0]}`} />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                            <div className="mt-2 px-2 py-1 font-medium text-gray-500 text-xs uppercase tracking-wide">
                              Gap Year Aktivitäten
                            </div>
                            {EMPLOYMENT_TYPES.filter((t) => t.category === "gap-year").map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${type.color.split(" ")[0]}`} />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                            <div className="mt-2 px-2 py-1 font-medium text-gray-500 text-xs uppercase tracking-wide">
                              Sonstiges
                            </div>
                            {EMPLOYMENT_TYPES.filter((t) => t.category === "other").map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${type.color.split(" ")[0]}`} />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Beginn *</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Ende</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          disabled={exp.current}
                        />
                      </div>
                      <div className="flex items-center space-x-2 md:col-span-2">
                        <Checkbox
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onCheckedChange={(checked) => updateExperience(exp.id, "current", checked)}
                        />
                        <Label htmlFor={`current-${exp.id}`}>Aktuelle Position / Laufende Aktivität</Label>
                      </div>
                    </div>

                    <div className="mb-6">
                      <Label>Beschreibung der Tätigkeit *</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        rows={4}
                        placeholder="Beschreiben Sie Ihre Hauptaufgaben, Verantwortlichkeiten oder was Sie bei dieser Aktivität gemacht haben..."
                      />
                    </div>

                    <div className="mb-6">
                      <Label>Erfolge und Leistungen</Label>
                      <Textarea
                        value={exp.achievements?.join("\n") || ""}
                        onChange={(e) =>
                          updateExperience(
                            exp.id,
                            "achievements",
                            e.target.value.split("\n").filter((a) => a.trim()),
                          )
                        }
                        rows={4}
                        placeholder="• Performance-Verbesserung um 40%&#10;• Leitung eines 4-köpfigen Teams&#10;• Implementierung neuer Technologien"
                      />
                      <p className="mt-1 text-gray-500 text-sm">Ein Erfolg pro Zeile</p>
                    </div>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-6">
                      <div>
                        <Label>Verwendete Technologien</Label>
                        <Input
                          value={exp.technologies?.join(", ") || ""}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "technologies",
                              e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            )
                          }
                          placeholder="React, TypeScript, Next.js, GraphQL"
                        />
                        <p className="mt-1 text-gray-500 text-sm">Technologien durch Kommas getrennt</p>
                      </div>
                      <div>
                        <Label>Erworbene Fähigkeiten</Label>
                        <Input
                          value={exp.skills?.join(", ") || ""}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "skills",
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            )
                          }
                          placeholder="Projektmanagement, Teamführung, Interkulturelle Kompetenz"
                        />
                        <p className="mt-1 text-gray-500 text-sm">Fähigkeiten durch Kommas getrennt</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-600" />
                        <Label className="font-medium text-base">Dokumente und Nachweise</Label>
                      </div>
                      <Alert>
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>
                          Fügen Sie relevante Dokumente hinzu wie Arbeitszeugnisse, Stellenbeschreibungen,
                          Leistungsbeurteilungen oder Zertifikate für diese Position.
                        </AlertDescription>
                      </Alert>
                      {renderFileUpload("experience", exp.id)}
                      {renderAttachedFiles("experience", exp.id)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    )
  }

  const addDegree = () => {
    const newDegree = {
      id: `edu-${Date.now()}`,
      type: 'degree',
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
    }
    updateResume('education', [...(application.resume_data?.education || []), newDegree])
  }

  const addFurtherEducation = () => {
    const newFurther = {
      id: `edu-${Date.now()}`,
      type: 'further',
      provider: '',
      title: '',
      startDate: '',
      endDate: '',
      description: '',
    }
    updateResume('education', [...(application.resume_data?.education || []), newFurther])
  }

  const updateEducation = (id: string, field: string, value: any) => {
    const education = application.resume_data?.education || []
    const updated = education.map((edu: any) => edu.id === id ? { ...edu, [field]: value } : edu)
    updateResume('education', updated)
  }

  const removeEducation = (id: string) => {
    const education = application.resume_data?.education || []
    const filtered = education.filter((edu: any) => edu.id !== id)
    updateResume('education', filtered)
  }

  const renderEducation = () => {
    const education = application.resume_data?.education || []
    const degrees = education.filter((e: any) => e.type === 'degree')
    const further = education.filter((e: any) => e.type === 'further')
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <Button onClick={addDegree} size="sm">
            <Plus className="mr-1 w-4 h-4" />Abschluss hinzufügen
          </Button>
          <Button onClick={addFurtherEducation} size="sm" variant="secondary">
            <Plus className="mr-1 w-4 h-4" />Weiterbildung hinzufügen
          </Button>
        </div>
        {degrees.length > 0 && <h4 className="mt-4 font-medium text-base">Abschlüsse</h4>}
        {degrees.map((edu: any) => (
          <Card key={edu.id}>
            <CardContent className="p-4">
              {/* Degree fields */}
              <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
                <div>
                  <Label>Schule / Hochschule</Label>
                  <Input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} placeholder="Universität" />
                </div>
                <div>
                  <Label>Abschluss</Label>
                  <Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor, Master, Diplom..." />
                </div>
                <div>
                  <Label>Fachrichtung</Label>
                  <Input value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} placeholder="Informatik, BWL..." />
                </div>
                <div>
                  <Label>Note</Label>
                  <Input value={edu.grade} onChange={e => updateEducation(edu.id, 'grade', e.target.value)} placeholder="1,3" />
                </div>
                <div>
                  <Label>Beginn</Label>
                  <Input type="month" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
                </div>
                <div>
                  <Label>Ende</Label>
                  <Input type="month" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
                </div>
                <div className="md:col-span-4">
                  <Label>Beschreibung</Label>
                  <Textarea value={edu.description} onChange={e => updateEducation(edu.id, 'description', e.target.value)} placeholder="Schwerpunkte, besondere Leistungen..." />
                </div>
                <div className="flex items-end h-full">
                  <Button variant="outline" size="sm" onClick={() => removeEducation(edu.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {further.length > 0 && <h4 className="mt-4 font-medium text-base">Weiterbildungen</h4>}
        {further.map((edu: any) => (
          <Card key={edu.id}>
            <CardContent className="p-4">
              {/* Further education fields */}
              <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
                <div>
                  <Label>Anbieter</Label>
                  <Input value={edu.provider} onChange={e => updateEducation(edu.id, 'provider', e.target.value)} placeholder="Udemy, IHK..." />
                </div>
                <div>
                  <Label>Titel</Label>
                  <Input value={edu.title} onChange={e => updateEducation(edu.id, 'title', e.target.value)} placeholder="React Kurs, Projektmanagement..." />
                </div>
                <div>
                  <Label>Beginn</Label>
                  <Input type="month" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
                </div>
                <div>
                  <Label>Ende</Label>
                  <Input type="month" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
                </div>
                <div className="md:col-span-4">
                  <Label>Beschreibung</Label>
                  <Textarea value={edu.description} onChange={e => updateEducation(edu.id, 'description', e.target.value)} placeholder="Inhalte, Zertifikate..." />
                </div>
                <div className="flex items-end h-full">
                  <Button variant="outline" size="sm" onClick={() => removeEducation(edu.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-gray-600" />
            <Label className="font-medium text-base">Zeugnisse und Nachweise</Label>
          </div>
          {renderFileUpload("education")}
          {renderAttachedFiles("education")}
        </div>
      </div>
    )
  }

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Fähigkeiten</h3>
        <Button onClick={addSkillCategory} size="sm">
          <Plus className="mr-1 w-4 h-4" />
          Kategorie hinzufügen
        </Button>
      </div>

      {Object.entries(application.resume_data?.skills || {}).map(([categoryName, skills]: [string, any]) => (
        <Card key={categoryName}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Input
                value={categoryName}
                onChange={(e) => updateSkillCategory(categoryName, e.target.value)}
                className="p-0 border-none h-auto font-medium text-base"
                placeholder="Kategorie Name"
              />
              <Button variant="outline" size="sm" onClick={() => addSkillToCategory(categoryName)}>
                <Plus className="mr-1 w-4 h-4" />
                Fähigkeit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skill: any) => (
              <div key={skill.id} className="items-end gap-4 grid grid-cols-1 md:grid-cols-3">
                <div>
                  <Label className="text-sm">Fähigkeit</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(categoryName, skill.id, "name", e.target.value)}
                    placeholder="Fähigkeit"
                  />
                </div>
                <div>
                  <Label className="text-sm">Niveau</Label>
                  <Select value={skill.level} onValueChange={(value) => updateSkill(categoryName, skill.id, "level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end h-full">
                  <Button variant="outline" size="sm" onClick={() => removeSkill(categoryName, skill.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const getLanguageLevelLabel = (level: string) => {
    const levelObj = LANGUAGE_LEVELS.find(l => l.value === level)
    if (!levelObj) return ""
    const dashIdx = levelObj.label.indexOf('-')
    return dashIdx !== -1 ? levelObj.label.slice(dashIdx + 1).trim() : levelObj.label
  }

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Sprachen</h3>
        <Button onClick={addLanguage} size="sm">
          <Plus className="mr-1 w-4 h-4" />
          Sprache hinzufügen
        </Button>
      </div>

      {application.resume_data?.languages?.map((language: any) => (
        <Card key={language.id}>
          <CardContent className="p-4">
            <div className="items-center gap-4 grid grid-cols-1 md:grid-cols-4">
              <div>
                <Label>Sprache</Label>
                <Input
                  value={language.name}
                  onChange={(e) => updateLanguage(language.id, "name", e.target.value)}
                  placeholder="Deutsch"
                />
              </div>
              <div>
                <Label>Niveau (CEFR)</Label>
                <Select value={language.level} onValueChange={(value) => updateLanguage(language.id, "level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Beschreibung</Label>
                <Input
                  value={language.description || getLanguageLevelLabel(language.level)}
                  onChange={(e) => updateLanguage(language.id, "description", e.target.value)}
                  placeholder={getLanguageLevelLabel(language.level)}
                />
              </div>
              <div>
                <Button variant="outline" size="sm" onClick={() => removeLanguage(language.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Projekte</h3>
        <Button onClick={addProject} size="sm">
          <Plus className="mr-1 w-4 h-4" />
          Projekt hinzufügen
        </Button>
      </div>

      {application.projects_data?.map((project: any) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Projekt</CardTitle>
              <Button variant="outline" size="sm" onClick={() => removeProject(project.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div>
                <Label>Projektname *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                  placeholder="E-Commerce Dashboard"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={project.status} onValueChange={(value) => updateProject(project.id, "status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                    <SelectItem value="in-progress">In Bearbeitung</SelectItem>
                    <SelectItem value="planned">Geplant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Beginn</Label>
                <Input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                />
              </div>
              <div>
                <Label>Ende</Label>
                <Input
                  type="month"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                />
              </div>
              <div>
                <Label>Rolle</Label>
                <Input
                  value={project.role}
                  onChange={(e) => updateProject(project.id, "role", e.target.value)}
                  placeholder="Lead Frontend Developer"
                />
              </div>
              <div>
                <Label>Teamgröße</Label>
                <Input
                  value={project.teamSize}
                  onChange={(e) => updateProject(project.id, "teamSize", e.target.value)}
                  placeholder="4 Entwickler"
                />
              </div>
              <div>
                <Label>Projekt URL</Label>
                <Input
                  value={project.url}
                  onChange={(e) => updateProject(project.id, "url", e.target.value)}
                  placeholder="https://dashboard.example.com"
                />
              </div>
              <div>
                <Label>GitHub Repository</Label>
                <Input
                  value={project.github}
                  onChange={(e) => updateProject(project.id, "github", e.target.value)}
                  placeholder="https://github.com/user/project"
                />
              </div>
            </div>

            <div>
              <Label>Projektbeschreibung *</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, "description", e.target.value)}
                rows={4}
                placeholder="Beschreiben Sie das Projekt und Ihre Rolle..."
              />
            </div>

            <div>
              <Label>Verwendete Technologien</Label>
              <Input
                value={project.technologies?.join(", ") || ""}
                onChange={(e) =>
                  updateProject(
                    project.id,
                    "technologies",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="React, TypeScript, Next.js, GraphQL"
              />
            </div>

            <div>
              <Label>Erfolge und Ergebnisse</Label>
              <Textarea
                value={project.achievements?.join("\n") || ""}
                onChange={(e) =>
                  updateProject(
                    project.id,
                    "achievements",
                    e.target.value.split("\n").filter((a) => a.trim()),
                  )
                }
                rows={4}
                placeholder="• Reduzierung der Ladezeiten um 60%&#10;• Implementierung von Real-time Updates&#10;• Integration von 15+ APIs"
              />
            </div>

            <div>
              <Label>Impact / Auswirkungen</Label>
              <Input
                value={project.impact}
                onChange={(e) => updateProject(project.id, "impact", e.target.value)}
                placeholder="Steigerung der Admin-Effizienz um 40%"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalInfo()
      case "cover-letter":
        return renderCoverLetter()
      case "summary":
        return renderSummary()
      case "experience":
        return renderExperience()
      case "education":
        return renderEducation()
      case "skills":
        return renderSkills()
      case "languages":
        return renderLanguages()
      case "projects":
        return renderProjects()
      default:
        return renderPersonalInfo()
    }
  }

  return (
    <div className="flex bg-gray-50 h-screen">
      {/* Sidebar */}
      <div className="bg-white shadow-sm border-r w-64">
        <div className="p-4">
          <h2 className="mb-4 font-semibold text-gray-900 text-lg">Bearbeitung</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-2 font-semibold text-muted-foreground text-xs uppercase">Anschreiben</div>
              {(() => {
                const section = sections.find(s => s.id === 'cover-letter')
                if (!section) return null
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="justify-start w-full"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon className="mr-2 w-4 h-4" />
                    {section.label}
                  </Button>
                )
              })()}
            </div>
            <div>
              <div className="mb-2 font-semibold text-muted-foreground text-xs uppercase">Lebenslauf</div>
              {['summary','experience','education','skills','languages'].map(id => {
                const section = sections.find(s => s.id === id)
                if (!section) return null
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="justify-start w-full"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon className="mr-2 w-4 h-4" />
                    {section.label}
                  </Button>
                )
              })}
            </div>
            <div>
              <div className="mb-2 font-semibold text-muted-foreground text-xs uppercase">Projektübersicht</div>
              {(() => {
                const section = sections.find(s => s.id === 'projects')
                if (!section) return null
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="justify-start w-full"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon className="mr-2 w-4 h-4" />
                    {section.label}
                  </Button>
                )
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-6">
                <h2 className="mb-2 font-bold text-gray-900 text-2xl">
                  {sections.find((s) => s.id === activeSection)?.label}
                </h2>
                <Separator />
              </div>
              {renderSection()}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
