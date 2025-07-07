import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if we're in demo mode via header or localStorage check
    const isDemoMode = req.headers.get('x-demo-mode') === 'true';
    
    // Strategy 1: Always try local upload first
    let localUrl: string | null = null;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      localUrl = `/uploads/${fileName}`;
      console.log('✓ Local upload successful:', localUrl);
    } catch (error) {
      console.warn('Local upload failed:', error);
    }

    // Strategy 2: Try Supabase upload if not in demo mode
    let supabaseUrl: string | null = null;
    if (!isDemoMode) {
      try {
        const supabase = createClient();
        
        // Reset file for Supabase
        const fileForSupabase = new File([await file.arrayBuffer()], file.name, { type: file.type });
        const fileName = `${Date.now()}-${file.name}`;
        
        const { data, error } = await supabase.storage
          .from('application-files')
          .upload(fileName, fileForSupabase);

        if (error) {
          throw new Error(error.message);
        }

        const { data: urlData } = supabase.storage
          .from('application-files')
          .getPublicUrl(fileName);

        supabaseUrl = urlData.publicUrl;
        console.log('✓ Supabase upload successful:', supabaseUrl);
      } catch (error) {
        console.warn('Supabase upload failed:', error);
      }
    }

    // Return the best available URL
    const primaryUrl = supabaseUrl || localUrl;
    
    if (!primaryUrl) {
      return NextResponse.json({ error: 'All upload methods failed' }, { status: 500 });
    }

    return NextResponse.json({ 
      url: primaryUrl,
      localUrl,
      supabaseUrl,
      mode: isDemoMode ? 'demo' : 'production'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
