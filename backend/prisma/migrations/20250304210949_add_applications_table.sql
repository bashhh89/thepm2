-- First, drop table if it exists
DROP TABLE IF EXISTS public.applications;

-- Create applications table with all required columns
CREATE TABLE public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id),
    user_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    application_data JSONB NOT NULL,
    conversation_history JSONB NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "applications_select" ON public.applications
FOR SELECT USING (true);

CREATE POLICY "applications_insert" ON public.applications
FOR INSERT WITH CHECK (true);

-- Create indexes after table and columns exist
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at);