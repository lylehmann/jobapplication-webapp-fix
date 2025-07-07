'use client'

import { useEffect } from 'react'

export default function QuickFixPage() {
  useEffect(() => {
    // Immediate demo activation
    console.log('=== QUICK FIX: Activating Demo Mode ===')
    
    // 1. Set demo session
    localStorage.setItem("demo-user-session", "true")
    console.log('✓ Demo session set')
    
    // 2. Clear any existing store to reset state
    localStorage.removeItem('job-application-store')
    console.log('✓ Store cleared')
    
    // 3. Redirect to main app
    setTimeout(() => {
      window.location.href = '/'
    }, 1000)
  }, [])

  return (
    <div className="container mx-auto p-8 pt-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Demo-Modus wird aktiviert...</h1>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Sie werden zur Hauptanwendung weitergeleitet.</p>
      </div>
    </div>
  )
}
