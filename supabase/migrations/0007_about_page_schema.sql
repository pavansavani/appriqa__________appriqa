-- ==========================================
-- ABOUT PAGE DYNAMIC CONTENT SCHEMA
-- ==========================================

-- 1. About Settings (Key-Value Store for Sections)
CREATE TABLE IF NOT EXISTS public.appriqa_about_settings (
    section_key TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed default empty data so rows always exist for updates
INSERT INTO public.appriqa_about_settings (section_key, data)
VALUES 
    ('hero', '{}'),
    ('who_we_are', '{}'),
    ('story', '[]'),
    ('mission_vision', '{}'),
    ('what_we_build', '[]'),
    ('work_process', '[]'),
    ('why_choose_us', '[]'),
    ('technologies', '[]'),
    ('industries', '[]'),
    ('values', '[]'),
    ('cta', '{}'),
    ('seo', '{}')
ON CONFLICT (section_key) DO NOTHING;

-- 2. Team Members
CREATE TABLE IF NOT EXISTS public.appriqa_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    linkedin_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Milestones
CREATE TABLE IF NOT EXISTS public.appriqa_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Partners
CREATE TABLE IF NOT EXISTS public.appriqa_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We are reusing `appriqa_showcase` for the Inside Appriqa Gallery.

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS
ALTER TABLE public.appriqa_about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appriqa_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appriqa_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appriqa_partners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all About page content
CREATE POLICY "Public can read about settings" ON public.appriqa_about_settings FOR SELECT USING (true);
CREATE POLICY "Public can read team members" ON public.appriqa_team_members FOR SELECT USING (true);
CREATE POLICY "Public can read milestones" ON public.appriqa_milestones FOR SELECT USING (true);
CREATE POLICY "Public can read partners" ON public.appriqa_partners FOR SELECT USING (true);

-- Allow authenticated admins to do everything (Assuming role-based access is handled by the API, 
-- but we can add basic auth checks if needed. For now, allow authenticated users or rely on API server).
CREATE POLICY "Authenticated users can manage about settings" ON public.appriqa_about_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage team members" ON public.appriqa_team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage milestones" ON public.appriqa_milestones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage partners" ON public.appriqa_partners FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- TRIGGERS: UPDATED_AT
-- ==========================================
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT unnest(ARRAY['appriqa_about_settings', 'appriqa_team_members', 'appriqa_milestones', 'appriqa_partners'])
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END $$;
