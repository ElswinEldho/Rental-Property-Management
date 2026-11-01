-- =============================================================================
-- Migration: Custom Composite & Deferrable Foreign Keys
-- These constraints are not representable in Prisma schema.prisma natively.
-- Applied separately to avoid shadow database drift detection.
-- =============================================================================

-- 1. DEFERRABLE COMPOSITE FK: primary_tenant_id must be in tenancy_members
--    Enables circular insertion within a single transaction.
ALTER TABLE "tenancy_agreements"
ADD CONSTRAINT "fk_tenancy_primary_member"
FOREIGN KEY ("id", "primaryTenantId")
REFERENCES "tenancy_members" ("tenancyId", "tenantId")
DEFERRABLE INITIALLY DEFERRED;

-- 2. COMPOSITE FK: payment_allocations -> bill_line_items(billId, id)
ALTER TABLE "payment_allocations"
ADD CONSTRAINT "fk_allocation_bill_line"
FOREIGN KEY ("billId", "lineItemId")
REFERENCES "bill_line_items" ("billId", "id")
ON DELETE RESTRICT;

-- 3. COMPOSITE FK: deposit_deductions -> bill_line_items(billId, id)
--    NOT VALID allows null rows to exist; VALIDATE checks non-null rows.
ALTER TABLE "deposit_deductions"
ADD CONSTRAINT "fk_deduction_bill_line"
FOREIGN KEY ("billId", "billLineItemId")
REFERENCES "bill_line_items" ("billId", "id")
ON DELETE RESTRICT
NOT VALID;

ALTER TABLE "deposit_deductions" VALIDATE CONSTRAINT "fk_deduction_bill_line";

-- 4. FK: upi_transaction_references.paymentId -> payments(id)
ALTER TABLE "upi_transaction_references"
ADD CONSTRAINT "fk_registry_payment"
FOREIGN KEY ("paymentId")
REFERENCES "payments" ("id")
ON DELETE RESTRICT;
