// Migration helper for adding isActive fields and indexes
// This should be run as a Prisma migration

export const migrationSQL = `
-- Add isActive columns to existing tables
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Update existing records to be active
UPDATE "User" SET "isActive" = true WHERE "isActive" IS NULL;
UPDATE "Property" SET "isActive" = true WHERE "isActive" IS NULL;
UPDATE "Tenant" SET "isActive" = true WHERE "isActive" IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "User_phone_idx" ON "User"("phone");
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_isActive_idx" ON "User"("isActive");

CREATE INDEX IF NOT EXISTS "Property_landlordId_idx" ON "Property"("landlordId");
CREATE INDEX IF NOT EXISTS "Property_isActive_idx" ON "Property"("isActive");
CREATE INDEX IF NOT EXISTS "Property_name_idx" ON "Property"("name");
CREATE INDEX IF NOT EXISTS "Property_landlordId_isActive_idx" ON "Property"("landlordId", "isActive");

CREATE INDEX IF NOT EXISTS "Tenant_landlordId_idx" ON "Tenant"("landlordId");
CREATE INDEX IF NOT EXISTS "Tenant_propertyId_idx" ON "Tenant"("propertyId");
CREATE INDEX IF NOT EXISTS "Tenant_phone_idx" ON "Tenant"("phone");
CREATE INDEX IF NOT EXISTS "Tenant_isActive_idx" ON "Tenant"("isActive");
CREATE INDEX IF NOT EXISTS "Tenant_landlordId_isActive_idx" ON "Tenant"("landlordId", "isActive");
CREATE INDEX IF NOT EXISTS "Tenant_propertyId_isActive_idx" ON "Tenant"("propertyId", "isActive");

CREATE INDEX IF NOT EXISTS "Payment_landlordId_idx" ON "Payment"("landlordId");
CREATE INDEX IF NOT EXISTS "Payment_tenantId_idx" ON "Payment"("tenantId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");
CREATE INDEX IF NOT EXISTS "Payment_paidAt_idx" ON "Payment"("paidAt");
CREATE INDEX IF NOT EXISTS "Payment_mpesaReceipt_idx" ON "Payment"("mpesaReceipt");
CREATE INDEX IF NOT EXISTS "Payment_phoneNumber_idx" ON "Payment"("phoneNumber");
CREATE INDEX IF NOT EXISTS "Payment_landlordId_status_idx" ON "Payment"("landlordId", "status");
CREATE INDEX IF NOT EXISTS "Payment_tenantId_status_idx" ON "Payment"("tenantId", "status");
CREATE INDEX IF NOT EXISTS "Payment_status_paidAt_idx" ON "Payment"("status", "paidAt");
`;
