"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PrintableCoverLetter } from "./printable-cover-letter"
import { PrintableResume } from "./printable-resume"
import { PrintableResumeStandard } from "./printable-resume-standard"
import { PrintableResumeComplex } from "./printable-resume-complex"
import { PrintableProjects } from "./printable-projects"
import { Printer, Download, FileText, User, FolderOpen, Eye, EyeOff, Users, Building } from "lucide-react"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]

interface PrintManagerProps {
  application: Application
}

export function PrintManager({ application }: PrintManagerProps) {
  const [activeTab, setActiveTab] = useState("cover-letter")
  const [showPreview, setShowPreview] = useState(true)

  const handlePrint = (documentType: string) => {
    const printContent = document.getElementById(`printable-${documentType}`)
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print - ${documentType}</title>
          <style>
            @page {
              size: A4;
              margin: 2.5cm 2cm 2.5cm 2cm;
            }
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.4;
              color: black;
              background: white;
              margin: 0;
              padding: 0;
            }
            .bg-gradient-to-r, .bg-blue-50, .bg-indigo-50, .bg-purple-50, .bg-green-50, .bg-yellow-50, .bg-gray-50 {
              background: #f8fafc !important;
            }
            .border-l-4 { border-left: 4px solid #3b82f6 !important; }
            .border-blue-500, .border-indigo-500, .border-purple-500, .border-green-500, .border-yellow-500 {
              border-color: #3b82f6 !important;
            }
            .text-blue-600, .text-indigo-600, .text-purple-600, .text-green-600, .text-yellow-600 {
              color: #1f2937 !important;
            }
            .rounded, .rounded-lg, .rounded-full { border-radius: 4px !important; }
            .shadow, .shadow-lg { box-shadow: none !important; }
            .grid { display: block !important; }
            .grid > * { margin-bottom: 0.5rem !important; }
            .flex { display: inline-block !important; }
            .gap-2, .gap-3, .gap-4 { margin-right: 0.5rem !important; }
            @media print {
              .no-print { display: none !important; }
              body { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const handleDownloadPDF = async (documentType: string) => {
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: application.id,
          documentType,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `${documentType}-${application.personal_info?.fullName || "document"}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("PDF download failed:", error)
    }
  }

  const documents = [
    {
      id: "cover-letter",
      title: "Anschreiben",
      icon: FileText,
      description: "Professionelles Anschreiben im deutschen Format",
    },
    {
      id: "resume-standard",
      title: "Lebenslauf (Standard)",
      icon: User,
      description: "Klassischer deutscher Lebenslauf für Standardkarrieren",
    },
    {
      id: "resume-complex",
      title: "Lebenslauf (Komplex)",
      icon: Building,
      description: "Für mehrere Positionen pro Unternehmen und komplexe Karrierewege",
    },
    {
      id: "resume",
      title: "Lebenslauf (Modern)",
      icon: Users,
      description: "Moderner Lebenslauf mit visuellen Elementen",
    },
    {
      id: "projects",
      title: "Projektportfolio",
      icon: FolderOpen,
      description: "Detaillierte Übersicht aller Frontend-Projekte",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Druckvorschau & Export
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">A4-optimierte Dokumente für deutsche Bewerbungen</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Vorschau ausblenden" : "Vorschau anzeigen"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dokumente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc) => {
                const Icon = doc.icon
                return (
                  <div key={doc.id}>
                    <Button
                      variant={activeTab === doc.id ? "default" : "outline"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setActiveTab(doc.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-4 h-4 mt-0.5" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{doc.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{doc.description}</div>
                        </div>
                      </div>
                    </Button>

                    {activeTab === doc.id && (
                      <div className="mt-2 space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => handlePrint(doc.id)}
                        >
                          <Printer className="w-4 h-4 mr-2" />
                          Drucken
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => handleDownloadPDF(doc.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          PDF Export
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Preview Area */}
        {showPreview && (
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Vorschau: {documents.find((d) => d.id === activeTab)?.title}
                </CardTitle>
                <Separator />
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="bg-white shadow-lg mx-auto" style={{ width: "210mm", minHeight: "297mm" }}>
                    <div className="p-8">
                      {activeTab === "cover-letter" && <PrintableCoverLetter application={application} />}
                      {activeTab === "resume" && <PrintableResume application={application} />}
                      {activeTab === "resume-standard" && <PrintableResumeStandard application={application} />}
                      {activeTab === "resume-complex" && <PrintableResumeComplex application={application} />}
                      {activeTab === "projects" && <PrintableProjects application={application} />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Format Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lebenslauf-Formate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium mb-2">📄 Standard-Format</h4>
              <p className="text-gray-600">
                Klassisches deutsches Format mit Datum links, Inhalt rechts. Ideal für lineare Karriereverläufe.
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium mb-2">🏢 Komplex-Format</h4>
              <p className="text-gray-600">
                Für mehrere Positionen pro Unternehmen, Sabbaticals und komplexe Karrierewege mit Gruppierung.
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-medium mb-2">✨ Modern-Format</h4>
              <p className="text-gray-600">
                Visuell ansprechend mit Farben und Icons, behält aber deutsche Professionalität bei.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Drucktipps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">📄 Papierformat</h4>
              <p className="text-gray-600">A4 (210 × 297 mm) verwenden</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">🖨️ Druckqualität</h4>
              <p className="text-gray-600">Hohe Qualität, 300 DPI empfohlen</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">📏 Ränder</h4>
              <p className="text-gray-600">2,5cm oben/unten, 2cm links/rechts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
