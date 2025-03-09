-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Tenant table
CREATE TABLE "Tenant" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL UNIQUE,
    "logo" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "features" JSONB NOT NULL DEFAULT '{}',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add tenant ID to existing tables
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tenantId" UUID REFERENCES "Tenant"("id");
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "tenantId" UUID REFERENCES "Tenant"("id");
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "tenantId" UUID REFERENCES "Tenant"("id");
ALTER TABLE "Candidate" ADD COLUMN IF NOT EXISTS "tenantId" UUID REFERENCES "Tenant"("id");
ALTER TABLE "JobApplication" ADD COLUMN IF NOT EXISTS "tenantId" UUID REFERENCES "Tenant"("id");

-- Create indexes for tenant filtering
CREATE INDEX IF NOT EXISTS "User_tenantId_idx" ON "User"("tenantId");
CREATE INDEX IF NOT EXISTS "Company_tenantId_idx" ON "Company"("tenantId");
CREATE INDEX IF NOT EXISTS "Job_tenantId_idx" ON "Job"("tenantId");
CREATE INDEX IF NOT EXISTS "Candidate_tenantId_idx" ON "Candidate"("tenantId");
CREATE INDEX IF NOT EXISTS "JobApplication_tenantId_idx" ON "JobApplication"("tenantId");

-- Add Row Level Security (RLS) policies
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Candidate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JobApplication" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "tenant_isolation_policy" ON "User" 
    USING (tenantId::text = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_policy" ON "Company" 
    USING (tenantId::text = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_policy" ON "Job" 
    USING (tenantId::text = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_policy" ON "Candidate" 
    USING (tenantId::text = current_setting('app.current_tenant_id', true));

CREATE POLICY "tenant_isolation_policy" ON "JobApplication" 
    USING (tenantId::text = current_setting('app.current_tenant_id', true));