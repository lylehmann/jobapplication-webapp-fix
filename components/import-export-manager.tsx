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
import { Download, Upload, FileText } from "lucide-react"
import { useApplications } from "@/hooks/use-applications"
import { useToast } from "@/hooks/use-toast"

export function ImportExportManager() {
  const [isOpen, setIsOpen] = useState(false)
  const { applications, createApplication } = useApplications()
  const { toast } = useToast()

  const exportApplications = () => {
    try {
      const dataStr = JSON.stringify(applications, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
      const exportFileDefaultName = `job-applications-${new Date().toISOString().split("T")[0]}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Export Successful",
        description: "Applications have been exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting applications:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export applications. Please try again.",
        variant: "destructive",
      })
    }
  }

  const importApplications = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        if (Array.isArray(importedData)) {
          // Import each application
          for (const appData of importedData) {
            const { id, created_at, updated_at, ...insertData } = appData
            await createApplication(insertData)
          }
          toast({
            title: "Import Successful",
            description: `Imported ${importedData.length} applications successfully.`,
          })
          setIsOpen(false)
        } else {
          throw new Error("Invalid file format")
        }
      } catch (error) {
        console.error("Error importing applications:", error)
        toast({
          title: "Import Failed",
          description: "Failed to import applications. Please check the file format.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
    event.target.value = "" // Reset input
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Import/Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import/Export Applications</DialogTitle>
          <DialogDescription>
            Export your applications to JSON or import from a previously exported file.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Export Applications</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Download all your applications as a JSON file for backup or transfer.
            </p>
            <Button onClick={exportApplications} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export All Applications
            </Button>
          </div>

          <div>
            <h4 className="font-medium mb-2">Import Applications</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Upload a JSON file to import applications. This will add to your existing applications.
            </p>
            <input type="file" accept=".json" onChange={importApplications} className="hidden" id="import-input" />
            <Button variant="outline" asChild className="w-full bg-transparent">
              <label htmlFor="import-input" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import Applications
              </label>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
