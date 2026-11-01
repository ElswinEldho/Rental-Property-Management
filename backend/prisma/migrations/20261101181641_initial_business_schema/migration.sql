-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "passwordHash" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" UUID NOT NULL,
    "roleId" VARCHAR(50) NOT NULL,
    "assignedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "tokenHash" VARCHAR(255) NOT NULL,
    "generation" INTEGER NOT NULL DEFAULT 1,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "revokedAt" TIMESTAMPTZ,
    "replacedByTokenHash" VARCHAR(255),
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(255),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "addressLine1" VARCHAR(255) NOT NULL,
    "addressLine2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "stateProvince" VARCHAR(100) NOT NULL,
    "postalCode" VARCHAR(30) NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'India',
    "upiId" VARCHAR(100),
    "upiPayeeName" VARCHAR(150),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_units" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "unitNumber" VARCHAR(50) NOT NULL,
    "floor" INTEGER,
    "unitType" VARCHAR(50) NOT NULL,
    "baseRentAmount" DECIMAL(12,2) NOT NULL,
    "occupancyStatus" VARCHAR(30) NOT NULL DEFAULT 'VACANT',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "rental_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "nationalIdNumber" VARCHAR(100),
    "nationalIdType" VARCHAR(50),
    "emergencyContactName" VARCHAR(150),
    "emergencyContactPhone" VARCHAR(30),
    "occupation" VARCHAR(100),
    "invitationStatus" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "invitationToken" VARCHAR(255),
    "invitationSentAt" TIMESTAMPTZ,
    "invitationExpiresAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenancy_agreements" (
    "id" UUID NOT NULL,
    "agreementNumber" VARCHAR(100) NOT NULL,
    "rentalUnitId" UUID NOT NULL,
    "primaryTenantId" UUID NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "monthlyRentAmount" DECIMAL(12,2) NOT NULL,
    "fixedWaterCharge" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "cautionDepositAmount" DECIMAL(12,2) NOT NULL,
    "billingCycleDay" INTEGER NOT NULL DEFAULT 1,
    "paymentDueDays" INTEGER NOT NULL DEFAULT 10,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "terminationDate" DATE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tenancy_agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenancy_members" (
    "id" UUID NOT NULL,
    "tenancyId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "relationship" VARCHAR(50) NOT NULL,
    "joinedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenancy_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "move_out_settlements" (
    "id" UUID NOT NULL,
    "tenancyId" UUID NOT NULL,
    "vacatingDate" DATE NOT NULL,
    "finalElectricityReadingId" UUID NOT NULL,
    "depositReceivedTotal" DECIMAL(12,2) NOT NULL,
    "rentArrearsDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "electricityDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "waterDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "damageDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "otherDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "totalDeductionsAmount" DECIMAL(12,2) NOT NULL,
    "refundPayableAmount" DECIMAL(12,2) NOT NULL,
    "actualRefundedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "remainingRefundDue" DECIMAL(12,2) NOT NULL,
    "settlementStatus" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    "settledAt" TIMESTAMPTZ,
    "approvedBy" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "move_out_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electricity_tariffs" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "ratePerUnit" DECIMAL(8,4) NOT NULL,
    "fixedCharge" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "effectiveFrom" DATE NOT NULL,
    "effectiveTo" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "electricity_tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electricity_meters" (
    "id" UUID NOT NULL,
    "rentalUnitId" UUID NOT NULL,
    "meterNumber" VARCHAR(100) NOT NULL,
    "installationDate" DATE NOT NULL,
    "initialReading" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "electricity_meters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electricity_readings" (
    "id" UUID NOT NULL,
    "meterId" UUID NOT NULL,
    "tariffId" UUID NOT NULL,
    "readingDate" DATE NOT NULL,
    "readingValue" DECIMAL(10,2) NOT NULL,
    "previousReadingValue" DECIMAL(10,2) NOT NULL,
    "consumptionUnits" DECIMAL(10,2) NOT NULL,
    "tariffRateApplied" DECIMAL(8,4) NOT NULL,
    "calculatedCharge" DECIMAL(12,2) NOT NULL,
    "recordedBy" UUID NOT NULL,
    "proofImageUrl" VARCHAR(500),
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "electricity_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_bills" (
    "id" UUID NOT NULL,
    "billNumber" VARCHAR(100) NOT NULL,
    "tenancyId" UUID NOT NULL,
    "billingPeriod" VARCHAR(7) NOT NULL,
    "issueDate" DATE NOT NULL,
    "dueDate" DATE NOT NULL,
    "rentAmount" DECIMAL(12,2) NOT NULL,
    "waterAmount" DECIMAL(12,2) NOT NULL,
    "electricityAmount" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "balanceAmount" DECIMAL(12,2) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'GENERATED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "monthly_bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_line_items" (
    "id" UUID NOT NULL,
    "billId" UUID NOT NULL,
    "itemType" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "balanceAmount" DECIMAL(12,2) NOT NULL,
    "allocationPriority" INTEGER NOT NULL,
    "settlementStatus" VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bill_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upi_payment_requests" (
    "id" UUID NOT NULL,
    "tenancyId" UUID NOT NULL,
    "requestedAmount" DECIMAL(12,2) NOT NULL,
    "upiReferenceId" VARCHAR(100) NOT NULL,
    "upiUri" TEXT NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "upi_payment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_submissions" (
    "id" UUID NOT NULL,
    "tenancyId" UUID NOT NULL,
    "upiRequestId" UUID,
    "requestedAmount" DECIMAL(12,2) NOT NULL,
    "claimedAmount" DECIMAL(12,2) NOT NULL,
    "upiReferenceNumber" VARCHAR(100) NOT NULL,
    "proofFileUrl" VARCHAR(500) NOT NULL,
    "proofFileName" VARCHAR(255) NOT NULL,
    "proofFileSize" INTEGER NOT NULL,
    "proofMimeType" VARCHAR(100) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "amountMismatchDetected" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMPTZ,
    "reviewedBy" UUID,
    "adminVerifiedAmount" DECIMAL(12,2),
    "rejectionReason" TEXT,
    "notes" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upi_transaction_references" (
    "id" UUID NOT NULL,
    "utrNumber" VARCHAR(100) NOT NULL,
    "submissionId" UUID,
    "paymentId" UUID,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "registeredAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMPTZ,

    CONSTRAINT "upi_transaction_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "paymentReference" VARCHAR(100) NOT NULL,
    "tenancyId" UUID NOT NULL,
    "submissionId" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "unallocatedAdvanceAmount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "paymentMethod" VARCHAR(50) NOT NULL,
    "upiUtrNumber" VARCHAR(100),
    "isOffline" BOOLEAN NOT NULL DEFAULT false,
    "paymentStatus" VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    "paymentDate" TIMESTAMPTZ NOT NULL,
    "verifiedBy" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_allocations" (
    "id" UUID NOT NULL,
    "paymentId" UUID NOT NULL,
    "billId" UUID NOT NULL,
    "lineItemId" UUID NOT NULL,
    "allocatedAmount" DECIMAL(12,2) NOT NULL,
    "allocationOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_deposits" (
    "id" UUID NOT NULL,
    "tenancyId" UUID NOT NULL,
    "agreedAmount" DECIMAL(12,2) NOT NULL,
    "receivedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "deductedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "refundedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "currentBalance" DECIMAL(12,2) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "security_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_deposit_receipts" (
    "id" UUID NOT NULL,
    "securityDepositId" UUID NOT NULL,
    "receiptNumber" VARCHAR(100) NOT NULL,
    "receivedAmount" DECIMAL(12,2) NOT NULL,
    "paymentMethod" VARCHAR(50) NOT NULL,
    "transactionReference" VARCHAR(100),
    "receiptDate" DATE NOT NULL,
    "recordedBy" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_deposit_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit_deductions" (
    "id" UUID NOT NULL,
    "securityDepositId" UUID NOT NULL,
    "moveOutSettlementId" UUID NOT NULL,
    "deductionType" VARCHAR(50) NOT NULL,
    "deductionAmount" DECIMAL(12,2) NOT NULL,
    "billId" UUID,
    "billLineItemId" UUID,
    "deductionStatus" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "reason" VARCHAR(255) NOT NULL,
    "deductionDate" DATE NOT NULL,
    "approvedBy" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deposit_deductions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit_refunds" (
    "id" UUID NOT NULL,
    "securityDepositId" UUID NOT NULL,
    "moveOutSettlementId" UUID NOT NULL,
    "refundAmount" DECIMAL(12,2) NOT NULL,
    "refundMethod" VARCHAR(50) NOT NULL,
    "transactionReference" VARCHAR(100) NOT NULL,
    "recipientBankDetails" TEXT,
    "refundDate" DATE NOT NULL,
    "processedBy" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deposit_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "expenseDate" DATE NOT NULL,
    "vendorName" VARCHAR(200),
    "invoiceUrl" VARCHAR(500),
    "recordedBy" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "recipientId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "channel" VARCHAR(30) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMPTZ,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actorId" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" UUID NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(255),
    "previousState" JSONB,
    "newState" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL,
    "aggregateType" VARCHAR(50) NOT NULL,
    "aggregateId" UUID NOT NULL,
    "eventType" VARCHAR(100) NOT NULL,
    "payload" JSONB NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMPTZ,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_family" ON "refresh_tokens"("familyId");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_lookup" ON "refresh_tokens"("tokenHash", "isRevoked");

-- CreateIndex
CREATE UNIQUE INDEX "rental_units_propertyId_unitNumber_key" ON "rental_units"("propertyId", "unitNumber");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_userId_key" ON "tenants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_email_key" ON "tenants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_phone_key" ON "tenants"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_invitationToken_key" ON "tenants"("invitationToken");

-- CreateIndex
CREATE UNIQUE INDEX "tenancy_agreements_agreementNumber_key" ON "tenancy_agreements"("agreementNumber");

-- CreateIndex
CREATE UNIQUE INDEX "tenancy_members_tenancyId_tenantId_key" ON "tenancy_members"("tenancyId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "move_out_settlements_tenancyId_key" ON "move_out_settlements"("tenancyId");

-- CreateIndex
CREATE UNIQUE INDEX "electricity_meters_rentalUnitId_key" ON "electricity_meters"("rentalUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "electricity_meters_meterNumber_key" ON "electricity_meters"("meterNumber");

-- CreateIndex
CREATE UNIQUE INDEX "electricity_readings_meterId_readingDate_key" ON "electricity_readings"("meterId", "readingDate");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_bills_billNumber_key" ON "monthly_bills"("billNumber");

-- CreateIndex
CREATE INDEX "idx_monthly_bills_tenancy_status" ON "monthly_bills"("tenancyId", "status");

-- CreateIndex
CREATE INDEX "idx_monthly_bills_overdue" ON "monthly_bills"("status", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_bills_tenancyId_billingPeriod_key" ON "monthly_bills"("tenancyId", "billingPeriod");

-- CreateIndex
CREATE INDEX "idx_bill_line_items_bill_priority" ON "bill_line_items"("billId", "allocationPriority");

-- CreateIndex
CREATE UNIQUE INDEX "bill_line_items_billId_id_key" ON "bill_line_items"("billId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "upi_payment_requests_upiReferenceId_key" ON "upi_payment_requests"("upiReferenceId");

-- CreateIndex
CREATE INDEX "idx_upi_requests_tenancy" ON "upi_payment_requests"("tenancyId", "status");

-- CreateIndex
CREATE INDEX "idx_payment_submissions_review_queue" ON "payment_submissions"("status", "submittedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "upi_transaction_references_utrNumber_key" ON "upi_transaction_references"("utrNumber");

-- CreateIndex
CREATE UNIQUE INDEX "upi_transaction_references_submissionId_key" ON "upi_transaction_references"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "upi_transaction_references_paymentId_key" ON "upi_transaction_references"("paymentId");

-- CreateIndex
CREATE INDEX "idx_upi_registry_lookup" ON "upi_transaction_references"("utrNumber", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentReference_key" ON "payments"("paymentReference");

-- CreateIndex
CREATE UNIQUE INDEX "payments_submissionId_key" ON "payments"("submissionId");

-- CreateIndex
CREATE INDEX "idx_allocations_payment" ON "payment_allocations"("paymentId");

-- CreateIndex
CREATE INDEX "idx_allocations_bill" ON "payment_allocations"("billId");

-- CreateIndex
CREATE UNIQUE INDEX "security_deposits_tenancyId_key" ON "security_deposits"("tenancyId");

-- CreateIndex
CREATE UNIQUE INDEX "security_deposit_receipts_receiptNumber_key" ON "security_deposit_receipts"("receiptNumber");

-- CreateIndex
CREATE INDEX "idx_deposit_receipts_deposit_id" ON "security_deposit_receipts"("securityDepositId");

-- CreateIndex
CREATE INDEX "idx_deposit_deductions_settlement" ON "deposit_deductions"("moveOutSettlementId", "deductionStatus");

-- CreateIndex
CREATE INDEX "idx_deposit_deductions_bill" ON "deposit_deductions"("billId");

-- CreateIndex
CREATE INDEX "idx_deposit_refunds_settlement" ON "deposit_refunds"("moveOutSettlementId");

-- CreateIndex
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs"("entityType", "entityId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_outbox_events_polling" ON "outbox_events"("status", "createdAt" ASC);

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_units" ADD CONSTRAINT "rental_units_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenancy_agreements" ADD CONSTRAINT "tenancy_agreements_rentalUnitId_fkey" FOREIGN KEY ("rentalUnitId") REFERENCES "rental_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenancy_agreements" ADD CONSTRAINT "tenancy_agreements_primaryTenantId_fkey" FOREIGN KEY ("primaryTenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenancy_members" ADD CONSTRAINT "tenancy_members_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "tenancy_agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenancy_members" ADD CONSTRAINT "tenancy_members_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move_out_settlements" ADD CONSTRAINT "move_out_settlements_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move_out_settlements" ADD CONSTRAINT "move_out_settlements_finalElectricityReadingId_fkey" FOREIGN KEY ("finalElectricityReadingId") REFERENCES "electricity_readings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move_out_settlements" ADD CONSTRAINT "move_out_settlements_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electricity_tariffs" ADD CONSTRAINT "electricity_tariffs_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electricity_meters" ADD CONSTRAINT "electricity_meters_rentalUnitId_fkey" FOREIGN KEY ("rentalUnitId") REFERENCES "rental_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electricity_readings" ADD CONSTRAINT "electricity_readings_meterId_fkey" FOREIGN KEY ("meterId") REFERENCES "electricity_meters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electricity_readings" ADD CONSTRAINT "electricity_readings_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "electricity_tariffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electricity_readings" ADD CONSTRAINT "electricity_readings_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_bills" ADD CONSTRAINT "monthly_bills_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_line_items" ADD CONSTRAINT "bill_line_items_billId_fkey" FOREIGN KEY ("billId") REFERENCES "monthly_bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upi_payment_requests" ADD CONSTRAINT "upi_payment_requests_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_submissions" ADD CONSTRAINT "payment_submissions_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_submissions" ADD CONSTRAINT "payment_submissions_upiRequestId_fkey" FOREIGN KEY ("upiRequestId") REFERENCES "upi_payment_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_submissions" ADD CONSTRAINT "payment_submissions_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upi_transaction_references" ADD CONSTRAINT "upi_transaction_references_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "payment_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "payment_submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_billId_fkey" FOREIGN KEY ("billId") REFERENCES "monthly_bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "bill_line_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_deposits" ADD CONSTRAINT "security_deposits_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_deposit_receipts" ADD CONSTRAINT "security_deposit_receipts_securityDepositId_fkey" FOREIGN KEY ("securityDepositId") REFERENCES "security_deposits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_deposit_receipts" ADD CONSTRAINT "security_deposit_receipts_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_deductions" ADD CONSTRAINT "deposit_deductions_securityDepositId_fkey" FOREIGN KEY ("securityDepositId") REFERENCES "security_deposits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_deductions" ADD CONSTRAINT "deposit_deductions_moveOutSettlementId_fkey" FOREIGN KEY ("moveOutSettlementId") REFERENCES "move_out_settlements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_deductions" ADD CONSTRAINT "deposit_deductions_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_deductions" ADD CONSTRAINT "deposit_deductions_billId_fkey" FOREIGN KEY ("billId") REFERENCES "monthly_bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_deductions" ADD CONSTRAINT "deposit_deductions_billLineItemId_fkey" FOREIGN KEY ("billLineItemId") REFERENCES "bill_line_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_refunds" ADD CONSTRAINT "deposit_refunds_securityDepositId_fkey" FOREIGN KEY ("securityDepositId") REFERENCES "security_deposits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_refunds" ADD CONSTRAINT "deposit_refunds_moveOutSettlementId_fkey" FOREIGN KEY ("moveOutSettlementId") REFERENCES "move_out_settlements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_refunds" ADD CONSTRAINT "deposit_refunds_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- =============================================================================
-- CUSTOM SQL: Constraints Prisma Cannot Represent Natively
-- All statements below are purely additive.
-- No tables are dropped, truncated, or reset.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PARTIAL UNIQUE INDEX: Only one ACTIVE lease per rental unit at any time
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX "uq_unit_single_active_tenancy"
ON "tenancy_agreements" ("rentalUnitId")
WHERE "status" = 'ACTIVE';

-- ---------------------------------------------------------------------------
-- 2. PARTIAL UNIQUE INDEX: UTR uniqueness across approved payments (non-null only)
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX "uq_payments_upi_utr"
ON "payments" ("upiUtrNumber")
WHERE "upiUtrNumber" IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 3. BTREE_GIST EXTENSION + NON-OVERLAPPING TARIFF EXCLUSION CONSTRAINT
--    Prevents two tariffs for the same property from having overlapping date ranges.
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "electricity_tariffs"
ADD CONSTRAINT "ex_tariffs_no_overlap"
EXCLUDE USING gist (
    "propertyId" WITH =,
    daterange("effectiveFrom", COALESCE("effectiveTo", 'infinity'::date), '[)') WITH &&
);

-- ---------------------------------------------------------------------------
-- 4. DEFERRABLE COMPOSITE FOREIGN KEY: primary_tenant_id must exist in tenancy_members
--    Circular dependency resolved by DEFERRABLE INITIALLY DEFERRED — both rows
--    can be inserted in the same transaction before the constraint is checked.
-- ---------------------------------------------------------------------------
ALTER TABLE "tenancy_agreements"
ADD CONSTRAINT "fk_tenancy_primary_member"
FOREIGN KEY ("id", "primaryTenantId")
REFERENCES "tenancy_members" ("tenancyId", "tenantId")
DEFERRABLE INITIALLY DEFERRED;

-- ---------------------------------------------------------------------------
-- 5. COMPOSITE FOREIGN KEY: payment_allocations -> bill_line_items(billId, id)
--    Guarantees the allocated line item strictly belongs to the stated bill.
-- ---------------------------------------------------------------------------
ALTER TABLE "payment_allocations"
ADD CONSTRAINT "fk_allocation_bill_line"
FOREIGN KEY ("billId", "lineItemId")
REFERENCES "bill_line_items" ("billId", "id")
ON DELETE RESTRICT;

-- ---------------------------------------------------------------------------
-- 6. COMPOSITE FOREIGN KEY: deposit_deductions -> bill_line_items(billId, id)
--    Nullable columns — constraint only enforced when both columns are non-null.
--    NOT VALID + VALIDATE allows safe application without blocking the migration.
-- ---------------------------------------------------------------------------
ALTER TABLE "deposit_deductions"
ADD CONSTRAINT "fk_deduction_bill_line"
FOREIGN KEY ("billId", "billLineItemId")
REFERENCES "bill_line_items" ("billId", "id")
ON DELETE RESTRICT
NOT VALID;

ALTER TABLE "deposit_deductions" VALIDATE CONSTRAINT "fk_deduction_bill_line";

-- ---------------------------------------------------------------------------
-- 7. FK: upi_transaction_references -> payments
--    Added after both tables exist to resolve forward reference.
-- ---------------------------------------------------------------------------
ALTER TABLE "upi_transaction_references"
ADD CONSTRAINT "fk_registry_payment"
FOREIGN KEY ("paymentId")
REFERENCES "payments" ("id")
ON DELETE RESTRICT;

-- ---------------------------------------------------------------------------
-- 8. CHECK CONSTRAINTS: Mathematical & business invariants
-- ---------------------------------------------------------------------------

-- rental_units
ALTER TABLE "rental_units"
ADD CONSTRAINT "chk_unit_base_rent"
CHECK ("baseRentAmount" >= 0.00);

-- tenancy_agreements
ALTER TABLE "tenancy_agreements"
ADD CONSTRAINT "chk_tenancy_dates"
CHECK ("endDate" >= "startDate");

ALTER TABLE "tenancy_agreements"
ADD CONSTRAINT "chk_billing_day"
CHECK ("billingCycleDay" BETWEEN 1 AND 28);

ALTER TABLE "tenancy_agreements"
ADD CONSTRAINT "chk_financial_terms"
CHECK (
    "monthlyRentAmount"    >= 0.00 AND
    "fixedWaterCharge"     >= 0.00 AND
    "cautionDepositAmount" >= 0.00
);

-- move_out_settlements
ALTER TABLE "move_out_settlements"
ADD CONSTRAINT "chk_settlement_totals"
CHECK (
    "totalDeductionsAmount" = (
        "rentArrearsDeductions" + "electricityDeductions" +
        "waterDeductions" + "damageDeductions" + "otherDeductions"
    ) AND
    "totalDeductionsAmount" <= "depositReceivedTotal"                            AND
    "refundPayableAmount"   = ("depositReceivedTotal" - "totalDeductionsAmount") AND
    "remainingRefundDue"    = ("refundPayableAmount"  - "actualRefundedAmount")  AND
    "actualRefundedAmount"  <= "refundPayableAmount"
);

-- electricity_tariffs
ALTER TABLE "electricity_tariffs"
ADD CONSTRAINT "chk_tariff_dates"
CHECK ("effectiveTo" IS NULL OR "effectiveTo" > "effectiveFrom");

ALTER TABLE "electricity_tariffs"
ADD CONSTRAINT "chk_tariff_rates"
CHECK ("ratePerUnit" > 0.0000 AND "fixedCharge" >= 0.00);

-- electricity_meters
ALTER TABLE "electricity_meters"
ADD CONSTRAINT "chk_meter_initial_reading"
CHECK ("initialReading" >= 0.00);

-- electricity_readings
ALTER TABLE "electricity_readings"
ADD CONSTRAINT "chk_reading_sequence"
CHECK ("readingValue" >= "previousReadingValue");

ALTER TABLE "electricity_readings"
ADD CONSTRAINT "chk_consumption_match"
CHECK ("consumptionUnits" = ("readingValue" - "previousReadingValue"));

-- monthly_bills
ALTER TABLE "monthly_bills"
ADD CONSTRAINT "chk_bill_dates"
CHECK ("dueDate" >= "issueDate");

ALTER TABLE "monthly_bills"
ADD CONSTRAINT "chk_bill_amounts"
CHECK (
    "totalAmount"   = ("rentAmount" + "waterAmount" + "electricityAmount") AND
    "paidAmount"    >= 0.00                                                AND
    "paidAmount"    <= "totalAmount"                                       AND
    "balanceAmount" = ("totalAmount" - "paidAmount")
);

-- bill_line_items
ALTER TABLE "bill_line_items"
ADD CONSTRAINT "chk_line_amounts"
CHECK (
    "amount"        >= 0.00                              AND
    "paidAmount"    >= 0.00                              AND
    "paidAmount"    <= "amount"                          AND
    "balanceAmount" = ("amount" - "paidAmount")          AND
    (
        ("settlementStatus" = 'PAID'           AND "balanceAmount" = 0.00)                             OR
        ("settlementStatus" = 'PARTIALLY_PAID' AND "balanceAmount" > 0.00 AND "paidAmount" > 0.00)    OR
        ("settlementStatus" = 'UNPAID'         AND "paidAmount" = 0.00)
    )
);

-- upi_payment_requests
ALTER TABLE "upi_payment_requests"
ADD CONSTRAINT "chk_requested_amount_positive"
CHECK ("requestedAmount" > 0.00);

-- payment_submissions
ALTER TABLE "payment_submissions"
ADD CONSTRAINT "chk_claimed_amount_positive"
CHECK ("claimedAmount" > 0.00);

ALTER TABLE "payment_submissions"
ADD CONSTRAINT "chk_rejection_reason"
CHECK ("status" != 'REJECTED' OR "rejectionReason" IS NOT NULL);

-- payments
ALTER TABLE "payments"
ADD CONSTRAINT "chk_payment_amount_positive"
CHECK ("amount" > 0.00);

ALTER TABLE "payments"
ADD CONSTRAINT "chk_advance_amount"
CHECK (
    "unallocatedAdvanceAmount" >= 0.00 AND
    "unallocatedAdvanceAmount" <= "amount"
);

-- payment_allocations
ALTER TABLE "payment_allocations"
ADD CONSTRAINT "chk_alloc_amount_positive"
CHECK ("allocatedAmount" > 0.00);

-- security_deposits (escrow liability math invariant)
ALTER TABLE "security_deposits"
ADD CONSTRAINT "chk_deposit_math"
CHECK (
    "agreedAmount"   >= 0.00                                                              AND
    "receivedAmount" >= 0.00                                                              AND
    "deductedAmount" >= 0.00                                                              AND
    "refundedAmount" >= 0.00                                                              AND
    ("deductedAmount" + "refundedAmount") <= "receivedAmount"                             AND
    "currentBalance" = ("receivedAmount" - "deductedAmount" - "refundedAmount")
);

-- security_deposit_receipts
ALTER TABLE "security_deposit_receipts"
ADD CONSTRAINT "chk_deposit_receipt_amount"
CHECK ("receivedAmount" > 0.00);

-- deposit_deductions
ALTER TABLE "deposit_deductions"
ADD CONSTRAINT "chk_deduction_amount_positive"
CHECK ("deductionAmount" > 0.00);

-- deposit_refunds
ALTER TABLE "deposit_refunds"
ADD CONSTRAINT "chk_refund_amount_positive"
CHECK ("refundAmount" > 0.00);

-- expenses
ALTER TABLE "expenses"
ADD CONSTRAINT "chk_expense_amount"
CHECK ("amount" > 0.00);
