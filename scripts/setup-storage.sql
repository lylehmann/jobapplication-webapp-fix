-- Setup script for Supabase Storage bucket
-- Run this in your Supabase SQL editor

-- Create the application-files bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-files',
  'application-files',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
CREATE POLICY "Public read access for application files" ON storage.objects
FOR SELECT USING (bucket_id = 'application-files');

CREATE POLICY "Authenticated users can upload application files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'application-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own application files" ON storage.objects
FOR UPDATE USING (bucket_id = 'application-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own application files" ON storage.objects
FOR DELETE USING (bucket_id = 'application-files' AND auth.uid()::text = (storage.foldername(name))[1]);
