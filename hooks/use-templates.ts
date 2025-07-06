"use client"

/**
 * Thin convenience hook around the global store + templatesAPI.
 * - Gives components a typed, memoised interface
 * - Exposes incrementTemplateUsage so <ApplicationEditor /> can call it
 */

import { useCallback } from "react"
import { useAppStore } from "@/lib/store/app-store"
import { templatesAPI } from "@/lib/api/unified-api"

export function useTemplates() {
  const templates = useAppStore((s) => s.templates)

  /* Fetch all templates (network or demo store) */
  const fetchTemplates = useCallback(async () => {
    try {
      await templatesAPI.getAll()
    } catch (err) {
      console.error("Failed to load templates:", err)
    }
  }, [])

  /* Create a new template */
  const createTemplate = useCallback(async (payload: any) => {
    try {
      return await templatesAPI.create(payload)
    } catch (err) {
      console.error("Failed to create template:", err)
    }
  }, [])

  /* Increment usage counter */
  const incrementTemplateUsage = useCallback(async (id: string) => {
    try {
      await templatesAPI.incrementUsage(id)
    } catch (err) {
      console.error("Failed to increment template usage:", err)
    }
  }, [])

  return { templates, fetchTemplates, createTemplate, incrementTemplateUsage }
}
