"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, FileText, ImageIcon, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useFiles } from "@/hooks/use-files"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface FileSelectorProps {
  type: "image" | "document" | "other"
  selectedFile?: string // For single selection
  selectedFiles?: string[] // For multiple selection
  onSingleSelection?: (fileId: string | null) => void
  onSelectionChange?: (fileIds: string[]) => void
  multiple?: boolean
  title?: string
  description?: string
  children: React.ReactNode
}

export function FileSelector({
  type,
  selectedFile,
  selectedFiles = [],
  onSingleSelection,
  onSelectionChange,
  multiple = false,
  title = "Select Files",
  description = "Choose files from your collection",
  children,
}: FileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const { files, uploadFile, deleteFile, downloadFile, getFilesByType, isLoading } = useFiles()

  const filteredFiles = getFilesByType(type).filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const category = type === "image" ? "Uploaded Images" : "Uploaded Documents"
      await uploadFile(file, category)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSingleSelect = (fileId: string) => {
    const newSelection = selectedFile === fileId ? null : fileId
    onSingleSelection?.(newSelection)
  }

  const handleMultipleSelect = (fileId: string, checked: boolean) => {
    const newSelection = checked ? [...selectedFiles, fileId] : selectedFiles.filter((id) => id !== fileId)
    onSelectionChange?.(newSelection)
  }

  const isSelected = (fileId: string) => {
    if (multiple) {
      return selectedFiles.includes(fileId)
    }
    return selectedFile === fileId
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload and Search */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept={type === "image" ? "image/*" : ".pdf,.doc,.docx"}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              className="hidden"
              id={`file-upload-${type}`}
              disabled={isUploading}
            />
            <Button asChild disabled={isUploading}>
              <label htmlFor={`file-upload-${type}`} className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : `Upload ${type === "image" ? "Image" : "Document"}`}
              </label>
            </Button>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* File Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading files...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <div className="text-muted-foreground">
                  {type === "image" ? (
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  ) : (
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                  )}
                  <p>No {type === "image" ? "images" : "documents"} found</p>
                  {searchQuery && <p className="text-sm">Try adjusting your search</p>}
                </div>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer transition-all hover:shadow-md relative group ${
                    isSelected(file.id) ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    if (multiple) {
                      handleMultipleSelect(file.id, !isSelected(file.id))
                    } else {
                      handleSingleSelect(file.id)
                    }
                  }}
                >
                  <CardContent className="p-3">
                    {/* File Preview */}
                    <div className="relative mb-3">
                      {type === "image" ? (
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-24 bg-muted rounded flex items-center justify-center">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}

                      {/* Selection Indicator */}
                      <div className="absolute top-1 right-1">
                        {multiple ? (
                          <Checkbox checked={isSelected(file.id)} onChange={() => {}} className="bg-white/90" />
                        ) : isSelected(file.id) ? (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        ) : null}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-6 h-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadFile(file.id, file.name)
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-6 h-6 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete File</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{file.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteFile(file.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {file.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Selected Files Summary */}
          {multiple && selectedFiles.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Selected Files ({selectedFiles.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((fileId) => {
                  const file = files.find((f) => f.id === fileId)
                  return file ? (
                    <Badge key={fileId} variant="secondary">
                      {file.name}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
