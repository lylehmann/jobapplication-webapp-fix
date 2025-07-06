"use client"

import { Wifi, WifiOff, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useConnectionStatus } from "@/hooks/use-connection-status"

export function ConnectionStatus() {
  const { isOnline, connectionQuality } = useConnectionStatus()

  if (isOnline && connectionQuality === "good") {
    return null // Don't show anything when connection is good
  }

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        text: "Offline",
        variant: "destructive" as const,
        description: "Working offline. Changes will sync when online.",
      }
    }

    if (connectionQuality === "poor") {
      return {
        icon: AlertTriangle,
        text: "Poor Connection",
        variant: "secondary" as const,
        description: "Slow connection detected. Some features may be delayed.",
      }
    }

    return {
      icon: Wifi,
      text: "Online",
      variant: "default" as const,
      description: "Connected",
    }
  }

  const { icon: Icon, text, variant, description } = getStatusConfig()

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant={variant} className="flex items-center gap-2 px-3 py-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{text}</span>
      </Badge>
      {!isOnline && <p className="text-xs text-muted-foreground mt-1 text-right">{description}</p>}
    </div>
  )
}
