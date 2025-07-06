"use client"

import { useState, useRef } from "react"
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface ApplicationEditorProps {
  application: Application
  onUpdate: (updates: Partial<Application>) => Promise<void> | void
}

// German/EU skill rating system (1-5 scale)
const SKILL_LEVELS = [
  { value: 1, label: "Grundkenntnisse", description: "Basic knowledge" },
  { value: 2, label: "Fortgeschritten", description: "Advanced beginner" },
  { value: 3, label: "Gut", description: "Good" },
  { value: 4, label: "Sehr gut", description: "Very good" },
  { value: 5, label: "Experte", description: "Expert" },
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

export function ApplicationEditor({ application, onUpdate }: ApplicationEditorProps) {
  const [activeSection, setActiveSection] = useState("personal")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileUpload = (file: File, section: string, itemId?: string) => {
    // Create a file object to store
    const fileData = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      section,
      itemId,
    }

    // Add to selected documents
    const currentDocs = application.selected_documents || []
    const updatedDocs = [...currentDocs, fileData]

    onUpdate({ selected_documents: updatedDocs })

    toast({
      title: "Datei hochgeladen",
      description: `${file.name} wurde erfolgreich hinzugefügt.`,
    })
  }

  const removeFile = (fileId: string) => {
    const currentDocs = application.selected_documents || []
    const updatedDocs = currentDocs.filter((doc: any) => doc.id !== fileId)
    onUpdate({ selected_documents: updatedDocs })

    toast({
      title: "Datei entfernt",
      description: "Die Datei wurde erfolgreich entfernt.",
    })
  }

  const updatePersonalInfo = (field: string, value: string) => {
    onUpdate({
      personal_info: {
        ...application.personal_info,
        [field]: value,
      },
    })
  }

  const updateCoverLetter = (field: string, value: string) => {
    onUpdate({
      cover_letter_data: {
        ...application.cover_letter_data,
        [field]: value,
      },
    })
  }

  const updateResume = (field: string, value: any) => {
    onUpdate({
      resume_data: {
        ...application.resume_data,
        [field]: value,
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
      description: "",
      achievements: [],
      technologies: [],
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
      rating: 3,
      yearsOfExperience: 1,
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
      images: [],
      role: "",
      teamSize: "",
      impact: "",
    }
    const projects = application.projects_data || []
    onUpdate({ projects_data: [...projects, newProject] })
  }

  const updateProject = (id: string, field: string, value: any) => {
    const projects = application.projects_data || []
    const updated = projects.map((project: any) => (project.id === id ? { ...project, [field]: value } : project))
    onUpdate({ projects_data: updated })
  }

  const removeProject = (id: string) => {
    const projects = application.projects_data || []
    const filtered = projects.filter((project: any) => project.id !== id)
    onUpdate({ projects_data: filtered })
  }

  const renderStars = (rating: number, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 cursor-pointer ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        onClick={() => onRatingChange && onRatingChange(i + 1)}
      />
    ))
  }

  const renderFileUpload = (section: string, itemId?: string) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          files.forEach((file) => handleFileUpload(file, section, itemId))
        }}
      />
      <div className="text-center">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">Dateien hier ablegen oder klicken zum Auswählen</p>
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Paperclip className="w-4 h-4 mr-2" />
          Dateien anhängen
        </Button>
      </div>
    </div>
  )

  const renderAttachedFiles = (section: string, itemId?: string) => {
    const files = (application.selected_documents || []).filter(
      (doc: any) => doc.section === section && (!itemId || doc.itemId === itemId),
    )

    if (files.length === 0) return null

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Angehängte Dateien</Label>
        <div className="space-y-2">
          {files.map((file: any) => (
            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{file.name}</span>
                <Badge variant="outline" className="text-xs">
                  {(file.size / 1024).toFixed(1)} KB
                </Badge>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Vollständiger Name *</Label>
          <Input
            id="fullName"
            value={application.personal_info?.fullName || ""}
            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
            placeholder="Max Mustermann"
          />
        </div>
        <div>
          <Label htmlFor="email">E-Mail-Adresse *</Label>
          <Input
            id="email"
            type="email"
            value={application.personal_info?.email || ""}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            placeholder="max.mustermann@email.de"
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefonnummer *</Label>
          <Input
            id="phone"
            value={application.personal_info?.phone || ""}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            placeholder="+49 30 12345678"
          />
        </div>
        <div>
          <Label htmlFor="location">Wohnort *</Label>
          <Input
            id="location"
            value={application.personal_info?.location || ""}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
            placeholder="Berlin, Deutschland"
          />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn Profil</Label>
          <Input
            id="linkedin"
            value={application.personal_info?.linkedin || ""}
            onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
            placeholder="linkedin.com/in/maxmustermann"
          />
        </div>
        <div>
          <Label htmlFor="portfolio">Portfolio Website</Label>
          <Input
            id="portfolio"
            value={application.personal_info?.portfolio || ""}
            onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
            placeholder="maxmustermann.dev"
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub Profil</Label>
          <Input
            id="github"
            value={application.personal_info?.github || ""}
            onChange={(e) => updatePersonalInfo("github", e.target.value)}
            placeholder="github.com/maxmustermann"
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <p className="text-sm text-gray-500 mt-1">
          Beschreiben Sie Ihre wichtigsten Qualifikationen und Erfahrungen in 3-4 Sätzen.
        </p>
      </div>
    </div>
  )

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Berufserfahrung</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Position hinzufügen
        </Button>
      </div>

      {application.resume_data?.experience?.map((exp: any) => (
        <Card key={exp.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Berufserfahrung</CardTitle>
              <Button variant="outline" size="sm" onClick={() => removeExperience(exp.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Jobtitel *</Label>
                <Input
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                  placeholder="Senior Frontend Developer"
                />
              </div>
              <div>
                <Label>Unternehmen *</Label>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) => updateExperience(exp.id, "current", checked)}
                />
                <Label htmlFor={`current-${exp.id}`}>Aktuelle Position</Label>
              </div>
            </div>

            <div>
              <Label>Tätigkeitsbeschreibung *</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                rows={4}
                placeholder="Beschreiben Sie Ihre Hauptaufgaben und Verantwortlichkeiten..."
              />
            </div>

            <div>
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
              <p className="text-sm text-gray-500 mt-1">Ein Erfolg pro Zeile</p>
            </div>

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
              <p className="text-sm text-gray-500 mt-1">Technologien durch Kommas getrennt</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Dokumente und Nachweise</Label>
              {renderFileUpload("experience", exp.id)}
              {renderAttachedFiles("experience", exp.id)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bildungsabschluss</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Abschluss *</Label>
              <Input
                value={application.resume_data?.education?.degree?.title || ""}
                onChange={(e) =>
                  updateResume("education", {
                    ...application.resume_data?.education,
                    degree: {
                      ...application.resume_data?.education?.degree,
                      title: e.target.value,
                    },
                  })
                }
                placeholder="Bachelor of Science Informatik"
              />
            </div>
            <div>
              <Label>Institution *</Label>
              <Input
                value={application.resume_data?.education?.degree?.institution || ""}
                onChange={(e) =>
                  updateResume("education", {
                    ...application.resume_data?.education,
                    degree: {
                      ...application.resume_data?.education?.degree,
                      institution: e.target.value,
                    },
                  })
                }
                placeholder="Technische Universität Berlin"
              />
            </div>
            <div>
              <Label>Ort</Label>
              <Input
                value={application.resume_data?.education?.degree?.location || ""}
                onChange={(e) =>
                  updateResume("education", {
                    ...application.resume_data?.education,
                    degree: {
                      ...application.resume_data?.education?.degree,
                      location: e.target.value,
                    },
                  })
                }
                placeholder="Berlin, Deutschland"
              />
            </div>
            <div>
              <Label>Abschlussjahr</Label>
              <Input
                value={application.resume_data?.education?.degree?.graduationYear || ""}
                onChange={(e) =>
                  updateResume("education", {
                    ...application.resume_data?.education,
                    degree: {
                      ...application.resume_data?.education?.degree,
                      graduationYear: e.target.value,
                    },
                  })
                }
                placeholder="2018"
              />
            </div>
            <div>
              <Label>Note (optional)</Label>
              <Input
                value={application.resume_data?.education?.degree?.gpa || ""}
                onChange={(e) =>
                  updateResume("education", {
                    ...application.resume_data?.education,
                    degree: {
                      ...application.resume_data?.education?.degree,
                      gpa: e.target.value,
                    },
                  })
                }
                placeholder="1,8"
              />
            </div>
          </div>

          <div>
            <Label>Abschlussarbeit (optional)</Label>
            <Input
              value={application.resume_data?.education?.degree?.thesis || ""}
              onChange={(e) =>
                updateResume("education", {
                  ...application.resume_data?.education,
                  degree: {
                    ...application.resume_data?.education?.degree,
                    thesis: e.target.value,
                  },
                })
              }
              placeholder="Entwicklung einer Progressive Web App für Smart City Services"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Zeugnisse und Nachweise</Label>
            {renderFileUpload("education")}
            {renderAttachedFiles("education")}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Fähigkeiten</h3>
        <Button onClick={addSkillCategory} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Kategorie hinzufügen
        </Button>
      </div>

      {Object.entries(application.resume_data?.skills || {}).map(([categoryName, skills]: [string, any]) => (
        <Card key={categoryName}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Input
                value={categoryName}
                onChange={(e) => updateSkillCategory(categoryName, e.target.value)}
                className="text-base font-medium border-none p-0 h-auto"
                placeholder="Kategorie Name"
              />
              <Button variant="outline" size="sm" onClick={() => addSkillToCategory(categoryName)}>
                <Plus className="w-4 h-4 mr-1" />
                Fähigkeit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skill: any) => (
              <div key={skill.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(categoryName, skill.id, "name", e.target.value)}
                    placeholder="Fähigkeit"
                  />
                </div>
                <div>
                  <Label className="text-sm">Bewertung</Label>
                  <div className="flex items-center gap-1">
                    {renderStars(skill.rating, (rating) => updateSkill(categoryName, skill.id, "rating", rating))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Jahre Erfahrung</Label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={skill.yearsOfExperience}
                    onChange={(e) =>
                      updateSkill(categoryName, skill.id, "yearsOfExperience", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
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

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Sprachen</h3>
        <Button onClick={addLanguage} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Sprache hinzufügen
        </Button>
      </div>

      {application.resume_data?.languages?.map((language: any) => (
        <Card key={language.id}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Beschreibung</Label>
                <Input
                  value={language.description}
                  onChange={(e) => updateLanguage(language.id, "description", e.target.value)}
                  placeholder="Muttersprache"
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Projekte</h3>
        <Button onClick={addProject} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Projekt hinzufügen
        </Button>
      </div>

      {application.projects_data?.map((project: any) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Projekt</CardTitle>
              <Button variant="outline" size="sm" onClick={() => removeProject(project.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectValue />
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bearbeitung</h2>
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {section.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Speichern...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
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
