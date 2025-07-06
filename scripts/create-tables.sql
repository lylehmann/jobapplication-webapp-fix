-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'in-progress', 'submitted', 'archived')) DEFAULT 'draft',
  personal_info JSONB DEFAULT '{}',
  cover_letter_data JSONB DEFAULT '{}',
  resume_data JSONB DEFAULT '{}',
  projects_data JSONB DEFAULT '[]',
  selected_documents TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'document', 'other')) NOT NULL,
  size BIGINT NOT NULL,
  file_path TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications"
ON applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
ON applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
ON applications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
ON applications FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for files
CREATE POLICY "Users can view their own files"
ON files FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files"
ON files FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
ON files FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
ON files FOR DELETE
USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON applications(user_id);
CREATE INDEX IF NOT EXISTS applications_updated_at_idx ON applications(updated_at DESC);
CREATE INDEX IF NOT EXISTS files_user_id_idx ON files(user_id);
CREATE INDEX IF NOT EXISTS files_type_idx ON files(type);
CREATE INDEX IF NOT EXISTS files_created_at_idx ON files(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
