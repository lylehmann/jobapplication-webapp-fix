import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type Application = Database["public"]["Tables"]["applications"]["Row"]
type FileRecord = Database["public"]["Tables"]["files"]["Row"]

export class RealtimeManager {
  private supabase = createClient()
  private subscriptions = new Map<string, any>()

  subscribeToApplications(callback: (payload: any) => void) {
    const subscription = this.supabase
      .channel("applications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
        },
        callback,
      )
      .subscribe()

    this.subscriptions.set("applications", subscription)
    return subscription
  }

  subscribeToFiles(callback: (payload: any) => void) {
    const subscription = this.supabase
      .channel("files-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "files",
        },
        callback,
      )
      .subscribe()

    this.subscriptions.set("files", subscription)
    return subscription
  }

  unsubscribe(key: string) {
    const subscription = this.subscriptions.get(key)
    if (subscription) {
      this.supabase.removeChannel(subscription)
      this.subscriptions.delete(key)
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((subscription, key) => {
      this.supabase.removeChannel(subscription)
    })
    this.subscriptions.clear()
  }
}

export const realtimeManager = new RealtimeManager()
