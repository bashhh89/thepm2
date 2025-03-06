import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzqythwfrmjakhvmopyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXl0aHdmcm1qYWtodm1vcHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTkwMDQsImV4cCI6MjA1NjU5NTAwNH0.QZRgjjtxLlXsH-6U_bGDb62TfZvtkyIycM1LPapjZ28';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize storage bucket for resumes with retry logic
export const initializeStorage = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase
        .storage
        .listBuckets();

      if (listError) throw listError;

      const resumesBucket = buckets?.find(bucket => bucket.name === 'resumes');
      
      if (!resumesBucket) {
        // Create the bucket if it doesn't exist
        const { data, error: createError } = await supabase
          .storage
          .createBucket('resumes', {
            public: false, // Keep private for security
            fileSizeLimit: 5242880, // 5MB limit
            allowedMimeTypes: [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]
          });

        if (createError) throw createError;
        console.log('Created resumes storage bucket');
      }

      return true;
    } catch (error) {
      console.error(`Storage initialization attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        throw error; // Throw on final retry
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    error: error?.message || error?.error_description || 'An unknown error occurred'
  };
};