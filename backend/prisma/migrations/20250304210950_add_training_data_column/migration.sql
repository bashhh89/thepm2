-- Add training_data column to jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS training_data TEXT;

-- Create index for improved query performance
CREATE INDEX IF NOT EXISTS idx_jobs_training_data ON public.jobs(training_data);