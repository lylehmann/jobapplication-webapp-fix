-- Update applications table to include all required fields
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS personal_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cover_letter_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS resume_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS projects_data TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS selected_documents TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_role TEXT DEFAULT 'frontend-engineer',
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES templates(id);

-- Update files table to include category
ALTER TABLE files 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'document';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_target_role ON applications(target_role);
CREATE INDEX IF NOT EXISTS idx_files_category ON files(category);
CREATE INDEX IF NOT EXISTS idx_templates_target_role ON templates(target_role);

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own applications" ON applications;
CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own applications" ON applications;
CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own applications" ON applications;
CREATE POLICY "Users can delete own applications" ON applications
  FOR DELETE USING (auth.uid() = user_id);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE files;
ALTER PUBLICATION supabase_realtime ADD TABLE templates;
