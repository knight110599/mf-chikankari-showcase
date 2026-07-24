-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isNewArrival" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Product_isNewArrival_idx" ON "Product"("isNewArrival");
