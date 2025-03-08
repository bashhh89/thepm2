import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzqythwfrmjakhvmopyf.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXl0aHdmcm1qYWtodm1vcHlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTAxOTAwNCwiZXhwIjoyMDU2NTk1MDA0fQ.7wZ_4HjSGDEdVq7Q6u2W1JZnG1jvJL4L-6mUZkHvXWQ';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXl0aHdmcm1qYWtodm1vcHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTkwMDQsImV4cCI6MjA1NjU5NTAwNH0.QZRgjjtxLlXsH-6U_bGDb62TfZvtkyIycM1LPapjZ28';

export const supabase = createClient(supabaseUrl, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  storage: {
    storageBackend: 'file',
    autoInitialize: true,
    retryAttempts: 3,
    retryInterval: 1000
  }
});

export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  db: {
    schema: 'public'
  }
});

// Initialize storage bucket
export const initializeStorage = async () => {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }

    // Create default bucket if it doesn't exist
    if (!buckets.find(b => b.name === 'blog-content')) {
      const { data, error: createError } = await supabaseAdmin.storage.createBucket('blog-content', {
        public: false,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/plain', 'text/markdown'],
        fileSizeLimit: 52428800
      });

      if (createError) throw createError;

      console.log('Blog content bucket created successfully. Required SQL policies (run in SQL editor):');
      console.log(`
        -- Enable RLS for storage buckets
        ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

        -- Service role access policy for buckets
        CREATE POLICY IF NOT EXISTS "Service role bucket access" ON storage.buckets
        TO service_role
        USING (true)
        WITH CHECK (true);

        -- Enable RLS for storage objects
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

        -- Authenticated read access for blog content
        CREATE POLICY IF NOT EXISTS "Authenticated read access" ON storage.objects
        FOR SELECT
        TO authenticated
        USING (bucket_id = 'blog-content');
      `);
    }
    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    throw error;
  }
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    error: error.message || 'An error occurred while connecting to the database',
    status: error.code || 500
  };
};