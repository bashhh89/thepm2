-- First, clean up any existing policies
DROP POLICY IF EXISTS "resumes_select" ON storage.objects;
DROP POLICY IF EXISTS "resumes_insert" ON storage.objects;
DROP POLICY IF EXISTS "resumes_delete" ON storage.objects;

-- Create the resumes bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create the storage policies
CREATE POLICY "resumes_select" ON storage.objects 
FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "resumes_insert" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "resumes_delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'resumes');