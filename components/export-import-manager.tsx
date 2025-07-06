"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload, FileText, FileJson, FileCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ExportImportManagerProps {
  application: any
  onUpdate: (updates: any) => void
}

export function ExportImportManager({ application, onUpdate }: ExportImportManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importData, setImportData] = useState("")
  const { toast } = useToast()

  // JSON Export Functions
  const exportAsJSON = (section: "cover-letter" | "resume" | "projects" | "all") => {
    let data: any = {}

    switch (section) {
      case "cover-letter":
        data = {
          type: "cover-letter",
          data: application.cover_letter_data || {},
          personal_info: application.personal_info || {},
          job_title: application.job_title || "",
          company: application.company || "",
          exported_at: new Date().toISOString(),
        }
        break
      case "resume":
        data = {
          type: "resume",
          data: application.resume_data || {},
          personal_info: application.personal_info || {},
          exported_at: new Date().toISOString(),
        }
        break
      case "projects":
        data = {
          type: "projects",
          data: application.projects_data || [],
          personal_info: application.personal_info || {},
          exported_at: new Date().toISOString(),
        }
        break
      case "all":
        data = {
          type: "complete-application",
          ...application,
          exported_at: new Date().toISOString(),
        }
        break
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const fileName = `${section}-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", fileName)
    linkElement.click()

    toast({
      title: "Export Erfolgreich",
      description: `${section} wurde als JSON exportiert.`,
    })
  }

  // Markdown Export Functions
  const exportAsMarkdown = (section: "cover-letter" | "resume" | "projects") => {
    let markdown = ""

    switch (section) {
      case "cover-letter":
        markdown = generateCoverLetterMarkdown()
        break
      case "resume":
        markdown = generateResumeMarkdown()
        break
      case "projects":
        markdown = generateProjectsMarkdown()
        break
    }

    const dataUri = "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown)
    const fileName = `${section}-${new Date().toISOString().split("T")[0]}.md`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", fileName)
    linkElement.click()

    toast({
      title: "Export Erfolgreich",
      description: `${section} wurde als Markdown exportiert.`,
    })
  }

  const generateCoverLetterMarkdown = () => {
    const cl = application.cover_letter_data || {}
    const personal = application.personal_info || {}

    return `# Anschreiben

## Persönliche Daten
- **Name:** ${personal.fullName || ""}
- **E-Mail:** ${personal.email || ""}
- **Telefon:** ${personal.phone || ""}
- **Adresse:** ${personal.location || ""}

## Bewerbungsdetails
- **Position:** ${application.job_title || ""}
- **Unternehmen:** ${cl.company || application.company || ""}
- **Datum:** ${cl.date || ""}

## Anschreiben

**Betreff:** ${cl.subject || ""}

**Anrede:** ${cl.salutation || ""}

### Einleitung
${cl.openingParagraph || ""}

### Hauptteil
${cl.bodyParagraphs || ""}

### Schluss
${cl.closingParagraph || ""}

**Grußformel:** ${cl.signOff || ""}

---
*Exportiert am: ${new Date().toLocaleDateString("de-DE")}*
`
  }

  const generateResumeMarkdown = () => {
    const resume = application.resume_data || {}
    const personal = application.personal_info || {}

    let markdown = `# Lebenslauf

## Persönliche Daten
- **Name:** ${personal.fullName || ""}
- **E-Mail:** ${personal.email || ""}
- **Telefon:** ${personal.phone || ""}
- **Adresse:** ${personal.location || ""}
- **LinkedIn:** ${personal.linkedin || ""}
- **GitHub:** ${personal.github || ""}
- **Portfolio:** ${personal.portfolio || ""}

## Berufliches Profil
${resume.summary || ""}

## Berufserfahrung
`

    if (resume.experience?.length) {
      resume.experience.forEach((exp: any) => {
        const startDate = exp.startDate
          ? new Date(exp.startDate + "-01").toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
          : ""
        const endDate = exp.current
          ? "heute"
          : exp.endDate
            ? new Date(exp.endDate + "-01").toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
            : ""

        const employmentTypeMap = {
          "full-time": "Vollzeit",
          "part-time": "Teilzeit",
          "student-job": "Studentenjob",
          "gap-year": "Gap Year",
        }

        markdown += `
### ${exp.title} | ${exp.company}
**${startDate} - ${endDate}** | ${exp.location || ""} | ${employmentTypeMap[exp.employmentType as keyof typeof employmentTypeMap] || exp.employmentType || ""}

${exp.description || ""}

**Erfolge:**
${exp.achievements?.map((achievement: string) => `- ${achievement}`).join("\n") || ""}

**Technologien:** ${exp.technologies?.join(", ") || ""}
`
      })
    }

    // Gap Year Activities
    if (resume.gapYearActivities?.length) {
      markdown += `\n## Zusätzliche Erfahrungen & Aktivitäten\n`
      resume.gapYearActivities.forEach((activity: any) => {
        const startDate = activity.startDate
          ? new Date(activity.startDate + "-01").toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
          : ""
        const endDate = activity.endDate
          ? new Date(activity.endDate + "-01").toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
          : ""

        markdown += `
### ${activity.title} (${activity.type})
**${startDate} - ${endDate}**

${activity.description || ""}

**Erworbene Fähigkeiten:** ${activity.skills?.join(", ") || ""}
`
      })
    }

    // Education
    if (resume.education?.degree) {
      markdown += `\n## Bildung\n`
      const degree = resume.education.degree
      markdown += `
### ${degree.title || ""}
**${degree.institution || ""}** | ${degree.location || ""} | ${degree.graduationYear || ""}
${degree.gpa ? `Note: ${degree.gpa}` : ""}
${degree.thesis ? `Abschlussarbeit: ${degree.thesis}` : ""}
`
    }

    // Skills
    if (resume.skills) {
      markdown += `\n## Fähigkeiten\n`
      Object.entries(resume.skills).forEach(([category, skills]: [string, any]) => {
        if (skills?.length) {
          const categoryNames: { [key: string]: string } = {
            frontend: "Frontend-Technologien",
            backend: "Backend-Technologien",
            tools: "Tools & Frameworks",
            cloud: "Cloud & DevOps",
          }
          markdown += `\n### ${categoryNames[category] || category}\n`
          skills.forEach((skill: any) => {
            markdown += `- **${skill.name}** (${skill.rating}/5) - ${skill.yearsOfExperience} Jahre\n`
          })
        }
      })
    }

    // Languages
    if (resume.languages?.length) {
      markdown += `\n## Sprachen\n`
      resume.languages.forEach((lang: any) => {
        markdown += `- **${lang.name}** - ${lang.level} (${lang.description || ""})\n`
      })
    }

    markdown += `\n---\n*Exportiert am: ${new Date().toLocaleDateString("de-DE")}*`
    return markdown
  }

  const generateProjectsMarkdown = () => {
    const projects = application.projects_data || []
    const personal = application.personal_info || {}

    let markdown = `# Projekt-Portfolio

## Entwickler
**${personal.fullName || ""}**
- E-Mail: ${personal.email || ""}
- GitHub: ${personal.github || ""}
- Portfolio: ${personal.portfolio || ""}

## Projekte
`

    if (projects.length) {
      projects.forEach((project: any, index: number) => {
        const startDate = project.startDate
          ? new Date(project.startDate + "-01").toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
          : ""
        const endDate = project.endDate
          ? new Date(project.endDate + "-01").toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
          : ""

        markdown += `
### ${index + 1}. ${project.name}

**Status:** ${project.status === "completed" ? "Abgeschlossen" : project.status === "in-progress" ? "In Bearbeitung" : "Geplant"}
**Zeitraum:** ${startDate} - ${endDate}
**Rolle:** ${project.role || ""}
**Team:** ${project.teamSize || ""}

#### Beschreibung
${project.description || ""}

#### Technologien
${project.technologies?.join(", ") || ""}

#### Erfolge & Ergebnisse
${project.achievements?.map((achievement: string) => `- ${achievement}`).join("\n") || ""}

#### Links
${project.url ? `- **Live Demo:** ${project.url}` : ""}
${project.github ? `- **GitHub:** ${project.github}` : ""}

${project.impact ? `**Impact:** ${project.impact}` : ""}

---
`
      })
    }

    markdown += `\n*Exportiert am: ${new Date().toLocaleDateString("de-DE")}*`
    return markdown
  }

  // Import Functions
  const handleImport = () => {
    try {
      const data = JSON.parse(importData)

      if (data.type === "cover-letter") {
        onUpdate({
          cover_letter_data: data.data,
          personal_info: { ...application.personal_info, ...data.personal_info },
          job_title: data.job_title || application.job_title,
          company: data.company || application.company,
        })
      } else if (data.type === "resume") {
        onUpdate({
          resume_data: data.data,
          personal_info: { ...application.personal_info, ...data.personal_info },
        })
      } else if (data.type === "projects") {
        onUpdate({
          projects_data: data.data,
          personal_info: { ...application.personal_info, ...data.personal_info },
        })
      } else if (data.type === "complete-application") {
        const { exported_at, ...applicationData } = data
        onUpdate(applicationData)
      }

      toast({
        title: "Import Erfolgreich",
        description: "Daten wurden erfolgreich importiert.",
      })
      setImportData("")
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Import Fehler",
        description: "Ungültiges JSON Format. Bitte überprüfen Sie die Daten.",
        variant: "destructive",
      })
    }
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Export/Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export/Import Manager</DialogTitle>
          <DialogDescription>
            Exportieren Sie Ihre Bewerbungsunterlagen als JSON oder Markdown, oder importieren Sie vorhandene Daten.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* JSON Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileJson className="w-5 h-5" />
                    JSON Export
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => exportAsJSON("cover-letter")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Anschreiben
                  </Button>
                  <Button onClick={() => exportAsJSON("resume")} variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Lebenslauf
                  </Button>
                  <Button onClick={() => exportAsJSON("projects")} variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Projekte
                  </Button>
                  <Button onClick={() => exportAsJSON("all")} className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Komplette Bewerbung
                  </Button>
                </CardContent>
              </Card>

              {/* Markdown Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Markdown Export
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => exportAsMarkdown("cover-letter")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Anschreiben (.md)
                  </Button>
                  <Button onClick={() => exportAsMarkdown("resume")} variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Lebenslauf (.md)
                  </Button>
                  <Button
                    onClick={() => exportAsMarkdown("projects")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Projekte (.md)
                  </Button>
                  <div className="text-sm text-muted-foreground mt-2">
                    Markdown-Dateien sind ideal für GitHub, Dokumentation oder weitere Bearbeitung.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  JSON Import
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file-import">Datei hochladen</Label>
                  <input
                    id="file-import"
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
                  />
                </div>

                <div className="text-center text-muted-foreground">oder</div>

                <div>
                  <Label htmlFor="json-input">JSON-Daten einfügen</Label>
                  <Textarea
                    id="json-input"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="JSON-Daten hier einfügen..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                <Button onClick={handleImport} disabled={!importData.trim()} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Daten importieren
                </Button>

                <div className="text-sm text-muted-foreground">
                  <strong>Hinweis:</strong> Der Import überschreibt die entsprechenden Bereiche Ihrer aktuellen
                  Bewerbung. Erstellen Sie vorher ein Backup, falls nötig.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
