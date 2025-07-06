// Central file storage service
export interface FileItem {
  id: string
  name: string
  type: "image" | "document" | "other"
  size: string
  url?: string
  base64?: string
  category: string
  uploadDate: string
  tags: string[]
  description?: string
}

class FileStorageService {
  private storageKey = "file-manager-files"

  // Convert file to base64 for storage
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Get all files from storage
  getFiles(): FileItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading files:", error)
      return []
    }
  }

  // Get files by type
  getFilesByType(type: "image" | "document" | "other"): FileItem[] {
    return this.getFiles().filter((file) => file.type === type)
  }

  // Save files to storage
  private saveFiles(files: FileItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(files))
    } catch (error) {
      console.error("Error saving files:", error)
      throw new Error("Failed to save files")
    }
  }

  // Upload new file
  async uploadFile(file: File, category?: string): Promise<FileItem> {
    try {
      const base64 = await this.fileToBase64(file)
      const fileType = file.type.startsWith("image/") ? "image" : file.type.includes("pdf") ? "document" : "other"

      const newFile: FileItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: fileType,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        base64,
        url: fileType === "image" ? base64 : undefined,
        category: category || (fileType === "image" ? "Uploaded Images" : "Uploaded Documents"),
        uploadDate: new Date().toISOString().split("T")[0],
        tags: [],
        description: "",
      }

      const files = this.getFiles()
      const updatedFiles = [...files, newFile]
      this.saveFiles(updatedFiles)

      return newFile
    } catch (error) {
      console.error("Error uploading file:", error)
      throw new Error("Failed to upload file")
    }
  }

  // Delete file
  deleteFile(fileId: string): void {
    const files = this.getFiles()
    const updatedFiles = files.filter((file) => file.id !== fileId)
    this.saveFiles(updatedFiles)
  }

  // Update file
  updateFile(fileId: string, updates: Partial<FileItem>): void {
    const files = this.getFiles()
    const updatedFiles = files.map((file) => (file.id === fileId ? { ...file, ...updates } : file))
    this.saveFiles(updatedFiles)
  }

  // Initialize with default files
  initializeDefaultFiles(): void {
    const existingFiles = this.getFiles()
    if (existingFiles.length === 0) {
      const defaultFiles: FileItem[] = [
        {
          id: "default-1",
          name: "Professional_Headshot.jpg",
          type: "image",
          size: "2.1 MB",
          base64: "/placeholder.svg?height=200&width=200&text=Professional",
          url: "/placeholder.svg?height=200&width=200&text=Professional",
          category: "Profile Photos",
          uploadDate: "2023-01-10",
          tags: ["profile", "professional", "headshot"],
          description: "Professional headshot for job applications",
        },
        {
          id: "default-2",
          name: "AWS_Certification.pdf",
          type: "document",
          size: "2.3 MB",
          category: "Certifications",
          uploadDate: "2023-03-15",
          tags: ["aws", "certification", "cloud"],
          description: "AWS Solutions Architect certification",
        },
        {
          id: "default-3",
          name: "Resume_2024.pdf",
          type: "document",
          size: "1.8 MB",
          category: "Resumes",
          uploadDate: "2024-01-01",
          tags: ["resume", "cv", "2024"],
          description: "Updated resume for 2024 job applications",
        },
      ]
      this.saveFiles(defaultFiles)
    }
  }
}

export const fileStorage = new FileStorageService()
