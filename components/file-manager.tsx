"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Upload,
  FileText,
  ImageIcon,
  Trash2,
  Download,
  Eye,
  Search,
  Grid,
  List,
  FolderOpen,
  File,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFileStorage } from "@/hooks/use-file-storage"
import type { FileItem } from "@/lib/file-storage"

interface FileManagerProps {
  onBack: () => void
}

export function FileManager({ onBack }: FileManagerProps) {
  const { toast } = useToast()
  const { files, uploadFile, deleteFile, updateFile } = useFileStorage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (uploadedFiles: FileList) => {
    setIsUploading(true)
    try {
      const uploadPromises = Array.from(uploadedFiles).map((file) => uploadFile(file))
      await Promise.all(uploadPromises)
      toast({
        title: "Upload Successful",
        description: `${uploadedFiles.length} file(s) uploaded successfully.`,
      })
      setIsUploadDialogOpen(false)
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      deleteFile(fileId)
      toast({
        title: "File Deleted",
        description: "File has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = (fileId: string, updates: Partial<FileItem>) => {
    try {
      updateFile(fileId, updates)
      toast({
        title: "File Updated",
        description: "File information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory
    const matchesType = selectedType === "all" || file.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  const categories = Array.from(new Set(files.map((file) => file.category)))
  const fileTypes = Array.from(new Set(files.map((file) => file.type)))

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5" />
      case "document":
        return <FileText className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800"
      case "document":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">File Manager</h1>
              <p className="text-muted-foreground">Manage your images, documents, and other files</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Files</DialogTitle>
                  <DialogDescription>
                    Upload images, documents, and other files to your central storage
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(e.target.files)
                          e.target.value = ""
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {isUploading ? "Uploading..." : "Click to upload or drag and drop files here"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Supports images, PDFs, and documents</p>
                    </label>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search files, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {fileTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold text-foreground">{files.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Images</p>
                  <p className="text-2xl font-bold text-foreground">{files.filter((f) => f.type === "image").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documents</p>
                  <p className="text-2xl font-bold text-foreground">
                    {files.filter((f) => f.type === "document").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative">
                    {file.type === "image" && file.url ? (
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0"
                          onClick={() => {
                            setSelectedFile(file)
                            setIsPreviewOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="w-8 h-8 p-0">
                              <Trash2 className="w-4 h-4" />
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
                              <AlertDialogAction onClick={() => handleDelete(file.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-foreground truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <Badge className={getTypeColor(file.type)}>{file.type}</Badge>
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{file.category}</p>
                    {file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {file.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {file.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{file.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredFiles.map((file, index) => (
                  <div key={file.id}>
                    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{file.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge className={getTypeColor(file.type)}>{file.type}</Badge>
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.category}</span>
                          <span>•</span>
                          <span>{file.uploadDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFile(file)
                            setIsPreviewOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
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
                              <AlertDialogAction onClick={() => handleDelete(file.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {index < filteredFiles.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all" || selectedType !== "all"
                ? "Try adjusting your search or filters"
                : "Upload your first files to get started"}
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        )}

        {/* File Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>File Details</DialogTitle>
            </DialogHeader>
            {selectedFile && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {selectedFile.type === "image" && selectedFile.url ? (
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={selectedFile.url || "/placeholder.svg"}
                          alt={selectedFile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        {getFileIcon(selectedFile.type)}
                        <span className="ml-2 text-lg font-medium">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>File Name</Label>
                      <Input
                        value={selectedFile.name}
                        onChange={(e) => setSelectedFile({ ...selectedFile, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={selectedFile.category}
                        onChange={(e) => setSelectedFile({ ...selectedFile, category: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={selectedFile.description || ""}
                        onChange={(e) => setSelectedFile({ ...selectedFile, description: e.target.value })}
                        placeholder="Add a description..."
                      />
                    </div>
                    <div>
                      <Label>Tags (comma separated)</Label>
                      <Input
                        value={selectedFile.tags.join(", ")}
                        onChange={(e) =>
                          setSelectedFile({
                            ...selectedFile,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Badge className={getTypeColor(selectedFile.type)}>{selectedFile.type}</Badge>
                      </div>
                      <div>
                        <Label>Size</Label>
                        <p className="text-sm text-muted-foreground">{selectedFile.size}</p>
                      </div>
                    </div>
                    <div>
                      <Label>Upload Date</Label>
                      <p className="text-sm text-muted-foreground">{selectedFile.uploadDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          handleUpdate(selectedFile.id, selectedFile)
                          setIsPreviewOpen(false)
                        }}
                      >
                        Save Changes
                      </Button>
                      {selectedFile.url && (
                        <Button variant="outline" asChild>
                          <a href={selectedFile.url} download={selectedFile.name}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
