-- ============================================================
--  Migration: Create templates table + policies
--  Run this once in your Supabase project (SQL Editor or psql)
-- ============================================================

-- 1. Table ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT                        NOT NULL,
  target_role     TEXT                        NOT NULL,          -- e.g. "frontend-engineer"
  is_default      BOOLEAN     DEFAULT FALSE   NOT NULL,          -- templates shipped with the app
  summary         TEXT,
  cover_letter    TEXT,
  skills          JSONB       DEFAULT '[]'   ::jsonb,
  experience_template JSONB   DEFAULT '[]'   ::jsonb,
  projects_template   JSONB   DEFAULT '[]'   ::jsonb,
  usage_count     INTEGER     DEFAULT 0      NOT NULL,
  created_at      TIMESTAMP   WITH TIME ZONE DEFAULT now(),
  updated_at      TIMESTAMP   WITH TIME ZONE DEFAULT now()
);

-- 2. Function to auto-update  `updated_at` ----------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Trigger ----------------------------------------------------------------
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Helper to bump usage counter -------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_template_usage(template_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.templates SET usage_count = usage_count + 1
  WHERE id = template_id;
END;
$$;

-- 5. Row Level Security ------------------------------------------------------
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Allow owners (and unauthenticated read of default templates) ---------------
CREATE POLICY "Users can read public and their own templates"
  ON public.templates FOR SELECT
  USING (
    is_default
    OR auth.role() = 'anon'        -- allow public previews of default templates
    OR auth.uid() = user_id
  );

CREATE POLICY "Users can insert their own templates"
  ON public.templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON public.templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON public.templates FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Useful indexes ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS templates_target_role_idx  ON public.templates(target_role);
CREATE INDEX IF NOT EXISTS templates_usage_count_idx  ON public.templates(usage_count DESC);
CREATE INDEX IF NOT EXISTS templates_updated_at_idx   ON public.templates(updated_at DESC);
