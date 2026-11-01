-- DropForeignKey
ALTER TABLE "deposit_deductions" DROP CONSTRAINT "fk_deduction_bill_line";

-- DropForeignKey
ALTER TABLE "payment_allocations" DROP CONSTRAINT "fk_allocation_bill_line";

-- DropForeignKey
ALTER TABLE "tenancy_agreements" DROP CONSTRAINT "fk_tenancy_primary_member";

-- DropForeignKey
ALTER TABLE "upi_transaction_references" DROP CONSTRAINT "fk_registry_payment";
