-- Enable GitHub authentication and update RLS policies
-- Run this in your Supabase SQL editor

-- First, let's make sure we have the right RLS policies
DROP POLICY IF EXISTS "Users can only see their own applications" ON applications;
DROP POLICY IF EXISTS "Users can only insert their own applications" ON applications;
DROP POLICY IF EXISTS "Users can only update their own applications" ON applications;
DROP POLICY IF EXISTS "Users can only delete their own applications" ON applications;

-- Create comprehensive RLS policies for applications
CREATE POLICY "Users can only see their own applications" ON applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own applications" ON applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own applications" ON applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own applications" ON applications
    FOR DELETE USING (auth.uid() = user_id);

-- Do the same for templates table
DROP POLICY IF EXISTS "Users can see all templates" ON templates;
DROP POLICY IF EXISTS "Users can only insert their own templates" ON templates;
DROP POLICY IF EXISTS "Users can only update their own templates" ON templates;
DROP POLICY IF EXISTS "Users can only delete their own templates" ON templates;

-- Templates should be readable by all authenticated users but only editable by owners
CREATE POLICY "Users can see all templates" ON templates
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can only insert their own templates" ON templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own templates" ON templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own templates" ON templates
    FOR DELETE USING (auth.uid() = user_id);

-- Files table policies
DROP POLICY IF EXISTS "Users can only see their own files" ON files;
DROP POLICY IF EXISTS "Users can only insert their own files" ON files;
DROP POLICY IF EXISTS "Users can only update their own files" ON files;
DROP POLICY IF EXISTS "Users can only delete their own files" ON files;

CREATE POLICY "Users can only see their own files" ON files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own files" ON files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own files" ON files
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own files" ON files
    FOR DELETE USING (auth.uid() = user_id);
