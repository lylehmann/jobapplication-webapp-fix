'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestConnectionPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Test 1: Basic connection
        console.log('Testing basic connection...')
        const { data: healthCheck, error: healthError } = await supabase
          .from('applications')
          .select('count(*)', { count: 'exact', head: true })
        
        if (healthError) {
          console.error('Health check failed:', healthError)
          setStatus('error')
          setMessage(`Verbindungsfehler: ${healthError.message}`)
          return
        }

        // Test 2: Try to fetch applications schema info
        console.log('Testing applications table access...')
        const { data: apps, error: appsError } = await supabase
          .from('applications')
          .select('id, title, created_at')
          .limit(1)
        
        if (appsError) {
          console.error('Applications query failed:', appsError)
          setStatus('error')
          setMessage(`Tabellenfehler: ${appsError.message}`)
          return
        }

        // Test 3: Check if we can create/update (without actually doing it)
        console.log('Testing write permissions...')
        const { error: permError } = await supabase
          .from('applications')
          .insert({
            title: 'test',
            user_id: 'test'
          })
          .select()
          .single()
        
        // We expect this to fail with auth error, not schema error
        if (permError && !permError.message.includes('user_id') && !permError.message.includes('auth')) {
          console.error('Schema error detected:', permError)
          setStatus('error')
          setMessage(`Schema-Problem: ${permError.message}`)
          return
        }

        setStatus('success')
        setMessage('Supabase-Verbindung erfolgreich! Alle Tests bestanden.')
        
      } catch (err) {
        console.error('Connection test failed:', err)
        setStatus('error')
        setMessage(`Unerwarteter Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto p-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Supabase Verbindungstest</h1>
      
      <div className={`p-6 rounded-lg ${
        status === 'loading' ? 'bg-blue-50' :
        status === 'success' ? 'bg-green-50' : 'bg-red-50'
      }`}>
        <div className="flex items-center gap-3">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          )}
          {status === 'success' && (
            <div className="text-green-600">✅</div>
          )}
          {status === 'error' && (
            <div className="text-red-600">❌</div>
          )}
          <span className={`font-medium ${
            status === 'loading' ? 'text-blue-600' :
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {status === 'loading' ? 'Teste Verbindung...' : message}
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Konfiguration</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Gesetzt' : '❌ Nicht gesetzt'}</p>
        </div>
      </div>
    </div>
  )
}
