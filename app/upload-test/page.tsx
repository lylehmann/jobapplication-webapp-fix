'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { fileStorage } from '@/lib/file-storage'

export default function UploadTestPage() {
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Check demo mode on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsDemoMode(localStorage.getItem("demo-user-session") === "true")
    }
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
    setUploadResult(null)
  }

  const testUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadResult(null)

    try {
      console.log('Testing upload for file:', selectedFile.name)
      
      // Test with our file storage service
      const result = await fileStorage.uploadFile(selectedFile, 'Test Upload')
      
      setUploadResult({
        success: true,
        fileItem: result,
        timestamp: new Date().toISOString()
      })
      
      console.log('Upload test successful:', result)
    } catch (error) {
      console.error('Upload test failed:', error)
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsUploading(false)
    }
  }

  const testApiUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'x-demo-mode': isDemoMode ? 'true' : 'false'
        }
      })
      
      const data = await response.json()
      
      setUploadResult({
        success: response.ok,
        apiResponse: data,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">File Upload Test</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Upload Status
              <Badge variant={isDemoMode ? "secondary" : "default"}>
                {isDemoMode ? "Demo Modus" : "Production Modus"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="file-input" className="block text-sm font-medium mb-2">
                Datei auswählen:
              </label>
              <Input
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>
            
            {selectedFile && (
              <div className="p-3 bg-gray-50 rounded">
                <p><strong>Datei:</strong> {selectedFile.name}</p>
                <p><strong>Größe:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Typ:</strong> {selectedFile.type}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={testUpload} 
                disabled={!selectedFile || isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? 'Uploading...' : 'Test File Storage Service'}
              </Button>
              
              <Button 
                onClick={testApiUpload} 
                disabled={!selectedFile || isUploading}
                variant="outline"
              >
                {isUploading ? 'Uploading...' : 'Test API Upload'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {uploadResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Upload Ergebnis
                <Badge variant={uploadResult.success ? "default" : "destructive"}>
                  {uploadResult.success ? "Erfolgreich" : "Fehlgeschlagen"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Upload Strategien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Demo Modus:</strong> Nur lokaler Upload zu `/public/uploads/`</p>
            <p><strong>Production Modus:</strong> Sowohl lokaler Upload als auch Supabase Storage</p>
            <p><strong>File Storage Service:</strong> Automatische Erkennung und hybride Uploads</p>
            <p><strong>Fallback:</strong> Bei Supabase-Fehlern wird lokaler Upload verwendet</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
