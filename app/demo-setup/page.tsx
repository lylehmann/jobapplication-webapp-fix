'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DemoActivatorPage() {
  const [demoActive, setDemoActive] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    // Check current demo status
    const checkDemoStatus = () => {
      const hasDemo = localStorage.getItem("demo-user-session")
      setDemoActive(!!hasDemo)
      
      // Try to get user info from store
      try {
        const appStore = localStorage.getItem('job-application-store')
        if (appStore) {
          const parsed = JSON.parse(appStore)
          setUserInfo(parsed.state?.user)
        }
      } catch (e) {
        console.log('No store data yet')
      }
    }
    
    checkDemoStatus()
    
    // Auto-activate demo in development
    const isDev = process.env.NODE_ENV === "development" || window.location.hostname === "localhost"
    if (isDev && !demoActive) {
      activateDemo()
    }
  }, [])

  const activateDemo = () => {
    // 1. Set demo session
    localStorage.setItem("demo-user-session", "true")
    
    // 2. Create demo user in store
    const demoUser = {
      id: "demo-user",
      email: "demo@example.com",
      name: "Demo User",
      isDemoUser: true
    }
    
    // 3. Create demo application with all required fields
    const demoApp = {
      id: "demo-app-1",
      user_id: "demo-user",
      job_title: "Frontend Entwickler",
      company: "Demo Company GmbH",
      status: "applied",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      personal_info: {
        fullName: "Max Mustermann",
        email: "max@example.com",
        phone: "+49 30 12345678",
        location: "Berlin, Deutschland"
      },
      cover_letter_data: {
        subject: "Bewerbung als Frontend Entwickler",
        salutation: "Sehr geehrte Damen und Herren,"
      },
      resume_data: {
        summary: "Erfahrener Frontend-Entwickler mit Fokus auf React und TypeScript.",
        experience: [],
        education: [],
        skills: {}
      },
      projects_data: [],
      selected_documents: []
    }
    
    // 4. Set up store with correct structure for Zustand persist
    const demoStore = {
      state: {
        user: demoUser,
        applications: [demoApp],
        templates: []
      },
      version: 0
    }
    
    localStorage.setItem('job-application-store', JSON.stringify(demoStore))
    
    setDemoActive(true)
    setUserInfo(demoUser)
    
    console.log('Demo-Modus aktiviert mit Bewerbung:', demoApp)
  }

  const clearDemo = () => {
    localStorage.removeItem("demo-user-session")
    localStorage.removeItem('job-application-store')
    setDemoActive(false)
    setUserInfo(null)
    console.log('Demo-Modus deaktiviert!')
  }

  const goToApp = () => {
    window.location.href = '/'
  }

  const goToDiagnostics = () => {
    window.location.href = '/sync-diagnostics'
  }

  const goToUploadTest = () => {
    window.location.href = '/upload-test'
  }

  return (
    <div className="container mx-auto p-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Demo-Modus Management</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Demo Status
              <Badge variant={demoActive ? "default" : "secondary"}>
                {demoActive ? "Aktiv" : "Inaktiv"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>LocalStorage Demo Session:</strong> {localStorage.getItem("demo-user-session") || "Nicht gesetzt"}
            </div>
            
            {userInfo && (
              <div>
                <strong>Benutzer:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
                  {JSON.stringify(userInfo, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="flex gap-2">
              {!demoActive ? (
                <Button onClick={activateDemo} className="bg-green-600 hover:bg-green-700">
                  Demo-Modus aktivieren
                </Button>
              ) : (
                <Button onClick={clearDemo} variant="destructive">
                  Demo-Modus deaktivieren
                </Button>
              )}
              
              <Button onClick={goToApp} variant="outline">
                Zur Hauptanwendung
              </Button>
              
              <Button onClick={goToDiagnostics} variant="outline">
                Zu Diagnostics
              </Button>
              
              <Button onClick={goToUploadTest} variant="outline">
                Upload Test
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entwicklungsinfo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
              <div><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'unknown'}</div>
              <div><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'unknown'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problemlösung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. <strong>Demo aktivieren:</strong> Klicken Sie auf "Demo-Modus aktivieren"</p>
            <p>2. <strong>Daten prüfen:</strong> Gehen Sie zur Hauptanwendung</p>
            <p>3. <strong>Sync testen:</strong> Testen Sie den Sync-Button in einer Bewerbung</p>
            <p>4. <strong>Bei Problemen:</strong> Demo deaktivieren und wieder aktivieren</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
