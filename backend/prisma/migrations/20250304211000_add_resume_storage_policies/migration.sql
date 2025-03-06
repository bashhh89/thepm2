-- Create resumes bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  TRUE,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for resumes bucket
CREATE POLICY "Give public access to resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');

CREATE POLICY "Enable resume upload for everyone"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Enable resume deletion for owners"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes');

-- Set CORS policy for resumes bucket
UPDATE storage.buckets
SET cors_origins = array['*'],
    cors_methods = array['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    cors_headers = array['*']
WHERE id = 'resumes';