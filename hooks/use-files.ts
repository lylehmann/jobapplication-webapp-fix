"use client"

import { useCallback } from "react"
import { useFileStorage } from "./use-file-storage"

export function useFiles() {
  const fileStorage = useFileStorage()

  const getFilesByType = useCallback(
    (type: string) => {
      return fileStorage.files.filter((file) => {
        if (type === "images") {
          return file.type.startsWith("image/")
        }
        if (type === "documents") {
          return file.type === "application/pdf" || file.type.includes("document")
        }
        return true
      })
    },
    [fileStorage.files],
  )

  const downloadFile = useCallback(
    async (fileId: string) => {
      const file = fileStorage.files.find((f) => f.id === fileId)
      if (!file) return

      try {
        // Create a download link
        const link = document.createElement("a")
        link.href = file.url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error("Failed to download file:", error)
      }
    },
    [fileStorage.files],
  )

  const addTagToFile = useCallback(async (fileId: string, tag: string) => {
    // Implementation would depend on your file storage system
    console.log("Adding tag", tag, "to file", fileId)
  }, [])

  return {
    ...fileStorage,
    getFilesByType,
    downloadFile,
    addTagToFile,
  }
}
