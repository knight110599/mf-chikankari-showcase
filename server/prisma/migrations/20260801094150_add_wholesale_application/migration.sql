-- CreateEnum
CREATE TYPE "WholesaleApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "WholesaleApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT,
    "businessPhone" TEXT,
    "businessEmail" TEXT,
    "gstNumber" TEXT,
    "panNumber" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "expectedMonthlyOrderValue" INTEGER,
    "notes" TEXT,
    "status" "WholesaleApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WholesaleApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WholesaleApplication_userId_key" ON "WholesaleApplication"("userId");

-- CreateIndex
CREATE INDEX "WholesaleApplication_status_idx" ON "WholesaleApplication"("status");

-- CreateIndex
CREATE INDEX "WholesaleApplication_createdAt_idx" ON "WholesaleApplication"("createdAt");

-- CreateIndex
CREATE INDEX "WholesaleApplication_businessName_idx" ON "WholesaleApplication"("businessName");

-- CreateIndex
CREATE INDEX "WholesaleApplication_gstNumber_idx" ON "WholesaleApplication"("gstNumber");

-- AddForeignKey
ALTER TABLE "WholesaleApplication" ADD CONSTRAINT "WholesaleApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
