"use client"

import { useState, useEffect, useCallback } from "react"
import { fileStorage, type FileItem } from "@/lib/file-storage"

export function useFileStorage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load files from storage
  const loadFiles = useCallback(() => {
    try {
      const storedFiles = fileStorage.getFiles()
      setFiles(storedFiles)
    } catch (error) {
      console.error("Error loading files:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Upload file
  const uploadFile = useCallback(
    async (file: File, category?: string): Promise<FileItem> => {
      const newFile = await fileStorage.uploadFile(file, category)
      loadFiles() // Refresh files list
      return newFile
    },
    [loadFiles],
  )

  // Delete file
  const deleteFile = useCallback(
    (fileId: string) => {
      fileStorage.deleteFile(fileId)
      loadFiles() // Refresh files list
    },
    [loadFiles],
  )

  // Update file
  const updateFile = useCallback(
    (fileId: string, updates: Partial<FileItem>) => {
      fileStorage.updateFile(fileId, updates)
      loadFiles() // Refresh files list
    },
    [loadFiles],
  )

  // Get files by type
  const getFilesByType = useCallback(
    (type: "image" | "document" | "other") => {
      return files.filter((file) => file.type === type)
    },
    [files],
  )

  // Initialize on mount
  useEffect(() => {
    fileStorage.initializeDefaultFiles()
    loadFiles()
  }, [loadFiles])

  return {
    files,
    isLoading,
    uploadFile,
    deleteFile,
    updateFile,
    getFilesByType,
    refreshFiles: loadFiles,
  }
}
