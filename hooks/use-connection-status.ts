"use client"

import { useState, useEffect } from "react"

export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionQuality, setConnectionQuality] = useState<"good" | "poor" | "offline">("good")

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
      if (!navigator.onLine) {
        setConnectionQuality("offline")
      }
    }

    const testConnectionQuality = async () => {
      if (!navigator.onLine) {
        setConnectionQuality("offline")
        return
      }

      try {
        const start = Date.now()
        const response = await fetch("/api/health", {
          method: "HEAD",
          cache: "no-cache",
        })
        const duration = Date.now() - start

        if (response.ok) {
          setConnectionQuality(duration < 1000 ? "good" : "poor")
        } else {
          setConnectionQuality("poor")
        }
      } catch (error) {
        setConnectionQuality("poor")
      }
    }

    // Initial check
    updateOnlineStatus()
    testConnectionQuality()

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Periodic connection quality check
    const interval = setInterval(testConnectionQuality, 30000) // Every 30 seconds

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
      clearInterval(interval)
    }
  }, [])

  return { isOnline, connectionQuality }
}
