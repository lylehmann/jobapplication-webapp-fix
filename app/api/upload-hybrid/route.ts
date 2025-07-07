import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const results: any = {
      fileName: file.name,
      size: file.size,
      localUrl: null,
      supabaseUrl: null,
      success: false
    }

    // Check if we're in demo mode
    const isDemoMode = req.headers.get('x-demo-mode') === 'true'

    // Strategy 1: Local upload (always try)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadDir, { recursive: true })

      const timestamp = Date.now()
      const fileName = `${timestamp}-${file.name}`
      const filePath = path.join(uploadDir, fileName)
      await fs.writeFile(filePath, buffer)

      results.localUrl = `/uploads/${fileName}`
      results.success = true
      console.log('✓ Local upload successful:', results.localUrl)
    } catch (error) {
      console.warn('Local upload failed:', error)
      results.localError = error instanceof Error ? error.message : 'Unknown error'
    }

    // Strategy 2: Supabase upload (only if not in demo mode)
    if (!isDemoMode) {
      try {
        const supabase = createClient()
        
        // Reset file stream for Supabase upload
        const fileForSupabase = new File([await file.arrayBuffer()], file.name, { type: file.type })
        const fileName = `${Date.now()}-${file.name}`
        
        const { data, error } = await supabase.storage
          .from('application-files')
          .upload(fileName, fileForSupabase)

        if (error) {
          throw new Error(error.message)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('application-files')
          .getPublicUrl(fileName)

        results.supabaseUrl = urlData.publicUrl
        results.success = true
        console.log('✓ Supabase upload successful:', results.supabaseUrl)
      } catch (error) {
        console.warn('Supabase upload failed:', error)
        results.supabaseError = error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Return primary URL (prefer Supabase over local)
    const primaryUrl = results.supabaseUrl || results.localUrl

    if (!primaryUrl) {
      return NextResponse.json(
        { error: 'All upload strategies failed', details: results }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: primaryUrl,
      localUrl: results.localUrl,
      supabaseUrl: results.supabaseUrl,
      details: results
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
