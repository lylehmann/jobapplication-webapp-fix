-- Enable the pgcrypto extension to generate random UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create applications table with simplified role fields
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'submitted', 'archived')),
    target_role TEXT DEFAULT 'frontend-engineer' CHECK (target_role IN ('frontend-engineer', 'ux-engineer', 'ux-designer', 'webmaster')),
    personal_info JSONB DEFAULT '{}',
    cover_letter_data JSONB DEFAULT '{}',
    resume_data JSONB DEFAULT '{}',
    projects_data JSONB DEFAULT '[]',
    selected_documents TEXT[] DEFAULT '{}',
    template_id UUID
);

-- Create files table
CREATE TABLE IF NOT EXISTS public.files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT,
    data TEXT, -- Base64 encoded file data for small files
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE
);

-- Create simplified templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('resume', 'cover_letter', 'project', 'complete_application')),
    target_role TEXT NOT NULL CHECK (target_role IN ('frontend-engineer', 'ux-engineer', 'ux-designer', 'webmaster')),
    data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0
);

-- Add foreign key constraint for template_id
ALTER TABLE public.applications 
ADD CONSTRAINT fk_applications_template 
FOREIGN KEY (template_id) REFERENCES public.templates(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_target_role ON public.applications(target_role);
CREATE INDEX IF NOT EXISTS idx_applications_updated_at ON public.applications(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_application_id ON public.files(application_id);
CREATE INDEX IF NOT EXISTS idx_files_type ON public.files(type);
CREATE INDEX IF NOT EXISTS idx_templates_target_role ON public.templates(target_role);
CREATE INDEX IF NOT EXISTS idx_templates_type ON public.templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_is_default ON public.templates(is_default);

-- Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth is required)
CREATE POLICY "Enable all operations for applications" ON public.applications
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for files" ON public.files
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for templates" ON public.templates
    FOR ALL USING (true) WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to increment template usage count
CREATE OR REPLACE FUNCTION increment_template_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.template_id IS NOT NULL AND (OLD.template_id IS NULL OR OLD.template_id != NEW.template_id) THEN
        UPDATE public.templates 
        SET usage_count = usage_count + 1 
        WHERE id = NEW.template_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON public.files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to increment template usage
CREATE TRIGGER increment_template_usage_trigger AFTER INSERT OR UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION increment_template_usage();

-- Insert simplified role-specific templates
INSERT INTO public.templates (name, type, target_role, data, is_default) VALUES
-- Frontend Engineer Template
('Frontend Engineer Template', 'complete_application', 'frontend-engineer', '{
    "layout": "modern",
    "colors": {"primary": "#2563eb", "secondary": "#64748b"},
    "sections": ["header", "summary", "experience", "education", "skills", "projects"],
    "skills": ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Next.js", "Vue.js", "Webpack", "Jest"],
    "summary": "Frontend Engineer with expertise in building responsive web applications using modern JavaScript frameworks and best practices. Experienced in React, TypeScript, and creating exceptional user experiences.",
    "coverLetter": "I am writing to express my strong interest in the Frontend Engineer position at [COMPANY_NAME]. With my extensive experience in React, TypeScript, and modern frontend development, I am excited about the opportunity to contribute to your team''s success. My passion for creating intuitive user interfaces and optimizing web performance aligns perfectly with your company''s mission."
}', true),

-- UX Designer Template
('UX Designer Template', 'complete_application', 'ux-designer', '{
    "layout": "creative",
    "colors": {"primary": "#ec4899", "secondary": "#8b5cf6"},
    "sections": ["header", "summary", "experience", "education", "skills", "portfolio"],
    "skills": ["Figma", "Sketch", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Information Architecture", "Usability Testing", "Design Systems", "User Personas"],
    "summary": "UX Designer with expertise in user research, wireframing, and creating intuitive user experiences for web and mobile applications. Passionate about solving complex user problems through thoughtful design and data-driven decisions.",
    "coverLetter": "I am writing to express my strong interest in the UX Designer position at [COMPANY_NAME]. With my background in user research, wireframing, and creating intuitive user experiences, I am excited about the opportunity to contribute to your design team. My user-centered approach and passion for solving complex problems through design align perfectly with your company''s values."
}', true),

-- UX Engineer Template
('UX Engineer Template', 'complete_application', 'ux-engineer', '{
    "layout": "hybrid",
    "colors": {"primary": "#8b5cf6", "secondary": "#06b6d4"},
    "sections": ["header", "summary", "experience", "education", "skills", "projects", "portfolio"],
    "skills": ["React", "JavaScript", "CSS3", "Figma", "Prototyping", "Design Systems", "Accessibility", "Animation", "User Testing", "Framer"],
    "summary": "UX Engineer bridging design and development with expertise in creating exceptional user experiences through interactive prototypes and design systems. Skilled in both technical implementation and user-centered design principles.",
    "coverLetter": "I am writing to express my strong interest in the UX Engineer position at [COMPANY_NAME]. With my unique blend of design and development skills, I specialize in creating seamless user experiences through interactive prototypes and robust design systems. My ability to translate design concepts into functional code makes me an ideal candidate for this role."
}', true),

-- Webmaster Template
('Webmaster Template', 'complete_application', 'webmaster', '{
    "layout": "professional",
    "colors": {"primary": "#059669", "secondary": "#64748b"},
    "sections": ["header", "summary", "experience", "education", "skills", "certifications"],
    "skills": ["WordPress", "HTML", "CSS", "JavaScript", "SEO", "Google Analytics", "Content Management", "Web Security", "Performance Optimization", "Domain Management"],
    "summary": "Webmaster with expertise in website management, content optimization, SEO, and maintaining robust web presence for organizations. Experienced in WordPress, web security, and performance optimization.",
    "coverLetter": "I am writing to express my strong interest in the Webmaster position at [COMPANY_NAME]. With my comprehensive experience in website management, SEO optimization, and content management systems, I am well-equipped to maintain and enhance your web presence. My technical skills and attention to detail ensure optimal website performance and user experience."
}', true)

ON CONFLICT DO NOTHING;
