'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { ApplicationsAPI } from '@/lib/api/applications'
import { unifiedAPI } from '@/lib/api/unified-api'
import { Loader, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface DiagnosticResult {
  test: string
  status: 'running' | 'success' | 'error' | 'warning'
  message: string
  details?: any
}

export default function SyncDiagnosticsPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result])
  }

  const updateResult = (testName: string, updates: Partial<DiagnosticResult>) => {
    setResults(prev => 
      prev.map(r => r.test === testName ? { ...r, ...updates } : r)
    )
  }

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults([])

    // Test 1: Basic Supabase Connection
    addResult({ test: 'Supabase Verbindung', status: 'running', message: 'Teste Verbindung...' })
    try {
      const supabase = createClient()
      
      // Check if we're in demo mode first
      const isDev = process.env.NODE_ENV === "development" || window.location.hostname === "localhost"
      if (isDev) {
        // Activate demo session
        localStorage.setItem("demo-user-session", "true")
        updateResult('Supabase Verbindung', {
          status: 'success',
          message: 'Demo-Modus aktiviert (lokale Entwicklung)',
          details: { mode: 'demo', user: 'demo-user-123' }
        })
      } else {
        const { data, error } = await supabase.auth.getUser()
        if (error) throw error
        
        updateResult('Supabase Verbindung', {
          status: 'success',
          message: 'Authentifizierte Verbindung erfolgreich',
          details: { user: data.user?.id || 'anonymous' }
        })
      }
    } catch (error: any) {
      updateResult('Supabase Verbindung', {
        status: 'error',
        message: `Verbindungsfehler: ${error.message}`,
        details: error
      })
    }

    // Test 2: Database Schema Check
    addResult({ test: 'Datenbankschema', status: 'running', message: 'Prüfe Tabellenschema...' })
    try {
      const supabase = createClient()
      
      // Check if applications table exists and what columns it has
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .limit(1)
      
      if (error) throw error
      
      const sampleApp = data[0]
      const hasCorrectFields = sampleApp && [
        'title', 'cover_letter_data', 'resume_data', 'projects_data', 'selected_documents'
      ].every(field => field in sampleApp)
      
      updateResult('Datenbankschema', {
        status: hasCorrectFields ? 'success' : 'warning',
        message: hasCorrectFields ? 'Schema korrekt' : 'Schema-Inkonsistenzen gefunden',
        details: { availableFields: sampleApp ? Object.keys(sampleApp) : [] }
      })
    } catch (error: any) {
      updateResult('Datenbankschema', {
        status: 'error',
        message: `Schema-Fehler: ${error.message}`,
        details: error
      })
    }

    // Test 3: Applications API
    addResult({ test: 'Applications API', status: 'running', message: 'Teste API-Funktionen...' })
    try {
      // Use unified API instead of direct ApplicationsAPI
      const apps = await unifiedAPI.getApplications()
      
      updateResult('Applications API', {
        status: 'success',
        message: `API funktioniert - ${apps.length} Bewerbungen gefunden`,
        details: { count: apps.length, sample: apps[0], apiType: 'unified' }
      })
    } catch (error: any) {
      updateResult('Applications API', {
        status: 'error',
        message: `API-Fehler: ${error.message}`,
        details: error
      })
    }

    // Test 4: Field Mapping Test
    addResult({ test: 'Feld-Mapping', status: 'running', message: 'Teste Datenfeld-Konvertierung...' })
    try {
      // Test with unified API
      const apps = await unifiedAPI.getApplications()
      if (apps.length > 0) {
        const testApp = apps[0]
        const hasValidFields = testApp.job_title !== undefined && 
                             testApp.cover_letter_data !== undefined
        
        updateResult('Feld-Mapping', {
          status: hasValidFields ? 'success' : 'warning',
          message: hasValidFields ? 'Mapping funktioniert' : 'Mapping-Probleme entdeckt',
          details: { sampleFields: Object.keys(testApp), sampleApp: testApp }
        })
      } else {
        // Create a demo application to test mapping
        const demoApp = await unifiedAPI.createApplication({
          job_title: 'Test Position',
          company: 'Test Company',
          status: 'draft'
        })
        
        updateResult('Feld-Mapping', {
          status: 'success',
          message: 'Mapping funktioniert - Demo-Bewerbung erstellt',
          details: { createdApp: demoApp }
        })
      }
    } catch (error: any) {
      updateResult('Feld-Mapping', {
        status: 'error',
        message: `Mapping-Fehler: ${error.message}`,
        details: error
      })
    }

    // Test 5: Environment Variables
    addResult({ test: 'Environment Variables', status: 'running', message: 'Prüfe Konfiguration...' })
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url_format: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co'),
      key_format: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ')
    }
    
    const allEnvOk = Object.values(envCheck).every(Boolean)
    updateResult('Environment Variables', {
      status: allEnvOk ? 'success' : 'error',
      message: allEnvOk ? 'Alle Umgebungsvariablen korrekt' : 'Umgebungsvariablen-Probleme',
      details: envCheck
    })

    setIsRunning(false)
  }

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'running': return <Loader className="w-4 h-4 animate-spin text-blue-500" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-50 border-blue-200'
      case 'success': return 'bg-green-50 border-green-200'
      case 'error': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
    }
  }

  return (
    <div className="container mx-auto p-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Supabase Sync Diagnostics</h1>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Läuft...
              </>
            ) : (
              'Diagnostics starten'
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              localStorage.setItem("demo-user-session", "true")
              window.location.reload()
            }}
          >
            Demo-Modus aktivieren
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <strong>Hinweis:</strong> Im Demo-Modus verwenden Sie lokale Testdaten ohne Supabase-Authentifizierung.
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className={`border-2 ${getStatusColor(result.status)}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getStatusIcon(result.status)}
                {result.test}
                <Badge 
                  variant={result.status === 'success' ? 'default' : 
                          result.status === 'error' ? 'destructive' : 
                          result.status === 'warning' ? 'secondary' : 'outline'}
                >
                  {result.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{result.message}</p>
              {result.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground mb-2">
                    Details anzeigen
                  </summary>
                  <pre className="bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length > 0 && !isRunning && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Zusammenfassung:</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600">
              ✅ Erfolgreich: {results.filter(r => r.status === 'success').length}
            </span>
            <span className="text-yellow-600">
              ⚠️ Warnungen: {results.filter(r => r.status === 'warning').length}
            </span>
            <span className="text-red-600">
              ❌ Fehler: {results.filter(r => r.status === 'error').length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
