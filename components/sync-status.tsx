"use client"

import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SyncStatusProps {
  isSyncing: boolean
  pendingCount: number
  onSync?: () => void
}

export function SyncStatus({ isSyncing, pendingCount, onSync }: SyncStatusProps) {
  if (!isSyncing && pendingCount === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {isSyncing ? (
        <Badge variant="secondary" className="flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="text-xs">Syncing...</span>
        </Badge>
      ) : pendingCount > 0 ? (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs">{pendingCount} pending</span>
          </Badge>
          {onSync && (
            <Button size="sm" variant="outline" onClick={onSync}>
              Sync Now
            </Button>
          )}
        </div>
      ) : (
        <Badge variant="default" className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs">Synced</span>
        </Badge>
      )}
    </div>
  )
}
