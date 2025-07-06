-- First, let's create the templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'complete_application',
  target_role TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for templates
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone" ON public.templates
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own templates" ON public.templates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own templates" ON public.templates
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own templates" ON public.templates
  FOR DELETE USING (true);

-- Now let's check what columns actually exist in applications table
-- and add missing ones that are essential

-- Add missing columns to applications table if they don't exist
DO $$ 
BEGIN
  -- Add resume column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'applications' AND column_name = 'resume') THEN
    ALTER TABLE public.applications ADD COLUMN resume JSONB DEFAULT '{}';
  END IF;

  -- Add target_role column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'applications' AND column_name = 'target_role') THEN
    ALTER TABLE public.applications ADD COLUMN target_role TEXT DEFAULT '';
  END IF;

  -- Add selected_documents column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'applications' AND column_name = 'selected_documents') THEN
    ALTER TABLE public.applications ADD COLUMN selected_documents JSONB DEFAULT '[]';
  END IF;

  -- Add template_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'applications' AND column_name = 'template_id') THEN
    ALTER TABLE public.applications ADD COLUMN template_id UUID REFERENCES public.templates(id);
  END IF;
END $$;

-- Insert default templates
INSERT INTO public.templates (name, target_role, data, is_default, usage_count) VALUES
(
  'Frontend Engineer Template',
  'frontend-engineer',
  '{
    "layout": "modern",
    "colors": {"primary": "#2563eb", "secondary": "#64748b"},
    "sections": ["summary", "experience", "education", "skills", "projects"]
  }',
  true,
  0
),
(
  'UX Designer Template', 
  'ux-designer',
  '{
    "layout": "creative",
    "colors": {"primary": "#ec4899", "secondary": "#8b5cf6"},
    "sections": ["summary", "experience", "education", "skills", "portfolio"]
  }',
  true,
  0
),
(
  'UX Engineer Template',
  'ux-engineer', 
  '{
    "layout": "hybrid",
    "colors": {"primary": "#8b5cf6", "secondary": "#06b6d4"},
    "sections": ["summary", "experience", "education", "skills", "projects", "portfolio"]
  }',
  true,
  0
),
(
  'Webmaster Template',
  'webmaster',
  '{
    "layout": "professional", 
    "colors": {"primary": "#059669", "secondary": "#64748b"},
    "sections": ["summary", "experience", "education", "skills", "certifications"]
  }',
  true,
  0
)
ON CONFLICT DO NOTHING;

-- Create function to increment template usage
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.templates 
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;
